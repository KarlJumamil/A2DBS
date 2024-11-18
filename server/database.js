const oracledb = require('oracledb');
require('dotenv').config();

const dbConfig = {
  user: 'dbs501_243v1a06',
  password: '17381709',
  connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=myoracle12c.senecacollege.ca)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=oracle12c)))'
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
