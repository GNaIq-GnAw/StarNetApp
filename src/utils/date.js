import {
    differenceInCalendarDays,
    endOfDay,
    endOfMonth,
    format,
    min,
    secondsToMilliseconds,
    startOfDay,
    startOfMonth,
    toDate
} from "date-fns";
import {zhCN} from "date-fns/locale";

const DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
const DATE_FORMAT = "yyyy-MM-dd";
const PROXIMITY_DAYS = 10;

/**
 * 归一化为毫秒时间戳
 * 兼容 Date / 毫秒时间戳 / 秒级时间戳 / 纯数字字符串 / 可解析的日期字符串
 * 10 位数字（含纯数字字符串）视为秒级时间戳，其余数字视为毫秒
 * @param {Date | number | string} value 待归一化的时间值
 * @returns {number | null} 毫秒时间戳，无法解析时返回 null
 */
const toMilliseconds = value => {
    if (value === null || value === undefined || value === "") return null;

    // 纯数字字符串先转数字再判定位数，避免 "2026-10-18" 这类日期字符串被误判为秒级时间戳
    let normalized = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;

    // 10 位数字按秒级时间戳处理，其余（13 位毫秒 / Date / 日期字符串）交给 toDate 解析
    if (typeof normalized === "number" && String(normalized).length === 10) {
        normalized = secondsToMilliseconds(normalized);
    }

    const timestamp = toDate(normalized).getTime();

    return Number.isNaN(timestamp) ? null : timestamp;
};

/**
 * 格式化为日期格式
 * @param {Date | number | string} date 支持 Date / 时间戳 / 日期字符串
 * @param {string} formatStr 格式
 * @returns {string} 格式化结果，无法解析时返回空字符串
 */
export const formatDate = (date = null, formatStr = DATE_FORMAT) => {
    if (!date) return "";

    const timestamp = toMilliseconds(date);

    if (timestamp === null) return "";

    return format(timestamp, formatStr, {locale: zhCN});
};

/**
 * 格式化为日期时间格式
 * @param {Date | number | string} date 支持 Date / 时间戳 / 日期字符串
 * @returns {string} 格式化后的日期时间字符串，无法解析时返回空字符串
 */
export const formatDatetime = (date = null) => {
    return formatDate(date, DATETIME_FORMAT);
};

const RANGE_MAPS = {
    day: [startOfDay, endOfDay, DATETIME_FORMAT],
    month: [startOfMonth, endOfMonth, DATE_FORMAT]
};

/**
 * 获取时间的起始和结尾
 * @param {Date | number | string} date 基准日期
 * @param {string} [rangeType] 区间类型，支持 day / month，默认 day
 * @param {string} [formatStr] 输出格式，默认随区间类型决定
 * @returns {{start: string, end: string}} 区间起止时间字符串，入参为空时返回空字符串对
 */
export const rangeOf = (date, rangeType = "day", formatStr) => {
    if (!date) return {start: "", end: ""};

    const [startFn, endFn, presetFormatStr] = RANGE_MAPS[rangeType];

    const start = formatDate(startFn(date), formatStr || presetFormatStr);
    const end = formatDate(min([endFn(date), Date.now()]), formatStr || presetFormatStr);

    return {start, end};
};

/**
 * 判断传入日期是否临近（距今不足指定天数）
 * 口径：按日历天计算，跨天整点翻转；且仅对未来（含今天）生效，过去日期一律返回 false
 * @param {Date | number | string} date 待判断的目标日期
 * @param {number} [days] 临近阈值天数，默认 10
 * @param {Date | number | string} [baseDate] 基准日期，默认当前时间
 * @returns {boolean} 目标日期在今天起、未来该天数之内返回 true，否则 false
 */
export const isWithinDays = (date = null, days = PROXIMITY_DAYS, baseDate = Date.now()) => {
    const target = toMilliseconds(date);
    if (target === null) return false;

    const base = toMilliseconds(baseDate) ?? Date.now();

    const diff = differenceInCalendarDays(target, base);

    return diff >= 0 && diff < days;
};
