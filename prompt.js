function generatePrompt(fileTree) {
  return `Generate Jest unit tests for the provided JavaScript codebase.

*Requirements:*
- For each JavaScript/TypeScript file (.js, .ts, .tsx, .jsx) containing functions, create corresponding test files
- Use Jest testing framework exclusively
- Generate exactly 5 test cases per function covering: normal cases, edge cases, boundary conditions, invalid inputs, and expected failures
- Create separate JSON files for test case data

*Output Structure:*
For each function file (e.g., filename.js/.ts/.tsx/.jsx):
1. Create tests/filename.test.js - Jest unit test file
2. Create tests/filename.testCase.json - Test case data (5 cases per function)

*Test Case JSON Format:*
{
  "functionName": [
    {"input": [param1, param2], "expected": result, "description": "test description"},
    {"input": [param1, param2], "expected": result, "description": "test description"}
  ]
}

*Jest Test Format:*
- Use describe() blocks for each function
- Use test() or it() for individual test cases
- Import test cases from JSON files
- Include proper assertions with expect()

*CRITICAL OUTPUT FORMAT:*
Return ONLY a valid JSON object where:
- Keys are file paths (e.g., "tests/add.test.js")  
- Values are the actual file content as strings
- Use proper JSON escaping for newlines (\\n) and quotes (\\")
- NO extra text, explanations, or markdown - ONLY the JSON object

*Example Structure:*
{
  "tests/add.test.js": "const add = require('../add');\\nconst testCases = require('./add.testCase.json');\\n\\ndescribe('add', () => {\\n  testCases.add.forEach(testCase => {\\n    test(testCase.description, () => {\\n      expect(add(...testCase.input)).toBe(testCase.expected);\\n    });\\n  });\\n});",
  "tests/add.testCase.json": "{\\n  \\"add\\": [\\n    {\\"input\\": [2,3], \\"expected\\": 5, \\"description\\": \\"should correctly add two positive numbers\\"},\\n    {\\"input\\": [0,0], \\"expected\\": 0, \\"description\\": \\"should return 0 when adding two zeros\\"},\\n    {\\"input\\": [-1,-5], \\"expected\\": -6, \\"description\\": \\"should correctly add two negative numbers\\"},\\n    {\\"input\\": [1000000,2000000], \\"expected\\": 3000000, \\"description\\": \\"should correctly add large numbers\\"},\\n    {\\"input\\": [\\"a\\",2], \\"expected\\": \\"a2\\", \\"description\\": \\"should concatenate string and number due to type coercion\\"}\\n  ]\\n}"
}

*Codebase:*
${JSON.stringify(fileTree, null, 2)}`;
}

module.exports = generatePrompt;