import {createServerTokenAuthentication} from "alova/client";
import {handleTokenData, onRelaunchLogin} from "./handlers.js";
import {defineAlovaInstance} from "./instance.js";

const alovaInstance = defineAlovaInstance();

const {onAuthRequired, onResponseRefreshToken} = createServerTokenAuthentication({
    login: response => {
        console.log("login -> response", response);
        const {data} = response.data;
        handleTokenData(data);
    },
    assignToken: method => {
        const token = uni.getStorageSync(Cache.Token);

        if (token) {
            method.config.headers.Authorization = `Bearer ${token}`;
        }
    },
    refreshTokenOnSuccess: {
        // 响应时触发，可获取到response和method，并返回boolean表示token是否过期
        // 当服务端返回40102时，表示token过期
        isExpired: response => {
            console.log("refreshTokenOnSuccess -> isExpired", response);
            if (response?.data?.code === HttpResponse.OtherDeviceLogin) {
                onRelaunchLogin(true);

                return false;
            }

            return response?.data?.code === HttpResponse.TokenFailure;
        },
        // 当token过期时触发，在此函数中触发刷新token
        handler: async () => {
            try {
                const refreshToken = uni.getStorageSync(Cache.RefreshToken);

                const {data} = await (async () => {
                    try {
                        const {data: responseData} = await alovaInstance.Get("/storePartner/login/refreshToken", {
                            params: {refreshToken},
                            meta: {authRole: "refreshToken"}
                        });

                        // 判断返回状态码
                        if (responseData?.code === HttpResponse.Success) return {data: responseData.data};

                        onRelaunchLogin();

                        return Promise.reject(new Error(responseData.msg));
                    } catch (e) {
                        onRelaunchLogin();

                        return Promise.reject(e);
                    }
                })();

                handleTokenData(data);
            } catch (error) {
                // token刷新失败，跳转回登录页
                console.log("refreshToken -> failed", error);
                // 并抛出错误
                throw error;
            }
        }
    },
    // 退出登录清除token信息
    logout: () => handleTokenData()
});

export {onAuthRequired, onResponseRefreshToken};
