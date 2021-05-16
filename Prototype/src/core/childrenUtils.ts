import { FractionIndex } from "./FractionIndex";

export const combineParentProperty = (parentId: string, fIndex: string) => {
  if (!parentId || !fIndex) {
    throw new Error(
      `combineParentProperty: bad parts: parentId: ${parentId} fIndex: ${fIndex}`
    );
  }
  return `${parentId}-${fIndex}`;
};

export const splitParentProperty = (propValue: string) => {
  const [parentId, fIndex] = propValue.split("-");
  if (!parentId) {
    throw new Error(`splitParentProperty: bad propValue: ${propValue}`);
  }
  return [parentId, fIndex];
};

/**
 * Insert the child into parent.children.
 *
 * If there is allready a child in parent.children with that fIndex
 * then the child will inserted **after** that existing child
 * @param parent parent.children will contain that child
 * @param child
 * @param fIndex fIndex where to insert the child into.
 * @returns fIndex, that may be different if there is allready a child with that given fIndex
 */
export const insertChildToParent = (
  parent: { children: { parent: string }[] },
  child: { parent: string },
  fIndex: string
): string => {
  if (parent.children.length === 0) {
    parent.children.push(child);
    return fIndex;
  }

  const idx = parent.children.findIndex((n) => {
    const [_, fidx] = splitParentProperty(n.parent);
    return fIndex <= fidx;
  });
  if (idx < 0) {
    // all child have lower fIndex
    parent.children.push(child);
    return fIndex;
  }

  const foundChild = parent.children[idx];
  const [_, foundfIndex] = splitParentProperty(foundChild.parent);
  if (foundfIndex === fIndex) {
    // fIndex allready used
    // append after the found child - and fix fIndex to new value
    let newfIndex = "";
    if (idx + 1 === parent.children.length) {
      // append to the end
      newfIndex = FractionIndex.after(foundfIndex);
      parent.children.push(child);
      return newfIndex;
    } else {
      const nextChild = parent.children[idx + 1];
      const [_, nextChildfIndex] = splitParentProperty(nextChild.parent);
      newfIndex = FractionIndex.between(fIndex, nextChildfIndex);
      parent.children.splice(idx + 1, 0, child);
      return newfIndex;
    }
  } else {
    parent.children.splice(idx, 0, child);
    return fIndex;
  }
};

export const setChildToParent = (
  parent: { id: string; children: { parent: string }[] },
  child: { parent: string },
  fIndex: string
) => {
  if (parent.children.length === 0) {
    parent.children.push(child);
    return;
  }
  const idx = parent.children.findIndex((n) => {
    const [_, fidx] = splitParentProperty(n.parent);
    return fIndex <= fidx;
  });
  if (idx < 0) {
    // all child have lower fIndex
    parent.children.push(child);
    return;
  }

  const foundChild = parent.children[idx];
  const [_, foundfIndex] = splitParentProperty(foundChild.parent);
  if (foundfIndex === fIndex) {
    // fIndex allready used
    // give foundChild a new fIndex
    let newfIndex = "";
    if (idx + 1 === parent.children.length) {
      newfIndex = FractionIndex.after(foundfIndex);
    } else {
      const nextChild = parent.children[idx + 1];
      const [_, nextChildfIndex] = splitParentProperty(nextChild.parent);
      newfIndex = FractionIndex.between(fIndex, nextChildfIndex);
    }
    foundChild.parent = combineParentProperty(parent.id, newfIndex);
  }
  // insert before the found child
  parent.children.splice(idx, 0, child);
};
