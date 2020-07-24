const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendfile(path.join(__dirname, 'index-alt1.html'));
});

app.get('/alt2', (req, res) => {
  res.sendfile(path.join(__dirname, 'index-alt2.html'));
});

app.get('/ga', (req, res) => {
  res.sendfile(path.join(__dirname, 'ga.html'));
});

app.listen(8000, () => {
  console.log('StepSequencer hosted on http://localhost:8000/')
  console.log('GA hosted on http://localhost:8000/ga')
});