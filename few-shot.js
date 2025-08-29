// Example AI output as a valid JS string
const aiOutput = `{
  "tests/add.test.js": "const add = require('../add');\\nconst testCases = require('./add.testCase.json');\\n\\ndescribe('add', () => {\\n  testCases.add.forEach(testCase => {\\n    test(testCase.description, () => {\\n      expect(add(...testCase.input)).toBe(testCase.expected);\\n    });\\n  });\\n});\\n",
  
  "tests/add.testCase.json": "{\\n  \\"add\\": [\\n    {\\"input\\": [2,3], \\"expected\\": 5, \\"description\\": \\"should correctly add two positive numbers\\"},\\n    {\\"input\\": [0,0], \\"expected\\": 0, \\"description\\": \\"should return 0 when adding two zeros\\"},\\n    {\\"input\\": [-1,-5], \\"expected\\": -6, \\"description\\": \\"should correctly add two negative numbers\\"},\\n    {\\"input\\": [1000000,2000000], \\"expected\\": 3000000, \\"description\\": \\"should correctly add large numbers\\"},\\n    {\\"input\\": [\\"a\\",2], \\"expected\\": \\"a2\\", \\"description\\": \\"should concatenate string and number due to type coercion\\"}\\n  ]\\n}",
  
  "tests/diff.test.js": "const diff = require('../diff');\\nconst testCases = require('./diff.testCase.json');\\n\\ndescribe('diff', () => {\\n  testCases.diff.forEach(testCase => {\\n    test(testCase.description, () => {\\n      expect(diff(...testCase.input)).toBe(testCase.expected);\\n    });\\n  });\\n});\\n",
  
  "tests/diff.testCase.json": "{\\n  \\"diff\\": [\\n    {\\"input\\": [5,2], \\"expected\\": 3, \\"description\\": \\"should correctly subtract two positive numbers\\"},\\n    {\\"input\\": [5,5], \\"expected\\": 0, \\"description\\": \\"should return 0 when subtracting identical numbers\\"},\\n    {\\"input\\": [2,5], \\"expected\\": -3, \\"description\\": \\"should return a negative result when second number is larger\\"},\\n    {\\"input\\": [-5,-2], \\"expected\\": -3, \\"description\\": \\"should correctly subtract negative numbers\\"},\\n    {\\"input\\": [\\"a\\",2], \\"expected\\": \\"NaN\\", \\"description\\": \\"should return NaN when inputs are not numbers\\"}\\n  ]\\n}"
}`;

const parsed = JSON.parse(aiOutput);

console.log(parsed);
/*
Output is a JS object like:
{
  "tests/add.test.js": "const add = require('../add');\nconst testCases = require('./add.testCase.json');\n ...",
  "tests/add.testCase.json": "{ \"add\": [ ... ] }",
  "tests/diff.test.js": "...",
  "tests/diff.testCase.json": "{ \"diff\": [ ... ] }"
}
*/
