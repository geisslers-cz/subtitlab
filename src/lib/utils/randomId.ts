export const randomId =
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID.bind(crypto)
    : () => `${Date.now().toString(16)}-${Math.trunc(Math.random() * 1e12).toString(16)}`;
