var conexionOpc;
//--------------------------------------OBJETO SETTINGS--------------------------------------//
var Settings = function(){

	this.plano = {
		actualizar: {
			altura: 250,
			campos: [
				{
					tipo: 'campoDeTexto',
					parametros: {requerido: true,titulo:'Nombres',nombre:'nombre',tipo:'simple',eslabon:'simple',max: 25,usaToolTip:true}
				},{
					tipo: 'campoDeTexto',
					parametros: {requerido: true,titulo:'Apellidos',nombre:'apellido',tipo:'simple',eslabon:'simple',max: 25,usaToolTip:true}
				},{
					tipo: 'campoDeTexto',
					parametros: {requerido: true,titulo:'Seudonimo',nombre:'seudonimo',tipo:'simple',eslabon:'simple',max: 25,usaToolTip:true}
				},{
					tipo: 'campoDeTexto',
					parametros: {requerido: true,titulo:'email',nombre:'email',tipo:'simple',eslabon:'area',max: 25,usaToolTip:true}
				}
			]
		},
		cambiarClave: {
			altura: 250,
			campos: [
				{
					tipo: 'campoDeTexto',
					parametros: {requerido: true,titulo:'Clave de acceso',nombre:'claveAc',tipo:'password',eslabon:'area',max: 25,usaToolTip:true}
				},{
					tipo: 'campoDeTexto',
					parametros: {requerido: true,titulo:'Clave de acceso',nombre:'claveNew',tipo:'password',eslabon:'area',max: 25,usaToolTip:true}
				},{
					tipo: 'campoDeTexto',
					parametros: {requerido: true,titulo:'Reingrese clave',nombre:'claveNew2',tipo:'password',eslabon:'area',max: 25,usaToolTip:true}
				}
			]
		}
	};
};
Settings.prototype.construirOpciones = function(){
	var opciones = UI.crearVentanaModal({
	  contenido: 'ancho',
	  cabecera:{
	    html: 'Opciones '
	  },
	  cuerpo:{
	    tipo:'modificar',
	    formulario: this.plano.actualizar
	  },
	  pie:{
	      html:   '<section modalButtons>'+
	              '<button type="button" class="icon icon-guardar-indigo-32"> </button>'+
	              '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'+
	              '</section>'
	  }
	});
	return opciones;
};
