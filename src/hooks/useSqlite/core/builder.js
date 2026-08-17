/**
 * SQL 语句构建器（DML）
 * - 将对象数据安全地构建为 INSERT / UPDATE 语句，列名走白名单校验、值走转义/字面量序列化，防注入
 * - 无平台依赖的纯逻辑，构建结果可直接传给 useSqlite 实例的 execute / transaction
 * - 与 core/schema.js（DDL 建表）职责对称：schema 管表结构，builder 管数据写入
 */

import {assertIdentifier, escapeSqlValue} from "./utils.js";

/**
 * 将 JS 值转为 SQL 字面量（在 escapeSqlValue 基础上扩展面向对象数据的类型支持）：
 * - number → 直出（NaN / Infinity 抛错）
 * - boolean → 1 / 0（SQLite 无布尔类型）
 * - string → 单引号转义（'' 折叠）
 * - null → NULL
 * - Date → 毫秒时间戳（与库内 INTEGER 时间字段约定一致）
 * - 数组 / 普通对象 → JSON 序列化后入库（如 messageData 存 TEXT）
 * - 其他类型（undefined / function / symbol / bigint）→ 抛错
 */
export const toSqlLiteral = value => {
    if (value === null) return "NULL";

    switch (typeof value) {
        case "number":
            if (!Number.isFinite(value)) {
                throw new TypeError(`[useSqlite] 数值不能为 NaN 或 Infinity：${value}`);
            }
            return String(value);
        case "boolean":
            return value ? "1" : "0";
        case "string":
            return escapeSqlValue(value);
        case "object":
            if (value instanceof Date) return String(value.getTime());
            try {
                return escapeSqlValue(JSON.stringify(value));
            } catch (e) {
                throw new Error(`[useSqlite] 对象无法序列化为 JSON：${e.message}`);
            }
        default:
            throw new Error(`[useSqlite] 不支持的字段值类型：${typeof value}`);
    }
};

/**
 * 构建 WHERE 条件片段（无 where 时返回空字符串）：
 * - 对象：键为列名（白名单校验），值为 SQL 字面量，多条件用 AND 连接（等值匹配）
 * - 字符串：原样返回，信任调用方已自行处理安全（适合 IN、LIKE 等复杂条件）
 * @param where 条件对象或已拼好的条件字符串
 * @returns string 条件片段（不含 WHERE 关键字），空/undefined 返回 ""
 */
export const buildWhereSql = (where = "") => {
    if (!where) return "";
    if (typeof where === "string") return where;

    const pairs = Object.entries(where).map(([key, value]) => {
        assertIdentifier(key);
        return `${key} = ${toSqlLiteral(value)}`;
    });

    return pairs.join(" AND ");
};

/**
 * 构建 INSERT 语句
 * @param table 表名（标识符白名单校验）
 * @param data 插入数据对象：键为列名，值为字面量；值为 undefined 的键自动跳过
 * @returns string "INSERT INTO table (col1, col2) VALUES (v1, v2);"
 */
export const buildInsertSql = (table, data = {}) => {
    assertIdentifier(table);

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new TypeError("[useSqlite] buildInsertSql 的 data 参数需为对象");
    }

    const entries = Object.entries(data).filter(([, value]) => value !== undefined);

    if (entries.length === 0) {
        throw new Error("[useSqlite] buildInsertSql 的 data 中没有可插入的字段");
    }

    const columns = entries.map(([key]) => {
        assertIdentifier(key);
        return key;
    });
    const values = entries.map(([, value]) => toSqlLiteral(value));

    return `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${values.join(", ")});`;
};

/**
 * 构建 UPDATE 语句
 * @param table 表名（标识符白名单校验）
 * @param data 更新字段对象：键为列名，值为字面量；值为 undefined 的键自动跳过
 * @param where 更新条件（必填，防止无 WHERE 误更新全表）：
 *              对象 → 自动转义并用 AND 连接；字符串 → 原样使用（信任调用方）
 * @returns string "UPDATE table SET col1 = v1, col2 = v2 WHERE id = 'x';"
 */
export const buildUpdateSql = (table, data = {}, where) => {
    assertIdentifier(table);

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new TypeError("[useSqlite] buildUpdateSql 的 data 参数需为对象");
    }

    const entries = Object.entries(data).filter(([, value]) => value !== undefined);

    if (entries.length === 0) {
        throw new Error("[useSqlite] buildUpdateSql 的 data 中没有可更新的字段");
    }

    const assignments = entries.map(([key, value]) => {
        assertIdentifier(key);
        return `${key} = ${toSqlLiteral(value)}`;
    });

    const whereSql = buildWhereSql(where);

    if (!whereSql) {
        throw new Error("[useSqlite] buildUpdateSql 的 where 条件不能为空：UPDATE 无 WHERE 会更新全表");
    }

    return `UPDATE ${table} SET ${assignments.join(", ")} WHERE ${whereSql};`;
};
