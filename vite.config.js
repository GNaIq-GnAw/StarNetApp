import {fileURLToPath, URL} from "node:url";
import Uni from "@uni-helper/plugin-uni";
import {isMpWeixin} from "@uni-helper/uni-env";
import Components from "@uni-helper/vite-plugin-uni-components";
import {WotV2Resolver} from "@uni-helper/vite-plugin-uni-components/resolvers";
import UniLayouts from "@uni-helper/vite-plugin-uni-layouts";
import UniManifest from "@uni-helper/vite-plugin-uni-manifest";
import UniPages from "@uni-helper/vite-plugin-uni-pages";
import Optimization from "@uni-ku/bundle-optimizer";
import UniRoot from "@uni-ku/root";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import {defineConfig, loadEnv} from "vite";
import {handlePageName} from "./builds/page.js";

const resolvePath = dir => {
    return fileURLToPath(new URL(dir, import.meta.url));
};

export default defineConfig(configEnv => {
    const envDir = resolvePath("./env");
    const env = loadEnv(configEnv.mode, envDir);

    return {
        envDir,
        plugins: [
            // https://uni-helper.js.org/vite-plugin-uni-manifest
            UniManifest(),
            // https://uni-helper.js.org/vite-plugin-uni-pages
            UniPages({
                dts: false,
                // subPackages: ["src/packages"],
                exclude: ["**/components/**/*.*", "**/modules/**/*.*", "**/utils/**/*.*", "**/hooks/**/*.*"],
                onAfterMergePageMetaData: handlePageName
            }),
            // https://uni-helper.js.org/vite-plugin-uni-layouts
            UniLayouts(),
            // https://uni-helper.js.org/vite-plugin-uni-components
            Components({
                dts: "src/typings/components.d.ts",
                resolvers: [WotV2Resolver()],
                dirs: ["src/components"],
                directoryAsNamespace: true
            }),
            // https://github.com/uni-ku/root
            UniRoot({
                excludePages: ["**/components/**/**.*", "**/modules/**/**.*", "**/uni_modules/**/**.*"]
            }),
            // https://uni-helper.js.org/plugin-uni
            Uni({
                vueOptions: {
                    template: {
                        transformAssetUrls: {
                            tags: {
                                "wd-img": ["src"]
                            }
                        }
                    }
                }
            }),
            // https://github.com/uni-ku/bundle-optimizer
            Optimization({enable: isMpWeixin, logger: true}),
            // https://github.com/unplugin/unplugin-auto-import
            AutoImport({
                imports: [
                    "vue",
                    "pinia",
                    "uni-app",
                    {
                        from: "@wot-ui/router",
                        imports: ["createRouter", "useRouter", "useRoute"]
                    },
                    {
                        from: "@wot-ui/ui",
                        imports: ["useToast", "useDialog", "useNotify", "CommonUtil"]
                    },
                    {
                        from: "alova/client",
                        imports: ["usePagination", "useRequest"]
                    }
                ],
                dts: "src/typings/auto-imports.d.ts",
                dirs: ["src/hooks/{*.js,*/*.js}", "src/stores", "src/utils", "src/api", "src/enums"],
                vueTemplate: true,
                eslintrc: {
                    enabled: true,
                    filepath: "./src/typings/.eslintrc-auto-import.json",
                    globalsPropValue: true
                }
            }),
            UnoCSS()
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    api: "modern-compiler",
                    silenceDeprecations: ["legacy-js-api"]
                }
            }
        },
        build: {
            sourceMap: false
        },
        optimizeDeps: {
            exclude: ["@wot-ui/ui"]
        },
        server: {
            proxy: {
                [env.VITE_API_URL]: {
                    target: env.VITE_PROXY_TARGET, // 后端接口的真实地址
                    changeOrigin: true, // 开启代理，会把请求头中的Origin改成目标地址
                }
            }
        }
    };
});
