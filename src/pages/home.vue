<script setup>
    import {resolvePage} from "@/router/resolve.js";
    import HomeBgT from "@/static/home-bg-t.png";

    definePage({
        layout: "tabbar",
        style: {
            navigationBarTitleText: "首页"
        }
    });

    const {systemInfo} = useSystemInfo();

    const pagingRef = ref(null);

    const list = ref([]);

    const queryList = async (pageNum, pageSize) => {
        try {
            pagingRef.value.completeByTotal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10);
        } catch {
            pagingRef.value.complete(false);
        }
    };

    const onListChange = vlist => {
        list.value = vlist;
    };

    const onUseNotebook = () => {
        const to = resolvePage({name: "UserNotebookUse"});

        uni.navigateTo({
            url: to.path
        });
    };

    onMounted(async () => {
        try {
            const res = await Apis.contact.getContacts();
            console.log("res", res);
        } catch (e) {
            console.log("e", e);
        }
    });
</script>

<template>
    <view class="h-full flex flex-col bg-#f3f4f4">
        <view
            :style="{
                'background': `url(${HomeBgT}) no-repeat`,
                'background-size': `100% calc(${systemInfo?.safeAreaInsets?.top}px + 274.81rpx)`,
                'padding-top': `calc(${systemInfo?.safeAreaInsets?.top}px + 22.9rpx)`
            }"
            class="px-38.17rpx pb-38.17rpx c-#ffffff"
        >
            <view class="mb-22.9rpx flex items-center">
                <view class="flex items-center" @click="onUseNotebook">
                    <text class="text-30.53rpx lh-38.17rpx">默认记事本</text>
                    <text class="i-carbon:chevron-down ml-11.45rpx size-38.17rpx" />
                </view>
                <view class="ml-auto">
                    <text class="i-carbon:search size-38.17rpx" />
                    <text class="i-carbon:add-large ml-30.53rpx size-38.17rpx" />
                </view>
            </view>
            <view class="mb-19.08rpx flex">
                <view>
                    <view class="text-22.9rpx lh-38.17rpx">
                        新增人脉
                    </view>
                    <view class="my-5.73rpx flex items-center lh-none">
                        <view class="text-45.8rpx">
                            300
                        </view>
                        <view class="ml-11.45rpx text-22.9rpx">
                            名
                        </view>
                    </view>
                </view>
                <view class="ml-auto h-38.17rpx w-143.13rpx rd-19.08rpx bg-#ffffff" />
            </view>
            <view class="flex items-center text-22.9rpx lh-38.17rpx">
                <view>
                    <text>产生成交</text>
                    <text class="ml-19.08rpx">22名</text>
                </view>
                <view class="mx-30.53rpx h-19.08rpx w-1px bg-#ffffff" />
                <view>
                    <text>产生支出</text>
                    <text class="ml-19.08rpx">300名</text>
                </view>
            </view>
        </view>
        <view class="flex items-center p-[19.08rpx_38.17rpx]">
            <wd-checkbox :false-value="0" :true-value="1" type="square">
                <text class="c-primary6/50">仅看关注</text>
            </wd-checkbox>
            <view class="ml-auto flex items-center c-primary6/50">
                <view class="text-19.08rpx lh-38.17rpx">
                    新增
                </view>
                <view class="i-icon-park-outline:filter ml-11.45rpx size-19.08rpx" />
            </view>
        </view>
        <view class="flex-1">
            <z-paging
                ref="pagingRef"
                :empty-view-center="false"
                auto-show-system-loading
                cell-height-mode="dynamic"
                force-close-inner-list
                use-virtual-list
                @query="queryList"
                @virtual-list-change="onListChange"
            >
                <view class="bg-#ffffff">
                    <view
                        v-for="row in list"
                        :id="`zp-id-${row.zp_index}`"
                        :key="row.zp_index"
                        class="mx-19.08rpx b-b-(1px primary6/10 solid) bg-#ffffff p-19.08rpx last:b-b-none"
                    >
                        <view class="flex">
                            <view class="size-76.34rpx rd-19.08rpx bg-red" />
                            <view class="ml-19.08rpx flex-1">
                                <view class="flex items-center">
                                    <view class="text-22.9rpx lh-38.17rpx">
                                        柳东
                                    </view>
                                    <view class="ml-19.08rpx text-19.08rpx c-primary6/50 lh-38.17rpx">
                                        产品经理
                                    </view>
                                </view>
                                <view class="text-19.08rpx c-primary6/50 lh-38.17rpx">
                                    山东销掌门信息科技有限公司 · 产品技术中心
                                </view>
                                <view class="mt-9.54rpx">
                                    <view class="flex flex-wrap text-19.08rpx c-#ffffff lh-26.72rpx -m-4.77rpx">
                                        <view v-for="i in 5" :key="i" class="m-4.77rpx rd-19.08rpx bg-#FBC050 px-9.54rpx">
                                            电话联系 5次
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view class="i-ri:more-line size-38.17rpx c-primary6/50" />
                        </view>
                        <view class="mt-19.08rpx rd-7.63rpx bg-#F3F4F4 p-[9.54rpx_19.08rpx] text-19.08rpx c-primary6/50 lh-28.63rpx">
                            记事：Chrome浏览器默认的最小字体大小取决于不同的版本和配置。在最新的Chrome浏览器版本中，最小字体大小通常设置为12px。此外，还可...
                        </view>
                    </view>
                </view>
            </z-paging>
        </view>
    </view>
</template>

<style scoped></style>
