import ContextMenu from "../components/ContextMenu";
import { CUD_Create, ECadLineElement } from "../types";
import { registerAction } from "./registerAction";

export const actionMenu = registerAction({
  name: "menu",

  execute: ({ state, params }) => {
    console.log(state, params);
    ContextMenu.push({
      left: state.pointerX,
      top: state.pointerY,
      options: [{ label: "Home", onClick: () => {} }],
    });
  },
});
