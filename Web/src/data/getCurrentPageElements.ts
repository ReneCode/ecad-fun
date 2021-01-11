import { Project } from "../share";
import { AppState, ECadBaseElement } from "../types";

export const getCurrentPageElements = (project: Project, state: AppState) => {
  if (!state.currentPageId) {
    return [];
  }
  const pages = project.query({ q: [{ prop: "type", value: "page" }] });
  const page = pages.find((p) => p.id === state.currentPageId);
  if (!page) {
    return [];
  }
  return (page._children ? page._children : []) as ECadBaseElement[];
};
