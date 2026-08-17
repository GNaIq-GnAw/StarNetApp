// @ts-nocheck

// #ifdef APP-NVUE
// 当编译环境是 APP-NVUE 时，引入 uni.requireNativePlugin('dom')，具体插件用途未知
const dom = uni.requireNativePlugin('dom')
// #endif

/**
 * 获取节点信息
 * @param selector 选择器字符串
 * @param context ComponentInternalInstance 对象，传 null 时自动使用页面级查询
 * @param node 是否获取node
 * @returns 包含节点信息的 Promise 对象
 */
export function getRect(selector : string, context : ComponentInternalInstance|ComponentPublicInstance|null = null, node: boolean = false) {
	if(context != null) {
		if(context.context){
			context = context.context
		}
		// #ifdef MP || VUE2
		if (context.proxy) context = context.proxy
		// #endif
	}

	return new Promise<UniNamespace.NodeInfo>((resolve, reject) => {
		// #ifndef APP-NVUE
		let dom = context != null
			? uni.createSelectorQuery().in(context)
			: uni.createSelectorQuery();
		// #ifndef MP-TOUTIAO
		// #endif
		dom = dom.select(selector);
		const result = (rect: UniNamespace.NodeInfo) => {
			if (rect) {
				resolve(rect)
			} else {
				reject('no rect')
			}
		}

		if (!node) {
			dom.boundingClientRect(result).exec()
		} else {
			dom.fields({
				node: true,
				size: true,
				rect: true
			}, result).exec()
		}
		// #endif
		// #ifdef APP-NVUE
		if (context == null) {
			reject('context is null')
			return
		}
		const refs = context.refs || context.$refs
		if (/#|\./.test(selector) && refs) {
			selector = selector.replace(/#|\./, '')
			if (refs[selector]) {
				selector = refs[selector]
				if(Array.isArray(selector)) {
					selector = selector[0]
				}
			}
		}
		dom.getComponentRect(selector, (res) => {
			if (res.size) {
				resolve(res.size)
			} else {
				reject('no rect')
			}
		})
		// #endif
	});
};


export function getAllRect(selector : string, context: ComponentInternalInstance|ComponentPublicInstance|null = null, node:boolean = false) {
	if(context != null) {
		// #ifdef MP || VUE2
		if (context.proxy) context = context.proxy
		// #endif
	}
	return new Promise<UniNamespace.NodeInfo>((resolve, reject) => {
		// #ifndef APP-NVUE
		const dom = context != null
			? uni.createSelectorQuery().in(context).selectAll(selector)
			: uni.createSelectorQuery().selectAll(selector);
		const result = (rect: UniNamespace.NodeInfo[]) => {
			if (rect) {
				resolve(rect)
			} else {
				reject('no rect')
			}
		}
		if (!node) {
			dom.boundingClientRect(result).exec()
		} else {
			dom.fields({
				node: true,
				size: true,
				rect: true
			}, result).exec()
		}
		// #endif
		// #ifdef APP-NVUE
		if (context == null) {
			reject('context is null')
			return
		}
		let { context } = options
		if (/#|\./.test(selector) && context.refs) {
			selector = selector.replace(/#|\./, '')
			if (context.refs[selector]) {
				selector = context.refs[selector]
				if(Array.isArray(selector)) {
					selector = selector[0]
				}
			}
		}
		dom.getComponentRect(selector, (res) => {
			if (res.size) {
				resolve([res.size])
			} else {
				reject('no rect')
			}
		})
		// #endif
	});
};