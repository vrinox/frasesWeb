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

	chatModel.cargarp2p = function(){
		var yo= this;
		return new Promise(function(resolve,reject){
			//TODO: BUG: carga de contactos no funciona
			if(connection){
				var values =[yo.innerData.nombre];
				var sql = "SELECT seguidor AS p2p,u.nombre AS nu, u.apellido AS au, count(m.codigo) as pendientes "+
							"FROM sigue AS s "+
							"INNER JOIN usuario AS u ON(seguidor=u.nombreusu) "+
							"left join receptorusu as p on s.seguido = p.usuario "+
							"left join mensaje as m on p.codigoMen = m.codigo and m.emisor = s.seguidor and m.estado = 'R' "+
							"WHERE seguido =$1"+
							" group by seguidor ,u.nombre , u.apellido "+
							"UNION "+
							"SELECT seguido AS p2p,u.nombre AS nu, u.apellido AS au, count(m.codigo) as pendientes "+
							"FROM sigue AS s "+
							"INNER JOIN usuario AS u ON(seguido=u.nombreusu) "+
							"left join receptorusu as p on s.seguidor = p.usuario "+
							"left join mensaje as m on p.codigoMen = m.codigo and m.emisor = s.seguido and m.estado = 'R' "+
							"WHERE seguidor =$1"+
							" group by seguido ,u.nombre , u.apellido ";
				var query=connection.query(sql,values, function(error, rows) {
					if(error)
					{
						reject(error);
					}
					else
					{
						resolve(rows.rows);
					}
				});
			}else{
				reject("no existe conexion");
			}
		});
	};

	chatModel.cargarChat = function(){
		var yo= this;
		return new Promise(function(resolve,reject){
			var data = yo.innerData;
			var values = [data.nombre,data.user];
			var sql = 'SELECT * FROM(SELECT m.estado AS estado,m.contenido AS cont,m.fecha,m.emisor,m.codigo as id,idtemp FROM mensaje AS m '+
						'INNER JOIN receptorusu AS ru ON(m.codigo=ru.codigoMen)'+
						' WHERE m.emisor=$1 AND ru.usuario=$2'+
						' UNION '+
						' SELECT m.estado AS estado,m.contenido AS cont,m.fecha,m.emisor,m.codigo as id,idtemp FROM mensaje AS m '+
						' INNER JOIN receptorusu AS ru ON(m.codigo=ru.codigoMen)'+
						' WHERE m.emisor=$2 AND ru.usuario=$1'+
						') AS mensajes ORDER BY fecha ';
			connection.query(sql,values, function(error, rows) {
				if(error)
				{
					reject({
						"error":error,
						"success":0
					});
				}
				else
				{
					if(rows.rowCount){
						resolve(rows.rows);
					}else{
						reject({
							"mensaje":'chat vacio',
							"success":1
						});
					}
				}
			});
		});
	};

	chatModel.guardarMensaje = function(){
		var data = this.innerData;
		return new Promise(function(resolve,reject){
			if(connection){
				var dataIns1=[data.contenido,data.emisor, data.estado,dateParser.getParseDate(),data.id];
				connection.query('INSERT INTO mensaje (contenido,emisor,estado,fecha,idtemp) values($1,$2,$3,$4,$5) returning *', dataIns1, function(error, result){
					if(error){
						Promise.reject(error);
					}else{
						resolve(result);
					}
				});
			}else{
				reject("no existe conexion");
			}
		}).then(function(result){
			dataIns2=[result.rows[0].codigo,data.receptor];
			connection.query('INSERT INTO receptorusu (codigomen,usuario) values($1,$2)', dataIns2, function(error, result){
				if(error){
					Promise.reject(error);
				}else{
					//devolvemos la última id insertada
					Promise.resolve({"affectedRows" : result.rowCount});
				}
			});
		},function(error){
			console.log(error);
		});
	};

	chatModel.actualizar = function(mensajes,estado){
		return new Promise(function(resolve,reject){
			if(connection){
				var valorEstado;
				var valoresNumericos = '(';
				var valores = "(";
				for(var x=0; x<mensajes.length;x++){
					if(isNaN(mensajes[x])){
						valores+="'"+mensajes[x]+"'";
						if(x !== mensajes.length - 1){
							valores+=',';
						}
					}else{
						valoresNumericos+="'"+mensajes[x]+"'";
						if(x !== mensajes.length - 1){
							valoresNumericos+=',';
						}
					}
				}
				valores +=")";
				valoresNumericos += ')';
				if(estado === 'leidos'){
					valorEstado = 'L' ;
				}else if(estado === 'recibidos'){
					valorEstado = 'R';
				}
				if(valoresNumericos !== '()'){
					valoresNumericos ='codigo in '+valoresNumericos+' or';
				}
				var sql = "UPDATE mensaje SET estado = $1 WHERE "+valoresNumericos+" idtemp in "+valores;
				console.log(sql);
				var values =[valorEstado];
				connection.query(sql,values, function(error, result){
					if(error)
					{
						reject(error);
					}
					else
					{
						console.log("mensajes actualizados");
						resolve();
					}
				});
			}
		});
	};
module.exports = chatModel;
