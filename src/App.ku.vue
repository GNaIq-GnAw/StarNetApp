<script setup>
    const {systemInfo} = useSystemInfo();

    const themeVars = computed(() => {
        return {
            // base
            ...Theme,
            textMain: Theme.primary6,
            borderMain: "#E9EAEC",
            // button
            buttonRadiusMain: "7.63rpx",
            buttonHeightSmall: "57.25rpx",
            buttonHeightMedium: "76.34rpx",
            buttonHeightLarge: "83.97rpx",
            buttonFontSizeMedium: "26.72rpx",
            // checkbox
            checkboxIconSize: "26.72rpx",
            checkboxLabelFontSize: "19.08rpx",
            checkboxLabelLineHeight: "38.17rpx",
            checkboxLabelMargin: "11.45rpx",
            // navbar
            navbarArrowSize: "38.17rpx",
            navbarColor: "#101010",
            navbarDescFontSize: "30.53rpx",
            navbarHeight: "83.97rpx",
            navbarLeftPadding: "0 38.17rpx",
            navbarDescColor: "#101010",
            // cell
            cellPadding: 0,
            cellTitleFontSize: "22.9rpx",
            cellTitleLineHeight: "38.17rpx",
            cellVerticalPaddingTop: "19.08rpx",
            cellLabelFontSize: "22.9rpx",
            cellLabelLineHeight: "38.17rpx",
            cellLabelMarginTop: 0,
            // input
            inputInnerHeight: "38.17rpx",
            // radio
            radioHorizontalMargin: "0 19.08rpx 0 0"
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
