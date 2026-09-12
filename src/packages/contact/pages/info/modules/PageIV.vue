<script setup></script>

<template>
    <view class="rd-7.63rpx bg-#ffffff">
        <view class="flex items-center p-[19.08rpx_38.17rpx_0]">
            <view class="h-19.08rpx w-3.82rpx bg-primary6" />
            <view class="ml-19.08rpx text-22.90rpx c-primary6 lh-38.17rpx">喜好</view>
            <view class="ml-auto text-19.08rpx c-#2F59F4 lh-38.17rpx">添加喜好</view>
        </view>
        <view class="p-[19.08rpx_38.17rpx]">
            <view class="flex flex-wrap text-19.08rpx lh-38.17rpx -m-4.77rpx">
                <view v-for="i in 20" :key="i" class="m-4.77rpx">
                    <wd-tag closable size="small" type="primary">奶油蛋糕-{{ i }}</wd-tag>
                </view>
            </view>
        </view>
    </view>
    <view class="mt-19.08rpx rd-7.63rpx bg-#ffffff">
        <view class="flex items-center p-[19.08rpx_38.17rpx_0]">
            <view class="h-19.08rpx w-3.82rpx bg-primary6" />
            <view class="ml-19.08rpx text-22.90rpx c-primary6 lh-38.17rpx">禁忌</view>
            <view class="ml-auto text-19.08rpx c-#2F59F4 lh-38.17rpx">添加禁忌</view>
        </view>
        <view class="p-[19.08rpx_38.17rpx]">
            <view class="flex flex-wrap text-19.08rpx lh-38.17rpx -m-4.77rpx">
                <view v-for="i in 20" :key="i" class="m-4.77rpx">
                    <wd-tag closable size="small" type="primary" variant="light">奶油蛋糕-{{ i }}</wd-tag>
                </view>
            </view>
        </view>
    </view>
</template>

<style scoped></style>
