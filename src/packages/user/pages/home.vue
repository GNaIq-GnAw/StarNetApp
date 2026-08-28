<script setup>
    definePage({
        layout: "tabbar",
        style: {
            navigationBarTitleText: "我的"
        }
    });

    const {systemInfo} = useSystemInfo();
</script>

<template>
    <view :style="{'padding-top': `${systemInfo?.safeAreaInsets?.top}px`}" class="box-border h-full of-auto bg-#f3f4f4">
        <view class="p-[38.17rpx_19.08rpx]">
            <view class="mx-19.08rpx mb-38.17rpx flex">
                <view class="size-95.42rpx rd-47.71rpx bg-red" />
                <view class="ml-19.08rpx">
                    <view class="text-26.72rpx lh-57.25rpx">名字</view>
                    <view class="flex items-center c-#ffffff">
                        <view class="flex items-center rd-19.08rpx bg-#FBC050 p-[5.73rpx_9.54rpx]">
                            <view class="i-streamline:diamond-2-solid size-19.08rpx" />
                            <view class="ml-9.54rpx text-19.08rpx lh-26.72rpx">LEVEL 3</view>
                        </view>
                        <view class="ml-9.54rpx flex items-center rd-19.08rpx bg-#A2EF4D p-[5.73rpx_9.54rpx]">
                            <view class="i-ri:hearts-fill size-19.08rpx" />
                            <view class="ml-9.54rpx text-19.08rpx lh-26.72rpx">已陪伴您 23 天</view>
                        </view>
                    </view>
                </view>
                <view class="i-icon-park-outline:remind ml-auto size-38.17rpx" />
            </view>
            <view class="rd-19.08rpx bg-#ffffff p-[19.08rpx_38.17rpx]">
                <view class="mb-38.17rpx text-22.9rpx fw-600 lh-38.17rpx">更多功能</view>
                <view class="m-[-19.08rpx_-48.66rpx] flex flex-wrap px-19.08rpx">
                    <view v-for="i in 10" :key="i" class="m-[19.08rpx_48.66rpx] flex flex-col items-center">
                        <view class="size-38.17rpx bg-red" />
                        <view class="text-19.08rpx lh-38.17rpx">收支日历</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<style scoped></style>
