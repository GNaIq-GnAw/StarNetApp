export const useNotebookStore = defineStore("notebook", () => {
    const list = ref([]);

    // 当前默认记事本
    const defaultNotebook = computed(() => {
        return list.value.find(item => item.isDefault) || list.value?.[0];
    });

    const setDefaultNotebook = async id => {
        try {
            await Apis.notebook.setDefaultNotebook({pathParams: {id}});

            list.value.forEach(item => (item.isDefault = item.id === id));

            return true;
        } catch (e) {
            console.log("setDefaultNotebook -> failed", e);

            return Promise.reject(e);
        }
    };

    // 获取所有记事本
    const getNotebooks = async () => {
        try {
            const {data} = await Apis.notebook.getNotebooks();

            list.value = data.sort((a, b) => b.createTime - a.createTime);

            return list.value;
        } catch (e) {
            console.log("getNotebooks -> failed", e);
            return Promise.reject(e);
        }
    };

    return {
        list,
        defaultNotebook,
        setDefaultNotebook,
        getNotebooks
    };
});
