//funcion para obtener el nombre del constructor
Object.prototype.getName = function() {
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((this).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};

//variable para busqueda de indice de librerias
var conexionIndice;


//----------------------------------------------OBJETO LIBRERIA--------------------------------------//
var Libreria = function(nombre,ruta,tipo){

	this.nombre = nombre;
	this.ruta = ruta;
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
var Asistente = function(){

	//---------------------------------------ATRIBUTOS PRIMARIOS--------------------------------------//
	this.librerias = [ ];
	this.contendor = document.getElementsByTagName("head")[0];
	this.construc = null;
	this.session = null;
	this.estado = "sinArrancar";
	this.intervaloID = null;
	//este valor marca si las trazas por consola se muestran o no:
		//activa: muestra todos los tipos
		//inactiva: no muestra ninguna
		//o recibe un arreglo con los tipos que desea mostrar
		//disponibles: chat, session y libreria
	this.trazas = 'inactiva';

	//--------------------------------------ATRIBUTOS SECUNDARIOS-------------------------------------//
	this.intervaloID="";

	//-------------------------------------------METODOS---------------------------------------------//
	//---------------------------Metodos de utilizacion de indice------------------------------------//
	this.buscarIndice = function(){
		this.estado = "cargandoIndice";
		var ruta = "control/indice.json";
		conexionIndice=crearXMLHttpRequest();
		conexionIndice.onreadystatechange = procesarIndice;
		conexionIndice.open('GET',ruta, true);
		conexionIndice.send();
	};

	this.cargarIndice = function(json){
		var Librerias = json.librerias;
		this.estado = 'cargandoLibrerias';

		//cargo el javascript
		Librerias.javascript.forEach(function(libreria){
			jarvis.addLib(libreria,"javascript");
		});
		//y luego el css
		Librerias.css.forEach(function(libreria){
			jarvis.addLib(libreria,"css");
		});

		this.estado = "enLinea";
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
		var lib = new Libreria(libreria.nombre,libreria.ruta,tipo);
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

	this.usarLib = function(nombreLib){
		jarvis.buscarLib(nombreLib).estado = 'enUso';
		//TODO: carga de librerias css asincronas
		if(jarvis.estado !== 'enLinea'){
			var intervaloID = setInterval(function(){
				var lib = jarvis.buscarLib(nombreLib);
				lib.intervaloID = intervaloID;
				if(jarvis.estado === 'enLinea'){
					jarvis.montarLib(nombreLib);
					clearInterval(lib.intervaloID);
				}
			},30);
		}else{
			this.montarLib(nombreLib);
		}
	};
	this.montarLib = function(nombreLib){
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
				if(lib.noUsaCarga){
					this.iniciarEsperaCarga(lib.nombre);
				}
			}	
		}
	};
	//------------------------------Metodos de carga de scripts--------------------------------//

	this.libCargada = function(nombre){
		var libreria = this.buscarLib(nombre);
		if(libreria!=-1){
			libreria.cargada = true;
			jarvis.traza(nombre+" cargada",'libreria');
		}else{
			jarvis.traza("libreria "+nombre+" no se encuentra en el indice",'libreria');
		}
	};

	this.iniciarEsperaCarga = function(nombreLib){
		this.intervaloID = setInterval(function(){jarvis.verificarCarga(nombreLib);},10);
		var avisoEsp = document.createElement("div");
		avisoEsp.setAttribute("cargando","");
		avisoEsp.id="avisoEsp";
		avisoEsp.innerHTML = "<div gif></div><div texto>Cargando librerias Necesarias</div>";
		document.body.insertBefore(avisoEsp,document.body.firstChild);
	};

	this.verificarCarga = function(nombreLib){
		if(this.buscarLib(nombreLib).cargada){
			clearInterval(this.intervaloID);
			this.intervaloID="";
			jarvis.traza("libreria "+nombreLib+" ya se encuentra lista para usar",'libreria');
			var avisoEsp=document.getElementById('avisoEsp');
			avisoEsp.parentNode.removeChild(avisoEsp);
		}else{
			jarvis.traza("libreria "+nombreLib+" cargando",'libreria');
		}
	};

	this.verificarDependencias = function(nombreLib){
		var lib = this.buscarLib(nombreLib);
		if(lib.cargada){
			lib.dependencias.forEach(function(each){
				if(!each.cargada){
					return false;
				}
			});
			return true;
		}else{
			return false;
		}
	};
	this.verificarLibreriasEnUso = function(){
		var libreriasActivas = this.buscarLibreriasEnUso();
		if (libreriasActivas.length) {
			var lib;
			for (var i = 0; i < libreriasActivas.length; i++) {
				lib = this.buscarLib(libreriasActivas[i]);
				if(!this.verificarDependencias(lib.nombre)){
					return false;
				}else{
					lib.estado = 'cargada';
				}
			}
			return true;
		}else{
			return false;
		}
	};

	this.buscarLibreriasEnUso = function(){
		var libreriasActivas = [];
		for (var i = 0; i < this.librerias.length; i++) {
			if(this.librerias[i].estado === 'enUso'){
				libreriasActivas.push(this.librerias[i].nombre);
			}
		}
		return libreriasActivas;
	};
	//--------------------------- Metodos Auxiliares ------------------------------------------//

	this.mostrarlibrerias = function(){
		alert(JSON.stringify(this.librerias));
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
			}
		}
		this.traza = function(aMostrar,tipo){
			if(this.trazas === 'activa'){
				console.traza(aMostrar);
				return;
			}else if(typeof this.trazas !== 'string'){
				for(i = 0; i < this.trazas; i++){
					if(this.trazas[i] === tipo){
						console.log(aMostrar);
						return;
					}
				}
			}else {
				return;
			}
		}
		//luego cargo el indice
		this.buscarIndice();
	};

	//metodos ejecutados en la creacion del objeto
	this.arranque();
};
//--------------------------RESPUESTAS ---------------------------------------------------
procesarIndice = function(){
	if(conexionIndice.readyState == 4){
		var json=JSON.parse(conexionIndice.responseText);
		jarvis.estado = 'procesandoIndice';
		jarvis.cargarIndice(json);
	}
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
