//funcion para obtener el nombre del constructor
Object.prototype.getName = function() { 
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((this).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};

//variable para peticion asincrona de sesion
var conexionSess;
//variable para busqueda de indice de librerias
var conexionIndice;

//----------------------------------------------OBJETO SESSION--------------------------------------//
var Session = function(){

	this.nombreUsu = "";

	this.horaDeConexion = "";

	this.estado = "cerrada";

	this.socket = null;

	this.sesIntId = null;

	this.cerrarSession= function(){
		this.destruirSession();
	};

	this.destruirSession = function(){
		this.socket.emit('session',{
			text:'cerrar',
			nombreUsu:this.nombreUsu
		});
	};

	this.recuperarSession = function(){
		console.log("peticion de recuperacion enviada");
		this.socket.emit('session',{
			text:"recuperar",
			nombreUsu:this.nombreUsu
		});
		this.sesIntId = setInterval(function(){
			if(jarvis.session.nombreUsu!=""){
				console.log("temporalmente sin conexion");
				//alert("conexion perdida");
			}
		},30000);
	};

	this.identificacion = function(){
		console.log('identificacion enviada');
		this.socket.emit('identificacion',{
			nombre: jarvis.session.nombreUsu,
			HDC: jarvis.session.horaDeConexion
		});
		if(this.sesIntId!==null){
			clearInterval(this.sesIntId);
			this.sesIntId=null;
		}
		setInterval(function(){
				jarvis.session.recuperarSession();
			},50000)
	};

	this.inicializarConexion = function(){
		this.socket=io.connect('http://192.168.0.104:4000');
		console.log('conectado1',this.socket.connected);
		this.socket.on('connect',function(){
			console.log('conectado2',jarvis.session.socket.connected);
		});
		var obj = this.socket;
		this.socket.on('identificacion',function(data){
			if(data.text=="falsa"){
				jarvis.session.nombreUsu="";
				jarvis.session.horaDeConexion="";
				jarvis.session.estado="cerrada";
				jarvis.construc.construirAcceso();
			}
		})
		this.socket.on('session',function(data){
			console.log('peticion recivida: '+data.text);
			if(data.text=="recuperada")
			{
				jarvis.session.nombreUsu=data.nombreUsu;
				jarvis.session.horaDeConexion=data.horaCon;
				jarvis.session.estado="abierta";
				clearInterval(jarvis.session.sesIntId);
				jarvis.session.sesIntId=null;
				if(jarvis.construc.mostrarEstEnUso()=="basica"){
					jarvis.construc.construirInicio();
				}
			}
			else if(data.text=="cerrada")
			{
				jarvis.session.nombreUsu="";
				jarvis.session.horaDeConexion="";
				jarvis.session.estado="cerrada";
				jarvis.construc.construirAcceso();
			}
			else if(data.text=="agotada")
			{
				console.log('tiempo agotado inicie de nuevo');
				jarvis.session.nombreUsu="";
				jarvis.session.horaDeConexion="";
				jarvis.session.estado="cerrada";
				jarvis.construc.construirAcceso();
			}
			else if(data.text=="dobleSession") 
			{
				console.log('sesion ya se encuentra iniciada en otro lugar');
				alert("hubo un intento de acceso a su cuenta desde otra ubicacion");
			}
			else if(data.text=="no recuperada")
			{
				if(this.sesIntId!==null){
					clearInterval(this.sesIntId);
					this.sesIntId=null;
				}
			}
			else
			{
				console.log('no hay sesion abierta');
			}
		});
		this.socket.on('chatMsg',function(data){
			if(data.tipo=='envio'){
				console.log('mensaje llego a receptor');
				jarvis.buscarLib('Chat').op.listarChats();
				if(jarvis.buscarLib('Chat').op.buscarChatUnit(data.emisor).estado=='activo'){
					console.log(data.emisor);
					jarvis.buscarLib('Chat').op.agregarMsg(data);
					var newData = {
						id : data.id,
						estado : 'recibidoPorReceptor',
						emisor : data.emisor
					}
					console.log('envio cambio de estado');
					jarvis.session.socket.emit('chatMsg',newData);
				}else{
					//cuando el chat esta inactivo aumento el numero de mensajes pendientes y los aumentos
				}
			}else if(data.tipo=='cambioEstado'){
				console.log('cambio de estado\n'+data)
			}
		});
		this.recuperarSession();
		
	}

	//metodos ejecutados en la instanciacion del objeto
	this.inicializarConexion();
}
//----------------------------------------------OBJETO LIBRERIA--------------------------------------//
var Libreria = function(nombre,ruta,tipo){

	this.nombre = nombre;
	this.ruta = ruta;
	this.tipo = tipo.toLowerCase();
	this.cargada = false;
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
}
//----------------------------------------------OBJETO ASISTENTE--------------------------------------//
var Asistente = function(){

	//---------------------------------------ATRIBUTOS PRIMARIOS--------------------------------------//
	this.librerias = [ ];
	this.contendor = document.getElementsByTagName("head")[0];
	this.construc = null;
	this.session = new Session();
	this.estado = "sinArrancar";
	this.intervaloID = null;

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
	}

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
		var lib = -1;
		for(var x=0;x<librerias.length;x++){
			if((librerias[x].nombre==nombre)&&(librerias[x].tipo=="javascript")){
				lib = librerias[x];
			}
		}
		return lib;
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
			console.log(libreria.nombre+" fue agregada al indice");
		}
		return lib;
	};
	
	this.usarLib = function(nombreLib){
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
	}
	this.montarLib = function(nombreLib){
		var lib = jarvis.buscarLib(nombreLib);
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
	//------------------------------Metodos de carga de scripts--------------------------------//

	this.libCargada = function(nombre){
		var libreria = this.buscarLib(nombre);
		if(libreria!=-1){
			libreria.cargada = true;
			console.log(nombre+" cargada");
		}else{
			console.log("libreria "+nombre+" no se encuentra en el indice");
		}
	};
	
	this.iniciarEsperaCarga = function(nombreLib){
		this.intervaloID = setInterval(function(){jarvis.verificarCarga(nombreLib)},10);
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
			console.log("libreria "+nombreLib+" ya se encuentra lista para usar");
			var avisoEsp=document.getElementById('avisoEsp');
			avisoEsp.parentNode.removeChild(avisoEsp);
		}else{
			console.log("libreria "+nombreLib+" cargando");
		}
	}
	
	//--------------------------- Metodos Auxiliares ------------------------------------------//
	
	this.mostrarlibrerias = function(){
		alert(JSON.stringify(this.librerias));
	}; 

	this.arranque = function(){
		window.onbeforeunload=function(){jarvis.session.socket.close();};
		this.estado = "arrancando"
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
		//luego cargo el indice
		this.buscarIndice();
	};
	
	//metodos ejecutados en la creacion del objeto
	this.arranque();
}
//--------------------------RESPUESTAS ---------------------------------------------------
procesarIndice = function(){
	if(conexionIndice.readyState == 4){
		var json=JSON.parse(conexionIndice.responseText);
		jarvis.estado = 'procesandoIndice';
		jarvis.cargarIndice(json);
	}
}
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
