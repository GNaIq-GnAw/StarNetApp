/**
 * useDeviceData · 通话记录通道
 *
 * 自原 useCallLog 迁移而来，行为等价：仅 Android App 端可用，底层依赖 5+ 的
 * Native.js 查询系统内容提供者 android.provider.CallLog。其余端（iOS / H5 /
 * 小程序 / 鸿蒙）恒为空数组，supported 为 false —— iOS 从未开放通话记录读取
 * API，CallKit 也读不到历史。
 *
 * 权限说明（重要）：
 *   - 需在 manifest 中声明 `android.permission.READ_CALL_LOG`，且**必须打自定义
 *     基座**真机调试，标准基座必然取不到数据。
 *   - READ_CALL_LOG 属 Android hard-restricted 权限：未列入白名单的应用
 *     **无法被授予**，且用户不能手动进设置加白。白名单只来自商店安装标记、
 *     预装、或某个角色（ROLE_DIALER / ROLE_ASSISTANT）要求该权限。
 *     因此本通道依赖权限申请结果，拒绝时 authorized 置 false 并返回空数组
 *     （国产 ROM 也可能静默返回空）。
 *
 * ⚠️ 本文件位于 hooks 目录第二层，不在 vite AutoImport 的 dirs 扫描网内，
 *    故 ref / computed 等需显式 import（勿依赖全局注入）。
 */
import {computed, ref} from "vue";
import {ensurePermissions, isAndroid, queryPermission} from "../core/permission.js";
import {CALL_TYPES, sortAndNormalizeCalls} from "../core/phone.js";

/** 通话记录读取所需权限（required 取首个，与原实现一致） */
const CALL_LOG_PERMISSIONS = ["android.permission.READ_CALL_LOG", "android.permission.READ_PHONE_STATE"];

/**
 * 查询系统通话记录
 * @param {object} options 查询选项
 * @param {number} options.limit 最多返回的条数（按时间倒序取最新 N 条），0 表示不限
 * @returns {Promise<Array>} 原始记录数组（字段名已对齐归一化入参）
 */
const readCallLog = ({limit = 0} = {}) =>
    new Promise((resolve, reject) => {
        const CallLog = plus.android.importClass("android.provider.CallLog");
        const activity = plus.android.runtimeMainActivity();
        const resolver = plus.android.invoke(activity, "getContentResolver");

        const Calls = CallLog.Calls;

        const projection = [Calls.NUMBER, Calls.CACHED_NAME, Calls.TYPE, Calls.DATE, Calls.DURATION];

        // DEFAULT_SORT_ORDER 即 date DESC，保证取到的前 N 条是最新通话
        const cursor = plus.android.invoke(
            resolver,
            "query",
            Calls.CONTENT_URI,
            projection,
            null,
            null,
            Calls.DEFAULT_SORT_ORDER
        );

        // 权限缺失或 provider 不可用时 query 返回 null
        if (!cursor) {
            reject(new Error("无法访问通话记录，请确认已授予通话记录权限并打自定义基座"));

            return;
        }

        try {
            const readString = key => {
                const index = plus.android.invoke(cursor, "getColumnIndex", key);

                // getColumnIndex 找不到列时返回 -1，直接 getString(-1) 会抛异常
                return index < 0 ? "" : plus.android.invoke(cursor, "getString", index) || "";
            };

            const list = [];
            let occurIndex = 0;

            while (plus.android.invoke(cursor, "moveToNext")) {
                list.push({
                    number: readString(Calls.NUMBER),
                    name: readString(Calls.CACHED_NAME),
                    type: readString(Calls.TYPE),
                    date: readString(Calls.DATE),
                    duration: readString(Calls.DURATION),
                    occurIndex
                });

                occurIndex += 1;

                if (limit > 0 && list.length >= limit) break;
            }

            resolve(list);
        } catch (error) {
            reject(error);
        } finally {
            plus.android.invoke(cursor, "close");
        }
    });

/**
 * 创建通话记录通道，返回一组响应式状态与操作方法
 * @returns {object} 通话记录通道：calls / loading / supported / authorized / checkPermission / fetchAll / search / clear / CALL_TYPES
 */
export const createCallLogChannel = () => {
    /** 归一化后的通话记录列表（按时间倒序） */
    const calls = ref([]);

    /** 是否正在读取 */
    const loading = ref(false);

    /** 当前环境是否支持读取通话记录（仅 Android App 端为 true） */
    const supported = computed(() => {
        try {
            return typeof plus !== "undefined" && !!plus.android && isAndroid();
        } catch {
            return false;
        }
    });

    /**
     * 通话记录读取权限是否已开启
     * null 表示尚未检查，true 已授权，false 未授权 / 环境不支持
     */
    const authorized = ref(null);

    /**
     * 检查权限是否已开启，并刷新 authorized（不触发系统弹窗）
     * @returns {boolean} 是否已授权
     */
    const checkPermission = () => {
        if (!supported.value) {
            authorized.value = false;

            return false;
        }

        const granted = queryPermission("android.permission.READ_CALL_LOG");

        authorized.value = granted;

        return granted;
    };

    /**
     * 读取通话记录并写入 calls
     * @param {object} options 查询选项
     * @param {number} options.limit 最多读取的条数，0 表示不限
     * @param {number} options.minDuration 最短通话时长（秒），用于过滤无效拨打，0 表示不过滤
     * @returns {Promise<Array>} 归一化后的通话记录数组，失败返回空数组
     */
    const fetchAll = async ({limit = 0, minDuration = 0} = {}) => {
        loading.value = true;

        try {
            if (!supported.value) {
                authorized.value = false;

                return [];
            }

            // 非 Android 端不会走到此处（supported 已拦截），iosDefault 取 false 仅作兜底
            const granted = await ensurePermissions(CALL_LOG_PERMISSIONS, {
                required: "android.permission.READ_CALL_LOG",
                iosDefault: false
            });

            if (!granted) {
                authorized.value = false;

                return [];
            }

            const list = await readCallLog({limit});

            authorized.value = true;
            calls.value = sortAndNormalizeCalls(list).filter(item => item.duration >= minDuration);

            return calls.value;
        } catch {
            // 读取失败时以系统查询为准刷新权限状态
            authorized.value = queryPermission("android.permission.READ_CALL_LOG");

            return [];
        } finally {
            loading.value = false;
        }
    };

    /**
     * 清空已加载数据（不撤销权限）
     */
    const clear = () => {
        calls.value = [];
    };

    /**
     * 按姓名 / 号码模糊搜索，并可选按通话类型过滤
     * @param {string} keyword 关键词
     * @param {object} options 过滤选项
     * @param {number} options.type 通话类型（CALL_TYPES 之一），0 表示全部
     * @returns {Array} 匹配的通话记录数组
     */
    const search = (keyword = "", {type = 0} = {}) => {
        const kw = String(keyword).trim().toLowerCase();

        return calls.value.filter(item => {
            if (type && item.type !== type) return false;

            if (!kw) return true;

            return item.name.toLowerCase().includes(kw) || item.number.includes(kw);
        });
    };

    return {calls, loading, supported, authorized, checkPermission, fetchAll, search, clear, CALL_TYPES};
};
