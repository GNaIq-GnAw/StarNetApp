---
name: lime-shared 常用函数库
description: 专为 uni-app / uni-app x 组件开发设计的轻量级工具集，提供验证器、单位转换、DOM 查询、动画过渡、BEM 命名等辅助能力。
tags:
  - shared
  - 工具
  - BEM
  - 工具函数
plugin: lime-shared
category: SDK 工具库
dependencies: []
---

# lime-shared 常用函数库

专为 uni-app / uni-app x 组件开发设计的轻量级工具集，提供验证器、单位转换、图片处理、Canvas、DOM 查询、动画过渡、BEM 命名等高效便捷的辅助能力，全面兼容蒸汽模式（uvue/uts）跨平台编译。

> 插件依赖：无

## 安装方法

1. 在 uni-app 插件市场中搜索并导入 `lime-shared`
2. 导入后可能需要重新编译项目
3. 在代码中按需引入所需函数即可使用

::: tip 注意🔔
本插件为函数库，不提供组件标签，仅通过 `import` 方式按需引入工具函数。
:::

## 代码演示

### 基础使用

按需引入工具函数即可使用，无需全局注册。

```js
// 引入单个函数
import { addUnit } from '@/uni_modules/lime-shared/addUnit'
import { classNames } from '@/uni_modules/lime-shared/classNames'
import { stringifyStyle } from '@/uni_modules/lime-shared/stringifyStyle'

// 在组件中使用
const style = stringifyStyle({ color: 'red', fontSize: '14px' })
const className = classNames('btn', { 'btn--disabled': true })
const size = addUnit(100) // '100px'
```

### 验证器使用

提供一系列类型与格式验证函数，统一返回布尔值。

```js
import { isNumber } from '@/uni_modules/lime-shared/isNumber'
import { isEmail } from '@/uni_modules/lime-shared/isEmail'
import { isURL } from '@/uni_modules/lime-shared/isURL'
import { isIP } from '@/uni_modules/lime-shared/isIP'

isNumber(42)              // true
isNumber('42')            // false
isEmail('a@b.com')        // true
isURL('https://a.com')    // true
isIP('192.168.1.1')       // true
isIP('::1', { version: 6 }) // true
```

### BEM 命名与样式工具

配合 `lime-style` 提供扁平化 BEM 类名生成与样式字符串拼接。

```js
import { createBem } from '@/uni_modules/lime-shared/bem'
import { classNames } from '@/uni_modules/lime-shared/classNames'
import { stringifyStyle } from '@/uni_modules/lime-shared/stringifyStyle'

const bem = createBem('avatar')

// 生成 BEM 类名
bem.b()              // 'l-avatar'
bem.e('icon')        // 'l-avatar__icon'
bem.m('small')       // 'l-avatar--small'
bem.em('icon', 'round') // 'l-avatar__icon--round'
bem.m('small', true) // 'l-avatar--small'
bem.ev('icon', ['active', 'border']) // 'l-avatar__icon--active-border'

// 合并类名（自动过滤空值）
const cls = classNames(bem.b(), bem.m('disabled', isDisabled), props.lClass)

// 拼接样式字符串（自动过滤 null/undefined）
const style = stringifyStyle({ color: 'red' }, props.lStyle)
```

### DOM 查询与节点信息

跨平台获取节点位置尺寸、查询组件实例。

```js
import { getRect, getAllRect } from '@/uni_modules/lime-shared/getRect'
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
// 获取单个节点
getRect('.item', instance).then((rect) => {
  console.log(rect.width, rect.height)
})
// 获取多个节点
getAllRect('.item', instance).then((rects) => {
  console.log(rects.length)
})
```

### Canvas 异步上下文

统一封装不同平台 Canvas 创建逻辑，返回一致的接口。

```js
import { createCanvasContextAsync } from '@/uni_modules/lime-shared/createCanvasContextAsync'

const canvas = await createCanvasContextAsync('myCanvas', instance.proxy)
const ctx = canvas.renderContext
ctx.fillStyle = '#ff0000'
ctx.fillRect(0, 0, 100, 100)
canvas.flush()
const dataURL = await canvas.toDataURL('image/png', 1.0)
```

### 动画与过渡

提供 `raf` 动画帧、`sleep` 延时、`Timeline`/`Animation` 时间轴及 `useTransition` 过渡能力。

```js
import { raf, cancelRaf, doubleRaf } from '@/uni_modules/lime-shared/raf'
import { sleep } from '@/uni_modules/lime-shared/sleep'
import { Timeline, Animation } from '@/uni_modules/lime-shared/animation'

// 动画帧
const id = raf(() => console.log('frame'))
cancelRaf(id)

// 延时
await sleep(300)

// 时间轴
const timeline = new Timeline()
timeline.add(new Animation(0, 100, 300, 0), 0)
timeline.start()
```

## API 文档

> 以下按功能分类列出全部可用函数。除特别说明外，所有函数均支持 uni-app / uni-app x 跨平台。

### 验证器

| 函数名 | 路径 | 说明 |
| --- | --- | --- |
| `isBase64(str)` | `isBase64` | 判断字符串是否为 Base64 编码 |
| `isDataURI(str)` | `isBase64` | 判断字符串是否为 Base64 编码的 data URI |
| `isBoolean(value)` | `isBoolean` | 严格判断值是否为布尔值 |
| `isByteLength(str, options)` | `isByteLength` | 验证字符串字节长度是否在范围内 |
| `isDate(input, options)` | `isDate` | 验证字符串或 Date 是否为有效日期 |
| `isDef(value)` | `isDef` | 检查值是否已定义（非 undefined/null） |
| `isEmail(email)` | `isEmail` | 验证电子邮件地址格式 |
| `isEmpty(value)` | `isEmpty` | 判断值是否为空（null/空串/空数组/空对象） |
| `isFunction(val)` | `isFunction` | 检查值是否为函数类型 |
| `isIP(ip, options)` | `isIP` | 验证 IP 地址（支持 IPv4/IPv6） |
| `isNumber(value)` | `isNumber` | 检查值是否为数字类型 |
| `isNumeric(value)` | `isNumeric` | 检查值是否为数字或可解析为数字的字符串 |
| `isObject(val)` | `isObject` | 检查值是否为对象类型 |
| `isPromise(val)` | `isPromise` | 检查值是否为 Promise |
| `isRegExp(obj)` | `isRegExp` | 检测值是否为正则表达式对象 |
| `isString(str)` | `isString` | 检查值是否为字符串类型 |
| `isURL(url, options)` | `isURL` | 综合验证 URL（支持协议白名单、TLD、端口等） |
| `isValidDomain(str, options)` | `isValidDomain` | 验证字符串是否为合法域名 |

### 单位转换

| 函数名 | 路径 | 说明 |
| --- | --- | --- |
| `addUnit(value, unit='px')` | `addUnit` | 给值添加单位，已含单位则原样返回 |
| `unitConvert(value, base=0)` | `unitConvert` | 将 rpx/px/% 字符串转换为像素数字 |
| `parseUnit(value, base=0)` | `unitConvert` | 包装 `unitConvert`，NaN 返回 null |
| `toNumber(val)` | `toNumber` | 将字符串转换为数字，无法转换返回原值或 null |

### 图片处理

| 函数名 | 路径 | 说明 |
| --- | --- | --- |
| `arrayBufferToFile(buffer, name, format)` | `arrayBufferToFile` | 将 ArrayBuffer 转为临时文件路径 |
| `base64ToArrayBuffer(base64)` | `base64ToArrayBuffer` | 从 data URI 解析 base64 并转为 ArrayBuffer |
| `base64ToPath(base64, filename)` | `base64ToPath` | 将 base64 数据转为临时文件路径 |
| `pathToBase64(path)` | `pathToBase64` | 将文件路径转为 base64 data URI |
| `exif` | `exif` | 图片 EXIF 信息读取对象（不支持 uni-app x App） |
| `createImage(canvas)` | `createImage` | 创建用于 canvas 的 Image 对象 |

### Canvas

| 函数名 | 路径 | 说明 |
| --- | --- | --- |
| `canIUseCanvas2d()` | `canIUseCanvas2d` | 判断当前环境是否支持 canvas 2d |
| `createCanvas(canvasId, component)` | `createCanvas` | 创建 canvas 上下文 |
| `createCanvasContextAsync(canvasId, component)` | `createCanvasContextAsync` | 异步创建 canvas 上下文，返回统一接口 |

### 页面与 DOM

| 函数名 | 路径 | 说明 |
| --- | --- | --- |
| `getCurrentPage()` | `getCurrentPage` | 返回当前页面实例 |
| `getRect(selector, context, node)` | `getRect` | 获取单个节点位置尺寸信息 |
| `getAllRect(selector, context, node)` | `getRect` | 获取所有匹配节点位置尺寸信息 |
| `getViewportScrollInfo()` | `getRect` | 获取视口滚动条位置信息 |
| `getScrollIntoViewValue(...)` | `getRect` | 计算元素滚动到可视区域的目标位置 |
| `getDeviceInfo()` | `getDeviceInfo` | 获取设备信息 |
| `getWindowInfo()` | `getWindowInfo` | 获取窗口信息 |
| `selectComponent(selector)` | `selectComponent` | 链式查询器，查找组件实例 |
| `selectAllComponent(selector, options)` | `selectAllComponent` | 批量选择组件 |
| `selectElement(selector)` | `selectElement` | 链式 DOM 查询器（uni-app x 专用） |
| `findClosestElementWithStyle(el, prop)` | `dom` | 向上查找具有指定 style 的祖先元素 |

### 动画与延时

| 函数名 | 路径 | 说明 |
| --- | --- | --- |
| `sleep(delay=300)` | `sleep` | 延时指定毫秒后 resolve 的 Promise |
| `raf(fn)` | `raf` | 请求动画帧 |
| `cancelRaf(id)` | `raf` | 取消动画帧 |
| `doubleRaf(fn)` | `raf` | 双倍动画帧 |
| `createAnimation(options)` | `createAnimation` | 创建动画对象（NVUE 链式调用） |
| `Timeline` | `animation` | 动画时间轴类 |
| `Animation` | `animation` | 单个动画对象类 |
| `useTransition(source, options)` | `animation/useTransition` | 数值过渡动画 composable |

### 数学与数字

| 函数名 | 路径 | 说明 |
| --- | --- | --- |
| `clamp(val, min, max)` | `clamp` | 将值限制在范围内 |
| `closest(arr, target)` | `closest` | 在数组中找到最接近目标数字的元素 |
| `floatAdd(num1, num2)` | `floatAdd` | 浮点数加法（精度修复） |
| `floatDiv(num1, num2)` | `floatDiv` | 浮点数除法（精度修复） |
| `floatMul(num1, num2)` | `floatMul` | 浮点数乘法（精度修复） |
| `floatSub(num1, num2)` | `floatSub` | 浮点数减法（精度修复） |
| `random(min, max, fixed=0)` | `random` | 生成指定范围内的随机数 |
| `range(start, end, step=1, fromRight=false)` | `range` | 生成数字范围数组 |

### 字符串与数组

| 函数名 | 路径 | 说明 |
| --- | --- | --- |
| `addSeparator(num, separator=',', digit=3)` | `addSeparator` | 每隔 n 位数字添加分隔符 |
| `arrayEqual(arr1, arr2)` | `arrayEqual` | 浅比较两个数组是否相等 |
| `assignAtIndex(arr, index, value)` | `assignAtIndex` | 安全在数组指定索引赋值 |
| `camelCase(str, isPascalCase=false)` | `camelCase` | 转换为 camelCase 或 PascalCase |
| `characterLimit(type, char, max)` | `characterLimit` | 按字符/字节计算长度并截断 |
| `fillArray(length, value)` | `fillArray` | 生成指定长度并用指定值填充的数组 |
| `fillZero(number, length=2)` | `fillZero` | 在数字前补零至指定长度 |
| `findLastIndex(array, predicate)` | `findLastIndex` | 兼容版 findLastIndex polyfill |
| `kebabCase(str, separator='-')` | `kebabCase` | 转换为指定连接符命名 |
| `shuffle(arr)` | `shuffle` | Fisher-Yates 算法随机打乱数组 |
| `toArray(item)` | `toArray` | 将单个元素包装为数组 |
| `toBoolean(value)` | `toBoolean` | 将值转为布尔 |

### 对象工具

| 函数名 | 路径 | 说明 |
| --- | --- | --- |
| `cloneDeep(obj)` | `cloneDeep` | 深度克隆对象/数组 |
| `coalesce(...values)` | `coalesce` | 返回第一个非空值（保留 0/false） |
| `hasOwn(obj, key)` | `hasOwn` | 检查对象是否具有指定属性 |
| `merge(obj, defaults)` | `merge` | 深度合并，用 defaults 填充 obj 的空值 |

### BEM 命名与样式

| 函数名 | 路径 | 说明 |
| --- | --- | --- |
| `createBem` | `bem` | 默认配置 BEM 工厂函数（namespace=`l`） |
| `createBemStruct(config)` | `bem` | 自定义配置 BEM 工厂函数 |
| `Bem` | `bem` | BEM 类生成器类 |
| `classNames(...args)` | `classNames` | 拼接类名字符串，自动过滤空值 |
| `parseStyle(css)` | `parseStyle` | 将 CSS 字符串转为样式对象 |
| `stringifyStyle(...args)` | `stringifyStyle` | 拼接样式字符串，自动过滤空值 |
| `toCssVars(obj, prefix='--l-')` | `stringifyStyle` | 将对象转换为 CSS 自定义属性字符串 |

### 平台与杂项

| 函数名 | 路径 | 说明 |
| --- | --- | --- |
| `getLocalFilePath(path)` | `getLocalFilePath` | 将路径转换为本地绝对路径 |
| `getPlatform()` | `platform` | 返回当前平台的根对象（wx/my/uni 等） |
| `obj2url(data, isPrefix=false)` | `obj2url` | 将对象转换为 URL 查询字符串 |
| `guid(len=32)` | `guid` | 生成指定长度的伪随机字符串 |
| `uniqid(prefix='lime')` | `uniqid` | 生成带前缀的唯一 ID |
| `isBrowser` | `isBrowser` | 是否为 Web 环境常量 |
| `vue` | `vue` | Vue API 重导出（VUE3/VUE2 兼容） |

### 省市区数据

| 函数名 | 路径 | 说明 |
| --- | --- | --- |
| `areaList` | `areaData` | 中国省市区原始数据（province/city/county） |
| `useCascaderAreaData()` | `areaData` | 转换为级联选择器树形结构 |

### 节流防抖

| 函数名 | 路径 | 说明 |
| --- | --- | --- |
| `debounce(fn, wait=300)` | `debounce` | 防抖函数 |
| `throttle(func, wait, options)` | `throttle` | 节流函数（支持 leading/trailing） |

## Vue2 使用说明

插件在 Vue2 项目中通过 `@vue/composition-api` 提供 `computed`、`ref`、`watch` 等组合式 API 能力，需按以下方式配置。

关键配置代码（在 main.js 中添加）：

```js
// vue2
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)
```

## 快速预览

本插件为函数库，不提供可视化演示组件。可直接在任意 uni-app 项目中按需引入函数进行使用。

## 插件标签说明

| 标签类型 | 示例 | 说明 |
|---------|------|------|
| 函数库 | `import { ... } from '@/uni_modules/lime-shared/...'` | 仅通过 import 方式按需引入，无组件标签 |

## 文档链接

📚 函数库详细文档请访问以下站点：
- [常用函数库文档 - 站点1](https://limex.qcoon.cn/uts/shared.html)
- [常用函数库文档 - 站点2](https://limeui.netlify.app/uts/shared.html)
- [常用函数库文档 - 站点3](https://limeui.familyzone.top/uts/shared.html)

## 注意事项

1. 本插件为函数库，所有函数均按需引入，无需全局注册
2. `exif` 图片信息读取不支持 uni-app x App 环境
3. `createAnimation` 在 uni-app x（uvue）环境下请使用 `lime-animateIt` 插件
4. `getLocalFilePath` 在 uni-app x（uvue）环境下重新导出为 `getResourcePath`（来自 `lime-file-utils`）
5. 部分函数在不同平台有不同实现，但导出名称与签名保持一致，无需关心平台差异

## 支持与赞赏

如果你觉得本插件解决了你的问题，可以考虑支持作者：

| 支付宝赞助 | 微信赞助 |
|------------|------------|
| ![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/alipay.png) | ![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/wpay.png) |
