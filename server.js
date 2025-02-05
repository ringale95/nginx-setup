const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

replicaApp = process.env.APP_NAME
// Serve static files like images, CSS, etc.
app.use('/images', express.static(path.join(__dirname, 'images')));


// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    console.log(`Request served by ${replicaApp}`);
});

app.use('/images', (req, res) => {
  express.static(path.join(__dirname, 'images'));
});

app.listen(port, () => {
  console.log(`${replicaApp} is running at http://localhost:${port}`);
});
