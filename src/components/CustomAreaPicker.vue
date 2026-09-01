<script setup>
    import {useCascaderAreaData} from "@vant/area-data";

    defineOptions({inheritAttrs: false});

    const $modelValue = defineModel("value", {type: String, required: true});

    const visible = ref(false);

    // 数据源
    const areaData = useCascaderAreaData();

    /**
     * 深度优先遍历，根据 value 找出从省到市/区的完整节点路径。
     * @param {Array} options 级联数据
     * @param {string} target  目标 value（$modelValue）
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

    // 根据 $modelValue 反查省市区文字，拼接成展示文本
    const $formatedValue = computed(() => {
        if (!$modelValue.value) {
            return "";
        }

        const path = findAreaPath(areaData, $modelValue.value);

        return path ? path.join(" / ") : "";
    });
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
    <wd-cascader v-model="$modelValue" v-model:visible="visible" :options="areaData" v-bind="$attrs" />
</template>

<style scoped></style>
