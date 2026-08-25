<script setup>
    defineOptions({
        options: {
            virtualHost: true,
            addGlobalClass: true,
            styleIsolation: "shared"
        }
    });

    const router = useRouter();

    const route = useRoute();

    const {activeTabbar, getTabbarItemValue, setTabbarItemActive, tabbarList} = useTabbar();

    function handleTabbarChange({value}) {
        setTabbarItemActive(value);
        router.replaceAll({name: value});
    }

    onMounted(() => {
        // #ifdef APP
        uni.hideTabBar();
        // #endif
        nextTick(() => {
            if (route.name && route.name !== activeTabbar.value.name) {
                setTabbarItemActive(route.name);
            }
        });
    });
</script>

<template>
    <view class="h-full flex flex-col bg-#F3F4F4">
        <view class="flex-1 of-hidden">
            <slot />
        </view>
        <view
            :style="{
                '--wot-tabbar-height': '132rpx',
                '--wot-tabbar-item-title-font-size': '28rpx',
                '--wot-tabbar-item-title-line-height': '40rpx',
                'box-shadow': '0px 2px 6px 0px rgba(0,0,0,0.4)'
            }"
            class="z-1 rd-t-40rpx"
        >
            <wd-tabbar :model-value="activeTabbar.name" inactive-color="#9396a0" @change="handleTabbarChange">
                <wd-tabbar-item
                    v-for="(item, index) in tabbarList"
                    :key="index"
                    :name="item.name"
                    :title="item.title"
                    :value="getTabbarItemValue(item.name)"
                >
                    <template #icon="{active}">
                        <view
                            :class="[item.icon, active ? 'c-primary6' : 'c-#9396a0']"
                            class="iconfont mb-12rpx text-40rpx"
                        />
                    </template>
                </wd-tabbar-item>
            </wd-tabbar>
        </view>
    </view>
</template>

<style lang="scss" scoped>
    :deep(.wd-tabbar) {
        @apply rd-t-40rpx;
        .wd-tabbar-item__body-title {
            font-weight: 600;
        }
    }
</style>
