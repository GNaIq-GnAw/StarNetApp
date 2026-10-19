/**
 * useDeviceData · 通讯录通道
 *
 * 自原 useContacts 迁移而来，行为等价：仅 App 端（Android / iOS）可用，
 * 底层依赖 5+ 的 plus.contacts；其余端 contacts 恒为空数组，supported 为 false。
 *
 * 权限说明：
 *   - iOS：首次读取时由系统自动弹出授权框，无需手动申请。
 *   - Android：需运行时申请 READ_CONTACTS，须在 manifest.json 中声明权限。
 *
 * ⚠️ 本文件位于 hooks 目录第二层，不在 vite AutoImport 的 dirs 扫描网内，
 *    故 ref / computed 等需显式 import（勿依赖全局注入）。
 */
import {computed, ref} from "vue";
import {ensurePermissions, queryPermission} from "../core/permission.js";
import {normalizeContact} from "../core/phone.js";

/** Android 通讯录读取权限名 */
const READ_CONTACTS = "android.permission.READ_CONTACTS";

/**
 * 读取通讯录原始联系人
 * @param {object|null} filter 查询过滤器，null 表示返回全部
 * @returns {Promise<Array>} 原始 Contact 对象数组
 */
const readContacts = (filter = null) =>
    new Promise((resolve, reject) => {
        plus.contacts.getAddressBook(
            plus.contacts.ADDRESSBOOK_PHONE,
            addressBook => {
                addressBook.find(
                    filter,
                    contacts => resolve(contacts || []),
                    err => reject(err),
                    {multiple: true}
                );
            },
            err => reject(err)
        );
    });

/**
 * 创建通讯录通道，返回一组响应式状态与操作方法
 * @returns {object} 通讯录通道：contacts / loading / supported / authorized / checkPermission / fetchAll / search / clear
 */
export const createContactsChannel = () => {
    /** 归一化后的联系人列表 */
    const contacts = ref([]);

    /** 是否正在读取 */
    const loading = ref(false);

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

        const granted = queryPermission(READ_CONTACTS);

        authorized.value = granted;

        return granted;
    };

    /**
     * 读取全部联系人并写入 contacts
     * @returns {Promise<Array>} 归一化后的联系人数组，失败返回空数组
     */
    const fetchAll = async () => {
        loading.value = true;

        try {
            if (!supported.value) {
                authorized.value = false;

                return [];
            }

            // iOS 无需运行时申请（读取时系统自动弹框），故默认放行
            const granted = await ensurePermissions([READ_CONTACTS], {iosDefault: true});

            if (!granted) {
                authorized.value = false;

                return [];
            }

            const list = await readContacts();

            authorized.value = true;
            contacts.value = list.map(normalizeContact);

            return contacts.value;
        } catch {
            // 读取失败时以系统查询为准刷新权限状态（iOS 拒绝授权会在读取时抛错）
            authorized.value = queryPermission(READ_CONTACTS);

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

    /**
     * 清空已加载数据（不撤销权限）
     */
    const clear = () => {
        contacts.value = [];
    };

    return {contacts, loading, supported, authorized, checkPermission, fetchAll, search, clear};
};
