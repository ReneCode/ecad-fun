import {
  findexStart,
  findexBetween,
  findexAfter,
  findexBefore,
} from "../src/findex";

describe("findex", () => {
  it("start", () => {
    expect(findexStart()).toEqual("5");
  });

  it("findexBefore", () => {
    expect(findexBefore("7")).toEqual("6");
    expect(findexBefore("2")).toEqual("1");
    expect(findexBefore("1")).toEqual("09");
    expect(findexBefore("05")).toEqual("04");
    expect(findexBefore("0001")).toEqual("00009");
    expect(findexBefore("2432")).toEqual("2431");
    expect(() => findexBefore("10")).toThrow();
  });

  it("findexAfter", () => {
    expect(findexAfter("3")).toEqual("4");
    expect(findexAfter("8")).toEqual("9");
    expect(findexAfter("9")).toEqual("91");
    expect(findexAfter("543")).toEqual("544");
    expect(findexAfter("")).toEqual("1");
  });

  it("findexBetween same numbers", () => {
    expect(() => findexBetween("3", "3")).toThrow();
  });

  it("findexBetween same length", () => {
    expect(findexBetween("3", "5")).toEqual("4");
    expect(findexBetween("3", "7")).toEqual("5");
    expect(findexBetween("3", "4")).toEqual("35");
    expect(findexBetween("3456", "3488")).toEqual("346");
    expect(findexBetween("123", "154")).toEqual("13");
    expect(findexBetween("123", "134")).toEqual("124");
    expect(findexBetween("128", "134")).toEqual("129");
    expect(findexBetween("129", "134")).toEqual("1295");
  });

  it("findexBetween l1 < l2", () => {
    expect(findexBetween("5", "505")).toEqual("502");
    expect(findexBetween("5", "5001")).toEqual("50005");
    expect(findexBetween("1", "35")).toEqual("2");
    expect(findexBetween("4", "83")).toEqual("6");
    expect(findexBetween("0", "1")).toEqual("05");
    expect(findexBetween("5", "55")).toEqual("52");
    expect(findexBetween("5", "52")).toEqual("51");
    expect(findexBetween("5", "51")).toEqual("505");
    expect(findexBetween("38", "5")).toEqual("4");
    expect(findexBetween("38", "7")).toEqual("5");
    expect(findexBetween("458", "47")).toEqual("46");
    expect(findexBetween("458", "46")).toEqual("459");
    expect(findexBetween("459", "46")).toEqual("4595");
  });

  it("findexBetween l1 > l2", () => {
    expect(findexBetween("12", "3")).toEqual("2");
    expect(findexBetween("13", "2")).toEqual("14");
    expect(findexBetween("19", "2")).toEqual("195");
    expect(findexBetween("412", "43")).toEqual("42");
    expect(findexBetween("412", "42")).toEqual("413");
    expect(findexBetween("418", "42")).toEqual("419");
    expect(findexBetween("419", "42")).toEqual("4195");
  });
});
