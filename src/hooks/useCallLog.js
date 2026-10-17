/**
 * useCallLog - 获取系统通话记录的组合式函数
 *
 * 仅 Android App 端可用，底层依赖 5+ 的 Native.js 查询系统内容提供者
 * `android.provider.CallLog`。其余端（iOS / H5 / 小程序 / 鸿蒙）恒为空数组，
 * supported 为 false —— iOS 从未开放通话记录读取 API，CallKit 也读不到历史。
 *
 * 典型用法（如 CRM 的"通话记录同步"）：
 *   const {calls, authorized, checkPermission, fetchAll, supported} = useCallLog();
 *   checkPermission();                      // 主动刷新权限状态
 *   if (authorized.value) await fetchAll({limit: 500, minDuration: 1});
 *
 * 权限说明（重要）：
 *   - 需在 manifest 中声明 `android.permission.READ_CALL_LOG`，且**必须打自定义基座**
 *     真机调试，标准基座必然取不到数据。
 *   - READ_CALL_LOG 属 Android hard-restricted 权限：未列入白名单的应用
 *     **无法被授予**，且用户不能手动进设置加白。白名单只来自商店安装标记、
 *     预装、或某个角色（ROLE_DIALER / ROLE_ASSISTANT）要求该权限。
 *     因此本 hook 依赖 `plus.android.requestPermissions` 的授权结果，
 *     拒绝时 authorized 置 false 并返回空数组（国产 ROM 也可能静默返回空）。
 */

/** Android CallLog.Calls.TYPE 常量（数值与系统一致） */
export const CALL_TYPES = {
    INCOMING: 1,
    OUTGOING: 2,
    MISSED: 3,
    VOICEMAIL: 4,
    REJECTED: 5,
    BLOCKED: 6,
    ANSWERED_EXTERNALLY: 7
};

/** 通话类型数值 → 语义化文案，供 UI 直接展示 */
const TYPE_TEXTS = {
    [CALL_TYPES.INCOMING]: "incoming",
    [CALL_TYPES.OUTGOING]: "outgoing",
    [CALL_TYPES.MISSED]: "missed",
    [CALL_TYPES.VOICEMAIL]: "voicemail",
    [CALL_TYPES.REJECTED]: "rejected",
    [CALL_TYPES.BLOCKED]: "blocked",
    [CALL_TYPES.ANSWERED_EXTERNALLY]: "answered-externally"
};

/**
 * 系统对未知 / 私密号码写入的占位值，需归一为空串
 * -1/-2/-3 为 AOSP CallLog 的约定值；英文与中文串来自各厂商 ROM（如 MIUI、EMUI）
 */
const PLACEHOLDER_NUMBERS = [
    "-1",
    "-2",
    "-3",
    "p",
    "private",
    "unknown",
    "restricted",
    "unavailable",
    "withheld",
    "未知",
    "未知号码",
    "私密",
    "私密号码",
    "无法接通",
    "号码限制"
];

/**
 * 清理电话号码中的分隔符（-、空格、全角空格、括号等），保留 + 号与数字
 * 用于去掉展示用的格式字符，便于后端匹配
 *
 * ⚠️ 占位值必须在剥离分隔符**之前**判定：`-1` 若先去掉 `-` 会变成合法的 `1`
 * @param {*} value 原始号码
 * @returns {string} 归一化后的号码，占位值返回空串
 */
export const cleanCallPhone = value => {
    const raw = String(value ?? "").trim();

    if (!raw) return "";

    if (PLACEHOLDER_NUMBERS.includes(raw.toLowerCase())) return "";

    const cleaned = raw.replace(/[\s\-—–()（）]/g, "");

    if (!cleaned) return "";

    return PLACEHOLDER_NUMBERS.includes(cleaned.toLowerCase()) ? "" : cleaned;
};

/**
 * 将 CallLog.Calls.TYPE 数值映射为语义化文案
 * @param {*} value 类型值，兼容字符串数字
 * @returns {string} 语义化文案，未知值返回 "unknown"
 */
export const resolveCallType = value => {
    if (value === null || value === undefined || value === "") return "unknown";

    const type = Number(value);

    return TYPE_TEXTS[type] || "unknown";
};

/**
 * 归一化单条通话记录，只保留前端需要的字段并做类型兜底
 * @param {object|null} raw 原始记录（字段名对应 CallLog 列）
 * @returns {object} 归一化后的通话记录
 */
export const normalizeCallRecord = raw => {
    const source = raw || {};

    const number = cleanCallPhone(source.number);
    const rawName = String(source.name ?? "").trim();

    const type = Number(source.type);
    const date = Number(source.date);
    const duration = Number(source.duration);

    const safeType = Number.isFinite(type) && type > 0 ? type : CALL_TYPES.INCOMING;
    const safeDate = Number.isFinite(date) && date > 0 ? date : 0;
    const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
    const occurIndex = Number.isFinite(Number(source.occurIndex)) ? Number(source.occurIndex) : 0;

    return {
        // 同秒同号同类型可能有多条（如连续拨打），用 occurIndex 保证 key 唯一
        id: `${safeDate}-${safeType}-${number}-${occurIndex}`,
        number,
        // 未设置姓名时回退用号码当姓名，与通讯录导入的既有约定一致
        name: rawName || number,
        type: safeType,
        typeText: resolveCallType(safeType),
        date: safeDate,
        duration: safeDuration
    };
};

/**
 * 归一化并按时间倒序排列，同时剔除既无号码又无姓名的空记录
 * 注意：不做去重 —— 同一号码的连续多次通话是真实记录，删掉会丢业务信息
 * @param {Array} list 原始记录数组
 * @returns {Array} 归一化后的通话记录，按 date 倒序
 */
export const sortAndDedupe = list => {
    if (!Array.isArray(list)) return [];

    return list
        .map((item, index) => ({item: item || {}, index}))
        .filter(({item}) => cleanCallPhone(item.number) || String(item.name ?? "").trim())
        .map(({item, index}) => normalizeCallRecord({...item, occurIndex: index}))
        .sort((a, b) => b.date - a.date);
};

/** 判断当前是否为 Android（须在 plus 可用时调用） */
const isAndroid = () => plus.os.name === "Android";

/**
 * 查询 Android 通话记录读取权限是否已开启（不触发弹窗）
 * 依赖 Native.js 调用 Context.checkSelfPermission；API < 23 无此方法时视为已授权
 * @returns {boolean} 是否已授权
 */
const checkAndroidPermission = () => {
    try {
        const activity = plus.android.runtimeMainActivity();
        const result = plus.android.invoke(activity, "checkSelfPermission", "android.permission.READ_CALL_LOG");

        // PackageManager.PERMISSION_GRANTED === 0
        return result === 0;
    } catch {
        // 低版本 Android（API < 23）无运行时权限，manifest 声明即授权
        return true;
    }
};

/**
 * 确保具备读取通话记录权限
 * @returns {Promise<boolean>} 是否已授权
 */
const ensurePermission = () => {
    if (!isAndroid()) return Promise.resolve(false);

    return new Promise(resolve => {
        plus.android.requestPermissions(
            ["android.permission.READ_CALL_LOG", "android.permission.READ_PHONE_STATE"],
            result => resolve((result.granted || []).includes("android.permission.READ_CALL_LOG")),
            () => resolve(false)
        );
    });
};

/**
 * 查询通话记录读取权限是否已开启（须在 supported 为 true 时调用）
 * @returns {boolean} 是否已授权
 */
const queryPermission = () => {
    try {
        if (isAndroid()) return checkAndroidPermission();

        return plus.navigator.checkPermission("CONTACTS") === "authorized";
    } catch {
        return false;
    }
};

/**
 * 查询系统通话记录
 * @param {object} options 查询选项
 * @param {number} options.limit 最多返回的条数（按时间倒序取最新 N 条），0 表示不限
 * @returns {Promise<Array>} 原始记录数组（字段名已对齐 normalizeCallRecord 入参）
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

export const useCallLog = () => {
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

        const granted = queryPermission();

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

            const granted = await ensurePermission();

            if (!granted) {
                authorized.value = false;

                return [];
            }

            const list = await readCallLog({limit});

            authorized.value = true;
            calls.value = sortAndDedupe(list).filter(item => item.duration >= minDuration);

            return calls.value;
        } catch {
            // 读取失败时以系统查询为准刷新权限状态
            authorized.value = queryPermission();

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

    return {
        calls,
        loading,
        supported,
        authorized,
        checkPermission,
        fetchAll,
        search,
        clear
    };
};
