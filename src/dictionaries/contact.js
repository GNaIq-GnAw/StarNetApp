import {Enum} from "enum-plus";

// 记事类型
export const RecordType = Enum([
    {label: "新增", value: "new"},
    {label: "电话联系", value: "call"},
    {label: "短信联系", value: "sms"},
    {label: "拜访记事", value: "visit"},
    {label: "普通记事", value: "normal"},
    {label: "产生成交", value: "deal"},
    {label: "产生支出", value: "expense"}
]);

// 联系人号码类型
export const ContactPhoneType = Enum([
    {label: "工作号", value: "1"},
    {label: "生活号", value: "2"}
]);
