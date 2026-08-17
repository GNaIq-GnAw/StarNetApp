import {createAlovaInstance} from "./core";

import {createApis, withConfigType} from "./createApis";

export const alovaInstance = createAlovaInstance();

export const $$userConfigMap = withConfigType({});

/**
 * @type {{}}
 */
const Apis = createApis(alovaInstance, $$userConfigMap);

export default Apis;

export {Apis};
