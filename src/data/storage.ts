
export function onClear(fn: clearFn): void {
  customClearFns.push(fn)
}

export function clearApp(): void {
  while (customClearFns.length) {
    const fn = customClearFns.pop()
    if (typeof fn === 'function') {
      fn()
    }
  }
}

const customClearFns: Array<clearFn> = []

interface clearFn {
  (): void;
}
