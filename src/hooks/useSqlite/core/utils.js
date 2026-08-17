/** useSqlite 共享工具与常量：无平台依赖的纯逻辑，便于单独测试 */

export const DEFAULT_OPTIONS = {path: "_doc", name: ""};

/** sql 参数校验：非空字符串，或由非空字符串组成的数组 */
export const isSqlValid = sql =>
    Array.isArray(sql)
        ? sql.length > 0 && sql.every(item => typeof item === "string" && item.length > 0)
        : typeof sql === "string" && sql.length > 0;

/** 空名校验：库名必须显式存在（createInstance 的 name 选项或方法参数），不再有全局默认库 */
export const assertDbName = name => {
    if (!name) {
        throw new Error("[useSqlite] 数据库名不能为空：请在 createInstance 的 options 中指定 name，或每个方法调用时传入 name");
    }
};

/**
 * 标识符白名单校验（表名/列名/排序字段），防 SQL 注入；不合法直接抛错
 */
export const assertIdentifier = identifier => {
    if (typeof identifier !== "string" || !/^[a-z_]\w*$/i.test(identifier)) {
        throw new Error(`[useSqlite] 非法标识符：${JSON.stringify(identifier)}`);
    }

    return identifier;
};

/**
 * 将值安全拼入 SQL（分页游标/参数场景）：
 * - number 直出
 * - string 转义单引号（'' 折叠）
 * - 其他类型（含 null/undefined）抛错，防注入
 */
export const escapeSqlValue = value => {
    if (value === null || value === undefined) {
        throw new Error("[useSqlite] SQL 参数值不能为 null/undefined");
    }

    if (typeof value === "number") {
        return String(value);
    }

    if (typeof value === "string") {
        return `'${value.replace(/'/g, "''")}'`;
    }

    throw new Error(`[useSqlite] 不支持的 SQL 参数值类型：${typeof value}`);
};
