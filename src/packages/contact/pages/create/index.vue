<script setup>
    import {zodAdapter} from "@wot-ui/ui";
    import {useForm} from "alova/client";
    import {z} from "zod";
    import Modules from "./modules";

    const instance = getCurrentInstance().proxy;
    const eventChannel = instance.getOpenerEventChannel();

    const notebookStore = useNotebookStore();

    const active = ref("base");

    const formRef = ref(null);

    // {
    //     "birthday": "1973-01-01",
    //     "companyAddress": "少时诵诗书所",
    //     "companyCityCode": "110100",
    //     "companyDistrictCode": "110101",
    //     "companyName": "某企业",
    //     "companyProvinceCode": "110000",
    //     "department": "某部门",
    //     "establishmentDate": "1970-01-01",
    //     "homeAddress": "佛挡杀佛少的地方是分散分散",
    //     "homeCityCode": "110100",
    //     "homeDistrictCode": "110101",
    //     "homeProvinceCode": "110000",
    //     "isFollow": true,
    //     "name": "狗子",
    //     "notebookId": 3,
    //     "phones": [{"phone": "18809871234", "type": 1}],
    //     "position": "某职位",
    //     "sex": "男",
    //     "source": "是谁说"
    // }

    const initialForm = {
        "birthday": "1973-01-01",
        "companyAddress": "少时诵诗书所",
        "companyCityCode": "110100",
        "companyDistrictCode": "110101",
        "companyName": "某企业",
        "companyProvinceCode": "110000",
        "department": "某部门",
        "establishmentDate": "1970-01-01",
        "homeAddress": "佛挡杀佛少的地方是分散分散",
        "homeCityCode": "110100",
        "homeDistrictCode": "110101",
        "homeProvinceCode": "110000",
        "isFollow": true,
        "name": "三狗子",
        "notebookId": 3,
        "phones": [{"phone": "18809871234", "type": 1}],
        "position": "某职位",
        "sex": "男",
        "source": "是谁说"
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

    const {form, send} = useForm(
        data => {
            return Apis.contact.createContact({data: {...data, notebookId: notebookStore.defaultNotebook.id}});
        },
        {
            id: "contact-create",
            initialForm
        }
    );

    const onSubmit = async () => {
        // 不用表单验证使用数据验证
        const [error] = schema.validate(form.value);

        if (error) {
            uni.showToast({title: error.message, icon: "none", mask: true});

            return;
        }

        uni.showLoading({mask: true});

        try {
            await send();

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
            console.log("onSubmit -> failed", e);
            uni.hideLoading();
        }
    };

    onMounted(() => {
        notebookStore.getNotebooks();
    });
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
