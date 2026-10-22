<script setup>
    definePage({
        style: {
            "app-plus": {
                softinputMode: "adjustResize"
            }
        }
    });

    const {systemInfo} = useSystemInfo();

    const notebookStore = useNotebookStore();

    const pagingRef = ref(null);

    const list = ref([]);

    const query = reactive({keyword: ""});

    const [historyShow, toggleHistoryShow] = useToggle(true);

    const {list: historyList, add: addHistory, clear: clearHistory} = useSearchHistory();

    // 关键字去空格，顺带兜底非字符串
    const currentKeyword = () => `${query.keyword ?? ""}`.trim();

    // 请求序号：连续搜索时只认最后一次响应，避免旧结果覆盖新结果
    let requestSeq = 0;

    const queryList = async () => {
        const seq = ++requestSeq;
        const keyword = currentKeyword();

        if (!keyword) {
            // 空关键字直接给空结果，避免 z-paging 卡在 loading
            pagingRef.value.complete([]);

            return;
        }

        try {
            const {data} = await Apis.contact.getContactsByNotebook({
                pathParams: {notebookId: notebookStore.defaultNotebook.id},
                params: {keyword}
            });

            // 已有更新的搜索发出，丢弃本次结果
            if (seq !== requestSeq) return;

            pagingRef.value.complete(data);
        } catch (e) {
            console.log("search contacts failed", e);

            if (seq !== requestSeq) return;

            pagingRef.value.complete(false);
        }
    };

    const onListChange = vlist => {
        list.value = vlist;
    };

    // 发起搜索即记入历史，不依赖接口成败
    const reloadData = async () => {
        const keyword = currentKeyword();

        if (!keyword) {
            toggleHistoryShow(true);

            return;
        }

        addHistory(keyword);
        toggleHistoryShow(false);

        await nextTick();
        pagingRef.value.reload();
    };

    const onSelectHistory = text => {
        query.keyword = text;
        reloadData();
    };

    const onClearHistory = () => {
        clearHistory();

        uni.showToast({title: "搜索记录已清除", icon: "success"});
    };
</script>

<template>
    <view class="box-border h-full flex flex-col bg-#f3f4f4">
        <view
            :style="{
                'padding-top': `${systemInfo?.safeAreaInsets?.top}px`,
                '--wot-search-padding': '13.36rpx 38.17rpx'
            }"
            class="bg-#ffffff"
        >
            <wd-search
                v-model="query.keyword"
                placeholder-left
                variant="filled"
                @cancel="$Router.back()"
                @clear="reloadData()"
                @search="reloadData()"
            />
        </view>
        <view v-if="historyShow" class="flex-1">
            <view class="bg-#ffffff p-[38.17rpx_38.17rpx_19.08rpx]">
                <template v-if="historyList.length">
                    <view class="mb-19.08rpx flex items-center">
                        <view class="text-22.90rpx lh-38.17rpx">搜索历史</view>
                        <view class="i-icon-park-outline:delete ml-auto size-38.17rpx" @click="onClearHistory()" />
                    </view>
                    <view class="mb-38.17rpx text-19.08rpx c-primary6 lh-38.17rpx">
                        <view class="flex flex-wrap items-center -m-4.77rpx">
                            <view
                                v-for="text in historyList"
                                :key="text"
                                class="m-4.77rpx rd-19.08rpx bg-#f3f4f4 px-19.08rpx"
                                @click="onSelectHistory(text)"
                            >
                                {{ text }}
                            </view>
                        </view>
                    </view>
                </template>
                <view class="text-19.08rpx c-#FBC050 lh-38.17rpx">可通过姓名、联系电话、职位或公司名称进行搜索</view>
            </view>
        </view>
        <view v-else class="flex flex-1 flex-col of-hidden">
            <view class="p-[19.08rpx_38.17rpx] text-19.08rpx c-primary6/50 lh-38.17rpx">共找到{{ list.length }}人</view>
            <view class="flex-1">
                <z-paging
                    ref="pagingRef"
                    :auto="false"
                    :empty-view-center="false"
                    :loading-more-enabled="false"
                    auto-show-system-loading
                    cell-height-mode="dynamic"
                    force-close-inner-list
                    use-virtual-list
                    @query="queryList"
                    @virtual-list-change="onListChange"
                >
                    <template #empty>
                        <view
                            class="m-19.08rpx flex flex-col items-center rd-7.63rpx bg-#ffffff p-[57.25rpx_0] lh-38.17rpx"
                        >
                            <view class="i-icon-park-outline:termination-file size-76.34rpx c-primary6/10" />
                            <view class="mt-19.08rpx text-22.90rpx c-primary6/50">抱歉，未搜索到结果</view>
                        </view>
                    </template>
                    <view class="bg-#ffffff">
                        <view
                            v-for="row in list"
                            :id="`zp-id-${row.zp_index}`"
                            :key="row.zp_index"
                            class="mx-19.08rpx b-b-(1px primary6/10 solid) bg-#ffffff p-19.08rpx last:b-b-none"
                        >
                            <view class="flex">
                                <view class="relative size-76.34rpx">
                                    <view class="size-76.34rpx of-hidden rd-19.08rpx">
                                        <image v-if="row.sex === '男'" class="size-76.34rpx" src="@/static/male.png" />
                                        <image v-else class="size-76.34rpx" src="@/static/female.png" />
                                    </view>
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
                                            <view
                                                v-if="row?.callNoteCount > 0"
                                                class="m-4.77rpx rd-19.08rpx bg-#FBC050 px-9.54rpx"
                                            >
                                                电话联系 {{ row.callNoteCount }}次
                                            </view>
                                            <view
                                                v-if="row?.smsNoteCount > 0"
                                                class="m-4.77rpx rd-19.08rpx bg-#FBC050 px-9.54rpx"
                                            >
                                                短信联系 {{ row.smsNoteCount }}次
                                            </view>
                                            <view
                                                v-if="row?.visitNoteCount > 0"
                                                class="m-4.77rpx rd-19.08rpx bg-#FBC050 px-9.54rpx"
                                            >
                                                拜访 {{ row.visitNoteCount }}次
                                            </view>
                                            <view
                                                v-if="row?.normalNoteCount > 0"
                                                class="m-4.77rpx rd-19.08rpx bg-#FBC050 px-9.54rpx"
                                            >
                                                撰写记事 {{ row.normalNoteCount }}次
                                            </view>
                                            <view
                                                v-if="row?.dealCount > 0"
                                                class="m-4.77rpx rd-19.08rpx bg-#F95585 px-9.54rpx"
                                            >
                                                成交 {{ row.dealCount }}笔
                                            </view>
                                            <view
                                                v-if="row?.expenseCount > 0"
                                                class="m-4.77rpx rd-19.08rpx bg-#9BD073 px-9.54rpx"
                                            >
                                                支出 {{ row.expenseCount }}笔
                                            </view>
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
                </z-paging>
            </view>
        </view>
    </view>
</template>

<style scoped></style>
