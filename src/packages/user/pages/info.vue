<script setup></script>

<template>
    <view class="h-full flex flex-col of-auto bg-#f3f4f4">
        <wd-navbar
            :bordered="false"
            left-arrow
            left-text="个人中心"
            safe-area-inset-top
            @click-left="$navigateBack()"
        />
        <view
            :style="{
                '--wot-cell-padding': '38.17rpx',
                '--wot-cell-border-margin-horizontal': '38.17rpx',
                '--wot-cell-title-color': withAlpha(Theme.primary6, 0.5)
            }"
            class="flex-1"
        >
            <view class="mt-19.08rpx">
                <wd-cell-group border title-width="91.60rpx">
                    <wd-cell clickable css-icon suffix-icon="i-carbon-chevron-right !size-38.17rpx" title="头像">
                        <view class="relative flex justify-end">
                            <view class="absolute size-76.34rpx rd-38.17rpx bg-red -top-19.08rpx" />
                        </view>
                    </wd-cell>
                    <wd-cell clickable css-icon suffix-icon="i-carbon-chevron-right !size-38.17rpx" title="昵称">
                        <view class="c-primary6">昵称昵称</view>
                    </wd-cell>
                    <wd-cell clickable css-icon suffix-icon="i-carbon-chevron-right !size-38.17rpx" title="性别">
                        <view>未知</view>
                    </wd-cell>
                    <wd-cell clickable css-icon suffix-icon="i-carbon-chevron-right !size-38.17rpx" title="生日">
                        <view class="c-primary6">2023/10/13</view>
                    </wd-cell>
                </wd-cell-group>
            </view>
            <view class="mt-19.08rpx">
                <wd-cell-group border title-width="91.60rpx">
                    <wd-cell clickable css-icon suffix-icon="i-carbon-chevron-right !size-38.17rpx" title="手机号码">
                        <view class="c-primary6">153****1521</view>
                    </wd-cell>
                    <wd-cell
                        clickable
                        css-icon
                        suffix-icon="i-carbon-chevron-right !size-38.17rpx"
                        title="登录密码"
                        value="未设置"
                    />
                    <wd-cell
                        clickable
                        css-icon
                        suffix-icon="i-carbon-chevron-right !size-38.17rpx"
                        title="注销账号"
                    />
                </wd-cell-group>
            </view>
        </view>
        <view
            class="rd-t-38.17rpx bg-#ffffff py-38.17rpx text-center"
            style="box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.4)"
        >
            <text class="text-26.72rpx lh-38.17rpx">退出登录</text>
        </view>
    </view>
</template>

<style scoped></style>
