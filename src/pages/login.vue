<script setup>
    import {zodAdapter} from "@wot-ui/ui";
    import {z} from "zod";
    import {useUserStore} from "@/stores/user.js";

    definePage({
        meta: {
            auth: false
        },
        style: {
            disableScroll: true,
            navigationBarTextStyle: "black",
            "app-plus": {
                softinputMode: "adjustPan"
            },
            "app-harmony": {
                softinputMode: "adjustPan"
            }
        }
    });

    const isAgree = ref(false);

    const {systemInfo} = useSystemInfo();

    const model = reactive({phone: "", password: ""});

    const schema = zodAdapter(
        z.object({
            phone: z.string().min(1, "请输入手机号码").regex(Regex.Phone, "手机号码格式不正确"),
            password: z.string().min(1, "请输入密码")
        }),
        {
            isRequired: () => true
        }
    );

    const formRef = ref(null);

    const router = useRouter();

    const userStore = useUserStore();

    const onSubmit = async () => {
        uni.showLoading({mask: true});

        try {
            const {valid, errors} = await formRef.value?.validate();

            if (valid) {
                await userStore.login(model);

                await router.replaceAll({path: "/pages/home"});
            }

            uni.hideLoading();
        } catch (error) {
            console.log(error, "error");
            uni.hideLoading();
        }
    };
</script>

<template>
    <view
        :style="{
            'padding-top': `${systemInfo?.safeAreaInsets?.top}px`
        }"
        class="box-border h-full flex flex-col of-auto bg-#ffffff"
    >
        <view class="mx-auto mt-95.42rpx size-152.67rpx">
            <wd-img height="152.67rpx" radius="19.08rpx" src="@/static/logo.png" width="152.67rpx" />
        </view>
        <view class="mx-auto mt-19.08rpx text-26.72rpx c-primary6/50 fw-600 lh-38.17rpx">无他，惟手熟尔</view>
        <view :style="{'--wot-cell-padding': 0}" class="mx-143.13rpx mt-95.42rpx">
            <wd-form ref="formRef" :model="model" :schema="schema" error-type="toast" hide-asterisk layout="vertical">
                <view class="mb-38.17rpx">
                    <wd-form-item prop="phone" title="手机号码">
                        <wd-input v-model="model.phone" :compact="false" placeholder="请输入手机号码" type="text" />
                    </wd-form-item>
                </view>
                <view>
                    <wd-form-item prop="password" title="密码">
                        <wd-input
                            v-model="model.password"
                            :compact="false"
                            placeholder="请输入密码"
                            show-password
                            type="safe-password"
                        />
                    </wd-form-item>
                </view>
            </wd-form>
        </view>
        <view class="mx-auto mt-19.08rpx">
            <wd-checkbox v-model="isAgree" type="square">
                <view class="flex items-center text-19.08rpx c-primary6/50 lh-38.17rpx">
                    <view>我已阅读并同意</view>
                    <view class="c-#2F59F4">《隐私协议》</view>
                    <view>与</view>
                    <view class="c-#2F59F4">《用户协议》</view>
                </view>
            </wd-checkbox>
        </view>
        <view
            :style="{'--wot-button-radius-main': '19.08rpx', '--wot-button-font-size-large': '26.72rpx'}"
            class="mx-143.13rpx mt-95.42rpx"
        >
            <wd-button :disabled="!isAgree" block size="medium" @click="onSubmit()">登录</wd-button>
        </view>
        <view class="mx-auto mt-38.17rpx text-19.08rpx c-#2F59F4 lh-38.17rpx" @click="$Router.push({name: 'Register'})">
            验证码登录/注册
        </view>
    </view>
</template>

<style scoped></style>
