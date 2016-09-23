var express = require('express');

//modelo o clase necesario para su conexion
var accessModel = require("../clases/clsAcceso");

var corAcceso = {};

corAcceso.prototype.gestionar = function(pet){

	//mando la informacion a la clase para su utilizacion
	if((Operacion!="recuperarSession")&&(Operacion!="actualizarClave")){
		accessModel.setData(pet);
	}
	var reqData = {};
	switch(pet.Operacion){
		case 'acceso':
			//realizo la busqueda para el acceso
			accessModel.acceder(function(error,data){
				var respuesta = {};
				if(data.success==1)
				{
					respuesta.session = {
						NombreUsu: accessModel.innerData.nombreUsu,
						HoraCon: data.HoraCon
					};
					respuesta.success = 1;
				}
				else
				{
					respuesta.success = 0;
				}
				respuesta.mensaje = data.msg;
			});
			//TODO: como retornar dentro del callback
			break;

		case 'registro':
		var respuesta;
			accessModel.registrar(function(error,data){
				if(data && data.affectedRows)
				{
					console.log("registro realizado con exito");
					respuesta = {
						success: 1,
						mensaje: 'registro realizado con exito'
					};
				}
				else
				{
					console.log("error en el registro");
					respuesta = {
						success: 0,
						mensaje: 'Error interno del servidor'
					};
				}
			});
			break;

		case 'datosPer':
			accessModel.buscar(function(error,data){
				var respuesta;
				if(data.success=='1')
				{
					var formData=accessModel.getData();
					respuesta = {
						usuario:{
							Nombre: formData.nombre,
							Apellido: formData.apellido,
							Email: formData.email,
							Seudonimo: formData.seudonimo
						},
						success: 1,
						mensaje: data.msg
					};
				}
				else
				{
					respuesta = {
						success: 0,
						mensaje: data.msg
					};
				}
			});
			break;

		case "actualizarDatos":
			console.log("peticion de actualizacion obtenida");
			reqData = {
				nombreUsu : req.body.NombreUsu,
				nombre : req.body.Nombre,
				apellido : req.body.Apellido,
				email : req.body.Email,
				seudonimo : req.body.Seudonimo
			};
			accessModel.setData(reqData);
			accessModel.actualizarDatos(function(error,data){
				var respuesta ={
					success: data.success,
					msg: data.msg
				};
			});
			break;

		case "actualizarClave":
			reqData = {
				nombreUsu : req.body.Nombre,
				clave_usu : req.body.Pass,
				newClave : accessModel.encriptarPass(req.body.NewClave,req.body.Nombre)
			};
			accessModel.setData(reqData);
			accessModel.actualizarClave(function(error,data){
				var respuesta = {
					success: data.success,
					mensaje: data.msg
				};
			});
			break;

		case "seguir":
			reqData = {
				nombreUsu : req.body.NombreUsu,
				parametro : req.body.Parametro
			};

			console.log(reqData);
			accessModel.setData(reqData);
			accessModel.seguir(function(error, data){

				var success=(data.affectedRows!="0")?1:0;

				var respuesta = {
					success: data.success,
					action: data.action
				};
			});
			break;
	}
	return respuesta;
};

module.exports = corAcceso;
