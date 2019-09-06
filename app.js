const express = require('express');

const app = express();
const path = require('path');
const port = process.env.PORT || 3000;


app.use('/style', express.static(path.join(__dirname, '/views')));
app.use('/script', express.static(path.join(__dirname, '/views')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
  });


app.listen(port, () => {
    console.log(`Listening at port ${port}`);
  })