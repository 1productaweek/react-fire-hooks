export default function asyncDebounce (promiseFn: (...params: any) => Promise<any>, delay: number) {
  let timer: NodeJS.Timeout|null = null
  let resolve = () => {}
  let reject = () => {}
  let promise: null|Promise<any> = null
  return (...params: any) => {
    if (timer) clearTimeout(timer)
    if (!promise) {
      promise = new Promise((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
      })
    }
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      promise = null
      promiseFn(...params)
        .then(resolve)
        .catch(reject)
    }, delay)
    return promise
  }
}
