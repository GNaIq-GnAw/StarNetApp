// 模拟数据生成工具函数
export const generateMockData = {
    // 生成随机ID
    id: () => Math.floor(Math.random() * 10000),

    // 生成随机名称
    name: (prefix = "名称") => `${prefix}_${Math.floor(Math.random() * 1000)}`,

    // 生成随机代码
    code: (prefix = "CODE") => `${prefix}_${Math.floor(Math.random() * 1000)}`,

    // 生成随机日期
    // 可以传入天数偏移，负数表示过去的日期，正数表示未来的日期
    date: (dayOffset = 0) => {
        const date = new Date();
        if (dayOffset !== 0) {
            date.setDate(date.getDate() + dayOffset);
        }
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    },

    // 生成随机时间
    // 可以传入天数偏移，负数表示过去的日期，正数表示未来的日期
    datetime: (dayOffset = 0) => {
        const date = new Date();
        if (dayOffset !== 0) {
            date.setDate(date.getDate() + dayOffset);
        }
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    },

    // 时间戳
    timestamp: (dayOffset = 0) => {
        const date = new Date();

        if (dayOffset !== 0) {
            date.setDate(date.getDate() + dayOffset);
        }

        return date.getTime();
    },

    // 生成随机布尔值
    boolean: () => Math.random() > 0.5,

    // 生成随机数字
    number: (min = 0, max = 100) => Math.floor(Math.random() * (max - min)) + min,

    // 生成随机数组
    array: (generator, length = 10) => {
        const result = [];
        for (let i = 0; i < length; i++) {
            result.push(generator(i));
        }
        return result;
    },

    // 生成基础响应对象
    baseResponse: (data = null, code = 2000, msg = "操作成功") => ({
        code,
        data,
        msg
    }),

    // 生成列表响应对象
    listResponse: (data = [], total = data.length, more = false, code = 2000, msg = "操作成功") => ({
        code,
        data,
        total,
        more,
        msg
    }),

    // 生成GCN对象
    gcn: _index => ({
        gid: generateMockData.id(),
        code: generateMockData.code("ORG"),
        name: generateMockData.name("组织")
    }),

    // 生成员工对象
    faEmp: index => ({
        gid: generateMockData.id(),
        code: generateMockData.code("EMP"),
        name: generateMockData.name("员工"),
        org: generateMockData.gcn(index)
    }),

    // 生成车销业务员对象
    vehSaleEmp: index => ({
        gid: generateMockData.id(),
        code: generateMockData.code("VSE"),
        name: generateMockData.name("车销业务员"),
        faEmp: generateMockData.faEmp(index),
        org: generateMockData.gcn(index),
        wms: generateMockData.gcn(index)
    }),

    // 生成权限对象
    permission: index => ({
        module: `module_${index}`,
        moduleName: `模块${index}`,
        roleId: `role_${index}`,
        state: 1
    }),

    // 生成代码名称对象
    codeName: (index, prefix = "线路") => ({
        code: generateMockData.code(`LINE_${index}`),
        name: `${prefix}${index}`
    }),

    // 生成用户对象
    user: (roleCode = "01") => ({
        permissions: generateMockData.array(generateMockData.permission, 5),
        sortLines: generateMockData.array(generateMockData.codeName, 3),
        token: `mock_token_${Date.now()}`,
        roleCode, // 添加roleCode字段：01-车销业务员，02-仓管
        vehSaleEmp: generateMockData.vehSaleEmp(0)
    }),

    // 生成商品对象
    goods: index => ({
        gid: generateMockData.id(),
        code: generateMockData.code("GOODS"),
        name: generateMockData.name("商品"),
        gdCode: generateMockData.code("GDCODE"),
        spec: `规格${index}`,
        munit: "个",
        price: generateMockData.number(1, 1000) / 100,
        qpc: generateMockData.number(1, 10),
        qpcStr: `${generateMockData.number(1, 10)}个/箱`,
        qty: generateMockData.number(1, 100),
        qtyStr: `${generateMockData.number(1, 100)}个`,
        busInvQty: generateMockData.number(1, 100),
        advUseSignQty: generateMockData.number(1, 100),
        version: 1
    }),

    // 单据状态，可选值为：0 | 100 | 1300 | 300 | 110 | 1310
    stat: () => {
        const stats = [100, 1300, 300, 110, 1310];
        return stats[generateMockData.number(0, stats.length - 1)];
    },

    mobile: () => {
        const second = Math.floor(Math.random() * 7) + 3; // 第二位 3~9
        // 生成9位随机数，不足补零
        const rest = String(Math.floor(Math.random() * 1_000_000_000)).padStart(9, "0");

        return `1${second}${rest}`;
    },

    pick: list => {
        // 生成一个 0 到 list.length-1 之间的随机整数索引
        const randomIndex = Math.floor(Math.random() * list.length);

        return list[randomIndex];
    }
};
