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

    const notebookStore = useNotebookStore();

    const pagingRef = ref(null);

    const list = ref([]);

    const queryList = async () => {
        try {
            const notebookId = notebookStore.defaultNotebook.id;
            const {data} = await Apis.contact.getContactsByNotebook({pathParams: {notebookId}});

            pagingRef.value.complete(data);
        } catch {
            pagingRef.value.complete(false);
        }
    };

    const onListChange = vlist => {
        list.value = vlist;
    };

    // 加载首页数据
    const loadHomeData = async () => {
        try {
            await notebookStore.getNotebooks();
            pagingRef.value?.reload();
        } catch (e) {
            console.log("loadHomeData -> failed", e);
        }
    };

    const onUseNotebook = () => {
        const to = resolvePage({name: "UserNotebookUse"});

        uni.navigateTo({
            url: to.path,
            events: {
                "reload:data": loadHomeData
            }
        });
    };

    const isScroll = ref(false);

    const onScroll = e => {
        console.log("onScroll", e);
        isScroll.value = e.detail.scrollTop > 0;
    };

    const show = ref(false);

    const onAddContact = () => {
        show.value = true;
    };

    onMounted(loadHomeData);
</script>

<template>
    <wd-popup v-model="show" custom-class="rd-19.08rpx">
        <view class="box-border w-673.67rpx p-38.17rpx lh-38.17rpx">
            <view class="flex items-center" @click="$Router.push({name: 'ContactCreate'})">
                <view class="i-ant-design:user-add-outlined size-38.17rpx" />
                <view class="ml-38.17rpx">
                    <view class="text-22.90rpx">手动添加</view>
                    <view class="text-19.08rpx c-primary6/50">日常手动记录联系人</view>
                </view>
            </view>
            <view class="my-38.17rpx h-1px bg-primary6/10" />
            <view class="flex items-center" @click="$Router.push({name: 'ContactSync'})">
                <view class="i-ant-design:usergroup-add-outlined size-38.17rpx" />
                <view class="ml-38.17rpx">
                    <view class="text-22.90rpx">导入通讯录</view>
                    <view class="text-19.08rpx c-primary6/50">自动同步通讯录中联系人姓名、联系方式等信息</view>
                </view>
            </view>
        </view>
    </wd-popup>
    <view class="h-full flex flex-col bg-#f3f4f4">
        <view
            v-if="isScroll"
            :style="{
                'padding-top': `calc(${systemInfo?.safeAreaInsets?.top}px + 19.08rpx)`
            }"
            class="bg-#ffffff pb-19.08rpx"
        >
            <view class="mx-38.17rpx mb-19.08rpx flex items-center">
                <view class="h-38.17rpx w-257.63rpx rd-19.08rpx bg-primary6" />
                <view class="ml-auto">
                    <text class="i-carbon:search size-38.17rpx" />
                    <text class="i-carbon:add-large ml-30.53rpx size-38.17rpx" @click="onAddContact()" />
                </view>
            </view>
            <view class="flex items-center">
                <view class="pl-38.17rpx pr-101.15rpx">
                    <view class="text-19.08rpx c-primary6/50 lh-38.17rpx">新增人脉(名)</view>
                    <view class="text-30.53rpx c-primary6 fw-600 lh-38.17rpx">300</view>
                </view>
                <view class="h-19.08rpx w-1px bg-#bbbbbb" />
                <view class="pl-38.17rpx pr-101.15rpx">
                    <view class="text-19.08rpx c-primary6/50 lh-38.17rpx">产生成交(名)</view>
                    <view class="text-30.53rpx c-primary6 fw-600 lh-38.17rpx">22</view>
                </view>
                <view class="h-19.08rpx w-1px bg-#bbbbbb" />
                <view class="pl-38.17rpx pr-101.15rpx">
                    <view class="text-19.08rpx c-primary6/50 lh-38.17rpx">产生支出(名)</view>
                    <view class="text-30.53rpx c-primary6 fw-600 lh-38.17rpx">30</view>
                </view>
            </view>
        </view>
        <view
            v-else
            :style="{
                'background': `url(${HomeBgT}) no-repeat`,
                'background-size': `100% calc(${systemInfo?.safeAreaInsets?.top}px + 274.81rpx)`,
                'padding-top': `calc(${systemInfo?.safeAreaInsets?.top}px + 22.9rpx)`
            }"
            class="px-38.17rpx pb-38.17rpx c-#ffffff"
        >
            <view class="mb-22.9rpx flex items-center">
                <view class="flex items-center" @click="onUseNotebook">
                    <text class="text-30.53rpx lh-38.17rpx">{{ notebookStore.defaultNotebook?.name }}</text>
                    <text class="i-carbon:chevron-down ml-11.45rpx size-38.17rpx" />
                </view>
                <view class="ml-auto">
                    <text class="i-carbon:search size-38.17rpx" />
                    <text class="i-carbon:add-large ml-30.53rpx size-38.17rpx" @click="onAddContact()" />
                </view>
            </view>
            <view class="mb-19.08rpx flex">
                <view>
                    <view class="text-22.9rpx lh-38.17rpx">新增人脉</view>
                    <view class="my-5.73rpx flex items-center lh-none">
                        <view class="text-45.8rpx">300</view>
                        <view class="ml-11.45rpx text-22.9rpx">名</view>
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
                <view class="text-19.08rpx lh-38.17rpx">新增</view>
                <view class="i-icon-park-outline:filter ml-11.45rpx size-19.08rpx" />
            </view>
        </view>
        <view class="flex-1">
            <z-paging
                ref="pagingRef"
                :auto="false"
                :empty-view-center="false"
                auto-show-system-loading
                cell-height-mode="dynamic"
                force-close-inner-list
                use-virtual-list
                @query="queryList"
                @scroll="onScroll"
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
                                            {{ row.createTime }}
                                        </view>
                                        <!--                                        <view class="m-4.77rpx rd-19.08rpx bg-#FBC050 px-9.54rpx">电话联系 5次</view> -->
                                    </view>
                                </view>
                            </view>
                            <view class="i-ri:more-line size-38.17rpx c-primary6/50" />
                        </view>
                        <view
                            class="mt-19.08rpx rd-7.63rpx bg-#F3F4F4 p-[9.54rpx_19.08rpx] text-19.08rpx c-primary6/50 lh-28.63rpx"
                        >
                            记事：Chrome浏览器默认的最小字体大小取决于不同的版本和配置。在最新的Chrome浏览器版本中，最小字体大小通常设置为12px。此外，还可...
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
