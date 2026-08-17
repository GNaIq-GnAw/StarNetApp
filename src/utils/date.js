import {
    endOfDay,
    endOfMonth,
    format,
    isDate,
    min,
    secondsToMilliseconds,
    startOfDay,
    startOfMonth,
    toDate
} from "date-fns";
import {zhCN} from "date-fns/locale";

const DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
const DATE_FORMAT = "yyyy-MM-dd";

const toMilliseconds = value => {
    return String(value).length === 10 ? secondsToMilliseconds(value) : value;
};

/**
 * 格式化为日期格式
 * @param {Date | number} date
 * @param {string} formatStr 格式
 * @returns {string}
 */
export const formatDate = (date = null, formatStr = DATE_FORMAT) => {
    if (!date || Number.isNaN(Number(date))) return "";

    if (!isDate(date)) date = toDate(date);

    date = toMilliseconds(date.getTime());

    return format(date, formatStr, {locale: zhCN});
};

/**
 * 格式化为日期时间格式
 * @param {Date | number} date
 * @returns {string}
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
 * @param date
 * @param rangeType
 * @param formatStr
 * @returns {{start: string, end: string}}
 */
export const rangeOf = (date, rangeType = "day", formatStr) => {
    if (!date) return {start: "", end: ""};

    const [startFn, endFn, presetFormatStr] = RANGE_MAPS[rangeType];

    const start = formatDate(startFn(date), formatStr || presetFormatStr);
    const end = formatDate(min([endFn(date), Date.now()]), formatStr || presetFormatStr);

    return {start, end};
};
