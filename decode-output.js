const fs = require('fs');
const path = require('path');

/**
 * Parses a JSON string containing file paths and content,
 * then creates the corresponding directories and files.
 *
 * @param {string} rawJsonString The raw JSON string, potentially wrapped in markdown code blocks.
 */
function createFilesFromJson(rawJsonString) {
  try {
    // 1. Clean the input string to extract the pure JSON object.
    const startIndex = rawJsonString.indexOf('{');
    const endIndex = rawJsonString.lastIndexOf('}');
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('Invalid JSON string: Could not find opening or closing brace.');
    }
    const cleanJsonString = rawJsonString.substring(startIndex, endIndex + 1);

    // 2. Parse the cleaned JSON string.
    const filesToCreate = JSON.parse(cleanJsonString);

    // 3. Check if the parsed object has an "output" wrapper and extract the actual files
    let actualFiles;
    if (filesToCreate.output) {
      // If there's an output wrapper, try to parse the nested JSON
      let outputContent = filesToCreate.output;
      
      // Remove "json\n" prefix if present
      outputContent = outputContent.replace(/^json\s*\n?/, '');
      
      // Remove trailing characters like \n" that might be present
      outputContent = outputContent.replace(/\n"$/, '');
      
      try {
        actualFiles = JSON.parse(outputContent);
      } catch (parseError) {
        console.error('❌ Failed to parse nested JSON in output field');
        console.error('❌ Output content:', outputContent.substring(0, 200) + '...');
        throw parseError;
      }
    } else {
      // If no output wrapper, use the object directly
      actualFiles = filesToCreate;
    }

    // 4. Remove duplicate entries (keep the last occurrence)
    const uniqueFiles = {};
    for (const filePath in actualFiles) {
      uniqueFiles[filePath] = actualFiles[filePath];
    }

    // 5. Iterate over the files object.
    for (const filePath in uniqueFiles) {
      if (Object.hasOwnProperty.call(uniqueFiles, filePath)) {
        const fileContent = uniqueFiles[filePath];

        // 5. Get the directory name from the file path.
        const dirName = path.dirname(filePath);

        // 6. Create the directory recursively if it doesn't exist.
        if (dirName && dirName !== '.' && !fs.existsSync(dirName)) {
          fs.mkdirSync(dirName, { recursive: true });
          console.log(`✅ Created directory: ${dirName}`);
        }

        // 7. Write the file with its content.
        fs.writeFileSync(filePath, fileContent);
        console.log(`📄 Created file: ${filePath}`);
      }
    }
    console.log('\n✨ All files and directories created successfully!');

  } catch (error) {
    console.error('❌ An error occurred:', error.message);
    console.error('❌ Full error:', error);
  }
}

// --- Fixed Example JSON ---
const fixedInputJson = `{
  "tests/add.test.js": "const add = require('../add.js');\\nconst testCases = require('./add.testCase.json');\\n\\ndescribe('add', () => {\\n  test.each(testCases.add)(\\n    'Function should %s',\\n    ({ input, expected, description }) => {\\n      expect(add(...input)).toBe(expected);\\n    }\\n  );\\n});",
  "tests/add.testCase.json": "{\\n  \\"add\\": [\\n    {\\n      \\"input\\": [2, 3],\\n      \\"expected\\": 5,\\n      \\"description\\": \\"correctly add two positive integers\\"\\n    },\\n    {\\n      \\"input\\": [0, -5],\\n      \\"expected\\": -5,\\n      \\"description\\": \\"correctly add zero and a negative integer\\"\\n    },\\n    {\\n      \\"input\\": [0.1, 0.2],\\n      \\"expected\\": 0.30000000000000004,\\n      \\"description\\": \\"handle floating point addition with JavaScript's precision\\"\\n    },\\n    {\\n      \\"input\\": [\\"Hello, \\", \\"World!\\"],\\n      \\"expected\\": \\"Hello, World!\\",\\n      \\"description\\": \\"concatenate strings when both inputs are strings\\"\\n    },\\n    {\\n      \\"input\\": [10, \\"5\\"],\\n      \\"expected\\": \\"105\\",\\n      \\"description\\": \\"concatenate a number and a string\\"\\n    }\\n  ]\\n}",
  "tests/diff.test.js": "const diff = require('../diff.js');\\nconst testCases = require('./diff.testCase.json');\\n\\ndescribe('diff', () => {\\n  test.each(testCases.diff)(\\n    'Function should %s',\\n    ({ input, expected, description }) => {\\n      if (Number.isNaN(expected)) {\\n        expect(Number.isNaN(diff(...input))).toBe(true);\\n      } else {\\n        expect(diff(...input)).toBe(expected);\\n      }\\n    }\\n  );\\n});",
  "tests/diff.testCase.json": "{\\n  \\"diff\\": [\\n    {\\n      \\"input\\": [10, 3],\\n      \\"expected\\": 7,\\n      \\"description\\": \\"correctly subtract two positive integers\\"\\n    },\\n    {\\n      \\"input\\": [3, 10],\\n      \\"expected\\": -7,\\n      \\"description\\": \\"return a negative result when the first number is smaller\\"\\n    },\\n    {\\n      \\"input\\": [5, 5],\\n      \\"expected\\": 0,\\n      \\"description\\": \\"return zero when numbers are equal\\"\\n    },\\n    {\\n      \\"input\\": [5.5, 2.3],\\n      \\"expected\\": 3.2,\\n      \\"description\\": \\"handle floating point subtraction\\"\\n    },\\n    {\\n      \\"input\\": [\\"abc\\", 5],\\n      \\"expected\\": \\"NaN\\",\\n      \\"description\\": \\"return NaN for non-numeric string input\\"\\n    }\\n  ]\\n}"
}`;

// Run the function with the corrected data.
createFilesFromJson(fixedInputJson);