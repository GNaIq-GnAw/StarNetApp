<script setup>
    import {useForm} from "alova/client";
    import {resolvePage} from "@/router/resolve.js";

    const {form} = useForm(null, {id: "contact-info"});

    const {data: relations, send: getRelations} = useRequest(
        () => {
            return Apis.contactRelation.list({pathParams: {contactId: form.value.contact.id}});
        },
        {
            immediate: false,
            initialData: [],
            middleware: async (_, next) => {
                uni.showLoading({mask: true});

                try {
                    const {data} = await next();

                    return data;
                } finally {
                    uni.hideLoading();
                }
            }
        }
    );

    const onCreateRelation = () => {
        const to = resolvePage({name: "ContactCreateRelation", params: {contactId: form.value.contact.id}});

        uni.navigateTo({
            url: to.fullPath,
            events: {
                "reload:data": getRelations
            }
        });
    };

    onMounted(getRelations);
</script>

<template>
    <view class="rd-7.63rpx bg-#ffffff">
        <view class="flex items-center p-[19.08rpx_38.17rpx_0]">
            <view class="h-19.08rpx w-3.82rpx bg-primary6" />
            <view class="ml-19.08rpx text-22.90rpx c-primary6 lh-38.17rpx">关系情况</view>
            <view class="ml-auto text-19.08rpx c-#2F59F4 lh-38.17rpx" @click="onCreateRelation()">添加关系</view>
        </view>
        <view v-if="relations.length" class="lh-38.17rpx">
            <view
                v-for="item in relations"
                :key="item.id"
                class="mx-19.08rpx b-b-(1px primary6/10 solid) bg-#ffffff p-19.08rpx last:b-b-none"
            >
                <view class="flex items-center">
                    <view class="text-22.90rpx">{{ item.name }}</view>
                    <view class="ml-11.45rpx text-19.08rpx c-primary6/50">{{ item.relation }}</view>
                    <view class="i-ri:edit-box-line ml-auto size-30.53rpx c-primary6" />
                    <view class="i-ri:close-large-line ml-30.53rpx size-30.53rpx c-primary6" />
                </view>
                <view class="flex items-center">
                    <view class="i-ri:cake-fill size-19.08rpx c-#FBC050" />
                    <view class="ml-11.45rpx text-19.08rpx c-primary6/50">
                        {{ formatDate(new Date(item.birthday), "yyyy年MM月dd日") }}
                    </view>
                </view>
                <view class="mt-19.08rpx">
                    <view class="flex flex-wrap -m-4.77rpx">
                        <view v-for="i in 6" :key="i" class="m-4.77rpx">
                            <wd-tag custom-class="!block" size="small" type="primary">奶油蛋糕-{{ i }}</wd-tag>
                        </view>
                    </view>
                </view>
                <view class="mt-19.08rpx">
                    <view class="flex flex-wrap -m-4.77rpx">
                        <view class="m-4.77rpx">
                            <wd-tag custom-class="!block" size="small" type="primary" variant="light">橘子香蕉</wd-tag>
                        </view>
                        <view class="m-4.77rpx">
                            <wd-tag custom-class="!block" size="small" type="primary" variant="light">FPS游戏</wd-tag>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view v-else class="p-[76.34rpx_0_57.25rpx]">
            <view class="flex flex-col items-center">
                <view class="i-icon-park-outline:termination-file size-76.34rpx c-primary6/10" />
                <view class="mt-19.08rpx text-22.90rpx c-primary6/50 lh-38.17rpx">未查询到关系情况信息</view>
            </view>
        </view>
    </view>
</template>

<style scoped></style>
