var plug= {};

plug.configure = function(attr,socket){
  this.nombreUsu=attr.nombreUsu;
  this.ultimaConexion=attr.ultimaConexion;
  this.horaDeConexion=attr.horaDeConexion;
  this.socket=socket;
  this.estado="conectado";
  this.idIntSes=null;
  this.ip=socket.client.conn.remoteAddress;
}
module.exports=plug;