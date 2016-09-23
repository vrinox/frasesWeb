var ComboBox = function(info){
	//nombre,opciones,seleccionado,eslabon
	this.data = info;
	this.estado = 'porConstriur';
	this.data.eslabon = info.eslabon||'simple';
	this.data.seleccionado = info.seleccionado||'-';
	this.data.sinTitulo = info.sinTitulo || false;
	this.nodo = null;
	this.select = null;

	this.construir = function(){
		var nodo=document.createElement('div');
		nodo.setAttribute(this.data.eslabon,'');
		nodo.setAttribute('formElements','');

		//se crea el article
		var article=document.createElement('article');
		article.setAttribute('capaSelect','');
		if(this.data.deshabilitado !== true ){
			article.onclick=function(){
				construirCapaSelect(this);
			};
		}
		nodo.appendChild(article);

		//se crea el select
		var select=document.createElement('select');
		select.name=this.data.nombre;
		if(this.data.id!==undefined){
			select.id=this.data.id;
		}
		this.select = select;
		nodo.appendChild(select);

		this.nodo=nodo;
		var opcion;
		if(!this.data.peticion){
			if(!this.data.sinTitulo){
				opcion = {
					codigo : '-',
					nombre : 'Elija un '+this.data.titulo
				};
				this.agregarOpcion(opcion);
			}
			arranqueOpciones(this);
		}else{
			opcion = {
				codigo : '-',
				nombre : 'Cargando Opciones ... '
			};
			this.agregarOpcion(opcion);
			this.estado = 'cargando';
			var yo = this;
			torque.Operacion(this.data.peticion,function(respuesta){
				yo.data.opciones = respuesta.registros;
				arranqueOpciones(yo);
			});
		}
	};
	function arranqueOpciones(combo){
		if(combo.data.titulo){
			combo.select.options[0].textContent='Elija un '+combo.data.titulo;
		}
		//genero y asigno el resto de las opciones
		combo.agregarOpciones(combo.data.opciones);
		combo.estado='enUso';
	}
	this.agregarOpciones = function(opciones){
		for(var x=0;x<opciones.length;x++){
			this.agregarOpcion(opciones[x]);
		}
		if(this.data.valor){
			this.asignarValor(this.data.valor);
			this.data.valor = null;
		}
	};
	this.agregarOpcion = function(opcion){
		var select=this.nodo.getElementsByTagName('select')[0];
		var nuevaOp=document.createElement('option');
		nuevaOp.textContent=opcion.nombre;
		nuevaOp.value=opcion.codigo;
		select.appendChild(nuevaOp);
	};
	this.seleccionarOpcion = function(opcion){
		var select=this.nodo.getElementsByTagName('select')[0];
		select.value = opcion.codigo;
		var opciones = select.options;
		for (var i = 0; i < opciones.length; i++) {
			if(opciones[i].value === opcion.codigo){
				select.selectedIndex = i;
				return true;
			}
		}
		return false;
	};
	this.captarValor = function(){
		var valor = (this.nodo.querySelector('select').value==='-')?null:this.nodo.querySelector('select').value;
		return valor;
	};
	this.captarNombre = function(){
		return this.nodo.querySelector('select').name;
	};
	this.captarRequerido = function(){
		return this.data.requerido;
	};
	this.asignarValor = function(valor){
		if(this.estado === 'cargando'){
				var yo = this;
				yo.valor = valor;
				this.idIntervalo = setInterval(function(){
					if(yo.estado !== 'cargando'){
						yo.seleccionarOpcion({codigo:yo.valor});
						yo.valor = null;
						clearInterval(yo.idIntervalo);
						yo.idIntervalo = null;
					}
				},10);
		}else{
				this.seleccionarOpcion({codigo:valor});
		}
	};
	this.deshabilitar = function(){
		this.select.classList.add('deshabilitado');
		var article = this.nodo.querySelector('article');
		article.onclick = function(){};
	};
	this.habilitar = function(){
		this.select.classList.remove('deshabilitado');
		var article = this.nodo.querySelector('article');
		article.onclick = function(){
			construirCapaSelect(this);
		};
	};
	this.limpiar = function(){
		this.select.selectedIndex = 0;
	};
	this.construir();
};

/*----------------------------------Funciones del Objeto Select-------------------------------*/
construirCapaSelect= function(capaSelect){
	capaSelect.onclick=function(){};
	var opciones =[];
	var opcion = null;
	var nodo = null;
	var select = capaSelect.nextSibling;
	while(select.nodeName=='#text'){
		select=select.nextSibling;
	}
	var margen;
	for(var x = 0; x < select.options.length;x++){
		opcion = {
			nombre:select.options[x].textContent,
			value:select.options[x].value,
			nodo:null
		};

		nodo=document.createElement('div');
		nodo.setAttribute('option','');
		nodo.textContent=opcion.nombre;
		if(select.options[x]==select.options[select.selectedIndex]){
			nodo.setAttribute('selecionado','');
			margen='-'+parseInt(opciones.length*41)+'px';
			capaSelect.style.marginTop=margen;
		}

		nodo.style.transition='all '+parseInt(opciones.length*0.2)+'s ease-in-out';
		nodo.style.marginTop=parseInt(opciones.length*41)+'px';

		nodo.setAttribute('valor',opcion.value);
		nodo.onclick = capaClick;
		opcion.nodo=nodo;
		opciones.push(opcion);
		capaSelect.appendChild(nodo);
	}

	//creo el contenedor de las opciones
	capaSelect.style.opacity='1';
	capaSelect.style.height=parseInt(opciones.length*41)+'px';
	capaSelect.style.width='60px';
};

//funcion extraida de un bucle
function capaClick(e){
	//agrego el efecto Ripple
	agregarRippleEvent(this,e);
	var select = this.parentNode.nextSibling;
	while(select.nodeName=='#text'){
		select=select.nextSibling;
	}
	select.value=this.getAttribute('valor');
	destruirCapaSelect(this.parentNode);
}

destruirCapaSelect = function(capaSelect){
	var lista = capaSelect.childNodes;
	var opcion;
	capaSelect.style.opacity='0';
	capaSelect.style.height='100%';
	capaSelect.style.width='100%';
	capaSelect.style.marginTop='0px';
	for(var x = 0;x < lista.length;x++){
		lista[x].style.transition='all 0.3s linear';
		lista[x].style.marginTop='0px';
	}
	setTimeout(function(){
		while(capaSelect.childNodes.length>0){
			capaSelect.removeChild(capaSelect.lastChild);
		}
		capaSelect.onclick=function(){
			construirCapaSelect(this);
		};
	},300);
};
/****************************************************************************************************************************************/
arranque();
function arranque(){
	//aviso al motor que el script arranco
	jarvis.libCargada("comboBox");
}
