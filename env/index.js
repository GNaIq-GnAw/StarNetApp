const envData = import.meta.env;

export const setupEnv = app => {
    app.config.globalProperties.$env = key => envData?.[key] || "";
};
