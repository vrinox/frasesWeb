var express = require('express');
var router = express.Router();
var acceso = require('./corAcceso');
var chat = require('./corChat');
var contacto = require('./corContacto');
var utils = require('../utils');

router.post("/", function(req,res)
{
	//creamos un objeto con los datos a insertar del usuario
	var pet = req.body;
	if(pet.tipopet=="web"){
		switch(pet.entidad){
			case 'acceso':
				acceso.gestionar(pet,res);
				break;
			case 'chat':
				chat.gestionar(pet,res);
				break;
			case 'contacto':
				contacto.gestionar(pet,res);
				break;

			default:
				var respuesta = {
					success: 0,
					msg: "entidad "+pet.entidad+" no soportada por esta aplicacion"
				};
				utils.enviar(respuesta,res);
				break;
		}

	}else if(pet.tipopet=="mobile"){

	}else{
		resp = {
			success: 0,
			msg: "error en tipo de peticion"
		};
		utils.enviar(resp,res);
	}
});

router.get('/',function(req,res,next){
	res.end("este es el motor");
});
module.exports = router;
