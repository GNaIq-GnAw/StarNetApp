import {adapter} from "./core/adapter.js";
import {
    assertDbName,
    assertIdentifier,
    DEFAULT_OPTIONS,
    escapeSqlValue,
    isSqlValid
} from "./core/utils.js";

/**
 * 从返回行中按原始名或常见大小写变体取值
 * 兼容不同 plus.sqlite 版本对结果 key 的大小写差异
 */
const getField = (row, key) => row[key] ?? row[key.toLowerCase()] ?? row[key.toUpperCase()];

/** 创建全新 SQLite 实例，返回 {open, close, execute, select, page, pageByCursor, initialize, transaction} */
const withInstance = (options = null) => {
    const $options = {...DEFAULT_OPTIONS, ...options};

    // 在途开库 Promise 缓存：并发调用复用同一 Promise，避免重复 openDatabase 竞态
    const opening = new Map();

    // 已打开库的本地登记（判定一律以底层 isOpenDatabase 为准）
    const opened = new Set();

    // 解析库身份：优先方法参数，缺省回落到实例 name 选项；两者皆无则报错
    const resolve = () => {
        const {name, path} = $options;

        assertDbName(name);

        return {
            name,
            key: `${name}@${path}`,
            path: `${path}/${name}.db`
        };
    };

    /** 打开数据库（幂等、并发安全），返回库名 */
    const open = async () => {
        const {name: $name, key, path} = resolve();

        // 以底层为准（跨实例可见）：已打开则直接复用
        if (await adapter.isOpenDatabase({name: $name, path})) {
            opened.add(key);
            return $name;
        }
        // 本地标记残留（库被其他实例 close 过）时作废，重新打开
        opened.delete(key);

        // 复用在途的开库 Promise
        if (opening.has(key)) {
            return opening.get(key);
        }

        const pending = (async () => {
            await adapter.openDatabase({name: $name, path});
            opened.add(key);
            return $name;
        })();

        opening.set(key, pending);

        try {
            return await pending;
        } finally {
            // 开库结束（成功或失败）后释放在途锁
            opening.delete(key);
        }
    };

    /** 关闭数据库 */
    const close = async () => {
        const {name: $name, key, path} = resolve();

        // 等待在途开库完成，避免 close 与 open 竞态
        if (opening.has(key)) {
            try {
                await opening.get(key);
            } catch {
                // 开库失败则无需关闭
            }
        }

        // 库确实没开（以底层为准）则跳过，并清理本地残留标记
        if (!await adapter.isOpenDatabase({name: $name, path})) {
            opened.delete(key);
            return;
        }

        try {
            await adapter.closeDatabase($name);
        } finally {
            // 无论关闭成功与否都清理标记，避免假打开
            opened.delete(key);
        }
    };

    /** 执行写 SQL（支持单条字符串或字符串数组，如建表语句） */
    const execute = async (sql = null) => {
        if (!isSqlValid(sql)) {
            throw new Error("[useSqlite] execute 的 sql 参数不合法：需为非空字符串或非空字符串数组");
        }

        const $dbName = await open();

        return adapter.executeSql({name: $dbName, sql});
    };

    /** 执行查询 SQL（仅支持单条 SELECT，不支持数组） */
    const select = async (sql = null) => {
        if (!isSqlValid(sql) || Array.isArray(sql)) {
            throw new Error("[useSqlite] select 的 sql 参数不合法：仅支持单条 SELECT 语句，不支持数组");
        }

        const $dbName = await open();

        return adapter.selectSql({name: $dbName, sql});
    };

    /**
     * 页码分页：自动追加 LIMIT/OFFSET，以 size+1 探测是否还有下一页
     * @param sql 查询 SQL（不含 LIMIT/OFFSET）
     * @param options 分页参数
     * @param options.page 页码，从 1 开始（默认 1）
     * @param options.size 每页条数（默认 20）
     * @returns {Promise<{rows: Array, hasMore: boolean}>} rows 已截断为 size 条
     */
    const page = async (sql = null, {page: pageNo = 1, size = 20} = {}) => {
        if (!isSqlValid(sql) || Array.isArray(sql)) {
            throw new Error("[useSqlite] page 的 sql 参数不合法：仅支持单条 SELECT 语句，不支持数组");
        }

        const $page = Math.max(1, Math.trunc(Number(pageNo) || 1));
        const $size = Math.max(1, Math.trunc(Number(size) || 20));

        const offset = ($page - 1) * $size;

        const $sql = `${String(sql).replace(/;\s*$/, "")} LIMIT ${$size + 1} OFFSET ${offset};`;

        const result = await select($sql);

        return {
            rows: result.slice(0, $size),
            hasMore: result.length > $size
        };
    };

    /**
     * 游标分页：基于 (orderColumn, idColumn) 二元游标，自动追加条件、排序与 LIMIT
     * 适合聊天记录 / 动态流等只向下翻页、数据持续新增的场景。
     * 基础 SQL 会被包裹为子查询，因此可以同时兼容有无 WHERE / ORDER BY 的 SELECT。
     * @param sql 基础 SELECT SQL，不含游标条件、LIMIT/OFFSET
     * @param options 分页参数
     * @param options.cursor 上一页最后一条的游标 {[orderColumn]: 排序值, [idColumn]: id}，null 表示第一页
     * @param options.size 每页条数（默认 20）
     * @param options.orderColumn 排序字段（默认 "createTime"）
     * @param options.idColumn 唯一兜底字段，与 orderColumn 组成二元游标（默认 "id"）
     * @param options.order 排序方向 "DESC" | "ASC"（默认 "DESC"）
     * @returns {Promise<{rows: Array, hasMore: boolean, nextCursor: object|null}>}
     *          rows 已截断为 size 条；没有下一页时 nextCursor 为 null
     */
    const pageByCursor = async (sql = null, options = {}) => {
        if (!isSqlValid(sql) || Array.isArray(sql)) {
            throw new Error("[useSqlite] pageByCursor 的 sql 参数不合法：仅支持单条 SELECT 语句，不支持数组");
        }
        if (!options || typeof options !== "object" || Array.isArray(options)) {
            throw new TypeError("[useSqlite] pageByCursor 的 options 参数需为对象");
        }

        const {
            cursor = null,
            size = 20,
            orderColumn = "createTime",
            idColumn = "id",
            order = "DESC"
        } = options;
        const numericSize = Number(size);

        if (!Number.isFinite(numericSize) || numericSize <= 0) {
            throw new RangeError("[useSqlite] pageByCursor 的 size 必须为正数");
        }

        const $size = Math.max(1, Math.trunc(numericSize));
        const $order = String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";

        // 列名走白名单校验，游标值走 SQL 字面量转义，避免拼接注入。
        assertIdentifier(orderColumn);
        assertIdentifier(idColumn);

        if (cursor !== null && (!cursor || typeof cursor !== "object" || Array.isArray(cursor))) {
            throw new TypeError("[useSqlite] pageByCursor 的 cursor 参数需为对象或 null");
        }

        const baseSql = String(sql).replace(/;\s*$/, "");
        const compare = $order === "DESC" ? "<" : ">";
        const alias = "__use_sqlite_cursor_page";
        const values = cursor
            ? [cursor[orderColumn], cursor[idColumn]]
            : [];

        if (cursor && values.some(value => value === null || value === undefined)) {
            throw new Error(
                `[useSqlite] pageByCursor 的 cursor 必须同时包含 ${orderColumn} 和 ${idColumn}`
            );
        }

        // escapeSqlValue 对数字只负责转字符串，这里额外拒绝 NaN/Infinity。
        const escapeCursorValue = value => {
            if (typeof value === "number" && !Number.isFinite(value)) {
                throw new TypeError(`[useSqlite] 游标数值不能为 NaN 或 Infinity：${value}`);
            }

            return escapeSqlValue(value);
        };

        const cursorCondition = cursor
            ? `WHERE (${orderColumn} ${compare} ${escapeCursorValue(values[0])} OR (${orderColumn} = ${escapeCursorValue(values[0])} AND ${idColumn} ${compare} ${escapeCursorValue(values[1])}))`
            : "";
        const $sql = `SELECT * FROM (${baseSql}) AS ${alias} ${cursorCondition} ORDER BY ${orderColumn} ${$order}, ${idColumn} ${$order} LIMIT ${$size + 1};`;

        const result = await select($sql);
        const rows = result.slice(0, $size);
        const hasMore = result.length > $size;
        const last = rows[rows.length - 1];

        if (!hasMore || !last) {
            return {rows, hasMore, nextCursor: null};
        }

        const nextOrderValue = getField(last, orderColumn);
        const nextIdValue = getField(last, idColumn);

        if (nextOrderValue === null || nextOrderValue === undefined || nextIdValue === null || nextIdValue === undefined) {
            throw new Error(
                `[useSqlite] pageByCursor 的查询结果缺少游标字段：${orderColumn} / ${idColumn}`
            );
        }

        return {
            rows,
            hasMore,
            nextCursor: {
                [orderColumn]: nextOrderValue,
                [idColumn]: nextIdValue
            }
        };
    };

    /**
     * 初始化：在指定库中执行外部传入的建表 SQL（不写任何全局状态），返回库名
     * @param tables 建表 SQL：非空字符串，或由非空字符串组成的数组（如 db 目录下表结构文件的默认导出）
     */
    const initialize = async (tables = null) => {
        if (!isSqlValid(tables)) {
            throw new Error("[useSqlite] initialize 的 tables 参数不合法：需为非空字符串或非空字符串数组");
        }

        return await execute(tables);
    };

    /**
     * 事务：自动 BEGIN / COMMIT / ROLLBACK
     * 统一走 adapter 事务原语（鸿蒙 relationalStore 原生 / plus.sqlite.transaction 原生 API），两端同构
     * @param runner 事务回调，接收绑定当前库的 {execute, select}；回调抛错会触发 ROLLBACK 并重新抛出
     * @returns {Promise<void>} 恒为 undefined，runner 的结果不对外暴露
     */
    const transaction = async (runner = null) => {
        if (typeof runner !== "function") {
            throw new TypeError("[useSqlite] transaction 需要传入回调函数");
        }

        const $dbName = await open();

        await adapter.beginTransaction($dbName);

        try {
            await runner({execute, select});

            await adapter.commit($dbName);
        } catch (e) {
            await adapter.rollBack($dbName);

            throw e;
        }
    };

    return {open, close, execute, select, page, pageByCursor, initialize, transaction};
};

// ========== 实例收集 ==========

/** defineSqlite 收集的实例对象（工厂函数返回值）；undefined 表示尚未收集 */
let collected;

/** 在途的收集 Promise：重复调用 defineSqlite 复用同一个，保证工厂只执行一次 */
let collecting = null;

/**
 * 定义并收集一组 sqlite 实例。
 * 工厂函数接收 withInstance 参数，用它创建实例并返回实例对象；可为 async（如 await initialize 建表）。
 * 收集完成后，useSqlite() 无参调用即可解构出全部实例，如 const {chat, goods} = useSqlite()。
 * 重复调用返回同一个 Promise（单例），工厂不会重复执行；收集失败后复位，可重新定义。
 * @param factory 工厂函数，接收 withInstance 并返回实例对象
 * @returns {Promise<object>} 收集的实例对象；await 可等待收集/初始化完成
 */
export const defineSqlite = factory => {
    if (typeof factory !== "function") {
        throw new TypeError("[useSqlite] defineSqlite 需要传入工厂函数");
    }
    if (collecting) {
        return collecting;
    }

    // 收集逻辑：成功存 collected，失败复位状态并向上抛
    const collect = async () => {
        try {
            collected = await factory(withInstance);

            return collected;
        } catch (e) {
            // 收集失败时复位，允许重新 define
            collecting = null;
            collected = undefined;

            throw e;
        }
    };

    // 在微任务中触发收集：工厂同步抛错会转为 rejection，且发生在调用方附着 handler 之后，
    // 避免 async 函数体同步 reject 被 Node 判为 unhandled rejection
    collecting = Promise.resolve().then(collect);

    return collecting;
};

/**
 * 获取 defineSqlite 收集的实例对象（门面，无参）：
 * - useSqlite()：返回收集的实例对象（如 {chat, goods}），可直接解构使用
 * - 尚未 defineSqlite 时返回 undefined
 * 创建实例请通过 defineSqlite 工厂的 withInstance 参数完成，本函数不再接受 options
 */
export const useSqlite = () => collected;
