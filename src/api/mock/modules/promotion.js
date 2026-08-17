import {defineMock} from "@alova/mock";
import {generateMockData} from "../utils/generators";

export default defineMock({
    "[POST]/mock/promotion/getCashOutLogPageList": _params => {
        console.log("[Mock] POST /mock/promotion/getCashOutLogPageList", _params);
        return generateMockData.baseResponse(
            generateMockData.array(() => {
                return {
                    // 审核状态，1:审核中，2:已打款，3:已驳回
                    auditStatus: generateMockData.number(1, 4),
                    // 提现总额
                    cashAmount: generateMockData.number(1, 100),
                    // 提现记录编号
                    cashCode: generateMockData.code("CASH"),
                    // 提现类型，1:银行卡，2:微信，3:支付宝
                    cashType: generateMockData.number(1, 4),
                    // 发生时间
                    createTime: Date.now()
                };
            }),
            40000
        );
    },
    "[GET]/mock/promotion/getCommOrderDetail": _params => {
        console.log("[Mock] GET /mock/promotion/getCommOrderDetail", _params);
        return generateMockData.baseResponse(
            {
                commChainList: generateMockData.array(() => {
                    return {
                        avatar: "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg",
                        level: generateMockData.number(0, 4),
                        memberCode: generateMockData.code(),
                        name: generateMockData.name(),
                        ratio: generateMockData.number(1, 100)
                    };
                }, 4),
                feeIncome: generateMockData.number(1, 100),
                feeLevel: generateMockData.number(1, 5),
                goodsList: generateMockData.array(() => {
                    return {
                        afterNum: generateMockData.number(0, 2),
                        commRatio: generateMockData.number(1, 100),
                        commTotal: generateMockData.number(1, 100),
                        feeIncome: generateMockData.number(1, 100),
                        goodsCode: generateMockData.code(),
                        goodsImgMain: "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg",
                        goodsName: generateMockData.name(),
                        goodsNum: 0,
                        goodsSpecList: generateMockData.array(() => {
                            return {
                                specId: generateMockData.code(),
                                specName: generateMockData.name(),
                                specValue: generateMockData.name()
                            };
                        }),
                        orderTotal: generateMockData.number(1, 100)
                    };
                }),
                orderCode: generateMockData.code(),
                orderMode: generateMockData.number(1, 4),
                overTime: generateMockData.timestamp(),
                payTime: generateMockData.timestamp(),
                settleStatus: generateMockData.number(1, 3),
                settleTime: generateMockData.timestamp(),
                userMobile: generateMockData.number(1, 100)
            },
            40000
        );
    },
    "[POST]/mock/promotion/getLevelOrderCommPageList": _params => {
        console.log("[Mock] POST /mock/promotion/getLevelOrderCommPageList", _params);
        return generateMockData.baseResponse(
            generateMockData.array(() => {
                return {
                    createTime: generateMockData.timestamp(),
                    feeIncome: generateMockData.number(1, 100)
                };
            }),
            40000
        );
    },
    "[GET]/mock/promotion/getBankAccounts": _params => {
        console.log("[Mock] GET /mock/promotion/getBankAccounts", _params);
        return generateMockData.baseResponse(
            generateMockData.array(() => {
                return {
                    accountCode: generateMockData.code(),
                    accountNo: generateMockData.number(1, 100),
                    bankName: generateMockData.name(),
                    userName: generateMockData.name()
                };
            }, 5),
            40000
        );
    },
    "[POST]/mock/promotion/getCashOutLog": _params => {
        console.log("[Mock] POST /mock/promotion/getCashOutLog", _params);

        const data = generateMockData.array(() => {
            return {
                cashCode: generateMockData.code(),
                cashType: generateMockData.number(1, 2),
                createTime: generateMockData.timestamp(),
                cashAmount: generateMockData.number(1, 100),
                auditStatus: generateMockData.number(1, 3)
            };
        });

        return generateMockData.listResponse(data, 100, true, 40000);
    },
    "[GET]/mock/promotion/getCashOutLogDetail": _params => {
        console.log("[Mock] GET /mock/promotion/getCashOutLogDetail", _params);

        return generateMockData.baseResponse(
            {
                "accountName": generateMockData.name(),
                "auditRemark": generateMockData.name(),
                "auditStatus": generateMockData.number(1, 3),
                "auditTime": generateMockData.timestamp(),
                "bankCard": generateMockData.number(1, 100),
                "bankCode": generateMockData.code(),
                "bankName": generateMockData.name(),
                "bankNo": generateMockData.code(),
                "cashAmount": generateMockData.number(1, 100),
                "cashCode": generateMockData.code(),
                "cashFee": generateMockData.number(1, 100),
                "cashType": generateMockData.number(1, 3),
                "createTime": generateMockData.timestamp(),
                "payFailReason": generateMockData.name(),
                "payFailTime": generateMockData.timestamp(),
                "payStatus": generateMockData.number(1, 3),
                "payTime": generateMockData.timestamp(),
                "userName": generateMockData.name()
            },
            40000
        );
    },
    "[POST]/mock/promotion/getMemberOrderComm": _params => {
        console.log("[Mock] POST /mock/promotion/getMemberOrderComm", _params);

        const data = generateMockData.array(() => {
            return {
                orderCode: generateMockData.code(),
                commCode: generateMockData.code(),
                feeMode: generateMockData.pick([1, 4, 5, 6, 7, 8, 9, 10]),
                feeIncome: generateMockData.number(1, 100),
                createTime: generateMockData.timestamp()
            };
        });

        return generateMockData.listResponse(data, 10, true, 40000);
    },
    "[GET]/mock/promotion/getMemberOrderCommDetail": _params => {
        console.log("[Mock] GET /mock/promotion/getMemberOrderCommDetail", _params);

        return generateMockData.baseResponse(
            {
                "calCommPrice": generateMockData.number(1, 100),
                "commTotal": generateMockData.number(1, 100),
                "createTime": generateMockData.timestamp(),
                "goodsImgMain": "",
                "goodsName": generateMockData.name(),
                "goodsNum": generateMockData.number(1, 10),
                "goodsPrice": generateMockData.number(1, 100),
                "goodsProps": generateMockData.array(
                    () => {
                        return {
                            "specGroupName": generateMockData.name(),
                            "specId": generateMockData.code(),
                            "specName": generateMockData.name()
                        };
                    },
                    generateMockData.number(1, 10)
                ),
                "memberMobile": generateMockData.mobile(),
                "memberName": generateMockData.name(),
                "orderCode": generateMockData.code(),
                "orderCommList": generateMockData.array(
                    () => {
                        return {
                            "feeIncome": generateMockData.number(1, 100),
                            "feeMode": generateMockData.number(1, 7),
                            "feeRatio": generateMockData.number(1, 100),
                            "feeType": generateMockData.number(1, 4),
                            "levelName": generateMockData.name(),
                        };
                    },
                    generateMockData.number(1, 10)
                ),
                "payTime": generateMockData.timestamp(),
                "receiveTime": generateMockData.timestamp(),
                "salesPrice": generateMockData.number(1, 100),
                "settleTime": generateMockData.timestamp()
            },
            40000
        );
    },
    "[GET]/mock/promotion/getBonusList": _params => {
        console.log("[Mock] GET /mock/promotion/getBonusList", _params);

        const data = generateMockData.array(
            () => {
                return {
                    code: generateMockData.code(),
                    fee: generateMockData.number(1, 1000).toFixed(6),
                    createTime: generateMockData.timestamp()
                };
            },
            10
        );

        return generateMockData.listResponse(data, 100, true, 40000);
    },
    "[GET]/mock/promotion/getAppPartnerDividendSettList": _params => {
        console.log("[Mock] GET /mock/promotion/getAppPartnerDividendSettList", _params);

        const data = generateMockData.array(
            () => {
                return {
                    "dividendAmount": generateMockData.number(1, 1000).toFixed(2),
                    "dividendComboName": generateMockData.name(),
                    "dividendEndDate": generateMockData.date(),
                    "dividendGroupName": generateMockData.name(),
                    "dividendStartDate": generateMockData.date(),
                    "dividendStatus": generateMockData.pick([1, 2]),
                    "settLogCode": generateMockData.code(),
                };
            },
            10
        );

        return generateMockData.listResponse(data, 100, true, 40000);
    },
    "[GET]/mock/promotion/getCommDividendDetail": _params => {
        console.log("[Mock] GET /mock/promotion/getCommDividendDetail", _params);

        return generateMockData.baseResponse(
            {
                "dividendComboName": generateMockData.name(),
                "dividendCount": generateMockData.number(1, 100),
                "dividendEndDate": generateMockData.date(),
                "dividendGroupName": generateMockData.name(),
                "dividendStartDate": generateMockData.date(),
                "feeIncome": generateMockData.number(1, 1000).toFixed(2),
                "settleTime": generateMockData.timestamp()
            },
            40000
        );
    },
    "[GET]/mock/promotion/getCommRecruitmentDetail": _params => {
        console.log("[Mock] GET /mock/promotion/getCommRecruitmentDetail", _params);

        return generateMockData.baseResponse(
            {
                "levelName": generateMockData.name(),
                "dividendEndDate": generateMockData.date(),
                "dividendStartDate": generateMockData.date(),
                "feeIncome": generateMockData.number(1, 1000).toFixed(2),
                "settleTime": generateMockData.timestamp()
            },
            40000
        );
    },
    "[GET]/mock/promotion/getAppPartnerDividendSettInfo": _params => {
        console.log("[Mock] GET /mock/promotion/getAppPartnerDividendSettInfo", _params);

        const data = generateMockData.array(() => {
            return {
                "comboInfoList": generateMockData.array(() => {
                    return {
                        "dividendComboName": generateMockData.name(),
                        "dividendCount": generateMockData.number(1, 100),
                        "dividendCountAmount": generateMockData.number(1, 1000).toFixed(2),
                        "dividendCountRadio": generateMockData.number(1, 100)
                    };
                }, generateMockData.number(1, 10)),
                "dividendGroupName": generateMockData.name(),
                "dividendAmountTotal": generateMockData.number(1, 1000).toFixed(2),
                "dividendDate": generateMockData.date(),
                "dividendEndDate": generateMockData.date(),
                "dividendStartDate": generateMockData.date(),
                "partnerDividendAmount": generateMockData.number(1, 1000).toFixed(2),
                "premiumOrderFee": generateMockData.number(1, 1000).toFixed(2),
                "premiumRadio": generateMockData.number(1, 100),
                "settInfoList": generateMockData.array(() => {
                    return {
                        "dividendAmount": generateMockData.number(1, 1000).toFixed(2),
                        "dividendComboName": generateMockData.name(),
                        "dividendCount": generateMockData.number(1, 100)
                    };
                }, generateMockData.number(0, 10)),
                "subsidyOrderFee": generateMockData.number(1, 1000).toFixed(2),
                "subsidyRadio": generateMockData.number(1, 100)
            };
        }, generateMockData.number(1, 10));

        return generateMockData.baseResponse(data, 40000);
    },
    "[GET]/mock/promotion/getAppPartnerDividendSettLogInfo": _params => {
        console.log("[Mock] GET /mock/promotion/getAppPartnerDividendSettLogInfo", _params);

        return generateMockData.baseResponse(
            {
                "dividendComboName": generateMockData.name(),
                "dividendCount": generateMockData.number(1, 100),
                "dividendEndDate": generateMockData.date(),
                "dividendGroupName": generateMockData.name(),
                "dividendStartDate": generateMockData.date(),
                "feeIncome": generateMockData.number(1, 1000).toFixed(2),
                "settleTime": generateMockData.timestamp(),
                "dividendStatus": generateMockData.pick([1, 2])
            },
            40000
        );
    },
    "[GET]/mock/promotion/getAppPartnerDividendSettBatchInfo": _params => {
        console.log("[Mock] GET /mock/promotion/getAppPartnerDividendSettBatchInfo", _params);

        return generateMockData.baseResponse(
            {
                "comboInfoList": generateMockData.array(() => {
                    return {
                        "dividendComboName": generateMockData.name(),
                        "dividendCount": generateMockData.number(1, 100),
                        "dividendCountAmount": generateMockData.number(1, 1000).toFixed(2),
                        "dividendCountRadio": generateMockData.number(1, 100)
                    };
                }, generateMockData.number(1, 10)),
                "dividendGroupName": generateMockData.name(),
                "dividendAmountTotal": generateMockData.number(1, 1000).toFixed(2),
                "dividendDate": generateMockData.date(),
                "dividendEndDate": generateMockData.date(),
                "dividendStartDate": generateMockData.date(),
                "partnerDividendAmount": generateMockData.number(1, 1000).toFixed(2),
                "premiumOrderFee": generateMockData.number(1, 1000).toFixed(2),
                "premiumRadio": generateMockData.number(1, 100),
                "settInfoList": generateMockData.array(() => {
                    return {
                        "dividendAmount": generateMockData.number(1, 1000).toFixed(2),
                        "dividendComboName": generateMockData.name(),
                        "dividendCount": generateMockData.number(1, 100)
                    };
                }, generateMockData.number(0, 10)),
                "subsidyOrderFee": generateMockData.number(1, 1000).toFixed(2),
                "subsidyRadio": generateMockData.number(1, 100)
            },
            40000
        );
    }
});
