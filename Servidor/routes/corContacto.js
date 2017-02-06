var express = require('express');
var evento  = require('events');
var channel = new evento.EventEmitter();
var socketio = require('socket.io');
var rack = require('../racks');
var plugAssembler = require('../plug');

//modelo o clase necesario para el manejo de los chat
var contactoModel = require("../clases/clsContacto");
var utils = require('../utils');

var corContacto = {};

corContacto.gestionar = function(pet,res){
	//creamos un objeto con los datos a insertar del usuario
	var Operacion = pet.operacion;
	contactoModel.setData(pet);
	switch(Operacion){
		case 'listar':
			contactoModel.listar()
				.then(function(data){
					var respuesta = {};
					if(data.rowCount)
					{
						respuesta.registros = data.rows;
						respuesta.success = 1;
					}
					else
					{
						respuesta.success = 0;
					}
					respuesta.mensaje = data.mensaje;
					utils.enviar(respuesta,res);
				},function(error){utils.error(error,'corContacto linea:34',res);});
			break;

		case 'agregar':
			contactoModel.verificar()
				.then(function(data){
					var respuesta = {
						"mensaje":'ya se sigue al usuario '+data.seguido,
						"contacto":data
					};
					utils.enviar(respuesta,res);
				},function(data){console.log('corContacto agregar linea: 45',data);
					if(data.success){
						return contactoModel.agregar();
					}else{
						utils.error(data,'corContacto linea: 47',res);
					}
				})
				.then(function(data){
					contactoModel.setData({
						nombreusu: contactoModel.innerData.parametro,
						parametro: contactoModel.innerData.nombreusu
					});
					return contactoModel.buscar();
				})
				.then(function(data){
					//busco el usuario que realizo la operacion y si esta conectado
					//se le agrega o quita el usuario dependiendo de la accion
					var seguido = rack.buscarPlug(data.seguido);
					var datos = {
						accion:'seguir',
						user:data.contacto
					};
					if(seguido){
						seguido.socket.emit('contacto',datos);
					}
					contactoModel.setData({
						nombreusu: contactoModel.innerData.parametro,
						parametro: contactoModel.innerData.nombreusu
					});
					return contactoModel.buscar();
				})
				.then(function(data){
					utils.enviar(data,res);
				})
				.catch(function(error){utils.error(error,'corContacto linea: 70',res);});
			break;

		case 'borrar':
			contactoModel.verificar()
				.then(function(data){
					return contactoModel.borrar();
				},function(data){
					if(!data.success){
						utils.error(error,'corContacto linea: 79',res);
					}else{
						utils.enviar(data,res);
					}
				})
				.then(function(data){
					contactoModel.setData({
						nombreusu:contactoModel.innerData.seguidor
					});
					return contactoModel.buscar();
				})
				.then(function(user){
					var seguido = rack.buscarPlug(data.seguido);
					var datos = {
						accion:'borrar',
						user:user
					};
					if(seguido){
						seguido.socket.emit('contacto',datos);
					}
					utils.enviar(data,res);
				},function(error){utils.error(error,'corContacto linea: 100',res);});
			break;

		default:
			var respuesta = {
				success: 0,
				mensaje: 'operacion '+pet.operacion+' no soportada por esta entidad'
			};
			utils.enviar(respuesta,res);
	}
};
module.exports = corContacto;
