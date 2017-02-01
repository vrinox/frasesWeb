//creamos el objeto que contendra todos los metodos y atributos
var utils = {};

utils.innerData = [];

	utils.enviar = function(respuesta,res){
		res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify(respuesta));
	};

	utils.error = function(error,linea,res){
		console.error(error,linea);
		error = JSON.stringify(error);
		this.enviar({
			"success":0,
			"mensaje":error,
			"linea":linea
		},res);
	};

module.exports = utils;
