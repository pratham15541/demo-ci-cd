const fs = require('fs');
const packageJsonPath = './package.json';
let packageJson = {};

if (fs.existsSync(packageJsonPath)) {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
} else {
  packageJson = { name: "auto-jest-project", version: "1.0.0" };
}

// Ensure scripts object exists
if (!packageJson.scripts) packageJson.scripts = {};

// Ensure "test" script runs Jest and saves JSON report
const desiredTestScript = "jest --json --outputFile=test-reports/jest-report.json";
if (!packageJson.scripts.test || packageJson.scripts.test !== desiredTestScript) {
  packageJson.scripts.test = desiredTestScript;
  console.log(`Updated 'test' script in package.json to: ${desiredTestScript}`);
}

// Save updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
