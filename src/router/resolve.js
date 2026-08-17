import {START_LOCATION_NORMALIZED} from "@wot-ui/router";
import {routes} from "./index.js";

// 以对象形式获取url参数
const getUrlParams = path => {
    const index = path.indexOf("?");

    if (index === -1) return {};

    const queryStr = path.slice(index + 1);
    const params = {};

    for (const pair of queryStr.split("&")) {
        const [, key, value] = pair.match(/^([^=]+)=(.+)$/);

        if (key) {
            try {
                params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : "";
            } catch {
                params[key] = value || "";
            }
        }
    }

    return params;
};

/**
 * 序列化参数并拼接到 URL
 * @param path 基础路径
 * @param query 参数对象
 * @returns string 完整路径
 */
const stringifyQuery = (path, query) => {
    if (!query || Object.keys(query).length === 0) return path;
    const queryStr = Object.keys(query)
        .filter(key => query[key] !== void 0 && query[key] !== null)
        .map(key => {
            const val = query[key];
            return `${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`;
        })
        .join("&");
    if (!queryStr) return path;
    return `${path}${path.includes("?") ? "&" : "?"}${queryStr}`;
};

/**
 * 规范化 URL (去除多余的 /)
 */
const normalizeUrl = url => {
    return url.replace(/\/{2,}/g, "/");
};

const fillParams = (path, params) => {
    if (!params) return path;
    let res = path;
    for (const key in params) res = res.replace(new RegExp(`:${key}`, "g"), String(params[key]));
    return res;
};

const resolvePath = (path, query) => {
    const normalizedPath = normalizeUrl(path.split("?")[0]);
    const route = routes.find(r => r.path === normalizedPath || r.aliasPath === normalizedPath);

    if (!route) throw new Error(`您正在尝试访问的路由 '${normalizedPath}' 未在路由表中定义。请检查您的路由配置。`);

    const finalQuery = {
        ...getUrlParams(path),
        ...(query || {})
    };

    return {
        path: normalizedPath,
        name: route?.name,
        params: {},
        query: finalQuery,
        hash: "",
        fullPath: stringifyQuery(normalizedPath, finalQuery),
        meta: route?.meta || {},
        style: route?.style || {},
        ...Object.fromEntries(
            Object.entries(route || {}).filter(([key]) => !["path", "name", "meta", "style", "aliasPath"].includes(key))
        )
    };
};

export const resolvePage = to => {
    if (typeof to === "string") return resolvePath(to);

    if (to.name) {
        const route = routes.find(r => r.name === to.name);

        if (!route) throw new Error(`您正在尝试访问的路由 '${to.name}' 未在路由表中定义。请检查您的路由配置。`);

        const path = fillParams(route.path, to.params);
        const finalQuery = to.params || {};

        return {
            path,
            name: to.name,
            params: to.params || {},
            query: finalQuery,
            hash: to.hash || "",
            fullPath: stringifyQuery(path, finalQuery),
            meta: route.meta || {},
            style: route.style || {},
            ...Object.fromEntries(
                Object.entries(route).filter(([key]) => !["path", "name", "meta", "style", "aliasPath"].includes(key))
            )
        };
    }

    if (to.path) return resolvePath(to.path, to.query);

    return {...START_LOCATION_NORMALIZED};
};
