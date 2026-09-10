<script setup>
    import {ContactPhoneType} from "@/dictionaries/contact.js";
    import {resolvePage} from "@/router/resolve.js";
    import {openSchema} from "@/uni_modules/uts-openSchema";

    const show = ref(false);

    const contact = ref(null);

    const {data: contactDatum, send: getContactDatum} = useRequest(
        () => {
            return Apis.contact.getContact({pathParams: {id: contact.value.id}});
        },
        {
            immediate: false,
            middleware: async (_, next) => {
                uni.showLoading({mask: true});

                try {
                    const {data} = await next();

                    return data;
                } catch {
                    return null;
                } finally {
                    uni.hideLoading();
                }
            }
        }
    );

    const open = async (row = null) => {
        contact.value = row;
        await getContactDatum();
        show.value = true;
    };

    const onUpdateContact = () => {
        const to = resolvePage({name: "ContactUpdate", params: {id: contact.value.id}});

        uni.navigateTo({
            url: to.fullPath,
            events: {
                "reload:data": getContactDatum
            }
        });
    };

    // 设置关注状态
    const setFollow = async () => {
        uni.showLoading({mask: true});

        try {
            await Apis.contact.setFollowStatus({
                pathParams: {id: contact.value.id},
                params: {isFollow: !contactDatum.value.isFollow}
            });

            // 更新行数据
            contact.value.isFollow = !contact.value.isFollow;

            uni.hideLoading();

            await getContactDatum();
        } catch (e) {
            console.log("setFollow -> failed", e);
            uni.hideLoading();
        }
    };

    // 发送短信
    const onSendSms = item => {
        openSchema(`sms:${item.phone}`);
    };

    // 拨打电话
    const onMakePhoneCall = item => {
        uni.makePhoneCall({phoneNumber: item.phone});
    };

    defineExpose({open});
</script>

<template>
    <wd-popup v-model="show" custom-class="rd-t-19.08rpx" position="bottom">
        <view class="h-50vh flex flex-col bg-#f3f4f4">
            <view class="m-38.17rpx flex">
                <view class="size-76.34rpx of-hidden rd-19.08rpx">
                    <image v-if="contactDatum?.sex === '男'" class="size-76.34rpx" src="@/static/male.png" />
                    <image v-else class="size-76.34rpx" src="@/static/female.png" />
                </view>
                <view class="ml-19.08rpx lh-38.17rpx">
                    <view>
                        <text class="text-22.90rpx">{{ contactDatum?.name }}</text>
                        <text class="ml-19.08rpx text-19.08rpx c-primary6/50">{{ contactDatum?.position }}</text>
                    </view>
                    <view class="text-19.08rpx c-primary6/50">
                        <text>{{ contactDatum?.companyName }}</text>
                        <text v-if="contactDatum?.department">&nbsp;·&nbsp;</text>
                        <text v-if="contactDatum?.department">{{ contactDatum?.department }}</text>
                    </view>
                </view>
                <view
                    :class="{'!c-#FBC050': contactDatum?.isFollow}"
                    class="i-tdesign:star-1-filled ml-auto size-38.17rpx c-primary6/20"
                    @click="setFollow"
                />
            </view>
            <view class="box-border flex-1 of-auto p-[0_19.08rpx_19.08rpx]">
                <view v-if="contactDatum?.phones?.some(e => e.phone)">
                    <view
                        v-for="(item, i) in contactDatum.phones"
                        :key="i"
                        class="mb-19.08rpx rd-7.63rpx bg-#ffffff p-[19.08rpx_38.17rpx] last:mb-0"
                    >
                        <view class="flex items-center lh-38.17rpx">
                            <view>
                                <view class="flex items-center">
                                    <view class="text-19.08rpx c-primary6/50">
                                        {{ ContactPhoneType.label(item.type) }}
                                    </view>
                                    <view class="ml-9.54rpx text-22.90rpx fw-600">{{ item.phone }}</view>
                                    <view class="ml-19.08rpx rd-3.82rpx bg-#FBC050 px-9.54rpx text-19.08rpx c-#ffffff">
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
                <view v-else class="bg-#ffffff py-57.25rpx">
                    <view class="flex flex-col items-center">
                        <view class="i-icon-park-outline:termination-file size-76.34rpx c-primary6/10" />
                        <view class="mt-19.08rpx text-22.90rpx c-primary6/50 lh-38.17rpx">巧妇难为无米之炊</view>
                        <view class="text-19.08rpx c-#492FD3 lh-38.17rpx" @click="onUpdateContact">增加联系方式</view>
                    </view>
                </view>
            </view>
            <view class="flex items-center rd-7.63rpx bg-#ffffff p-[19.08rpx_38.17rpx]">
                <view class="flex-1">
                    <wd-button block variant="plain">更多信息</wd-button>
                </view>
                <view class="ml-21.95rpx flex-1">
                    <wd-button block>添加记事</wd-button>
                </view>
                <view class="ml-21.95rpx flex-1">
                    <wd-button block>添加收支</wd-button>
                </view>
            </view>
        </view>
    </wd-popup>
</template>

<style scoped></style>
