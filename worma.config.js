import {defineConfig} from "wormajs";
import {alovaGlobals, swagger} from "wormajs/plugin";

export default defineConfig({
    generator: [
        {
            output: "src/api1",
            type: "module",
            plugins: [swagger("./api-docs.json"), alovaGlobals()],
            handleApi: apiDescriptor => {
                // 跳过弃用接口
                if (apiDescriptor.deprecated) return undefined;

                // 获取接口url前缀作为tag
                const [tag] = apiDescriptor.url.split("/").filter(Boolean);

                apiDescriptor.tags = [tag];

                // 处理接口名称定义
                // apiDescriptor.operationId = urls[urls.length - 1];
                apiDescriptor.operationId = apiDescriptor.operationId.replace(/Using.*$/, "");

                return apiDescriptor;
            }
        }
    ]
});
