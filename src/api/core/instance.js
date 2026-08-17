import AdapterUniapp from "@alova/adapter-uniapp";
import {createAlova} from "alova";
import vueHook from "alova/vue";
import mockAdapter from "../mock/mockAdapter";

export const defineAlovaInstance = options => {
    return createAlova({
        baseURL: import.meta.env.VITE_API_URL,
        ...AdapterUniapp({mockRequest: mockAdapter}),
        statesHook: vueHook,
        // 设置为null即可全局关闭全部请求缓存
        cacheFor: null,
        ...(options || {})
    });
};
