var Radio = function(info){
	//nombre,opciones,seleccionado
	this.data = info;
	this.estado = 'porConstriur';
	this.nodo = null;
	this.opciones = [];

	this.construirNodo = function(){
		var nodo = document.createElement('div');
		nodo.setAttribute('formElements','');
		this.nodo = nodo;
		this.agregarOpciones();
		if(this.data.valor){
			this.asignarValor(this.data.valor);
		}
	};
	this.agregarOpcion = function(opcion){
		var nodoOpcion = document.createElement('label');
		nodoOpcion.classList.toggle('radio');
		var html = '';
		html+='<input type="radio" name="'+this.data.nombre+'" value="'+opcion.valor+'"><span class="outer"><span class="inner"></span></span>'+opcion.nombre;
		nodoOpcion.innerHTML=html;
		this.opciones.push(nodoOpcion);
		this.nodo.appendChild(nodoOpcion);
	};
	this.agregarOpciones = function(){
		for(var x=0; x<this.data.opciones.length;x++){
			this.agregarOpcion(this.data.opciones[x]);
		}
	};

	this.captarValor = function(){
		var opciones = this.nodo.querySelectorAll('input[type="radio"]');
		for (var i = 0; i < opciones.length; i++) {
			if(opciones[i].checked){
				return opciones[i].value;
			}
		}
		return null;
	};
	this.captarNombre = function(){
		return this.nodo.querySelector('input[type="radio"]').name;
	};
	this.captarRequerido = function(){
		return this.data.requerido;
	};
	this.asignarValor = function(valor){
		this.valor = valor;
		var opciones = this.nodo.querySelectorAll('input[type="radio"]');
		opciones.forEach(function(opc){
			if(opc.value === valor){
				opc.checked = true;
			}else{
				opc.checked = false;
			}
		});
	};
	this.deshabilitar = function(){
		this.nodo.classList.add('desahbilitado');
		var opciones = this.nodo.querySelectorAll('input[type="radio"]');
		opciones.forEach(function(each){
			each.disabled = true;
		});
	};
	this.habilitar = function(){
		this.nodo.classList.remove('desahbilitado');
		var opciones = this.nodo.querySelectorAll('input[type="radio"]');
		opciones.forEach(function(each){
			each.disabled = false;
		});
	};
	this.limpiar = function(){
		var opciones = this.nodo.querySelectorAll('input[type="radio"]');
		opciones.forEach(function(each){
			each.checked = false;
		});
	};
	this.construirNodo();
};
/****************************************************************************************************************************************/
arranque();
function arranque(){
	//aviso al motor que el script arranco
	jarvis.libCargada("radio");
}