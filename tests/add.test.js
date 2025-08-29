const sum = require('../add.js')
const testData = require('./testData.json');

describe('sum function tests from external JSON', () => {
  testData.forEach(({ a, b, expected }) => {
    test(`sum(${a}, ${b}) should return ${expected}`, () => {
      expect(sum(a, b)).toBe(expected);
    });
  });
});