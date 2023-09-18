// onClear pushes a function that will be executed one and only one time, when clearApp is called
export function onClear(fn: ClearFn): void {
  customClearFns.push(fn)
}

// clearApp executes any and all functions pushed using onClear since the last time clearApp was called
export function clearApp(): void {
  while (customClearFns.length) {
    const fn = customClearFns.pop()
    if (typeof fn === 'function') {
      fn()
    }
  }
}

const customClearFns: ClearFn[] = []

interface ClearFn {
  (): void
}
