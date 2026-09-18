<script setup>
    import {useForm} from "alova/client";
    import groupBy from "lodash-es/groupBy.js";
    import {resolvePage} from "@/router/resolve.js";
    import Modules from "./modules";

    definePage({
        style: {
            navigationBarTextStyle: "white"
        }
    });

    const {systemInfo} = useSystemInfo();

    const $currentPage = useCurrentPage();

    const active = ref("page-i");

    const {form, updateForm} = useForm(null, {id: "contact-info"});

    const getTags = async () => {
        try {
            // 喜好
            const {data: like} = await Apis.contactTag.list({
                pathParams: {contactId: $currentPage.value.query.id},
                params: {tagType: "like"}
            });

            // 禁忌
            const {data: hate} = await Apis.contactTag.list({
                pathParams: {contactId: $currentPage.value.query.id},
                params: {tagType: "hate"}
            });

            return {like, hate};
        } catch (e) {
            return Promise.reject(e);
        }
    };

    const getRelations = async () => {
        try {
            const {data} = await Apis.contactRelation.list({pathParams: {contactId: $currentPage.value.query.id}});

            return data.map(item => {
                const {tags, ...rest} = item;

                return {
                    ...rest,
                    tags,
                    formatedTags: groupBy(tags, "tagType")
                };
            });
        } catch (e) {
            return Promise.reject(e);
        }
    };

    const getOverview = async () => {
        uni.showLoading({mask: true});

        try {
            const {data} = await Apis.contact.getContactOverview({pathParams: {id: $currentPage.value.query.id}});

            const tags = await getTags();
            const relations = await getRelations();

            updateForm({...data, tags, relations});
        } catch (e) {
            console.log("getContactOverview -> failed", e);
        } finally {
            uni.hideLoading();
        }
    };

    // 更新联系人信息
    const onUpdateContact = () => {
        const to = resolvePage({name: "ContactUpdate", params: {id: $currentPage.value.query.id}});

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

    // 添加喜好与禁忌
    const createTag = type => {
        const to = resolvePage({
            name: "ContactCreateTag",
            params: {tagType: type, contactId: form.value.contact.id}
        });

        uni.navigateTo({
            url: to.fullPath,
            events: {
                "reload:data": getOverview
            }
        });
    };

    // 添加关系
    const createRelation = () => {
        const to = resolvePage({name: "ContactRelationCreate", params: {contactId: form.value.contact.id}});

        uni.navigateTo({
            url: to.fullPath,
            events: {
                "reload:data": getOverview
            }
        });
    };

    const createNote = () => {
        const to = resolvePage({name: "ContactNoteCreate", params: {contactId: form.value.contact.id}});

        uni.navigateTo({
            url: to.fullPath,
            events: {
                "reload:data": getOverview
            }
        });
    };

    provide("getOverview", getOverview);
    provide("createTag", createTag);
    provide("createRelation", createRelation);

    const [show, toggleShow] = useToggle();

    onMounted(getOverview);
</script>

<template>
    <wd-popup v-model="show" custom-class="rd-19.08rpx">
        <view class="box-border w-673.67rpx p-38.17rpx c-primary6 lh-38.17rpx">
            <view class="mx-9.54rpx flex items-center" @click="createTag()">
                <view class="i-icon-park-outline:unlike size-57.25rpx" />
                <view class="ml-38.17rpx">
                    <view class="text-22.90rpx">添加喜好与禁忌</view>
                    <view class="text-19.08rpx c-primary6/50">记录日常生活中的事与物</view>
                </view>
            </view>
            <view class="my-38.17rpx h-1px bg-primary6/10" />
            <view class="mx-9.54rpx flex items-center" @click="createRelation()">
                <view class="iconfont icon-if-connection text-57.25rpx" />
                <view class="ml-38.17rpx">
                    <view class="text-22.90rpx">添加关系情况</view>
                    <view class="text-19.08rpx c-primary6/50">掌握其他关系信息</view>
                </view>
            </view>
        </view>
    </wd-popup>
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
                        <view class="ml-9.54rpx rd-3.82rpx bg-#FBC050 px-9.54rpx text-19.08rpx c-#ffffff lh-26.72rpx">
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
                <view class="flex items-center c-primary6 lh-38.17rpx">
                    <view class="flex-1">
                        <view class="text-19.08rpx">成交额</view>
                        <view class="text-30.53rpx fw-600">{{ form?.financeStats?.dealAmount }}</view>
                    </view>
                    <view class="mr-38.17rpx h-19.08rpx w-1px bg-primary6" />
                    <view class="flex-1">
                        <view class="text-19.08rpx">支出额</view>
                        <view class="text-30.53rpx fw-600">{{ form?.financeStats?.expenseAmount }}</view>
                    </view>
                    <view class="mr-38.17rpx h-19.08rpx w-1px bg-primary6" />
                    <view class="flex-1">
                        <view class="text-19.08rpx">差额</view>
                        <view class="text-30.53rpx c-#F95585 fw-600">+{{ form?.financeStats?.balance }}</view>
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
                <wd-button block variant="plain" @click="toggleShow()">更多功能</wd-button>
            </view>
            <view class="ml-21.95rpx flex-1">
                <wd-button block @click="createNote()">记事</wd-button>
            </view>
            <view class="ml-21.95rpx flex-1">
                <wd-button block>记收支</wd-button>
            </view>
        </view>
    </view>
</template>

<style scoped></style>
