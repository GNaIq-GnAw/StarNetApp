<script setup>
    import {useForm} from "alova/client";

    const {form} = useForm(null, {id: "contact-info"});

    const getOverview = inject("getOverview");
    const createTag = inject("createTag");

    const onRemoveTag = async tag => {
        try {
            await Apis.contactTag.delete({pathParams: {contactId: form.value.contact.id, id: tag.id}});

            getOverview();
        } catch (e) {
            console.log("onRemoveTag -> failed", e);
        }
    };
</script>

<template>
    <view class="rd-7.63rpx bg-#ffffff">
        <view class="flex items-center p-[19.08rpx_38.17rpx]">
            <view class="h-19.08rpx w-3.82rpx bg-primary6" />
            <view class="ml-19.08rpx text-22.90rpx c-primary6 lh-38.17rpx">喜好</view>
            <view class="ml-auto text-19.08rpx c-#2F59F4 lh-38.17rpx" @click="createTag('like')">添加喜好</view>
        </view>
        <view v-if="form?.tags?.like?.length" class="p-[0_38.17rpx_19.08rpx]">
            <view class="flex flex-wrap text-19.08rpx lh-38.17rpx -m-4.77rpx">
                <view v-for="item in form.tags.like" :key="item.id" class="m-4.77rpx">
                    <wd-tag closable size="small" type="primary" @close="onRemoveTag(item)">
                        {{ item.tagContent }}
                    </wd-tag>
                </view>
            </view>
        </view>
    </view>
    <view class="mt-19.08rpx rd-7.63rpx bg-#ffffff">
        <view class="flex items-center p-[19.08rpx_38.17rpx]">
            <view class="h-19.08rpx w-3.82rpx bg-primary6" />
            <view class="ml-19.08rpx text-22.90rpx c-primary6 lh-38.17rpx">禁忌</view>
            <view class="ml-auto text-19.08rpx c-#2F59F4 lh-38.17rpx" @click="createTag('hate')">添加禁忌</view>
        </view>
        <view v-if="form?.tags?.hate?.length" class="p-[0_38.17rpx_19.08rpx]">
            <view class="flex flex-wrap text-19.08rpx lh-38.17rpx -m-4.77rpx">
                <view v-for="item in form.tags.hate" :key="item.id" class="m-4.77rpx">
                    <wd-tag closable size="small" type="primary" variant="light" @close="onRemoveTag(item)">
                        {{ item.tagContent }}
                    </wd-tag>
                </view>
            </view>
        </view>
    </view>
</template>

<style scoped></style>
