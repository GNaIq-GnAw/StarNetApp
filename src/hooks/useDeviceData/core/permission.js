/**
 * useDeviceData 共享权限原语（通讯录 / 通话记录通用）
 *
 * 抽出自原 useContacts 与 useCallLog 各自重复实现的一套：
 * isAndroid / checkAndroidPermission / queryPermission / ensurePermissions。
 * 差异点（权限名、非 Android 端的默认返回值）通过参数化收敛，行为与原实现等价。
 *
 * ⚠️ 平台 API（plus.*）仅在 App 端存在，H5 / 小程序下调用须由上层先判 supported。
 */

/** 判断当前是否为 Android（须在 plus 可用时调用） */
export const isAndroid = () => plus.os.name === "Android";

/**
 * 查询 Android 指定权限是否已开启（不触发弹窗）
 * 依赖 Native.js 调用 Context.checkSelfPermission；API < 23 无此方法时视为已授权
 * @param {string} permission 完整权限名，如 "android.permission.READ_CONTACTS"
 * @returns {boolean} 是否已授权
 */
const checkAndroidPermission = permission => {
    try {
        const activity = plus.android.runtimeMainActivity();
        const result = plus.android.invoke(activity, "checkSelfPermission", permission);

        // PackageManager.PERMISSION_GRANTED === 0
        return result === 0;
    } catch {
        // 低版本 Android（API < 23）无运行时权限，manifest 声明即授权
        return true;
    }
};

/**
 * 查询设备数据读取权限是否已开启（不触发系统弹窗）
 * Android 走 Native.js checkSelfPermission；iOS 读取 plus.navigator 的通讯录授权态
 * （iOS 从未开放通话记录读取，通话记录在 iOS 端恒为 unsupported，不会走到此分支）
 * @param {string} permission Android 权限名（iOS 分支忽略此参数，统一查 CONTACTS）
 * @returns {boolean} 是否已授权
 */
export const queryPermission = permission => {
    try {
        if (isAndroid()) return checkAndroidPermission(permission);

        return plus.navigator.checkPermission("CONTACTS") === "authorized";
    } catch {
        return false;
    }
};

/**
 * 确保具备指定权限
 * iOS 由系统在读取时自动弹框（不走运行时申请），故非 Android 端直接返回 iosDefault；
 * Android 走 plus.android.requestPermissions 运行时申请，并按 required 权限判定结果
 * @param {string[]} permissions 需申请的 Android 权限名列表
 * @param {object} options 选项
 * @param {string} options.required 用于判定授权结果的权限名，缺省取 permissions[0]
 * @param {boolean} options.iosDefault 非 Android 端的返回值，缺省 false
 * @returns {Promise<boolean>} 是否已授权
 */
export const ensurePermissions = (permissions, {required, iosDefault = false} = {}) => {
    if (!isAndroid()) return Promise.resolve(iosDefault);

    const requiredPermission = required || permissions[0];

    return new Promise(resolve => {
        plus.android.requestPermissions(
            permissions,
            result => resolve((result.granted || []).includes(requiredPermission)),
            () => resolve(false)
        );
    });
};
