<script setup>
    import {Apis} from "@/api1";

    definePage({
        name: "home",
        layout: "tabbar",
        style: {
            navigationBarTitleText: "首页"
        }
    });

    const {rpx2px} = useSystemInfo();

    const {fileChoose} = useFileUpload();

    const onUpload = async () => {
        const file = await fileChoose();

        console.log("file", URL.createObjectURL(file));
    };
</script>

<template>
    <view>
        <wd-button size="small" type="primary" @click="$Router.push({name: 'PagesForm'})">form</wd-button>
        <wd-button size="small" type="primary" @click="$Router.push({name: 'PagesImage'})">image</wd-button>
        <wd-button size="small" type="primary" @click="onUpload()">upload</wd-button>
        <wd-qr-code text="https://wot-ui.cn" :size="rpx2px(400)" />
    </view>
</template>

<style scoped></style>
