export function useFormRules() {
    const patternRules = {
        phone: {
            pattern: Regex.Phone,
            message: "手机号格式不正确"
        },
        code: {
            pattern: Regex.CodeSix,
            message: "验证码格式不正确"
        },
        email: {
            pattern: Regex.Email,
            message: "邮箱格式不正确"
        },
        url: {
            pattern: Regex.Url,
            message: "链接格式不正确"
        },
        idcard: {
            pattern: Regex.IdNo,
            message: "身份证号码格式不正确"
        }
    };

    const formRules = {
        phone: [createRequiredRule("请输入手机号"), patternRules.phone],
        code: [createRequiredRule("请输入验证码"), patternRules.code],
        email: [createRequiredRule("请输入邮箱"), patternRules.email],
        url: [createRequiredRule("请输入链接"), patternRules.url],
        idcard: [createRequiredRule("请输入身份证号码"), patternRules.idcard]
    };

    /** the default required rule */
    const defaultRequiredRule = createRequiredRule("不能为空");

    function createRequiredRule(message) {
        return {
            required: true,
            message
        };
    }

    /** create a rule for confirming the password */
    function createConfirmPwdRule(pwd) {
        return [
            {required: true, message: "请输入确认密码"},
            {
                validator: (value, rule) => {
                    if (value.trim() !== "" && value !== toValue(pwd)) {
                        return Promise.reject(rule.message);
                    }

                    return Promise.resolve();
                },
                message: "两次输入密码不一致"
            }
        ];
    }

    // 验证银行卡号
    const luhnCheck = bankNo => {
        // 移除非数字字符
        const cleaned = bankNo.replace(/\D/g, "");

        let sum = 0;
        let shouldDouble = false;

        // 从右向左遍历
        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = Number.parseInt(cleaned.charAt(i), 10);

            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9; // 等同于 digit = digit - 9
                }
            }

            sum += digit;
            shouldDouble = !shouldDouble; // 切换标志
        }

        return sum % 10 === 0;
    };

    return {
        patternRules,
        formRules,
        defaultRequiredRule,
        createRequiredRule,
        createConfirmPwdRule,
        luhnCheck
    };
}

export function useWotForm() {
    const formRef = ref(null);

    function validate() {
        return formRef.value?.validate();
    }

    async function reset() {
        formRef.value?.reset();
    }

    return {
        formRef,
        validate,
        reset
    };
}
