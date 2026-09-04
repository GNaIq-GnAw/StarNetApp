<script setup>
    const {systemInfo} = useSystemInfo();

    const notebookStore = useNotebookStore();

    const pagingRef = ref(null);

    const list = ref([]);

    const queryList = async () => {
        try {
            const notebookId = notebookStore.defaultNotebook.id;
            const {data} = await Apis.contact.getContactsByNotebook({pathParams: {notebookId}});

            pagingRef.value.complete(data);
        } catch (e) {
            console.log("eeeeeee", e);
            pagingRef.value.complete(false);
        }
    };

    const onListChange = vlist => {
        list.value = vlist;
    };

    onMounted(() => {
        pagingRef.value?.reload();
    });
</script>

<template>
    <view
        :style="{'padding-top': `${systemInfo?.safeAreaInsets?.top}px`}"
        class="box-border h-full flex flex-col bg-#ffffff"
    >
        <wd-search placeholder-left variant="filled" />
        <view class="bg-#f3f4f4 p-[19.08rpx_38.17rpx] text-19.08rpx c-primary6/50 lh-38.17rpx">共找到2人</view>
        <view class="flex-1 bg-#f3f4f4">
            <z-paging
                ref="pagingRef"
                :auto="false"
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
                            <view class="relative size-76.34rpx">
                                <view class="size-76.34rpx rd-19.08rpx bg-red" />
                                <view
                                    v-if="row.isFollow"
                                    class="i-tdesign:star-1-filled absolute size-38.17rpx c-#FBC050 -right-19.08rpx -top-19.08rpx"
                                />
                            </view>
                            <view class="ml-19.08rpx flex-1">
                                <view class="flex items-center">
                                    <view class="text-22.9rpx lh-38.17rpx">{{ row.name }}</view>
                                    <view class="ml-19.08rpx text-19.08rpx c-primary6/50 lh-38.17rpx">
                                        {{ row.position }}
                                    </view>
                                </view>
                                <view
                                    v-if="row.companyName || row.department"
                                    class="text-19.08rpx c-primary6/50 lh-38.17rpx"
                                >
                                    <text>{{ row.companyName }}</text>
                                    <text v-if="row.department">· {{ row.department }}</text>
                                </view>
                                <view class="mt-9.54rpx">
                                    <view class="flex flex-wrap text-19.08rpx c-#ffffff lh-26.72rpx -m-4.77rpx">
                                        <view class="m-4.77rpx rd-19.08rpx bg-primary6/50 px-9.54rpx">
                                            {{ formatDate(new Date(row.createTime)) }} 新增
                                        </view>
                                        <view class="m-4.77rpx rd-19.08rpx bg-#FBC050 px-9.54rpx">电话联系 5次</view>
                                        <view class="m-4.77rpx rd-19.08rpx bg-#FBC050 px-9.54rpx">短信联系 5次</view>
                                        <view class="m-4.77rpx rd-19.08rpx bg-#FBC050 px-9.54rpx">拜访 10次</view>
                                        <view class="m-4.77rpx rd-19.08rpx bg-#FBC050 px-9.54rpx">撰写记事 5次</view>
                                        <view class="m-4.77rpx rd-19.08rpx bg-#F95585 px-9.54rpx">成交 5笔</view>
                                        <view class="m-4.77rpx rd-19.08rpx bg-#9BD073 px-9.54rpx">支出 5笔</view>
                                    </view>
                                </view>
                            </view>
                            <view class="i-ri:more-line size-38.17rpx c-primary6/50" />
                        </view>
                        <view
                            v-if="row.companyDistrictName"
                            class="mt-19.08rpx rd-7.63rpx bg-#F3F4F4 p-[9.54rpx_19.08rpx]"
                        >
                            <!--                            <view class="mb-9.54rpx"> -->
                            <!--                                <wd-text -->
                            <!--                                    :color="withAlpha(Theme.primary6, 0.5)" -->
                            <!--                                    :lines="2" -->
                            <!--                                    line-height="28.63rpx" -->
                            <!--                                    size="19.08rpx" -->
                            <!--                                    text="记事：Chrome浏览器默认的最小字体大小取决于不同的版本和配置。在最新的Chrome浏览器版本中，最小字体大小通常设置为12px。记事：Chrome浏览器默认的最小字体大小取决于不同的版本和配置。在最新的Chrome浏览器版本中，最小字体大小通常设置为12px。" -->
                            <!--                                /> -->
                            <!--                            </view> -->
                            <view v-if="row.companyDistrictName" class="text-19.08rpx c-primary6/50 lh-28.63rpx">
                                <text>位置：</text>
                                <text>{{ row.companyProvinceName }}</text>
                                <text>{{ row.companyCityName }}</text>
                                <text>{{ row.companyDistrictName }}</text>
                                <text>{{ row.companyAddress }}</text>
                            </view>
                        </view>
                    </view>
                </view>
                <template #empty>
                    <view class="bg-#ffffff py-57.25rpx">
                        <view class="flex flex-col items-center">
                            <view class="i-icon-park-outline:termination-file size-76.34rpx c-primary6/10" />
                            <view class="mt-19.08rpx text-22.90rpx c-primary6/50 lh-38.17rpx">千里之行，始于足下</view>
                            <view class="text-19.08rpx c-#492FD3 lh-38.17rpx" @click="onAddContact()">
                                添加一条试试
                            </view>
                        </view>
                    </view>
                </template>
            </z-paging>
        </view>
    </view>
</template>

<style scoped></style>
