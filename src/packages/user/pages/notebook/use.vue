<script setup>
    import {resolvePage} from "@/router/resolve.js";

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

    const onCreateNotebook = () => {
        const to = resolvePage({name: "UserNotebookCreate"});

        uni.navigateTo({
            url: to.path
        });
    };
</script>

<template>
    <view class="h-full flex flex-col of-hidden bg-#ffffff">
        <wd-navbar
            :bordered="false"
            left-arrow
            left-text="选择记事本"
            safe-area-inset-top
            @click-left="$navigateBack()"
        >
            <template #right>
                <view class="i-icon-park-outline:lock size-40rpx" />
                <view class="i-icon-park-outline:plus ml-32rpx size-40rpx" @click="onCreateNotebook" />
            </template>
        </wd-navbar>
        <view class="bg-#f3f4f4 p-[20rpx_40rpx] text-20rpx c-#FA8C16 lh-40rpx">
            记事本中的内容数据采用独立管理方式不互通
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
                        class="mx-20rpx flex items-center b-b-(1px primary6/10 solid) bg-#ffffff p-40rpx"
                    >
                        <view class="lh-40rpx">
                            <view class="text-24rpx fw-600">
                                默认记事
                            </view>
                            <view class="text-20rpx c-primary6/50">
                                联系人记录30条 · 收支记录442条
                            </view>
                        </view>
                        <view class="i-icon-park-outline:check-small ml-auto size-40rpx" />
                    </view>
                </view>
            </z-paging>
        </view>
    </view>
</template>

<style scoped></style>
