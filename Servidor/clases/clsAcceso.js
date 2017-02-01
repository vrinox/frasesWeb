//se hace el llamdo a la conexion con la base de datos
var connection = require('../Core/Core');
//llamamos a crypto para encriptar la contraseña
var crypto = require('crypto');
//creamos un objeto para ir almacenando todo lo que necesitemos
var accessModel = {};

	accessModel.innerData = [];

accessModel.setData = function(outData){
	if(outData.clave){
		outData.clave=accessModel.encriptarPass(outData.clave,outData.usuario);
	}
	accessModel.innerData=outData;
	return Promise.resolve();
};

accessModel.getData = function(){
	return Promise.resolve(accessModel.innerData);
};

accessModel.encriptarPass = function(pass,key){
	pass = crypto.createHmac('sha1',key).update(pass).digest('hex');
	return pass;
};

accessModel.buscar = function(){
	return new Promise(function(resolve,reject){
		if (connection)
		{
			var sql = 'SELECT * FROM usuario WHERE nombreusu = $1';
			query = connection.query(sql,[accessModel.innerData.usuario]);
			query.on('row',function(result){
				resolve(result);
			});
		}else{
			data={
				"mensaje":"'no existe conexion'",
				"success":"0"
			};
			reject();
		}
	});
};

accessModel.acceder = function(){
	return new Promise(function(resolve,reject){
		if (connection)
		{
			var sql = 'SELECT * FROM usuario  WHERE nombreusu = $1';

			var query = connection.query(sql,[accessModel.innerData.usuario]);

			query.on('row',function(result){
				var data;
				if(!result)
				{
					data={
						"mensaje":"usuario no existe",
						"success":"0"
					};
					reject(data);
				}else{
					if(result.clave_usu==accessModel.innerData.clave){
						data={
							"mensaje":"acceso realizado con exito",
							"success":"1",
							"HoraCon": obtenerHoraActual()
						};
						resolve(data);
					}else{
						data={
							"mensaje":"usuario/contraseña no concuerda",
							"success":"0"
						};
						reject(data);
					}
				}
			});

			query.on('error',function(error){
				reject(error);
			});
			query.on('end',function(result){
				reject({
					"mensaje":"USUARIO NO EXISTE",
					"success":0
				});
			});
		}else{
			data={
				"mensaje":"'no existe conexion'",
				"success":0
			};
			reject(data);
		}
	});
};

accessModel.registrar = function(){
	return new Promise(function(resolve,reject){
		if(connection){
			var data = [accessModel.innerData.usuario,accessModel.innerData.clave];
			connection.query("INSERT INTO usuario (nombreusu,clave_usu) values ($1,$2)", data, function(error, result){
				if(error)
				{
					reject(error);
				}
				else
				{
					resolve(result);
				}
			});
		}
	});
};
//----------------------------------------- Falta por Migrar ---------------------------------------------
//TODO: Migrar a Postrges
	accessModel.actualizarDatos = function(callback){
		if(connection){
			var data = accessModel.innerData;
			var sql = "UPDATE usuario SET nombre = " + connection.escape(data.nombre) + "," +
						"apellido = " + connection.escape(data.apellido) + "," +
						"seudonimo = " + connection.escape(data.seudonimo) + "," +
						"email = " + connection.escape(data.email) + " WHERE nombreusu = " +
						connection.escape(data.nombreusu);
			connection.query(sql, function(error, result)
			{
				if(error)
				{
					throw error;
				}
				else
				{
					callback(null,{
									"mensaje":"actualizacion realizada con exito",
									"success":"1"
									});
				}
			});
		}
	};
	accessModel.actualizarClave = function(callback){
		if(connection){
			accessModel.acceder(function(error,reqData){
				if(reqData.success=='1'){
					var data = accessModel.innerData;
					var sql = "UPDATE usuario SET clave_usu = " + connection.escape(data.newClave) +
								" WHERE nombreusu = " +	connection.escape(data.nombreusu);
					connection.query(sql, function(error, result)
					{
						if(error)
						{
							throw error;
						}
						else
						{
							callback(null,{
											"mensaje":"actualizacion realizada con exito",
											"success":"1"
											});
						}
					});
				}else{
					callback(null,{
								"mensaje":"no se pudo realizar la operacion",
								"success":"0"
								});
				}
			});
		}
	};
function obtenerHoraActual () {
  now = new Date();
  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
  return hour + ":" + minute + ":" + second;
}
module.exports = accessModel;
