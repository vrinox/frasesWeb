var conexionChat;
var chatUnit = function(user){
	this.user = user,
	this.estado = 'inactivo',
	this.msgPend = 0
}
var ChatManager = function(){

	this.chatSession = jarvis.session,
	
	this.chats = new Array(),

	this.construirDashBoard = function(){
		var chatContenedor = document.createElement('div');
		chatContenedor.id = "chatCon";
		var html = "<div dashBoard id='dashBoard' >\
						<div estado='oculto' id='dashCab' dashCab><i id='chatIcon' class='iconMjs'><div id='chatTitle' dashtitle>Mensajes</div></i></div>\
						<div dashOpcs id='dashOpcs'>\
							<div dashOpc>Cargando</div>\
						</div>\
					</div>";
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
		}
	};
	this.pedirP2P = function(){
		conexionChat=crearXMLHttpRequest();
		conexionChat.onreadystatechange = cargarp2p;
		conexionChat.open('POST','corChat', true);
		conexionChat.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="TipoPet="+encodeURIComponent("web")+"&Operacion="+encodeURIComponent("cargarp2p");
		envio+="&Nombre="+encodeURIComponent(jarvis.session.nombreUsu);
		conexionChat.send(envio);
	}
	this.activarChat = function(){
		var chatOpcs = document.getElementsByTagName('card');
		for(var x=0;x<chatOpcs.length;x++){
			chatOpcs[x].onclick = function(){
				var user = this.getAttribute('cardChat');
				var contenido = document.createElement("div");
				var pie = document.createElement('div');
				var clear1 = document.createElement('div');
				var clear2 = document.createElement('div');
				clear1.setAttribute('clear','');
				clear2.setAttribute('clear','');
				contenido.setAttribute('chatBody','');
				//inicio de carga
				var html="";
				//elemnts del body
				contenido.setAttribute('contChat','iniciando');
				contenido.id='chatBodyOf'+user;
				html+="<div gif></div><div texto>Cargando Chat</div>";
				contenido.innerHTML = html;
				//elementos del foot
				html = '<textarea chatField placeholder="Escriba un mensaje aqui"></textarea>';
				html += '<input chatSendBtn type="button" onclick="enviarMsg(this)">';
				pie.setAttribute('chatFoot','');
				pie.id = 'chatFootOf' + user;
				pie.innerHTML = html
				//cambios en chat
				this.style.height="auto";
				this.appendChild(clear1);
				this.appendChild(contenido);
				this.appendChild(clear2);
				this.appendChild(pie);
				//inciar chat
				conexionChat = crearXMLHttpRequest();
				conexionChat.onreadystatechange = cargarChat;
				conexionChat.open('POST','corChat', true);
				conexionChat.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				var envio="TipoPet="+encodeURIComponent("web")+"&Operacion="+encodeURIComponent("cargarChat");
				envio+="&Nombre="+encodeURIComponent(jarvis.session.nombreUsu)+"&Chat="+encodeURIComponent(user);
				console.log("peticion de chat enviada\n"+envio);
				conexionChat.send(envio);

				this.onclick=function(){};
			}
		}	
	}
	this.agregarMsg = function(dataMsg){
		console.log('mensaje Agregado por recepcion\n'+dataMsg);
		var usuario = dataMsg.emisor;
		var msg = createMsgBubble(dataMsg);
		var clear=document.createElement('div');
		clear.setAttribute('clear','');
		var chatBody = document.getElementById('chatBodyOf'+usuario);
		chatBody.appendChild(msg);
		chatBody.appendChild(clear);
	}
	this.listarChats = function(){
		var chatArray = this.chats;
		var lista = "lista de chats:\n"
		for(var x = 0;x < chatArray.length; x++){
			lista += "\t Nombre:"+chatArray[x].user.nombreUsu+"\n\tEstado:"+chatArray[x].estado+"\n";
		}
		console.log(lista);
	}
	this.buscarChatUnit = function(userName){
		var chatArray = this.chats;
		for(var x = 0;x < chatArray.length; x++){
			if(chatArray[x].user.nombreUsu==userName){
				return chatArray[x];
			}
		}
		return -1;
	}
	this.listarChats = function(){
		var chatArray = this.chats;
		var lista = "lista de chats:\n"
		for(var x = 0;x < chatArray.length; x++){
			lista += "\t Nombre:"+chatArray[x].user.nombreUsu+"\n\tEstado:"+chatArray[x].estado+"\n";
		}
		console.log(lista);
	}
	//---------------------------------FUNCIONES DASHBOARD----------------------------//
	

}
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
function cargarp2p(){
	if(conexionChat.readyState == 4){
		var xml=conexionChat.responseXML;
		var success = xml.getElementsByTagName('success')[0].textContent;
		console.log('cargo Dash');
		var contenedor = document.getElementById("dashOpcs");
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
				}
				//cargo la lista de chat en el arreglo
				jarvis.buscarLib('Chat').op.chats.push(new chatUnit(user));
				userChatCard = createCard(user,'chat');
				contenedor.appendChild(userChatCard);	
			}
			jarvis.buscarLib('Chat').op.activarChat();
		}else{
			var contenedor = document.getElementById("dashOpcs");
			contenedor.innerHTML="<div dashOpc>Fallo la carga</div>";
			jarvis.buscarLib("Chat").op.pedirP2P();
		}
	}
}
function cargarChat(){
	if(conexionChat.readyState == 4){
		var xml=conexionChat.responseXML;
		var success = xml.getElementsByTagName('success')[0].textContent;
		var userName = xml.getElementsByTagName('user')[0].textContent;
		var chatBody = document.getElementById('chatBodyOf'+userName);
		var mensaje;
		chatBody.innerHTML="";
		chatBody.style.height='200px';
		//cambio el estado chat a activo
		jarvis.buscarLib('Chat').op.buscarChatUnit(userName).estado='activo';
		if(success==1){
			var messages = xml.getElementsByTagName('messages')[0].childNodes;
			var msg;
			var clear;
			for(var m = 0;m < messages.length;m++){
				//estructura de la etiqueta msg
				mensaje = {
					id : messages[m].getElementsByTagName('id')[0].textContent,
					receptor : messages[m].getElementsByTagName('emisor')[0].textContent,
					fecha : messages[m].getElementsByTagName('fecha')[0].textContent,
					contenido : messages[m].getElementsByTagName('cont')[0].textContent,
					estado : messages[m].getElementsByTagName('estado')[0].textContent
				}
				msg = createMsgBubble(mensaje);
				clear=document.createElement('div');
				clear.setAttribute('clear','');
				chatBody.appendChild(msg);
				chatBody.appendChild(clear);				
			}
		}
	}
}

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
function createCard(data,tipo,forma){
		forma = forma || 'objeto';
		var card = document.createElement('card');
		var iniciales = data.nombre.substr(0,1).toUpperCase()+data.apellido.substr(0,1).toUpperCase();
		var seccionDerecha = "";
		if(tipo == 'chat'){

			card.id = 'cardChatOf'+data.nombreUsu;
			card.setAttribute('cardChat',data.nombreUsu);
			seccionDerecha = "<div opciones onmouseout='regresarNot(this)'><div contenido>2</div></div><div notificaciones onmouseover='moverNot(this)'><div contenido>1</div></div>";

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
	if(chatField.value.trim()!=""){		
		var data = {
			id : crearIdChat(),
			contenido : chatField.value,
			receptor : usuario,
			emisor : jarvis.session.nombreUsu,
			tipo : 'envio'
		}
		console.log(data.id);
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
function crearIdChat()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}