import {onAuthRequired, onResponseRefreshToken} from "./auth.js";
import {onAlovaError, onAlovaResponse} from "./handlers.js";
import {defineAlovaInstance} from "./instance.js";

// #ifdef APP
const systemInfo = getSystemInfo();
// #endif

export const createAlovaInstance = options => {
    return defineAlovaInstance({
        beforeRequest: onAuthRequired(method => {
            // #ifdef APP
            method.config.headers["x-device-id"] = systemInfo.deviceId;
            method.config.headers["x-device-brand"] = systemInfo.deviceBrand;
            // #endif

            // #ifndef APP
            method.config.headers["x-device-id"] = "swagger-device-id";
            method.config.headers["x-device-brand"] = "swagger-device-brand";
            // #endif
            console.log("beforeRequest", method);
        }),
        responded: onResponseRefreshToken({
            onSuccess: onAlovaResponse,
            onError: onAlovaError
        }),
        ...(options || {})
    });
};
