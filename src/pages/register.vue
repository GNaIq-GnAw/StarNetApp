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

    const model = reactive({phone: "", code: ""});

    const schema = zodAdapter(
        z.object({
            phone: z.string().min(1, "请输入手机号码").regex(Regex.Phone, "手机号码格式不正确"),
            code: z.string().min(1, "请输入验证码").regex(Regex.CodeSix, "验证码格式不正确")
        }),
        {
            isRequired: () => true
        }
    );

    const formRef = ref(null);

    const router = useRouter();

    const userStore = useUserStore();

    const {
        countDown,
        isCounting,
        send: getCaptcha
    } = useCaptcha({
        onStart: () => {
            uni.showToast({title: "验证码发送成功", icon: "none"});
        }
    });

    const onSubmit = async () => {
        uni.showLoading({mask: true});

        try {
            const {valid, errors} = await formRef.value?.validate();

            if (valid) {
                await userStore.loginByCode(model);

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
        class="box-border h-full flex flex-col of-hidden bg-#ffffff"
    >
        <image class="mx-auto mt-95.42rpx size-152.67rpx rd-19.08rpx" src="@/static/logo.png" />
        <view class="mx-auto mt-19.08rpx text-26.72rpx c-primary6/50 fw-600 lh-38.17rpx">无他，惟手熟尔</view>
        <view
            :style="{
                '--wot-input-inner-height': '38.17rpx',
                '--wot-cell-padding': 0,
                '--wot-cell-title-font-size': '22.9rpx',
                '--wot-cell-title-line-height': '38.17rpx',
                '--wot-cell-vertical-padding-top': '19.08rpx'
            }"
            class="mx-143.13rpx mt-95.42rpx"
        >
            <wd-form ref="formRef" :model="model" :schema="schema" error-type="toast" hide-asterisk layout="vertical">
                <view class="mb-38.17rpx">
                    <wd-form-item prop="phone" title="手机号码">
                        <view class="b-(1px primary6/10 solid) rd-7.63rpx p-[9.54rpx_19.08rpx]">
                            <wd-input v-model="model.phone" placeholder="请输入手机号码" type="text" />
                        </view>
                    </wd-form-item>
                </view>
                <view>
                    <wd-form-item prop="code" title="验证码" title-width="100%">
                        <template #title>
                            <view class="w-full flex items-center">
                                <view>验证码</view>
                                <view class="ml-auto text-19.08rpx lh-38.17rpx">
                                    <text v-if="isCounting" class="c-primary6/50">{{ countDown }}秒后重新获取</text>
                                    <text v-else class="c-#2F59F4" @click="getCaptcha({phone: model.phone})">
                                        获取验证码
                                    </text>
                                </view>
                            </view>
                        </template>
                        <view class="b-(1px primary6/10 solid) rd-7.63rpx p-[9.54rpx_19.08rpx]">
                            <wd-input
                                v-model="model.code"
                                inputmode="numeric"
                                placeholder="请输入验证码"
                                type="digit"
                            />
                        </view>
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
            <wd-button :disabled="!isAgree" block size="medium" @click="onSubmit()">登录/注册</wd-button>
        </view>
        <view class="mx-auto mt-38.17rpx text-19.08rpx c-#2F59F4 lh-38.17rpx" @click="$Router.push({name: 'Login'})">
            密码登录
        </view>
    </view>
</template>

<style lang="scss" scoped></style>
