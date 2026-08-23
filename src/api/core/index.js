import {onAuthRequired, onResponseRefreshToken} from "./auth.js";
import {onAlovaError, onAlovaResponse} from "./handlers.js";
import {defineAlovaInstance} from "./instance.js";

export const createAlovaInstance = options => {
    return defineAlovaInstance({
        beforeRequest: onAuthRequired(method => {
            console.log("beforeRequest", method);
        }),
        responded: onResponseRefreshToken({
            onSuccess: onAlovaResponse,
            onError: onAlovaError
        }),
        ...(options || {})
    });
};
