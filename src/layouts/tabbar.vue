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
            console.log("route", route.name);
            if (route.name && route.name !== activeTabbar.value.name) {
                setTabbarItemActive(route.name);
            }
        });
    });
</script>

<template>
    <view class="h-full flex flex-col">
        <view class="flex-1 of-hidden">
            <slot />
        </view>
        <view
            :style="{
                '--wot-tabbar-height': '132rpx',
                '--wot-tabbar-item-title-font-size': '28rpx',
                '--wot-tabbar-item-title-line-height': '40rpx'
            }"
        >
            <wd-tabbar :model-value="activeTabbar.name" bordered @change="handleTabbarChange">
                <wd-tabbar-item
                    v-for="(item, index) in tabbarList"
                    :key="index"
                    :name="item.name"
                    :title="item.title"
                    :value="getTabbarItemValue(item.name)"
                >
                    <template #icon="{active}">
                        <view :class="item.icon" class="mb-12rpx size-40rpx" />
                    </template>
                </wd-tabbar-item>
            </wd-tabbar>
        </view>
    </view>
</template>

<style lang="scss" scoped>
    :deep(.wd-tabbar) {
        @apply rd-t-40rpx;
    }
</style>
