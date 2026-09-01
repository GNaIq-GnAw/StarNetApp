<script setup>
    defineOptions({inheritAttrs: false});

    const $modelValue = defineModel("value", {type: [String, Number, Array], required: true});

    const visible = ref(false);

    const $formatedValue = computed({
        get: () => {
            if (!$modelValue.value) return [];

            if (!Array.isArray($modelValue.value)) return [$modelValue.value];

            return $modelValue.value;
        },
        set: ([value, ...rest]) => {
            $modelValue.value = (() => {
                if (rest?.length > 0) return [value, ...rest];

                return value;
            })();
        }
    });

    const attrs = useAttrs();

    const formatedLabel = computed(() => {
        if ($formatedValue.value.length === 0) return "";

        // 存在多列的情况，将数组扁平化
        const flatColumns = attrs.columns.flat(1);

        return flatColumns
            .filter(col => $formatedValue.value.includes(col.value))
            .map(item => item.label)
            .join(", ");
    });
</script>

<template>
    <wd-input
        :compact="false"
        :model-value="formatedLabel"
        :placeholder="$attrs?.placeholder || '请选择'"
        css-icon
        readonly
        suffix-icon="i-mdi:menu-down !size-38.17rpx"
        type="text"
        @click="visible = true"
    />
    <wd-picker v-model="$formatedValue" v-model:visible="visible" :columns="$attrs?.columns || []" v-bind="$attrs" />
</template>

<style scoped></style>
