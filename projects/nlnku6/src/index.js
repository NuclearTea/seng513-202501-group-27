require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// don't remove the '0.0.0.0'
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});