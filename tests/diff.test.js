const diff = require('../diff');
const testCases = require('./diff.testCase.json');

describe('diff', () => {
  testCases.diff.forEach(testCase => {
    test(testCase.description, () => {
      expect(diff(...testCase.input)).toBe(testCase.expected);
    });
  });
});
