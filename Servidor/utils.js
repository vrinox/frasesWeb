//creamos el objeto que contendra todos los metodos y atributos
var utils = {};

utils.innerData = [];

	utils.enviar = function(respuesta,res){
		res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify(respuesta));
	};

	utils.error = function(error){
		console.error(error);
	};

module.exports = utils;
