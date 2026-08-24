import AdapterUniapp from "@alova/adapter-uniapp";
import {createAlova} from "alova";
import vueHook from "alova/vue";
import mockAdapter from "../mock/mockAdapter";

const baseURL = import.meta.env.VITE_API_URL;
// #ifdef H5
const {pathname} = new URL(baseURL);
// #endif

export const defineAlovaInstance = options => {
    return createAlova({
        // #ifdef H5
        baseURL: pathname,
        // #endif
        // #ifdef APP
        baseURL,
        // #endif
        ...AdapterUniapp({mockRequest: mockAdapter}),
        statesHook: vueHook,
        // 设置为null即可全局关闭全部请求缓存
        cacheFor: null,
        ...(options || {})
    });
};
