var express = require('express');
var modelo = require("../clases/clsPrueba");

var prueba = {};

prueba.mostrar = function(){
  modelo.buscar().then(console.log);
};

module.exports = prueba;
