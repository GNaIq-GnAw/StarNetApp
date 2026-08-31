<script setup>
    import {resolvePage} from "@/router/resolve.js";

    const pagingRef = ref(null);

    const list = ref([]);

    const notebookStore = useNotebookStore();

    const queryList = async () => {
        try {
            const data = await notebookStore.getNotebooks();

            pagingRef.value.complete(data);
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
            url: to.path,
            events: {
                "reload:data": () => {
                    pagingRef.value.reload();
                }
            }
        });
    };

    const setDefaultNotebook = id => {
        notebookStore.defaultNotebook = id;
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
                <view class="i-icon-park-outline:lock size-38.17rpx" />
                <view class="i-icon-park-outline:plus ml-30.53rpx size-38.17rpx" @click="onCreateNotebook" />
            </template>
        </wd-navbar>
        <view class="bg-#f3f4f4 p-[19.08rpx_38.17rpx] text-19.08rpx c-#FA8C16 lh-38.17rpx">
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
                        class="mx-19.08rpx flex items-center b-b-(1px primary6/10 solid) bg-#ffffff p-38.17rpx last:b-b-none"
                        @click="setDefaultNotebook(row.id)"
                    >
                        <view class="lh-38.17rpx">
                            <view class="text-22.9rpx fw-600">{{ row.name }}</view>
                            <!--                            <view class="text-19.08rpx c-primary6/50">联系人记录30条 · 收支记录442条</view> -->
                        </view>
                        <view v-if="row.isDefault" class="i-icon-park-outline:check-small ml-auto size-38.17rpx" />
                    </view>
                </view>
            </z-paging>
        </view>
    </view>
</template>

<style scoped></style>
