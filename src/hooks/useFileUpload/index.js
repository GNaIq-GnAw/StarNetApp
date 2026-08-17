const UseFileUploadOptions = {
    delay: 0 // 多任务执行间隔时间
};

export const useFileUpload = (options = null) => {
    const $options = {...UseFileUploadOptions, ...(options || {})};

    const createUploadTask = async (file, formData) => {
        try {
            let res;

            // #ifdef APP-PLUS
            res = await Apis.oss.chunkUpload({
                params: formData,
                data: {name: "file", filePath: file.url},
                requestType: "upload"
            });
            // #endif

            // #ifdef H5
            res = await Apis.oss.chunkUpload({
                data: {name: "file", filePath: URL.createObjectURL(file), ...formData},
                requestType: "upload"
            });
            // #endif

            return Promise.resolve(res.data);
        } catch (e) {
            console.log("createUploadTask.fail", e);
            return Promise.reject(e);
        }
    };

    const upload = async (files = [], formData, handleUploadProgress = null) => {
        if (!files?.filter?.(Boolean)?.length) return Promise.reject(new Error("请选择上传文件"));

        // 创建任务
        const tasks = files.map(file => {
            return () => {
                return createUploadTask(file, formData);
            };
        });

        // 每个任务的进度占比
        const proportion = 100 / tasks.length;

        return new Promise((resolve, reject) => {
            // 按序递归执行
            const run = async (taskIndex = 0, uploadRes = []) => {
                const runTask = tasks?.[0];

                if (!runTask) {
                    reject(new Error("上传任务不存在"));

                    return;
                }

                try {
                    const taskResponse = await runTask();

                    // 计算总进度
                    const progress = proportion * (taskIndex + 1);

                    handleUploadProgress?.(progress.toFixed(2));

                    uploadRes.push(taskResponse);
                    // 删除之前完成的任务
                    tasks.shift();

                    await sleep($options.delay);

                    if (tasks.length > 0) {
                        run(taskIndex + 1, uploadRes);
                    } else {
                        // 最终返回结果
                        resolve(uploadRes);
                    }
                } catch (e) {
                    reject(e);
                }
            };

            run();
        });
    };

    // 适用于上传组件的自定义上传逻辑
    // h5环境下，file参数是File对象，其他是{url: '本地图片路径'}
    const createUploadMethod = async (file, formData, options) => {
        try {
            const [uploadRes] = await upload([file], formData, progress => {
                console.log("createUploadProgress", progress);
                options?.onProgress({progress}, file);
            });

            console.log("uploadRes", uploadRes);

            options?.onSuccess({data: uploadRes}, file, formData);

            return uploadRes;
        } catch (e) {
            options?.onError(e, file, formData);

            return Promise.reject(e);
        }
    };

    const fileChoose = async () => {
        const {tempFilePaths, tempFiles} = await new Promise((resolve, reject) => {
            uni.chooseImage({
                count: 1, // 默认9
                sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ["album"], // 从相册选择
                success: resolve,
                fail: reject
            });
        });

        await sleep(100);

        console.log("tempFilePaths", tempFilePaths);
        console.log("tempFiles", tempFiles);

        // #ifdef H5
        return tempFiles?.[0];
        // #endif

        // #ifndef H5
        return {url: tempFilePaths?.[0]};
        // #endif
    };

    return {
        upload,
        createUploadTask,
        createUploadMethod,
        fileChoose
    };
};

const UseFileDownloadOptions = {
    priority: 0,
    timeout: 120,
    retry: 3,
    retryInterval: 30
};

export const useFileDownload = (options = null) => {
    const $options = {...UseFileDownloadOptions, ...(options || {})};

    const defaultConfig = {
        method: "GET",
        downloadPath: "Download",
        filename: "",
        success: res => {},
        fail: status => {}
    };

    const execute = (url, config = null) => {
        const $config = {...defaultConfig, ...(config || {})};

        const [, filename, fileSuffix] = Regex.FileInfo.exec(url);

        if (!$config.filename) $config.filename = filename;

        // #ifdef APP-PLUS
        const path = `file://storage/emulated/0/${$config.downloadPath}`;

        const task = plus.downloader.createDownload(
            url,
            {
                ...$options,
                method: $config.method,
                filename: `${path}/${$config.filename}.${fileSuffix}`
            },
            (download, status) => {
                console.log("download", download);
                if (status === 200) {
                    $config?.success?.({savedPath: `${$config.downloadPath}/${$config.filename}.${fileSuffix}`});
                } else {
                    $config?.fail?.(status);
                    plus.downloader.clear();
                }
            }
        );

        task.start();
        // #endif
    };

    return {
        execute
    };
};
