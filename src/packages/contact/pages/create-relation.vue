<script setup>
    import {zodAdapter} from "@wot-ui/ui";
    import {z} from "zod";
    import {resolvePage} from "@/router/resolve.js";

    const instance = getCurrentInstance().proxy;
    const eventChannel = instance.getOpenerEventChannel();

    const route = useRoute();

    const formRef = ref(null);

    const model = reactive({contactId: 0, relation: "", name: "", birthday: ""});

    const schema = zodAdapter(
        z.object({
            name: z.string().min(1, "请输入姓名"),
            relation: z.string().min(1, "请输入与联系人关系")
        }),
        {
            isRequired: path => ["name", "relation"].includes(path)
        }
    );

    const onSubmit = async () => {
        const {valid, errors} = await formRef.value?.validate();

        console.log("valid", valid, errors);

        if (!valid) return;

        uni.showLoading({mask: true});

        try {
            const {contactId, ...rest} = model;

            await Apis.contactRelation.create({
                pathParams: {contactId},
                data: {...rest}
            });

            uni.hideLoading();

            uni.showToast({
                title: "添加成功",
                icon: "success",
                mask: true,
                success: () => {
                    setTimeout(() => {
                        eventChannel.emit("reload:data");

                        uni.navigateBack();
                    }, 1500);
                }
            });
        } catch (e) {
            uni.showToast({title: e.message, icon: "none", mask: true});
            uni.hideLoading();
        }
    };

    const tags = ref(null);

    const getTags = async () => {
        uni.showLoading({mask: true});

        try {
            // 喜好
            const {data: like} = await Apis.contactTag.list({
                pathParams: {contactId: model.contactId},
                params: {tagType: "like"}
            });

            // 禁忌
            const {data: hate} = await Apis.contactTag.list({
                pathParams: {contactId: model.contactId},
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
            params: {tagType: type, contactId: model.contactId}
        });

        uni.navigateTo({
            url: to.fullPath,
            events: {
                "reload:data": getTags
            }
        });
    };

    onMounted(() => {
        model.contactId = route.query.contactId;
        getTags();
    });
</script>

<template>
    <view :style="{'--wot-navbar-bg': '#ffffff'}" class="h-full flex flex-col of-hidden bg-#f3f4f4">
        <wd-navbar
            :bordered="false"
            left-arrow
            left-text="添加关系"
            safe-area-inset-top
            @click-left="$navigateBack()"
        />
        <view :style="{'--wot-cell-padding': 0}" class="flex-1 of-auto">
            <wd-form
                ref="formRef"
                :model="model"
                :schema="schema"
                error-type="toast"
                layout="vertical"
                asterisk-position="end"
            >
                <view class="mt-19.08rpx bg-#ffffff p-[38.17rpx_19.08rpx]">
                    <view class="mx-19.08rpx">
                        <wd-form-item
                            label="可由汉字、英文与数字构成，最长不超过20个字"
                            prop="name"
                            title="姓名"
                            title-width="66.79rpx"
                        >
                            <wd-input
                                v-model="model.name"
                                :compact="false"
                                :maxlength="20"
                                placeholder="请输入姓名"
                                show-word-limit
                                type="text"
                            />
                        </wd-form-item>
                    </view>
                    <view class="my-38.17rpx h-1px bg-primary6/10" />
                    <view class="mx-19.08rpx">
                        <wd-form-item prop="relation" title="与联系人关系" title-width="158.40rpx">
                            <wd-input
                                v-model="model.relation"
                                :compact="false"
                                :maxlength="20"
                                placeholder="请输入与联系人关系"
                                show-word-limit
                                type="text"
                            />
                        </wd-form-item>
                    </view>
                    <view class="my-38.17rpx h-1px bg-primary6/10" />
                    <view class="mx-19.08rpx">
                        <wd-form-item prop="birthday" title-width="100%">
                            <template #title>
                                <view class="w-full flex items-center">
                                    <view>生日日期</view>
                                    <view class="ml-auto flex items-center">
                                        <text>日期提醒</text>
                                        <view class="ml-19.08rpx">
                                            <wd-switch size="38.17rpx" />
                                        </view>
                                    </view>
                                </view>
                            </template>
                            <custom-datetime-picker
                                v-model:formated-value="model.birthday"
                                placeholder="请选择生日日期"
                                type="date"
                            />
                        </wd-form-item>
                    </view>
                </view>
            </wd-form>
            <view class="mt-19.08rpx bg-#ffffff">
                <view class="flex items-center p-[19.08rpx_38.17rpx]">
                    <view class="text-22.90rpx c-primary6 lh-38.17rpx">喜好</view>
                    <view class="ml-auto text-19.08rpx c-#2F59F4 lh-38.17rpx" @click="onCreateTag('like')">
                        添加喜好
                    </view>
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
            <view class="mt-19.08rpx bg-#ffffff">
                <view class="flex items-center p-[19.08rpx_38.17rpx]">
                    <view class="text-22.90rpx c-primary6 lh-38.17rpx">禁忌</view>
                    <view class="ml-auto text-19.08rpx c-#2F59F4 lh-38.17rpx" @click="onCreateTag('hate')">
                        添加禁忌
                    </view>
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
        </view>
        <view class="flex items-center rd-7.63rpx bg-#ffffff p-[19.08rpx_38.17rpx]">
            <view class="w-190.84rpx">
                <wd-button block variant="plain">取消</wd-button>
            </view>
            <view class="ml-19.08rpx flex-1">
                <wd-button block @click="onSubmit()">保存</wd-button>
            </view>
        </view>
    </view>
</template>

<style scoped></style>
