var CampoDeTexto = function(info){
	this.data = info;
	this.estado = 'porConstriur';
	this.data.eslabon = info.eslabon || 'simple';
	this.data.usaToolTip = info.usaToolTip ||  false;
	this.data.usaMinuscula = info.usaMinuscula || false;
	this.nodo = null;

	this.construir = function(){
		var CampoDeTexto = document.createElement('div');
		CampoDeTexto.classList.toggle('group');
		CampoDeTexto.setAttribute(this.data.eslabon,'');
		var html='';
		max=(info.max)?"maxlength="+info.max:'';
		if(this.data.tipo=='simple'){
			html+='<input type="text" name="'+this.data.nombre+'" value="" '+max+' required>';
		}else if(this.data.tipo=='password'){
			html+='<input type="password" name="'+this.data.nombre+'" '+max+' value="" required>';
		}else if(this.data.tipo=='area'){
			html+='<textarea name="'+this.data.nombre+'" required></textarea>';
		}else{
			console.log(this.data.tipo);
		}

		html+='<span class="highlight"></span>'+
		      '<span class="bar"></span>'+
		    	'<label>'+this.data.titulo+'</label>';
		CampoDeTexto.innerHTML=html;
		this.nodo=CampoDeTexto;
		if(this.data.usaToolTip!==false){
			this.nodo.onmouseover=UI.elementos.maestro.abrirtooltipInput;
			this.nodo.onmouseout=UI.elementos.maestro.cerrartooltipInput;
		}
		this.estado='enUso';
	};
	this.captarValor = function(){
		var tipo = this.captarTipo();
		var valor;
		if(this.nodo.querySelector(tipo).value===''){
			valor = null;
		}else{
			valor = this.nodo.querySelector(tipo).value;
			if(!this.data.usaMinuscula){
				valor = valor.toUpperCase();
			}
		}
		return valor;
	};
	this.captarNombre = function(){
		var tipo = this.captarTipo();
		return this.nodo.querySelector(tipo).name;
	};
	this.captarTipo = function(){
		var tipo;
		if(this.data.tipo==='area'){
			tipo = 'textarea';
		}else{
			tipo = 'input';
		}
		return tipo;
	};
	this.captarRequerido = function(){
		return this.data.requerido;
	};
	this.asignarValor = function(valor) {
		var tipo = this.captarTipo();
		this.nodo.querySelector(tipo).value = valor;
	};
	this.habilitar = function(){
		this.nodo.classList.remove('deshabilitado');
		this.nodo.querySelector(this.captarTipo()).disabled = false;
		this.nodo.querySelector(this.captarTipo()).focus();
	};
	this.deshabilitar = function(){
		this.nodo.classList.add('deshabilitado');
		this.nodo.querySelector(this.captarTipo()).disabled = true;
	};
	this.limpiar = function(){
		this.asignarValor("");
	};
	this.construir();
};