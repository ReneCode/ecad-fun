export function wait(ms = 200) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}
