/**
 * useDeviceData 共享短信逻辑（无平台依赖的纯函数，便于单独测试）
 *
 * 服务 smsLog 通道：短信类型映射、单条归一化、排序与剔除。
 * 地址清洗复用 phone.js 的 cleanDevicePhone（占位值感知），避免再写一份号码清洗。
 */
import {cleanDevicePhone} from "./phone.js";

/** Android Telephony.Sms 的 type 常量（数值与系统一致） */
export const SMS_TYPES = {
    INBOX: 1,
    SENT: 2,
    DRAFT: 3,
    OUTBOX: 4
};

/** 短信类型数值 → 语义化文案，供 UI 直接展示 */
const TYPE_TEXTS = {
    [SMS_TYPES.INBOX]: "inbox",
    [SMS_TYPES.SENT]: "sent",
    [SMS_TYPES.DRAFT]: "draft",
    [SMS_TYPES.OUTBOX]: "outbox"
};

/**
 * 将 Telephony.Sms.type 数值映射为语义化文案
 * @param {*} value 类型值，兼容字符串数字
 * @returns {string} 语义化文案，未知值返回 "unknown"
 */
export const resolveSmsType = value => {
    if (value === null || value === undefined || value === "") return "unknown";

    const type = Number(value);

    return TYPE_TEXTS[type] || "unknown";
};

/**
 * 归一化单条短信，只保留前端需要的字段并做类型兜底
 * @param {object|null} raw 原始记录（字段名对应 content://sms 列）
 * @returns {object} 归一化后的短信记录
 */
export const normalizeSmsRecord = raw => {
    const source = raw || {};

    const number = cleanDevicePhone(source.address);
    const body = String(source.body ?? "");

    const type = Number(source.type);
    const date = Number(source.date);

    const safeType = Number.isFinite(type) && type > 0 ? type : SMS_TYPES.INBOX;
    const safeDate = Number.isFinite(date) && date > 0 ? date : 0;
    const occurIndex = Number.isFinite(Number(source.occurIndex)) ? Number(source.occurIndex) : 0;

    return {
        // 同秒同号同类型可能有多条，用 occurIndex 保证 key 唯一
        id: `${safeDate}-${safeType}-${number}-${occurIndex}`,
        number,
        body,
        type: safeType,
        typeText: resolveSmsType(safeType),
        date: safeDate,
        // content://sms 的 read 列为 1 表示已读（无该列 / 其他值一律按未读）
        read: Number(source.read) === 1
    };
};

/**
 * 归一化并按时间倒序排列，同时剔除既无号码又无正文的空记录
 * 注意：不做去重 —— 同一号码的多条短信是真实记录，删掉会丢业务信息
 * @param {Array} list 原始记录数组
 * @returns {Array} 归一化后的短信记录，按 date 倒序
 */
export const sortAndNormalizeSms = list => {
    if (!Array.isArray(list)) return [];

    return list
        .map((item, index) => ({item: item || {}, index}))
        .filter(({item}) => cleanDevicePhone(item.address) || String(item.body ?? "").trim())
        .map(({item, index}) => normalizeSmsRecord({...item, occurIndex: index}))
        .sort((a, b) => b.date - a.date);
};
