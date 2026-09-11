<script setup>
    import {useForm} from "alova/client";
    import {NoteIcon, NoteItems} from "./_components.js";

    const {form} = useForm(null, {id: "contact-info"});

    // form.value.recentNotes = Array.from({length: 20})
    //     .fill(0)
    //     .map((_, index) => {
    //         return {
    //             "callDuration": 0,
    //             "callType": "",
    //             "contactId": 0,
    //             "content":
    //                 "内容：您可以前往开户行的柜台办理提前支取手续，需要携带有效的身份证件及存单。银行柜员会根据您的要求进行提前支取操作，并将支取金额划入您的指定账户。",
    //             "createTime": formatDatetime(generateMockData.timestamp()),
    //             "eventTime": formatDatetime(generateMockData.timestamp()),
    //             "id": index,
    //             "lat": 0,
    //             "lng": 0,
    //             "modifyTime": "",
    //             // 记事类型：call-电话联系，sms-短信联系，normal-普通记事，visit-拜访记事
    //             "noteType": generateMockData.pick(["call", "sms", "normal", "visit"]),
    //             "notebookId": 0,
    //             "phone": generateMockData.mobile(),
    //             "smsType": "",
    //             "visitAddress": ""
    //         };
    //     });
</script>

<template>
    <view class="rd-7.63rpx bg-#ffffff">
        <view class="flex items-center p-[19.08rpx_38.17rpx_0]">
            <view class="h-19.08rpx w-3.82rpx bg-primary6" />
            <view class="ml-19.08rpx text-22.90rpx c-primary6 lh-38.17rpx">跟进记事</view>
        </view>
        <view v-if="form?.recentNotes?.length" class="p-[19.08rpx_38.17rpx]">
            <view v-for="row in form.recentNotes" :key="row.id" class="flex not-last:mb-9.54rpx">
                <note-icon :type="row.noteType" />
                <view
                    class="relative mb-9.54rpx ml-19.08rpx flex-1 before:(absolute top-47.71rpx b-l-1px b-l-#bbbbbb b-l-dashed content-empty -bottom-9.54rpx -left-38.17rpx)"
                >
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

<style scoped></style>
