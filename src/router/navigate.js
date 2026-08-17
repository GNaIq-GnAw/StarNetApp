export const setupNavigate = app => {
    const fns = {
        navigateTo: uni.navigateTo,
        redirectTo: uni.redirectTo,
        reLaunch: uni.reLaunch,
        switchTab: uni.switchTab
    };

    Object.keys(fns).forEach(fnName => {
        app.config.globalProperties[`$${fnName}`] = (url, options) => {
            fns[fnName]({
                url,
                ...(options || {})
            });
        };
    });

    app.config.globalProperties.$navigateBack = (options = {}) => {
        const {fallbackUrl, ...opts} = options;

        uni.navigateBack({...opts});
    };
};
