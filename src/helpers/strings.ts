export const toTitleCase = (str: string): string =>
  str.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))
