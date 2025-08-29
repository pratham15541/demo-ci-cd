// sendFilesToServer.js
const fs = require('fs');
const path = require('path');

function getFilesWithContent(dir = __dirname, baseDir = dir) {
  const output = {};
  const includeExt = new Set(['.js', '.ts', '.jsx', '.tsx']);

  function walk(d) {
    for (const f of fs.readdirSync(d)) {
      if (f === 'node_modules' || f == 'ensure-jest.js' || f == 'file-tree-parser.js') continue; // skip node_modules
      const full = path.join(d, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (includeExt.has(path.extname(f).toLowerCase())) {
        const rel = path.relative(baseDir, full).replace(/\\/g, '/');
        output[rel] = fs.readFileSync(full, 'utf-8');
      }
    }
  }

  walk(dir);
  return output;
}

// Example usage
console.log(getFilesWithContent());
