export const useSyncRef = source => {
    const valueIns = ref(toValue(source));

    const update = () => {
        valueIns.value = toValue(source);
    };

    return {
        value: valueIns,
        update
    };
};
