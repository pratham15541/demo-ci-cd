const addition = require('../addition');
const testCases = require('./addition.testCase.json');

describe('addition', () => {
  testCases.addition.forEach(testCase => {
    test(testCase.description, () => {
      // Note: According to the example's strict output format for 'NaN' (string), 
      // 'Infinity' is also represented as a string. 
      // This means tests for actual number NaN/Infinity results from 'a/b' will fail 
      // because 'NaN' (number) !== '"NaN"' (string) and 'Infinity' (number) !== '"Infinity"' (string).
      // For functional testing of number NaN/Infinity, expect().toBeNaN() or expect().toBe(Infinity) should be used.
      expect(addition(...testCase.input)).toBe(testCase.expected);
    });
  });
});
