const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const firstChar = alphabet[0];
const secondChar = alphabet[1];
const lastChar = alphabet[alphabet.length - 1];
const middle = alphabet[Math.floor(alphabet.length / 2)];

export class FractionIndex {
  static start = () => {
    return secondChar;
  };

  static after = (s: string) => {
    if (!s) {
      return secondChar;
    }

    const l = s.length;
    const c = s[l - 1];
    if (c !== lastChar) {
      // just take the next letter
      const x = alphabet.indexOf(c);
      return s.slice(0, l - 1) + alphabet[x + 1];
    } else {
      // add a addition letter at the end
      return s + secondChar;
    }
  };

  static before = (s: string) => {
    const l = s.length;

    const c = s[l - 1];
    if (c === firstChar) {
      throw new Error(`bad input: ${s}, ends with:${firstChar}`);
    }
    if (c !== secondChar) {
      // just take the previor letter
      // "5" => "4"
      const x = alphabet.indexOf(c);
      return s.slice(0, l - 1) + alphabet[x - 1];
    } else {
      // "1" => "05"
      return s.slice(0, l - 1) + firstChar + lastChar;
    }
  };

  static between = (s1: string, s2: string): string => {
    if (s1 === s2) {
      throw new Error("can't get findex between equal numbers:");
    }

    const l1 = s1.length;
    const l2 = s2.length;
    const minL = Math.min(l1, l2);
    for (let i = 0; i < minL; i++) {
      const c1 = s1[i];
      const c2 = s2[i];
      if (c1 === c2) {
        continue;
      } else {
        const x1 = alphabet.indexOf(c1);
        const x2 = alphabet.indexOf(c2);
        const delta = x2 - x1;
        if (delta > 1) {
          // just take the middle of the two letters
          // "4","6" => "5"
          const xNew = Math.floor(delta / 2);
          const cNew = alphabet[x1 + xNew];
          return s1.slice(0, i) + cNew;
        } else {
          if (i === l1 - 1) {
            // it is the last letter of s1
            // "7","8" => "75"
            return s1.slice(0, i + 1) + middle;
          } else {
            const nextC1 = s1[i + 1];
            if (nextC1 < lastChar) {
              const nextX1 = alphabet.indexOf(nextC1);
              return s1.slice(0, i + 1) + alphabet[nextX1 + 1];
            } else {
              return s1.slice(0, i + 2) + middle;
            }
          }
        }
      }
    }
    if (l1 < l2) {
      // "5", "502"
      let newL1 = l1;
      while (newL1 + 1 < l2) {
        s1 = s1 + firstChar;
        newL1++;
      }
      return s1 + FractionIndex.between("0", s2[newL1]);
    } else {
      throw new Error("bad situation");
    }
  };
}
