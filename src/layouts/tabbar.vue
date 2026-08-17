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
    <view class="h-full flex flex-col">
        <view class="flex-1 of-hidden">
            <slot />
        </view>
        <view
            :style="{
                '--wot-tabbar-height': '108rpx',
                '--wot-tabbar-item-title-font-size': '20rpx',
                '--wot-tabbar-item-title-line-height': '40rpx'
            }"
        >
            <wd-tabbar
                :model-value="activeTabbar.name"
                bordered
                safe-area-inset-bottom
                fixed
                @change="handleTabbarChange"
            >
                <wd-tabbar-item
                    v-for="(item, index) in tabbarList"
                    :key="index"
                    :icon="item.icon"
                    :name="item.name"
                    :title="item.title"
                    :value="getTabbarItemValue(item.name)"
                />
            </wd-tabbar>
        </view>
    </view>
</template>
