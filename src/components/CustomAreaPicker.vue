<script setup>
    import {useCascaderAreaData} from "@vant/area-data";

    defineOptions({inheritAttrs: false});

    const $province = defineModel("province", {type: String});
    const $city = defineModel("city", {type: String});
    const $district = defineModel("district", {type: String, required: true});

    const visible = ref(false);

    // 数据源
    const areaData = useCascaderAreaData();

    /**
     * 深度优先遍历，根据 value 找出从省到市/区的完整节点路径。
     * @param {Array} options 级联数据
     * @param {string} target  目标 value（$district）
     * @returns {Array|null} 匹配节点的 text 数组，未找到返回 null
     */
    function findAreaPath(options, target) {
        for (const option of options) {
            if (option.value === target) {
                return [option.text];
            }
            if (option.children?.length) {
                const childPath = findAreaPath(option.children, target);
                if (childPath) {
                    return [option.text, ...childPath];
                }
            }
        }
        return null;
    }

    // 根据 $district 反查省市区文字，拼接成展示文本
    const $formatedValue = computed(() => {
        if (!$district.value) {
            return "";
        }

        const path = findAreaPath(areaData, $district.value);

        return path ? path.join(" / ") : "";
    });

    const onConfirm = e => {
        const [province, city] = e.selectedOptions;

        $province.value = province.value;
        $city.value = city.value;
    };
</script>

<template>
    <wd-input
        :compact="false"
        :model-value="$formatedValue"
        :placeholder="$attrs?.placeholder || '请选择'"
        css-icon
        readonly
        suffix-icon="i-mdi:menu-down !size-38.17rpx"
        type="text"
        @click="visible = true"
    />
    <wd-cascader
        v-model="$district"
        v-model:visible="visible"
        :options="areaData"
        v-bind="$attrs"
        @confirm="onConfirm"
    />
</template>

<style scoped></style>
