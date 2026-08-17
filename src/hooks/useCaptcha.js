import {useCountDown} from "wot-design-uni";

const UseCaptchaOptions = {
    timeout: 60 * 1000,
    template: "",
    onStart: () => {}
};

export const useCaptcha = (options = null) => {
    const $options = {...UseCaptchaOptions, ...(options || {})};

    const [loading, setLoading] = useToggle();

    const isCounting = ref(false);
    const {start, reset, current} = useCountDown({
        time: $options.timeout,
        onChange: current => {
            // 开始倒计时
            isCounting.value = current.seconds > 0;
        },
        onFinish: () => {
            // 倒计时结束，重置
            reset();
        }
    });

    const countDown = computed(() => current.value.seconds);

    const label = computed(() => {
        if (loading.value) return "";

        if (isCounting.value) return `重新获取(${countDown.value})`;

        return "获取验证码";
    });

    const checkMobile = mobile => {
        if (!mobile.trim()) {
            uni.showToast({title: "请输入手机号", icon: "none"});

            return false;
        }

        if (!Regex.Phone.test(mobile)) {
            uni.showToast({title: "手机号格式不正确", icon: "none"});

            return false;
        }

        return true;
    };

    const send = async mobile => {
        const valid = checkMobile(mobile);

        if (!valid || loading.value || isCounting.value) return;

        try {
            setLoading(true);

            // request
            await Apis.third.getVerifyCode({params: {mobile, templateEnum: $options.template}});

            start();
            $options?.onStart?.();

            setLoading(false);
        } catch (e) {
            uni.showToast({title: e.message, icon: "none"});
            setLoading(false);
        }
    };

    onUnmounted(reset);

    return {
        countDown,
        label,
        isCounting,
        loading,
        send
    };
};
