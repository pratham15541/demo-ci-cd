const fs = require("fs");
const path = require("path");

/**
 * Transform Jest report to the required payload format
 * @param {string} reportPath - Path to the Jest JSON report file
 * @param {Object} options - Additional options for payload
 * @param {string} options.commit_id - Git commit ID
 * @param {string} options.repo_url - Repository URL
 * @param {string} options.username - Username
 * @param {string} options.email - Email
 * @returns {Object} Transformed payload
 */
function transformJestReport(reportPath, options = {}) {
  try {
    if (!fs.existsSync(reportPath)) {
      throw new Error(`Jest report file not found: ${reportPath}`);
    }

    const jestData = JSON.parse(fs.readFileSync(reportPath, "utf8"));

    // Extract error stack traces
    let stackTrace = "";
    const failedTests = [];

    if (jestData.testResults) {
      jestData.testResults.forEach((suite) => {
        if (suite.assertionResults) {
          suite.assertionResults.forEach((test) => {
            if (test.status === "failed") {
              failedTests.push({
                suite: suite.name,
                test: test.title,
                errors: test.failureMessages || [],
              });

              if (test.failureMessages) {
                stackTrace += `\n=== ${suite.name} -> ${test.title} ===\n`;
                stackTrace += test.failureMessages.join("\n") + "\n";
              }
            }
          });
        }
      });
    }

    // Create detailed markdown summary
    const reportMd = `# Jest Test Report

## Summary
- **Total Tests**: ${jestData.numTotalTests || 0}
- **Passed**: ${jestData.numPassedTests || 0}
- **Failed**: ${jestData.numFailedTests || 0}
- **Test Suites**: ${jestData.numTotalTestSuites || 0}
- **Success Rate**: ${
      jestData.numTotalTests > 0
        ? Math.round((jestData.numPassedTests / jestData.numTotalTests) * 100)
        : 0
    }%
- **Duration**: ${
      jestData.testResults
        ? jestData.testResults.reduce(
            (acc, suite) => acc + (suite.endTime - suite.startTime),
            0
          )
        : 0
    }ms

## Test Results by Suite

${
  jestData.testResults
    ? jestData.testResults
        .map((suite) => {
          const suitePassed = suite.assertionResults.filter(
            (test) => test.status === "passed"
          ).length;
          const suiteFailed = suite.assertionResults.filter(
            (test) => test.status === "failed"
          ).length;

          return `### ${suite.name}
- Status: ${suite.status}
- Tests: ${
            suitePassed + suiteFailed
          } (${suitePassed} passed, ${suiteFailed} failed)
- Duration: ${suite.endTime - suite.startTime}ms

${suite.assertionResults
  .map(
    (test) =>
      `- [${test.status === "passed" ? "✅" : "❌"}] ${test.title}${
        test.status === "failed"
          ? "\n  ```\n  " +
            (test.failureMessages
              ? test.failureMessages.join("\n  ")
              : "No error details") +
            "\n  ```"
          : ""
      }`
  )
  .join("\n")}`;
        })
        .join("\n\n")
    : "No detailed results available"
}

${
  failedTests.length > 0
    ? `
## Failed Tests Details

${failedTests
  .map(
    (failed) => `
### ${failed.suite} -> ${failed.test}
\`\`\`
${failed.errors.join("\n")}
\`\`\`
`
  )
  .join("\n")}
`
    : "## ✅ All tests passed!"
}
`;

    // Create the transformed payload
    const payload = {
      total: jestData.numTotalTests || 0,
      passed: jestData.numPassedTests || 0,
      failed: jestData.numFailedTests || 0,
      stack_trace: stackTrace.trim(),
      report_md: reportMd,
      report_json: jestData,
      username: options.username || "Alish",
      email: options.email || "ai@gmail.com",
      commit_id: options.commit_id || "abc123",
      repo_url: options.repo_url || "https://github.com/your/repo", // required field in schema
      id: Date.now().toString(), // ensure uniqueness
    };

    return payload;
  } catch (error) {
    console.error("❌ Error processing Jest report:", error.message);
    throw error;
  }
}

/**
 * Send Jest report via curl
 * @param {Object} payload - Transformed Jest report payload
 * @param {string} endpoint - API endpoint URL
 */
async function sendJestReport(
  payload,
  endpoint = "https://ci-cd-qa-automation-3.onrender.com/api/reports"
) {
  const { execSync } = require("child_process");

  try {
    // Write payload to temporary file
    const payloadFile = "jest-payload-temp.json";
    fs.writeFileSync(payloadFile, JSON.stringify(payload, null, 2));

    console.log("=== Sending Jest report via curl ===");
    console.log(`Endpoint: ${endpoint}`);
    console.log(`Payload summary:`);
    console.log(`- Total: ${payload.total}`);
    console.log(`- Passed: ${payload.passed}`);
    console.log(`- Failed: ${payload.failed}`);
    console.log(`- Has stack trace: ${payload.stack_trace.length > 0}`);
    console.log(`- Report MD length: ${payload.report_md.length} characters`);

    // Send via curl
    const curlCommand = `curl -X POST -H "Content-Type: application/json" -H "Accept: application/json" -d @${payloadFile} "${endpoint}" --verbose --fail-with-body`;

    console.log(`\nExecuting: ${curlCommand}`);

    const result = execSync(curlCommand, { encoding: "utf8" });
    console.log("✅ Jest report sent successfully");
    console.log("Response:", result);

    // Clean up temp file
    fs.unlinkSync(payloadFile);

    return result;
  } catch (error) {
    console.error("❌ Failed to send Jest report:", error.message);
    throw error;
  }
}

// Main execution when run directly
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error(
      "Usage: node transform-jest-report.js <jest-report-path> [endpoint-url] [commit-id] [repo-url] [username] [email]"
    );
    process.exit(1);
  }

  const reportPath = args[0];
  const endpoint = args[1] || "https://your-api-endpoint.com/jest-reports";
  const commit_id = args[2] || process.env.GITHUB_SHA || "abc123";
  const repo_url =
    args[3] ||
    `https://github.com/${process.env.GITHUB_REPOSITORY}` ||
    "https://github.com/your/repo";
  const username = args[4] || "Alish";
  const email = args[5] || "ai@gmail.com";

  const options = {
    commit_id,
    repo_url,
    username,
    email,
  };

  try {
    console.log("=== Transforming Jest Report ===");
    console.log(`Commit ID: ${commit_id}`);
    console.log(`Repo URL: ${repo_url}`);
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);

    const payload = transformJestReport(reportPath, options);

    // Save transformed payload
    const outputPath = "jest-transformed-payload.json";
    fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));
    console.log(`✅ Transformed payload saved to: ${outputPath}`);

    // Send via curl if endpoint provided
    if (endpoint !== "skip") {
      sendJestReport(payload, endpoint);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

module.exports = {
  transformJestReport,
  sendJestReport,
};
