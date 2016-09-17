var Lista = function(data){
	/*------------------------------Objeto BarraPaginacion-------------------*/
	var BarraPaginacion = function(atributos){
		/*------------------------------Objeto Pagina-------------------*/
		var Pagina = function(atributos){
			this.atributos = atributos;
			this.nodo = null;
			this.construirNodo = function(){
				var nodo = document.createElement('article');
				nodo.setAttribute('pagina','');
				nodo.textContent = this.atributos.numero;
				if(this.atributos.clase){
					nodo.classList.add(this.atributos.clase);
				}
				this.nodo = nodo;
			};
			this.construirNodo();
		};
		this.atributos = atributos;
		this.nodo = null;
		this.paginas = [];
		this.construirNodo = function(){
			var nodo = document.createElement('section');
			nodo.setAttribute('slot','');
			nodo.classList.add('barra-paginacion');
			nodo.innerHTML = "<div cont-pag></div><div busq-pag>"+
											"<input type='text' placeHolder='num'><l>ir</l>"+"</div>";
			this.nodo = nodo;
			this.agregarPaginas();
		};
		this.agregarPaginas = function(){
			if(this.paginas.length){
				this.limpiarPaginas();
			}
			var paginacion = this.atributos;
			if(paginacion.paginaActual > 3){
				this.agregarPagina(1,'primera');
			}
			this.agregarPagina(paginacion.paginaActual-2);
			this.agregarPagina(paginacion.paginaActual-1);
			this.agregarPagina(paginacion.paginaActual,'actual');
			this.agregarPagina(paginacion.paginaActual+1);
			this.agregarPagina(paginacion.paginaActual+2);
			if(paginacion.paginaActual < paginacion.paginas-3){
				this.agregarPagina(paginacion.paginas,'ultima');
			}
		};
		this.agregarPagina = function(numero,clase){
			if((numero > 0)&&(numero <= this.atributos.paginas)){
				var pagina = new Pagina({'numero':numero,'clase':clase});
				this.nodo.querySelector('div[cont-pag]').appendChild(pagina.nodo);
				this.paginas.push(pagina);
			}
		};
		this.buscarPagina = function(numero){
			for (var i = 0; i < this.paginas.length; i++) {
				if(this.paginas[i].atributos.numero === numero){
					return this.paginas[i];
				}
			}
			return false;
		};
		this.quitarPagina = function quitar(pag){
			var pagina = this.buscarPagina(pag);
			pagina.nodo.parentNode.removeChild(pagina.nodo);
			this.paginas.splice(this.paginas.indexOf(pagina),1);
		};
		this.limpiarPaginas = function(){
			var barra = this;
			var longitud = this.paginas.length;
			for(var x = 0; x < longitud; x++){
				this.quitarPagina(this.paginas[0].atributos.numero);
			}
		};
		this.construirNodo();
	};
  /*------------------------------Objeto Slot-------------------*/
  var Slot = function(registro){
		/*------------------------------Objeto celda-------------------*/
		var Celda = function(atributos){
			this.atributos = atributos;
			this.nodo = null;
			this.clases = ['dos','tres','cuatro','cinco','seis','siete','ocho','adaptable'];

			this.construirNodo = function(){
				var nodo = document.createElement('div');
				if(this.atributos.tipo){
					nodo.setAttribute('cabeceraCelda',atributos.nombre);
				}else{
					nodo.setAttribute('celda',atributos.nombre);
				}
				nodo.textContent = atributos.valor;
				var indice = this.atributos.columnas - 2;
				if(indice > 6){
					indice = 7;
				}
				nodo.classList.add(this.clases[indice]);

				if(this.atributos.columnas > 8){
					nodo.classList.add('pequena');
				}
				this.nodo = nodo;

			};
			this.construirNodo();
		};
		/*------------------------------Objeto Selector-------------------*/
		var Selector = function(atributos){
			this.atributos = atributos;
			this.nodo = null;
			this.check = null;
			this.construirNodo = function(){
				var nodo = document.createElement('div');
				nodo.setAttribute('selector',this.atributos.codigo);
				this.nodo = nodo;
				this.check = new CheckBox({
						nombre: "selector"+this.atributos.nombre,
						valor: this.atributos.codigo,
						requerido: false,
						habilitado: true,
						animacion: 'girar',
						eslabon: 'area',
						sinTitulo: true,
						marcado: false,
						tipo: 'opciones'
				});
				this.nodo.appendChild(this.check.nodo);
			};
			this.activar = function(){
				this.check.nodo.click();
			};
			this.construirNodo();
		};
    this.atributos = registro;
    this.estado = 'sinInicializar';
    this.rol = 'lista';
    this.nodo = null;
		this.columnas = [];

    this.construirNodo = function(nombre){
      var nodo = document.createElement('section');
      nodo.setAttribute('slot','');
      nodo.id=this.atributos.codigo;
			this.nodo = nodo;
			if(registro.columnas!=1){
				//la celda con el checkbox como selector del registro o fila
				if(this.atributos.selector){
					if(this.atributos.selector.toLowerCase()!=='apagado'){
							this.agregarSelector(registro);
					}
				}else{
					this.agregarSelector(registro);
				}
				var x = 0;
				for (var variable in registro) {
					if(x < registro.columnas){
						if (registro.hasOwnProperty(variable)) {
							var dataCelda ={
								nombre: variable,
								valor: registro[variable],
								numero: x,
								columnas: registro.columnas,
								tipo: registro.tipo
							};
							this.agregarCelda(dataCelda);
							x++;
						}
					}else{
						break;
					}
				}
				var yo = this;
				if(this.selector){
					this.selector.check.asignarClick(function(){
						if(yo.selector.check.marcado === true){
							yo.nodo.classList.add("seleccionado");
							yo.estado = "seleccionado";
						}else{
							yo.nodo.classList.remove("seleccionado");
							yo.estado = "sinAsignar";
						}
					});
				}
			}else{
				var html ="";
				var titulo;
				var nombreAMostrar;
				if(data.campo_nombre){
					nombreAMostrar = data.campo_nombre;
				}else {
					nombreAMostrar = 'nombre';
				}
				if(this.atributos[nombreAMostrar].length>28){
					titulo=this.atributos[nombreAMostrar].substr(0,28)+'...';
				}else{
					titulo=this.atributos[nombreAMostrar];
				}
				html+="<article  title>"+titulo+"</article>";
				nodo.innerHTML=html;
				this.estado='enUso';
				this.funcionamiento();
			}
    };
    this.funcionamiento = function(){
      var nodo = this.nodo;
      var article =nodo.getElementsByTagName('article')[0];
      article.onclick=function(e){
        agregarRippleEvent(this.parentNode,e);
      };
    };

    this.reconstruirNodo = function(){
      var nodo=this.nodo;
      var slot=this;
      var titulo;
      var nombre;
      if(data.campo_nombre){
        nombre = data.campo_nombre;
      }else {
        nombre = 'nombre';
      }
      if(this.atributos[nombre].length>28){
        titulo=this.atributos[nombre].substr(0,28)+'...';
      }else{
        titulo=this.atributos[nombre];
      }
      var html="<article  title>"+titulo+"</article>";
      setTimeout(function(){
        nodo.innerHTML=html;
        slot.funcionamiento();
      },510);
    };

    this.destruirNodo = function(){
      var nodo = this.nodo;
      var slot = this;
      nodo.classList.add('desaparecer');
      setTimeout(function(){
        nodo.classList.add('desaparecerPorCompleto');
      },510);
      setTimeout(function(){
        nodo.parentNode.removeChild(nodo);
      },1110);
    };
    this.activar = function(){
      this.nodo.getElementsByTagName('article')[0].click();
    };
		this.agregarCelda = function(dataCelda){
			var newCelda = new Celda(dataCelda);
			this.nodo.appendChild(newCelda.nodo);
			this.columnas.push(newCelda);
			return newCelda;
		};
		this.agregarSelector = function(registro){
			this.selector = new Selector(registro);
			this.nodo.appendChild(this.selector.nodo);
		};
    this.construirNodo();
  };
  /*--------------------------Fin Objeto Slot-------------------*/

  this.Slots = [];
  this.atributos = data;
	this.atributos.nombre = data.nombre || data.titulo;
  this.atributos.onclickSlot = this.atributos.onclickSlot || null;
	this.clases = data.clases || [];
  this.columnas = data.columnas || 1;
	//paginacion
	this.paginaActual = 1;
	this.paginas = 1;
	this.valorBusqueda = '';
	this.registrosPorPagina = this.atributos.registrosPorPagina || 10;
	this.tamano = this.atributos.tamano|| 'libre';
	//UI
  this.nodo = null;

  this.construir = function(){
    var contenedor = data.contenedor || 'noPosee';
    var nodo = document.createElement('div');
    nodo.setAttribute('lista','');
    nodo.setAttribute('mat-window','');

    //contruir sector busqueda
    var html='';
		var alto = ((this.tamano==='libre')&&(this.Slots<this.registrosPorPagina))?'auto':parseInt((this.registrosPorPagina*40)+70)+'px';
		html+="<section cont-slots style='height:"+alto+"'>";
    html+="<section busqueda>";
    html+=	"<div titulo>"+this.atributos.titulo+"</div>";
    html+=	"<div listBuscar>";
    html+=		"<input type='text' placeHolder='Buscar...'campBusq>";
    html+=		"<button type='button' cerrarBusq></button>";
    html+=	"</div>";
    html+=	"<button type='button' btnBusq ></button>";
		html+="</section>";
    html+="</section>";
    nodo.innerHTML = html;
    this.nodo = nodo;

    var botonBusqueda = nodo.getElementsByTagName('button')[1];
    var botonCerrarBusq = nodo.getElementsByTagName('button')[0];
		var lista = this;
    botonBusqueda.onclick = function(){
			lista.abrirCampoBusqueda();
		};
    botonCerrarBusq.onclick = function(){
			lista.cerrarCampoBusqueda();
		};

    //agrego la lista al contenedor
    if(contenedor !== 'noPosee'){
      contenedor.appendChild(this.nodo);
    }

    //carga de elementos ya sea por busqueda a la BD o que sean suministrados en la
    //construccion
    setTimeout(function(){
      lista.manejarCarga();
    },10);
    if(this.atributos.clases){
			UI.manejoDeClases(this);
		}
  };

  this.manejarPaginacion = function(){
		if((this.barraPaginacion)||(this.Slots.length === this.registrosPorPagina)){
			if(!this.barraPaginacion){
				this.barraPaginacion = new BarraPaginacion({
					paginas : this.paginas,
					paginaActual: this.paginaActual
				});
				this.nodo.appendChild(this.barraPaginacion.nodo);
			}else{
				this.barraPaginacion.atributos.paginaActual = parseInt(this.paginaActual);
				this.barraPaginacion.atributos.paginas = parseInt(this.paginas);
				this.barraPaginacion.atributos.registrosPorPagina = parseInt(this.registrosPorPagina);
				this.barraPaginacion.agregarPaginas();
			}
			var lista = this;
			this.barraPaginacion.paginas.forEach(function(each){
				each.nodo.onclick = function(e){
					agregarRippleEvent(this,e);
					lista.paginaActual = this.textContent;
					lista.recargar();
				};
			});
			this.barraPaginacion.nodo.querySelector('l').onclick = function(){
				var valor = parseInt(this.previousSibling.value);
				if(!isNaN(valor)){
					if((valor > 0)/*&&(valor <= lista.paginas)*/){
						lista.paginaActual = valor;
						lista.recargar();
					}else {
					  UI.agregarToasts({
					    texto: 'el valor debe ser menor a la cantidad de paginas',
					    tipo: 'web-arriba-derecha-alto'
					  });
					}
				}else{
				  UI.agregarToasts({
				    texto: 'El valor debe ser numerico',
				    tipo: 'web-arriba-derecha-alto'
				  });
				}
			};
		}
  };
	this.recargar = function(){
		this.limpiarSlots();
		this.manejarCarga();
	};
  this.manejarCarga = function(){
    var carga = this.atributos.carga;
    //si no posee la info del cuadro de carga toma los valore por defecto
    if(carga){
      var contenedor = this.crearContenedorCarga();
      if(!carga.espera){
        carga.espera = {
          contenedor: contenedor,
          cuadro:{
            nombre: this.atributos.titulo,
            mensaje: 'Buscando',
            clases: ['lista']
          }
        };
      }else{
        carga.espera.contenedor = contenedor;
      }
      if(!carga.peticion){
        console.log('no se puede realizar una carga de elementos sin una peticion');
      }else{
        var lista = this;
				//manejo paginacion
				carga.peticion.pagina = this.paginaActual;
				if(!carga.peticion.valor){
					carga.peticion.valor = this.valorBusqueda;
				}
				carga.peticion.registrosPorPagina = this.registrosPorPagina;

        torque.manejarOperacion(carga.peticion,carga.espera,function cargaAutomaticaLista(respuesta){
          lista.removerContenedorCarga();
          if(respuesta.success){
            lista.cargarElementos(respuesta.registros);
						lista.paginas = respuesta.paginas;
				    lista.manejarPaginacion();
          }else{
            lista.noExistenRegistros();
          }
          if(lista.atributos.carga.respuesta){
            lista.atributos.carga.respuesta(lista);
          }
      	});
    	}
    }else if(this.atributos.elementos){
      //si lo elementos de la lista fueron suministrados en la creacion
      this.cargarElementos(this.atributos.elementos);
    }else{
      console.log('la lista se encuentra vacia');
    }
  };
	this.limpiarSlots = function(){
		var longitud =this.Slots.length;
		for (var i = 0; i < longitud; i++) {
			this.quitarSlot(this.Slots[0].atributos);
		}
	};
  this.crearContenedorCarga = function(){
    var contenedor = document.createElement('section');
    contenedor.setAttribute('contenedorCarga','');
    this.nodo.querySelector('section[cont-slots]').appendChild(contenedor);
    return contenedor;
  };
  this.removerContenedorCarga = function(){
    var contenedor = this.nodo.querySelector('section[contenedorCarga]');
    this.nodo.querySelector('section[cont-slots]').removeChild(contenedor);
  };
  this.noExistenRegistros = function(){
    var ayuda = document.createElement('section');
    ayuda.classList.add('vacio');
    ayuda.textContent = 'No existen Registros';
    this.nodo.querySelector('section[cont-slots]').appendChild(ayuda);
  };
  this.abrirCampoBusqueda = function(){
	var botonBusqueda = this.nodo.querySelector('button[btnbusq]');
    botonBusqueda.parentNode.classList.add('buscar');
		var lista = this;
    setTimeout(function(){
      botonBusqueda.onclick=function(){
				lista.buscarElementos();
			};
    },10);
  };

	this.cerrarCampoBusqueda = function(){
		var botonBusqueda = this.nodo.querySelector('button[btnbusq]');
		this.nodo.querySelector('input[campBusq]').value = "";
	  botonBusqueda.parentNode.classList.remove('buscar');
    botonBusqueda.click();
    this.controlLista();
		var lista = this;
     setTimeout(function(){
       botonBusqueda.onclick=function(){lista.abrirCampoBusqueda();};
     },20);
	};

  this.buscarElementos = function(){
		this.atributos.carga.peticion.valor = this.nodo.querySelector('input[campBusq]').value.toUpperCase();
		this.recargar();
  };

  this.listarSlots = function(){
    console.log('Slots:');
    for(var x=0;x<this.Slots.length;x++){
      console.log('nombre: '+this.Slots[x].atributos.nombre+'\testado: '+this.Slots[x].estado);
    }
  };
  this.agregarSlot = function(data){
		if( this.nodo.querySelector('section.vacio')){
			var vacio = this.nodo.querySelector('section.vacio');
			vacio.parentNode.removeChild(vacio);
		}
		data.columnas = this.columnas;
    var slot = new Slot(data);
    this.Slots.push(slot);
    this.nodo.querySelector('section[cont-slots]').appendChild(slot.nodo);
    var lista = this;
    if(this.atributos.onclickSlot!==null){
      slot.nodo.onclick = function(){
        lista.controlLista(this);
        lista.atributos.onclickSlot(slot);
      };
    }
		this.verificarBoton();
    return slot.nodo;
  };
	this.quitarSlot = function(objeto){
		var slot = this.buscarSlot(objeto);
		slot.destruirNodo();
		this.Slots.splice(this.Slots.indexOf(slot),1);
		if(!this.Slots.length){
			this.noExistenRegistros();
		}
		this.verificarBoton();
	};
	this.verificarBoton = function(){
		if(this.Slots.length<this.registrosPorPagina){
			this.nodo.querySelector('button[btnBusq]').classList.add('invisible');
		}else{
			this.nodo.querySelector('button[btnBusq]').classList.remove('invisible');
		}
	};
  this.cargarElementos = function(registros){
		if(this.columnas !== 1){
			if(!this.atributos.sinCabecera){
				this.agregarCabecera(registros);
			}
		}
    for(var x=0; x<registros.length;x++){
			registros[x].selector = this.atributos.selector;
      this.agregarSlot(registros[x]);
    }
  };
	this.agregarCabecera = function(registros){
		var cabeceras = {};
		var x = 0;
		if(!this.cabecera){
			for (var variable in registros[0]) {
				if(x < this.columnas){
					if (registros[0].hasOwnProperty(variable)){
						cabeceras[variable]=variable;
						x++;
					}
				}else{
					break;
				}
			}
			cabeceras.tipo = 'cabecera';
			cabeceras.selector = this.atributos.selector;
			this.agregarSlot(cabeceras);
			var newSlot = this.Slots[0];
			this.cabecera = newSlot;
			var lista = this;
			if(newSlot.selector){
				newSlot.selector.check.asignarClick(function(){
					var marcado = newSlot.selector.check.marcado;
					lista.Slots.forEach(function(slot){
						if(slot.selector.check.marcado !== marcado){
							slot.selector.activar();
						}
					});
				});
			}
			this.Slots.splice(this.Slots.indexOf(newSlot),1);
		}
	};
  this.controlLista = function(nodo){
    var obj=false;
    for(var x=0;x<this.Slots.length;x++){
      if(this.Slots[x].nodo==nodo){
        this.Slots[x].estado='seleccionado';
        this.Slots[x].nodo.classList.add('seleccionado');
        obj=this.Slots[x];
      }else{
        this.Slots[x].estado='enUso';
        this.Slots[x].nodo.classList.remove('seleccionado');
      }
    }
  };

  this.buscarSlot = function(objeto){
    for(x=0;x<this.Slots.length;x++){
      if(this.Slots[x].atributos.codigo==objeto.codigo){
        return this.Slots[x];
      }
    }
    console.log('el slot no existe');
    return false;
  };

  this.buscarSlotPorNombre = function(objeto){
    for(x=0;x<this.Slots.length;x++){
      if(this.Slots[x].atributos.nombre==objeto.nombre){
        return this.Slots[x];
      }
    }
    console.log('el slot no existe');
    return false;
  };

  this.cambiarTextoSlots = function(cambio){
    if(cambio=='mediaQuery'){
      for(var x=0;x<this.Slots.length;x++){
        var nodo=this.Slots[x].nodo;
        var slot=this.Slots[x];
        var titulo;
        if(slot.atributos.nombre.length>28){
          titulo=slot.atributos.nombre.substr(0,28)+'...';
        }else{
          titulo=slot.atributos.nombre;
        }
        var html="<article  title>"+titulo+"</article>]";
        nodo.innerHTML=html;
        slot.funcionamiento();
      }
    }else{
      for(var i=0;i<this.Slots.length;i++){
        var contenido = "<article  title>"+this.Slots[i].atributos.nombre+"</article>";
        this.Slots[i].nodo.innerHTML = contenido;
        this.Slots[i].funcionamiento();
      }
    }
  };

  this.actualizarLista = function(cambios){
    if(cambios instanceof Array){

    }else{
      this.actualizarSlot(cambios);
    }
  };

  this.actualizarSlot = function(objeto){
    var slot=this.buscarSlot(objeto);
    var yo = this;
    if(slot){
      slot.atributos=objeto;
      slot.reconstruirNodo();
      setTimeout(function() {
        yo.controlLista(slot.nodo);
      }, 510);
    }
  };

  this.obtenerSeleccionado = function(){
    var seleccionado=false;
    for(var x=0;x<this.Slots.length;x++){
      if(this.Slots[x].estado=='seleccionado'){
        seleccionado=this.Slots[x];
      }
    }
    return seleccionado;
  };
  this.destruirNodo = function(){
		this.nodo.style.height='0px';
		var l = this;
		setTimeout(function(){
			l.nodo.parentNode.removeChild(l.nodo);
		},510);
	};
  this.construir();
};
<<<<<<< HEAD
/****************************************************************************************************************************************/
arranque();
function arranque(){
  //aviso al motor que el script arranco
  jarvis.libCargada("lista");
}
=======
>>>>>>> refs/remotes/origin/Actualizacion-Rhino
