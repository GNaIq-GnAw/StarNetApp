/**
 * 生成鸿蒙 build-profile.json5
 *
 * 读取模板文件 build-profile.template.json5（内嵌完整 signingConfigs 结构），
 * 再读取本地签名配置 .signing.local.json，按 name 将本地配置的 material
 * 合并进模板对应的 signingConfig，输出到 harmony-configs/build-profile.json5。
 *
 * .signing.local.json 与 signingConfigs 同构：
 *   { "signingConfigs": [{ "name": "default", "material": { "certpath": "...", ... } }, ...] }
 *   name 需与模板中的 signingConfigs.name 对应（default / release）。
 *
 * 用法：
 *   pnpm harmony-profile:gen
 *
 * 首次使用：
 *   1. 复制 builds/harmony-signing/.signing.example.json 为 builds/harmony-signing/.signing.local.json
 *   2. 填入你本机的证书路径和密码
 *   3. 运行 pnpm harmony-profile:gen
 */
import {existsSync, readFileSync, writeFileSync} from "node:fs";
import {dirname, resolve} from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";
import JSON5 from "json5";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..", "..");

const templatePath = resolve(__dirname, "build-profile.template.json5");
const configPath = resolve(__dirname, ".signing.local.json");
const outputPath = resolve(root, "harmony-configs/build-profile.json5");

// 1. 读取模板
if (!existsSync(templatePath)) {
    console.error("[harmony-profile] 模板文件不存在: build-profile.template.json5");
    process.exit(1);
}
const profile = JSON5.parse(readFileSync(templatePath, "utf-8"));

// 2. 读取本地签名配置
if (!existsSync(configPath)) {
    console.error("");
    console.error("[harmony-profile] 未找到本地签名配置文件: builds/harmony-signing/.signing.local.json");
    console.error("");
    console.error("  请按以下步骤操作：");
    console.error("    1. cp builds/harmony-signing/.signing.example.json builds/harmony-signing/.signing.local.json");
    console.error("    2. 编辑 .signing.local.json，填入你本机的证书路径和密码");
    console.error("    3. 重新运行 pnpm harmony-profile:gen");
    console.error("");
    process.exit(1);
}

const signingConfig = JSON.parse(readFileSync(configPath, "utf-8"));
if (!signingConfig.signingConfigs || !Array.isArray(signingConfig.signingConfigs)) {
    console.error("[harmony-profile] 配置格式错误: .signing.local.json 缺少 signingConfigs 数组");
    console.error("  请参考 .signing.example.json 的格式填写");
    process.exit(1);
}

// 3. 按 name 合并本地配置到模板的 signingConfigs
const missing = [];
const extra = [];
for (const localConfig of signingConfig.signingConfigs) {
    const target = profile.app.signingConfigs.find((c) => c.name === localConfig.name);
    if (!target) {
        extra.push(localConfig.name);
        continue;
    }
    for (const [field, value] of Object.entries(localConfig.material ?? {})) {
        target.material[field] = value;
        if (!value) {
            missing.push(`${localConfig.name}.material.${field}`);
        }
    }
}

if (extra.length > 0) {
    console.warn(`[harmony-profile] 警告: 本地配置中以下 signingConfig 在模板中不存在，已忽略: ${extra.join(", ")}`);
}

if (missing.length > 0) {
    console.warn(`[harmony-profile] 警告: 以下配置项的值为空: ${missing.join(", ")}`);
}

// 4. 检查模板中是否还有空的必填项
const emptyFields = [];
for (const config of profile.app.signingConfigs) {
    for (const [field, value] of Object.entries(config.material)) {
        if (field !== "signAlg" && !value) {
            emptyFields.push(`${config.name}.material.${field}`);
        }
    }
}
if (emptyFields.length > 0) {
    console.warn(`[harmony-profile] 警告: 以下签名配置项未填写，请检查 .signing.local.json: ${emptyFields.join(", ")}`);
}

// 5. 写入最终文件
writeFileSync(outputPath, `${JSON.stringify(profile, null, 4)}\n`, "utf-8");
console.log("[harmony-profile] build-profile.json5 已生成");
