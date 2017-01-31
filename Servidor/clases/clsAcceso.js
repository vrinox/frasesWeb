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
	};

	accessModel.getData = function(){
		return accessModel.innerData;
	};

	accessModel.encriptarPass = function(pass,key){
		pass = crypto.createHmac('sha1',key).update(pass).digest('hex');
		return pass;
	};

	accessModel.buscar = function(callback){
		if (connection)
		{
			var sql = 'SELECT * FROM usuario WHERE nombreUsu = $1';
			query = connection.query(sql,[accessModel.innerData.usuario]);
			query.on('row', function(result)
			{
				console.log(result);
				/*if(error)
				{
					throw error;
				}
				else
				{
					var data;
					if (typeof row !== 'undefined' && row.length > 0)
					{

						data={
							"msg":"datos encontrados con exito",
							"success":"1"
						};
						accessModel.innerData.nombre=row[0].nombre;
						accessModel.innerData.apellido=row[0].apellido;
						accessModel.innerData.email=row[0].email;
						accessModel.innerData.seudonimo=row[0].seudonimo;
						callback(null,data);

					}else{
						data={
							"msg":"usuario no existe",
							"success":"0"
						};
						callback(null,data);
					}
				}*/
			});
		}
	};

	accessModel.acceder = function(callback){
		if (connection)
		{
			var sql = 'SELECT * FROM usuario WHERE nombreUsu = $1';
			var query = connection.query(sql,[accessModel.innerData.usuario]);

			query.on(function(result)
			{
				if(!result)
				{
					console.log('sin registros');
				}
				else
				{
					/*
					var data;
					if (typeof row !== 'undefined' && row.length > 0)
					{
						if(row[0].clave_usu==accessModel.innerData.clave){
							data={
								"msg":"acceso realizado con exito",
								"success":"1",
								"HoraCon": obtenerHoraActual()

							};
							callback(null,data);
						}else{
							data={
								"msg":"usuario/contraseña no concuerda",
								"success":"0"
							};
							callback(null,data);
						}
					}else{
						data={
							"msg":"usuario no existe",
							"success":"0"
						};
						callback(null,data);
					}
					*/
				}
			});
		}
	};

	//posible error por no usar id
	accessModel.registrar = function(callback){
		if(connection){
			var data = {
				nombreUsu : accessModel.innerData.usuario,
				clave_usu :  accessModel.innerData.clave
			};
			connection.query('INSERT INTO usuario SET ?', data, function(error, result){
				if(error)
				{
					throw error;
				}
				else
				{
					//devolvemos la última id insertada
					callback(null,{"affectedRows" : result.affectedRows});
				}
			});
		}
	};
	accessModel.actualizarDatos = function(callback){
		if(connection){
			var data = accessModel.innerData;
			var sql = "UPDATE usuario SET nombre = " + connection.escape(data.nombre) + "," +
						"apellido = " + connection.escape(data.apellido) + "," +
						"seudonimo = " + connection.escape(data.seudonimo) + "," +
						"email = " + connection.escape(data.email) + " WHERE nombreUsu = " +
						connection.escape(data.nombreUsu);
			connection.query(sql, function(error, result)
			{
				if(error)
				{
					throw error;
				}
				else
				{
					callback(null,{
									"msg":"actualizacion realizada con exito",
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
								" WHERE nombreUsu = " +	connection.escape(data.nombreUsu);
					connection.query(sql, function(error, result)
					{
						if(error)
						{
							throw error;
						}
						else
						{
							callback(null,{
											"msg":"actualizacion realizada con exito",
											"success":"1"
											});
						}
					});
				}else{
					callback(null,{
								"msg":"no se pudo realizar la operacion",
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
