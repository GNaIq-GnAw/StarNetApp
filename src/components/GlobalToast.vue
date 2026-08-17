<script setup>
    defineOptions({
        options: {
            virtualHost: true,
            addGlobalClass: true,
            styleIsolation: "shared"
        }
    });

    const {toastOptions, currentPage} = storeToRefs(useGlobalToast());

    const {close: closeGlobalToast} = useGlobalToast();

    const toast = useToast("globalToast");
    const currentPath = getCurrentPath();

    watch(
        () => toastOptions.value,
        newVal => {
            if (newVal && newVal.show) {
                if (currentPage.value === currentPath) {
                    toast.show(toastOptions.value);
                }
            } else {
                toast.close();
            }
        }
    );
</script>

<template>
    <wd-toast selector="globalToast" :closed="closeGlobalToast" />
</template>
