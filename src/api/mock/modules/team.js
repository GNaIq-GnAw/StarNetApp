import {defineMock} from "@alova/mock";
import {generateMockData} from "../utils/generators";

export default defineMock({
    "[GET]/mock/team/getTeamUserList": _params => {
        console.log("[Mock] GET /mock/team/getTeamUserList", _params);
        return generateMockData.baseResponse(
            generateMockData.array(() => {
                return {
                    userCode: generateMockData.code(),
                    userName: generateMockData.name(),
                    userMobile: generateMockData.mobile(),
                    nextCount: generateMockData.number(1, 100)
                };
            }, 5),
            40000
        );
    },
    "[GET]/mock/team/getTeamUserInfo": _params => {
        console.log("[Mock] GET /mock/team/getTeamUserInfo", _params);
        return generateMockData.baseResponse(
            {
                userCode: generateMockData.code(),
                userName: generateMockData.name(),
                nextCount: generateMockData.number(1, 100)
            },
            40000
        );
    },
    "[GET]/mock/team/getUserClients": _params => {
        console.log("[Mock] GET /mock/team/getUserClients", _params);
        return generateMockData.baseResponse(
            generateMockData.array(() => {
                return {
                    memberCode: generateMockData.code(),
                    memberName: generateMockData.name(),
                    memberMobile: generateMockData.mobile(),
                    levelName: generateMockData.name(),
                    memberAvatarUrl: "",
                    ownTotal: generateMockData.number(1, 100)
                };
            }, 5),
            40000
        );
    }
});
