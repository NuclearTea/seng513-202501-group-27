require('dotenv').config();

// app.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON request bodies
app.use(express.json());

// Sample endpoint that returns a message
app.get('/message', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// Sample endpoint that returns user data
app.get('/user', (req, res) => {
  const user = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com'
  };
  res.json(user);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
