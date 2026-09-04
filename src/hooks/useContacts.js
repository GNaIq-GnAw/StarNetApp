/**
 * useContacts - 获取系统通讯录的组合式函数
 *
 * 仅 App 端（Android / iOS）可用，底层依赖 5+ 的 plus.contacts。
 * 其余端（H5 / 小程序 / 鸿蒙）contacts 恒为空数组，supported 为 false。
 *
 * 典型用法（如 IM 的"通讯录匹配好友"）：
 *   const {contacts, authorized, checkPermission, fetchAll, supported} = useContacts();
 *   checkPermission();                      // 主动刷新权限状态
 *   if (authorized.value) await fetchAll();
 *   const phones = contacts.value.map(item => item.phones).flat();
 *
 * 权限说明：
 *   - iOS：首次读取时由系统自动弹出授权框，无需手动申请。
 *   - Android：需运行时申请 READ_CONTACTS，须在 manifest.json 中声明权限，
 *     并在读取前申请，被拒时 error 置为提示信息。
 */

/** 归一化联系人，只保留前端需要的字段，丢弃 plus.contacts 的冗余结构 */
const normalizeContact = contact => ({
    id: contact.id || "",
    name: contact.displayName || contact.name?.formatted || "",
    phones: (contact.phoneNumbers || []).map(item => item.value),
    emails: (contact.emails || []).map(item => item.value)
});

/** 判断当前是否为 Android（须在 plus 可用时调用） */
const isAndroid = () => plus.os.name === "Android";

/**
 * 查询 Android 通讯录读取权限是否已开启（不触发弹窗）
 * 依赖 Native.js 调用 Context.checkSelfPermission；API < 23 无此方法时视为已授权
 * @returns {boolean} 是否已授权
 */
const checkAndroidPermission = () => {
    try {
        const activity = plus.android.runtimeMainActivity();
        const result = plus.android.invoke(activity, "checkSelfPermission", "android.permission.READ_CONTACTS");

        // PackageManager.PERMISSION_GRANTED === 0
        return result === 0;
    } catch {
        // 低版本 Android（API < 23）无运行时权限，manifest 声明即授权
        return true;
    }
};

/**
 * 查询 iOS 通讯录权限是否已开启（不触发弹窗）
 * @returns {boolean} 是否已授权
 */
const checkIOSPermission = () => {
    const status = plus.navigator.checkPermission("CONTACTS");

    return status === "authorized";
};

/**
 * 查询通讯录读取权限是否已开启（不触发系统弹窗）
 * 须在 supported 为 true（App 端）时调用
 * @returns {boolean} 是否已授权
 */
const queryPermission = () => (isAndroid() ? checkAndroidPermission() : checkIOSPermission());

/**
 * 确保具备读取通讯录权限
 * iOS 由系统在读取时自动弹框，此处仅 Android 需要运行时申请
 * @returns {Promise<boolean>} 是否已授权
 */
const ensurePermission = () => {
    if (!isAndroid()) return Promise.resolve(true);

    return new Promise(resolve => {
        plus.android.requestPermissions(
            ["android.permission.READ_CONTACTS"],
            result => resolve((result.granted || []).length > 0),
            () => resolve(false)
        );
    });
};

/**
 * 读取通讯录原始联系人
 * @param {object|null} filter 查询过滤器，null 表示返回全部
 * @returns {Promise<Array>} 原始 Contact 对象数组
 */
const readContacts = (filter = null) => new Promise((resolve, reject) => {
    plus.contacts.getAddressBook(
        plus.contacts.ADDRESSBOOK_PHONE,
        addressbook => {
            addressbook.find(
                filter,
                contacts => resolve(contacts || []),
                err => reject(err),
                {multiple: true}
            );
        },
        err => reject(err)
    );
});

export const useContacts = () => {
    /** 归一化后的联系人列表 */
    const contacts = ref([]);

    /** 是否正在读取 */
    const loading = ref(false);

    /** 错误信息（权限被拒 / 环境不支持等） */
    const error = ref(null);

    /** 当前环境是否支持读取通讯录（仅 App 端为 true） */
    const supported = computed(() => typeof plus !== "undefined" && !!plus.contacts);

    /**
     * 通讯录读取权限是否已开启
     * null 表示尚未检查，true 已授权，false 未授权 / 环境不支持
     */
    const authorized = ref(null);

    /**
     * 检查通讯录权限是否已开启，并刷新 authorized（不触发系统弹窗）
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
     * 读取全部联系人并写入 contacts
     * @returns {Promise<Array>} 归一化后的联系人数组，失败返回空数组
     */
    const fetchAll = async () => {
        loading.value = true;
        error.value = null;

        try {
            if (!supported.value) {
                authorized.value = false;
                error.value = "当前环境不支持读取通讯录，仅 App 端可用";
                return [];
            }

            const granted = await ensurePermission();

            if (!granted) {
                authorized.value = false;
                error.value = "通讯录权限被拒绝，请在系统设置中开启";
                return [];
            }

            const list = await readContacts(null);

            authorized.value = true;
            contacts.value = list.map(normalizeContact);

            return contacts.value;
        } catch (e) {
            error.value = e?.message || "获取通讯录失败";
            // 读取失败时以系统查询为准刷新权限状态（iOS 拒绝授权会在读取时抛错）
            authorized.value = queryPermission();
            return [];
        } finally {
            loading.value = false;
        }
    };

    /**
     * 按姓名 / 电话号码模糊搜索（基于已加载数据的内存过滤，需先 fetchAll）
     * @param {string} keyword 关键词
     * @returns {Array} 匹配的联系人数组
     */
    const search = (keyword = "") => {
        const kw = String(keyword).trim().toLowerCase();

        if (!kw) return contacts.value;

        return contacts.value.filter(item => {
            const nameMatched = item.name.toLowerCase().includes(kw);
            const phoneMatched = item.phones.some(phone => String(phone).includes(kw));

            return nameMatched || phoneMatched;
        });
    };

    onMounted(fetchAll);

    return {
        contacts,
        loading,
        error,
        supported,
        authorized,
        checkPermission,
        fetchAll,
        search
    };
};
