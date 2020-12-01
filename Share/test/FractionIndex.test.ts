import { FractionIndex } from "../src/FractionIndex";

describe("findex", () => {
  it("start", () => {
    expect(FractionIndex.start()).toEqual("5");
  });

  it("FractionIndex.before", () => {
    expect(FractionIndex.before("7")).toEqual("6");
    expect(FractionIndex.before("2")).toEqual("1");
    expect(FractionIndex.before("1")).toEqual("09");
    expect(FractionIndex.before("05")).toEqual("04");
    expect(FractionIndex.before("0001")).toEqual("00009");
    expect(FractionIndex.before("2432")).toEqual("2431");
    expect(() => FractionIndex.before("10")).toThrow();
  });

  it("FractionIndex.after", () => {
    expect(FractionIndex.after("3")).toEqual("4");
    expect(FractionIndex.after("8")).toEqual("9");
    expect(FractionIndex.after("9")).toEqual("91");
    expect(FractionIndex.after("543")).toEqual("544");
    expect(FractionIndex.after("")).toEqual("1");
  });

  it("FractionIndex.between same numbers", () => {
    expect(() => FractionIndex.between("3", "3")).toThrow();
  });

  it("FractionIndex.between same length", () => {
    expect(FractionIndex.between("3", "5")).toEqual("4");
    expect(FractionIndex.between("3", "7")).toEqual("5");
    expect(FractionIndex.between("3", "4")).toEqual("35");
    expect(FractionIndex.between("3456", "3488")).toEqual("346");
    expect(FractionIndex.between("123", "154")).toEqual("13");
    expect(FractionIndex.between("123", "134")).toEqual("124");
    expect(FractionIndex.between("128", "134")).toEqual("129");
    expect(FractionIndex.between("129", "134")).toEqual("1295");
  });

  it("FractionIndex.between l1 < l2", () => {
    expect(FractionIndex.between("5", "505")).toEqual("502");
    expect(FractionIndex.between("5", "5001")).toEqual("50005");
    expect(FractionIndex.between("1", "35")).toEqual("2");
    expect(FractionIndex.between("4", "83")).toEqual("6");
    expect(FractionIndex.between("0", "1")).toEqual("05");
    expect(FractionIndex.between("5", "55")).toEqual("52");
    expect(FractionIndex.between("5", "52")).toEqual("51");
    expect(FractionIndex.between("5", "51")).toEqual("505");
    expect(FractionIndex.between("38", "5")).toEqual("4");
    expect(FractionIndex.between("38", "7")).toEqual("5");
    expect(FractionIndex.between("458", "47")).toEqual("46");
    expect(FractionIndex.between("458", "46")).toEqual("459");
    expect(FractionIndex.between("459", "46")).toEqual("4595");
  });

  it("FractionIndex.between l1 > l2", () => {
    expect(FractionIndex.between("12", "3")).toEqual("2");
    expect(FractionIndex.between("13", "2")).toEqual("14");
    expect(FractionIndex.between("19", "2")).toEqual("195");
    expect(FractionIndex.between("412", "43")).toEqual("42");
    expect(FractionIndex.between("412", "42")).toEqual("413");
    expect(FractionIndex.between("418", "42")).toEqual("419");
    expect(FractionIndex.between("419", "42")).toEqual("4195");
  });
});
