var express = require('express');
var router = express.Router();

//modelo o clase necesario para su conexion
var accessModel = require("../clases/clsAcceso")

/* GET users listing. */
router.post("/", function(req,res)
{
	//creamos un objeto con los datos a insertar del usuario
	var pet = req.body;
	
	if(pet.TipoPet=="web"){
		switch(pet.entidad){
			case 'acceso':
				var acceso = require('./corAcceso');
				var respuesta = acceso.gestionar(pet);
				break;
		}
		res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify(respuesta));
	}else if(pet.TipoPet=="mobile"){

	}
});

router.get('/',function(req,res,next){
	res.end("este es el motor");
});
module.exports = router;
