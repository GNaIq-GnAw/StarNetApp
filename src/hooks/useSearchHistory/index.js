/**
 * useSearchHistory - 搜索历史读写（去重并置顶）
 *
 * const {list, add, clear} = useSearchHistory();
 * add("张");   // 空词自动忽略
 * clear();
 */
import {normalizeHistory, pushHistory} from "./core/history.js";

export const useSearchHistory = (storageKey = Cache.ContactSearchHistory) => {
    const list = ref(normalizeHistory(uni.getStorageSync(storageKey)));

    // 存储异常（超限/隐私模式）不该打断搜索
    const persist = () => {
        try {
            uni.setStorageSync(storageKey, list.value);
        } catch (e) {
            console.log("persist search history failed", e);
        }
    };

    const add = keyword => {
        const next = pushHistory(list.value, keyword);

        // 空词返回原引用，无需写入
        if (next === list.value) return;

        list.value = next;
        persist();
    };

    const clear = () => {
        list.value = [];
        uni.removeStorageSync(storageKey);
    };

    return {list, add, clear};
};
