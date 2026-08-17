export const onRelaunchLogin = (singleDevice = false) => {
    handleTokenData();

    uni.reLaunch({
        url: "/pages/login",
        success: () => {
            uni.hideLoading();
            // 其他设备已登录
            if (singleDevice) {
                const dialog = useGlobalDialog();

                dialog.alert({
                    title: "安全提醒",
                    msg: "您的账号已在其他设备登录，如非本人操作，请及时修改密码。",
                    confirmButtonProps: {round: false}
                });
            }
        }
    });
};

// 响应处理
export const onAlovaResponse = async response => {
    const {statusCode, data} = response;

    // 抛出错误或返回reject状态的Promise实例时，此请求将抛出错误
    if (statusCode !== HttpResponse.StatusCode) throw data.error;

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
        uni.setStorageSync(Cache.Token, data.accessToken);
        uni.setStorageSync(Cache.RefreshToken, data.refreshToken);
    } else {
        uni.removeStorageSync(Cache.Token);
        uni.removeStorageSync(Cache.RefreshToken);
    }
};
