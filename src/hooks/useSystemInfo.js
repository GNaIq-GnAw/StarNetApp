export const getSystemInfo = () => {
    // #ifdef MP-WEIXIN
    try {
        const deviceInfo = uni.getDeviceInfo();
        const windowInfo = uni.getWindowInfo();
        const appBaseInfo = uni.getAppBaseInfo();

        return {...deviceInfo, ...windowInfo, ...appBaseInfo};
    } catch (error) {
        console.warn("获取系统信息失败，降级使用uni.getSystemInfoSync:", error);
        // 降级处理，使用原来的方法
        return uni.getSystemInfoSync();
    }
    // #endif

    // #ifndef MP-WEIXIN
    return uni.getSystemInfoSync();
    // #endif
};

export const useSystemInfo = () => {
    const systemInfo = getSystemInfo();
    const keyHeight = ref(0);

    const menuButtonInfo = ref(null);

    const menuButtonRect = computed(() => {
        if (!menuButtonInfo.value) return null;

        const {width, ...rest} = menuButtonInfo.value;

        return {
            ...rest,
            width: Math.min(width, 100)
        };
    });

    const getMenuButtonInfo = () => {
        // #ifdef MP-WEIXIN
        menuButtonInfo.value = uni.getMenuButtonBoundingClientRect();
        if (uni.canIUse("onMenuButtonBoundingClientRectWeightChange")) {
            uni.onMenuButtonBoundingClientRectWeightChange(res => {
                menuButtonInfo.value = res;
            });
        }
        // #endif
    };

    const rpx2px = rpx => {
        // 参数有效性校验
        if (typeof rpx !== "number" || Number.isNaN(Number(rpx))) {
            return 0;
        }

        // 获取视口宽度（px）
        const width = systemInfo.windowWidth;

        // 标准 rpx 基准宽度为 750
        const BASE_WIDTH = 750;

        return (rpx * width) / BASE_WIDTH;
    };

    const getKeyHeight = () => {
        // #ifdef APP || MP-WEIXIN
        uni.onKeyboardHeightChange(e => {
            keyHeight.value = e.height;
        });
        // #endif
    };

    onMounted(() => {
        getMenuButtonInfo();
        getKeyHeight();
    });

    return {systemInfo, menuButtonRect, keyHeight, rpx2px};
};
