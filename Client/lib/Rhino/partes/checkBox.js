var CheckBox = function(info){
	//marcado,habilitado,valor,nombre,requerido,usaTitulo,eslabon
	var Campo = function(animacion){
		this.nodo = null;
		this.check =null;
		this.box = null;

		this.construirNodo = function(){
			var nodo = document.createElement('div');
			nodo.setAttribute('checkbox','');
			this.nodo = nodo;

			var check = document.createElement('div');
			check.setAttribute('check','');
			nodo.appendChild(check);

			var box = document.createElement('div');
			box.setAttribute('box','');
			nodo.appendChild(box);

			box.classList.add(animacion);
			check.classList.add(animacion);

			this.check = check;
			this.box = box;
		};
		this.construirNodo();
	};
	var Titulo = function(nombre){
		this.nodo = null;

		this.construirNodo = function(){
			var nodo = document.createElement('div');
			nodo.setAttribute('titulo','');
			this.nodo = nodo;

			nodo.textContent = nombre;
		};
		this.construirNodo();
	};
	//partes
	this.nodo = null;
	this.campo = null;
	this.texto = null;
	// valores
	this.habilitado = 'habilitado';
	this.marcado = false;
	this.valor = info.valor;
	this.nombre = info.nombre;
	this.requerido = info.requerido || false;

	this.construirNodo = function(){
		var nodo = document.createElement('div');
		nodo.setAttribute('o-checkbox','');
		this.nodo = nodo;

		animacion = info.animacion || 'girar';
		this.campo = new Campo(animacion);
		this.nodo.appendChild(this.campo.nodo);

		tipo = info.tipo || 'campo';
		this.nodo.classList.add(tipo);
		info.sinTitulo = info.sinTitulo || false;
		if(info.usaTitulo){
			this.titulo = new Titulo(info.nombre);
			this.nodo.appendChild(this.titulo.nodo);
		}
		if(info.eslabon === 'area'){
			this.nodo.setAttribute('area','');
		}
		if(!info.habilitado){
			this.deshabilitar();
		}else {
			this.habilitar();
		}
		if(info.marcado){
			this.marcar();
		}else{
			this.desmarcar();
		}
	};
	this.cambiarEstado = function(){
		if(this.marcado){
			this.desmarcar();
		}else{
			this.marcar();
		}
	};
	this.marcar = function(){
		this.campo.nodo.classList.add('marcado');
		this.marcado = true;
	};
	this.desmarcar = function(){
		this.campo.nodo.classList.remove('marcado');
		this.marcado = false;
	};
	this.deshabilitar = function(){
		var yo = this;
		this.nodo.onclick = function(){};
		this.estado = 'deshabilitado';
	};
	this.habilitar = function(){
		var yo = this;
		this.nodo.onclick = function(){
			yo.cambiarEstado();
			if(yo.onclick){
				yo.onclick();
			}
		};
		this.estado = 'habilitado';
	};
	this.captarNombre = function(){
		return this.nombre;
	};
	this.captarValor = function(){
		if(this.marcado){
			return this.valor;
		}else{
			return false;
		}
	};
	this.captarRequerido = function(){
		return this.requerido;
	};
	this.limpiar = function(){
		this.desmarcar();
	};
	this.asignarClick = function(clickFunction){
		var yo = this;
		this.onclick = clickFunction;
		if(this.estado === "habilitado"){
			this.deshabilitar();
			this.habilitar();
		}
	};
	this.construirNodo();
};
/****************************************************************************************************************************************/
arranque();
function arranque(){
	//aviso al motor que el script arranco
	jarvis.libCargada("checkBox");
}
