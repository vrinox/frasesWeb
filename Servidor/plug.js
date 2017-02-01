var plugAssembler= {};

plugAssembler.configure = function(attr,socket){
	var plug = {
		nombreusu : attr.nombreusu,
		ultimaConexion : attr.ultimaConexion,
		horaDeConexion : attr.horaDeConexion,
		socket : socket,
		estado : "conectado",
		idIntSes : null,
		ip : socket.client.conn.remoteAddress
	};
	return plug;
};
module.exports=plugAssembler;
