var connection = require('../Core/Core');
var dateParser = require('../dateParser');
//creamos el objeto que contendra todos los metodos y atributos
var contactoModel = {};

contactoModel.innerData = [];

contactoModel.setData = function(outData){
	this.innerData=outData;
};

contactoModel.getData = function(){
	return this.innerData;
};

contactoModel.listar = function(){
	var yo = this;
	return new Promise(function(resolve,reject){
		var data = yo.innerData;
		var sql = "SELECT nombreusu, nombreusu as codigo FROM usuario where nombreusu <> '"+data.usuario+"'";
		connection.query(sql, function(error, result) {
			if(error){
				reject(error);
			}else{
				resolve(result);
			}
		});
	});
};
contactoModel.buscar = function(){
	var data = this.innerData;
	return new Promise(function(resolve,reject){
		var sql = "SELECT nombreusu,nombre,apellido,seudonimo,email FROM usuario WHERE nombreusu=$1";
		connection.query(sql,[data.nombreusu], function(error, result) {
			if(error){
				console.log(error,'clsContacto linea: 36');
				reject(error);
			}else{
				resolve({
					success: 1,
					contacto: result.rows[0],
					seguido: data.parametro,
					seguidor:data.nombreusu,
					accion:'seguir'
				});
			}
		});
	});
};
contactoModel.verificar = function(){
	var data=this.getData();
	return new Promise(function(resolve,reject){
		var values =[data.nombreusu,data.parametro];
		var sql = "SELECT * FROM sigue WHERE seguidor=$1"+
	 			"AND seguido=$2";
		connection.query(sql,values,function(error,result){
			if(error){
				reject({
					"mensaje":error,
					"success":0
				});
			}else{
				if (typeof result !== 'undefined' && result.rowCount){
					resolve(result.rows[0]);
				}else{
					reject({
						"mensaje":"el usuario " + values[0] + " no sigue al usuario " + values[1],
						"success":1
					});
				}
			}
		});
	})
}
contactoModel.agregar = function(){
	var data=this.getData();
	return new Promise(function(resolve,reject){console.log('clsContacto linea: 75');
		var insertData = [data.nombreusu,data.parametro];
		connection.query('INSERT INTO sigue (seguido,seguidor) values($1,$2)',insertData,function(error,result){
			if(error){
				reject(error);
			}else{console.log('clsContacto linea: 80',result);
				if(result.rowCount){
					resolve(result);
				}else{
					reject(result);
				}
			}
		});
	});
};
contactoModel.borrar = function(user){
	var data=this.getData();
	return new Promise(function(resolve,reject){
		var sql='DELETE FROM sigue WHERE codigo=$1';
		connection.query(sql,[user.codigo],function(error,result){
			if(error){
				reject(error);
			}else{
				resolve({
					"affectedRows" : result.rowCount,
					"accion" : "borrar",
					success:0,
					mensaje:{
						titulo: "Se ha dejado de seguir a "+data.nombreusu,
						cuerpo: "Se ha dejado de seguri al usuario "+data.nombreusu+
								" por lo cual este dejara de aparecer en su lista de contactos"
					}
				});
			}
		});
	});
};

module.exports = contactoModel;
