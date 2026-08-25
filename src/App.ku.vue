<script setup>
    const {systemInfo} = useSystemInfo();

    const themeVars = computed(() => {
        return {
            ...Theme,
            textMain: Theme.primary6,
            borderMain: "#E9EAEC",
            buttonHeightSmall: "60rpx",
            buttonHeightMedium: "80rpx",
            buttonHeightLarge: "88rpx",
            checkboxIconSize: "28rpx",
            checkboxLabelFontSize: "20rpx",
            checkboxLabelLineHeight: "40rpx",
            checkboxLabelMargin: "12rpx"
        };
    });
</script>

<template>
    <wd-config-provider :theme-vars="themeVars">
        <view
            :style="{
                '--safe-area-bottom': `${systemInfo?.safeAreaInsets?.bottom}px`
            }"
            class="app"
        >
            <ku-root-view />
        </view>
        <wd-dialog />
        <wd-toast position="middle" />
        <global-dialog />
        <global-toast />
    </wd-config-provider>
</template>

<style lang="scss" scoped>
    .app {
        /* #ifdef H5 */
        height: calc(100dvh - var(--safe-area-bottom));
        /* #endif */
        /* #ifndef H5 */
        height: calc(100vh - var(--safe-area-bottom));
        /* #endif */
        padding: 0 0 var(--safe-area-bottom);
    }
</style>
