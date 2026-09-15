<script setup></script>

<template>
    <view class="rd-7.63rpx bg-#ffffff">
        <view class="flex items-center p-[19.08rpx_38.17rpx_0]">
            <view class="h-19.08rpx w-3.82rpx bg-primary6" />
            <view class="ml-19.08rpx text-22.90rpx c-primary6 lh-38.17rpx">关系情况</view>
            <view class="ml-auto text-19.08rpx c-#2F59F4 lh-38.17rpx">添加关系</view>
        </view>
        <view class="lh-38.17rpx">
            <view class="mx-19.08rpx b-b-(1px primary6/10 solid) bg-#ffffff p-19.08rpx last:b-b-none">
                <view class="flex items-center">
                    <view class="text-22.90rpx">张女士</view>
                    <view class="ml-11.45rpx text-19.08rpx c-primary6/50">母亲</view>
                    <view class="i-ri:edit-box-line ml-auto size-30.53rpx c-primary6" />
                    <view class="i-ri:close-large-line ml-30.53rpx size-30.53rpx c-primary6" />
                </view>
                <view class="flex items-center">
                    <view class="i-ri:cake-fill size-19.08rpx c-#FBC050" />
                    <view class="ml-11.45rpx text-19.08rpx c-primary6/50">1955年01月23日</view>
                </view>
                <view class="mt-19.08rpx">
                    <view class="flex flex-wrap -m-4.77rpx">
                        <view v-for="i in 6" :key="i" class="m-4.77rpx">
                            <wd-tag size="small" type="primary" custom-class="!block">奶油蛋糕-{{ i }}</wd-tag>
                        </view>
                    </view>
                </view>
                <view class="mt-19.08rpx">
                    <view class="flex flex-wrap -m-4.77rpx">
                        <view class="m-4.77rpx">
                            <wd-tag size="small" type="primary" variant="light" custom-class="!block">橘子香蕉</wd-tag>
                        </view>
                        <view class="m-4.77rpx">
                            <wd-tag size="small" type="primary" variant="light" custom-class="!block">FPS游戏</wd-tag>
                        </view>
                    </view>
                </view>
            </view>
            <view class="mx-19.08rpx b-b-(1px primary6/10 solid) bg-#ffffff p-19.08rpx last:b-b-none">
                <view class="flex items-center">
                    <view class="text-22.90rpx">张女士</view>
                    <view class="ml-11.45rpx text-19.08rpx c-primary6/50">母亲</view>
                    <view class="i-ri:edit-box-line ml-auto size-30.53rpx c-primary6" />
                    <view class="i-ri:close-large-line ml-30.53rpx size-30.53rpx c-primary6" />
                </view>
                <view class="flex items-center">
                    <view class="i-ri:cake-fill size-19.08rpx c-#FBC050" />
                    <view class="ml-11.45rpx text-19.08rpx c-primary6/50">1955年01月23日</view>
                </view>
                <view class="mt-19.08rpx">
                    <view class="flex flex-wrap -m-4.77rpx">
                        <view v-for="i in 6" :key="i" class="m-4.77rpx">
                            <wd-tag size="small" type="primary" custom-class="!block">奶油蛋糕-{{ i }}</wd-tag>
                        </view>
                    </view>
                </view>
                <view class="mt-19.08rpx">
                    <view class="flex flex-wrap -m-4.77rpx">
                        <view class="m-4.77rpx">
                            <wd-tag size="small" type="primary" variant="light" custom-class="!block">橘子香蕉</wd-tag>
                        </view>
                        <view class="m-4.77rpx">
                            <wd-tag size="small" type="primary" variant="light" custom-class="!block">FPS游戏</wd-tag>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<style scoped></style>
