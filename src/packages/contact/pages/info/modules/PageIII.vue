<script setup>
    import {useForm} from "alova/client";

    const {form} = useForm(null, {id: "contact-info"});
</script>

<template>
    <view class="rd-7.63rpx bg-#ffffff">
        <view class="flex items-center p-[19.08rpx_38.17rpx_0]">
            <view class="h-19.08rpx w-3.82rpx bg-primary6" />
            <view class="ml-19.08rpx text-22.90rpx c-primary6 lh-38.17rpx">收支记录</view>
            <view class="ml-auto text-19.08rpx c-#492FD3 lh-38.17rpx">查看更多</view>
        </view>
        <view v-if="form?.financeRecords?.length" class="p-[19.08rpx_38.17rpx] lh-38.17rpx">
            <view v-for="row in form.financeRecords" :key="row.id" class="custom-line flex not-last:mb-9.54rpx">
                <view class="size-38.17rpx rd-19.08rpx bg-red" />
                <view class="mb-9.54rpx ml-19.08rpx flex-1">
                    <view class="flex items-center">
                        <view class="text-19.08rpx c-primary6/50">
                            {{ formatDate(Date.now(), "yyyy年MM月dd日 aaa hh:mm") }}
                        </view>
                        <view v-if="row.isRefund" class="ml-auto text-19.08rpx c-primary6/50">退款</view>
                    </view>
                    <view class="flex items-center">
                        <view class="text-22.90rpx fw-600">{{ row.typeName }}</view>
                        <view
                            :class="{'!c-#F95585': row.category === '成交'}"
                            class="ml-auto text-26.72rpx c-primary6 fw-600"
                        >
                            <text>{{ row.category === "成交" ? "+" : "-" }}</text>
                            <text>{{ row.amount }}</text>
                        </view>
                    </view>
                    <view
                        v-if="row.remark"
                        class="mt-9.54rpx rd-7.63rpx bg-#F3F4F4 p-[9.54rpx_19.08rpx] text-19.08rpx c-primary6/50 lh-28.63rpx"
                    >
                        备注：{{ row.remark }}
                    </view>
                </view>
            </view>
        </view>
        <view v-else class="py-57.25rpx">
            <view class="flex flex-col items-center">
                <view class="i-icon-park-outline:termination-file size-76.34rpx c-primary6/10" />
                <view class="mt-19.08rpx text-22.90rpx c-primary6/50 lh-38.17rpx">未查询到收支记录信息</view>
                <view class="text-19.08rpx c-#2F59F4 lh-38.17rpx">添加收支</view>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
    .custom-line {
        @apply relative not-last:before:(absolute top-47.71rpx b-l-1px b-l-#bbbbbb b-l-dashed content-empty bottom-0 left-19.08rpx);
    }
</style>
