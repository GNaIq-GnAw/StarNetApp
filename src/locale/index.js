import {createI18n} from "vue-i18n";
import en from "./en.json";
import zhHans from "./zh-Hans.json";

const i18n = createI18n({
    locale: "zh-Hans",
    fallbackLocale: "zh-Hans",
    messages: {en, "zh-Hans": zhHans},
    legacy: false,
    globalInjection: true
});

export const setupLocale = app => app.use(i18n);
