const fs = require('fs');
const path = require('path');
function createTestFiles(input, folder = 'tests') {
  let filesJson;

  // If input is a string, parse it
  if (typeof input === 'string') {
    // Remove ```json and ``` wrapping
    input = input.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();

    try {
      filesJson = JSON.parse(input);
    } catch (err) {
      console.error('Failed to parse JSON:', err);
      return;
    }
  } else if (typeof input === 'object') {
    filesJson = input;
  } else {
    console.error('Input must be a JSON string or object');
    return;
  }

  // Ensure the folder exists
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`Created folder: ${folder}`);
  }

  // Create or overwrite files
  for (const [filename, content] of Object.entries(filesJson)) {
    const filePath = path.join(folder, path.basename(filename));

    try {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Created/Updated file: ${filePath}`);
    } catch (err) {
      console.error(`Failed to write file ${filePath}:`, err);
    }
  }
}

// Example usage with Markdown-wrapped JSON
const json = "```json\n{\n  \"tests/diff.test.js\": \"const diff = require('../diff');\\nconst testCases = require('./diff.testCase.json');\\n\\ndescribe('diff', () => {\\n  testCases.diff.forEach(testCase => {\\n    test(testCase.description, () => {\\n      expect(diff(...testCase.input)).toBe(testCase.expected);\\n    });\\n  });\\n});\\n\",\n  \"tests/diff.testCase.json\": \"{\\n  \\\"diff\\\": [\\n    {\\\"input\\\": [2,3], \\\"expected\\\": 6, \\\"description\\\": \\\"should correctly multiply two positive integers\\\"},\\n    {\\\"input\\\": [5,0], \\\"expected\\\": 0, \\\"description\\\": \\\"should return zero when one operand is zero\\\"},\\n    {\\\"input\\\": [-2,3], \\\"expected\\\": -6, \\\"description\\\": \\\"should correctly multiply a negative and a positive number\\\"},\\n    {\\\"input\\\": [1000000,2], \\\"expected\\\": 2000000, \\\"description\\\": \\\"should correctly multiply a large number by two\\\"},\\n    {\\\"input\\\": [\\\"a\\\",2], \\\"expected\\\": \\\"NaN\\\", \\\"description\\\": \\\"should return NaN when inputs are not numbers\\\"}\\n  ]\\n}\"\n}\n```"


createTestFiles(json);
