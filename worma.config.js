import {defineConfig} from "wormajs";
import {alovaGlobals, apiFilter, swagger, tagModifier} from "wormajs/plugin";

const camelCase = name => {
    return name
        .split(/[_-]/)
        .map((part, index) => {
            if (index === 0) return part;

            return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join("");
};

export default defineConfig({
    generator: [
        {
            output: "src/api",
            type: "module",
            plugins: [
                swagger("https://test.rongdaufun.com/xw/client/v2/api-docs?group=%E6%8E%A5%E5%8F%A3"),
                alovaGlobals(),
                tagModifier(tag => camelCase(tag)),
                apiFilter({exclude: "/demo/tt"})
            ],
            handleApi: apiDescriptor => {
                // 跳过弃用接口
                if (apiDescriptor.deprecated) return undefined;

                // 获取接口url前缀作为tag
                const [tag, path] = apiDescriptor.url
                    .replace(/\/\{[^}]*\}/g, "")
                    .split("/")
                    .filter(Boolean);

                apiDescriptor.tags = [tag];

                // 处理接口名称定义
                const operationId = apiDescriptor.operationId.replace(/Using.*$/, "");

                if (["create", "delete", "update", "list"].includes(operationId.toLowerCase())) {
                    apiDescriptor.operationId = camelCase(`${path}-${operationId}`);
                } else {
                    apiDescriptor.operationId = operationId;
                }

                return apiDescriptor;
            }
        }
    ]
});
