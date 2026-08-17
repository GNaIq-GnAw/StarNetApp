import {defineMock} from "@alova/mock";
import {generateMockData} from "../utils/generators";

export default defineMock({
    "[GET]/mock/page/getPageList": _params => {
        console.log("[Mock] GET /mock/page/getPageList", _params);
        return generateMockData.baseResponse(
            generateMockData.array(i => generateMockData.goods(i)),
            40000
        );
    },
    // 模拟提交表单
    "[POST]/mock/page/submitPageData": _params => {
        console.log("params", _params);

        return generateMockData.baseResponse(null, 40000);
    }
});
