var pg = require('pg').native,
 connectionString = process.env.DATABASE_URL || 'postgres://localhost:5433/frasesWeb',
 start = new Date(),
 port = process.env.PORT || 3000,
 client = pg.Client(connectionString);

module.export = connection;
