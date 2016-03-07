//se hace el llamdo a la connection con la base de datos
var connection = require('../Core/Core');
//creamos el objeto que contendra todos los metodos y atributos
var frasesModel = {}

	frasesModel.innerData = new Array();

	frasesModel.setData = function(outData){
		this.innerData=outData;
	}

	frasesModel.getData = function(){
		return this.innerData;
	}

	frasesModel.buscar = function(callback){
		if(connection){
			var sql = 'SELECT * FROM frase WHERE codigo=' +  connection.escape(this.innerData.codigo);
			connection.query(sql, function(error, row){
				if(error)
				{
					throw error;
				}
				else
				{
					callback(null, row);
				}
			}); 	
		}
	}

	frasesModel.listar = function(callback){
		if(connection){
			var sql = 'SELECT f.*,u.seudonimo AS Seu FROM frase AS f INNER JOIN usuario AS u ON(f.autor=u.nombreUsu)ORDER BY f.codigo';
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
	}
	frasesModel.buscarPerfil = function(callback){
		if(connection){
			var sql = 'SELECT * FROM frase WHERE autor=' +  connection.escape(this.innerData.perfil) + " AND seudonimo=" + connection.escape(0);
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
	}



	frasesModel.busqueda = function(callback){
		if(connection){
			var sql = 'SELECT * FROM frase AS f INNER JOIN usuario AS u ON(u.nombreUsu=f.autor) WHERE autor=' +  connection.escape(this.innerData.paramBusq) + 
					" AND seudonimo=" + connection.escape(1);
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
	}

	frasesModel.verificarSeguidor = function(){
		var data = this.getData();
		var sql = "SELECT u.nombreUsu,u.nombre,u.apellido FROM sigue AS s INNER JOIN usuario AS u ON(u.nombreUsu=s.seguidor)"+
					"  WHERE seguidor = "+connection.escape(data.nombreUsu)+" and seguido = "+connection.escape(data.perfil);
		connection.query(sql,function(error,row){
			if(error){
				throw error;
			}else{
				console.log(row);
				if (typeof row !== 'undefined' || row.length > 0){
					frasesModel.innerData.estado=0;
				}else{
					frasesModel.innerData.nombre = row[0].nombre;
					frasesModel.innerData.apellido = row[0].apellido;
					frasesModel.innerData.estado=1;
				}
			}
		});
	}
	frasesModel.registrar = function(callback){
		if (connection){
			connection.query('INSERT INTO frase SET ?', this.innerData, function(error, result){
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

module.exports = frasesModel;