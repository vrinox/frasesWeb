var conexionChat;
var ChatManager = function(){

	this.chatSession = jarvis.session;

	this.chats = [];
	//---------------------------------FUNCIONES DASHBOARD----------------------------//
	this.construirDashBoard = function(){
		var chatContenedor = document.createElement('div');
		chatContenedor.id = "chatCon";
		var html = "<div dashBoard id='dashBoard' >"+
						"<div estado='oculto' id='dashCab' dashCab><i id='chatIcon' class='iconMjs'><div id='chatTitle' dashtitle>Mensajes</div></i></div>"+
						"<div dashOpcs id='dashOpcs'>"+
							"<div dashOpc>Cargando</div>"+
						"</div>"+
					"</div>";
		chatContenedor.innerHTML = html;
		document.body.appendChild(chatContenedor);
	};
	this.mostarDash = function(){
		var dash = document.getElementById('chatCon');
		var cabecera = document.getElementById('dashCab');
		var titulo = document.getElementById('chatTitle');
		var icon = document.getElementById('chatIcon');
		dash.style.left="0%";
		cabecera.style.marginRight="0px";
		cabecera.style.width="100%";
		titulo.style.width = "100px";
	};

	this.ocultarDash = function(){
		var dash = document.getElementById('chatCon');
		var cabecera = document.getElementById('dashCab');
		var titulo = document.getElementById('chatTitle');
		var icon = document.getElementById('chatIcon');
		dash.style.left="-31%";
		cabecera.style.marginRight="-60px";
		cabecera.style.width="60px";
		titulo.style.width = "0px";
	};
	this.darVida = function(){
		var cabecera = document.getElementById('dashCab');
		dashCab.onclick = function(){
			if(this.getAttribute('estado')=="oculto"){
				jarvis.buscarLib('Chat').op.mostarDash();
				this.setAttribute('estado','visible');
			}else if(this.getAttribute('estado')=="visible"){
				jarvis.buscarLib('Chat').op.ocultarDash();
				this.setAttribute('estado','oculto');
			}
		};
	};
	//---------------------------------FUNCIONES DASHBOARD----------------------------//
	this.pedirP2P = function(){
		conexionChat=crearXMLHttpRequest();
		conexionChat.onreadystatechange = function(){
			//RESPUESTA
			if(conexionChat.readyState == 4){
				var xml=conexionChat.responseXML;
				var success = xml.getElementsByTagName('success')[0].textContent;
				var contenedor=document.getElementById('dashOpcs');
				if(success==1){
					var p2p = xml.getElementsByTagName('p2p')[0].childNodes;
					var persona;
					var html="";
					var user;
					var userChatCard;
					contenedor.innerHTML="";
					for(var x=0;x<p2p.length;x++){
						persona=p2p[x];
						user = {
							nombreUsu : persona.getElementsByTagName('nombreUsu')[0].textContent,
							nombre : persona.getElementsByTagName('nombre')[0].textContent,
							apellido : persona.getElementsByTagName('apellido')[0].textContent,
						};
						//cargo la lista de chat en el arreglo
						var newChat = jarvis.buscarLib('Chat').op.crearChatUnit(user);
						//lo agrego al dashboard
						contenedor.appendChild(newChat.userChatCard);
					}
				}else{
					contenedor.innerHTML="<div dashOpc>Fallo la carga</div>";
					jarvis.buscarLib("Chat").op.pedirP2P();
				}
			}
		};

		//PETICION
		conexionChat.open('POST','corChat', true);
		conexionChat.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="TipoPet="+encodeURIComponent("web")+"&Operacion="+encodeURIComponent("cargarp2p");
		envio+="&Nombre="+encodeURIComponent(jarvis.session.nombreUsu);
		conexionChat.send(envio);
	};
	this.agregarMsg = function(dataMsg){
		console.log('mensaje Agregado por recepcion\n'+dataMsg);
		var usuario = dataMsg.emisor;
		var msg = createMsgBubble(dataMsg);
		var clear=document.createElement('div');
		clear.setAttribute('clear','');
		var chatBody = document.getElementById('chatBodyOf'+usuario);
		chatBody.appendChild(msg);
		chatBody.appendChild(clear);
	};
	//-----------------------------------GESTION DE CHATS--------------------------------------------
	this.crearChatUnit = function(user){
		var newChat=new ChatUnit(user);
		this.chats.push(newChat);
		return newChat;
	};
	this.buscarChatUnit = function(userName){
		var chatArray = this.chats;
		for(var x = 0;x < chatArray.length; x++){
			if(chatArray[x].user.nombreUsu==userName){
				return chatArray[x];
			}
		}
		return -1;
	};
	this.controlChats = function(nombreUsu){
		var chats = this.chats;
		Chat=this.buscarChatUnit(nombreUsu);
		for(var x = 0;x<chats.length;x++){
			if(Chat.id==chats[x].id){
				if(chats[x].estado=='activo'){
					chats[x].desactivarChat();
				}else{
					chats[x].activarChat();
				}
			}else{
				chats[x].desactivarChat();
			}
		}
	};
	this.listarChats = function(){
		var chatArray = this.chats;
		var lista = "lista de chats:\n";
		for(var x = 0;x < chatArray.length; x++){
			lista += "\t Nombre:"+chatArray[x].user.nombreUsu+"\n\tEstado:"+chatArray[x].estado+"\n";
		}
		console.log(lista);
	};
	//------------------------------------ELEMENTO CHAT-------------------------------//

	var ChatUnit = function(user){
		//-------------------------- Partes ----------------------//
		var Cabecera = function(nodo){
			this.estado = 'enUso';
			this.nodo=nodo;
		};

		var Cuerpo = function(user){
			this.estado = 'porConstruir';
			this.nodo = null;

			this.construirNodo = function(){
				var contenido = document.createElement("div");
				contenido.setAttribute('chatBody','');
				contenido.setAttribute('contChat','iniciando');
				contenido.id='chatBodyOf'+user;
				//contenido cuando esta cargando
				var html="";
				html+="<div gif></div><div texto>Cargando Chat</div>";
				contenido.innerHTML = html;
				this.nodo=contenido;
				this.estado = 'enUso';
			};
			this.construirNodo();
		};

		var Pie =function(user){
			this.estado = 'porConstruir';
			this.nodo = null;

			this.construirNodo = function(){
				var pie = document.createElement('div');
				html = '<textarea chatField placeholder="Escriba un mensaje aqui"></textarea>';
				html += '<input chatSendBtn type="button" onclick="enviarMsg(this)">';
				pie.setAttribute('chatFoot','');
				pie.id = 'chatFootOf' + user;
				pie.innerHTML = html;
				this.nodo=pie;
				this.estado = 'enUso';
			};
			this.construirNodo();
		};
		//--------------------------Fin Partes ----------------------//
		this.id = null;
		this.estado = 'inactivo';

		//datos del usuario
		this.user = user;

		//mensajes pendientes
		this.msgPend = 0;

		//nodo fisico del chat
		this.userChatCard = null;
		this.partes = [];

		this.construirNodo = function(){
			this.crearIdChat();
			var user = this.user;
			this.userChatCard = createCard(user,'chat');
			this.agregarParte('cabecera');
			this.partes.cabecera.nodo.onclick=function(){
				jarvis.buscarLib('Chat').op.controlChats(user.nombreUsu);
			};
		};

		this.activarChat = function(){
			if(this.partes.cuerpo){
				this.userChatCard.style.height='290px';
				this.estado='activo';
			}else{
				var user = this.user.nombreUsu;
				var chatUnit=this;

				//cambios en chat
				this.userChatCard.style.height="90px";

				//agrego las partes al chat
				chatUnit.agregarParte('cuerpo');
				chatUnit.agregarParte('pie');

				//Funcionamiento de peticion y respuesta
				conexionChat = crearXMLHttpRequest();
				conexionChat.onreadystatechange = function(){
					//RESPUESTA
					if(conexionChat.readyState == 4){
						console.log('RESPUESTA CARGA CHAT');
						var xml = conexionChat.responseXML;
						var success = xml.getElementsByTagName('success')[0].textContent;
						var userName = xml.getElementsByTagName('user')[0].textContent;
						var chat = jarvis.buscarLib('Chat').op.buscarChatUnit(userName);
						//cambio el estado chat a activo
						chat.estado='activo';
						var chatBody = chat.partes.cuerpo.nodo;
						var mensaje;
						chatBody.innerHTML="";
						chatBody.style.height='200px';
						chat.userChatCard.style.height='290px';
						if(success==1){
							var messages = xml.getElementsByTagName('messages')[0].childNodes;
							var msg;
							var clear;
							for(var m = 0;m < messages.length;m++){
								//estructura de la etiqueta msg
								mensaje = {
									id : messages[m].getElementsByTagName('id')[0].textContent,
									emisor : messages[m].getElementsByTagName('emisor')[0].textContent,
									fecha : messages[m].getElementsByTagName('fecha')[0].textContent,
									contenido : messages[m].getElementsByTagName('cont')[0].textContent,
									estado : messages[m].getElementsByTagName('estado')[0].textContent
								};
								msg = createMsgBubble(mensaje);
								clear=document.createElement('div');
								clear.setAttribute('clear','');
								chatBody.appendChild(msg);
								chatBody.appendChild(clear);
							}
						}
					}
				};
				//PETICION
				conexionChat.open('POST','corChat', true);
				conexionChat.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				var envio="TipoPet="+encodeURIComponent("web")+"&Operacion="+encodeURIComponent("cargarChat");
				envio+="&Nombre="+encodeURIComponent(jarvis.session.nombreUsu)+"&Chat="+encodeURIComponent(user);
				conexionChat.send(envio);
			}
		};
		this.desactivarChat = function(){
			var nodo = this.userChatCard.style.height='50px';
			this.estado='inactivo';
		};
		this.agregarParte = function(tipo){
			var nuevaParte;
			var clear = document.createElement('div');
			clear.setAttribute('clear','');
			switch(tipo.toLowerCase()){
				case 'cabecera':
					nuevaParte = new Cabecera(this.userChatCard.firstChild);
					this.partes.cabecera=nuevaParte;
				break;
				case 'cuerpo':
					nuevaParte = new Cuerpo(this.user.nombreUsu);
					this.partes.cuerpo=nuevaParte;
				break;
				case 'pie':
					nuevaParte = new Pie(this.user.nombreUsu);
					this.partes.pie=nuevaParte;
				break;
			}
			this.userChatCard.appendChild(clear);
			this.userChatCard.appendChild(nuevaParte.nodo);
		};
		this.crearIdChat = function(){
		    var text = "";
		    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		    for( var i=0; i < 5; i++ ){
		        text += possible.charAt(Math.floor(Math.random() * possible.length));
		    }
		    this.id = text;
		};
		this.construirNodo();
	};

	//----------------------------------FIN ELEMENTO CHAT-----------------------------//


};
//--------------------------------------FUNCIONAMIENTO DE CARGA DE SCRIPT-------------------//
arranque();
function arranque(){
	//aviso al motor que el script arranco
	jarvis.libCargada("Chat");
	//agrego el operador a la libreria
	jarvis.buscarLib("Chat").op = new ChatManager();
	jarvis.buscarLib("Chat").op.construirDashBoard();
	jarvis.buscarLib("Chat").op.darVida();
	//carga chat
	jarvis.buscarLib("Chat").op.pedirP2P();
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
//--------------------------------Fin Notificaciones ------------------------
function createCard(data,tipo,forma){
		forma = forma || 'objeto';
		var card = document.createElement('card');
		var iniciales = data.nombre.substr(0,1).toUpperCase()+data.apellido.substr(0,1).toUpperCase();
		var seccionDerecha = "";
		if(tipo == 'chat'){

			card.id = 'cardChatOf'+data.nombreUsu;
			card.setAttribute('cardChat',data.nombreUsu);
			seccionDerecha = "<div opciones onmouseout='regresarNot(this)'><div contenido >2</div></div><div notificaciones onmouseover='moverNot(this)'><div contenido>1</div></div>";

		}
		var html = "";
		html += "<div chatCab><div cardLogo><div iniciales>"+iniciales+"</div></div><div cardTitle >"+data.nombre+" "+data.apellido+"</div>";
		html += seccionDerecha+"</div>";
		card.innerHTML = html;
		return card;
	}
/*-------------------------------------------------------Mensajes----------------------------------------------*/
function createMsgBubble(data){
	var msg = document.createElement('div');
	msg.setAttribute('msgBubble','');
	msg.textContent = data.contenido;
	msg.id='msg'+data.id;
	if(data.fecha){
		msg.fecha=data.fecha;
	}
	if(data.emisor!=jarvis.session.nombreUsu){
		msg.setAttribute('orientacion','izquierda');
	}else{
		msg.setAttribute('orientacion','derecha');
	}
	//faltan elementos fecha, estado
	return msg;
}
function enviarMsg(btnEnviar){
	var usuario = btnEnviar.parentNode.id.substr(10,btnEnviar.parentNode.id.length);
	var chatField = btnEnviar.previousSibling;
	if(chatField.value.trim()!==""){
		var data = {
			id : crearIdChat(),
			contenido : chatField.value,
			receptor : usuario,
			emisor : jarvis.session.nombreUsu,
			tipo : 'envio'
		};
		console.log(data);
		var msg = createMsgBubble(data);
		var clear=document.createElement('div');
		clear.setAttribute('clear','');
		var chatBody = document.getElementById('chatBodyOf'+usuario);
		chatBody.appendChild(msg);
		chatBody.appendChild(clear);
		chatField.value="";
		//-----------------------------------------------------------------Funcion de Envio ---------------------------------
		var socket=jarvis.session.socket;
		socket.emit('chatMsg',data);
	}
}
//Borrar
crearIdChat = function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
