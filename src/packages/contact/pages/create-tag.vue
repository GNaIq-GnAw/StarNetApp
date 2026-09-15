<script setup>
    import {zodAdapter} from "@wot-ui/ui";
    import {z} from "zod";
    import {TagType} from "@/dictionaries/contact.js";

    const instance = getCurrentInstance().proxy;
    const eventChannel = instance.getOpenerEventChannel();

    const notebookStore = useNotebookStore();

    const route = useRoute();

    const formRef = ref(null);

    const model = reactive({contactId: 0, tagType: "", tagContent: ""});

    const schema = zodAdapter(
        z.object({
            tagType: z.string().min(1, "请选择标签类型"),
            tagContent: z.string().min(1, "请输入标签名称")
        }),
        {
            isRequired: () => true
        }
    );

    const onSubmit = async () => {
        const {valid, errors} = await formRef.value?.validate();

        console.log("valid", valid, errors);

        if (!valid) return;

        uni.showLoading({mask: true});

        try {
            const {contactId, ...rest} = model;

            await Apis.contactTag.create({
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

    onMounted(() => {
        model.contactId = route.query.contactId;
        model.tagType = route.query.tagType;
    });
</script>

<template>
    <view :style="{'--wot-navbar-bg': '#ffffff'}" class="h-full flex flex-col of-hidden bg-#f3f4f4">
        <wd-navbar
            :bordered="false"
            left-arrow
            left-text="添加喜好禁忌"
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
                        <wd-form-item prop="tagType" title="喜好与禁忌" title-width="133.59rpx">
                            <custom-picker
                                v-model:value="model.tagType"
                                :columns="TagType.items"
                                placeholder="请选择标签类型"
                            />
                        </wd-form-item>
                    </view>
                    <view class="my-38.17rpx h-1px bg-primary6/10" />
                    <view class="mx-19.08rpx">
                        <wd-form-item
                            label="可由汉字、英文与数字构成，最长不超过10个字"
                            prop="tagContent"
                            title="标签名称"
                            title-width="114.50rpx"
                        >
                            <wd-input
                                v-model="model.tagContent"
                                :compact="false"
                                :maxlength="10"
                                placeholder="请输入记事本名称"
                                show-word-limit
                                type="text"
                            />
                        </wd-form-item>
                    </view>
                </view>
            </wd-form>
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
