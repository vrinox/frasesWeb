var connection = require('../Core/Core');
var dateParser = require('../dateParser')
//creamos el objeto que contendra todos los metodos y atributos
var chatModel = {}

chatModel.innerData = new Array();

	chatModel.setData = function(outData){
		this.innerData=outData;
	}

	chatModel.getData = function(){
		return this.innerData;
	}

	chatModel.cargarp2p = function(callback){
		if(connection){
			var sql = 'SELECT seguidor AS p2p,u.nombre AS nu, u.apellido AS au FROM sigue AS s INNER JOIN usuario AS u ON(seguidor=u.nombreUsu) WHERE seguido ='+connection.escape(this.innerData.nombre)
						+'UNION '
						+'SELECT seguido AS p2p, u.nombre AS nu,u.apellido AS au FROM sigue AS s INNER JOIN usuario AS u ON (seguido=u.nombreUsu) WHERE seguidor='+connection.escape(this.innerData.nombre);
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

	chatModel.cargarChat = function(callback){
		var data = this.innerData;
		var sql = 'SELECT * FROM(SELECT m.estado AS estado,m.contenido AS cont,m.fecha,m.emisor FROM mensaje AS m '
					+'INNER JOIN receptorusu AS ru ON(m.codigo=ru.codigoMen)'
					+' WHERE m.emisor='+connection.escape(data.nombre)+' AND ru.usuario='+connection.escape(data.user)
					+' UNION '
					+' SELECT m.estado AS estado,m.contenido AS cont,m.fecha,m.emisor FROM mensaje AS m '
					+' INNER JOIN receptorusu AS ru ON(m.codigo=ru.codigoMen)'
					+' WHERE m.emisor='+connection.escape(data.user)+' AND ru.usuario='+connection.escape(data.nombre)
					+') AS mensajes ORDER BY fecha ';
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

	chatModel.guardarMensaje = function(callback){
		var data = this.innerData;
		if(connection){
			var dataIns1={
				contenido:data.contenido,
				emisor:data.emisor,
				fecha:dateParser.getParseDate()
			}
			connection.query('INSERT INTO mensaje SET ?', dataIns1, function(error, result){
				if(error)
				{
					throw error;
				}
				else
				{
					dataIns2={
						codigoMen:result.insertId,
						usuario:data.receptor
					}
					connection.query('INSERT INTO receptorusu SET ?', dataIns2, function(error, result){
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
			});
		}
	}
module.exports = chatModel;