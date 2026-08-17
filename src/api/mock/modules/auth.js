import {defineMock} from "@alova/mock";
import {generateMockData} from "../utils/generators";

const tokenData = {
    accessToken: "ff4231bd-6ebe-45c0-a6d9-97d1e5b77c7e",
    refreshToken: "8d50dc72-5d91-4ce3-a849-56334ef8e957",
    expiresIn: 86400
};

export default defineMock({
    // 登录
    "[GET]/mock/auth/login": _params => {
        console.log("params", _params);

        return generateMockData.baseResponse(
            {
                accessToken: tokenData.accessToken,
                refreshToken: tokenData.refreshToken
            },
            40000
        );
    },
    // 刷新token
    "[GET]/mock/auth/refreshToken": _params => {
        console.log("params", _params);

        return generateMockData.baseResponse(
            {
                accessToken: tokenData.accessToken,
                refreshToken: tokenData.refreshToken
            },
            40000
        );
    },
    // 退出登录
    "[GET]/mock/auth/logout": _params => {
        console.log("params", _params);

        return generateMockData.baseResponse(null, 40000);
    },
    "[GET]/mock/auth/singleDevice": _params => {
        console.log("params", _params);

        return generateMockData.baseResponse(null, 40104);
    }
});
