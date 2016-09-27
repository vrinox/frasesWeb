//creamos el objeto que contendra todos los metodos y atributos
var utils = {};

utils.innerData = [];

	utils.enviar = function(respuesta,res){
		res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify(respuesta));
	};


module.exports = utils;
