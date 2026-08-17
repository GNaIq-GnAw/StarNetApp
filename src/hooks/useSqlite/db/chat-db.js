/**
 * 聊天库（chat）表结构定义示例
 * - 与 user-db.js 同构：仅声明业务表结构，SQL 生成复用 schema.js 公共方法
 * - 默认导出建表 + 索引 SQL 数组，由调用方传入 useSqlite.initialize 一次性执行
 * - 注意：CREATE TABLE IF NOT EXISTS 只对新建库生效，存量库结构升级需走迁移
 */

import {buildTableFields, buildTableSqls} from "../core/schema.js";

export const CHAT_TABLE_NAMES = {
    dialogueList: "dialogueList",
    dialogueRecord: "dialogueRecord",
    addressBook: "addressBook",
    newFriends: "newFriends"
};

/** 字段定义：{name, type, primaryKey?, defaultValue?} */
const FIELDS = {
    dialogueList: [
        {name: "userId", type: "TEXT", primaryKey: true},
        {name: "fromUserId", type: "TEXT"},
        {name: "isDot", type: "INTEGER", defaultValue: 2},
        {name: "isTop", type: "INTEGER", defaultValue: 2},
        {name: "isMute", type: "INTEGER", defaultValue: 2},
        {name: "contactTime", type: "INTEGER"}
    ],
    dialogueRecord: [
        {name: "uuid", type: "TEXT", primaryKey: true},
        {name: "userId", type: "TEXT"},
        {name: "fromUserId", type: "TEXT"},
        {name: "targetUserId", type: "TEXT"},
        {name: "source", type: "INTEGER"},
        {name: "messageType", type: "TEXT"},
        {name: "messageData", type: "TEXT"},
        {name: "createTime", type: "INTEGER"}
    ],
    addressBook: [
        {name: "userId", type: "TEXT", primaryKey: true},
        {name: "userAlias", type: "TEXT"},
        {name: "userFullName", type: "TEXT"},
        {name: "userAvatar", type: "TEXT"},
        {name: "userAvatarLocal", type: "TEXT"},
        {name: "userSex", type: "INTEGER"},
        {name: "friendStatus", type: "INTEGER"},
        {name: "createTime", type: "INTEGER"}
    ],
    newFriends: [
        {name: "applyCode", type: "TEXT", primaryKey: true},
        {name: "applyDescription", type: "TEXT"},
        {name: "applySource", type: "INTEGER"},
        {name: "applyStatus", type: "INTEGER"},
        {name: "userId", type: "TEXT"},
        {name: "userFullName", type: "TEXT"},
        {name: "userAvatar", type: "TEXT"},
        {name: "targetUser", type: "TEXT"},
        {name: "createTime", type: "INTEGER"},
        {name: "updateTime", type: "INTEGER"}
    ]
};

/** 高频查询索引（组合/排序） */
const INDEX_SQL = [
    "CREATE INDEX IF NOT EXISTS idx_dialogueRecord_userId_time ON dialogueRecord (userId, createTime DESC);",
    "CREATE INDEX IF NOT EXISTS idx_newFriends_createTime ON newFriends (createTime DESC);"
];

/** 建表与索引 SQL 数组（默认导出，供调用方传入 initialize 执行） */
const chatDb = buildTableSqls(FIELDS, INDEX_SQL);

/** 每张表的字段名列表（供业务拼 SQL 复用） */
export const CHAT_TABLE_FIELDS = buildTableFields(FIELDS);

/**
 * 当前 schema 版本（写入 PRAGMA user_version）
 * 约定：每次结构变更时 +1，且同步在 CHAT_MIGRATIONS 追加对应 version 的步骤
 */
export const CHAT_SCHEMA_VERSION = 1;

/**
 * 增量迁移步骤（由 core/migrate.js 执行：版本号 + 列存在性检查双保险）
 * 升级示例（给 dialogueRecord 加 readStatus、dialogueList 加 isPinned）：
 *
 *     export const CHAT_SCHEMA_VERSION = 2;
 *
 *     export const CHAT_MIGRATIONS = [
 *         {
 *             version: 2,
 *             columns: [
 *                 {table: "dialogueRecord", column: "readStatus", sql: "ALTER TABLE dialogueRecord ADD COLUMN readStatus INTEGER DEFAULT 0;"},
 *                 {table: "dialogueList", column: "isPinned", sql: "ALTER TABLE dialogueList ADD COLUMN isPinned INTEGER DEFAULT 2;"}
 *             ]
 *         }
 *     ];
 *
 * 注意：新字段要同步加进上方 FIELDS（新装用户建表直接带新列），存量用户走迁移补列
 */
export const CHAT_MIGRATIONS = [];

export default chatDb;
