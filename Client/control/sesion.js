
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
		jarvis.construc.construirAcceso();
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

	this.listarPlugs = function(){
		this.socket.emit('plugs',{
			operacion: 'listar',
		});
	};
	this.inicializarConexion = function(){
		this.socket=io.connect('http://192.168.88.156:4000');
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
				if(jarvis.construc.estructuraActiva===null){
					jarvis.construc.construirInicio();
					jarvis.construc.llenarMenu();
					UI.agregarToasts({
						texto: "Bienvenido "+jarvis.session.nombreUsu,
						tipo: 'web-arriba-derecha'
					});
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
		this.socket.on('contacto',function(data){
			if(data.accion === 'seguir'){
				var newContac = jarvis.buscarLib('Chat').op.crearChatUnit(data.user);
				UI.buscarVentana('ListadoChats').nodo.appendChild(newContac.userChatCard);
			  UI.agregarToasts({
			    texto: data.user.nombreUsu+' te ha agregado',
			    tipo: 'web-arriba-derecha-alto'
			  });
			}else if(data.accion === 'borrar'){
				jarvis.buscarLib('Chat').op.eliminarChatUnit(data.user.nombreUsu);
			}
		});
		this.socket.on('chatMsg',function(data){
			if(data.tipo=='envio'){
				jarvis.traza('mensaje llego a receptor','chat');
				data.estado = 'R';
				//envio el cambio de estado
				var newData = {
					tipo: 'cambioEstado',
					id : data.id,
					mensaje : 'recibidoPorReceptor',
					emisor : data.emisor
				};
				//en caso de que este el chat abierto lo escribo en el chat
				if(jarvis.buscarLib('Chat').op.chatActivo){
					if(jarvis.buscarLib('Chat').op.chatActivo.user.nombreUsu === data.emisor){
						newData.estado = 'L';
						jarvis.buscarLib('Chat').op.agregarMensaje(data);
					}else{
						//cuando el chat esta inactivo aumento el numero de mensajes pendientes y los aumento
						newData.estado='R';
						jarvis.buscarLib('Chat').op.activarNotificacion(data);
					}
				}else{
					//cuando no hay ningun chat activo
					newData.estado='R';
					jarvis.buscarLib('Chat').op.activarNotificacion(data);
				}
				jarvis.traza('envio cambio de estado','chat');
				jarvis.session.socket.emit('chatMsg',newData);
			}else if(data.tipo=='cambioEstado'){
				jarvis.traza('cambio de estado '+data.estado,'chat');
				jarvis.traza(data,'chat');
				if(jarvis.buscarLib('Chat')){
					jarvis.buscarLib('Chat').op.actualizarMensaje(data);
				}
			}
		});
		this.recuperarSession();
	};

	//metodos ejecutados en la instanciacion del objeto
	this.inicializarConexion();
};
