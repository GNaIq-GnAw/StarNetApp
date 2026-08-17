/**
 * 通用增量迁移工具：版本号（PRAGMA user_version）+ 列存在性检查双保险
 *
 * 背景：
 * - initialize 执行的 CREATE TABLE IF NOT EXISTS 只对新建库生效，存量库结构升级必须走迁移
 * - 纯版本号方案无法区分"新装用户（user_version=0 但表已是最新）"与"存量旧库（user_version=0 且缺列）"
 * - 故每个迁移步骤内部先查 PRAGMA table_info，缺哪列补哪列，保证三种场景全部安全：
 *     ① 存量旧库：列缺失 → 执行 ALTER，补列
 *     ② 新装用户：列已存在 → 跳过 ALTER，不报 duplicate column
 *     ③ 中途失败重跑：已执行的列存在 → 跳过，只补剩余的
 *
 * 注意：
 * - ALTER TABLE ADD COLUMN 一次只能加一列，多条放数组顺序执行
 * - 新列不能带 PRIMARY KEY / UNIQUE；NOT NULL 必须带非 NULL 默认值；默认值必须是常量
 * - 迁移步骤若包含数据处理（UPDATE/INSERT），新装用户也会执行（空表通常无害），需保证幂等
 *
 * @param db     useSqlite 实例（如 user / chat）
 * @param target 当前 schema 目标版本（db/ 下各库导出的 SCHEMA_VERSION）
 * @param steps  迁移步骤数组 [{version, columns: [{table, column, sql}]}]，按 version 升序执行
 * @returns {Promise<void>}
 */
export const migrate = async (db, {version: target, steps = []} = {}) => {
    // ① 读当前版本（user_version 为 SQLite 内置元数据，默认 0，无需手动创建）
    const rows = await db.select("PRAGMA user_version;");
    const current = Number(rows?.[0]?.user_version ?? 0);

    // ② 版本已到位直接跳过（幂等出口）
    if (current >= target) return;

    // ③ 按版本从小到大逐个执行（防御性排序，避免调用方乱序）
    for (const step of [...steps].sort((a, b) => a.version - b.version)) {
        if (current >= step.version) continue;

        // ④ 步骤内：逐列检查存在性，缺了才拼 ALTER（写操作统一走 execute，支持数组）
        const sqls = [];
        for (const {table, column, sql} of step.columns || []) {
            const info = await db.select(`PRAGMA table_info(${table});`);
            if (!info.some(r => String(r.name).toLowerCase() === String(column).toLowerCase())) {
                sqls.push(sql);
            }
        }
        if (sqls.length) {
            await db.execute(sqls);
        }
    }

    // ⑤ 写回目标版本（写操作必须用 execute，不能用 select）
    await db.execute(`PRAGMA user_version = ${target};`);
};
