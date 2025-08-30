const fs = require('fs');

// Create a dummy Jest report for testing
const dummyJestReport = {
  "numTotalTests": 3,
  "numPassedTests": 2,
  "numFailedTests": 1,
  "numTotalTestSuites": 2,
  "testResults": [
    {
      "name": "tests/example.test.js",
      "status": "passed",
      "startTime": 1693420800000,
      "endTime": 1693420801000,
      "assertionResults": [
        {
          "title": "should pass test 1",
          "status": "passed"
        },
        {
          "title": "should pass test 2", 
          "status": "passed"
        }
      ]
    },
    {
      "name": "tests/failing.test.js",
      "status": "failed",
      "startTime": 1693420801000,
      "endTime": 1693420802000,
      "assertionResults": [
        {
          "title": "should fail this test",
          "status": "failed",
          "failureMessages": [
            "Error: Expected true but got false",
            "    at Object.<anonymous> (tests/failing.test.js:5:23)"
          ]
        }
      ]
    }
  ]
};

// Create test-reports directory and dummy report
if (!fs.existsSync('test-reports')) {
  fs.mkdirSync('test-reports');
}

const reportPath = 'test-reports/jest-report-test.json';
fs.writeFileSync(reportPath, JSON.stringify(dummyJestReport, null, 2));

console.log('✅ Created dummy Jest report for testing:', reportPath);
console.log('📝 To test the transform script, run:');
console.log(`node transform-jest-report.js ${reportPath} skip abc123 https://github.com/test/repo TestUser test@example.com`);

// Test the transform function directly
try {
  const { transformJestReport } = require('./transform-jest-report.js');
  
  const options = {
    commit_id: 'test-commit-123',
    repo_url: 'https://github.com/test/repo',
    username: 'TestUser',
    email: 'test@example.com'
  };
  
  const payload = transformJestReport(reportPath, options);
  
  console.log('\n=== Transform Test Results ===');
  console.log('✅ Transform function works correctly');
  console.log('Payload keys:', Object.keys(payload));
  console.log('Total tests:', payload.total);
  console.log('Passed tests:', payload.passed);
  console.log('Failed tests:', payload.failed);
  console.log('Has stack trace:', payload.stack_trace.length > 0);
  console.log('Username:', payload.username);
  console.log('Commit ID:', payload.commit_id);
  console.log('Repo URL:', payload.repo_url);
  
} catch (error) {
  console.error('❌ Transform test failed:', error.message);
}
