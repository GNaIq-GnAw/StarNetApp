/**
 * useDeviceData · 短信记录通道
 *
 * 与通话记录通道（call-log.js）同构：仅 Android App 端可用，底层依赖 5+ 的
 * Native.js 查询系统内容提供者 `content://sms`。其余端（iOS / H5 / 小程序 /
 * 鸿蒙）恒为空数组，supported 为 false。
 *
 * ⚠️ 平台与合规（详见项目记忆）：
 *   - 鸿蒙 NEXT 已从系统底层移除"访问短信"能力，应用侧无法申请 → 恒 unsupported。
 *   - 需在 manifest 中声明 `android.permission.READ_SMS`，且**必须打自定义基座**
 *     真机调试，标准基座取不到数据。
 *   - 国内应用市场上架须满足：功能触发时动态申请、弹窗同步告知用途、拒绝后不得
 *     退出或循环弹窗；GB/T 41391-2022 明确"除用户主动设为默认短信应用外，不应
 *     读取短信内容"，故本通道定位为 CRM 场景下的**按需同步**，勿做常驻读取。
 *
 * ⚠️ 本文件位于 hooks 目录第二层，不在 vite AutoImport 的 dirs 扫描网内，
 *    故 ref / computed 等需显式 import（勿依赖全局注入）。
 */
import {computed, ref} from "vue";
import {ensurePermissions, isAndroid, queryPermission} from "../core/permission.js";
import {SMS_TYPES, sortAndNormalizeSms} from "../core/sms.js";

/** 短信读取所需权限（required 取首个） */
const SMS_PERMISSIONS = ["android.permission.READ_SMS"];

/** `content://sms` 内容提供者 URI */
const SMS_URI = "content://sms";

/**
 * 查询系统短信记录
 * @param {object} options 查询选项
 * @param {number} options.limit 最多返回的条数（按时间倒序取最新 N 条），0 表示不限
 * @returns {Promise<Array>} 原始记录数组（字段名已对齐归一化入参）
 */
const readSmsLog = ({limit = 0} = {}) =>
    new Promise((resolve, reject) => {
        const Uri = plus.android.importClass("android.net.Uri");
        const activity = plus.android.runtimeMainActivity();
        const resolver = plus.android.invoke(activity, "getContentResolver");

        const uri = Uri.parse(SMS_URI);

        // date DESC 保证取到的前 N 条是最新短信
        const cursor = plus.android.invoke(resolver, "query", uri, null, null, null, "date DESC");

        // 权限缺失或 provider 不可用时 query 返回 null
        if (!cursor) {
            reject(new Error("无法访问短信记录，请确认已授予短信权限并打自定义基座"));

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
                    address: readString("address"),
                    body: readString("body"),
                    type: readString("type"),
                    date: readString("date"),
                    read: readString("read"),
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
 * 创建短信记录通道，返回一组响应式状态与操作方法
 * @returns {object} 短信通道：messages / loading / supported / authorized / checkPermission / fetchAll / search / clear / SMS_TYPES
 */
export const createSmsLogChannel = () => {
    /** 归一化后的短信列表（按时间倒序） */
    const messages = ref([]);

    /** 是否正在读取 */
    const loading = ref(false);

    /** 当前环境是否支持读取短信（仅 Android App 端为 true） */
    const supported = computed(() => {
        try {
            return typeof plus !== "undefined" && !!plus.android && isAndroid();
        } catch {
            return false;
        }
    });

    /**
     * 短信读取权限是否已开启
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

        const granted = queryPermission("android.permission.READ_SMS");

        authorized.value = granted;

        return granted;
    };

    /**
     * 读取短信记录并写入 messages
     * @param {object} options 查询选项
     * @param {number} options.limit 最多读取的条数，0 表示不限
     * @param {number} options.type 仅保留指定类型（SMS_TYPES 之一），0 表示全部
     * @returns {Promise<Array>} 归一化后的短信数组，失败返回空数组
     */
    const fetchAll = async ({limit = 0, type = 0} = {}) => {
        loading.value = true;

        try {
            if (!supported.value) {
                authorized.value = false;

                return [];
            }

            // 非 Android 端不会走到此处（supported 已拦截），iosDefault 取 false 仅作兜底
            const granted = await ensurePermissions(SMS_PERMISSIONS, {
                required: "android.permission.READ_SMS",
                iosDefault: false
            });

            if (!granted) {
                authorized.value = false;

                return [];
            }

            const list = await readSmsLog({limit});

            authorized.value = true;
            messages.value = sortAndNormalizeSms(list).filter(item => !type || item.type === type);

            return messages.value;
        } catch {
            // 读取失败时以系统查询为准刷新权限状态
            authorized.value = queryPermission("android.permission.READ_SMS");

            return [];
        } finally {
            loading.value = false;
        }
    };

    /**
     * 清空已加载数据（不撤销权限）
     */
    const clear = () => {
        messages.value = [];
    };

    /**
     * 按号码 / 正文模糊搜索，并可选按短信类型过滤
     * @param {string} keyword 关键词
     * @param {object} options 过滤选项
     * @param {number} options.type 短信类型（SMS_TYPES 之一），0 表示全部
     * @returns {Array} 匹配的短信数组
     */
    const search = (keyword = "", {type = 0} = {}) => {
        const kw = String(keyword).trim().toLowerCase();

        return messages.value.filter(item => {
            if (type && item.type !== type) return false;

            if (!kw) return true;

            return item.number.includes(kw) || item.body.toLowerCase().includes(kw);
        });
    };

    return {messages, loading, supported, authorized, checkPermission, fetchAll, search, clear, SMS_TYPES};
};
