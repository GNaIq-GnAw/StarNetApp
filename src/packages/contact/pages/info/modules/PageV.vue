<script setup>
    import {useForm} from "alova/client";
    import {resolvePage} from "@/router/resolve.js";

    const {form} = useForm(null, {id: "contact-info"});

    const getOverview = inject("getOverview");
    const createRelation = inject("createRelation");

    const editRelation = item => {
        const to = resolvePage({name: "ContactEditRelation"});

        uni.navigateTo({
            url: to.path,
            events: {
                "reload:data": getOverview
            },
            success: e => {
                e.eventChannel.emit("accept:relation-data", item);
            }
        });
    };

    const dialog = useGlobalDialog();

    const removeRelation = async item => {
        dialog.confirm({
            msg: "确认删除该数据吗？",
            beforeConfirm: async () => {
                uni.showLoading({mask: true, title: "删除中..."});

                try {
                    await Apis.contactRelation.delete({
                        pathParams: {contactId: form.value.contact.id, id: item.id}
                    });

                    uni.hideLoading();

                    return true;
                } catch (e) {
                    uni.hideLoading();

                    return Promise.reject(e);
                }
            },
            success: () => {
                uni.showToast({
                    title: "删除成功",
                    icon: "success",
                    mask: true,
                    success: () => {
                        getOverview();
                    }
                });
            }
        });
    };
</script>

<template>
    <view class="rd-7.63rpx bg-#ffffff">
        <view class="flex items-center p-[19.08rpx_38.17rpx_0]">
            <view class="h-19.08rpx w-3.82rpx bg-primary6" />
            <view class="ml-19.08rpx text-22.90rpx c-primary6 lh-38.17rpx">关系情况</view>
            <view class="ml-auto text-19.08rpx c-#2F59F4 lh-38.17rpx" @click="createRelation()">添加关系</view>
        </view>
        <view v-if="form?.relations.length" class="lh-38.17rpx">
            <view
                v-for="item in form.relations"
                :key="item.id"
                class="mx-19.08rpx b-b-(1px primary6/10 solid) bg-#ffffff p-19.08rpx last:b-b-none"
            >
                <view class="flex items-center">
                    <view class="text-22.90rpx">{{ item.name }}</view>
                    <view class="ml-11.45rpx text-19.08rpx c-primary6/50">{{ item.relation }}</view>
                    <view class="i-ri:edit-box-line ml-auto size-30.53rpx c-primary6" @click="editRelation(item)" />
                    <view
                        class="i-ri:close-large-line ml-30.53rpx size-30.53rpx c-primary6"
                        @click="removeRelation(item)"
                    />
                </view>
                <view class="flex items-center">
                    <view class="i-ri:cake-fill size-19.08rpx c-#FBC050" />
                    <view class="ml-11.45rpx text-19.08rpx c-primary6/50">
                        {{ formatDate(new Date(item.birthday), "yyyy年MM月dd日") }}
                    </view>
                </view>
                <view v-if="item?.formatedTags?.like?.length" class="mt-19.08rpx">
                    <view class="flex flex-wrap -m-4.77rpx">
                        <view v-for="tag in item.formatedTags.like" :key="tag.id" class="m-4.77rpx">
                            <wd-tag custom-class="!block" size="small" type="primary">{{ tag.tagContent }}</wd-tag>
                        </view>
                    </view>
                </view>
                <view v-if="item?.formatedTags?.hate?.length" class="mt-19.08rpx">
                    <view class="flex flex-wrap -m-4.77rpx">
                        <view v-for="tag in item.formatedTags.hate" :key="tag.id" class="m-4.77rpx">
                            <wd-tag custom-class="!block" size="small" type="primary" variant="light">
                                {{ tag.tagContent }}
                            </wd-tag>
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
