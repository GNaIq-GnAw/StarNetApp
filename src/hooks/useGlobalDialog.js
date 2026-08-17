function isButtonPropsObject(value) {
    return value !== null && CommonUtil.isObj(value);
}

function normalizeButtonProps(props, text) {
    if (props === null) {
        return null;
    }

    if (isButtonPropsObject(props)) {
        return {
            ...props,
            ...(text ? {text} : {})
        };
    }

    if (CommonUtil.isString(props) || text) {
        return {
            text: text || props
        };
    }

    if (props === undefined) {
        return {};
    }

    return props;
}

function withDefaultTypeOptions(option, type) {
    const next = {
        ...option,
        ...(type ? {type} : {})
    };

    if (next.showCancelButton === undefined) {
        if (next.type === "alert") {
            next.showCancelButton = false;
        } else if (next.type === "confirm" || next.type === "prompt") {
            next.showCancelButton = true;
        }
    }

    return next;
}

function normalizeDialogOptions(option, type) {
    const next = withDefaultTypeOptions(option, type);

    next.confirmButtonProps = normalizeButtonProps(next.confirmButtonProps, next.confirmButtonText);

    if (next.showCancelButton === false) {
        next.cancelButtonProps = null;
    } else if (next.showCancelButton === true || next.cancelButtonProps !== undefined || next.cancelButtonText) {
        next.cancelButtonProps = normalizeButtonProps(next.cancelButtonProps, next.cancelButtonText);
    }

    return next;
}

function normalizeOption(option, type) {
    return normalizeDialogOptions(CommonUtil.isString(option) ? {title: option} : option, type);
}

export const useGlobalDialog = defineStore("globalDialog", () => {
    const dialogOptions = ref(null);
    const currentPage = ref("");

    const show = (option, type) => {
        currentPage.value = getCurrentPath();
        dialogOptions.value = normalizeOption(option, type);
    };

    const alert = (option) => {
        show(option, "alert");
    };

    const confirm = (option) => {
        show(option, "confirm");
    };

    const prompt = (option) => {
        show(option, "prompt");
    };

    const close = () => {
        dialogOptions.value = null;
        currentPage.value = "";
    };

    return {
        dialogOptions,
        currentPage,
        show,
        alert,
        confirm,
        prompt,
        close
    };
});
