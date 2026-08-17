<script setup>
    const router = useRouter();

    onLoad(() => {
        router.replaceAll({path: "/pages/home"});
    });
</script>

<template>
    <view />
</template>
