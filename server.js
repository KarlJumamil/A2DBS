const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./server/routes');
const { initialize, close } = require('./server/database');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(routes);

app.use(express.json()); 


async function startServer() {
  try {
    await initialize();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    await close();
  }
}

startServer();
