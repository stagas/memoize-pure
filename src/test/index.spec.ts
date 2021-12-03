import { memoize, memoizeDebug } from '../'

describe('memoize', () => {
  it('memoize a function', () => {
    let called = 0
    const fn = memoize((a: number, b: number, c: number) => {
      called++
      return a + b + c
    })
    expect(called).toEqual(0)
    expect(fn(1, 2, 3)).toEqual(6)
    expect(called).toEqual(1)
    expect(fn(1, 2, 3)).toEqual(6)
    expect(called).toEqual(1)
    expect(fn(1, 2, 4)).toEqual(7)
    expect(called).toEqual(2)
    expect(fn(1, 2, 4)).toEqual(7)
    expect(called).toEqual(2)
  })

  it('works with strings', () => {
    let called = 0
    const fn = memoize((a: string, b: string, c: string) => {
      called++
      return a + b + c
    })
    expect(called).toEqual(0)
    expect(fn('1', '2', '3')).toEqual('123')
    expect(called).toEqual(1)
    expect(fn('1', '2', '3')).toEqual('123')
    expect(called).toEqual(1)
    expect(fn('1', '2', '4')).toEqual('124')
    expect(called).toEqual(2)
    expect(fn('1', '2', '4')).toEqual('124')
    expect(called).toEqual(2)
  })

  it('works with booleans', () => {
    let called = 0
    const fn = memoize((a: boolean, b: boolean, c: boolean) => {
      called++
      return '' + a + b + c
    })
    expect(called).toEqual(0)
    expect(fn(true, false, true)).toEqual('truefalsetrue')
    expect(called).toEqual(1)
    expect(fn(true, false, true)).toEqual('truefalsetrue')
    expect(called).toEqual(1)
    expect(fn(true, true, true)).toEqual('truetruetrue')
    expect(called).toEqual(2)
    expect(fn(true, true, true)).toEqual('truetruetrue')
    expect(called).toEqual(2)
  })

  it('works without args', () => {
    let called = 0
    const fn = memoize(() => {
      called++
      return 'hello'
    })
    expect(called).toEqual(0)
    expect(fn()).toEqual('hello')
    expect(called).toEqual(1)
    expect(fn()).toEqual('hello')
    expect(called).toEqual(1)
  })

  it('works with mixed args', () => {
    let called = 0
    const fn = memoize((a: number, b: string, c: boolean) => {
      called++
      return '' + a + b + c
    })
    expect(called).toEqual(0)
    expect(fn(1, '2', true)).toEqual('12true')
    expect(called).toEqual(1)
    expect(fn(1, '2', true)).toEqual('12true')
    expect(called).toEqual(1)
    expect(fn(2, '2', true)).toEqual('22true')
    expect(called).toEqual(2)
    expect(fn(2, '2', true)).toEqual('22true')
    expect(called).toEqual(2)
  })

  it('pass a memory table', () => {
    let called = 0
    const mem = { '1,2,3': 'from memory' }
    const fn = memoize((a: number, b: number, c: number) => {
      called++
      return a + b + c
    }, mem)
    expect(called).toEqual(0)
    expect(fn(1, 2, 3)).toEqual('from memory')
    expect(called).toEqual(0)
    expect(fn(1, 2, 3)).toEqual('from memory')
    expect(called).toEqual(0)
    expect(fn(1, 2, 4)).toEqual(7)
    expect(called).toEqual(1)
    expect(fn(1, 2, 4)).toEqual(7)
    expect(called).toEqual(1)
  })
})

describe('memoizeDebug', () => {
  it('__memoizeMap__ is accessible for inspection', () => {
    let called = 0
    const fn = memoizeDebug((a: number, b: number, c: number) => {
      called++
      return a + b + c
    })
    expect(called).toEqual(0)
    expect(fn(1, 2, 3)).toEqual(6)
    expect(called).toEqual(1)
    expect(fn(1, 2, 3)).toEqual(6)
    expect(called).toEqual(1)
    expect(fn(1, 2, 4)).toEqual(7)
    expect(called).toEqual(2)
    expect(fn(1, 2, 4)).toEqual(7)
    expect(called).toEqual(2)
    expect(fn.__memoizeMap__).toEqual({
      '1,2,3': 6,
      '1,2,4': 7,
    })
  })

  it('__memoizeCount__ is accessible for inspection', () => {
    let called = 0
    const fn = memoizeDebug((a: number, b: number, c: number) => {
      called++
      return a + b + c
    })
    expect(called).toEqual(0)
    expect(fn(1, 2, 3)).toEqual(6)
    expect(called).toEqual(1)
    expect(fn(1, 2, 3)).toEqual(6)
    expect(called).toEqual(1)
    expect(fn(1, 2, 4)).toEqual(7)
    expect(called).toEqual(2)
    expect(fn(1, 2, 4)).toEqual(7)
    expect(called).toEqual(2)
    expect(fn.__memoizeTimesCalled__).toEqual(2)
  })

  it('accepts threshold and gives warning', () => {
    let called = 0
    const fn = memoizeDebug(
      (a: number, b: number, c: number) => {
        called++
        return a + b + c
      },
      {},
      2
    )
    const spy = jest.spyOn(console, 'warn')
    expect(called).toEqual(0)
    expect(fn(1, 2, 3)).toEqual(6)
    expect(called).toEqual(1)
    expect(fn(1, 2, 3)).toEqual(6)
    expect(spy).not.toHaveBeenCalled()
    expect(called).toEqual(1)
    expect(fn(1, 2, 4)).toEqual(7)
    expect(called).toEqual(2)
    expect(spy).toHaveBeenCalledTimes(3)
    expect(fn(1, 2, 5)).toEqual(8)
    expect(called).toEqual(3)
    expect(spy).toHaveBeenCalledTimes(3)
  })
})
