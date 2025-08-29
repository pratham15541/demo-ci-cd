// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON payload
app.use(express.json({ limit: '50mb' }));

app.get('/',(req,res)=>{
    res.json('Server running')
})

app.post('/receive', (req, res) => {
  const fileTree = req.body;
  console.log('Received file tree:');
  console.log(fileTree); // print first 20 files for sanity

  // You can save to disk if needed
  // fs.writeFileSync('received-files.json', JSON.stringify(fileTree, null, 2));

  res.json({ status: 'success', filesReceived: Object.keys(fileTree).length });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
