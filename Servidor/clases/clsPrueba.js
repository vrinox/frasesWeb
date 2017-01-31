//se hace el llamdo a la conexion con la base de datos
var client = require('../Core/Core');
//creamos un objeto para ir almacenando todo lo que necesitemos
var modelo = {};

	modelo.buscar = function(){
		return new Promise(function(resolve,reject){
			query = client.query('SELECT COUNT(*) AS cargo FROM public.usuario ');
			query.on('row', function(result) {
				resolve(result);
			});
		});
	};

module.exports = modelo;
