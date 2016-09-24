var express = require('express');
var router = express.Router();
var acceso = require('./corAcceso');

router.post("/", function(req,res)
{
	//creamos un objeto con los datos a insertar del usuario
	var pet = req.body;
	
	if(pet.tipopet=="web"){
		switch(pet.entidad){
			case 'acceso':
				acceso.gestionar(pet,res);
				break;
		}
		
	}else if(pet.TipoPet=="mobile"){

	}
});

router.get('/',function(req,res,next){
	res.end("este es el motor");
});
module.exports = router;
