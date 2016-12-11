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
					parametros: {requerido: true,titulo:'Apellidos',nombre:'apellidos',tipo:'simple',eslabon:'simple',max: 25,usaToolTip:true}
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
	UI.crearVentanaModal({
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
};
//--------------------------------------FUNCIONAMIENTO DE CARGA DE SCRIPT-------------------//
arranque();
function arranque(){
	//aviso al motor que el script arranco
	jarvis.libCargada("Opciones");
	//agrego el operador a la libreria
	jarvis.buscarLib("Opciones").op = new Settings();
	//construyo las opciones
	jarvis.buscarLib("Opciones").op.construirOpciones();
	torque.Operacion({
		operacion:'datosPer',
		nombre:jarvis.session.nombreUsu,
		entidad:"acceso"
	},function(respuesta){
		console.log(respuesta);
	});
}
