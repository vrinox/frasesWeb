var pg = require('pg');
pg.defaults.ssl = true;
connectionString = process.env.DATABASE_URL ;
//connectionString = 'postgres://postgres:1234@localhost:5432/frasesweb';
var client = new pg.Client(connectionString);
client.connect();

module.exports = client;
