var connection = require('../Core/Core');
var dateParser = require('../dateParser');
//creamos el objeto que contendra todos los metodos y atributos
var chatModel = {};

chatModel.innerData = [];

	chatModel.setData = function(outData){
		this.innerData=outData;
	};

	chatModel.getData = function(){
		return this.innerData;
	};

	chatModel.cargarp2p = function(callback){
		if(connection){
			var sql = "SELECT seguidor AS p2p,u.nombre AS nu, u.apellido AS au, count(m.codigo) as pendientes "+
						"FROM sigue AS s "+
						"INNER JOIN usuario AS u ON(seguidor=u.nombreUsu) "+
						"left join receptorusu as p on s.seguido = p.usuario "+
						"left join mensaje as m on p.codigoMen = m.codigo and m.emisor = s.seguidor and m.estado = 'R' "+
						"WHERE seguido ="+connection.escape(this.innerData.nombre)+
						" group by seguido ,u.nombre , u.apellido "+
						"UNION "+
						"SELECT seguido AS p2p,u.nombre AS nu, u.apellido AS au, count(m.codigo) as pendientes "+
						"FROM sigue AS s "+
						"INNER JOIN usuario AS u ON(seguido=u.nombreUsu) "+
						"left join receptorusu as p on s.seguidor = p.usuario "+
						"left join mensaje as m on p.codigoMen = m.codigo and m.emisor = s.seguido and m.estado = 'R' "+
						"WHERE seguidor ="+connection.escape(this.innerData.nombre)+
						" group by seguido ,u.nombre , u.apellido ";
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
	};

	chatModel.cargarChat = function(callback){
		var data = this.innerData;
		var sql = 'SELECT * FROM(SELECT m.estado AS estado,m.contenido AS cont,m.fecha,m.emisor,m.codigo as id,idtemp FROM mensaje AS m '+
					'INNER JOIN receptorusu AS ru ON(m.codigo=ru.codigoMen)'+
					' WHERE m.emisor='+connection.escape(data.nombre)+' AND ru.usuario='+connection.escape(data.user)+
					' UNION '+
					' SELECT m.estado AS estado,m.contenido AS cont,m.fecha,m.emisor,m.codigo as id,idtemp FROM mensaje AS m '+
					' INNER JOIN receptorusu AS ru ON(m.codigo=ru.codigoMen)'+
					' WHERE m.emisor='+connection.escape(data.user)+' AND ru.usuario='+connection.escape(data.nombre)+
					') AS mensajes ORDER BY fecha ';
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
	};

	chatModel.guardarMensaje = function(callback){
		var data = this.innerData;
		if(connection){
			var dataIns1={
				contenido:data.contenido,
				emisor:data.emisor,
				estado: data.estado,
				fecha:dateParser.getParseDate(),
				idtemp:data.id
			};
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
					};
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
	};

	chatModel.actualizar = function(mensajes,estado){
		if(connection){
			var valorEstado;
			var valores = "(";
			for(var x=0; x<mensajes.length;x++){
				valores+="'"+mensajes[x]+"'";
				if(x !== mensajes.length - 1){
					valores+=',';
				}
			}
			valores +=")";
			if(estado === 'leidos'){
				valorEstado = 'L' ;
			}else if(estado === 'recibidos'){
				valorEstado = 'R';
			}
			var sql = "UPDATE mensaje SET estado = '"+valorEstado+"' WHERE codigo in "+valores+" or idtemp in "+valores ;
			connection.query(sql, function(error, result){
				if(error)
				{
					throw error;
				}
				else
				{
					console.log("mensajes actualizados");
				}
			});
		}
	};
module.exports = chatModel;
