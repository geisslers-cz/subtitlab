export function* map<T, U>(src: Iterable<T>, cb: (value: T, index: number) => U): Iterable<U> {
  let idx = 0;

  for (const value of src) {
    yield cb(value, idx++);
  }
}

export function reduce<T, U>(
  src: Iterable<T>,
  cb: (prev: U, current: T, idx: number) => U,
  init: U,
): U {
  let idx = 0;

  for (const value of src) {
    init = cb(init, value, idx++);
  }

  return init;
}

export function* extract<T, K extends keyof T>(items: T[], key: K): Iterable<T[K]> {
  for (const item of items) {
    yield item[key];
  }
}

export function merge<T1, T2>(o1: T1, o2: T2): T1 & T2 {
  const o = Object.defineProperties({} as T1 & T2, Object.getOwnPropertyDescriptors(o1));
  return Object.defineProperties(o, Object.getOwnPropertyDescriptors(o2));
}
