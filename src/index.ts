/**
 * Memoize a function.
 *
 * ```ts
 * const fn = memoize((a, b, c) => some_expensive_calls(a, b, c))
 * ...
 * const result = fn(1, 2, 3) // => calls the inner function and saves arguments signature "1,2,3"
 * ...
 * const result = fn(1, 2, 3) // => returns the memoized result immediately since "1,2,3" matches memory
 * ```
 *
 * @param fn The function to memoize
 * @param map A map object to use as memory
 * @returns The memoized function
 */
export const memoize = <T>(
  fn: T & { apply(context: unknown, args: unknown[]): unknown },
  map = Object.create(null)
) => {
  const wrapped = function (this: unknown, ...args: unknown[]) {
    const serialized = args.join()
    return map[serialized] ?? (map[serialized] = fn.apply(this, args))
  }

  return wrapped as unknown as T
}

export default memoize

/**
 * Debug memoize a function.
 *
 * ```ts
 * const fn = memoizeDebug((a, b, c) => some_expensive_calls(a, b, c))
 * ...
 * const result = fn(1, 2, 3) // => calls the inner function and saves arguments signature "1,2,3"
 * ...
 * const result = fn(1, 2, 3) // => returns the memoized result immediately since "1,2,3" matches memory
 * fn.__memoizeTimesCalled__ // => 1
 * fn.__memoizeMap__ // => { '1,2,3': 'some result' }
 * ```
 *
 * @param fn The function to memoize
 * @returns The memoized function including two properties:
 *  - `__memoizeMap__` is the memory map of arguments and results
 *  - `__memoizeTimesCalled__` is the count that the wrapped function has been called
 */
export const memoizeDebug = <T>(
  fn: T & { apply(context: unknown, args: unknown[]): unknown },
  map = Object.create(null),
  threshold = Infinity
) => {
  let count = 0

  const wrapped = function (this: unknown, ...args: unknown[]) {
    const serialized = args.join()
    if (serialized in map) {
      return map[serialized]
    } else {
      if (++count === threshold) {
        console.warn(
          'Memoization for function reached threshold number of calls: ' + count
        )
        console.warn(fn.toString())
        console.warn(fn)
      }
      const result = fn.apply(this, args)
      map[serialized] = result
      return result
    }
  }

  Object.defineProperty(wrapped, '__memoizeMap__', {
    value: map,
    enumerable: false,
  })

  Object.defineProperty(wrapped, '__memoizeTimesCalled__', {
    get() {
      return count
    },
    enumerable: false,
  })

  return wrapped as unknown as T & {
    __memoizeMap__: Record<string, unknown>
    __memoizeTimesCalled__: number
  }
}
