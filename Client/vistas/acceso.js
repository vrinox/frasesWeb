var conexionAcc;
var Acceso = function(){

	this.crearFormulario = function(){
		var html = "<div fondo><div>\
					<div contenedor-acc >\
						<div titulo-acc id='tituloAcc'>Acceso</div>\
						<div contenido-acc>\
							<form name='Acceso' method='Post' action='corAcceso'>\
								<i class='icono-usuario'></i>\
								<input type='text' name='AccNom' id='AccNom' placeholder='Nombre de Usuario'/><div salto></div>\
								<i class='icono-llave'></i>\
								<input type='password' name='AccPass' id='AccPass' placeholder='Clave'/><br>\
								<div ordenar></div>\
							</form>\
						</div>\
						<div botonera-acc><button type='button' id='BtAcc'>Ingresar</button><label id='registro'>Registrece</label></div>\
					</div>\
					<div ordenar></div>";
		return html;
	}
	 this.darVida = function(){
	 	var btEnviar = document.getElementById("BtAcc");
	 	var btRegistro = document.getElementById('registro');

	 	btEnviar.onclick=function(){
	 		ingresar();
	 		btEnviar.onclick=function(){}
	 	};

	 	btRegistro.onclick = function(){
	 		activarRegistro();
	 	};
	 };
}
function activarRegistro(){
 	var titulo = document.getElementById('tituloAcc');
 	var btEnviar = document.getElementById("BtAcc");
 	var btRegistro = document.getElementById('registro');
 	titulo.textContent='Registro';
 	btEnviar.textContent="Enviar";
 	btRegistro.textContent='¿Desea ingresar?';

 	btRegistro.onclick = function(){
 		activarAcceso();
 	};

 	btEnviar.onclick = function(){
 		registro();
 	};

 }
 function activarAcceso(){
 	var titulo = document.getElementById('tituloAcc');
 	var btEnviar = document.getElementById("BtAcc");
 	var btRegistro = document.getElementById('registro');
 	titulo.textContent='Acceso';
 	btEnviar.textContent="Ingresar";
 	btRegistro.textContent='Registrece';
 	
 	btRegistro.onclick = function(){
 		activarRegistro();
 	};

 	btEnviar.onclick = function(){
 		ingresar();
 	}
 }
//-----------------------------Acceso------------------------------------------------------------
function ingresar(){
	var campNom = document.getElementById("AccNom");
	var campPass = document.getElementById("AccPass");
	if((campNom.value!="")&&(campPass.value!="")){
		conexionAcc=crearXMLHttpRequest();
		conexionAcc.onreadystatechange = procesarAcc;
		conexionAcc.open('POST','corAcceso', true);
		conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="TipoPet="+encodeURIComponent("web")+"&Operacion="+encodeURIComponent("acceso");
		envio+="&Nombre="+encodeURIComponent(campNom.value)+"&Pass="+encodeURIComponent(campPass.value);
		conexionAcc.send(envio);
	}else{
		alert("por favor llene los campos para poder ingresar");
		activarAcceso();
	}

}
function procesarAcc(){
	if(conexionAcc.readyState == 4){
		//recivo el xml con los usuarios
		var xml=conexionAcc.responseXML;
		console.log("respuesta aceptada");
		console.log(xml);
		//cadenaHtml donde se guardan todas las partes a agregar
		if(xml.getElementsByTagName('success')[0].textContent==0){
			//extraigo el mensaje
			var mensaje=xml.getElementsByTagName('mensaje')[0].textContent;
			alert(mensaje);
			jarvis.buscarLib("Acceso").op.darVida();;
		}else{
			//extarigo los elementos
			var NombreUsu=xml.getElementsByTagName('NombreUsu')[0].textContent;
			var HoraCon=xml.getElementsByTagName('HoraCon')[0].textContent;
			//armo la session
			jarvis.session.nombreUsu=NombreUsu;
			jarvis.session.horaDeConexion=HoraCon;
			jarvis.session.estado="abierta";
			//envio los datos para la creacion de la session en el servidor
			jarvis.session.identificacion();
			//construyo el inicio
			jarvis.construc.construirInicio();			
		}
	}
}
//-------------------------------------Registro----------------------------------------------
function registro(){
	var campNom = document.getElementById("AccNom");
	var campPass = document.getElementById("AccPass");
	if((campNom.value!="")&&(campPass.value!="")){
		conexionAcc=crearXMLHttpRequest();
		conexionAcc.onreadystatechange = procesarReg;
		conexionAcc.open('POST','corAcceso', true);
		conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="TipoPet="+encodeURIComponent("web")+"&Operacion="+encodeURIComponent("registro");
		envio+="&Nombre="+encodeURIComponent(campNom.value)+"&Pass="+encodeURIComponent(campPass.value);
		conexionAcc.send(envio);
	}else{
		alert("por favor llene los campos para poder ingresar");
		activarRegistro();
	}
}
function procesarReg(){
	if(conexionAcc.readyState == 4){
		//recivo el xml con los usuarios
		var xml=conexionAcc.responseXML;
		//cadenaHtml donde se guardan todas las partes a agregar
		if(xml.getElementsByTagName('success')[0].textContent==0){
			//extraigo el mensaje
			var mensaje=xml.getElementsByTagName('mensaje')[0].textContent;
			alert(mensaje);
			activarRegistro();
		}else{
			//extarigo los elementos
			var mensaje=xml.getElementsByTagName('mensaje')[0].textContent;
			alert(mensaje);
			activarAcceso();
		}
	}
}