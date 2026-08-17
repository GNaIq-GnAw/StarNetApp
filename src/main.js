import {createSSRApp} from "vue";
import {setupLocale} from "@/locale";
import {Pinia, setupStore} from "@/stores";
import {setupZPagingConfig} from "@/utils/zp.js";
import App from "./App.vue";
import {setupNavigate, setupRouter} from "./router";
import "uno.css";
import {setupEnv} from "/env";

export function createApp() {
    const app = createSSRApp(App);

    setupEnv(app);

    setupLocale(app);

    setupRouter(app);

    setupNavigate(app);

    setupStore(app);

    setupZPagingConfig();

    return {
        app,
        Pinia
    };
}
