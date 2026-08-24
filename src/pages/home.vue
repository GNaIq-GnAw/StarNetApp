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

    onMounted(async () => {
        try {
            const res = await Apis.contact.getContacts();
            console.log("res", res);
        } catch (e) {
            console.log("e", e);
        }
    });
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
            <view class="mb-20rpx flex">
                <view>
                    <view class="text-24rpx lh-40rpx">
                        新增人脉
                    </view>
                    <view class="my-6rpx flex items-center lh-none">
                        <view class="text-48rpx">
                            300
                        </view>
                        <view class="ml-12rpx text-24rpx">
                            名
                        </view>
                    </view>
                </view>
                <view class="ml-auto h-40rpx w-150rpx rd-20rpx bg-#ffffff" />
            </view>
            <view class="flex items-center text-24rpx lh-40rpx">
                <view>
                    <text>产生成交</text>
                    <text class="ml-20rpx">22名</text>
                </view>
                <view class="mx-32rpx h-20rpx w-2rpx bg-#ffffff" />
                <view>
                    <text>产生支出</text>
                    <text class="ml-20rpx">300名</text>
                </view>
            </view>
        </view>
    </view>
</template>

<style scoped></style>
