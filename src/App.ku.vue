<script setup>
    const {systemInfo} = useSystemInfo();

    const primary6$10 = withAlpha(Theme.primary6, 0.1);
    const primary6$50 = withAlpha(Theme.primary6, 0.5);

    const themeVars = {
        /* base */
        ...Theme,
        textMain: Theme.primary6,
        borderMain: primary6$10,
        /* button */
        buttonRadiusMain: "7.63rpx",
        buttonHeightSmall: "57.25rpx",
        buttonHeightMedium: "76.34rpx",
        buttonHeightLarge: "83.97rpx",
        buttonFontSizeSmall: "19.08rpx",
        buttonFontSizeMedium: "26.72rpx",
        /* checkbox */
        checkboxIconSize: "26.72rpx",
        checkboxLabelFontSize: "19.08rpx",
        checkboxLabelLineHeight: "38.17rpx",
        checkboxLabelMargin: "11.45rpx",
        /* navbar */
        navbarArrowSize: "38.17rpx",
        navbarColor: "#101010",
        navbarDescFontSize: "30.53rpx",
        navbarHeight: "83.97rpx",
        navbarLeftPadding: "0 38.17rpx",
        navbarDescColor: "#101010",
        /* cell */
        cellTitleFontSize: "22.9rpx",
        cellTitleLineHeight: "38.17rpx",
        cellVerticalPaddingTop: "19.08rpx",
        cellLabelFontSize: "22.9rpx",
        cellLabelLineHeight: "38.17rpx",
        cellLabelMarginTop: 0,
        // cellArrowSize: "38.17rpx",
        // cellArrowMarginLeft: "19.08rpx",
        cellValueFontSize: "22.9rpx",
        cellValueLineHeight: "38.17rpx",
        cellValueColor: primary6$50,
        cellIconSize: "38.17rpx",
        cellIconColor: primary6$50,
        cellGroupInsertMargin: 0,
        cellGroupInsertRadius: "19.08rpx",
        /* input */
        inputInnerHeight: "38.17rpx",
        inputPadding: "9.54rpx 19.08rpx",
        /* radio */
        radioHorizontalMargin: "0 19.08rpx 0 0",
        /* tabs */
        tabsNavItemFontSize: "22.9rpx",
        tabsNavItemLineHeight: "38.17rpx",
        tabsNavColor: primary6$50,
        tabsNavItemPadding: "19.08rpx",
        /* search */
        searchInputBg: "#f3f4f4",
        searchInputRadius: "7.63rpx",
        searchFieldPadding: "0 19.08rpx",
        searchInputHeight: "57.25rpx",
        searchIconSize: "38.17rpx",
        searchLeftIconMarginRight: "11.45rpx",
        searchInputFontSize: "22.9rpx",
        searchInputLineHeight: "38.17rpx",
        searchBlockMarginRight: "38.17rpx",
        searchPadding: "13.36rpx 38.17rpx",
        searchCancelFontSize: "22.9rpx",
        searchCancelLineHeight: "38.17rpx"
    };
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
