<script setup>
    import {zodAdapter} from "@wot-ui/ui";
    import {z} from "zod";

    const instance = getCurrentInstance().proxy;
    const eventChannel = instance.getOpenerEventChannel();

    const formRef = ref(null);

    const model = reactive({name: ""});

    const schema = zodAdapter(
        z.object({
            name: z.string().min(1, "请输入记事本名称")
        }),
        {
            isRequired: path => path === "name"
        }
    );

    const onSubmit = async () => {
        const {valid, errors} = await formRef.value?.validate();

        console.log("valid", valid, errors);

        if (!valid) return;

        uni.showLoading({mask: true});

        try {
            await Apis.notebook.createNotebook({data: {...model}});

            uni.hideLoading();

            uni.showToast({
                title: "创建成功",
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
</script>

<template>
    <view class="h-full flex flex-col of-hidden bg-#f3f4f4">
        <wd-navbar
            :bordered="false"
            left-arrow
            left-text="添加记事本"
            safe-area-inset-top
            @click-left="$navigateBack()"
        />
        <view :style="{'--wot-cell-padding': 0}" class="flex-1 of-auto">
            <wd-form
                ref="formRef"
                :model="model"
                :schema="schema"
                error-type="toast"
                hide-asterisk
                layout="vertical"
                title-width="100%"
            >
                <view class="mt-19.08rpx bg-#ffffff p-[38.17rpx_19.08rpx]">
                    <view class="mx-19.08rpx">
                        <wd-form-item label="可由汉字、英文与数字构成，最长不超过10个字符" prop="name">
                            <template #title>
                                <text>记事本名称</text>
                                <text class="ml-7.63rpx text-22.9rpx c-[var(--wot-danger-main)] lh-38.17rpx">*</text>
                            </template>
                            <wd-input
                                v-model="model.name"
                                :compact="false"
                                :maxlength="10"
                                placeholder="请输入记事本名称"
                                show-word-limit
                                type="text"
                            />
                        </wd-form-item>
                    </view>
                    <!--                    <view class="my-38.17rpx h-1px bg-primary6/10" /> -->
                    <!--                    <view class="mx-19.08rpx"> -->
                    <!--                        <wd-form-item -->
                    <!--                            label="记事本如果设置为隐私状态，使用时需要先进行解密操作" -->
                    <!--                            prop="isPrivate" -->
                    <!--                            title="是否为隐私记事" -->
                    <!--                        > -->
                    <!--                            <wd-radio-group v-model="model.isPrivate" direction="horizontal"> -->
                    <!--                                <wd-radio :value="1"> -->
                    <!--                                    <template #icon="{isChecked}"> -->
                    <!--                                        <wd-button :type="isChecked ? 'primary' : 'info'" size="small">正常</wd-button> -->
                    <!--                                    </template> -->
                    <!--                                </wd-radio> -->
                    <!--                                <wd-radio :value="2"> -->
                    <!--                                    <template #icon="{isChecked}"> -->
                    <!--                                        <wd-button :type="isChecked ? 'primary' : 'info'" size="small">隐私</wd-button> -->
                    <!--                                    </template> -->
                    <!--                                </wd-radio> -->
                    <!--                            </wd-radio-group> -->
                    <!--                        </wd-form-item> -->
                    <!--                    </view> -->
                </view>
                <!--                <view class="mt-19.08rpx bg-#ffffff p-[38.17rpx_19.08rpx]"> -->
                <!--                    <view class="mx-19.08rpx"> -->
                <!--                        <wd-form-item label="可为记事本添加独特皮肤，彰显私人个性" prop="xxx3" title="记事本皮肤"> -->
                <!--                            <view class="flex flex-wrap -m-9.54rpx"> -->
                <!--                                <image -->
                <!--                                    v-for="i in 10" -->
                <!--                                    :key="i" -->
                <!--                                    :class="{'outline-(2px solid #fbc050)': i === 1}" -->
                <!--                                    class="m-9.54rpx h-114.5rpx w-190.84rpx rd-7.63rpx" -->
                <!--                                    src="@/static/home-bg-t.png" -->
                <!--                                /> -->
                <!--                            </view> -->
                <!--                        </wd-form-item> -->
                <!--                    </view> -->
                <!--                </view> -->
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
