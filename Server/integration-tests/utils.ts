export const SOCKET_URL = "ws://localhost:8080";

export function wait(ms = 200) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

export async function waitUntilTrue(cb: () => boolean, count = 10, ms = 200) {
  return new Promise(async (resolve, reject) => {
    try {
      let ok = false;
      do {
        ok = cb();
        if (!ok) {
          await wait(ms);
        }
        count--;
      } while (count > 0 && ok == false);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
