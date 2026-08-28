import assert from "node:assert/strict";
import {describe, it} from "node:test"; // eslint-disable-line test/no-import-node-test -- 项目未安装 vitest,使用 Node 内置测试器
import {convertText, convertValue, DEFAULT_FACTOR, REVERSE_FACTOR} from "./rpx-convert.mjs";

describe("convertValue", () => {
    it("默认系数 375->393", () => {
        assert.equal(convertValue(100, DEFAULT_FACTOR, 2), "95.42");
        assert.equal(convertValue(8, DEFAULT_FACTOR, 2), "7.63");
        assert.equal(convertValue(24, DEFAULT_FACTOR, 2), "22.9"); // 去尾零
        assert.equal(convertValue(20, DEFAULT_FACTOR, 2), "19.08");
        assert.equal(convertValue(0, DEFAULT_FACTOR, 2), "0");
    });

    it("支持小数输入", () => {
        assert.equal(convertValue(12.5, DEFAULT_FACTOR, 2), "11.93");
    });

    it("自定义精度", () => {
        assert.equal(convertValue(100, DEFAULT_FACTOR, 1), "95.4");
        assert.equal(convertValue(100, DEFAULT_FACTOR, 0), "95");
    });

    it("反向系数 393->375 能还原", () => {
        assert.equal(convertValue(95.42, REVERSE_FACTOR, 2), "100");
        assert.equal(convertValue(19.08, REVERSE_FACTOR, 2), "20");
    });
});

describe("convertText", () => {
    it("替换所有 rpx 并保留单位", () => {
        assert.equal(convertText("mt-100rpx size-160rpx", DEFAULT_FACTOR, 2), "mt-95.42rpx size-152.67rpx");
    });

    it("uno 任意值逐个替换", () => {
        assert.equal(convertText("p-[10rpx_20rpx]", DEFAULT_FACTOR, 2), "p-[9.54rpx_19.08rpx]");
    });

    it("不动 px 和普通数字", () => {
        assert.equal(convertText("b-(1px solid) width=\"100\"", DEFAULT_FACTOR, 2), "b-(1px solid) width=\"100\"");
        assert.equal(convertText("height: 100px;", DEFAULT_FACTOR, 2), "height: 100px;");
    });

    it("多值字符串只换 rpx 部分", () => {
        assert.equal(convertText("\"0 20rpx 0 0\"", DEFAULT_FACTOR, 2), "\"0 19.08rpx 0 0\"");
    });

    it("无 rpx 时原样返回", () => {
        assert.equal(convertText("nothing here", DEFAULT_FACTOR, 2), "nothing here");
    });
});
