import {resolvePage} from "@/router/resolve.js";

const SystemPage = {
    1: "/app/entrance/pages/home",
    2: "/app/team/pages/home",
    4: "/app/user/pages/user"
};

// 系统页面&自定义页面转为page对象
export const resolveRelativePage = page => {
    if (!page) return null;

    if (typeof page === "string") return resolvePage(page);

    const path = SystemPage?.[page?.redirectCode] || "";

    if (path) return resolvePage(path);

    if (page?.pageCode) {
        return resolvePage({
            name: "AppCustomPagePagesHome",
            params: {
                redirectCode: page?.redirectCode,
                pageCode: page.pageCode
            }
        });
    }

    return null;
};

// 获取当前页面路由实例
export const useCurrentPage = () => {
    const page = ref(null);

    const updateCurrentPage = () => {
        const pages = getCurrentPages();
        const currentPage = pages?.[pages.length - 1]?.$page;

        if (currentPage && currentPage.fullPath !== page.value?.fullPath) {
            page.value = resolvePage(currentPage.fullPath);
        }
    };

    onLoad(updateCurrentPage);

    onShow(updateCurrentPage);

    onMounted(updateCurrentPage);

    return page;
};
