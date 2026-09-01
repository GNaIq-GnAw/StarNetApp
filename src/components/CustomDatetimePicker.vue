<script setup>
    defineOptions({inheritAttrs: false});

    const $modelValue = defineModel("value", {type: [String, Number], required: true});

    const visible = ref(false);

    const attr = useAttrs();

    const $formatedValue = computed({
        get: () => {
            if (!$modelValue.value) return 0;

            return +formatDate(new Date($modelValue.value), "T");
        },
        set: value => {
            // 1970-01-01 08:00:00
            if (value === 0) value = -28800000;

            $modelValue.value = (attr.type === "date" ? formatDate : formatDatetime)(value);
        }
    });

    const [minDate, maxDate] = ["1900-01-01", Date.now()].map(date => +formatDate(new Date(date), "T"));
</script>

<template>
    <wd-input
        :compact="false"
        :model-value="$modelValue"
        :placeholder="$attrs?.placeholder || '请选择'"
        readonly
        type="text"
        @click="visible = true"
    />
    <wd-datetime-picker
        v-model="$formatedValue"
        v-model:visible="visible"
        :max-date="maxDate"
        :min-date="minDate"
        v-bind="$attrs"
    />
</template>

<style scoped></style>
