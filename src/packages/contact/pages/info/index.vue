<script setup>
    import {useForm} from "alova/client";
    import {resolvePage} from "@/router/resolve.js";
    import Modules from "./modules";

    definePage({
        style: {
            navigationBarTextStyle: "white"
        }
    });

    const {systemInfo} = useSystemInfo();

    const route = useRoute();

    const active = ref("page-i");

    const {form, updateForm} = useForm(null, {id: "contact-info"});

    const getOverview = async () => {
        uni.showLoading({mask: true});

        try {
            const {data} = await Apis.contact.getContactOverview({pathParams: {id: route.query.id}});

            updateForm(data);
        } catch (e) {
            console.log("getContactOverview -> failed", e);
        } finally {
            uni.hideLoading();
        }
    };

    const onUpdateContact = () => {
        const to = resolvePage({name: "ContactUpdate", params: {id: route.query.id}});

        uni.navigateTo({
            url: to.fullPath,
            events: {
                "reload:data": getOverview
            }
        });
    };

    // 设置关注状态
    const setFollow = async () => {
        uni.showLoading({mask: true});

        try {
            await Apis.contact.setFollowStatus({
                pathParams: {id: form.value.contact.id},
                params: {isFollow: !form.value.contact.isFollow}
            });

            uni.hideLoading();

            await getOverview();
        } catch (e) {
            console.log("setFollow -> failed", e);
            uni.hideLoading();
        }
    };

    // {
    //     "id": 5,
    //     "notebookId": 3,
    //     "name": "三狗子",
    //     "sex": "男",
    //     "birthday": "1973-01-01",
    //     "companyName": "某企业",
    //     "companyProvinceCode": "110000",
    //     "companyCityCode": "110100",
    //     "companyDistrictCode": "110101",
    //     "companyProvinceName": "北京市",
    //     "companyCityName": "市辖区",
    //     "companyDistrictName": "东城区",
    //     "companyAddress": "少时诵诗书所",
    //     "establishmentDate": "1970-01-01",
    //     "department": "某部门",
    //     "position": "某职位",
    //     "homeProvinceCode": "110000",
    //     "homeCityCode": "110100",
    //     "homeDistrictCode": "110101",
    //     "homeProvinceName": "北京市",
    //     "homeCityName": "市辖区",
    //     "homeDistrictName": "东城区",
    //     "homeAddress": "佛挡杀佛少的地方是分散分散",
    //     "source": "是谁说",
    //     "isFollow": true,
    //     "phones": [
    //         {
    //             "type": "1",
    //             "phone": "18809871234"
    //         }
    //     ],
    //     "createTime": "2026-09-03 09:36:25",
    //     "modifyTime": "2026-09-09 15:16:47"
    // }

    onMounted(getOverview);
</script>

<template>
    <view class="h-full flex flex-col of-hidden bg-#f3f4f4">
        <view
            :style="{
                '--wot-navbar-color': '#ffffff',
                '--wot-navbar-desc-color': '#ffffff',
                'padding-top': `${systemInfo.safeAreaInsets.top}px`,
                'box-shadow': `0 3.82rpx 11.45rpx 0 ${withAlpha(Theme.primary6, 0.5)}`
            }"
            class="mb-38.17rpx rd-b-19.08rpx bg-primary6"
        >
            <wd-navbar :bordered="false" left-arrow left-text="人脉信息" @click-left="$navigateBack()">
                <template #right>
                    <view
                        :class="{'!c-#FBC050': form?.contact?.isFollow}"
                        class="i-tdesign:star-1-filled size-38.17rpx c-#ffffff"
                        @click="setFollow()"
                    />
                    <view class="i-ri:edit-box-line ml-30.53rpx size-38.17rpx c-#ffffff" @click="onUpdateContact()" />
                </template>
            </wd-navbar>
            <view class="m-[38.17rpx_38.17rpx_19.08rpx] flex items-center">
                <view class="size-76.34rpx of-hidden rd-19.08rpx">
                    <image v-if="form?.contact?.sex === '男'" class="size-76.34rpx" src="@/static/male.png" />
                    <image v-else class="size-76.34rpx" src="@/static/female.png" />
                </view>
                <view class="ml-19.08rpx c-#ffffff lh-38.17rpx">
                    <view class="flex items-center">
                        <view class="text-26.72rpx">{{ form?.contact?.name }}</view>
                        <view class="ml-19.08rpx flex items-center">
                            <view class="i-ri:cake-fill size-19.08rpx" />
                            <view class="ml-9.54rpx text-19.08rpx">
                                {{ formatDate(new Date(form?.contact?.birthday), "yyyy年MM月dd日") }}
                            </view>
                        </view>
                        <view class="ml-19.08rpx rd-3.82rpx bg-#FBC050 px-9.54rpx text-19.08rpx c-#ffffff">
                            近期生日
                        </view>
                    </view>
                    <view class="flex items-center">
                        <view class="i-ri:home-9-fill size-19.08rpx" />
                        <view class="ml-9.54rpx text-19.08rpx">
                            <text>{{ form?.contact?.homeProvinceName }}</text>
                            <text>{{ form?.contact?.homeCityName }}</text>
                            <text>{{ form?.contact?.homeDistrictName }}</text>
                            <text>{{ form?.contact?.homeAddress }}</text>
                        </view>
                    </view>
                </view>
            </view>
            <view
                class="m-[0_19.08rpx_-19.08rpx] rd-7.63rpx bg-#ffffff p-[19.08rpx_38.17rpx]"
                style="box-shadow: 0 3.82rpx 11.45rpx 0 rgba(0, 0, 0, 0.4)"
            >
                <view class="flex items-center justify-between c-primary6 lh-38.17rpx">
                    <view>
                        <view class="text-19.08rpx">成交额</view>
                        <view class="text-30.53rpx fw-600">9,362.81</view>
                    </view>
                    <view class="h-19.08rpx w-1px bg-primary6" />
                    <view>
                        <view class="text-19.08rpx">支出额</view>
                        <view class="text-30.53rpx fw-600">2,982.24</view>
                    </view>
                    <view class="h-19.08rpx w-1px bg-primary6" />
                    <view>
                        <view class="text-19.08rpx">差额</view>
                        <view class="text-30.53rpx c-#F95585 fw-600">+6,380.57</view>
                    </view>
                </view>
            </view>
        </view>
        <view
            :style="{'--wot-tabs-nav-bg': 'transparent', '--wot-tabs-nav-item-padding': '19.08rpx 9.54rpx 15.27rpx'}"
            class="mx-28.63rpx"
        >
            <wd-tabs v-model="active" line-theme="text" slidable="always">
                <wd-tab name="page-i" title="重要标记" />
                <wd-tab name="page-ii" title="跟进记事" />
                <wd-tab name="page-iii" title="收支记录" />
                <wd-tab name="page-iv" title="喜好与禁忌" />
                <wd-tab name="page-v" title="关系情况" />
            </wd-tabs>
        </view>
        <view class="box-border flex-1 of-auto p-19.08rpx">
            <component :is="Modules[active]" />
        </view>
        <view class="flex items-center rd-7.63rpx bg-#ffffff p-[19.08rpx_38.17rpx]">
            <view class="flex-1">
                <wd-button block variant="plain">更多功能</wd-button>
            </view>
            <view class="ml-21.95rpx flex-1">
                <wd-button block>记事</wd-button>
            </view>
            <view class="ml-21.95rpx flex-1">
                <wd-button block>记收支</wd-button>
            </view>
        </view>
    </view>
</template>

<style scoped></style>
