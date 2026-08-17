const defaultOptions = {
    duration: 2000,
    show: false
};

export const useGlobalToast = defineStore("globalToast", () => {
    const toastOptions = ref(defaultOptions);
    const currentPage = ref("");

    // 打开Toast
    const show = option => {
        currentPage.value = getCurrentPath();
        const options = CommonUtil.deepMerge(defaultOptions, typeof option === "string" ? {msg: option} : option);
        console.log("options", options);
        toastOptions.value = CommonUtil.deepMerge(options, {
            show: true,
            position: options.position || "middle"
        });
    };

    // 成功提示
    const success = option => {
        show(
            CommonUtil.deepMerge(
                {
                    iconName: "success",
                    duration: 1500
                },
                typeof option === "string" ? {msg: option} : option
            )
        );
    };

    // 关闭提示
    const error = option => {
        show(
            CommonUtil.deepMerge(
                {
                    iconName: "error",
                    direction: "vertical"
                },
                typeof option === "string" ? {msg: option} : option
            )
        );
    };

    // 常规提示
    const info = option => {
        show(
            CommonUtil.deepMerge(
                {
                    iconName: "info"
                },
                typeof option === "string" ? {msg: option} : option
            )
        );
    };

    // 警告提示
    const warning = option => {
        show(
            CommonUtil.deepMerge(
                {
                    iconName: "warning"
                },
                typeof option === "string" ? {msg: option} : option
            )
        );
    };

    // 关闭Toast
    const close = () => {
        toastOptions.value = defaultOptions;
        currentPage.value = "";
    };

    return {
        toastOptions,
        currentPage,
        show,
        success,
        error,
        info,
        warning,
        close
    };
});
