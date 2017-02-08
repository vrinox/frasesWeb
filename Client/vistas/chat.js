var conexionChat;
var ChatManager = function(){

	this.chatSession = jarvis.session;

	this.chats = [];
	this.contactos = [];
	this.chatActivo = null;
	//---------------------------------FUNCIONES DE DATOS----------------------------//
	this.pedirP2P = function(callback){
		var peticion = {
			Nombre: jarvis.session.nombreusu,
			Operacion: "cargarp2p",
			entidad: "chat",
			TipoPet:"web"
		};
		var yo = this;
		torque.Operacion(peticion)
			.then(JSON.parse)
			.then(function(respuesta){
				if(respuesta.success){
					var p2p = respuesta.p2p;
					yo.contactos=[];
					for(var x=0;x<p2p.length;x++){
						yo.contactos.push({
							nombreusu : p2p[x].nombreusu,
							nombre : p2p[x].nombre,
							apellido : p2p[x].apellido,
							pendientes : p2p[x].pendientes
						});
					}
					if(callback){
						callback(yo.contactos);
					}
				}else{
					UI.agregarToasts({
					    texto:'error al cargar contactos intente mas tarde',
					    tipo: 'web-arriba-derecha-alto'
					});
					jarvis.buscarLib("Chat").op.pedirP2P(callback);
				}
			});
	};
	//---------------------------------FUNCIONES DE CONSTRUCCION----------------------------//
	this.crearChatUnit = function(user){
		var newChat=new ChatUnit(user);
		this.chats.push(newChat);
		return newChat;
	};
	this.buscarChatUnit = function(userName){
		var chatArray = this.chats;
		for(var x = 0;x < chatArray.length; x++){
			if(chatArray[x].user.nombreusu==userName){
				return chatArray[x];
			}
		}
		return false;
	};
	this.eliminarChatUnit = function(userName){
		var chatUnit = this.buscarChatUnit(userName);
		if(chatUnit){
			chatUnit.userChatCard.parentNode.removeChild(chatUnit.userChatCard);
			this.chats.splice(this.chats.indexOf(chatUnit),1);
		}
	};
	this.listarChats = function(){
		var chatArray = this.chats;
		var lista = "lista de chats:\n";
		for(var x = 0;x < chatArray.length; x++){
			lista += "\t Nombre:"+chatArray[x].user.nombreusu+"\n\tEstado:"+chatArray[x].estado+"\n";
		}
		console.log(lista);
	};

	this.mostrarUsuario = function(){
		console.log(jarvis.session.nombreusu);
	};
	//---------------------------------FUNCIONES DE MENSAJES----------------------------//
	this.actualizarMensaje = function(msgData){
		var contenedorMensajes = UI.buscarVentana('contenedorMensajes');
		var burbuja = contenedorMensajes.nodo.querySelector('div#msg'+msgData.id);
		if(!burbuja){
			burbuja = contenedorMensajes.nodo.querySelector('div#msg'+msgData.idtemp);
		}
		if(burbuja){
			var contFecha = burbuja.querySelector('article[hora]');
			var contEstado = burbuja.querySelector('article[estado]');
			if(msgData.fecha){
				contFecha.textContent = msgData.fecha.substr(0,16);
			}
			if(contEstado){
				contEstado.textContent = msgData.estado;
				contEstado.setAttribute('estado',msgData.estado);
			}
		}
	};
	this.agregarMensaje = function(data){
		var msg = createMsgBubble(data);
		var clear=document.createElement('div');
		clear.setAttribute('clear','');
		var chatBody =  UI.buscarVentana('contenedorMensajes').nodo;
		chatBody.appendChild(msg);
		chatBody.appendChild(clear);
    	chatBody.scrollTop = '9999';
	};
	//---------------------------------FUNCIONES DE NOTIFICACIONES----------------------------//
	this.activarNotificacion = function(data){
		var chat = this.buscarChatUnit(data.emisor);
		console.log(chat);
		var divPendientes =chat.userChatCard.querySelector('div[notificaciones]');
		var texto = divPendientes.querySelector('div[contenido]');
		if(divPendientes.classList.contains('invisible')){
			divPendientes.classList.remove('invisible');
		}
		var valor = parseInt(texto.textContent);
		texto.textContent = valor + 1;
	};
};
var ChatUnit = function(user){
		this.id = null;
		this.estado = 'inactivo';
		this.nodo = null;

		//datos del usuario
		this.user = user;

		//mensajes pendientes
		this.msgPend = 0;

		//nodo fisico del chat
		this.userChatCard = null;

		this.construirNodo = function(){
			this.id = this.crearIdUnico();
			var user = this.user;
			this.userChatCard = createCard(user,'chat');
			var yo = this;
			this.userChatCard.onclick = function(){
				yo.activarChat();
			};
		};

		this.activarChat = function(){
			jarvis.buscarLib('Chat').op.chatActivo = this;
			//vacio el campo de texto
			UI.buscarVentana('panelEsc').buscarSector('escritura').nodo.querySelector('textarea').value="";
			var user = this.user.nombreusu;
			var chatUnit=this;


			//funcionamiento paneles
			var contenedorMensajes = UI.buscarVentana('contenedorMensajes');

			contenedorMensajes.nodo.classList.add('visible');
			UI.buscarVentana('ListadoChats').nodo.classList.add('oculto');
			UI.buscarVentana('panelEsc').nodo.classList.add('visible');

			var boton = UI.elementos.cabecera.nodo.querySelector('button.listado');
			boton.classList.add('visible');
			boton.onclick=function(){
				UI.buscarVentana('ListadoChats').nodo.classList.remove('oculto');
				UI.buscarVentana('panelEsc').nodo.classList.remove('visible');
				UI.buscarVentana('contenedorMensajes').nodo.classList.remove('visible');
				boton.classList.remove('visible');
				boton.onclick=function(){};
			};
			//busco los mensajes
			var peticion = {
				entidad: "chat",
				operacion: 'cargarChat',
				nombre: jarvis.session.nombreusu,
				chat:user
			};
			var cuadro = {
				contenedor: contenedorMensajes.nodo,
				cuadro:{
					nombre:'Mensajes'+user,
					mensaje: "Cargando Mensajes de "+user
				}
			};
			torque.manejarOperacion(peticion,cuadro)
				.then(torque.evaluarRespuesta)
				.then(function(respuesta){
					var userName = respuesta.user;
					var chat = jarvis.buscarLib('Chat').op.buscarChatUnit(userName);
					//elimino el div de los mesajes pendientes
					var divPendientes = chat.userChatCard.querySelector('div[notificaciones]');
					if(divPendientes){
						var texto = divPendientes.querySelector('div[contenido]');
						divPendientes.classList.add('invisible');
						texto.textContent = 0;
					}
					//cambio el estado chat a activo
					chat.estado='activo';
					var mensajes = respuesta.mensajes;
					var msg;
					var clear;
					for(var m = 0;m < mensajes.length;m++){
						//estructura de la etiqueta msg
						mensaje = {
							id : mensajes[m].id,
							emisor : mensajes[m].emisor,
							fecha : mensajes[m].fecha,
							contenido : mensajes[m].cont,
							estado : mensajes[m].estado
						};
						jarvis.buscarLib('Chat').op.agregarMensaje(mensaje);
					}
    			contenedorMensajes.nodo.scrollTop = '9999';
					UI.buscarVentana('panelEsc').buscarSector('escritura').nodo.querySelector('button').onclick = function(){
						enviarMsg();
					};
				},function(){
					UI.agregarToasts({
						texto:'Error en la carga de mensajes',
						tipo:'web-arriba-derecha-alto'
					});
					UI.buscarVentana('panelEsc').buscarSector('escritura').nodo.querySelector('button').onclick = function(){
						enviarMsg();
					};
				});
		};
		this.desactivarChat = function(){
			this.estado='inactivo';
		};
		this.crearIdUnico = function(){
		    var text = "";
		    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		    for( var i=0; i < 5; i++ ){
		        text += possible.charAt(Math.floor(Math.random() * possible.length));
		    }
		    return text;
		};
		this.construirNodo();
	};

function createCard(data,tipo,forma){
	forma = forma || 'objeto';
	var card = document.createElement('card');
	var iniciales ;
	if(data.nombre){
		iniciales = data.nombre.substr(0,1).toUpperCase()+data.apellido.substr(0,1).toUpperCase();
	}else{
		iniciales = data.nombreusu.substr(0,1).toUpperCase();
	}
	var seccionDerecha = "";
	if(tipo == 'chat'){
		card.id = 'cardChatOf'+data.nombreusu;
		card.setAttribute('cardChat',data.nombreusu);
		seccionDerecha = "<div opciones onmouseout='regresarNot(this)'>"+
							"<div contenido class='material-icons bluegrey500 md-15'>settings</div>"+
						 "</div>";
		if(parseInt(data.pendientes)){
			seccionDerecha += "<div notificaciones onmouseover='moverNot(this)'>";
		}else{
			seccionDerecha += "<div notificaciones class='invisible' onmouseover='moverNot(this)'>";
		}
		seccionDerecha+="<div contenido >"+data.pendientes+"</div>"+
						"</div>";
	}
	var html = "";
	html += "<div chatCab>"+
				"<div cardLogo>"+
					"<div iniciales>"+iniciales+"</div>"+
				"</div>";
	if(data.nombre){
		html += "<div cardTitle >"+data.nombre+" "+data.apellido+"</div>";
	}else{
		html += "<div cardTitle >"+data.nombreusu+"</div>";
	}
	html += seccionDerecha+"</div>";
	card.innerHTML = html;
	return card;
}
/*-------------------------------------------------------Mensajes----------------------------------------------*/
function createMsgBubble(data){
	var msg = document.createElement('div');
	msg.setAttribute('msgBubble','');
	msg.id='msg'+data.id;
	var fecha = "";
	if(data.fecha){
		msg.fecha=separarFecha(data.fecha);
		fecha = msg.fecha.completa+" "+msg.fecha.hora;
	}
	var html = data.contenido+
					"<article hora>"+fecha+"</article>";
	if(data.emisor!==jarvis.session.nombreusu){
		msg.setAttribute('orientacion','izquierda');
	}else{
		msg.setAttribute('orientacion','derecha');
		html+="<article estado = "+data.estado+">"+data.estado+"</article>";
	}
	msg.innerHTML = html;
	//faltan elementos fecha, estado
	return msg;
}
function enviarMsg(){
	var chat = jarvis.buscarLib('Chat').op.chatActivo;
	var usuario = chat.user.nombreusu;
	var chatField = UI.buscarVentana('panelEsc').buscarSector('escritura').nodo.querySelector('textarea');
	if(chatField.value.trim()!==""){
		var data = {
			id : chat.crearIdUnico(),
			contenido : chatField.value,
			receptor : usuario,
			emisor : jarvis.session.nombreusu,
			estado: 'E',
			tipo : 'envio'
		};
		jarvis.buscarLib('Chat').op.agregarMensaje(data);
		chatField.value = "";
		//Funcion de Envio
		jarvis.session.socket.emit('chatMsg',data);
	}
}
//---------------------------------Notificaciones------------------------
function moverNot(notObj){
	if(notObj.style.marginRight != "0px"){
		notObj.style.marginRight = "0px";
	}

}
function regresarNot(opcObj){
	var notObj = opcObj.nextSibling;
	if(notObj.style.marginRight != "-18px"){
		notObj.style.marginRight = "-18px";
	}
}
function separarFecha(string){
	var fecha = {
		ano: string.substr(0,4),
		mes: string.substr(5,2),
		dia: string.substr(8,2),
		completa: "",
		hora: string.substr(11,5)
	};
	fecha.completa = fecha.dia+'-'+fecha.mes+'-'+fecha.ano;
	return fecha;
}
