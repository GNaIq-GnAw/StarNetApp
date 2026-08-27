<script setup>
    const {systemInfo} = useSystemInfo();

    const themeVars = computed(() => {
        return {
            // base
            ...Theme,
            textMain: Theme.primary6,
            borderMain: "#E9EAEC",
            // button
            buttonRadiusMain: "8rpx",
            buttonHeightSmall: "60rpx",
            buttonHeightMedium: "80rpx",
            buttonHeightLarge: "88rpx",
            buttonFontSizeMedium: "28rpx",
            // checkbox
            checkboxIconSize: "28rpx",
            checkboxLabelFontSize: "20rpx",
            checkboxLabelLineHeight: "40rpx",
            checkboxLabelMargin: "12rpx",
            // navbar
            navbarArrowSize: "40rpx",
            navbarColor: "#101010",
            navbarDescFontSize: "32rpx",
            navbarHeight: "88rpx",
            navbarLeftPadding: "0 40rpx",
            navbarDescColor: "#101010",
            // cell
            cellPadding: 0,
            cellTitleFontSize: "24rpx",
            cellTitleLineHeight: "40rpx",
            cellVerticalPaddingTop: "20rpx",
            cellLabelFontSize: "24rpx",
            cellLabelLineHeight: "40rpx",
            cellLabelMarginTop: 0,
            // input
            inputInnerHeight: "40rpx",
            // radio
            radioHorizontalMargin: "0 20rpx 0 0"
        };
    });
</script>

<template>
    <wd-config-provider :theme-vars="themeVars" custom-class="page-wraper">
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
