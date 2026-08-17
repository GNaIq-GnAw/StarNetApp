// 解构Promise
const createPromiseWithResolvers = () => {
    // 低版本不支持此api
    if (Promise?.withResolvers) return Promise.withResolvers();

    // 兼容写法
    let resolve = null;
    let reject = null;

    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });

    return {promise, resolve, reject};
};

const {promise, resolve} = createPromiseWithResolvers();

export const useAppInitialize = () => {
    // 注册 App 启动初始化逻辑：回调接收 resolve，由业务逻辑决定何时解锁（只能在 App.vue 的 onLaunch 中调用）
    const registerAppInit = cb => {
        onLaunch(() => {
            // 执行回调函数，传入resolve，由具体逻辑决定何时resolve
            cb(resolve);
        });
    };

    // 页面侧：等待 App 初始化完成后再执行回调（任意页面的 onLoad 中调用）
    const onAppReady = cb => {
        onLoad(async e => {
            // 等待resolve返回结果true|false，再往下执行回调
            const resolved = await promise;
            cb?.(e, resolved);
        });
    };

    // 如果不满足需求，可使用isResolved，自定义逻辑
    // const fn = async () => {
    //     const ret = await isResolved;
    //     // 业务代码
    // };
    return {registerAppInit, onAppReady, isResolved: promise};
};
