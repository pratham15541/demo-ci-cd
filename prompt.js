function generatePrompt(fileTree) {
  return `Generate Jest unit tests for the provided JavaScript codebase.

**Requirements:**
- For each JavaScript/TypeScript file (.js, .ts, .tsx, .jsx) containing functions, create corresponding test files
- Use Jest testing framework exclusively
- Generate exactly 5 test cases per function covering: normal cases, edge cases, boundary conditions, invalid inputs, and expected failures
- Create separate JSON files for test case data

**Output Structure:**
For each function file (e.g., filename.js/.ts/.tsx/.jsx):
1. Create \`tests/filename.test.js\` - Jest unit test file
2. Create \`tests/filename.testCase.json\` - Test case data (5 cases per function)


**Test Case JSON Format:**
\`\`\`json
{
  "functionName": [
    {"input": [param1, param2], "expected": result, "description": "test description"},
    {"input": [param1, param2], "expected": result, "description": "test description"}
  ]
}
\`\`\`

**Jest Test Format:**
- Use describe() blocks for each function
- Use test() or it() for individual test cases
- Import test cases from JSON files
- Include proper assertions with expect()

**Output Format:**
Return a JSON object where keys are file paths and values are file contents. Include only the generated test files.

**Codebase:**
${JSON.stringify(fileTree, null, 2)}`;
}

module.exports = generatePrompt;