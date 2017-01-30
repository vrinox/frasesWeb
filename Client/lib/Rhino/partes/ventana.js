var Ventana = function(atributos){
	//-----------------Titulo---------------------------
	var Titulo = function(atributos){

		this.nodo = null;
		this.atributos = atributos;
		//valores por defecto
		atributos.tipo = atributos.tipo || 'basico';

		this.construirNodo = function(){

			var nodo = document.createElement('section');
			nodo.setAttribute('titulo','');

			nodo.innerHTML = atributos.texto || atributos.html;
			nodo.classList.add(atributos.tipo);

			this.nodo = nodo;
		};
		this.construirNodo();
	};
	//--------------------Sector----------------------------
	var Sector = function(atributos){
		this.nodo = null;
		this.atributos = atributos;
		this.atributos.tipo = atributos.tipo || 'sector';
		this.campos = [];
		this.clases = atributos.clases || [];

		this.construirNodo = function(){

			var nodo = document.createElement('section');
			nodo.setAttribute(this.atributos.tipo,'');

			if(atributos.html){
				nodo.innerHTML = atributos.html;
			}

			this.nodo = nodo;
			if(atributos.formulario){
				this.agregarFormulario({
					plano: atributos.formulario,
					tipo:atributos.tipo,
					registroAct: atributos.registro
				});
				atributos.alto = atributos.formulario.altura;
			}

			if(atributos.alto){
				nodo.style.height=atributos.alto+'px';
			}

			if(atributos.tipo){
				this.nodo.setAttribute(atributos.tipo,'');
			}
			if(this.atributos.clases){
				UI.manejoDeClases(this);
			}
		};
		this.agregarFormulario = function(objForm){
			objForm.contenedor = this.nodo;
			this.formulario = new Formulario(objForm);
		};
		this.desvanecerNodo = function(){
			this.nodo.classList.add('desaparecer');
			var s = this;
			setTimeout(function () {
				s.nodo.parentNode.removeChild(s.nodo);
			}, 710);
		};
		this.destruirNodo = function(){
			this.nodo.parentNode.removeChild(this.nodo);
		};
		this.construirNodo();
	};
	//--------------------fin Objeto Sector--------------------
	this.atributos = atributos;
	this.estado = 'porConstruir';
	this.sectores = [];
	this.nodo = null;
	this.clases = atributos.clases || [];

	this.construirNodo = function(){
		var nodo = document.createElement('div');
		nodo.setAttribute('mat-window','');
		nodo.classList.add(this.atributos.tipo);
		this.nodo = nodo;

		if(atributos.titulo){
			this.agregarTitulo(this.atributos.titulo);
		}

		if(atributos.sectores){
			for(var x = 0; x < atributos.sectores.length; x++){
				this.agregarSector(atributos.sectores[x]);
			}
		}

		if(atributos.alto){
			this.nodo.style.height = atributos.alto+'px';
		}
		if(this.atributos.clases){
			UI.manejoDeClases(this);
		}
	};
	this.agregarSector = function(atributos){
		var sector = new Sector(atributos);
		this.sectores.push(sector);
		this.nodo.appendChild(sector.nodo);
		return sector;
	};
	this.buscarSector = function(nombre){
		for(var x = 0; x < this.sectores.length; x++){
			if(this.sectores[x].atributos.nombre){
				if(this.sectores[x].atributos.nombre===nombre){
					return this.sectores[x];
				}
			}
		}
		return false;
	};

	this.quitarSector = function(nombre){
		var sector = this.buscarSector(nombre);
		sector.destruirNodo();
		this.sectores.splice(this.sectores.indexOf(sector),1);
	};
	this.desvanecerSector = function(nombre) {
		var sector = this.buscarSector(nombre);
		sector.desvanecerNodo();
		this.sectores.splice(this.sectores.indexOf(sector),1);
	};

	this.agregarTitulo = function(atributos){
		var titulo = new Titulo(atributos);
		this.nodo.insertBefore(titulo.nodo,this.nodo.firstChild);
		this.titulo = titulo;
	};

	this.destruirNodo = function(){
		this.nodo.style.height='0px';
		var v = this;
		setTimeout(function(){
			v.nodo.parentNode.removeChild(v.nodo);
		},510);
	};
	this.construirNodo();
};
