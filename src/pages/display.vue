<script setup>
    const instance = getCurrentInstance().proxy;
    const eventChannel = instance.getOpenerEventChannel();

    const items = [
        {label: "全部", value: 1},
        {label: "新增", value: 2},
        {label: "电话联系", value: 3},
        {label: "短信联系", value: 4},
        {label: "拜访", value: 5},
        {label: "笔记", value: 6},
        {label: "成交支出", value: 7}
    ];

    const enabledSync = ref(false);

    const model = reactive({startDate: "", endDate: "", noteType: 1});

    const onSave = () => {
        eventChannel.emit("reload:data");
        uni.navigateBack();
    };
</script>

<template>
    <view class="h-full flex flex-col of-hidden bg-#f3f4f4">
        <wd-navbar
            :bordered="false"
            left-arrow
            left-text="展示设置"
            safe-area-inset-top
            @click-left="$navigateBack()"
        />
        <view class="bg-#f3f4f4 p-[19.08rpx_38.17rpx] text-19.08rpx lh-38.17rpx">
            <wd-checkbox v-model="enabledSync" type="square">
                <text class="c-#101010">同时应用于“收支管理”展示设置</text>
            </wd-checkbox>
        </view>
        <view class="flex-1 of-auto">
            <view
                :style="{'--wot-cell-padding': 0, '--wot-radio-horizontal-margin': 0}"
                class="bg-#ffffff p-[38.17rpx_19.08rpx]"
            >
                <wd-form :model="model" layout="vertical">
                    <view class="mx-19.08rpx">
                        <wd-form-item label="发生事件的时间范围" title-width="100%">
                            <template #title>
                                <view class="w-full flex items-center">
                                    <view>时间选择</view>
                                    <view class="ml-auto flex items-center">
                                        <wd-checkbox type="square">
                                            <text class="c-primary6/50">全部</text>
                                        </wd-checkbox>
                                    </view>
                                </view>
                            </template>
                            <view class="flex items-center">
                                <custom-datetime-picker
                                    v-model:value="model.startDate"
                                    placeholder="请选择开始月份"
                                    type="date"
                                />
                                <view class="mx-21.95rpx text-19.08rpx c-primary6 lh-38.17rpx">至</view>
                                <custom-datetime-picker
                                    v-model:value="model.endDate"
                                    placeholder="请选择结束月份"
                                    type="date"
                                />
                            </view>
                        </wd-form-item>
                    </view>
                    <view class="my-38.17rpx h-1px bg-primary6/10" />
                    <view class="mx-19.08rpx">
                        <wd-form-item title="事件类型选择" label="仅展示所产生某种事件的内容">
                            <wd-radio-group v-model="model.noteType" direction="horizontal">
                                <view class="flex flex-wrap -m-9.54rpx">
                                    <view v-for="item in items" :key="item.value" class="m-9.54rpx">
                                        <wd-radio :value="item.value">
                                            <template #icon="{isChecked}">
                                                <wd-button
                                                    :type="isChecked ? 'primary' : 'info'"
                                                    custom-class="w-152.67rpx"
                                                    size="small"
                                                >
                                                    {{ item.label }}
                                                </wd-button>
                                            </template>
                                        </wd-radio>
                                    </view>
                                </view>
                            </wd-radio-group>
                        </wd-form-item>
                    </view>
                </wd-form>
            </view>
        </view>
        <view class="flex items-center rd-7.63rpx bg-#ffffff p-[19.08rpx_38.17rpx]">
            <view class="w-190.84rpx">
                <wd-button block variant="plain" @click="reset()">重置</wd-button>
            </view>
            <view class="ml-19.08rpx flex-1">
                <wd-button block @click="onSave()">使用当前设置</wd-button>
            </view>
        </view>
    </view>
</template>

<style scoped></style>
