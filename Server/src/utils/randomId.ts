import { nanoid } from "nanoid";

let lastId = 0;

export const resetRandomId = () => {
  lastId = 0;
};

export const randomId = () => {
  if (process.env.NODE_ENV === "test") {
    return `id${++lastId}`;
  } else {
    return nanoid();
  }
};
