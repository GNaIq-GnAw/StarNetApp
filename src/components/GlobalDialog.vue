<script setup>
    defineOptions({
        options: {
            virtualHost: true,
            addGlobalClass: true,
            styleIsolation: "shared"
        }
    });

    const {dialogOptions, currentPage} = storeToRefs(useGlobalDialog());

    const dialog = useDialog("globalDialog");
    const currentPath = getCurrentPath();

    watch(
        () => dialogOptions.value,
        newVal => {
            if (newVal) {
                if (currentPage.value === currentPath) {
                    const option = CommonUtil.deepClone(newVal);
                    dialog
                        .show(option)
                        .then(res => {
                            if (CommonUtil.isFunction(option.success)) {
                                option.success(res);
                            }
                        })
                        .catch(err => {
                            if (CommonUtil.isFunction(option.fail)) {
                                option.fail(err);
                            }
                        });
                }
            } else {
                dialog.close();
            }
        }
    );
</script>

<template>
    <wd-dialog selector="globalDialog" />
</template>
