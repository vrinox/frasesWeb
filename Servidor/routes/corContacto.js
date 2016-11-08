var express = require('express');

//modelo o clase necesario para el manejo de los chat
var contactoModel = require("../clases/clsContacto");
var utils = require('../utils');

var corContacto = {};

corContacto.gestionar = function(pet,res){
	//creamos un objeto con los datos a insertar del usuario
	var Operacion = pet.operacion;
	contactoModel.setData(pet);
	switch(Operacion){
		case 'buscar':
			contactoModel.buscar(function(error,data){
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
				respuesta.mensaje = data.msg;
				utils.enviar(respuesta,res);
			});
			break;

		case 'agregar':
			contactoModel.agregar(function(error,data){
				utils.enviar(data,res);
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
module.exports = corContacto;
