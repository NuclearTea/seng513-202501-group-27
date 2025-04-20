require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', (req, res) => {
  const user = {
    name: "Bob",
    email: "bobTheBuilder@Builder.com"
  }
  res.send(JSON.stringify(user, null, 2))
})

// don't remove the '0.0.0.0'
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
  for (let i = 1; i < 7; i++) {
    setTimeout(() => {
      console.log(i);
    }, i*1000)
  }
}); 