<script setup>
    definePage({
        layout: "tabbar",
        style: {
            navigationBarTitleText: "我的"
        }
    });

    const {systemInfo} = useSystemInfo();

    const onToast = () => {
        uni.showToast({title: "敬请期待..", icon: "none"});
    };
</script>

<template>
    <view :style="{'padding-top': `${systemInfo?.safeAreaInsets?.top}px`}" class="box-border h-full of-auto bg-#f3f4f4">
        <view
            :style="{
                '--wot-cell-padding': '19.08rpx 38.17rpx',
                '--wot-cell-value-font-size': '19.08rpx'
            }"
            class="p-[38.17rpx_19.08rpx]"
        >
            <view class="mx-19.08rpx mb-38.17rpx flex">
                <view class="size-95.42rpx rd-47.71rpx bg-red" @click="$Router.push({name: 'UserInfo'})" />
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
                <view class="m-[-19.08rpx_-48.66rpx] flex flex-wrap px-19.08rpx" @click="onToast">
                    <view class="m-[19.08rpx_48.66rpx] flex flex-col items-center">
                        <view class="i-ri:calendar-line size-38.17rpx c-primary6/50" />
                        <view class="text-19.08rpx c-primary6 lh-38.17rpx">收支日历</view>
                    </view>
                    <view class="m-[19.08rpx_48.66rpx] flex flex-col items-center">
                        <view class="i-icon-park-outline:chart-proportion size-38.17rpx c-primary6/50" />
                        <view class="text-19.08rpx c-primary6 lh-38.17rpx">收支分析</view>
                    </view>
                    <view class="m-[19.08rpx_48.66rpx] flex flex-col items-center">
                        <view class="i-icon-park-outline:chart-histogram size-38.17rpx c-primary6/50" />
                        <view class="text-19.08rpx c-primary6 lh-38.17rpx">人脉分析</view>
                    </view>
                    <view class="m-[19.08rpx_48.66rpx] flex flex-col items-center">
                        <view class="i-ant-design:import-outlined size-38.17rpx c-primary6/50" />
                        <view class="text-19.08rpx c-primary6 lh-38.17rpx">数据导入</view>
                    </view>
                    <view class="m-[19.08rpx_48.66rpx] flex flex-col items-center">
                        <view class="i-ant-design:export-outlined size-38.17rpx c-primary6/50" />
                        <view class="text-19.08rpx c-primary6 lh-38.17rpx">数据导出</view>
                    </view>
                </view>
            </view>
            <view class="mt-19.08rpx">
                <wd-cell-group title-width="91.6rpx" insert>
                    <wd-cell clickable css-icon suffix-icon="i-carbon-chevron-right !size-38.17rpx" title="个人中心">
                        <view class="c-#F95585">未设置手机号码与密码，账号存在风险</view>
                    </wd-cell>
                    <wd-cell
                        clickable
                        css-icon
                        suffix-icon="i-carbon-chevron-right !size-38.17rpx"
                        title="记事本"
                        @click="$Router.push({name: 'UserNotebookManage'})"
                    />
                    <wd-cell clickable css-icon suffix-icon="i-carbon-chevron-right !size-38.17rpx" title="收支类型" />
                    <wd-cell title="提醒设置" value="下午08:30">
                        <view class="flex items-center justify-end">
                            <view class="c-primary6/50">下午08:30</view>
                            <view class="ml-19.08rpx">
                                <wd-switch size="38.17rpx" />
                            </view>
                        </view>
                    </wd-cell>
                </wd-cell-group>
            </view>
            <view class="mt-19.08rpx">
                <wd-cell-group insert title-width="91.6rpx">
                    <wd-cell
                        clickable
                        css-icon
                        suffix-icon="i-carbon-chevron-right !size-38.17rpx"
                        title="隐私管理"
                        value="未开启"
                    />
                </wd-cell-group>
            </view>
            <view class="mt-19.08rpx">
                <wd-cell-group insert title-width="91.6rpx">
                    <wd-cell clickable css-icon suffix-icon="i-carbon-chevron-right !size-38.17rpx" title="反馈意见" />
                    <wd-cell clickable css-icon suffix-icon="i-carbon-chevron-right !size-38.17rpx" title="关于" />
                </wd-cell-group>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped></style>
