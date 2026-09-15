<script setup>
    import {useForm} from "alova/client";
    import {resolvePage} from "@/router/resolve.js";

    const {form} = useForm(null, {id: "contact-info"});

    const tags = ref(null);

    const getTags = async () => {
        uni.showLoading({mask: true});

        try {
            // 喜好
            const {data: like} = await Apis.contactTag.list({
                pathParams: {contactId: form.value.contact.id},
                params: {tagType: "like"}
            });

            // 禁忌
            const {data: hate} = await Apis.contactTag.list({
                pathParams: {contactId: form.value.contact.id},
                params: {tagType: "hate"}
            });

            tags.value = {like, hate};
        } finally {
            uni.hideLoading();
        }
    };

    const onCreateTag = type => {
        const to = resolvePage({
            name: "ContactCreateTag",
            params: {tagType: type, contactId: form.value.contact.id}
        });

        uni.navigateTo({
            url: to.fullPath,
            events: {
                "reload:data": getTags
            }
        });
    };

    const onRemoveTag = async tag => {
        try {
            await Apis.contactTag.delete({pathParams: {contactId: form.value.contact.id, id: tag.id}});

            getTags();
        } catch (e) {
            console.log("onRemoveTag -> failed", e);
        }
    };

    onMounted(getTags);
</script>

<template>
    <view class="rd-7.63rpx bg-#ffffff">
        <view class="flex items-center p-[19.08rpx_38.17rpx]">
            <view class="h-19.08rpx w-3.82rpx bg-primary6" />
            <view class="ml-19.08rpx text-22.90rpx c-primary6 lh-38.17rpx">喜好</view>
            <view class="ml-auto text-19.08rpx c-#2F59F4 lh-38.17rpx" @click="onCreateTag('like')">添加喜好</view>
        </view>
        <view v-if="tags?.like?.length" class="p-[0_38.17rpx_19.08rpx]">
            <view class="flex flex-wrap text-19.08rpx lh-38.17rpx -m-4.77rpx">
                <view v-for="item in tags.like" :key="item.id" class="m-4.77rpx">
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
            <view class="ml-auto text-19.08rpx c-#2F59F4 lh-38.17rpx" @click="onCreateTag('hate')">添加禁忌</view>
        </view>
        <view v-if="tags?.hate?.length" class="p-[0_38.17rpx_19.08rpx]">
            <view class="flex flex-wrap text-19.08rpx lh-38.17rpx -m-4.77rpx">
                <view v-for="item in tags.hate" :key="item.id" class="m-4.77rpx">
                    <wd-tag closable size="small" type="primary" variant="light" @close="onRemoveTag(item)">
                        {{ item.tagContent }}
                    </wd-tag>
                </view>
            </view>
        </view>
    </view>
</template>

<style scoped></style>
