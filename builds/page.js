const resolveRes = path => {
    return path
        .replace(/(^|\/)(packages|pages)(?:\/|$)/g, "$1")
        .replace(/[_.-]/g, "/")
        .split("/") // 按斜杠分割成单词数组
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) // 首字母大写，其余小写
        .join(""); // 拼接成无分隔符的大驼峰形式
};

export const handlePageName = ctx => {
    const pages = [...ctx.pageMetaData, ...ctx.subPageMetaData];

    pages.forEach(page => {
        if (page?.root) {
            page.pages.forEach(subPage => {
                subPage.name = resolveRes(`${page.root}/${subPage.path}`);
            });
        } else {
            page.name = resolveRes(page.path);
        }
    });
};
