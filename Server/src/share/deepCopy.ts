export const deepCopy = (val: any): any => {
  const type = typeof val;
  if (val === null) {
    return null;
  } else if (
    type === "undefined" ||
    type === "number" ||
    type === "string" ||
    type === "boolean"
  ) {
    return val;
  } else if (type === "object") {
    if (val instanceof Array) {
      return val.map((x) => deepCopy(x));
    } else if (val instanceof Uint8Array) {
      return new Uint8Array(val);
    } else {
      let o: any = {};
      for (const key in val) {
        o[key] = deepCopy(val[key]);
      }
      return o;
    }
  }
  throw new Error("unknown");
};

// export function deepCopy(obj: any): any {
//   let copy;

//   // Handle the 3 simple types, and null or undefined
//   if (null == obj || "object" != typeof obj) return obj;

//   // Handle Date
//   if (obj instanceof Date) {
//     copy = new Date();
//     copy.setTime(obj.getTime());
//     return copy;
//   }

//   // Handle Array
//   if (obj instanceof Array) {
//     copy = [];
//     for (var i = 0, len = obj.length; i < len; i++) {
//       copy[i] = deepCopy(obj[i]);
//     }
//     return copy;
//   }

//   // Handle Object
//   if (obj instanceof Object) {
//     copy = {};
//     for (let attr in obj) {
//       if (obj.hasOwnProperty(attr)) {
//         copy[attr] = deepCopy(obj[attr]);
//       }
//     }
//     return copy;
//   }

//   throw new Error("Unable to copy obj! Its type isn't supported.");
// }
