<script setup>
    import {useForm} from "alova/client";
    import {ContactPhoneType} from "@/dictionaries/contact.js";
    import {openSchema} from "@/uni_modules/uts-openSchema";

    const {form} = useForm(null, {id: "contact-info"});

    // 发送短信
    const onSendSms = item => {
        openSchema(`sms:${item.phone}`);
    };

    // 拨打电话
    const onMakePhoneCall = item => {
        uni.makePhoneCall({phoneNumber: item.phone});
    };
</script>

<template>
    <view>
        <view class="mb-19.08rpx rd-7.63rpx bg-#ffffff p-[19.08rpx_38.17rpx_38.17rpx]">
            <view class="mb-19.08rpx flex items-center">
                <view class="h-19.08rpx w-3.82rpx bg-primary6" />
                <view class="ml-19.08rpx text-22.90rpx c-primary6 lh-38.17rpx">重要标记</view>
            </view>
            <view class="flex flex-wrap text-19.08rpx c-#ffffff lh-26.72rpx -m-4.77rpx">
                <view class="m-4.77rpx rd-19.08rpx bg-#FBC050 px-19.08rpx">朋友介绍</view>
                <view class="m-4.77rpx rd-19.08rpx bg-primary6/10 px-19.08rpx c-primary6">
                    2023年10月04月 建立信息 5次
                </view>
                <view class="m-4.77rpx rd-19.08rpx bg-primary6/10 px-19.08rpx c-primary6">2023年10月04月 更新信息</view>
                <view class="m-4.77rpx rd-19.08rpx bg-#9BD073 px-19.08rpx">2023年10月13日 近期电话联系</view>
                <view class="m-4.77rpx rd-19.08rpx bg-#9BD073 px-19.08rpx">2023年10月13日 近期拜访</view>
                <view class="m-4.77rpx rd-19.08rpx bg-primary6 px-19.08rpx">2023年10月13日 近期支出</view>
                <view class="m-4.77rpx rd-19.08rpx bg-#F95585 px-19.08rpx">2023年10月15日 近期成交</view>
            </view>
        </view>
        <view
            v-if="form?.contact?.phones?.some(e => e.phone)"
            class="mb-19.08rpx rd-7.63rpx bg-#ffffff p-[19.08rpx_38.17rpx_0]"
        >
            <view class="flex items-center">
                <view class="h-19.08rpx w-3.82rpx bg-primary6" />
                <view class="ml-19.08rpx text-22.90rpx c-primary6 lh-38.17rpx">联系方式</view>
            </view>
            <view>
                <view
                    v-for="(item, i) in [...form.contact.phones, ...form.contact.phones]"
                    :key="i"
                    class="b-b-(1px primary6/10 solid) p-[19.08rpx_0] last:b-b-none"
                >
                    <view class="flex items-center lh-38.17rpx">
                        <view>
                            <view class="flex items-center">
                                <view class="text-19.08rpx c-primary6/50">
                                    {{ ContactPhoneType.label(item.type) }}
                                </view>
                                <view class="ml-9.54rpx text-22.90rpx fw-600">{{ item.phone }}</view>
                                <view
                                    class="ml-9.54rpx rd-3.82rpx bg-#FBC050 px-9.54rpx text-19.08rpx c-#ffffff lh-26.72rpx"
                                >
                                    近期联系
                                </view>
                            </view>
                            <view class="flex items-center text-19.08rpx">
                                <view class="c-primary6/50">10月13日上午08:38</view>
                                <view class="ml-9.54rpx c-#9BD073">呼出30秒</view>
                                <view class="ml-9.54rpx c-#F95585">呼出未接通</view>
                                <view class="ml-9.54rpx c-#F95585">呼入已挂断</view>
                                <view class="i-ri:arrow-right-up-line size-22.90rpx c-primary6/50" />
                                <view class="i-ri:arrow-left-down-line size-22.90rpx c-primary6/50" />
                            </view>
                        </view>
                        <view
                            class="i-mdi:email-outline size-38.17rpxrpx ml-auto c-primary6/50"
                            @click="onSendSms(item)"
                        />
                        <view
                            class="i-icon-park-outline:phone-telephone size-38.17rpxrpx ml-30.53rpx c-primary6/50"
                            @click="onMakePhoneCall(item)"
                        />
                    </view>
                </view>
            </view>
        </view>
        <view class="rd-7.63rpx bg-#ffffff p-[19.08rpx_38.17rpx]">
            <view class="mb-19.08rpx flex items-center">
                <view class="h-19.08rpx w-3.82rpx bg-primary6" />
                <view class="ml-19.08rpx text-22.90rpx c-primary6 lh-38.17rpx">涉及企业</view>
            </view>
            <view
                :style="{
                    '--wot-cell-title-font-size': '19.08rpx',
                    '--wot-cell-title-color': withAlpha(Theme.primary6, 0.5),
                    '--wot-cell-value-font-size': '19.08rpx',
                    '--wot-cell-value-color': Theme.primary6,
                    '--wot-cell-padding': 0
                }"
            >
                <wd-cell-group title-width="95.42rpx" value-align="left">
                    <wd-cell title="企业名称">
                        <view class="flex items-center">
                            <view>{{ form?.contact?.companyName }}</view>
                            <view
                                class="ml-9.54rpx rd-3.82rpx bg-#F95585 px-9.54rpx text-19.08rpx c-#ffffff lh-26.72rpx"
                            >
                                停业
                            </view>
                        </view>
                    </wd-cell>
                    <wd-cell title="成立时间">
                        <view class="flex items-center">
                            <view>{{ formatDate(new Date(form?.contact?.establishmentDate), "yyyy年MM月dd日") }}</view>
                            <view
                                class="ml-9.54rpx rd-3.82rpx bg-#FBC050 px-9.54rpx text-19.08rpx c-#ffffff lh-26.72rpx"
                            >
                                剩余10日
                            </view>
                        </view>
                    </wd-cell>
                    <wd-cell title="企业位置">
                        <text>{{ form?.contact?.companyProvinceName }}</text>
                        <text>{{ form?.contact?.companyCityName }}</text>
                        <text>{{ form?.contact?.companyDistrictName }}</text>
                        <text>{{ form?.contact?.companyAddress }}</text>
                    </wd-cell>
                    <wd-cell :value="form?.contact?.department" title="部门名称" />
                    <wd-cell :value="form?.contact?.position" title="职务职能" />
                </wd-cell-group>
            </view>
        </view>
    </view>
</template>

<style scoped></style>
