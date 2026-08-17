import { isNumber } from '../isNumber'
/**
 * 返回两个浮点数相加的结果
 * @param num1 第一个浮点数
 * @param num2 第二个浮点数
 * @returns 两个浮点数的相加结果
 */
export function floatAdd(num1 : number, num2 : number) : number {
	// 检查 num1 和 num2 是否为数字类型
	if (!isNumber(num1) || !isNumber(num2)) {
		console.warn('Please pass in the number type');
		return NaN;
	}

	const getDecimalLen = (n: number):number => {
		const arr = n.toString().split('.')
		if(arr.length > 0) return arr[1].length
		return 0
	};
	const r1 = getDecimalLen(num1);
	const r2 = getDecimalLen(num2);
	
	// 计算需要扩大的倍数
	const m = Math.pow(10, Math.max(r1, r2));
	// 返回相加结果
	return Math.round((num1 * m + num2 * m)) / m;
}