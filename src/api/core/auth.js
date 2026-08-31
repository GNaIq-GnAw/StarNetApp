import {createServerTokenAuthentication} from "alova/client";
import {handleTokenData, onLogin} from "./handlers.js";

const {onAuthRequired, onResponseRefreshToken} = createServerTokenAuthentication({
    login: response => {
        console.log("login -> response", response);
        const {data} = response.data;
        handleTokenData(data);
    },
    assignToken: method => {
        const token = uni.getStorageSync(Cache.Token);

        if (token) {
            method.config.headers.Token = token;
        }
    },
    refreshTokenOnSuccess: {
        // 响应时触发，可获取到response和method，并返回boolean表示token是否过期
        // 当服务端返回40102时，表示token过期
        isExpired: response => {
            console.log("refreshTokenOnSuccess -> isExpired", response);

            return response.statusCode === HttpResponse.Unauthorized;
        },
        // 当token过期时触发，在此函数中触发刷新token
        handler: async () => {
            onLogin();

            return Promise.reject(new Error("error"));
        }
    },
    // 退出登录清除token信息
    logout: () => handleTokenData()
});

export {onAuthRequired, onResponseRefreshToken};
