import {isRef, shallowRef, toValue} from "vue";

export const useToggle = (initialValue = false, options = {}) => {
    const {truthyValue = true, falsyValue = false} = options;
    const valueIsRef = isRef(initialValue);
    const _value = shallowRef(initialValue);

    function toggle(value) {
        if (arguments.length) {
            _value.value = value;

            return _value.value;
        } else {
            const truthy = toValue(truthyValue);

            _value.value = _value.value === truthy ? toValue(falsyValue) : truthy;

            return _value.value;
        }
    }

    if (valueIsRef) return toggle;
    else return [_value, toggle];
};
