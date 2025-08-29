// cleanJson.js
function cleanJson(rawJsonStr) {
  // Parse the raw JSON string
  let parsed;
  try {
    parsed = JSON.parse(rawJsonStr);
  } catch (err) {
    throw new Error('Invalid JSON string');
  }

  // If the structure has an "output" key, extract the inner JSON string
  if (parsed.output) {
    let innerJsonStr = parsed.output;

    // Remove leading "json\n" if present
    if (innerJsonStr.startsWith('json\n')) {
      innerJsonStr = innerJsonStr.slice(5);
    }

    // Parse the inner JSON
    try {
      parsed = JSON.parse(innerJsonStr);
    } catch (err) {
      throw new Error('Invalid inner JSON string');
    }
  }

  // Replace escaped carriage returns (\r) with empty and fix escaped line breaks
  for (const key in parsed) {
    if (typeof parsed[key] === 'string') {
      parsed[key] = parsed[key].replace(/\r/g, '');
    }
  }

  return parsed;
}

// Example usage:
const rawJsonStr = `{
    "output": "json\n{\n  \"tests/add.test.js\": \"const add = require('../add');\\r\\nconst testCases = require('./add.testCase.json');\\r\\n\\r\\ndescribe('add', () => {\\r\\n  testCases.add.forEach(testCase => {\\r\\n    test(testCase.description, () => {\\r\\n      expect(add(...testCase.input)).toBe(testCase.expected);\\r\\n    });\\r\\n  });\\r\\n});\\r\\n\",\n  \"tests/add.testCase.json\": \"{\\r\\n  \\\"add\\\": [\\r\\n    {\\\"input\\\": [1, 2], \\\"expected\\\": 3, \\\"description\\\": \\\"should correctly add two positive numbers\\\"},\\r\\n    {\\\"input\\\": [0, 0], \\\"expected\\\": 0, \\\"description\\\": \\\"should return zero when adding two zeros\\\"},\\r\\n    {\\\"input\\\": [-5, -3], \\\"expected\\\": -8, \\\"description\\\": \\\"should correctly add two negative numbers\\\"},\\r\\n    {\\\"input\\\": [\\\"1\\\", 2], \\\"expected\\\": 3, \\\"description\\\": \\\"should handle type coercion from string to number\\\"},\\r\\n    {\\\"input\\\": [1000000, 2000000], \\\"expected\\\": 3000000, \\\"description\\\": \\\"should correctly add large numbers\\\"}\\r\\n  ]\\r\\n}\",\n  \"tests/binary-search.test.js\": \"const binarySearch = require('../binary-search');\\r\\nconst testCases = require('./binary-search.testCase.json');\\r\\n\\r\\ndescribe('binarySearch', () => {\\r\\n  testCases.binarySearch.forEach(testCase => {\\r\\n    test(testCase.description, () => {\\r\\n      const [arr, target] = testCase.input;\\r\\n      expect(binarySearch(arr, target)).toBe(testCase.expected);\\r\\n    });\\r\\n  });\\r\\n});\\r\\n\",\n  \"tests/binary-search.testCase.json\": \"{\\r\\n  \\\"binarySearch\\\": [\\r\\n    {\\\"input\\\": [[1, 2, 3, 4, 5], 3], \\\"expected\\\": 2, \\\"description\\\": \\\"should find the target in the middle of the array\\\"},\\r\\n    {\\\"input\\\": [[10, 20, 30, 40], 10], \\\"expected\\\": 0, \\\"description\\\": \\\"should find the target at the beginning of the array\\\"},\\r\\n    {\\\"input\\\": [[10, 20, 30, 40], 40], \\\"expected\\\": 3, \\\"description\\\": \\\"should find the target at the end of the array\\\"},\\r\\n    {\\\"input\\\": [[1, 3, 5, 7, 9], 4], \\\"expected\\\": -1, \\\"description\\\": \\\"should return -1 if the target is not found\\\"},\\r\\n    {\\\"input\\\": [[], 5], \\\"expected\\\": -1, \\\"description\\\": \\\"should return -1 for an empty array\\\"}\\r\\n  ]\\r\\n}\",\n  \"tests/diff.test.js\": \"const diff = require('../diff');\\r\\nconst testCases = require('./diff.testCase.json');\\r\\n\\r\\ndescribe('diff', () => {\\r\\n  testCases.diff.forEach(testCase => {\\r\\n    test(testCase.description, () => {\\r\\n      expect(diff(...testCase.input)).toBe(testCase.expected);\\r\\n    });\\r\\n  });\\r\\n});\\r\\n\",\n  \"tests/diff.testCase.json\": \"{\\r\\n  \\\"diff\\\": [\\r\\n    {\\\"input\\\": [7, 3], \\\"expected\\\": 4, \\\"description\\\": \\\"should correctly subtract two positive numbers\\\"},\\r\\n    {\\\"input\\\": [10, 0], \\\"expected\\\": 10, \\\"description\\\": \\\"should return the first number when subtracting zero\\\"},\\r\\n    {\\\"input\\\": [-5, -2], \\\"expected\\\": -3, \\\"description\\\": \\\"should correctly subtract negative numbers\\\"},\\r\\n    {\\\"input\\\": [3, 7], \\\"expected\\\": -4, \\\"description\\\": \\\"should return a negative result when subtracting a larger number from a smaller one\\\"},\\r\\n    {\\\"input\\\": [\\\"10\\\", 3], \\\"expected\\\": 7, \\\"description\\\": \\\"should handle type coercion from string to number\\\"}\\r\\n  ]\\r\\n}\"\n}\n"
}`;

const cleaned = cleanJson(rawJsonStr);
console.log(cleaned);
