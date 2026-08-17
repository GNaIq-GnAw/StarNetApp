// @ts-nocheck

// #ifdef UNI-APP-X && APP
// export * from './uvue.uts'
export { debounce } from './uvue'
// #endif

// #ifndef UNI-APP-X && APP
// export * from './vue.ts'
export { debounce } from './vue'
// #endif