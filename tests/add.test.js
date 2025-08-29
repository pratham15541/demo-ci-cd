const add = require('../add');
const testCases = require('./add.testCase.json');

describe('add', () => {
  testCases.add.forEach(testCase => {
    test(testCase.description, () => {
      expect(add(...testCase.input)).toBe(testCase.expected);
    });
  });
});
