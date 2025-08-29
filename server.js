// server.js
// const express = require("express");
// const app = express();
// const PORT = process.env.PORT || 3000;
const { GoogleGenAI } = require("@google/genai");
const generatePrompt = require("./prompt");

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDNLYci6A-piGgCLxu-wv_79-3r1bi6Yl4",
});
// Parse JSON payload
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.json("Server running");
// });

// app.post("/receive", async (req, res) => {
//   const fileTree = req.body;
  
const fileTree = `{"add.js":"function add(a, b) {\r\n  return a + b;\r\n}\r\n\r\nmodule.exports = add;\r\n","diff.js":"function diff(a, b) {\r\n  return a - b;\r\n}\r\n\r\nmodule.exports = diff;\r\n"`


  (async () => {
    const output = await main(JSON.stringify(fileTree, null, 2));
  console.log(output)
  })



async function main(code) {
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: generatePrompt(code),
  });
  return res.text;
}

// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });
