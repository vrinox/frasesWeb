 var pg = require('pg');
connectionParams={
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASS || '1234',
  database: process.env.DATABASE || 'frasesweb',
  port: proces.env.DATABASE_PORT || '5432',
  ssl: true
};
console.log(connectionParams);
var client = new pg.Client(connectionParams);
client.connect();

module.exports = client;
