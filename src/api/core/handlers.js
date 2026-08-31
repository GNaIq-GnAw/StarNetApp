export const onLogin = () => {
    handleTokenData();

    uni.reLaunch({
        url: "/pages/login",
        success: () => {
            uni.hideLoading();
        }
    });
};

// 响应处理
export const onAlovaResponse = async ({statusCode, data}) => {
    // 抛出错误或返回reject状态的Promise实例时，此请求将抛出错误
    if (statusCode !== HttpResponse.Ok) throw data.error;

    // 兼容处理json字符串
    const responseData = tryJSONParse(data);

    if (responseData?.code !== HttpResponse.Success) {
        const err = new Error(responseData.msg);
        err.code = responseData.code;

        throw err;
    }

    return responseData;
};

// 响应错误处理
export const onAlovaError = async (error, method) => {
    console.log("onAlovaError", error, method);
    throw error;
};

export const handleTokenData = (data = null) => {
    if (data) {
        uni.setStorageSync(Cache.Token, data);
    } else {
        uni.removeStorageSync(Cache.Token);
    }
};
