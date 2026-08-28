import {execSync} from "node:child_process";
/**
 * rpx 设计稿标准批量换算脚本
 *
 * 默认 375 标准 -> 393 标准（x / 2 * 1.9084 = x * 0.9542）
 * --reverse 反向（393 -> 375）
 *
 * 用法:
 *   node scripts/rpx-convert.mjs <paths...>                # 默认 375->393
 *   node scripts/rpx-convert.mjs --dry-run <paths...>      # 试运行,只报告不写盘
 *   node scripts/rpx-convert.mjs --reverse <paths...>      # 393->375
 *   node scripts/rpx-convert.mjs --precision 1 <paths...>  # 保留 1 位小数(默认 2)
 *
 * 注意: 脚本不幂等,重复执行会连续换算。回滚靠 git。
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";

export const DEFAULT_FACTOR = 1.9084 / 2; // 0.9542  375 -> 393
export const REVERSE_FACTOR = 2 / 1.9084; // 1.0480  393 -> 375

const EXTENSIONS = new Set([".vue", ".js", ".ts", ".uts", ".css", ".scss", ".less", ".json"]);
const RPX_RE = /(\d+(?:\.\d+)?)rpx/g;

/** 单值换算: 返回去尾零的字符串 */
export function convertValue(value, factor = DEFAULT_FACTOR, precision = 2) {
    const r = Number((value * factor).toFixed(precision));
    return String(r);
}

/** 文本批量换算 */
export function convertText(text, factor = DEFAULT_FACTOR, precision = 2) {
    return text.replace(RPX_RE, (m, num) => `${convertValue(Number(num), factor, precision)}rpx`);
}

/** 收集目录/文件列表中的可处理文件 */
function collectFiles(target) {
    const abs = path.resolve(target);
    if (!fs.existsSync(abs)) {
        console.warn(`[跳过] 路径不存在: ${target}`);
        return [];
    }
    const stat = fs.statSync(abs);
    if (stat.isFile()) {
        return EXTENSIONS.has(path.extname(abs).toLowerCase()) ? [abs] : [];
    }
    const result = [];
    const queue = [abs];
    while (queue.length) {
        const dir = queue.shift();
        for (const name of fs.readdirSync(dir)) {
            if (name === "node_modules" || name === ".git" || name === "dist" || name === "unpackage") continue;
            const full = path.join(dir, name);
            const st = fs.statSync(full);
            if (st.isDirectory()) queue.push(full);
            else if (EXTENSIONS.has(path.extname(full).toLowerCase())) result.push(full);
        }
    }
    return result;
}

/** git 工作区不干净时给出警告 */
function warnIfDirty(files) {
    try {
        const root = execSync("git rev-parse --show-toplevel", {encoding: "utf8"}).trim();
        const status = execSync("git status --short", {cwd: root, encoding: "utf8"}).trim();
        if (!status) return;
        const touched = files.filter((f) => status.includes(path.relative(root, f).replace(/\\/g, "/")));
        if (touched.length) {
            console.warn(`\u26A0\uFE0F 以下目标文件在 git 中有未提交改动,建议先 commit 再换算:\n${touched.join("\n")}\n`);
        }
    } catch {
        /* 非 git 仓库,静默跳过 */
    }
}

function main(argv) {
    const opts = {dryRun: false, reverse: false, precision: 2};
    const targets = [];
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--dry-run") {
            opts.dryRun = true;
        } else if (a === "--reverse") {
            opts.reverse = true;
        } else if (a === "--precision") {
            opts.precision = Number.parseInt(argv[++i], 10);
        } else if (a === "--help" || a === "-h") {
            const self = fs.readFileSync(fileURLToPath(import.meta.url), "utf8");
            const doc = self.match(/\/\*\*[\s\S]*?\*\//)?.[0] ?? "rpx 换算脚本";
            console.log(doc.replace(/^\/\*\*/, "").replace(/\*\/$/, "").replace(/^\s*\* ?/gm, "").trim());
            process.exit(0);
        } else {
            targets.push(a);
        }
    }

    if (!targets.length) {
        console.error("用法: node scripts/rpx-convert.mjs [--dry-run] [--reverse] [--precision N] <文件或目录...>");
        process.exit(1);
    }

    const factor = opts.reverse ? REVERSE_FACTOR : DEFAULT_FACTOR;
    const direction = opts.reverse ? "393 -> 375" : "375 -> 393";
    const files = [...new Set(targets.flatMap(collectFiles))];

    if (!opts.dryRun) warnIfDirty(files);

    let fileCount = 0;
    let totalCount = 0;
    const cwd = process.cwd();
    for (const file of files) {
        let src;
        try {
            src = fs.readFileSync(file, "utf8");
        } catch {
            console.warn(`[跳过] 读取失败: ${file}`);
            continue;
        }
        if (!src.includes("rpx")) continue;
        let count = 0;
        const out = src.replace(RPX_RE, (m, num) => {
            count++;
            return `${convertValue(Number(num), factor, opts.precision)}rpx`;
        });
        if (!count) continue;
        if (!opts.dryRun) fs.writeFileSync(file, out); // 同步写入,不触碰换行符
        console.log(`${path.relative(cwd, file).replace(/\\/g, "/")}: ${count} 处${opts.dryRun ? " (dry-run)" : ""}`);
        fileCount++;
        totalCount += count;
    }

    console.log(`\n${opts.dryRun ? "[试运行] " : ""}${direction}, 共 ${fileCount} 个文件 ${totalCount} 处替换。`);
    if (!opts.dryRun) console.log("注意: 脚本不幂等,请勿重复执行。回滚: git checkout -- <paths>");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main(process.argv.slice(2));
}
