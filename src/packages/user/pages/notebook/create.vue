<script setup>
    const formRef = ref(null);

    const radio = ref(1);
</script>

<template>
    <view class="h-full flex flex-col of-hidden bg-#f3f4f4">
        <wd-navbar
            :bordered="false"
            left-arrow
            left-text="添加记事本"
            safe-area-inset-top
            @click-left="$navigateBack()"
        />
        <view class="flex-1 of-auto">
            <wd-form ref="formRef" error-type="toast" hide-asterisk layout="vertical" title-width="100%">
                <view class="mt-20rpx bg-#ffffff p-[40rpx_20rpx]">
                    <view class="mx-20rpx">
                        <wd-form-item
                            label="可由汉字、英文与数字构成，最长不超过10个字符"
                            prop="xxx1"
                            title="记事本名称"
                        >
                            <view class="b-(1px primary6/10 solid) rd-8rpx p-[10rpx_20rpx]">
                                <wd-input placeholder="请输入记事本名称" type="text" />
                            </view>
                        </wd-form-item>
                    </view>
                    <view class="my-40rpx h-1px bg-primary6/10" />
                    <view class="mx-20rpx">
                        <wd-form-item
                            label="记事本如果设置为隐私状态，使用时需要先进行解密操作"
                            prop="xxx2"
                            title="是否为隐私记事"
                        >
                            <wd-radio-group v-model="radio" direction="horizontal">
                                <wd-radio :value="1">
                                    <template #icon="{isChecked}">
                                        <wd-button :type="isChecked ? 'primary' : 'info'" size="small">正常</wd-button>
                                    </template>
                                </wd-radio>
                                <wd-radio :value="2">
                                    <template #icon="{isChecked}">
                                        <wd-button :type="isChecked ? 'primary' : 'info'" size="small">隐私</wd-button>
                                    </template>
                                </wd-radio>
                            </wd-radio-group>
                        </wd-form-item>
                    </view>
                </view>
                <view class="mt-20rpx bg-#ffffff p-[40rpx_20rpx]">
                    <view class="mx-20rpx">
                        <wd-form-item label="可为记事本添加独特皮肤，彰显私人个性" prop="xxx3" title="记事本皮肤">
                            <view class="flex flex-wrap -m-10rpx">
                                <image
                                    v-for="i in 10"
                                    :key="i"
                                    :class="{'outline-(2px solid #fbc050)': i === 1}"
                                    class="m-10rpx h-120rpx w-200rpx rd-8rpx"
                                    src="@/static/home-bg-t.png"
                                />
                            </view>
                        </wd-form-item>
                    </view>
                </view>
            </wd-form>
        </view>
        <view class="flex items-center rd-8rpx bg-#ffffff p-[20rpx_40rpx]">
            <view class="w-200rpx">
                <wd-button block variant="plain">取消</wd-button>
            </view>
            <view class="ml-20rpx flex-1">
                <wd-button block>保存</wd-button>
            </view>
        </view>
    </view>
</template>

<style scoped></style>
