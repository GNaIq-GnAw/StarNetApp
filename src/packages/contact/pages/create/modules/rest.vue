<script setup>
    import {useForm} from "alova/client";

    const {form} = useForm(null, {id: "contact-create"});
</script>

<template>
    <view class="bg-#ffffff p-[38.17rpx_19.08rpx]">
        <view class="mx-19.08rpx">
            <wd-form-item title="家庭住址">
                <view :style="{'--wot-cell-vertical-padding-top': 0}">
                    <view>
                        <wd-form-item prop="homeDistrictCode">
                            <custom-area-picker
                                v-model:province="form.homeProvinceCode"
                                v-model:city="form.homeCityCode"
                                v-model:district="form.homeDistrictCode"
                                placeholder="请选择省/市/区"
                            />
                        </wd-form-item>
                    </view>
                    <view class="mt-19.08rpx">
                        <wd-form-item prop="homeAddress">
                            <wd-input
                                v-model="form.homeAddress"
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
            <wd-form-item label="用于联系人数据来源分析" prop="source" title="信息来源">
                <wd-input
                    v-model="form.source"
                    :compact="false"
                    :maxlength="10"
                    placeholder="请输入信息来源"
                    show-word-limit
                    type="text"
                />
            </wd-form-item>
        </view>
    </view>
</template>

<style scoped></style>
