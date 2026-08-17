/**
 * 表结构生成工具
 * - 从字段对象化定义生成建表 SQL、索引 SQL 数组、字段名映射
 * - 供 db/ 下各业务库文件复用，避免重复实现
 */

/** 字段定义：{name, type, primaryKey?, defaultValue?} → CREATE TABLE IF NOT EXISTS SQL */
export const createTableSql = (tableName, fields) => {
    const columns = fields.map(({name, type, primaryKey = false, defaultValue}) => {
        const parts = [name, type];

        if (primaryKey) {
            parts.push("PRIMARY KEY");
        }
        if (defaultValue !== undefined) {
            parts.push(`DEFAULT ${defaultValue}`);
        }

        return `    ${parts.join(" ")}`;
    });

    return `CREATE TABLE IF NOT EXISTS ${tableName} (\n${columns.join(",\n")}\n);`;
};

/** FIELDS 对象 + 索引 SQL 数组 → 建表 + 索引 SQL 数组（供 initialize 执行） */
export const buildTableSqls = (fieldsMap, indexSql = []) => [
    ...Object.entries(fieldsMap).map(([name, fields]) => createTableSql(name, fields)),
    ...indexSql
];

/** FIELDS 对象 → 每张表的字段名列表映射（供业务拼 SQL 复用） */
export const buildTableFields = fieldsMap => Object.fromEntries(
    Object.entries(fieldsMap).map(([name, fields]) => [name, fields.map(({name: fieldName}) => fieldName)])
);
