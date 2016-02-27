var plugAssembler= {};
 
plugAssembler.configure = function(attr,socket){
	var plug = {
		nombreUsu : attr.nombreUsu,
		ultimaConexion : attr.ultimaConexion,
		horaDeConexion : attr.horaDeConexion,
		socket : socket,
		estado : "conectado",
		idIntSes : null,
		ip : socket.client.conn.remoteAddress
	}
	return plug;
}
module.exports=plugAssembler;