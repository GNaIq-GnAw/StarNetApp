/**
 * useDeviceData 共享号码逻辑（无平台依赖的纯函数，便于单独测试）
 *
 * 同时服务通讯录（contacts）与通话记录（callLog）两条数据线：
 * 号码清洗、通话类型映射、通话记录归一化、联系人归一化。
 */

/** Android CallLog.Calls.TYPE 常量（数值与系统一致） */
export const CALL_TYPES = {
    INCOMING: 1,
    OUTGOING: 2,
    MISSED: 3,
    VOICEMAIL: 4,
    REJECTED: 5,
    BLOCKED: 6,
    ANSWERED_EXTERNALLY: 7
};

/** 通话类型数值 → 语义化文案，供 UI 直接展示 */
const TYPE_TEXTS = {
    [CALL_TYPES.INCOMING]: "incoming",
    [CALL_TYPES.OUTGOING]: "outgoing",
    [CALL_TYPES.MISSED]: "missed",
    [CALL_TYPES.VOICEMAIL]: "voicemail",
    [CALL_TYPES.REJECTED]: "rejected",
    [CALL_TYPES.BLOCKED]: "blocked",
    [CALL_TYPES.ANSWERED_EXTERNALLY]: "answered-externally"
};

/**
 * 系统对未知 / 私密号码写入的占位值，需归一为空串
 * -1/-2/-3 为 AOSP CallLog 的约定值；英文与中文串来自各厂商 ROM（如 MIUI、EMUI）
 */
const PLACEHOLDER_NUMBERS = [
    "-1",
    "-2",
    "-3",
    "p",
    "private",
    "unknown",
    "restricted",
    "unavailable",
    "withheld",
    "未知",
    "未知号码",
    "私密",
    "私密号码",
    "无法接通",
    "号码限制"
];

/**
 * 清理电话号码中的分隔符（-、空格、全角空格、括号等），保留 + 号与数字
 * 用于去掉展示用的格式字符，便于后端匹配
 *
 * ⚠️ 占位值必须在剥离分隔符**之前**判定：`-1` 若先去掉 `-` 会变成合法的 `1`
 * @param {*} value 原始号码
 * @returns {string} 归一化后的号码，占位值返回空串
 */
export const cleanDevicePhone = value => {
    const raw = String(value ?? "").trim();

    if (!raw) return "";

    if (PLACEHOLDER_NUMBERS.includes(raw.toLowerCase())) return "";

    const cleaned = raw.replace(/[\s\-—–()（）]/g, "");

    if (!cleaned) return "";

    return PLACEHOLDER_NUMBERS.includes(cleaned.toLowerCase()) ? "" : cleaned;
};

/**
 * 将 CallLog.Calls.TYPE 数值映射为语义化文案
 * @param {*} value 类型值，兼容字符串数字
 * @returns {string} 语义化文案，未知值返回 "unknown"
 */
export const resolveCallType = value => {
    if (value === null || value === undefined || value === "") return "unknown";

    const type = Number(value);

    return TYPE_TEXTS[type] || "unknown";
};

/**
 * 归一化单条通话记录，只保留前端需要的字段并做类型兜底
 * @param {object|null} raw 原始记录（字段名对应 CallLog 列）
 * @returns {object} 归一化后的通话记录
 */
export const normalizeCallRecord = raw => {
    const source = raw || {};

    const number = cleanDevicePhone(source.number);
    const rawName = String(source.name ?? "").trim();

    const type = Number(source.type);
    const date = Number(source.date);
    const duration = Number(source.duration);

    const safeType = Number.isFinite(type) && type > 0 ? type : CALL_TYPES.INCOMING;
    const safeDate = Number.isFinite(date) && date > 0 ? date : 0;
    const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
    const occurIndex = Number.isFinite(Number(source.occurIndex)) ? Number(source.occurIndex) : 0;

    return {
        // 同秒同号同类型可能有多条（如连续拨打），用 occurIndex 保证 key 唯一
        id: `${safeDate}-${safeType}-${number}-${occurIndex}`,
        number,
        // 未设置姓名时回退用号码当姓名，与通讯录导入的既有约定一致
        name: rawName || number,
        type: safeType,
        typeText: resolveCallType(safeType),
        date: safeDate,
        duration: safeDuration
    };
};

/**
 * 归一化并按时间倒序排列，同时剔除既无号码又无姓名的空记录
 * 注意：不做去重 —— 同一号码的连续多次通话是真实记录，删掉会丢业务信息
 * @param {Array} list 原始记录数组
 * @returns {Array} 归一化后的通话记录，按 date 倒序
 */
export const sortAndNormalizeCalls = list => {
    if (!Array.isArray(list)) return [];

    return list
        .map((item, index) => ({item: item || {}, index}))
        .filter(({item}) => cleanDevicePhone(item.number) || String(item.name ?? "").trim())
        .map(({item, index}) => normalizeCallRecord({...item, occurIndex: index}))
        .sort((a, b) => b.date - a.date);
};

/**
 * 归一化联系人，只保留前端需要的字段，丢弃 plus.contacts 的冗余结构
 * @param {object|null} contact 原始 Contact 对象
 * @returns {object} 归一化后的联系人
 */
export const normalizeContact = contact => {
    const source = contact || {};

    return {
        id: source.id || "",
        name: source.displayName || source.name?.formatted || "",
        phones: (source.phoneNumbers || []).map(item => cleanDevicePhone(item.value)).filter(Boolean),
        emails: (source.emails || []).map(item => item.value)
    };
};
