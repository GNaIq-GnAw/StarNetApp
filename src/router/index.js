import {pages, subPackages} from "virtual:uni-pages";

export {setupNavigate} from "./navigate.js";

const generateRoutes = () => {
    const routes = pages.map(page => {
        const {path, ...rest} = page;

        return {...rest, path: `/${path}`};
    });

    if (subPackages && subPackages.length > 0) {
        subPackages.forEach(subPackage => {
            const subRoutes = subPackage.pages.map(page => {
                const {path, ...rest} = page;

                return {...rest, path: `/${subPackage.root}/${path}`};
            });

            routes.push(...subRoutes);
        });
    }

    return routes;
};

export const routes = generateRoutes();

export const setupRouter = app => {
    const router = createRouter({routes});

    app.use(router);

    router.beforeEach(async (to, from, next) => {
        console.log("router -> beforeEach", to, from);

        const auth = to?.meta?.auth ?? true;

        const userStore = useUserStore();

        // 未登录状态
        if (!userStore.token) {
            if (!auth) {
                next();

                return;
            }

            // 重定向到登录页
            next({name: "PagesLogin", navType: "replaceAll"});

            return;
        }

        if (to?.name === "PagesLogin") {
            next({...from, navType: "replaceAll"});

            return;
        }

        // 获取用户信息
        if (auth && !userStore.userInfo) await userStore.getUserInfo();

        next();
    });

    router.afterEach((to, from) => {
        console.log("router -> afterEach", to, from);
        // 逻辑代码
        if (to?.redirectPage) router.replaceAll(to.redirectPage);
    });
};
