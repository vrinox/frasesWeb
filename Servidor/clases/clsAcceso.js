//se hace el llamdo a la conexion con la base de datos
var connection = require('../Core/Core');
//llamamos a crypto para encriptar la contraseña
var crypto = require('crypto');
//creamos un objeto para ir almacenando todo lo que necesitemos
var accessModel = {};

	accessModel.innerData = new Array();

	accessModel.setData = function(outData){
		if(outData.clave_usu){
			outData.clave_usu=accessModel.encriptarPass(outData.clave_usu,outData.nombreUsu);
		}
		accessModel.innerData=outData;
	}
	
	accessModel.getData = function(){
		return accessModel.innerData;
	}

	accessModel.encriptarPass = function(pass,key){
		pass = crypto.createHmac('sha1',key).update(pass).digest('hex');
		return pass;
	}

	accessModel.buscar = function(callback){
		if (connection) 
		{
			var sql = 'SELECT * FROM usuario WHERE nombreUsu = ' + connection.escape(accessModel.innerData.nombreUsu);
			connection.query(sql, function(error, row) 
			{
				if(error)
				{
					throw error;
				}
				else
				{
					if (typeof row !== 'undefined' && row.length > 0)
					{
					
						var data={
							"msg":"datos encontrados con exito",
							"success":"1"
						}
						accessModel.innerData.nombre=row[0].nombre;
						accessModel.innerData.apellido=row[0].apellido;
						accessModel.innerData.email=row[0].email;
						accessModel.innerData.seudonimo=row[0].seudonimo;
						callback(null,data);
					
					}else{
						var data={
							"msg":"usuario no existe",
							"success":"0"
						}
						callback(null,data);
					}
				}
			});
		}
	}

	accessModel.acceder = function(callback){
		if (connection) 
		{
			var sql = 'SELECT * FROM usuario WHERE nombreUsu = ' + connection.escape(accessModel.innerData.nombreUsu);
			connection.query(sql, function(error, row) 
			{
				if(error)
				{
					throw error;
				}
				else
				{

					if (typeof row !== 'undefined' && row.length > 0)
					{
						if(row[0].clave_usu==accessModel.innerData.clave_usu){
							var data={
								"msg":"acceso realizado con exito",
								"success":"1",
								"HoraCon": obtenerHoraActual()

							}
							callback(null,data);
						}else{
							var data={
								"msg":"usuario/contraseña no concuerda",
								"success":"0"
							}
							callback(null,data);
						}
					}else{
						var data={
							"msg":"usuario no existe",
							"success":"0"
						}
						callback(null,data);
					}
				}
			});
		}
	}

	//posible error por no usar id
	accessModel.registrar = function(callback){
		if(connection){
			connection.query('INSERT INTO usuario SET ?', accessModel.innerData, function(error, result){
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
	}
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
	}
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
	}
	accessModel.seguir = function(callback){
		var data=this.getData();
		var sql = "SELECT * FROM sigue WHERE seguidor="+connection.escape(data.nombreUsu)+ 
		 			"AND seguido="+connection.escape(data.parametro);
		connection.query(sql,function(error,row){
			if(error)
			{
				throw error;
			}
			else
			{

				if (typeof row !== 'undefined' && row.length > 0)
				{

					sql='DELETE FROM sigue WHERE codigo='+connection.escape(row[0].codigo);
					
					connection.query(sql,function(error,result){
						if(error)
						{
							throw error;
						}
						else
						{
							callback(null,{
								"affectedRows" : result.affectedRows,
								"accion" : "borrar"
							});
						}
					});
				}else{
					var insertData = {
						seguidor : data.nombreUsu,
						seguido : data.parametro
					}
					connection.query('INSERT INTO sigue SET ?',insertData,function(error,result){
						if(error)
						{
							throw error;
						}
						else
						{
							callback(null,{
								"affectedRows" : result.affectedRows,
								"accion" :"seguir"
							});
						}
					});
				}
			}
		});
	}
function obtenerHoraActual () {
  now = new Date();
  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
  return hour + ":" + minute + ":" + second;
}
module.exports = accessModel;