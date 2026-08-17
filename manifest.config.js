import path from "node:path";
import {defineManifestConfig} from "@uni-helper/vite-plugin-uni-manifest";
import {loadEnv} from "vite";

const env = loadEnv(process.env.NODE_ENV, path.resolve(process.cwd(), "env"));

export default defineManifestConfig({
    name: env.VITE_APP_NAME,
    appid: "__UNI__12A2B2B",
    description: "",
    versionName: "1.0.0",
    versionCode: "100",
    transformPx: false,
    /* 5+App特有相关 */
    "app-plus": {
        usingComponents: true,
        nvueStyleCompiler: "uni-app",
        compilerVersion: 3,
        splashscreen: {
            alwaysShowBeforeRender: false,
            waiting: false,
            autoclose: false,
            delay: 0
        },
        /* 模块配置 */
        modules: {
            Camera: {},
            VideoPlayer: {},
            SQLite: {}
        },
        /* 应用发布信息 */
        distribute: {
            /* android打包配置 */
            android: {
                enableOAID: false,
                targetSdkVersion: 30,
                permissions: [
                    "<uses-permission android:name='android.permission.CHANGE_NETWORK_STATE'/>",
                    "<uses-permission android:name='android.permission.MOUNT_UNMOUNT_FILESYSTEMS'/>",
                    "<uses-permission android:name='android.permission.VIBRATE'/>",
                    "<uses-permission android:name='android.permission.READ_LOGS'/>",
                    "<uses-permission android:name='android.permission.ACCESS_WIFI_STATE'/>",
                    "<uses-feature android:name='android.hardware.camera.autofocus'/>",
                    "<uses-permission android:name='android.permission.ACCESS_NETWORK_STATE'/>",
                    "<uses-permission android:name='android.permission.CAMERA'/>",
                    "<uses-permission android:name='android.permission.READ_PHONE_STATE'/>",
                    "<uses-permission android:name='android.permission.CHANGE_WIFI_STATE'/>",
                    "<uses-permission android:name='android.permission.WAKE_LOCK'/>",
                    "<uses-permission android:name='android.permission.FLASHLIGHT'/>",
                    "<uses-feature android:name='android.hardware.camera'/>",
                    "<uses-permission android:name='android.permission.WRITE_SETTINGS'/>",
                    "<uses-permission android:name='android.permission.CALL_PHONE'/>"
                ]
            },
            /* ios打包配置 */
            ios: {},
            /* SDK配置 */
            sdkConfigs: {},
            splashscreen: {
                useOriginalMsgbox: true
            }
        },
        nativePlugins: {}
    },
    "app-harmony": {},
    "mp-harmony": {
        "distribute": {}
    },
    /* 快应用特有相关 */
    quickapp: {},
    /* 小程序特有相关 */
    "mp-weixin": {
        appid: "wx9785c8143fabcb82",
        setting: {
            urlCheck: false,
            minified: true
        },
        usingComponents: true,
        lazyCodeLoading: "requiredComponents",
        optimization: {
            subPackages: true
        }
    },
    "mp-alipay": {
        usingComponents: true
    },
    "mp-baidu": {
        usingComponents: true
    },
    "mp-toutiao": {
        usingComponents: true
    },
    uniStatistics: {
        enable: false
    },
    vueVersion: "3",
    h5: {}
});
