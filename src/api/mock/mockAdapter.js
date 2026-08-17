import {uniappMockResponse, uniappRequestAdapter} from "@alova/adapter-uniapp";
import {createAlovaMockAdapter} from "@alova/mock";

// 导入所有mock模块
const loadMockModules = () => {
    const modules = import.meta.glob("./modules/*.js", {eager: true});

    return Object.entries(modules).map(([, module]) => module.default);
};

const mocks = loadMockModules();

// 创建mock适配器
const mockAdapter = createAlovaMockAdapter(mocks, {
    // 使用uniapp请求适配器处理非mock请求
    httpAdapter: uniappRequestAdapter,

    // 使用uniapp mock响应适配器
    onMockResponse: uniappMockResponse,

    // 根据环境变量启用/禁用mock
    enable: true,

    // 添加延迟以模拟网络延迟 (200-600ms)
    delay: Math.random() * 400 + 200,

    // 在开发环境下打印mock请求日志
    mockRequestLogger: false,

    // 路径匹配模式 - 使用完整路径匹配
    matchMode: "methodurl"
});

export default mockAdapter;
