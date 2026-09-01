<script setup>
    import {zodAdapter} from "@wot-ui/ui";
    import {useForm} from "alova/client";
    import {z} from "zod";
    import Modules from "./modules";

    const active = ref("base");

    const formRef = ref(null);

    const initialForm = {
        birthday: "",
        companyAddress: "",
        companyName: "",
        department: "",
        homeAddress: "",
        isFollow: true,
        name: "",
        notebookId: 0,
        phones: [
            {
                phone: "",
                type: 1
            }
        ],
        position: "",
        sex: 1,
        source: ""
    };

    const schema = zodAdapter(
        z.object({
            name: z.string().min(1, "请输入联系人姓名"),
            phones: z.array(
                z.object({
                    phone: z.string().regex(Regex.Phone, "手机号码格式不正确").or(z.literal(""))
                })
            )
        }),
        {
            isRequired: path => path === "name"
        }
    );

    const {form} = useForm(null, {id: "contact-create", initialForm});

    const onSubmit = async () => {
        // 不用表单验证使用数据验证
        const [error] = schema.validate(form.value);

        if (error) {
            uni.showToast({title: error.message, icon: "none", mask: true});

            return;
        }

        console.log("valid");
    };
</script>

<template>
    <view class="h-full flex flex-col of-hidden bg-#f3f4f4">
        <wd-navbar
            :bordered="false"
            left-arrow
            left-text="添加联系人"
            safe-area-inset-top
            @click-left="$navigateBack()"
        />
        <view class="bg-#f3f4f4 p-[19.08rpx_38.17rpx] text-19.08rpx c-#FA8C16 lh-38.17rpx">
            填写姓名后即可完成创建，其他信息可在后续使用中逐渐完善。
        </view>
        <view class="mb-1px">
            <wd-tabs
                v-model="active"
                custom-class="px-179.39rpx box-border"
                line-theme="underline"
                line-width="91.60rpx"
            >
                <wd-tab name="base" title="基本信息" />
                <wd-tab name="corp" title="企业信息" />
                <wd-tab name="rest" title="其他信息" />
            </wd-tabs>
        </view>
        <view :style="{'--wot-cell-padding': 0}" class="flex-1 of-auto">
            <wd-form
                ref="formRef"
                :model="form"
                :schema="schema"
                asterisk-position="end"
                error-type="toast"
                layout="vertical"
                title-width="133.59rpx"
            >
                <component :is="Modules[active]" />
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
