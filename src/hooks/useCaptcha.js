import {useCountDown} from "@wot-ui/ui";
import md5 from "crypto-js/md5";

const UseCaptchaOptions = {
    timeout: 60 * 1000,
    onStart: () => {}
};

const ORIGIN_SECRET = "4211780910724149";

export const useCaptcha = (options = null) => {
    const $options = {...UseCaptchaOptions, ...(options || {})};

    const loading = ref(false);

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

    const checkPhone = phone => {
        if (!phone.trim()) {
            uni.showToast({title: "请输入手机号码", icon: "none"});

            return false;
        }

        if (!Regex.Phone.test(phone)) {
            uni.showToast({title: "手机号码格式不正确", icon: "none"});

            return false;
        }

        return true;
    };

    // 密钥 secret规则: 6位随机数 + MD5(phone+type+ORIGIN_SECRET) + millis（13位） + 6位随机数
    const generateSecret = (phone, type = 0) => {
        const code = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

        return code + md5(String(phone) + String(type) + ORIGIN_SECRET) + Date.now().toString() + code;
    };

    const send = async ({phone, type = 0}) => {
        const valid = checkPhone(phone);

        if (!valid || loading.value || isCounting.value) return;

        loading.value = true;

        try {
            // request
            await Apis.gate.phoneVerificationCode({data: {phone, type, secret: generateSecret(phone, type)}});

            start();
            $options?.onStart?.();

            loading.value = false;
        } catch (e) {
            uni.showToast({title: e.message, icon: "none"});
            loading.value = false;
        }
    };

    onUnmounted(reset);

    return {
        countDown,
        isCounting,
        loading,
        send
    };
};
