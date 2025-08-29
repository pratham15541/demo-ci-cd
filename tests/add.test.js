const sum = require("../add.js");
const diff = require("../diff.js");
const testData = require("./testData.json");

describe("sum function tests from external JSON", () => {
  testData.forEach(({ a, b, expected }) => {
    test(`sum(${a}, ${b}) should return ${expected}`, () => {
      expect(sum(a, b)).toBe(expected);
    });
  });

  test("diff function should return the difference", () => {
    expect(diff(5,4)).toBe(1);
  });
});
