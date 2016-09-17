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
		var valor = (this.nodo.querySelector('radio').value==='')?null:this.nodo.querySelector('radio').value;
		return valor;
	};
	this.captarNombre = function(){
		return this.nodo.querySelector('radio').name;
	};
	this.captarRequerido = function(){
		return this.atributos.requerido;
	};
	this.asignarValor = function(valor){
		this.valor = valor;
		this.nodo.querySelector('radio').value = valor;
	};
	this.deshabilitar = function(){
		for (var i = 0; i < this.opciones.length; i++) {
			this.opciones[i].disabled = true;
		}
	};
	this.habilitar = function(){
		for (var i = 0; i < this.opciones.length; i++) {
			this.opciones[i].disabled = false;
		}
	};
	this.limpiar = function(){
		this.nodo.querySelector('radio').value = '';
	};
	this.construirNodo();
};
/****************************************************************************************************************************************/
arranque();
function arranque(){
	//aviso al motor que el script arranco
	jarvis.libCargada("radio");
}