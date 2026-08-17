import {defineMock} from "@alova/mock";
import {generateMockData} from "../utils/generators";

export default defineMock({
    "[POST]/mock/share/getViewList": _params => {
        console.log("[Mock] POST /mock/share/getViewList", _params);
        return generateMockData.baseResponse(
            generateMockData.array(() => {
                return {
                    accessAvatar: "",
                    accessCode: generateMockData.code(),
                    accessName: generateMockData.name(),
                    promotionAvatar: "",
                    promotionCode: generateMockData.code(),
                    promotionMobile: generateMockData.mobile(),
                    promotionName: generateMockData.name(),
                    shareTitle: generateMockData.name("标题"),
                    shareType: generateMockData.number(1, 6),
                    viewEnv: generateMockData.number(1, 3),
                    viewSource: generateMockData.number(1, 4),
                    visitTime: generateMockData.timestamp(generateMockData.number(1, 10)),
                };
            }, 5),
            40000
        );
    },
    "[POST]/mock/share/getClueList": _params => {
        console.log("[Mock] POST /mock/share/getClueList", _params);
        return generateMockData.baseResponse(
            generateMockData.array(() => {
                return {
                    clueCode: generateMockData.code(),
                    createTime: generateMockData.timestamp(generateMockData.number(1, 10)),
                    formData: {},
                    formUserName: generateMockData.name(),
                    promotionMobile: generateMockData.mobile(),
                    promotionName: generateMockData.name(),
                    shareCode: generateMockData.code(),
                    viewSource: generateMockData.number(1, 4),
                };
            }, 5),
            40000
        );
    },
    "[GET]/mock/share/getClueInfo": _params => {
        console.log("[Mock] GET /mock/share/getClueInfo", _params);
        return generateMockData.baseResponse({
                clueCode: generateMockData.code(),
                createTime: generateMockData.timestamp(generateMockData.number(1, 10)),
                formData: {},
                formUserName: generateMockData.name(),
                promotionMobile: generateMockData.mobile(),
                promotionName: generateMockData.name(),
                shareCode: generateMockData.code(),
                viewSource: generateMockData.number(1, 4),
            }, 40000);
    },
    "[GET]/mock/share/getClientList": _params => {
        console.log("[Mock] GET /mock/share/getClientList", _params);

        const data = generateMockData.array(() => {
            return {
                clientCode: generateMockData.code(),
                clientName: generateMockData.name(),
                clientMobile: generateMockData.mobile(),
                extendName: generateMockData.name(),
                extendMobile: generateMockData.mobile(),
                lockTime: generateMockData.timestamp(generateMockData.number(1, 10)),
                lockEndTime: generateMockData.timestamp(generateMockData.number(1, 10)),
                orderNo: generateMockData.number(1, 100),
                totalExpense: generateMockData.number(1, 100)
            };
        });

        return generateMockData.listResponse(data, 100, true, 40000);
    },
    "[GET]/mock/share/getGoodsList": _params => {
        console.log("[Mock] GET /mock/share/getGoodsList", _params);

        const data = generateMockData.array(() => {
            return {
                goodsImgMain: null,
                goodsName: generateMockData.name(),
                specType: generateMockData.number(1, 3),
                salesPrice: generateMockData.number(1, 100),
                salesRange: generateMockData.array(() => generateMockData.number(1, 100), 2),
                commRate: generateMockData.number(1, 100),
                commRateRange: generateMockData.array(() => generateMockData.number(1, 100), 2),
                salesVolume: generateMockData.number(1, 100),
                salesComm: generateMockData.number(1, 100)
            };
        });

        return generateMockData.listResponse(data, 100, true, 40000);
    }
});
