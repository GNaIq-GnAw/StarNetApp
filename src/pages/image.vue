<script setup>
    import {useImagePreview} from "@wot-ui/ui";

    const {previewImage} = useImagePreview();

    function handlePreview() {
        previewImage({
            images: [
                "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
                "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
                "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            ]
        });
    }
</script>

<template>
    <view>
        <wd-button @click="handlePreview">
            预览图片
        </wd-button>
        <wd-image-preview />
    </view>
</template>

<style scoped></style>
