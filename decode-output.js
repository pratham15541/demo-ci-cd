const fs = require('fs');
const path = require('path');

/**
 * Filters and parses messy JSON data into clean object
 * @param {string} messyJsonString - Raw string containing JSON data
 * @returns {Object} Parsed and cleaned JSON object
 */
function filterAndParseJSON(messyJsonString) {
  try {
    console.log('🧹 Cleaning and parsing JSON data...\n');
    
    // Remove JavaScript variable declaration and template literal markers
    let cleanedString = messyJsonString
      .replace(/const\s+\w+\s*=\s*{/, '{')           // Remove "const testFiles = {"
      .replace(/```json/g, '')                        // Remove ```json markers
      .replace(/```/g, '')                           // Remove ``` markers
      .replace(/};?\s*$/, '}')                       // Replace final }; with }
      .trim();
    
    // Find the JSON object boundaries
    const firstBrace = cleanedString.indexOf('{');
    const lastBrace = cleanedString.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanedString = cleanedString.slice(firstBrace, lastBrace + 1);
    }
    
    // Parse the JSON
    const parsedData = JSON.parse(cleanedString);
    
    console.log('✅ Successfully parsed JSON data');
    console.log(`📊 Found ${Object.keys(parsedData).length} files to create`);
    
    return parsedData;
    
  } catch (error) {
    console.error('❌ Error parsing JSON:', error.message);
    console.log('\n🔍 Debugging info:');
    console.log('Cleaned string preview:', cleanedString.substring(0, 200) + '...');
    return null;
  }
}

/**
 * Creates files and folders from JSON data
 * @param {Object} filesData - Object with file paths as keys and content as values
 * @param {string} baseDir - Base directory to create files in
 */
function createFiles(filesData, baseDir = './') {
  if (!filesData) {
    console.error('❌ No valid data to create files');
    return;
  }
  
  console.log('\n📁 Creating files and folders...\n');
  
  let created = 0;
  let updated = 0;
  
  Object.entries(filesData).forEach(([filePath, content]) => {
    const fullPath = path.resolve(baseDir, filePath);
    const dirPath = path.dirname(fullPath);
    
    // Check if file already exists
    const fileExists = fs.existsSync(fullPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Created folder: ${path.relative(baseDir, dirPath)}`);
    }
    
    // Write/rewrite the file
    fs.writeFileSync(fullPath, content, 'utf8');
    
    if (fileExists) {
      console.log(`✏️  Rewrote: ${filePath}`);
      updated++;
    } else {
      console.log(`✅ Created: ${filePath}`);
      created++;
    }
  });
  
  console.log(`\n📊 Summary: ${created} created, ${updated} updated\n`);
}

/**
 * Main function that filters JSON and creates files
 * @param {string} messyJsonString - Raw string containing JSON data
 * @param {string} baseDir - Base directory to create files in
 */
function processAndCreateFiles(messyJsonString, baseDir = './') {
  const cleanData = filterAndParseJSON(messyJsonString);
  if (cleanData) {
    createFiles(cleanData, baseDir);
  }
}







// Export functions
module.exports = {
  filterAndParseJSON,
  createFiles,
  processAndCreateFiles
};