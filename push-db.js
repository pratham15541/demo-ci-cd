const fs = require('fs');
const axios = require('axios');
const path = './test-report/test-report-2025-08-30T01-54-06.919Z.json'; // your Jest report file

// Read and parse Jest JSON report
const jestOutput = JSON.parse(fs.readFileSync(path, 'utf-8'));

// Summarize Jest results with all fields as strings
function summarizeJestResults(jestJson) {
  const total = jestJson.numTotalTests.toString();
  const passed = jestJson.numPassedTests.toString();
  const failed = jestJson.numFailedTests.toString();

  const failedArray = jestJson.testResults.flatMap(suite =>
    suite.assertionResults
      .filter(test => test.failing)
      .map(test => ({
        suite: suite.name,
        test: test.fullName,
        description: test.title,
        failureMessages: test.failureMessages
      }))
  );

  const stack_trace = JSON.stringify(failedArray);
  const failed_tests = JSON.stringify(failedArray);

  let report_md = `## Test Summary\n\n**Total:** ${total}\n**Passed:** ${passed}\n**Failed:** ${failed}\n\n`;
  if (failedArray.length > 0) {
    report_md += `### Failures\n${stack_trace}\n`;
  }

  const report_json = JSON.stringify({
    total,
    passed,
    failed,
    failed_tests,
    stack_trace,
  });

  return {
    total,
    passed,
    failed,
    stack_trace,
    failed_tests,
    report_md,
    report_json
  };
}

// Simulate a failed test case
jestOutput.testResults[0].assertionResults.push({
  ancestorTitles: ["sum function"],
  fullName: "sum function 1 + 1 = 3",
  title: "1 + 1 = 3",
  failing: true,
  failureMessages: ["Expected 1 + 1 to be 3, but received 2"],
  invocations: 1,
  location: null,
  numPassingAsserts: 0,
  startAt: Date.now(),
  status: "failed"
});

// Prepare payload for backend
const summary = summarizeJestResults(jestOutput);
const payload = {
  ...summary,
  username: 'Alish',
  email: 'ai@gmail.com',
  commit_id: 'abc123',
  repo_url: 'https://github.com/your/repo', // required field in schema
  id: Date.now().toString() // ensure uniqueness
};

// Post to backend
async function postReport(data) {
  try {
    const response = await axios.post(
      'https://ci-cd-qa-automation-3.onrender.com/api/reports',
      data,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('Report saved successfully:', response.data);
  } catch (err) {
    console.error('Error saving report:', err.response?.data || err.message);
  }
}

// Execute POST
postReport(payload);

// Optional: log summary locally
// console.log(summary.report_md);
// console.log(summary.report_json);
