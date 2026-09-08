<script setup>
    defineOptions({inheritAttrs: false});

    const $modelValue = defineModel("value", {type: Number, required: true});
    const $formatedValue = defineModel("formatedValue", {type: String, required: true});

    const visible = ref(false);

    const attr = useAttrs();

    // "yyyy-MM-dd HH:mm:ss"
    const formatDateValue = (value, type) => {
        if (!value) return "";

        switch (type) {
            case "date":
                return formatDate(value);
            case "year-month":
                return formatDate(value, "yyyy-MM");
            case "year":
                return formatDate(value, "yyyy");
            case "datetime":
                return formatDate(value, "yyyy-MM-dd HH:mm:ss");
            case "time":
                return value;
            default:
                return "";
        }
    };

    const formatDisplayDate = (value, type) => {
        if (!value) return "";

        switch (type) {
            case "date":
                return formatDate(value, "yyyy年MM月dd日");
            case "year-month":
                return formatDate(value, "yyyy年MM月");
            case "year":
                return formatDate(value, "yyyy年");
            case "datetime":
                return formatDate(value, "yyyy年MM月dd日 HH:mm:ss");
            case "time":
                return value;
            default:
                return "";
        }
    };

    const $bindValue = computed({
        get: () => {
            const $value = $modelValue.value || $formatedValue.value;
            if (!$value) return 0;

            return +formatDate(new Date($value), "T");
        },
        set: value => {
            // 1970-01-01 08:00:00
            if (value === 0) value = -28800000;

            $modelValue.value = value;
            $formatedValue.value = formatDateValue(value, attr.type);
        }
    });

    const $displayDate = computed(() => {
        return formatDisplayDate($modelValue.value, attr.type);
    });

    const [minDate, maxDate] = ["1900-01-01", Date.now()].map(date => +formatDate(new Date(date), "T"));
</script>

<template>
    <wd-input
        :compact="false"
        :model-value="$displayDate"
        :placeholder="$attrs?.placeholder || '请选择'"
        readonly
        type="text"
        @click="visible = true"
    />
    <wd-datetime-picker
        v-model="$bindValue"
        v-model:visible="visible"
        :max-date="maxDate"
        :min-date="minDate"
        v-bind="$attrs"
    />
</template>

<style scoped></style>
