// @unocss-include
// 电话联系
const CallItem = defineComponent(
    props => {
        return () => {
            return h("view", {class: "flex items-center lh-38.17rpx text-19.08rpx"}, [
                h("view", {class: "c-primary6/50"}, "生活号"),
                h("view", {class: "ml-9.54rpx fw-600"}, props.row.phone),
                h("view", {class: "ml-9.54rpx flex items-center"}, [
                    h("view", {class: "c-#9BD073"}, "呼出30秒"),
                    h("view", {class: "i-ri:arrow-right-up-line size-22.90rpx c-primary6/50"})
                ])
            ]);
        };
    },
    {
        props: {
            row: Object
        }
    }
);

// 短信联系
const SmsItem = defineComponent(
    props => {
        return () => {
            return h("view", [
                h("view", {class: "flex items-center lh-38.17rpx text-19.08rpx"}, [
                    h("view", {class: "c-primary6/50"}, "生活号"),
                    h("view", {class: "ml-9.54rpx fw-600"}, props.row.phone),
                    h("view", {class: "ml-9.54rpx flex items-center"}, [
                        h("view", {class: "c-#9BD073"}, "发送"),
                        h("view", {class: "i-ri:arrow-right-up-line size-22.90rpx c-primary6/50"})
                    ])
                ]),
                h(
                    "view",
                    {
                        class: "rd-7.63rpx bg-#F3F4F4 p-[9.54rpx_19.08rpx] c-primary6/50 text-19.08rpx lh-28.63rpx block"
                    },
                    props.row.content
                )
            ]);
        };
    },
    {
        props: {
            row: Object
        }
    }
);

// 普通记事
const NormalItem = defineComponent(
    props => {
        return () => {
            return h(
                "view",
                {
                    class: "rd-7.63rpx bg-#F3F4F4 p-[9.54rpx_19.08rpx] c-primary6/50 text-19.08rpx lh-28.63rpx block"
                },
                props.row.content
            );
        };
    },
    {
        props: {
            row: Object
        }
    }
);

// 拜访记事
const VisitItem = defineComponent(
    props => {
        return () => {
            return h(
                "view",
                {
                    class: "rd-7.63rpx bg-#F3F4F4 p-[9.54rpx_19.08rpx] c-primary6/50 text-19.08rpx lh-28.63rpx block"
                },
                props.row.content
            );
        };
    },
    {
        props: {
            row: Object
        }
    }
);

export const NoteItems = {
    call: CallItem,
    sms: SmsItem,
    normal: NormalItem,
    visit: VisitItem
};

export const NoteIcon = defineComponent(
    props => {
        // call sms normal visit
        const presetClasses = {
            call: {bg: "bg-#9BD073", icon: " i-icon-park-outline:phone-telephone"},
            sms: {bg: "bg-#9BD073", icon: " i-ant-design:mail-outlined"},
            normal: {bg: "bg-#FBC050", icon: " i-mdi:pencil-outline"},
            visit: {bg: "bg-#F95585", icon: " i-carbon:location"}
        };

        const preset = presetClasses?.[props.type];

        return () => {
            return h(
                "view",
                {class: `p-9.54rpx box-border size-38.17rpx rd-19.08rpx c-#ffffff ${preset?.bg}`},
                h("view", {class: `${preset?.icon} size-19.08rpx !block`})
            );
        };
    },
    {
        props: {
            type: String
        }
    }
);
