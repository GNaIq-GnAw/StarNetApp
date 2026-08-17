const tabbarItems = ref([
    {name: "home", active: true, title: "首页", icon: "home"},
    // {name: "about", active: false, title: "关于", icon: "user"}
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
            if (item.name === name) {
                item.active = true;
            } else {
                item.active = false;
            }
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
