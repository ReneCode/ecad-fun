export const debounce = <T extends any[]>(
  fn: (...args: T) => void,
  timeout: number
) => {
  let handle = 0;
  const ret = (...args: T) => {
    clearTimeout(handle);
    const next = () => fn(...args);
    handle = window.setTimeout(next, timeout);
  };
  return ret;
};
