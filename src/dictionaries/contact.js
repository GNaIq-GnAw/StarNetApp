import {Enum} from "enum-plus";

// 记事类型
export const NoteType = Enum([
    {label: "新增", value: 1},
    {label: "电话联系", value: "call"},
    {label: "短信联系", value: "sms"},
    {label: "拜访记事", value: "visit"},
    {label: "普通记事", value: "normal"},
    {label: "产生成交", value: 6},
    {label: "产生支出", value: 7}
]);
