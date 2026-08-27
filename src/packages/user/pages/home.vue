<script setup>
    definePage({
        layout: "tabbar",
        style: {
            navigationBarTitleText: "我的"
        }
    });
</script>

<template>
    <view class="h-full of-auto bg-#ffffff">
        <view v-for="i in 100" :key="i">{{ i }}</view>
    </view>
</template>

<style scoped></style>
