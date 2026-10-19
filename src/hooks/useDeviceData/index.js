/**
 * useDeviceData - 本机设备数据聚合组合式函数
 *
 * 把通讯录（contacts）、通话记录（callLog）与短信记录（smsLog）三条数据线合并
 * 为单一入口，各自独立持有 loading / supported / authorized / checkPermission /
 * fetchAll / search 等成员，互不干扰（三者成员同名，故以命名空间隔离）。
 *
 * 典型用法：
 *   const {contacts, callLog, smsLog} = useDeviceData();
 *
 *   contacts.checkPermission();                 // 主动刷新权限状态（不弹窗）
 *   if (contacts.authorized.value) await contacts.fetchAll();
 *   contacts.search("张");
 *
 *   callLog.checkPermission();
 *   if (callLog.authorized.value) await callLog.fetchAll({limit: 500, minDuration: 1});
 *   callLog.search("138", {type: callLog.CALL_TYPES.OUTGOING});
 *
 *   smsLog.checkPermission();
 *   if (smsLog.authorized.value) await smsLog.fetchAll({limit: 200});
 *   smsLog.search("验证码", {type: smsLog.SMS_TYPES.INBOX});
 *
 * 平台能力：
 *   - contacts：仅 App 端（Android / iOS）可用，其余端 supported 为 false。
 *   - callLog ：仅 Android App 端可用，其余端 supported 为 false。
 *   - smsLog  ：仅 Android App 端可用，其余端 supported 为 false
 *     （鸿蒙 NEXT 已从系统底层移除短信权限）。
 */
import {createCallLogChannel} from "./modules/call-log.js";
import {createContactsChannel} from "./modules/contacts.js";
import {createSmsLogChannel} from "./modules/sms-log.js";

/**
 * 创建本机设备数据聚合通道
 * @returns {{contacts: object, callLog: object, smsLog: object}} contacts / callLog / smsLog 三个独立命名空间
 */
export const useDeviceData = () => ({
    contacts: createContactsChannel(),
    callLog: createCallLogChannel(),
    smsLog: createSmsLogChannel()
});
