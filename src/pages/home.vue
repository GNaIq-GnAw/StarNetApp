<script setup>
    import HomeBgT from "@/static/home-bg-t.png";

    definePage({
        name: "home",
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
            pagingRef.value.complete([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        } catch {
            pagingRef.value.complete(false);
        }
    };

    const onListChange = vlist => {
        list.value = vlist;
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
    <view class="h-full flex flex-col">
        <view
            :style="{
                'background': `url(${HomeBgT}) no-repeat`,
                'background-size': `100% calc(${systemInfo?.safeAreaInsets?.top}px + 288rpx)`,
                'padding-top': `calc(${systemInfo?.safeAreaInsets?.top}px + 24rpx)`
            }"
            class="px-40rpx pb-40rpx c-#ffffff"
        >
            <view class="mb-24rpx flex items-center">
                <view class="flex items-center">
                    <text class="text-32rpx lh-40rpx">默认记事</text>
                    <text class="i-carbon:chevron-down ml-12rpx size-40rpx" />
                </view>
                <view class="ml-auto">
                    <text class="i-carbon:search size-40rpx" />
                    <text class="i-carbon:add-large ml-32rpx size-40rpx" />
                </view>
            </view>
            <view class="mb-20rpx flex">
                <view>
                    <view class="text-24rpx lh-40rpx">
                        新增人脉
                    </view>
                    <view class="my-6rpx flex items-center lh-none">
                        <view class="text-48rpx">
                            300
                        </view>
                        <view class="ml-12rpx text-24rpx">
                            名
                        </view>
                    </view>
                </view>
                <view class="ml-auto h-40rpx w-150rpx rd-20rpx bg-#ffffff" />
            </view>
            <view class="flex items-center text-24rpx lh-40rpx">
                <view>
                    <text>产生成交</text>
                    <text class="ml-20rpx">22名</text>
                </view>
                <view class="mx-32rpx h-20rpx w-1px bg-#ffffff" />
                <view>
                    <text>产生支出</text>
                    <text class="ml-20rpx">300名</text>
                </view>
            </view>
        </view>
        <view class="flex items-center p-[20rpx_40rpx]">
            <wd-checkbox :false-value="0" :true-value="1" type="square">
                <text class="c-primary6/50">仅看关注</text>
            </wd-checkbox>
            <view class="ml-auto flex items-center c-primary6/50">
                <view class="text-20rpx lh-40rpx">
                    新增
                </view>
                <view class="i-icon-park-outline:filter ml-12rpx size-20rpx" />
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
                <view v-for="row in list" :id="`zp-id-${row.zp_index}`" :key="row.zp_index" class="bg-#ffffff px-20rpx">
                    <view class="b-b-(1px primary6/10 solid) p-20rpx">
                        <view class="flex">
                            <view class="size-80rpx rd-20rpx bg-red" />
                            <view class="ml-20rpx flex-1">
                                <view class="flex items-center">
                                    <view class="text-24rpx lh-40rpx">
                                        柳东
                                    </view>
                                    <view class="ml-20rpx text-20rpx c-primary6/50 lh-40rpx">
                                        产品经理
                                    </view>
                                </view>
                                <view class="text-20rpx c-primary6/50 lh-40rpx">
                                    山东销掌门信息科技有限公司 · 产品技术中心
                                </view>
                                <view class="mt-10rpx">
                                    <view class="flex flex-wrap text-20rpx c-#ffffff lh-28rpx -m-5rpx">
                                        <view v-for="i in 5" :key="i" class="m-5rpx rd-20rpx bg-#FBC050 px-10rpx">
                                            电话联系 5次
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view class="i-ri:more-line size-40rpx c-primary6/50" />
                        </view>
                        <view class="mt-20rpx rd-8rpx bg-#F3F4F4 p-[10rpx_20rpx] text-20rpx c-primary6/50 lh-30rpx">
                            记事：Chrome浏览器默认的最小字体大小取决于不同的版本和配置。在最新的Chrome浏览器版本中，最小字体大小通常设置为12px。此外，还可...
                        </view>
                    </view>
                </view>
            </z-paging>
        </view>
    </view>
</template>

<style scoped></style>
