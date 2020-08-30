import nanoid from "nanoid";

let testRandomId = 0;

export const randomId = () => {
  if (process.env.NODE_ENV === "test") {
    return `id${testRandomId++}`;
  } else {
    return nanoid();
  }
};
