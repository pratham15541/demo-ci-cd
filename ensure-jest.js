const fs = require('fs');
const { execSync } = require('child_process');

const packageJsonPath = './package.json';
let packageJson = {};

if (fs.existsSync(packageJsonPath)) {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
} else {
  packageJson = { name: "auto-jest-project", version: "1.0.0" };
}

// Add test script if missing
if (!packageJson.scripts) packageJson.scripts = {};
if (!packageJson.scripts.test) {
  packageJson.scripts.test = "jest";
  console.log("Added 'test' script to package.json");
}

// Save updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Install jest if not installed
try {
  require.resolve('jest');
  console.log("Jest is already installed");
} catch {
  console.log("Installing jest...");
  execSync('npm install --save-dev jest', { stdio: 'inherit' });
}
