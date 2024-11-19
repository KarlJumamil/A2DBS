const oracledb = require('oracledb');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER, // From .env file
  password: process.env.DB_PASSWORD, // From .env file
  connectString: process.env.DB_CONNECT_STRING // From .env file
};

async function initialize() {
  await oracledb.createPool(dbConfig);
  console.log('Connected to Oracle Database');
}

async function close() {
  await oracledb.getPool().close();
  console.log('Closed Oracle Database connection');
}

async function executeQuery(query, params = {}) {
  const connection = await oracledb.getConnection();
  const result = await connection.execute(query, params, { autoCommit: true });
  await connection.close();
  return result;
}

module.exports = { initialize, close, executeQuery };
