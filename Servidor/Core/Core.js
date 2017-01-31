 var pg = require('pg');
// instantiate a new client
// the client will read connection information from
// the same environment variables used by postgres cli tools
connectionString = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/frasesWeb';
var client = new pg.Client(connectionString);
client.connect();

module.exports = client;
