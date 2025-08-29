const fs = require("fs");
const path = require("path");

function createTestFiles(input, folder = "tests") {
  let filesJson;

  // If input is a string, parse it
  if (typeof input === "string") {
    // Remove ```json and ``` wrapping
    input = input
      .replace(/^```json\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    try {
      filesJson = JSON.parse(input);
    } catch (err) {
      console.error("Failed to parse JSON:", err);
      console.error("Input was:", input.substring(0, 200) + "...");
      return;
    }
  } else if (typeof input === "object") {
    filesJson = input;
  } else {
    console.error("Input must be a JSON string or object");
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
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`Created/Updated file: ${filePath}`);
    } catch (err) {
      console.error(`Failed to write file ${filePath}:`, err);
    }
  }
}

// Read the response from responseJson file
const responseContent = fs.readFileSync("tests/responseJson", "utf8");

// The response is a JSON string that contains markdown-wrapped JSON
// First, parse the outer JSON string
const actualResponse = JSON.parse(responseContent);

console.log("Processing response:", actualResponse);

// Now use the decoded response to create test files
createTestFiles(actualResponse);
