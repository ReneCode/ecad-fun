import { Request } from "express";

export function wait(ms = 200) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), ms);
  });
}

// get the .sub(ject) property of the auth-token in the request
export const getUserIdFromRequest = (req: Request): string => {
  const { user } = req as any;
  if (!user) {
    throw new Error("no user property found in reqeust");
  }
  if (!user.sub) {
    throw new Error("no sub property found in reqeust.user");
  }
  return user.sub;
};
