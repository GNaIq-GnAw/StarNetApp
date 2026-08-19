const tabbarItems = ref([
    {name: "PageHome", active: true, title: "人脉", icon: "icon-if-connection"},
    {name: "about", active: false, title: "收支", icon: "icon-antOutline-account-book"},
    {name: "user", active: false, title: "我的", icon: "icon-antOutline-user"}
]);

export function useTabbar() {
    const tabbarList = computed(() => tabbarItems.value);

    const activeTabbar = computed(() => {
        const item = tabbarItems.value.find(item => item.active);
        return item || tabbarItems.value[0];
    });

    const getTabbarItemValue = name => {
        const item = tabbarItems.value.find(item => item.name === name);
        return item?.value;
    };

    const setTabbarItem = (name, value) => {
        const tabbarItem = tabbarItems.value.find(item => item.name === name);
        if (tabbarItem) {
            tabbarItem.value = value;
        }
    };

    const setTabbarItemActive = name => {
        tabbarItems.value.forEach(item => {
            item.active = item.name === name;
        });
    };

    return {
        tabbarList,
        activeTabbar,
        getTabbarItemValue,
        setTabbarItem,
        setTabbarItemActive
    };
}
