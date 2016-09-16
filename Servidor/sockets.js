var socketio = require('socket.io');
var rack = require('./racks');
var dateParser = require('./dateParser');
var plugAssembler = require('./plug');
function init(server) {
    var io = socketio(server);

	io.sockets.on('connection',function(socket){
	  //--------inicio identificacion ------------------------
	  socket.on('identificacion',function(data){
	    var atributos = {
	      nombreUsu:data.nombre,
	      horaDeConeccion:data.HDC,
	      ultimaConeccion:new Date(),
	    };
	    if(rack.buscarPlug(atributos.nombreUsu)){
	      socket.emit('identificacion',{text:"falsa"});
	      rack.buscarPlug(atributos.nombreUsu).socket.emit('session',{text:"dobleSession"});
	      console.log('doble session');
	    }else{
	      var plug = plugAssembler.configure(atributos,socket);
	      rack.addPlug(plug);
	      //identificacion en servidor
	      console.log('\nconexion establecida con: '+plug.nombreUsu+"\nde direccion: "+plug.ip+"\n");
	      rack.mostrarListaPlugs();
	    }
	  });
	  //-----------inicio SESSION--- ------------------------
	  socket.on('session',function(data){
	    if(data.text=='cerrar')
	    {
	      rack.removePlug(data.nombreUsu);
	      socket.emit('session',{text:"cerrada"});
	      console.log('session de: '+data.nombreUsu+" cerrada");
	    }
	    else if(data.text=="recuperar")
	    {
	      var plug = rack.buscarPlugPorIp(socket.client.conn.remoteAddress);
	      if(plug)
	      {
	        socket.emit('session',{
	          text:"recuperada",
	          nombreUsu:plug.nombreUsu,
	          horaDeConeccion:plug.horaDeConeccion
	        });
	        //activo el plug
	        plug.estado='conectado';
	        //cierro el intervalo de cierre
	        clearInterval(plug.idIntSes);
	      }
	      else
	      {
	        socket.emit('session',{
	          text:"no recuperada",
	          nombreUsu:"",
	          horaDeConeccion:""
	        });
	      }
	    }
	  });
	  //---------------------------Control de Chat--------------------------------------------------------
	  //modelo o clase necesario para su conexion
	  var chatModel = require("./clases/clsChat");
	  socket.on('chatMsg',function(data){
	    if(data.tipo=='envio')
	    {
	      console.log(data);
	      //----------prueba chatModel en app-------------------
	      chatModel.setData(data);
	      chatModel.guardarMensaje(function(error,data){
	          if(data && data.affectedRows){
	            console.log('Mensaje Guardado satisfactoriamente por el sevidor');
	          }else{
	            console.log(error);
	          }
	      });
	      //----------fin prueba chatModel en app---------------

	      rack.mostrarListaPlugs();
	      var receptor = rack.buscarPlug(data.receptor);
	      if(receptor){
	        data.fecha = dateParser.getParseDate();
	        console.log('disparando mensaje a receptor');
	        receptor.socket.emit('chatMsg',data);
	        var newData = {
	          id : data.id,
	          estado : 'recibidoServidor',
	          fecha : data.fecha
	        };
	        console.log('disparando cambio de estado a emisor\n');
	        console.log(newData);
	        socket.emit('chatMsg',newData);
	      }
	    }
	    else if(data.tipo=='cambioEstado')
	    {
	      if(data.estado=='recibidoPorReceptor'){
	        var emisor = rack.buscarPlug(data.receptor);
	        console.log(emisor);
	        emisor.socket.emit('chatMsg',data);
	      }
	    }
	  });
	  socket.on('connect_failed', function(){
	    console.log('Connection Failed');
	  });
	  socket.on('disconnect',function(){
	    plug=rack.buscarPlugPorSocket(socket);
	    if(plug){
	      plug.estado='esperando';
	      //funcion settimeout
	      plug.idIntSes=setTimeout(
	        (function(plug){
	          return function(){
	            if(plug.estado=='esperando'){
	              rack.removePlug(plug.nombreUsu);
	            }
	      }})(plug), 120000); 
	    }
	  });
	});
    return io;
}

module.exports = init;
