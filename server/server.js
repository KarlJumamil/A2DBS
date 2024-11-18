const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { initialize, close } = require('./database');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(routes);

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
