// server.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const { GoogleGenAI } = require("@google/genai");
const prompt = require("./prompt");

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDNLYci6A-piGgCLxu-wv_79-3r1bi6Yl4",
});
// Parse JSON payload
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Server running");
});

app.post("/receive", async (req, res) => {
  const fileTree = req.body;
  

  const output = await main(JSON.stringify(fileTree, null, 2));
  console.log(output)

  res.json(output, null, 2);
});

async function main() {
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return res.text;
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
