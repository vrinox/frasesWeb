var connection = require('../Core/Core');
var dateParser = require('../dateParser')
//creamos el objeto que contendra todos los metodos y atributos
var contactoModel = {}

contactoModel.innerData = new Array();

	contactoModel.setData = function(outData){
		this.innerData=outData;
	}

	contactoModel.getData = function(){
		return this.innerData;
	}

	contactoModel.buscar = function(callback){
		var data = this.innerData;
		var sql = "SELECT * FROM usuario where nombreUsu <> '"+data.usuario+"'";
		connection.query(sql, function(error, rows) {
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null, rows);
			}
		});
	}

	contactoModel.agregar = function(callback){
		var data=this.getData();
		console.log(data);
		var sql = "SELECT * FROM sigue WHERE seguidor="+connection.escape(data.nombreusu)+
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
				}else{
					var insertData = {
						seguido : data.nombreusu,
						seguidor : data.parametro
					};
					connection.query('INSERT INTO sigue SET ?',insertData,function(error,result){
						if(error)
						{
							throw error;
						}
						else
						{
							if(result.affectedRows){
								var sql = "SELECT * FROM usuario WHERE nombreUsu="+connection.escape(data.nombreusu);
								connection.query(sql,function(error,row){
									if (typeof row !== 'undefined' && row.length > 0){
										callback(null,{
											success: 1,
											contacto: row[0],
											accion:'seguir'
										});
									}
								});
							}
						}
					});
				}
			}
		});
	};


	
module.exports = contactoModel;