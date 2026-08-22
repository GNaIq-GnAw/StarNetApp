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
            checkboxIconSize: "28rpx"
        };
    });
</script>

<template>
    <wd-config-provider :theme-vars="themeVars">
        <view
            :style="{
                '--safe-area-bottom': `${systemInfo?.safeAreaInsets?.bottom}px`
            }"
            class="app bg-#F3F4F4"
        >
            <ku-root-view />
        </view>
        <wd-toast position="middle" />
        <wd-dialog />
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
