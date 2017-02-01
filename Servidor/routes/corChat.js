var express = require('express');
var evento  = require('events');
var channel = new evento.EventEmitter();
var socketio = require('socket.io');
var rack = require('../racks');
var plugAssembler = require('../plug');


//modelo o clase necesario para el manejo de los chat
var chatModel = require("../clases/clsChat");
var utils = require('../utils');

var corChat = {};

channel.on('actualizarMensajes', function(data,emisor){
    var mensajes = [];
	var plugEmisor = rack.buscarPlug(emisor.toUpperCase());
    data.forEach(function(each){
		if(each.emisor === emisor){
			if(each.estado!='L'){
				each.estado = 'L';
				mensajes.push(each.id);
				if(plugEmisor){
					each.tipo = "cambioEstado";
					plugEmisor.socket.emit('chatMsg',each);
				}
			}
		}
    });
    if(mensajes.length){
    	chatModel.actualizar(mensajes,'leidos');
    }
});


corChat.gestionar = function(pet,res){
	//creamos un objeto con los datos a insertar del usuario
	var Operacion = pet.operacion;
	switch(Operacion){
		case 'cargarp2p':
			var reqData = {
				nombre : pet.nombre
			};
			chatModel.setData(reqData);
			chatModel.cargarp2p()
				.then(function(data){
					var respuesta = {};
					if(data.length>0){
						respuesta.p2p = [];
						var persona;
						for(var x=0;x<data.length;x++){
							persona ={
								nombreusu: data[x].p2p,
								nombre: data[x].nu,
								apellido: data[x].au,
								pendientes: data[x].pendientes
							};
							respuesta.p2p.push(persona);
						}
						respuesta.success = 1;
					}else{
						respuesta.success = 0;
						respuesta.mensaje = {
							nombre_tipo:'INFORMACION',
							titulo:"Agregue un contacto",
							cuerpo:"Debe agregar un contacto para poder empezar a comunicase<br>"+
									"En el menu lateral en el apartado <b>CONTACTOS</b> esta la opcion "+
									"<b>BUSCAR CONTACTO</b> hai podra conseguir personas para empezar"+
									" a comunicase"
						};
					}
				utils.enviar(respuesta,res);
			},function(error){utils.error(error,'corChat linea:73',res)});
			break;
		case 'cargarChat':
			var reqData = {
				nombre : pet.nombre,
				user : pet.chat
			};
			chatModel.setData(reqData);
			chatModel.cargarChat(function(error,data){
				var respuesta = {};
				if(data.length>0){
					respuesta.success = 1;
					respuesta.user = reqData.user;
					respuesta.mensajes = [];
					var msg;
					for(var x=0;x<data.length;x++){
						msg = {
							id: data[x].id,
							estado: data[x].estado,
							cont: data[x].cont,
							fecha: data[x].fecha,
							emisor: data[x].emisor,
							idtemp: data[x].idtemp
						};
						respuesta.mensajes.push(msg);
					}
					//actualizo a leidos todos los mensajes del chat
					channel.emit('actualizarMensajes',respuesta.mensajes,pet.chat);
				}else{
					respuesta.success = 0;
					respuesta.msg = "chat vacio";
					respuesta.user = reqData.user;
				}
				utils.enviar(respuesta,res);
			});
			break;

		default:
			var respuesta = {
				success: 0,
				mensaje: 'operacion '+pet.operacion+' no soportada por esta entidad'
			};
			utils.enviar(respuesta,res);
	}
};

module.exports = corChat;
