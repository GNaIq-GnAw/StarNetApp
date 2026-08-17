export const tryJSONParse = data => {
    try {
        return JSON.parse(data);
    } catch {
        return data;
    }
};

// 解决富文本中图片超出边距问题
export const formatRichData = richData => {
    if (!richData) return;

    const formats = [
        [/<img/gi, `<img style="width: 100% !important; max-width: 100%;"`],
        [/<video/gi, `<video style="width: 100% !important; max-width: 100%;"`]
    ];

    const exec = text => {
        if (formats?.[0]) {
            const [reg, replaced] = formats[0];

            formats.shift();

            return exec(text.replace(reg, replaced));
        } else {
            return text;
        }
    };

    return exec(richData);
};

/**
 * 基于promise实现睡眠函数
 * @param timeout
 * @returns {Promise<unknown>}
 */
export const sleep = (timeout = 1000) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
};

/**
 * 获取当前页面路径
 * @returns {string}
 */
export const getCurrentPath = () => {
    const pages = getCurrentPages();

    const currentPage = pages?.[pages.length - 1]?.$page;

    return currentPage?.route || "";
};

export const openWebUrl = url => {
    // #ifdef APP
    plus.runtime.openWeb(url);
    // #endif
    // #ifdef H5
    window.open(url, "_blank");
    // #endif
};

// 解构Promise
export const createPromiseWithResolvers = () => {
    // 低版本不支持此api
    if (Promise?.withResolvers) return Promise.withResolvers();

    // 兼容写法
    let resolve = null;
    let reject = null;

    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });

    return {promise, resolve, reject};
};
