
//variable para peticion asincrona de sesion
var conexionSess;
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
		jarvis.traza("peticion de recuperacion enviada",'session');
		this.socket.emit('session',{
			text:"recuperar",
			nombreUsu:this.nombreUsu
		});
		this.sesIntId = setInterval(function(){
			if(jarvis.session.nombreUsu!==""){
				jarvis.traza("temporalmente sin conexion",'session');
			}
		},30000);
	};

	this.identificacion = function(){
		jarvis.traza('identificacion enviada','session');
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
			},50000);
	};

	this.inicializarConexion = function(){
		this.socket=io.connect('http://192.168.0.105:4000');
		jarvis.traza('conectado1: '+this.socket.connected,'session');
		this.socket.on('connect',function(){
			jarvis.traza('conectado2: '+jarvis.session.socket.connected,'session');
		});
		var obj = this.socket;
		this.socket.on('identificacion',function(data){
			if(data.text=="falsa"){
				jarvis.session.nombreUsu="";
				jarvis.session.horaDeConexion="";
				jarvis.session.estado="cerrada";
				jarvis.construc.construirAcceso();
			}
		});
		this.socket.on('session',function(data){
			jarvis.traza('peticion recivida: '+data.text,'session');
			if(data.text=="recuperada")
			{
				jarvis.session.nombreUsu=data.nombreUsu;
				jarvis.session.horaDeConexion=data.horaCon;
				jarvis.session.estado="abierta";
				clearInterval(jarvis.session.sesIntId);
				jarvis.session.sesIntId=null;
				if(jarvis.construc.estructuraActiva=="acceso"){
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
				jarvis.traza('tiempo agotado inicie de nuevo','session');
				jarvis.session.nombreUsu="";
				jarvis.session.horaDeConexion="";
				jarvis.session.estado="cerrada";
				jarvis.construc.construirAcceso();
			}
			else if(data.text=="dobleSession")
			{
				jarvis.traza('sesion ya se encuentra iniciada en otro lugar','session');
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
				jarvis.traza('no hay sesion abierta','session');
			}
		});
		this.socket.on('chatMsg',function(data){
			if(data.tipo=='envio'){
				jarvis.traza('mensaje llego a receptor','chat');
				jarvis.buscarLib('Chat').op.listarChats();
				if(jarvis.buscarLib('Chat').op.buscarChatUnit(data.emisor).estado=='activo'){
					jarvis.traza(data.emisor,'chat');
					jarvis.buscarLib('Chat').op.agregarMsg(data);
					var newData = {
						id : data.id,
						estado : 'recibidoPorReceptor',
						emisor : data.emisor
					};
					jarvis.traza('envio cambio de estado','chat');
					jarvis.session.socket.emit('chatMsg',newData);
				}else{
					//cuando el chat esta inactivo aumento el numero de mensajes pendientes y los aumentos
				}
			}else if(data.tipo=='cambioEstado'){
				jarvis.traza('cambio de estado\n'+data,'chat');
			}
		});
		this.recuperarSession();

	};

	//metodos ejecutados en la instanciacion del objeto
	this.inicializarConexion();
};
//***********************************************************************************************************************
arranque();
function arranque(){
	//aviso al motor que el script arranco
	jarvis.libCargada("Session");
	//agrego el operador a la libreria
	jarvis.session = new Session();
}