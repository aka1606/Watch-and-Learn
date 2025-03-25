// backend/app/index.js
const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Backend Watch&Learn is running 🚀');
});

console.log("hello test");

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
