 var pg = require('pg');
connectionString = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/frasesWeb';
console.log(connectionString);
var client = new pg.Client(connectionString);
client.connect();

module.exports = client;
