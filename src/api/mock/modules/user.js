import {defineMock} from "@alova/mock";
import {generateMockData} from "../utils/generators";

export default defineMock({
    "[GET]/mock/user/getUserList": _params => {
        console.log("params", _params);

        return generateMockData.baseResponse(
            generateMockData.array(i => generateMockData.user(i)),
            40000
        );
    }
});
