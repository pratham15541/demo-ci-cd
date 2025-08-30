// create-test-files.js
const fs = require('fs');
const path = require('path');

function createTestFiles(input, folder = 'tests') {
  let filesJson;
  const createdFiles = []; // Track created/updated file paths

  // If input is a string, parse it
  if (typeof input === 'string') {
    // Remove ```json and ``` wrapping
    input = input.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();

    try {
      filesJson = JSON.parse(input);
    } catch (err) {
      console.error('Failed to parse JSON:', err);
      return [];
    }
  } else if (typeof input === 'object') {
    filesJson = input;
  } else {
    console.error('Input must be a JSON string or object');
    return [];
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
      createdFiles.push(filePath); // Add to array
    } catch (err) {
      console.error(`Failed to write file ${filePath}:`, err);
    }
  }

  return createdFiles; // Return array of created/updated file paths
}

module.exports = { createTestFiles };