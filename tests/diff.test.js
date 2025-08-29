const diff = require('../diff');
const testCases = require('./diff.testCase.json');

describe('diff', () => {
  testCases.diff.forEach(testCase => {
    test(testCase.description, () => {
      // Note: The original 'diff' function performs multiplication. Tests reflect this behavior.
      // Also, following the example's expectation format for 'NaN' (string literal).
      expect(diff(...testCase.input)).toBe(testCase.expected);
    });
  });
});
