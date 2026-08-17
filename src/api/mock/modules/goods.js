import {defineMock} from "@alova/mock";
import {generateMockData} from "../utils/generators";

export default defineMock({
    "[GET]/mock/goods/getGoodsPageList": _params => {
        console.log("[Mock] GET /mock/goods/getGoodsPageList", _params);

        const data = generateMockData.array(() => {
            return {
                goodsCode: generateMockData.code("GOODS"),
                goodsName: generateMockData.name(),
                startPrice: generateMockData.number(1, 1000) / 100,
                endPrice: generateMockData.number(1, 1000) / 100,
                goodsImage: "https://wot-ui.cn/assets/redpanda.jpg",
                startPercent: generateMockData.number(),
                endPercent: generateMockData.number(),
                summary: generateMockData.name("简介")
            };
        });

        return generateMockData.listResponse(data, data.length, true, 40000);
    },
    "[POST]/mock/goods/getAppGoodsViewTrafficList": _params => {
        console.log("[Mock] POST /mock/goods/getAppGoodsViewTrafficList", _params);

        const data = generateMockData.array(() => {
            return {
                customerAvatar: "https://wot-ui.cn/assets/redpanda.jpg",
                customerCode: generateMockData.code("CUSTOMER"),
                customerName: generateMockData.name(),
                goodsCode: generateMockData.code("GOODS"),
                goodsName: generateMockData.name(),
                viewCode: generateMockData.code("VIEW"),
                viewSource: 1,
                viewTime: Date.now()
            };
        });

        return generateMockData.listResponse(data, data.length, true, 40000);
    },
    "[POST]/mock/goods/getAppGoodsViewList": _params => {
        console.log("[Mock] POST /mock/goods/getAppGoodsViewList", _params);

        const data = generateMockData.array(i => {
            return {
                customerAvatar: "https://wot-ui.cn/assets/redpanda.jpg",
                customerCode: generateMockData.code("CUSTOMER"),
                customerName: generateMockData.name(),
                userCode: generateMockData.code("USER"),
                goodsCode: generateMockData.code("GOODS"),
                goodsName: generateMockData.name(),
                viewSource: 1,
                viewEnv: null,
                viewTime: generateMockData.timestamp(i)
            };
        });

        return generateMockData.listResponse(data, data.length, true, 40000);
    }
});
