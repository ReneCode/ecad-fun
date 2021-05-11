import { FractionIndex } from "../src/FractionIndex";

// it.each
// https://jestjs.io/docs/api#testeachtablename-fn-timeout

describe("FractionIndex", () => {
  it("start", () => {
    expect(FractionIndex.start()).toEqual("V");
  });

  it.each([
    ["7", "6"],
    ["2", "1"],
    ["1", "0z"],
    ["05", "04"],
    ["01", "00z"],
    ["1234", "1233"],
    ["abcdA", "abcd9"],
  ])("before(%s) => %s", (input, expected) => {
    expect(FractionIndex.before(input)).toEqual(expected);
  });

  it("before throws on '0'", () => {
    expect(() => FractionIndex.before("10")).toThrow();
  });

  it.each([
    ["3", "4"],
    ["8", "9"],
    ["Z", "a"],
    ["y", "z"],
    ["z", "z1"],
    ["543", "544"],
    ["", "1"],
  ])("after(%s) => %s", (input, expected) => {
    expect(FractionIndex.after(input)).toEqual(expected);
  });

  it("between throws on same numbers", () => {
    expect(() => FractionIndex.between("3", "3")).toThrow();
  });

  it.each([
    // same length
    ["3", "5", "4"],
    ["3", "7", "5"],
    ["3", "4", "3V"],
    ["3456", "3488", "346"],
    ["123", "154", "13"],
    ["123", "134", "124"],
    ["128", "134", "129"],
    ["12z", "134", "12zV"],
    // a.length < b.length
    ["5", "505", "502"],
    ["5", "5001", "5000V"],
    ["1", "35", "2"],
    ["4", "83", "6"],
    ["0", "1", "0V"],
    ["5", "55", "52"],
    ["5", "52", "51"],
    ["5", "51", "50V"],
    ["38", "5", "4"],
    ["38", "7", "5"],
    ["458", "47", "46"],
    ["458", "46", "459"],
    ["459", "46", "45A"],
    ["45A", "46", "45B"],
    ["45z", "46", "45zV"],
    // a.length > b.length
    ["12", "3", "2"],
    ["13", "2", "14"],
    ["1z", "2", "1zV"],
    ["412", "43", "42"],
    ["412", "42", "413"],
    ["418", "42", "419"],
    ["41z", "42", "41zV"],
  ])("between(%s, %s) => %s", (a, b, expected) => {
    expect(FractionIndex.between(a, b)).toEqual(expected);
  });
});
