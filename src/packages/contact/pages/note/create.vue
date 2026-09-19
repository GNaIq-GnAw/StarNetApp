<script setup>
    import {zodAdapter} from "@wot-ui/ui";
    import {z} from "zod";

    const instance = getCurrentInstance().proxy;
    const eventChannel = instance.getOpenerEventChannel();

    const route = useRoute();

    const formRef = ref(null);

    const model = reactive({
        callDuration: 0,
        callType: "",
        // contactId: 0,
        content: "",
        eventTime: "",
        // noteType: "",
        // notebookId: 0,
        phone: "",
        smsType: "",
        visitProvinceCode: "",
        visitCityCode: "",
        visitDistrictCode: "",
        visitAddress: ""
    });

    const schema = zodAdapter(
        z.object({
            content: z.string().min(1, "请填写记事跟进内容")
        }),
        {
            isRequired: path => path === "content"
        }
    );

    const notebookStore = useNotebookStore();

    const onSubmit = async () => {
        const {valid} = await formRef.value?.validate();

        if (!valid) return;

        uni.showLoading({mask: true});

        try {
            await Apis.contactNote.create({
                data: {
                    ...model,
                    contactId: route.query.contactId,
                    notebookId: notebookStore.defaultNotebook?.id,
                    noteType: model.visitAddress ? "visit" : "normal"
                }
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
    });
</script>

<template>
    <view class="h-full flex flex-col of-hidden bg-#f3f4f4">
        <wd-navbar
            :bordered="false"
            left-arrow
            left-text="撰写记事"
            safe-area-inset-top
            @click-left="$navigateBack()"
        />
        <view :style="{'--wot-cell-padding': 0}" class="flex-1 of-auto">
            <wd-form
                ref="formRef"
                :model="model"
                :schema="schema"
                asterisk-position="end"
                error-type="toast"
                layout="vertical"
            >
                <view class="mt-19.08rpx bg-#ffffff p-[38.17rpx_19.08rpx]">
                    <view class="mx-19.08rpx">
                        <wd-form-item prop="content" title="记事内容" title-width="112.60rpx">
                            <wd-textarea
                                v-model="model.content"
                                :compact="false"
                                :maxlength="500"
                                placeholder="请填写记事跟进内容，最多不能超过500个字"
                            />
                        </wd-form-item>
                    </view>
                    <view class="my-38.17rpx h-1px bg-primary6/10" />
                    <view class="mx-19.08rpx">
                        <wd-form-item label="可选择记录拜访位置" title="拜访地址">
                            <view class="mb-19.08rpx">
                                <custom-area-picker
                                    v-model:city="model.visitCityCode"
                                    v-model:district="model.visitDistrictCode"
                                    v-model:province="model.visitProvinceCode"
                                    placeholder="请选择省/市/区"
                                />
                            </view>
                            <view>
                                <wd-input
                                    v-model="model.visitAddress"
                                    :compact="false"
                                    :maxlength="100"
                                    placeholder="请输入详细地址"
                                    show-word-limit
                                    type="text"
                                />
                            </view>
                        </wd-form-item>
                    </view>
                    <view class="my-38.17rpx h-1px bg-primary6/10" />
                    <view class="mx-19.08rpx">
                        <wd-form-item label="未选择时，系统将记录为当前时间" prop="eventTime" title="发生时间">
                            <custom-datetime-picker
                                v-model:formated-value="model.eventTime"
                                placeholder="请选择发生时间"
                                type="datetime"
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
