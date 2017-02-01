var socketio = require('socket.io');
var rack = require('./racks');
var dateParser = require('./dateParser');
var plugAssembler = require('./plug');
var evento  = require('events');
var channel = new evento.EventEmitter();

//chat
var chatModel = require("./clases/clsChat");
channel.on('actualizarMensajes', function(data){
    var mensajesLeidos = [];
    var mensajesRecibidos = [];
    data.forEach(function(each){
		if(each.estado==='R'){
			mensajesRecibidos.push(each.id);
		}
		if(each.estado==='L'){
			mensajesLeidos.push(each.id);
		}
    });
    if(mensajesLeidos.length){
    	chatModel.actualizar(mensajesLeidos,'leidos');
    }
    if(mensajesRecibidos.length){
    	chatModel.actualizar(mensajesRecibidos,'recibidos');
    }
});
function init(server) {

	var io = socketio(server);

	io.sockets.on('connection',function(socket){
	  //--------inicio identificacion ------------------------
	  socket.on('identificacion',function(data){
	    var atributos = {
	      nombreusu:data.nombre,
	      horaDeConeccion:data.HDC,
	      ultimaConeccion:new Date(),
	    };
	    if(rack.buscarPlug(atributos.nombreusu)){
	      socket.emit('identificacion',{text:"falsa"});
	      rack.buscarPlug(atributos.nombreusu).socket.emit('session',{text:"dobleSession"});
	      console.log('doble session');
	    }else{
	      var plug = plugAssembler.configure(atributos,socket);
	      rack.addPlug(plug);
	      //identificacion en servidor
	      console.log('\nconexion establecida con: '+plug.nombreusu+"\nde direccion: "+plug.ip+"\n");
	      rack.mostrarListaPlugs();
	    }
	  });
	  //-----------inicio SESSION--- ------------------------
	  socket.on('session',function(data){
	    if(data.text=='cerrar')
	    {
	      rack.removePlug(data.nombreusu);
	      socket.emit('session',{text:"cerrada"});
	      console.log('session de: '+data.nombreusu+" cerrada");
	    }
	    else if(data.text=="recuperar")
	    {
	      var plug = rack.buscarPlugPorIp(socket.client.conn.remoteAddress);
	      if(plug)
	      {
	        socket.emit('session',{
	          text:"recuperada",
	          nombreusu:plug.nombreusu,
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
	          nombreusu:"",
	          horaDeConeccion:""
	        });
	      }
	    }
	  });
	  socket.on('plugs',function(data){
	  	console.log('peticion de control');
	  	if(data.operacion == "listar"){
	  		rack.mostrarListaPlugs();
	  	}
	  });
    socket.on('contacto',function(data){
      console.log('data');
    });
	  //---------------------------Control de Chat--------------------------------------------------------
	  //modelo o clase necesario para su conexion
	  socket.on('chatMsg',function(data){
	    if(data.tipo=='envio')
	    {
	    	//pase el estado del mensaje a s que significa recibido por el server
		    data.estado = "S";
		    //----------prueba chatModel en app-------------------
		    chatModel.setData(data);
		    chatModel.guardarMensaje(function(error,mensaje){
		        if(mensaje && mensaje.affectedRows){
		    	    console.log('Mensaje Guardado satisfactoriamente por el sevidor');
		        }else{
		        	console.log(error);
		        }
		    });
	      	//----------fin prueba chatModel en app---------------
		    var receptor = rack.buscarPlug(data.receptor.toUpperCase());

	      	fecha = dateParser.getParseDate();
	      	if(receptor){
	        	data.fecha = fecha;
	        	console.log('disparando mensaje a receptor');
	        	receptor.socket.emit('chatMsg',data);
	        }
	        console.log('cambio de estado a S');
	        var newData = {
	      	  	tipo : 'cambioEstado',
	          	id : data.id,
	          	msg : 'recibidoServidor',
	          	estado: 'S',
	          	fecha : fecha
  			};
  			socket.emit('chatMsg',newData);
	    }
	    else if(data.tipo=='cambioEstado'){
			channel.emit('actualizarMensajes',[data]);
	    	if(data.estado){
        	var emisor = rack.buscarPlug(data.emisor);
        	if(emisor){
        		console.log('cambio de estado a '+data.estado);
        		emisor.socket.emit('chatMsg',data);
        	}
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
	              rack.removePlug(plug.nombreusu);
	            }
	      		};
					})(plug), 120000);
	    }
	  });
	});
    return io;
}

module.exports = init;
