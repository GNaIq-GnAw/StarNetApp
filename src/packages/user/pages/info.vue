<script setup>
    const userStore = useUserStore();

    const router = useRouter();

    const info = computed(() => userStore.userInfo);

    const dialog = useDialog();

    const onLogout = async () => {
        try {
            await dialog.confirm({
                title: "确定要退出登录当前账号吗？",
                beforeConfirm: async ({resolve}) => {
                    uni.showLoading({title: "正在退出登录", mask: true});

                    try {
                        await userStore.logout();
                        uni.hideLoading();

                        resolve(true);
                    } catch (e) {
                        console.log("logout", e);
                        resolve(true);
                    }
                }
            });

            await sleep(100);

            uni.showToast({title: "退出成功", icon: "none", mask: true});

            router.replaceAll({name: "Login"});
        } catch {
            console.log("点击了取消按钮");
        }
    };
</script>

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
                            <view class="absolute -top-19.08rpx">
                                <wd-img
                                    :src="info?.avatar || 'avatar.png'"
                                    enable-preview
                                    height="76.34rpx"
                                    radius="38.17rpx"
                                    width="76.34rpx"
                                >
                                    <template #error>
                                        <image class="size-80rpx rd-38.17rpx" src="@/static/default-avatar.png" />
                                    </template>
                                </wd-img>
                            </view>
                        </view>
                    </wd-cell>
                    <wd-cell clickable css-icon suffix-icon="i-carbon-chevron-right !size-38.17rpx" title="昵称">
                        <view class="c-primary6">{{ info?.name }}</view>
                    </wd-cell>
                    <wd-cell clickable css-icon suffix-icon="i-carbon-chevron-right !size-38.17rpx" title="性别">
                        <view>{{ info?.sex }}</view>
                    </wd-cell>
                    <wd-cell clickable css-icon suffix-icon="i-carbon-chevron-right !size-38.17rpx" title="生日">
                        <view class="c-primary6">{{ info?.birthday }}</view>
                    </wd-cell>
                </wd-cell-group>
            </view>
            <view class="mt-19.08rpx">
                <wd-cell-group border title-width="91.60rpx">
                    <wd-cell clickable css-icon suffix-icon="i-carbon-chevron-right !size-38.17rpx" title="手机号码">
                        <view class="c-primary6">
                            <wd-text
                                :text="info?.phone"
                                color="var(--wot-cell-value-color)"
                                format
                                line-height="var(--wot-cell-value-line-height)"
                                mode="phone"
                                size="var(--wot-cell-value-font-size)"
                            />
                        </view>
                    </wd-cell>
                    <wd-cell
                        clickable
                        css-icon
                        suffix-icon="i-carbon-chevron-right !size-38.17rpx"
                        title="登录密码"
                        value="未设置"
                    />
                    <wd-cell clickable css-icon suffix-icon="i-carbon-chevron-right !size-38.17rpx" title="注销账号" />
                </wd-cell-group>
            </view>
        </view>
        <view
            class="rd-t-38.17rpx bg-#ffffff py-38.17rpx text-center"
            style="box-shadow: 0 3.82rpx 11.45rpx 0 rgba(0, 0, 0, 0.4)"
            @click="onLogout"
        >
            <text class="text-26.72rpx lh-38.17rpx">退出登录</text>
        </view>
    </view>
</template>

<style scoped></style>
