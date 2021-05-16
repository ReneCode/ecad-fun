const wait = async (ms: number = 1000) => {
  return new Promise((resolve: Function) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export { wait };
