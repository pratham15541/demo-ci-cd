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
      console.error('Input preview:', input.substring(0, 200) + '...');
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
    // Extract just the filename from the path
    const filePath = path.join(folder, path.basename(filename));

    try {
      // Check if the content is a JSON string that needs to be formatted
      let finalContent = content;
      
      if (filename.endsWith('.json') && typeof content === 'string') {
        try {
          // Try to parse and re-stringify for proper formatting
          const parsedContent = JSON.parse(content);
          finalContent = JSON.stringify(parsedContent, null, 2);
        } catch (parseError) {
          // If it fails to parse, use the content as-is
          console.log(`Content for ${filename} is not valid JSON, using as-is`);
        }
      }

      fs.writeFileSync(filePath, finalContent, 'utf8');
      console.log(`✅ Created/Updated file: ${filePath}`);
    } catch (err) {
      console.error(`❌ Failed to write file ${filePath}:`, err);
    }
  }
}

// Read the response from responseJson file
try {
  const responseContent = fs.readFileSync('tests/responseJson', 'utf8');
  
  // The response is a JSON string that contains markdown-wrapped JSON
  // First, parse the outer JSON string
  const actualResponse = JSON.parse(responseContent);
  
  console.log('🔄 Processing server response...');
  console.log(`📊 Found ${Object.keys(actualResponse).length} files to create`);
  
  // Now use the decoded response to create test files
  createTestFiles(actualResponse);
  
  console.log('🎉 All test files created successfully!');
  
} catch (error) {
  console.error('❌ Error processing response:', error.message);
  if (error.message.includes('ENOENT')) {
    console.error('❌ responseJson file not found in tests/ directory');
  }
}
