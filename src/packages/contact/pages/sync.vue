<script setup>
    definePage({
        style: {
            "app-plus": {
                softinputMode: "adjustResize"
            },
            "app-harmony": {
                softinputMode: "adjustResize"
            }
        }
    });

    const {checkPermission, fetchAll, contacts, search, authorized} = useContacts();

    const pagingRef = ref(null);

    const list = ref([]);

    const datum = reactive({
        keyword: "",
        checkedKeys: [],
        excludeExisted: false
    });

    const queryList = async () => {
        try {
            await fetchAll();
            const list = search(datum.keyword);

            pagingRef.value.complete(
                list.filter(item => {
                    // 过滤已导入的
                    if (datum.excludeExisted) {
                        // [] 占位
                        return !item.phones.some(phone => [].includes(phone));
                    }

                    return true;
                })
            );
        } catch {
            pagingRef.value.complete(false);
        }
    };

    const onListChange = vlist => {
        list.value = vlist;
    };

    // 打开权限设置
    const openAuthorizeSetting = () => {
        uni.openAppAuthorizeSetting({
            success: res => {
                console.log(res);
            }
        });
    };

    const reloadData = () => {
        pagingRef.value.reload();
    };

    const checkboxGroupRef = ref(null);

    const [allChecked, toggleAllChecked] = useToggle();

    // 全选
    const onCheck = () => {
        const checked = toggleAllChecked();

        checkboxGroupRef.value?.toggleAll({checked, skipDisabled: true});
    };

    const notebookStore = useNotebookStore();

    const withTasks = () => {
        const notebookId = notebookStore.defaultNotebook.id;

        const tasks = contacts.value
            .filter(item => datum.checkedKeys.includes(item.id))
            .map(e => {
                return async () => {
                    try {
                        return await Apis.contact.createContact({
                            data: {
                                name: e.name,
                                phones: e.phones.map(phone => ({type: 1, phone})),
                                notebookId
                            }
                        });
                    } catch (e) {
                        return Promise.reject(e);
                    }
                };
            });

        return new Promise((resolve, reject) => {
            // 按序递归执行
            const run = async () => {
                const runTask = tasks?.[0];

                if (!runTask) {
                    reject(new Error("任务不存在"));

                    return;
                }

                try {
                    await runTask();

                    // 删除之前完成的任务
                    tasks.shift();

                    if (tasks.length > 0) {
                        run();
                    } else {
                        // 最终返回结果
                        resolve();
                    }
                } catch (e) {
                    reject(e);
                }
            };

            run();
        });
    };

    const {data: contactsDatum, send: getContactsDatum} = useRequest(
        () => {
            const notebookId = notebookStore.defaultNotebook.id;

            return Apis.contact.getContactsByNotebook({pathParams: {notebookId}});
        },
        {
            initialData: [],
            middleware: async (_, next) => {
                uni.showLoading({mask: true});

                try {
                    const {data} = await next();

                    return data.map(item => item.phones.map(e => e.phone)).flat();
                } catch {
                    return [];
                } finally {
                    uni.hideLoading();
                }
            }
        }
    );

    const onSubmit = async () => {
        uni.showLoading({title: "导入中..."});

        try {
            await withTasks();

            uni.hideLoading();

            await getContactsDatum();

            uni.showToast({
                title: "导入成功",
                icon: "success",
                mask: true,
                success: () => {
                    // setTimeout(() => {
                    //     eventChannel.emit("reload:data");
                    //
                    //     uni.navigateBack();
                    // }, 1500);
                }
            });
        } catch (e) {
            uni.hideLoading();
            uni.showToast({title: e.message, icon: "none"});
        }
    };

    onMounted(() => {
        checkPermission();
        fetchAll();
    });
</script>

<template>
    <view class="h-full flex flex-col of-hidden bg-#f3f4f4">
        <wd-navbar
            :bordered="false"
            left-arrow
            left-text="导入通讯录"
            safe-area-inset-top
            @click-left="$navigateBack()"
        >
            <template #right>
                <view class="text-22.90rpx c-#492FD3 lh-38.17rpx" @click="onCheck()">
                    {{ allChecked ? "取消全选" : "全选" }}
                </view>
            </template>
        </wd-navbar>
        <view v-if="authorized" class="flex flex-1 flex-col of-hidden">
            <view class="bg-#f3f4f4 p-[19.08rpx_38.17rpx] text-19.08rpx c-#FA8C16 lh-38.17rpx">
                <view>当联系人存在多个联系方式时，系统支出自动记录这些号码；</view>
                <view>当联系人未设置姓名时，系统默认将第一个号码作为联系人姓名进行记录。</view>
            </view>
            <view :style="{'--wot-search-block-margin-right': 0}" class="p-[0_19.08rpx_19.08rpx]">
                <wd-search
                    v-model="datum.keyword"
                    hide-cancel
                    placeholder="输入姓名或电话查询"
                    placeholder-left
                    variant="plain"
                    @clear="reloadData"
                    @search="reloadData"
                />
                <view class="m-[19.08rpx_19.08rpx_0]">
                    <wd-checkbox v-model="datum.excludeExisted" type="square" @change="reloadData()">
                        仅展示未导入的联系人
                    </wd-checkbox>
                </view>
            </view>
            <view class="flex-1">
                <z-paging
                    ref="pagingRef"
                    :empty-view-center="false"
                    :loading-more-enabled="false"
                    auto-show-system-loading
                    cell-height-mode="dynamic"
                    force-close-inner-list
                    use-virtual-list
                    @query="queryList"
                    @virtual-list-change="onListChange"
                >
                    <template #empty>
                        <view
                            class="m-19.08rpx flex flex-col items-center rd-7.63rpx bg-#ffffff p-[57.25rpx_0] lh-38.17rpx"
                        >
                            <view class="i-icon-park-outline:termination-file size-76.34rpx c-primary6/10" />
                            <view class="mt-19.08rpx text-22.90rpx c-primary6/50">未读取到通讯录信息</view>
                            <view class="text-19.08rpx c-#2F59F4" @click="reloadData()">重新读取</view>
                        </view>
                    </template>
                    <wd-checkbox-group ref="checkboxGroupRef" v-model="datum.checkedKeys">
                        <view class="bg-#ffffff">
                            <view
                                v-for="row in list"
                                :id="`zp-id-${row.zp_index}`"
                                :key="row.zp_index"
                                class="mx-19.08rpx b-b-(1px primary6/10 solid) bg-#ffffff p-[38.17rpx_19.08rpx] last:b-b-none"
                            >
                                <view class="flex items-center text-22.90rpx lh-38.17rpx">
                                    <view class="flex items-center">
                                        <view class="i-tdesign:user size-26.72rpx" />
                                        <view class="ml-9.54rpx fw-600">{{ row.name }}</view>
                                        <view
                                            v-if="row.phones.length > 1"
                                            class="ml-9.54rpx rd-3.82rpx bg-#FBC050 px-9.54rpx text-19.08rpx c-#ffffff lh-26.72rpx"
                                        >
                                            {{ row.phones.length }}个联系方式
                                        </view>
                                    </view>
                                    <view class="ml-auto flex items-center">
                                        <view>{{ row.phones?.[0] }}</view>
                                        <view class="ml-9.54rpx">
                                            <wd-checkbox
                                                :disabled="row.phones.some(phone => contactsDatum.includes(phone))"
                                                :name="row.id"
                                                type="square"
                                            />
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </wd-checkbox-group>
                </z-paging>
            </view>
        </view>
        <view v-else class="flex-1">
            <view class="m-19.08rpx flex flex-col items-center rd-7.63rpx bg-#ffffff p-[57.25rpx_0] lh-38.17rpx">
                <view class="i-ri:list-settings-line size-76.34rpx c-primary6/10" />
                <view class="mt-19.08rpx text-22.90rpx c-primary6/50">功能需要开启权限</view>
                <view class="text-19.08rpx c-#2F59F4" @click="fetchAll()">功能刷新</view>
            </view>
        </view>
        <view class="flex items-center rd-7.63rpx bg-#ffffff p-[19.08rpx_38.17rpx]">
            <view class="w-190.84rpx">
                <wd-button block variant="plain">取消</wd-button>
            </view>
            <view class="ml-19.08rpx flex-1">
                <wd-button v-if="authorized" :disabled="datum.checkedKeys.length === 0" block @click="onSubmit()">
                    导入
                </wd-button>
                <wd-button v-else block @click="openAuthorizeSetting()">开启权限设置</wd-button>
            </view>
        </view>
    </view>
</template>

<style scoped></style>
