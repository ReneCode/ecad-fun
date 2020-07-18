import { namespaced } from "overmind/config";
import { createHook } from "overmind-react";

import { IConfig } from "overmind";
import { createOvermind } from "overmind";

import * as canvas from "./canvas";

export const config = namespaced({
  canvas,
});

declare module "overmind" {
  interface Config extends IConfig<typeof config> {}
}

export const overmind = createOvermind(config, {
  devtools: true,
});

export const { state, actions } = overmind;

export const useOvermind = createHook<typeof config>();
