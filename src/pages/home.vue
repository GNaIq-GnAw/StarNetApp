<script setup>
    import HomeBgT from "@/static/home-bg-t.png";

    definePage({
        name: "home",
        layout: "tabbar",
        style: {
            navigationBarTitleText: "首页"
        }
    });

    const {systemInfo} = useSystemInfo();
</script>

<template>
    <view class="h-full bg-#F3F4F4">
        <view
            :style="{
                'background': `url(${HomeBgT}) no-repeat`,
                'background-size': `100% calc(${systemInfo?.safeAreaInsets?.top}px + 288rpx)`,
                'padding-top': `calc(${systemInfo?.safeAreaInsets?.top}px + 24rpx)`
            }"
            class="px-40rpx pb-40rpx c-#ffffff"
        >
            <view class="mb-24rpx flex items-center">
                <view class="flex items-center">
                    <text class="text-32rpx lh-40rpx">默认记事</text>
                    <text class="i-mdi:chevron-down ml-12rpx size-40rpx" />
                </view>
                <view class="ml-auto">
                    <text class="i-carbon:search size-40rpx" />
                    <text class="i-carbon:add-large ml-32rpx size-40rpx" />
                </view>
            </view>
        </view>
    </view>
</template>

<style scoped></style>
