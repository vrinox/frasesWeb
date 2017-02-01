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
					if(data.length)
					{
						respuesta.registros = data;
						respuesta.success = 1;
					}
					else
					{
						respuesta.success = 0;
					}
					respuesta.mensaje = data.mensaje;
					utils.enviar(respuesta,res);
				},function(error){
					console.error(error);
				});
			break;

		case 'agregar':
			contactoModel.agregar()
				.then(function(data){
					contactoModel.setData({
						nombreusu:data.seguidor
					})
				//busco el usuario que realizo la operacion y si esta conectado
				//se le agrega o quita el usuario dependiendo de la accion
				contactoModel.buscar()
					.then(function(user){
						var seguido = rack.buscarPlug(data.seguido);
						var datos = {
							accion:data.accion,
							user:user
						};
						if(seguido){
							seguido.socket.emit('contacto',datos);
						}
					},utils.error);
					utils.enviar(data,res);
				},utils.error)
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
