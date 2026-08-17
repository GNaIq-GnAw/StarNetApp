<script setup>
    import {useCascaderAreaData} from "@vant/area-data";
    import {zodAdapter} from "@wot-ui/ui";
    import {isArray} from "@wot-ui/ui/common/util";
    import {z} from "zod";

    const showPlatformPicker = ref(false);
    const showPromotionPicker = ref(false);
    const showTimePicker = ref(false);
    const showDatePicker = ref(false);
    const showAddressPicker = ref(false);
    const addressText = ref("");
    const isVerticalLayout = ref(false);
    const useZodSchema = ref(true);
    const formItemLayout = computed(() => (isVerticalLayout.value ? "vertical" : "horizontal"));
    const sliderRef = ref();
    const slideVerifyRef = ref();

    const model = reactive({
        couponName: "",
        platform: [],
        promotion: [],
        threshold: "",
        price: "",
        date: null,
        time: "",
        address: "",
        count: 1,
        content: "",
        switchVal: true,
        cardId: "",
        phone: "",
        read: false,
        fileList: [],
        discount: 1,
        priority: 2,
        tags: [],
        rate: 3.5,
        budget: 35,
        verified: false
    });

    const requiredFields = new Set([
        "couponName",
        "content",
        "threshold",
        "platform",
        "promotion",
        "time",
        "date",
        "address",
        "count",
        "cardId",
        "phone",
        "fileList",
        "discount",
        "priority",
        "tags",
        "rate",
        "budget",
        "verified"
    ]);

    const customSchema = {
        async validate(formModel) {
            const issues = [];
            const pushIssue = (path, message) => {
                issues.push({path: [path], message});
            };
            if (!formModel.couponName) {
                pushIssue("couponName", "请输入优惠券名称");
            } else if (!/\d{6}/.test(formModel.couponName)) {
                pushIssue("couponName", "优惠券名称6个字以上");
            }
            if (!formModel.content || formModel.content.length <= 2) {
                pushIssue("content", "请输入活动细则信息");
            }
            if (!formModel.threshold || !formModel.price) {
                pushIssue("threshold", "请输入满减金额");
            }
            if (!isArray(formModel.platform) || !formModel.platform.length) {
                pushIssue("platform", "请选择推广平台");
            }
            if (!isArray(formModel.promotion) || !formModel.promotion.length) {
                pushIssue("promotion", "请选择优惠方式");
            }
            if (!formModel.time) {
                pushIssue("time", "请选择时间");
            }
            if (!formModel.date) {
                pushIssue("date", "请选择日期");
            }
            if (!formModel.address) {
                pushIssue("address", "请选择地址");
            }
            if (formModel.count === "" || formModel.count === undefined || formModel.count === null) {
                pushIssue("count", "发货数量需要大于1");
            } else if (Number(formModel.count) <= 1) {
                pushIssue("count", "发货数量需要大于1");
            }
            if (!formModel.cardId) {
                pushIssue("cardId", "请输入歪比巴卜");
            }
            if (!formModel.phone) {
                pushIssue("phone", "请输入玛卡巴卡");
            }
            if (!isArray(formModel.fileList) || !formModel.fileList.length) {
                pushIssue("fileList", "请选择活动图片");
            }
            if (!formModel.discount) {
                pushIssue("discount", "请输入优惠金额");
            }
            if (formModel.priority === "" || formModel.priority === undefined || formModel.priority === null) {
                pushIssue("priority", "请选择投放优先级");
            }
            if (!isArray(formModel.tags) || !formModel.tags.length) {
                pushIssue("tags", "请至少选择一个投放标签");
            }
            if (formModel.rate === "" || formModel.rate === undefined || formModel.rate === null) {
                pushIssue("rate", "请完成活动评分");
            }
            if (formModel.budget === "" || formModel.budget === undefined || formModel.budget === null) {
                pushIssue("budget", "请设置预算强度");
            }
            if (!formModel.verified) {
                pushIssue("verified", "请完成滑块验证");
            }
            return issues;
        },
        isRequired(path) {
            return requiredFields.has(path);
        }
    };

    const zodSchema = zodAdapter(
        z.object({
            couponName: z.string().regex(/\d{6}/, "优惠券名称6个字以上"),
            content: z.string().min(3, "请输入活动细则信息"),
            threshold: z.string().min(1, "请输入满减金额"),
            price: z.string().optional(),
            platform: z.array(z.any()).min(1, "请选择推广平台"),
            promotion: z.array(z.any()).min(1, "请选择优惠方式"),
            time: z.union([z.string(), z.number()]).refine(value => !!value, "请选择时间"),
            date: z.union([z.number(), z.null()]).refine(value => !!value, "请选择日期"),
            address: z.string().min(1, "请选择地址"),
            count: z.number().gt(1, "发货数量需要大于1"),
            switchVal: z.boolean().optional(),
            discount: z.number().optional(),
            cardId: z.string().min(1, "请输入歪比巴卜"),
            phone: z.string().min(1, "请输入玛卡巴卡"),
            fileList: z.array(z.any()).min(1, "请选择活动图片"),
            priority: z.number(),
            tags: z.array(z.number()).min(1, "请至少选择一个投放标签"),
            rate: z.number(),
            budget: z.number(),
            verified: z.boolean().refine(value => value, "请完成滑块验证")
        }),
        {
            isRequired(path) {
                return requiredFields.has(path);
            }
        }
    );

    const activeSchema = computed(() => {
        return useZodSchema.value ? zodSchema : customSchema;
    });

    const platformList = ref([
        {value: "1", label: "京东"},
        {value: "2", label: "开普勒"},
        {value: "3", label: "手Q"},
        {value: "4", label: "微信"},
        {value: "5", label: "1号店"},
        {value: "6", label: "十元街"},
        {value: "7", label: "京东极速版"}
    ]);
    const promotionlist = ref([
        {value: "1", label: "满减"},
        {value: "2", label: "无门槛"}
    ]);

    const area = ref([
        useCascaderAreaData().map(item => {
            return {
                value: item.value,
                label: item.text
            };
        })
    ]);

    const toast = useToast();
    const form = ref();

    watch(
        () => isVerticalLayout.value,
        async () => {
            await nextTick();
            sliderRef.value?.initSlider();
            await slideVerifyRef.value?.init();
            slideVerifyRef.value?.reset();
        }
    );

    const platformText = computed(() => {
        if (!isArray(model.platform) || !model.platform.length) return "";
        return model.platform
            .map(val => {
                const item = platformList.value.find(option => option.value === val);
                return item ? item.label : val;
            })
            .join("、");
    });

    const promotionText = computed(() => {
        if (!isArray(model.promotion) || !model.promotion.length) return "";
        return model.promotion
            .map(val => {
                const item = promotionlist.value.find(option => option.value === val);
                return item ? item.label : val;
            })
            .join("、");
    });

    const timeText = computed(() => {
        if (!model.time) return "";
        if (typeof model.time === "number") return formatDatetime(model.time);
        return model.time;
    });

    const dateText = computed(() => {
        if (!model.date) return "";
        return formatDate(model.date);
    });

    function handleAddressConfirm({selectedOptions}) {
        addressText.value = selectedOptions.map(item => item.text).join("/");
    }

    function handleVerifySuccess() {
        model.verified = true;
    }

    function handleVerifyFail() {
        model.verified = false;
    }

    function handleFileChange({fileList}) {
        model.fileList = fileList;
    }

    async function handleSubmit() {
        try {
            const {valid, errors} = await form.value?.validate();

            if (valid) {
                toast.success("提交成功");
            }
            console.log(valid);
            console.log(errors);
        } catch (error) {
            console.log(error, "error");
        }
    }

    function handleIconClick() {
        toast.info("优惠券提示信息");
    }
</script>

<template>
    <view>
        <wd-select-picker
            v-model="model.platform"
            v-model:visible="showPlatformPicker"
            :columns="platformList"
            placeholder="请选择推广平台"
        />
        <wd-picker
            v-model="model.promotion"
            v-model:visible="showPromotionPicker"
            :columns="promotionlist"
            placeholder="请选择优惠方式"
        />
        <wd-datetime-picker v-model="model.time" v-model:visible="showTimePicker" placeholder="请选择时间" />
        <wd-calendar v-model="model.date" v-model:visible="showDatePicker" placeholder="请选择日期" />
        <wd-cascader
            v-model="model.address"
            v-model:visible="showAddressPicker"
            :options="area"
            placeholder="请选择地址"
            @confirm="handleAddressConfirm"
        />
        <wd-dialog />
        <wd-form
            ref="form"
            :layout="formItemLayout"
            :model="model"
            :schema="activeSchema"
            :title-width="100"
            asterisk-position="end"
            border
        >
            <wd-cell-group custom-class="group" title="布局切换示例">
                <wd-form-item title="表单项布局" value-align="left">
                    <wd-switch v-model="isVerticalLayout" size="20" />
                    <text class="layout-tip">{{ isVerticalLayout ? "上下布局" : "左右布局" }}</text>
                </wd-form-item>
                <wd-form-item title="校验引擎" value-align="left">
                    <wd-switch v-model="useZodSchema" active-text="Zod" inactive-text="自定义" size="20" />
                </wd-form-item>
            </wd-cell-group>
            <wd-cell-group custom-class="group" title="基础信息">
                <wd-form-item prop="couponName" required title="优惠券名称">
                    <wd-input
                        v-model="model.couponName"
                        :maxlength="20"
                        compact
                        placeholder="请输入优惠券名称"
                        show-word-limit
                        suffix-icon="question-circle"
                        @clicksuffixicon="handleIconClick"
                    />
                </wd-form-item>
                <wd-form-item
                    :value="platformText"
                    ellipsis
                    is-link
                    placeholder="请选择推广平台"
                    prop="platform"
                    title="推广平台"
                    @click="showPlatformPicker = true"
                />
                <wd-form-item
                    :value="promotionText"
                    is-link
                    placeholder="请选择优惠方式"
                    prop="promotion"
                    title="优惠方式"
                    @click="showPromotionPicker = true"
                />
                <wd-form-item
                    custom-value-class="cell-left"
                    prop="threshold"
                    required
                    title="券面额"
                    title-width="100px"
                >
                    <view style="text-align: left">
                        <view class="inline-txt" style="margin-left: 0">
                            满
                        </view>
                        <wd-input
                            v-model="model.threshold"
                            compact
                            custom-style="display: inline-block; width: 70px; vertical-align: middle"
                            placeholder="请输入金额"
                        />
                        <view class="inline-txt">
                            减
                        </view>
                        <wd-input
                            v-model="model.price"
                            compact
                            custom-style="display: inline-block; width: 70px; vertical-align: middle"
                            placeholder="请输入金额"
                        />
                    </view>
                </wd-form-item>
            </wd-cell-group>
            <wd-cell-group custom-class="group" title="时间和地址">
                <wd-form-item
                    :value="timeText"
                    is-link
                    placeholder="请选择时间"
                    prop="time"
                    title="时间"
                    @click="showTimePicker = true"
                />
                <wd-form-item
                    :value="dateText"
                    is-link
                    placeholder="请选择日期"
                    prop="date"
                    title="日期"
                    @click="showDatePicker = true"
                />
                <wd-form-item
                    :value="addressText"
                    is-link
                    placeholder="请选择地区"
                    prop="address"
                    title="地区"
                    @click="showAddressPicker = true"
                />
            </wd-cell-group>
            <wd-cell-group custom-class="group" title="其他信息">
                <wd-form-item prop="content" title="活动细则">
                    <wd-textarea
                        v-model="model.content"
                        :maxlength="300"
                        auto-height
                        clearable
                        compact
                        placeholder="请输入活动细则信息"
                        show-word-limit
                        type="textarea"
                    />
                </wd-form-item>
                <wd-form-item prop="count" title="发货数量" title-width="100px" value-align="left">
                    <wd-input-number v-model="model.count" />
                </wd-form-item>
                <wd-form-item center prop="switchVal" title="开启折扣" title-width="100px" value-align="left">
                    <wd-switch v-model="model.switchVal" size="20" />
                </wd-form-item>
                <wd-form-item v-if="model.switchVal" prop="discount" title="折扣">
                    <wd-input v-model="model.discount" clearable compact placeholder="请输入优惠金额" />
                </wd-form-item>
                <wd-form-item prop="cardId" title="歪比巴卜">
                    <wd-input
                        v-model="model.cardId"
                        clearable
                        compact
                        placeholder="请输入歪比巴卜"
                        suffix-icon="camera"
                    />
                </wd-form-item>
                <wd-form-item prop="phone" title="玛卡巴卡">
                    <wd-input v-model="model.phone" clearable compact placeholder="请输入玛卡巴卡" />
                </wd-form-item>
                <wd-form-item prop="fileList" title="活动图片" title-width="100px">
                    <wd-upload
                        :file-list="model.fileList"
                        action="https://69bd04402bc2a25b22ad0a49.mockapi.io/upload"
                        @change="handleFileChange"
                    />
                </wd-form-item>
            </wd-cell-group>
            <wd-cell-group custom-class="group" title="组合示例">
                <wd-form-item prop="priority" title="投放优先级">
                    <wd-radio-group v-model="model.priority" direction="horizontal">
                        <wd-radio :value="1">
                            高
                        </wd-radio>
                        <wd-radio :value="2">
                            中
                        </wd-radio>
                        <wd-radio :value="3">
                            低
                        </wd-radio>
                    </wd-radio-group>
                </wd-form-item>
                <wd-form-item prop="tags" title="投放标签">
                    <wd-checkbox-group v-model="model.tags" direction="horizontal">
                        <wd-checkbox :name="1">
                            新品
                        </wd-checkbox>
                        <wd-checkbox :name="2">
                            爆款
                        </wd-checkbox>
                        <wd-checkbox :name="3">
                            清仓
                        </wd-checkbox>
                    </wd-checkbox-group>
                </wd-form-item>
                <wd-form-item prop="rate" title="活动评分">
                    <wd-rate v-model="model.rate" allow-half clearable />
                </wd-form-item>
                <wd-form-item prop="budget" title="预算强度">
                    <wd-slider ref="sliderRef" v-model="model.budget" show-extreme-value />
                </wd-form-item>
                <wd-form-item prop="verified" title="滑块验证">
                    <wd-slide-verify ref="slideVerifyRef" @fail="handleVerifyFail" @success="handleVerifySuccess" />
                </wd-form-item>
            </wd-cell-group>
            <view class="tip">
                <wd-form-item :border="false" prop="read" title-width="0px">
                    <wd-checkbox v-model="model.read">
                        已阅读并同意
                        <text style="color: #4d80f0">《巴拉巴拉吧啦协议》</text>
                    </wd-checkbox>
                </wd-form-item>
            </view>
            <view class="footer">
                <wd-button block size="large" type="primary" @click="handleSubmit">
                    提交
                </wd-button>
            </view>
        </wd-form>
    </view>
</template>

<style lang="scss" scoped>
    .inline-txt {
        display: inline-block;
        font-size: 14px;
        margin: 0 8px;
        color: rgba(0, 0, 0, 0.45);
        vertical-align: middle;
    }
    :deep(.group) {
        &:not(:first-child) {
            margin-top: 12px;
        }
    }
    .tip {
        margin: 12px 0 12px;
        color: #999;
        font-size: 12px;
    }
    .footer {
        padding: 0 24px 20px;
    }
    .layout-tip {
        margin-left: 8px;
        color: #666;
        font-size: 14px;
    }
    :deep(.label-class) {
        color: #999 !important;
        font-size: 12px !important;
    }
</style>
