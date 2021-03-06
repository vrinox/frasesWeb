var Arquitecto = function(){

	this.elementos = [];

	this.estado = 'sinInicializar';

	this.configure = function(objetoInicializar){
		var contenedorGeneral = document.querySelector('div[contenedor]');
		objetoInicializar = objetoInicializar || {};
		this.elementos = {
			 menu : new Menu(),
			 cabecera : new Cabecera(),
			 URL: new URL(),
			 maestro : 'noPosee',
			 botonera : 'noPosee',
			 constructores: this.elementos.constructores
		};
		if(objetoInicializar.maestro){
			objetoInicializar.maestro.contenedor = contenedorGeneral;
			this.elementos.maestro = new Maestro(objetoInicializar.maestro);
		}

		if(objetoInicializar.botonera){
			objetoInicializar.botonera.contenedor = contenedorGeneral;
			this.elementos.botonera = new Botonera(objetoInicializar.botonera);
		}

		this.estado='inicializado';
	};
	this.clonarObjeto = function(objeto){
		return JSON.parse(JSON.stringify(objeto));
	};
	this.juntarObjetos = function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname1 in obj1) { obj3[attrname1] = obj1[attrname1]; }
    for (var attrname2 in obj2) { obj3[attrname2] = obj2[attrname2]; }
    return obj3;
	};
//------------------------- Manejo de ventanas Modales ----------------------------
	this.crearVentanaModal = function(data){
		//creo la venta modal
		if(!this.elementos.modalWindow){
			this.elementos.modalWindow = new modalWindow();
		}
		var capaContenido=this.elementos.modalWindow.arranque(data);
		return capaContenido;
	};

	this.crearMensaje = function(mensaje){
		var capa = this.crearVentanaModal({cuerpo: 'mesaje'});
		capa.convertirEnMensaje(mensaje);
		return capa;
	};
	this.crearVerificacion = function(mensaje,funcion){
		mensaje.nombre_tipo = mensaje.nombre_tipo || 'advertencia';
		var capa = this.crearMensaje(mensaje);
		this.agregarBotoneraStandard(capa,funcion,mensaje.nombre_tipo);
	};
	this.crearVerificacionUsuario = function(mensaje,funcion){
		mensaje.nombre_tipo = mensaje.nombre_tipo || 'informacion';
		var capa = this.crearMensaje(mensaje);
		var campoClave = new CampoDeTexto({
			requerido:true,
			titulo:'Clave Usuario Actual',
			nombre:'clave',
			tipo:'password',
			eslabon:'area',
			usaToolTip:true
		});
		capa.partes.cuerpo.nodo.innerHTML = '';
		capa.partes.cuerpo.nodo.appendChild(campoClave.nodo);
		var funcionAgregada = function(){
			var clave =campoClave.captarValor();
			funcion(clave);
		};
		this.agregarBotoneraStandard(capa,funcionAgregada,mensaje.nombre_tipo);
	};
	this.agregarBotoneraStandard= function(capa,funcion,nombre_tipo){
		capa.agregarParte('pie',{
			clases:[nombre_tipo,'botonera'],
			html:'<button class="icon material-icons md-24 green500">check</button>'+
						'<button class="icon material-icons md-24 red500">close</button>'
		});
		capa.partes.pie.nodo.querySelector('button.green500').onclick = function(){
			funcion();
		};
		capa.partes.pie.nodo.querySelector('button.red500').onclick = function(){
			UI.elementos.modalWindow.eliminarUltimaCapa();
		};
	};
//------------------------- Manejo Cuadros de carga -------------------------------
	this.agregarCuadroCarga = function(cuadroCarga){
		if(!this.elementos.cuadroCarga){
			this.elementos.cuadroCarga = [];
		}
		this.elementos.cuadroCarga.push(cuadroCarga);
	};
	this.removerCuadroCarga = function(nombre){
		var cuadroCarga = this.buscarCuadroCarga(nombre);
		this.elementos.cuadroCarga.splice(this.elementos.cuadroCarga.indexOf(cuadroCarga),1);
	};
	this.buscarCuadroCarga = function(nombre){
		if(this.elementos.cuadroCarga){
			for (var i = 0; i < this.elementos.cuadroCarga.length; i++){
				if(this.elementos.cuadroCarga[i].nombre === nombre){
					return this.elementos.cuadroCarga[i];
				}
			}
			console.log('cuadroCarga '+nombre+' no existe');
			return false;
		}
	};
 	//funcion se utiliza cuando no se necesita pasar parametros al callback al culminar la carga
	this.iniciarCarga = function(info,callback){
		cuadroCarga = new CuadroCarga(info,callback);
		this.agregarCuadroCarga(cuadroCarga);
		cuadroCarga.manejarCarga(info.nombre);
		return cuadroCarga.nodo;
	};
	//funcion se utiliza cuando se necesita pasar parametros al callback al culminar la carga
	this.crearCuadroDeCarga = function(info,contenedor){
		info.contenedor = contenedor;
		cuadroCarga = new CuadroCarga(info,null);
		this.agregarCuadroCarga(cuadroCarga);
		return cuadroCarga.nodo;
	};
//------------------------- Manejo de ventanas ------------------------------------
	this.agregarVentana = function(ventana,contenedor){
		if(!this.elementos.ventanas){
			this.elementos.ventanas = [];
		}
		var newVentana = new Ventana(ventana);
		this.elementos.ventanas.push(newVentana);
		contenedor.appendChild(newVentana.nodo);
		return newVentana;
	};

	this.agregarLista = function(lista,contenedor){
		if(!this.elementos.ventanas){
			this.elementos.ventanas = [];
		}
		var nuevaLista = new Lista(lista);
		contenedor.appendChild(nuevaLista.nodo);
		this.elementos.ventanas.push(nuevaLista);
		return nuevaLista;
	};

	this.buscarVentana = function(nombre){
		var ventanas =this.elementos.ventanas;
		for(var x = 0; x < ventanas.length; x++){
			if(ventanas[x].atributos.nombre===nombre){
				return ventanas[x];
			}
		}
		return false;
	};

	this.quitarVentana = function(nombre){
		var ventana = this.buscarVentana(nombre);
		if(ventana){
			ventana.destruirNodo();
			this.elementos.ventanas.splice(this.elementos.ventanas.indexOf(ventana),1);
		}
	};
	//------------------------- Manejo de toast ----------------------------
	//agrega mensaje pequeño
	this.agregarToasts = function(atributos){
		if(!this.elementos.toasts){
			this.elementos.toasts = [
				{cont:1}
			];
		}else{
			this.elementos.toasts[0].cont++;
		}
		var tiempo= 5000 * (this.elementos.toasts[0].cont - 1);
		setTimeout(function(){
			var toast = new Toasts(atributos);
			UI.elementos.toasts.push(toast);
			setTimeout(function(){
				removerToasts(toast);
			},5000);
		},tiempo);
	};
	function removerToasts(toast){
		UI.elementos.toasts.splice(UI.elementos.toasts.indexOf(toast),1);
		UI.elementos.toasts[0].cont--;
	}
	//------------------------- Manejo de Constructores ----------------------------
	//agrega constructores para formularios
	this.agregarConstructor  = function(objetoConstructor){
		if(!this.elementos.constructores){
			this.elementos.constructores = [];
		}
		this.elementos.constructores.push(objetoConstructor);
	};
	this.buscarConstructor = function(nombre){
		if(this.elementos.constructores){
			for (var i = 0; i < this.elementos.constructores.length; i++) {
				if(this.elementos.constructores[i].nombre == nombre){
					return this.elementos.constructores[i];
				}
			}
			console.log('no se encontro el constructor '+nombre);
		}else{
			console.log('no existe ningun constructor en la lista');
		}
	};
	//------------------------- Manejo Iconos ----------------------------
	this.crearIcono = function(atributos){
		var icono = document.createElement('i');
		icono.classList.add('material-icons');
		icono.textContent = atributos.nombre;
		if(atributos.tamano){
			switch(atributos.tamano){
				case 24:
					icono.classList.add('md-24');
					break;

				case 36:
					icono.classList.add('md-36');
					break;

				case 48:
					icono.classList.add('md-48');
					break;
			}
		}
		if(atributos.color){
			icono.classList.add(atributos.color);
		}
		if(atributos.tono){
			if(atributos.tono.toLowerCase()==='claro'){
				icono.classList.add('md-light');
			}else if(atributos.tono.toLowerCase()==='oscuro'){
				icono.classList.add('md-dark');
			}
		}
		if(atributos.inactivo){
			icono.classList.add('md-inactive');
		}
		return icono;
	};
	this.manejoDeClases = function(contenedor){
		this.eliminarClasesRepetidas(contenedor);
		for (var i = 0; i < contenedor.clases.length; i++) {
			contenedor.nodo.classList.add(contenedor.clases[i]);
		}
	};
	this.eliminarClasesRepetidas = function(contenedor){
		var clasesValidadas = [];
		var existe;
		for (var i = 0; i < contenedor.clases.length; i++) {
			existe = false;
			for (var x = 0; x < clasesValidadas.length; x++) {
				if(clasesValidadas[x]==contenedor.clases[i]){
					existe = true;
				}
			}
			if(!existe){
				clasesValidadas.push(contenedor.clases[i]);
			}
		}
		contenedor.clases = clasesValidadas;
	};
};
//---------------------------Ink Event------------------------
agregarRippleEvent= function(parent,evento){
	var html;
	var ink;
	//se crea el elemento si no existe
	if(parent.getElementsByTagName('div')[0]===undefined){
		ink=document.createElement('div');
		ink.classList.toggle('ink');
		parent.insertBefore(ink,parent.firstChild);
	}
	ink=parent.getElementsByTagName('div')[0];

	//en caso de doble click rapido remuevo la clase
	ink.classList.remove('animated');

	//guardo todo el estilo del elemento
	var style = window.getComputedStyle(ink);

	//se guardan los valores de akto y ancho
	if(parseInt(style.height.substring(0,style.height.length-2))===0 && parseInt(style.width.substring(0,style.width.length-2))===0){
		//se usa el alto y el ancho del padre, del de mayor tamaño para q el efecto ocupe todo el elemento
		d = Math.max(parent.offsetHeight, parent.offsetWidth);
		ink.style.height=d+'px';
		ink.style.width=d+'px';
	}
	//declaro el offset del parent
	var rect =parent.getBoundingClientRect();

	parent.offset={
	  top: rect.top + document.body.scrollTop,
	  left: rect.left + document.body.scrollLeft
	};
	//re evaluo los valores de alto y ancho del ink
	style = window.getComputedStyle(ink);

	//ubico el lugar donde se dispara el click
	var x=evento.pageX - parent.offset.left - parseInt(style.width.substring(0,style.width.length-2))/2;
	var y=evento.pageY - parent.offset.top - parseInt(style.height.substring(0,style.height.length-2))/2;
	//cambio los valores de ink para iniciar la animacion
	ink.style.top=y+'px';
	ink.style.left=x+'px';
	setTimeout(function(){
		ink.classList.toggle('animate');
	},10);
	setTimeout(function(){
		ink.classList.toggle('animate');
	},660);
};
//---------------------------Ink Event------------------------
var URL = function(){
	this.estado = 'construido';
	this.captarParametroPorNombre = function(nombre) {
    nombre = nombre.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + nombre + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};
	this.actual = function(){
		var actual = this.obtenerArchivodeURl(location.href);
		actual = this.limpiarURL(actual);
		return actual;
	};
	this.obtenerArchivodeURl = function(ruta){
		return ruta.split('/')[ruta.split('/').length-1];
	};
	this.limpiarURL = function(url){
		var valorGET = (url.indexOf('?') === -1)?url.length:url.indexOf('?');
		url = url.slice(0,valorGET);
		return url;
	};
};
/*---------------Utilidades---------------------------------------------*/
function obtenerContenedor(){
	var contenedor = document.body.firstChild;
	while(contenedor.nodeName=='#text'){
		contenedor=contenedor.nextSibling;
	}
	return contenedor;
}
function normalizarNodo(nodo){
	var hijo=null;
	var eliminar;
	while(hijo!=nodo.lastChild){
		if(hijo===null){
			hijo=nodo.firstChild;
		}
		if(hijo.nodeName=='#text'){
			eliminar=hijo;
			hijo=hijo.nextSibling;
			eliminar.parentNode.removeChild(eliminar);
		}else{
			hijo=hijo.nextSibling;
		}
	}
}

//-------------------- Salto de linea ---------------
var SaltoDeLinea = function(){
	this.nodo = null;
	this.construirNodo = function(){
		var nodo = document.createElement('div');
		nodo.setAttribute('clear','');
		this.nodo = nodo;
	};
	this.construirNodo();
};
