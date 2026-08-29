<script setup>
    import {resolvePage} from "@/router/resolve.js";

    const pagingRef = ref(null);

    const list = ref(Array.from({length: 10}).map((_, index) => ({v: index, id: index})));

    const queryList = async () => {
        try {
            pagingRef.value.complete([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        } catch {
            pagingRef.value.complete(false);
        }
    };

    const onCreateNotebook = () => {
        const to = resolvePage({name: "UserNotebookCreate"});

        uni.navigateTo({
            url: to.path
        });
    };
</script>

<template>
    <view class="h-full flex flex-col of-hidden bg-#f3f4f4">
        <wd-navbar :bordered="false" left-arrow left-text="记事本" safe-area-inset-top @click-left="$navigateBack()">
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
                v-model="list"
                :loading-more-enabled="false"
                force-close-inner-list
                @query="queryList"
            >
                <view class="bg-#ffffff">
                    <view
                        v-for="row in list"
                        :key="row.id"
                        class="mx-19.08rpx flex items-center b-b-(1px primary6/10 solid) bg-#ffffff p-38.17rpx"
                    >
                        <view class="i-icon-park-outline:hamburger-button handle size-38.17rpx" />
                        <view class="ml-38.17rpx lh-38.17rpx">
                            <view class="text-22.9rpx fw-600">默认记事-{{ row.v }}</view>
                            <view class="text-19.08rpx c-primary6/50">联系人记录30条 · 收支记录442条</view>
                        </view>
                        <view class="i-ri:edit-box-line ml-auto size-38.17rpx" />
                    </view>
                </view>
            </z-paging>
        </view>
    </view>
</template>

<style scoped></style>
