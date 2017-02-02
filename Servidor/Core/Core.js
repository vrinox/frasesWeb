 var pg = require('pg');
connectionString = /*process.env.DATABASE_URL ||*/ 'postgres://cptscthbaftblv:f408a51f0b638c21f402ae9b24650a1d0c4f0d39b2258da9ba374e78525d0741@ec2-54-221-201-244.compute-1.amazonaws.com:5432/d9odifbf15mthd';
console.log(connectionString);
var client = new pg.Client(connectionString);
client.connect();

module.exports = client;
