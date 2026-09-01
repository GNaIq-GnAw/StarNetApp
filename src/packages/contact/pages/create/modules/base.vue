<script setup>
    import {useForm} from "alova/client";

    const {form} = useForm(null, {id: "contact-create"});

    const columns = [
        {label: "工作号", value: 1},
        {label: "生活号", value: 2}
    ];

    const onAddPhone = () => {
        form.value.phones.push({
            phone: "",
            type: 1
        });
    };
</script>

<template>
    <view class="bg-#ffffff p-[38.17rpx_19.08rpx]">
        <view class="mx-19.08rpx">
            <wd-form-item label="可由汉字、英文与数字构成，最长不超过20个字" prop="name" title="联系人名称">
                <wd-input
                    v-model="form.name"
                    :compact="false"
                    :maxlength="20"
                    placeholder="请输入联系人姓名"
                    show-word-limit
                    type="text"
                />
            </wd-form-item>
        </view>
        <view class="my-38.17rpx h-1px bg-primary6/10" />
        <view class="mx-19.08rpx">
            <wd-form-item prop="sex" title="性别">
                <wd-radio-group v-model="form.sex" direction="horizontal">
                    <wd-radio :value="1">
                        <template #icon="{isChecked}">
                            <wd-button :type="isChecked ? 'primary' : 'info'" custom-class="w-152.67rpx" size="small">
                                男士
                            </wd-button>
                        </template>
                    </wd-radio>
                    <wd-radio :value="2">
                        <template #icon="{isChecked}">
                            <wd-button :type="isChecked ? 'primary' : 'info'" custom-class="w-152.67rpx" size="small">
                                女士
                            </wd-button>
                        </template>
                    </wd-radio>
                </wd-radio-group>
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
                <custom-datetime-picker v-model:value="form.birthday" placeholder="请选择生日日期" type="date" />
            </wd-form-item>
        </view>
        <view class="my-38.17rpx h-1px bg-primary6/10" />
        <view class="mx-19.08rpx">
            <wd-form-item label="支持多个号码不同用途分别记录" prop="phones" title="联系电话" title-width="100%">
                <template #title>
                    <view class="w-full flex items-center">
                        <view>联系电话</view>
                        <view class="ml-auto text-19.08rpx c-#492FD3 lh-38.17rpx" @click="onAddPhone()">继续添加</view>
                    </view>
                </template>
                <view :style="{'--wot-cell-vertical-padding-top': 0}">
                    <view
                        v-for="(row, index) in form.phones"
                        :key="index"
                        class="mb-19.08rpx flex items-center last:mb-0"
                    >
                        <view class="w-190.84rpx">
                            <custom-picker v-model:value="row.type" :columns="columns" />
                        </view>
                        <view class="mx-19.08rpx flex-1">
                            <wd-form-item :prop="`phones.${index}.phone`">
                                <wd-input v-model="row.phone" :compact="false" placeholder="请输入联系电话" />
                            </wd-form-item>
                        </view>
                        <view class="i-mdi:minus size-38.17rpx c-primary6/50" />
                    </view>
                </view>
            </wd-form-item>
        </view>
    </view>
</template>

<style scoped></style>
