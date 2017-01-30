//llamamos al paquete mysql que hemos instalado
var mysql = require('mysql'),
//creamos la conexion a nuestra base de datos con los datos de acceso de cada uno
connection = mysql.createConnection(
	{
		host: 'localhost',
		user: 'root',
		//tyrel server
		password: '1234',
		//local
		//password:'iutep' 
		database: 'frasesWeb'
	}
);
module.exports = connection;
