//variable para busqueda de indice de librerias
var conexionIndice;


//----------------------------------------------OBJETO LIBRERIA--------------------------------------//
var Libreria = function(atributos,tipo){

	this.nombre = atributos.nombre;
	this.ruta = atributos.ruta;
	this.noUsaCarga = atributos.noUsaCarga;
	this.tipo = tipo.toLowerCase();
	this.cargada = false;
	this.estado = 'sin usar';
	this.dependencias = [];
	//usado en la espera de la ejecucion del script de la libreria
	this.intervaloID = null;

	//aqui se guarda el obj que se encuentra dentro de la libreria para poder acceder a sus metodos
	this.op = null;

	this.crearTag = function(){
		if(this.tipo=="javascript"){
			//creo el elemento
			var script = document.createElement("script");
			//le asigno los atributos
			script.setAttribute("nombre",this.nombre);
			script.type="text/javascript";
			script.src=this.ruta;
			//lo retorno
			return script;
		}else if(this.tipo=="css"){
			//creo el elemento
			var link = document.createElement("link");
			//le asigno los atributos
			link.setAttribute("nombre",this.nombre);
			link.rel="stylesheet";
			link.type="text/css";
			link.href=this.ruta;
			//lo retorno
			return link;
		}
	};

	this.tag = this.crearTag();
};
//----------------------------------------------OBJETO ASISTENTE--------------------------------------//
var Asistente = function(objArranque){

	//---------------------------------------ATRIBUTOS PRIMARIOS--------------------------------------//
	this.librerias = [ ];
	this.contendor = document.getElementsByTagName("head")[0];
	this.construc = null;
	this.session = null;
	this.estado = "sinArrancar";
	this.intervaloID = null;

	//--------------------------------------ATRIBUTOS SECUNDARIOS-------------------------------------//
	this.intervaloID="";
	//este valor marca si las trazas por consola se muestran o no:
		//activa: muestra todos los tipos
		//inactiva: no muestra ninguna
		//o recibe un arreglo con los tipos que desea mostrar
		//disponibles: chat, session y libreria
	this.trazas = [];
	this.objArranque =objArranque;
	this.indice = null;
	//-------------------------------------------METODOS---------------------------------------------//
	//---------------------------Metodos de utilizacion de indice------------------------------------//
	this.buscarIndice = function(){
		this.estado = "cargandoIndice";
		var ruta = "control/indice.json";
		return new Promise(function(resolve,reject){

			req=crearXMLHttpRequest();
			req.onreadystatechange = function(){
				if (req.readyState == 4){
					if (req.status == 200) {
						//la resuelvo
								jarvis.estado = 'procesandoIndice';
				        resolve(req.responseText);

					}else{
				      //la rechazo
							jarvis.estado = 'ErrorEnCargaDeIndice';
				    	reject('rechazada');
					}
			  }
			};
			req.open('GET',ruta, true);
			req.send();
		})
			.then(JSON.parse,function(){
				console.log('ErrorEnCargaDeIndice');
			});
	};

	this.cargarIndice = function(json){
		var yo = this;
		return new Promise(function(resolve,reject){
			var Librerias = json.librerias;
			yo.indice = Librerias;
			yo.estado = 'cargandoLibrerias';

			//cargo el javascript
			Librerias.javascript.forEach(function(libreria){
				yo.addLib(libreria,"javascript");
			});
			//y luego el css
			Librerias.css.forEach(function(libreria){
				yo.addLib(libreria,"css");
			});

			yo.estado = "enLinea";
			resolve();
		});
	};
	//---------------------------Metodos para la utilizacion de librerias---------------------------//
	this.verificarLibreria = function(lib){
		var validado=false;

		for(var x=0;x<this.librerias.length;x++){
			if((this.librerias[x].nombre==lib.nombre)&&(this.librerias[x].tipo==lib.tipo)){
				validado=true;
			}
		}
		return validado;
	};

	this.buscarLib = function(nombre){
		var librerias = this.librerias;
		for(var x=0;x<librerias.length;x++){
			if((librerias[x].nombre==nombre)&&(librerias[x].tipo=="javascript")){
				return librerias[x];
			}
		}
		return false;
	};
	this.addLib=function(libreria,tipo){
		//instancio una nueva libreria
		var lib = new Libreria(libreria,tipo);
		if(libreria.dependencias){
			for(var i = 0; i < libreria.dependencias.length; i++){
				var newLib = this.addLib(libreria.dependencias[i],"javascript");
				lib.dependencias.push(newLib);
			}
		}
		//verifico si la libreria añadida ya se encuentra agregada
		if(!this.verificarLibreria(lib)){
			//si no esta agregada con anterioridad la agrego al arreglo
			this.librerias[this.librerias.length]=lib;
			//dejo la traza de que fue agregada
			jarvis.traza(libreria.nombre+" fue agregada al indice",'libreria');
		}
		return lib;
	};

	this.usarLib = function(nombreLib,callback){
		var libreria = jarvis.buscarLib(nombreLib);
		libreria.estado = 'enUso';
		//TODO: carga de librerias css asincronas
		if(jarvis.estado === 'enLinea'){
			this.montarLib(nombreLib,callback);
		}else{
			var intervaloID = setInterval(function(){
				var lib = jarvis.buscarLib(nombreLib);
				lib.intervaloID = intervaloID;
				if(jarvis.estado === 'enLinea'){
					jarvis.montarLib(nombreLib,callback);
					clearInterval(lib.intervaloID);
				}
			},30);
		}
	};
	this.montarLib = function(nombreLib,callback){
		var lib = jarvis.buscarLib(nombreLib);
		if(lib){
			if(lib.dependencias){
				lib.dependencias.forEach(function(dep){
					jarvis.usarLib(dep.nombre);
				});
			}
			//luego la agrego al documento en forma de script
			this.contendor.appendChild(lib.tag);
			//ejecutamos un intervalo de carga
			if(lib.tipo === 'javascript'){
				if(!lib.noUsaCarga){
					this.iniciarEsperaCarga(lib.nombre,callback);
				}
			}
		}else{
			console.log('no existe '+nombreLib);
		}
		return lib;
	};

	this.usarLib = function(nombreLib,callback){
		var libreria = jarvis.buscarLib(nombreLib);
		//TODO: carga de librerias css asincronas
		if(libreria.estado == 'enUso'){
			return this.montarLib(nombreLib,callback)
				.then(function(lib){
					lib.estado = 'enUso';
					return lib;
				});
		}else{
			return lib;
		}
	};

	this.montarLib = function(nombreLib,callback){
		var yo = this;
		return new Promise(function(resolve,reject){
			var lib = jarvis.buscarLib(nombreLib);
			if(lib){
				if(lib.tipo === 'javascript'){
					if(lib.dependencias){
						lib.dependencias
							.map(function(dep){
								yo.montarLib(dep.nombre);
							})
							.reduce(function(sequence,lib){
								return sequence.then(function(){
									return lib;
								});
							},Promise.resolve());
					}
					var r = false;
			        lib.tag.async = true;
			        lib.tag.onload = lib.tag.onreadystatechange = function () {
			            if (!r && (!this.readyState || this.readyState == "complete")) {
			                r = true;
			                resolve(lib);
			            }
			        };
			        lib.tag.onerror = lib.tag.onabort = reject;
					yo.contendor.appendChild(lib.tag);
				}else{
					console.log(nombreLib);
					reject('no existe '+nombreLib);
				}
			}else{
				this.contendor.appendChild(lib.tag);
		    	return Promise.resolve(lib);
			}
		});
	};
	//--------------------------- Metodos Auxiliares ------------------------------------------//

	this.mostrarlibrerias = function(){
		console.log(this.librerias);
	};

	this.arranque = function(){
		this.estado = "arrancando";
		var lista=this.contendor.childNodes;
		//agrego a mis librerias los scritps(js) y link(css) que se encuentran en el cuerpo del index
		for(var x=0;x<lista.length;x++){
			if(lista[x].nodeName=="#text"){
				lista[x].parentNode.removeChild(lista[x]);
				x--;
			}else if((lista[x].nodeName.toLowerCase()=="script")||(lista[x].nodeName.toLowerCase()=="link")){
				var tipo = lista[x].getAttribute("type").substring(5,lista[x].getAttribute("type").length);
				var nombre = lista[x].getAttribute("nombre");
				var ruta;
				if(tipo=="css"){
					ruta = lista[x].getAttribute("href");
				}else if(tipo=="javascript"){
					ruta = lista[x].getAttribute("src");
				}
				var lib = new Libreria(nombre,ruta,tipo);
				this.librerias[this.librerias.length]=lib;
				lib.cargada=true;
				lib.estado = 'enUso';
			}
		}
		//luego cargo el indice
		var yo = this;
		this.buscarIndice()
			.then(function(indice){
				return yo.cargarIndice(indice);
			})
			.then(function(){
				return Promise.all(
					yo.objArranque.LibreriasArranque.map(function(nombre){
						return yo.montarLib(nombre);
					}))
				.then(function(result){
					console.log(result);
				});
			})
			.then(function(){
					yo.load = "completado";
					yo.objArranque.onLoad();
			},function(){
				console.log('error');
			});
	};
	this.traza = function(aMostrar,tipo){
		if(this.trazas === 'activa'){
			console.log(aMostrar);
			return;
		}else if(typeof this.trazas !== 'string'){
			for(i = 0; i < this.trazas.length; i++){
				if(this.trazas[i] === tipo){
					console.log(aMostrar);
					return;
				}
			}
		}else {
			console.log('sinTrazasActivas');
			return;
		}
	};
	//metodos ejecutados en la creacion del objeto
	this.arranque();
};
//--------------------------MOTOR AJAX---------------------------------------------------
function crearXMLHttpRequest()
{
  var xmlHttp=null;
  if (window.ActiveXObject)
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  else
    if (window.XMLHttpRequest)
      xmlHttp = new XMLHttpRequest();
  return xmlHttp;
}
