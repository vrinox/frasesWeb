var Toasts = function(atributos){
	this.atributos = atributos;
	this.nodo = null;
	this.atributos.efecto = atributos.efecto || 'mostrar';
	this.atributos.tipo = atributos.tipo || 'mobile';
	this.construirNodo = function(){
		var nodo = document.createElement('div');
		nodo.setAttribute('toasts-'+this.atributos.tipo,'');
		nodo.textContent = this.atributos.texto;
		var contenedor = this.atributos.contenedor || document.body;
		contenedor.appendChild(nodo);

		var toasts = this;
		setTimeout(function aparecerToasts(){
			toasts.nodo.classList.toggle(toasts.atributos.efecto);
		},10);

		setTimeout(function desaparecerToasts(){
			toasts.nodo.classList.toggle(toasts.atributos.efecto);
			setTimeout(function eliminarToast(){
				toasts.nodo.parentNode.removeChild(toasts.nodo);
			},500);
		},5000);
		this.nodo = nodo;
	};
	this.construirNodo();
};
