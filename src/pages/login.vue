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
            phone: z.string().min(1, "请输入手机号码").regex(Regex.Phone, {error: "手机号码格式不正确"}),
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
        class="box-border h-full flex flex-col of-hidden bg-#ffffff"
    >
        <image class="mx-auto mt-100rpx size-160rpx rd-20rpx" src="@/static/logo.png" />
        <view class="mx-auto mt-20rpx text-28rpx c-primary6/50 fw-600 lh-40rpx">
            无他，惟手熟尔
        </view>
        <view
            :style="{
                '--wot-input-inner-height': '40rpx',
                '--wot-cell-padding': 0,
                '--wot-cell-title-font-size': '24rpx',
                '--wot-cell-title-line-height': '40rpx',
                '--wot-cell-vertical-padding-top': '20rpx'
            }"
            class="mx-150rpx mt-100rpx"
        >
            <wd-form ref="formRef" :model="model" :schema="schema" error-type="toast" hide-asterisk layout="vertical">
                <view class="mb-40rpx">
                    <wd-form-item prop="phone" title="手机号码">
                        <view class="b-(1px primary6/10 solid) rd-8rpx p-[10rpx_20rpx]">
                            <wd-input v-model="model.phone" placeholder="请输入手机号码" type="text" />
                        </view>
                    </wd-form-item>
                </view>
                <view>
                    <wd-form-item prop="password" title="密码">
                        <view class="b-(1px primary6/10 solid) rd-8rpx p-[10rpx_20rpx]">
                            <wd-input
                                v-model="model.password"
                                placeholder="请输入密码"
                                show-password
                                type="safe-password"
                            />
                        </view>
                    </wd-form-item>
                </view>
            </wd-form>
        </view>
        <view class="mx-auto mt-20rpx">
            <wd-checkbox v-model="isAgree" type="square">
                <view class="flex items-center text-20rpx c-primary6/50 lh-40rpx">
                    <view>我已阅读并同意</view>
                    <view class="c-#2F59F4">
                        《隐私协议》
                    </view>
                    <view>与</view>
                    <view class="c-#2F59F4">
                        《用户协议》
                    </view>
                </view>
            </wd-checkbox>
        </view>
        <view
            :style="{'--wot-button-radius-main': '20rpx', '--wot-button-font-size-large': '28rpx'}"
            class="mx-150rpx mt-100rpx"
        >
            <wd-button :disabled="!isAgree" block size="medium" @click="onSubmit()">
                登录
            </wd-button>
        </view>
        <view class="mx-auto mt-40rpx text-20rpx c-#2F59F4 lh-40rpx" @click="$Router.push({name: 'PagesRegister'})">
            验证码登录/注册
        </view>
    </view>
</template>

<style scoped></style>
