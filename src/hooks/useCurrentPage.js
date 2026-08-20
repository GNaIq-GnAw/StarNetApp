import {resolvePage} from "@/router/resolve.js";

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
