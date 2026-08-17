/**
 * 跨端 SQLite 适配器
 *
 * 平台分工（关键约束：plus 是 5+ Runtime 的 JS 层对象，UTS 编译为原生 Kotlin/Swift 后不存在，
 * 因此 app-android / app-ios 的 UTS 实现不可行，Android/iOS 必须在 JS 层直接调 plus.sqlite）：
 * - APP-HARMONY：无 plus 运行时，走 uts-sqlite 插件（relationalStore 原生实现，含事务原语）
 * - App 其他端（Android/iOS）：JS 层 plus.sqlite（回调包装为 Promise，事务走 plus.sqlite.transaction 原生 API）
 * - 其他端（H5/小程序）：plus 不存在，调用时抛"plus is not defined"，由上层按平台能力约束
 */

// #ifdef APP-HARMONY
import {sqlite} from "@/uni_modules/uts-sqlite";
// #endif

// #ifdef APP-PLUS
/** 回调风格 API 包装为 Promise（plus.sqlite 均为 success/fail 回调） */
const promisify = (action, params) => new Promise((resolve, reject) => {
    plus.sqlite[action]({
        ...params,
        success: result => resolve(result),
        fail: e => {
            console.error(`[uts-sqlite] ${action} fail:`, JSON.stringify(e));
            reject(e);
        }
    });
});

/** plus.sqlite 适配层（与鸿蒙插件同构的 5 方法 + 事务三原语，useSqlite 统一走原语不再回退 SQL） */
const plusAdapter = {
    openDatabase: options => promisify("openDatabase", options),
    // 注意：isOpenDatabase 的 path 是必选参数（官方文档），漏传会返回 undefined，必须 name+path 成对传
    isOpenDatabase: options => Promise.resolve(plus.sqlite.isOpenDatabase({name: options.name, path: options.path})),
    closeDatabase: name => promisify("closeDatabase", {name}),
    executeSql: options => promisify("executeSql", options),
    selectSql: options => promisify("selectSql", options),
    // 事务三原语（与鸿蒙插件同构）：plus.sqlite.transaction 按 operation 区分 begin/commit/rollback
    beginTransaction: name => promisify("transaction", {name, operation: "begin"}),
    commit: name => promisify("transaction", {name, operation: "commit"}),
    rollBack: name => promisify("transaction", {name, operation: "rollback"})
};
// #endif

// 条件编译分支各赋值一次（ESLint 会把两分支都当代码解析，只能声明一次）
let selected;

// #ifdef APP-HARMONY
selected = sqlite;
// #endif
// #ifdef APP-PLUS
selected = plusAdapter;
// #endif

export const adapter = selected;
