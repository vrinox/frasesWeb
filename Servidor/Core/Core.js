var pg = require('pg');
pg.defaults.ssl = true;
connectionString = process.env.DATABASE_URL+'?sslmode=require' || 'postgres://postgres:1234@localhost:5432/frasesweb';
console.log(connectionString);
var client = new pg.Client();
client.connect(connectionString);

module.exports = client;
