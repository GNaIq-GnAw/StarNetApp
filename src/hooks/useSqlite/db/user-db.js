/**
 * 用户库（user）表结构定义示例
 * - 与 chat-db.js 同构：仅声明业务表结构，SQL 生成复用 schema.js 公共方法
 * - 默认导出建表 + 索引 SQL 数组，由调用方传入 useSqlite.initialize 一次性执行
 * - 注意：CREATE TABLE IF NOT EXISTS 只对新建库生效，存量库结构升级需走迁移
 */

import {buildTableFields, buildTableSqls} from "../core/schema.js";

export const USER_TABLE_NAMES = {
    userInfo: "userInfo",
    userSetting: "userSetting",
    userDevice: "userDevice",
    userPrivacy: "userPrivacy"
};

/** 字段定义：{name, type, primaryKey?, defaultValue?} */
const FIELDS = {
    userInfo: [
        {name: "userId", type: "TEXT", primaryKey: true},
        {name: "nickName", type: "TEXT"},
        {name: "avatar", type: "TEXT"},
        {name: "gender", type: "INTEGER", defaultValue: 0},
        {name: "signature", type: "TEXT"},
        {name: "phone", type: "TEXT"},
        {name: "createTime", type: "INTEGER"},
        {name: "updateTime", type: "INTEGER"}
    ],
    userSetting: [
        {name: "userId", type: "TEXT", primaryKey: true},
        {name: "notifyEnabled", type: "INTEGER", defaultValue: 1},
        {name: "theme", type: "TEXT", defaultValue: "'light'"},
        {name: "language", type: "TEXT", defaultValue: "'zh-CN'"},
        {name: "updateTime", type: "INTEGER"}
    ],
    userDevice: [
        {name: "deviceId", type: "TEXT", primaryKey: true},
        {name: "userId", type: "TEXT"},
        {name: "platform", type: "TEXT"},
        {name: "lastLoginTime", type: "INTEGER"}
    ],
    userPrivacy: [
        {name: "userId", type: "TEXT", primaryKey: true},
        {name: "allowSearch", type: "INTEGER", defaultValue: 1},
        {name: "allowAddFriend", type: "INTEGER", defaultValue: 1},
        {name: "allowPush", type: "INTEGER", defaultValue: 1},
        {name: "updateTime", type: "INTEGER"}
    ]
};

/** 高频查询索引（组合/排序） */
const INDEX_SQL = [
    "CREATE INDEX IF NOT EXISTS idx_userInfo_createTime ON userInfo (createTime DESC);",
    "CREATE INDEX IF NOT EXISTS idx_userDevice_userId ON userDevice (userId);"
];

/** 建表与索引 SQL 数组（默认导出，供调用方传入 initialize 执行） */
const userDb = buildTableSqls(FIELDS, INDEX_SQL);

/** 每张表的字段名列表（供业务拼 SQL 复用） */
export const USER_TABLE_FIELDS = buildTableFields(FIELDS);

/**
 * 当前 schema 版本（写入 PRAGMA user_version）
 * 约定：每次结构变更时 +1，且同步在 USER_MIGRATIONS 追加对应 version 的步骤
 */
export const USER_SCHEMA_VERSION = 1;

/**
 * 增量迁移步骤（由 core/migrate.js 执行：版本号 + 列存在性检查双保险）
 * 升级示例（给 userInfo 加 birthday、userSetting 加 vibrateEnabled）：
 *
 *     export const USER_SCHEMA_VERSION = 2;
 *
 *     export const USER_MIGRATIONS = [
 *         {
 *             version: 2,
 *             columns: [
 *                 {table: "userInfo", column: "birthday", sql: "ALTER TABLE userInfo ADD COLUMN birthday TEXT;"},
 *                 {table: "userSetting", column: "vibrateEnabled", sql: "ALTER TABLE userSetting ADD COLUMN vibrateEnabled INTEGER DEFAULT 1;"}
 *             ]
 *         }
 *     ];
 *
 * 注意：新字段要同步加进上方 FIELDS（新装用户建表直接带新列），存量用户走迁移补列
 */
export const USER_MIGRATIONS = [];

export default userDb;
