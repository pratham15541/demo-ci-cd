const fs = require('fs');
const path = require('path');

/**
 * Write files from JSON string or object to the tests folder.
 * Strips Markdown-style ```json wrapping if present.
 * @param {string|Object} input - JSON string (possibly with backticks) or object
 * @param {string} folder - folder to create files in (default: 'tests')
 */
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
const pureJson = markdownJson.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
const markdownJson = "```json\n{\n  \"tests/diff.test.js\": \"console.log('test');\"\n}\n```";


createTestFiles(markdownJson);
