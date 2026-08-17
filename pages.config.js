import path from "node:path";
import {defineUniPages} from "@uni-helper/vite-plugin-uni-pages";
import {loadEnv} from "vite";

const env = loadEnv(process.env.NODE_ENV, path.resolve(process.cwd(), "env"));

export default defineUniPages({
    pages: [
        // {
        //     path: "uni_modules/uni-upgrade-center-app/pages/upgrade-popup",
        //     style: {
        //         disableScroll: true,
        //         "app-plus": {
        //             backgroundColorTop: "transparent",
        //             background: "transparent",
        //             titleNView: false,
        //             scrollIndicator: false,
        //             popGesture: "none",
        //             animationType: "fade-in",
        //             animationDuration: 200
        //         }
        //     }
        // }
    ],
    subPackages: [],
    globalStyle: {
        navigationBarTitleText: env.VITE_APP_NAME,
        navigationBarTextStyle: "black",
        navigationStyle: "custom",
        "app-plus": {
            bounce: "none"
        }
    },
    preloadRule: {
        "app/entrance/pages/index": {
            network: "all",
            packages: ["__APP__"]
        }
    }
});
