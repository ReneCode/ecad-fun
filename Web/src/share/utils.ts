import { FractionIndex } from "./FractionIndex";
import { ObjectType } from "./types";

export const splitParentProperty = (propValue: string) => {
  const [parentId, fIndex] = propValue.split("-");
  if (!parentId) {
    throw new Error(`splitParentProperty: bad propValue: ${propValue}`);
  }
  return [parentId, fIndex];
};

export const combineParentProperty = (parentId: string, fIndex: string) => {
  if (!parentId || !fIndex) {
    throw new Error(
      `setParentProperty: bad parts: parentId: ${parentId} fIndex: ${fIndex}`
    );
  }
  const propValue = `${parentId}-${fIndex}`;
  return propValue;
};

export const appendToArray = (
  children: readonly ObjectType[] | undefined,
  obj: ObjectType
): { arr: readonly ObjectType[]; fIndex: string } => {
  if (!children || children.length === 0) {
    const nextFIndex = FractionIndex.after("");
    return { arr: [obj], fIndex: nextFIndex };
  }

  const lastChild = children[children.length - 1];
  const [_, fidx] = splitParentProperty(lastChild._parent as string);
  const nextFIndex = FractionIndex.after(fidx);
  return { arr: [...children, obj], fIndex: nextFIndex };
};

export const mergeIntoArray = (
  children: readonly ObjectType[] | undefined,
  obj: ObjectType,
  fIndex: string
): { arr: readonly ObjectType[]; fIndex: string } => {
  if (!children) {
    return { arr: [obj], fIndex };
  }

  // search where to insert me as a addition child
  const idx = children.findIndex((c) => {
    const [_, fidx] = splitParentProperty(c._parent as string);
    return fIndex <= fidx;
  });
  if (idx < 0) {
    // all children have lower fIndex
    return { arr: [...children, obj], fIndex };
  }

  const child = children[idx];
  const [_, childfIndex] = splitParentProperty(child._parent as string);

  if (childfIndex === fIndex) {
    // oops - fIndex allread used
    // apppend after the found child
    let newfIndex = "";
    if (idx + 1 === children.length) {
      // append to the end
      newfIndex = FractionIndex.after(childfIndex);
      return { arr: [...children, obj], fIndex: newfIndex };
    } else {
      // in the middle
      const nextChild = children[idx + 1];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [__, nextChildfIndex] = splitParentProperty(
        nextChild._parent as string
      );
      newfIndex = FractionIndex.between(fIndex, nextChildfIndex);
      return {
        arr: [...children.slice(0, idx + 1), obj, ...children.slice(idx + 1)],
        fIndex: newfIndex,
      };
    }
  } else {
    return {
      arr: [...children.slice(0, idx), obj, ...children.slice(idx)],
      fIndex,
    };
  }
};

export const makeArray = (o: any): any[] => {
  if (!Array.isArray(o)) {
    if (!o) {
      return [];
    }
    return [o];
  } else {
    return o;
  }
};
