import * as Pinia from "pinia";

export const store = Pinia.createPinia();

export {Pinia};

export const setupStore = app => app.use(store);
