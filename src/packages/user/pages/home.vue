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
        <view class="p-[40rpx_20rpx]">
            <view class="mx-20rpx mb-40rpx flex">
                <view class="size-100rpx rd-50rpx bg-red" />
                <view class="ml-20rpx">
                    <view class="text-28rpx lh-60rpx">名字</view>
                    <view class="flex items-center c-#ffffff">
                        <view class="flex items-center rd-20rpx bg-#FBC050 p-[6rpx_10rpx]">
                            <view class="i-streamline:diamond-2-solid size-20rpx" />
                            <view class="ml-10rpx text-20rpx lh-28rpx">LEVEL 3</view>
                        </view>
                        <view class="ml-10rpx flex items-center rd-20rpx bg-#A2EF4D p-[6rpx_10rpx]">
                            <view class="i-ri:hearts-fill size-20rpx" />
                            <view class="ml-10rpx text-20rpx lh-28rpx">已陪伴您 23 天</view>
                        </view>
                    </view>
                </view>
                <view class="i-icon-park-outline:remind ml-auto size-40rpx" />
            </view>
            <view class="rd-20rpx bg-#ffffff p-[20rpx_40rpx]">
                <view class="mb-40rpx text-24rpx fw-600 lh-40rpx">更多功能</view>
                <view class="m-[-20rpx_-51rpx] flex flex-wrap px-20rpx">
                    <view v-for="i in 10" :key="i" class="m-[20rpx_45rpx] flex flex-col items-center">
                        <view class="size-40rpx bg-red" />
                        <view class="w-80rpx text-20rpx lh-40rpx">收支日历</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<style scoped></style>
