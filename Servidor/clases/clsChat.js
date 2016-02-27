var connection = require('../Core/Core');
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
		var sql = 'SELECT m.estado AS estado,m.contenido AS cont,m.fecha,m.emisor FROM mensaje AS m '
					+'INNER JOIN receptorusu AS ru ON(m.codigo=ru.codigoMen)'
					+' WHERE m.emisor='+connection.escape(data.nombre)+' AND ru.usuario='+connection.escape(data.user)
					+' UNION '
					+' SELECT m.estado AS estado,m.contenido AS cont,m.fecha,m.emisor FROM mensaje AS m '
					+' INNER JOIN receptorusu AS ru ON(m.codigo=ru.codigoMen)'
					+' WHERE m.emisor='+connection.escape(data.user)+' AND ru.usuario='+connection.escape(data.nombre);
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

module.exports = chatModel;