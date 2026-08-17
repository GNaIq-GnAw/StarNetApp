import {defineMock} from "@alova/mock";
import {generateMockData} from "../utils/generators.js";

export default defineMock({
    // 通用GET请求处理
    "[GET]/*": (_params, matchedUrl) => {
        console.log(`[Mock] GET ${matchedUrl}`, _params);
        return generateMockData.baseResponse({
            message: `Mock response for GET ${matchedUrl}`,
            params: _params
        });
    },

    // 通用POST请求处理
    "[POST]/*": (_params, matchedUrl) => {
        console.log(`[Mock] POST ${matchedUrl}`, _params);
        return generateMockData.baseResponse({
            message: `Mock response for POST ${matchedUrl}`,
            params: _params
        });
    },
    // 发送验证码
    "[GET]/mock/common/sendCaptcha": _params => {
        console.log("params", _params);

        return generateMockData.baseResponse(generateMockData.id(), 40000);
    }
});
