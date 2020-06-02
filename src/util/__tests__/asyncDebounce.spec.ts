import asyncDebounce from '../asyncDebounce'

jest.useFakeTimers()

describe('asyncDebounce.spec', () => {
  test('resolves promise after debounce time', () => {
    const fn = jest.fn()
    const asyncFn = async () => fn()
    const asyncFnDeb = asyncDebounce(asyncFn, 100)
    asyncFnDeb()
    expect(fn).toHaveBeenCalledTimes(0)
    jest.advanceTimersByTime(110)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('resolves only the last promise', () => {
    const fn = jest.fn()
    const asyncFn = async (param: string) => fn(param)
    const asyncFnDeb = asyncDebounce(asyncFn, 100)
    asyncFnDeb('a')
    asyncFnDeb('b')
    asyncFnDeb('c')
    jest.advanceTimersByTime(110)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('c')
  })

  test('resolves all prev promises to the resolved promise', async () => {
    const fn = jest.fn((id: any) => id)
    const asyncFn = async (param: string) => fn(param)
    const asyncFnDeb = asyncDebounce(asyncFn, 100)
    const p1 = asyncFnDeb('a')
    const p2 = asyncFnDeb('b')
    const p3 = asyncFnDeb('c')
    jest.advanceTimersByTime(110)
    expect(await p1).toBe('c')
    expect(await p2).toBe('c')
    expect(await p3).toBe('c')
  })
})