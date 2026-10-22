/**
 * 搜索历史纯逻辑（无副作用，便于单测）
 */

// 归一化读取结果：过滤非字符串与空白项
export const normalizeHistory = raw => {
    if (!Array.isArray(raw)) return [];

    return raw.filter(item => typeof item === "string" && item.trim()).map(item => item.trim());
};

// 写入新词：去重并置顶，空词原样返回
export const pushHistory = (list, keyword) => {
    const value = `${keyword ?? ""}`.trim();

    if (!value) return list;

    return [value, ...list.filter(item => item !== value)];
};
