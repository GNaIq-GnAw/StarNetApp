<script setup>
    import {useForm} from "alova/client";
    import {NoteIcon, NoteItems} from "./_components.js";

    const {form} = useForm(null, {id: "contact-info"});
</script>

<template>
    <view class="rd-7.63rpx bg-#ffffff">
        <view class="flex items-center p-[19.08rpx_38.17rpx_0]">
            <view class="h-19.08rpx w-3.82rpx bg-primary6" />
            <view class="ml-19.08rpx text-22.90rpx c-primary6 lh-38.17rpx">跟进记事</view>
            <view class="ml-auto text-19.08rpx c-#492FD3 lh-38.17rpx">查看更多</view>
        </view>
        <view v-if="form?.recentNotes?.length" class="p-[19.08rpx_38.17rpx]">
            <view v-for="row in form.recentNotes" :key="row.id" class="custom-line flex not-last:mb-9.54rpx">
                <note-icon :type="row.noteType" />
                <view class="mb-9.54rpx ml-19.08rpx flex-1">
                    <view class="text-19.08rpx c-primary6/50 lh-38.17rpx">
                        {{ formatDate(Date.now(), "yyyy年MM月dd日 aaa hh:mm") }}
                    </view>
                    <component :is="NoteItems?.[row.noteType]" :row="row" />
                </view>
            </view>
        </view>
        <view v-else class="py-57.25rpx">
            <view class="flex flex-col items-center">
                <view class="i-icon-park-outline:termination-file size-76.34rpx c-primary6/10" />
                <view class="mt-19.08rpx text-22.90rpx c-primary6/50 lh-38.17rpx">未查询到跟进记事信息</view>
                <view class="text-19.08rpx c-#2F59F4 lh-38.17rpx">添加记事</view>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
    .custom-line {
        @apply relative not-last:before:(absolute top-47.71rpx b-l-1px b-l-#bbbbbb b-l-dashed content-empty bottom-0 left-19.08rpx);
    }
</style>
