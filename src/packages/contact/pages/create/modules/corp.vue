<script setup>
    import {useForm} from "alova/client";

    const {form} = useForm(null, {id: "contact-create"});
</script>

<template>
    <view class="bg-#ffffff p-[38.17rpx_19.08rpx]">
        <view class="mx-19.08rpx">
            <wd-form-item prop="companyName" title="企业名称">
                <wd-input
                    v-model="form.companyName"
                    :compact="false"
                    :maxlength="50"
                    placeholder="请输入企业名称"
                    show-word-limit
                    type="text"
                />
            </wd-form-item>
        </view>
        <view class="my-38.17rpx h-1px bg-primary6/10" />
        <view class="mx-19.08rpx">
            <wd-form-item title="企业位置">
                <view :style="{'--wot-cell-vertical-padding-top': 0}">
                    <view>
                        <wd-form-item prop="companyDistrictCode">
                            <custom-area-picker
                                v-model:province="form.companyProvinceCode"
                                v-model:city="form.companyCityCode"
                                v-model:district="form.companyDistrictCode"
                                placeholder="请选择省/市/区"
                            />
                        </wd-form-item>
                    </view>
                    <view class="mt-19.08rpx">
                        <wd-form-item prop="companyAddress">
                            <wd-input
                                v-model="form.companyAddress"
                                :compact="false"
                                :maxlength="100"
                                placeholder="请输入详细地址"
                                show-word-limit
                                type="text"
                            />
                        </wd-form-item>
                    </view>
                </view>
            </wd-form-item>
        </view>
        <view class="my-38.17rpx h-1px bg-primary6/10" />
        <view class="mx-19.08rpx">
            <wd-form-item title-width="100%" prop="establishmentDate">
                <template #title>
                    <view class="w-full flex items-center">
                        <view>成立日期</view>
                        <view class="ml-auto flex items-center">
                            <text>日期提醒</text>
                            <view class="ml-19.08rpx">
                                <wd-switch size="38.17rpx" />
                            </view>
                        </view>
                    </view>
                </template>
                <custom-datetime-picker
                    v-model:value="form.establishmentDate"
                    placeholder="请选择成立日期"
                    type="date"
                />
            </wd-form-item>
        </view>
        <view class="my-38.17rpx h-1px bg-primary6/10" />
        <view class="mx-19.08rpx">
            <wd-form-item prop="department" title="部门名称">
                <wd-input
                    v-model="form.department"
                    :compact="false"
                    :maxlength="10"
                    placeholder="请输入部门名称"
                    show-word-limit
                    type="text"
                />
            </wd-form-item>
        </view>
        <view class="my-38.17rpx h-1px bg-primary6/10" />
        <view class="mx-19.08rpx">
            <wd-form-item prop="position" title="职位名称">
                <wd-input
                    v-model="form.position"
                    :compact="false"
                    :maxlength="10"
                    placeholder="请输入职位名称"
                    show-word-limit
                    type="text"
                />
            </wd-form-item>
        </view>
    </view>
</template>

<style scoped></style>
