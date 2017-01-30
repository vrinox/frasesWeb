var conexionAcc;
var Acceso = function(){
	//planos de formularios a utilizar
	this.plano = {
		acceso: {
			campos : [
				{
					tipo: 'campoDeTexto',
					parametros: {requerido: true,titulo:'Nombre de usuario',nombre:'usuario',tipo:'simple',eslabon:'area',max: 25,usaToolTip:true}
				},{
					tipo: 'campoDeTexto',
					parametros: {requerido: true,titulo:'Clave de acceso',nombre:'clave',tipo:'password',eslabon:'area',max: 25,usaToolTip:true}
				}
			]
		},
		registro: {
			altura: 250,
			campos: [
				{
					tipo: 'campoDeTexto',
					parametros: {requerido: true,titulo:'Nombre de usuario',nombre:'usuario',tipo:'simple',eslabon:'area',max: 25,usaToolTip:true}
				},{
					tipo: 'campoDeTexto',
					parametros: {requerido: true,titulo:'Clave de acceso',nombre:'clave',tipo:'password',eslabon:'area',max: 25,usaToolTip:true}
				},{
					tipo: 'campoDeTexto',
					parametros: {requerido: true,titulo:'Reingrese clave',nombre:'clave2',tipo:'password',eslabon:'area',max: 25,usaToolTip:true}
				}
			]
		}
	};

	this.crearFormulario = function(){
		var ventana = UI.agregarVentana({
		  tipo: 'centrado',
		  nombre: 'Acceso',
		  titulo:{
		    html: 'Acceso',
		    tipo: 'inverso'
		  },
		  sectores:[
				{
					nombre: 'formulario', //puede ser lo que sea
					formulario: this.plano.acceso,
					tipo: 'nuevo'
				},
				{
					nombre:'botonera',
					html:'<section botonera><button type="button" class="icon material-icons md-24 white mat-blue500">send</button>'+
								'<button type="button" class="icon material-icons md-24 white mat-indigo500">person_add</button></section>'
				}
		  ]
		},document.body.querySelector('div[contenedor]'));
		ventana.buscarSector('botonera').nodo.querySelector('button.icon.mat-blue500').onclick = function(){
			ingresar(this);
		};
		ventana.buscarSector('botonera').nodo.querySelector('button.icon.mat-indigo500').onclick = function(){
			activarRegistro();
		};
	};

	this.agregarForm = function(nombreForm){
		var objForm = {
			plano: this.plano[nombreForm],
			tipo: 'nuevo'
		};
		UI.buscarVentana('Acceso').buscarSector('formulario').agregarFormulario(objForm);
	};
};
//-----------------------------Acceso------------------------------------------------------------
function ingresar(btn){
	//TODO: animacion css de boton de acceso
 	btn.classList.add('accesando');
	var formulario = UI.buscarVentana('Acceso').buscarSector('formulario').formulario;
	if(formulario.validar()){
		var pet = {
		   entidad: "acceso",
		   operacion: "acceso",
		};
		pet = UI.juntarObjetos(pet,formulario.captarValores());
		var cuadro ={
			contenedor : UI.buscarVentana('Acceso').buscarSector('formulario').nodo,
			cuadro: {
			  nombre: 'acceso',
			  mensaje: 'accesando'
			}
		};
		torque.manejarOperacion(pet,cuadro,function(respuesta){
			console.log("respuesta aceptada");
			//cadenaHtml donde se guardan todas las partes a agregar
			if(respuesta.success===0){
				//extraigo el mensaje
				var mensaje = respuesta.mensaje;
				btn.classList.remove('accesando');
				UI.agregarToasts({
			    	texto: mensaje,
			    	tipo: 'web-arriba-derecha-alto'
			  	});
				jarvis.buscarLib("Acceso").op.agregarForm('acceso');
			}else{
				//armo la session
				jarvis.session.nombreUsu=respuesta.session.NombreUsu;
				jarvis.session.horaDeConexion=respuesta.session.HoraCon;
				jarvis.session.estado="abierta";
				//envio los datos para la creacion de la session en el servidor
				jarvis.session.identificacion();

				//construir el inicio del chat
				jarvis.construc.construirInicio();
				jarvis.construc.llenarMenu();
			}
		});
	}else{
		UI.agregarToasts({
			texto: "por favor llene los campos para poder ingresar",
			tipo: 'web-arriba-derecha-alto'
		});
		activarAcceso();
	}
}
//-------------------------------------Registro----------------------------------------------
function registro(){
	var formulario = UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.formulario;
	if(formulario.validar()){
		if(formulario.buscarCampo('clave').captarValor() !== formulario.buscarCampo('clave2').captarValor()){
			  UI.agregarToasts({
			    texto: 'claves no coinsiden',
			    tipo: 'web-arriba-derecha'
			  });
				return;
		}
		var pet = UI.juntarObjetos(formulario.captarValores(),{entidad: "acceso",operacion: "registro"});
		var cuadro ={
			contenedor : UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.nodo,
			cuadro: {nombre: 'registro',mensaje: 'creando nuevo usuario'}
		};
		torque.manejarOperacion(pet,cuadro,function(respuesta){
			UI.agregarToasts({
				texto: respuesta.mensaje,
				tipo: 'web-arriba-derecha-alto'
			});
			if(respuesta.success===0){
				jarvis.buscarLib('Acceso').op.agregarForm('registro');
			}else{
				activarAcceso();
			}
		});
	}else{
		  UI.agregarToasts({
		    texto: "por favor llene los campos para poder ingresar",
		    tipo: 'web-arriba-derecha-alto'
		  });
	}
}
function activarAcceso(){
	UI.elementos.modalWindow.eliminarUltimaCapa();
}
function activarRegistro(){
	var modal = UI.crearVentanaModal({
		cabecera:{
			html: 'Registro'
		},
		cuerpo:{
			tipo: 'nuevo',
			formulario: jarvis.buscarLib('Acceso').op.plano.registro
		},
		pie:{
			html:'<section botonera><button type="button" class="icon material-icons md-24 white mat-indigo500">save</button>'+
						'<button type="button" class="icon material-icons md-24 white mat-red500">close</button></section>'
		}
	});
	modal.partes.pie.nodo.querySelector('button.mat-red500').onclick = function(){
		UI.elementos.modalWindow.eliminarUltimaCapa();
	};

	modal.partes.pie.nodo.querySelector('button.mat-indigo500').onclick = function(){
		registro();
	};
}
