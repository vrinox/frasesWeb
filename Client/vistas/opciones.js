var conexionOpc;
//--------------------------------------OBJETO SETTINGS--------------------------------------//
var Settings = function(){

	this.construirOpciones = function(){
		var contenido = document.getElementById('capaContenido');
		var htmlForm1 = "<div titulo-opciones>Opciones<i id='cerrarOp' class='icon32 icon-white icon-cross'></i></div>\
						<div subtitulo-opciones>Actualizar Datos</div>\
						<div form-opciones>\
							<input type='text' name='nombre' id='nombre' placeholder='Nombres'>\
							<input type='text' name='apellido' id='apellido' placeholder='Apellidos'><br>\
							<input type='text' name='seudonimo' id='seudonimo' placeholder='Seudonimo'>\
							<input type='text' name='email' id='email' placeholder='Email'><br>\
							<button type='button' id='enviarDatosOp' disabled>Cargando</button>\
							<div ordenar></div>\
						</div>";
		var htmlForm2 = "<div subtitulo-opciones>Cambiar Clave</div>\
						<div form-opciones>\
							<input type='password' name='claveAc' id='clave' placeholder='clave actual'>\
							<input type='password' name='claveNew' id='newClave' placeholder='clave nueva'><br>\
							<input type='password' name='claveNew2' id='newClave2' placeholder='reigrese clave' ><br>\
							<button type='button' id='enviarClaveOp' >Enviar</button>\
							<div ordenar></div>\
						</div>";					
		contenido.innerHTML=htmlForm1+htmlForm2;
		document.getElementById('exterior').style.height="100%";
	};
	this.darVida = function(){
		//obtengo los botones de la vista creada
		var btEnviarDatos = document.getElementById('enviarDatosOp');
		var btenviarClave = document.getElementById('enviarClaveOp');
		var	campReinClave =document.getElementById('newClave2');
		var btSalir = document.getElementById('cerrarOp');
		//les asigno sus metodos
		campReinClave.onkeyup = function(){			
			var newClave=document.getElementById('newClave');
			var newClave2=document.getElementById('newClave2');
			if(newClave.value==newClave2.value){
				newClave2.style.backgroundColor='#26C281';
			}else{
				newClave2.style.backgroundColor='#D24D57';
			}
		}
		btSalir.onclick = function(){
			document.getElementById('exterior').click();
		}
		btEnviarDatos.onclick = function(){
			conexionOpc=crearXMLHttpRequest();
			conexionOpc.onreadystatechange = procesarUpdate;
			conexionOpc.open('POST','corAcceso', true);
			conexionOpc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			//obtengo los datos del formulario
			var email=document.getElementById('email').value;
			var apellido=document.getElementById('apellido').value;
			var nombre=document.getElementById('nombre').value;
			var seudonimo=document.getElementById('seudonimo').value;
			//declaro el envio
			var envio="TipoPet="+encodeURIComponent("web")+"&Operacion="+encodeURIComponent("actualizarDatos");
			envio+="&Nombre="+encodeURIComponent(nombre)+"&Apellido="+encodeURIComponent(apellido);
			envio+="&Email="+encodeURIComponent(email)+"&Seudonimo="+encodeURIComponent(seudonimo);
			envio+="&NombreUsu="+encodeURIComponent(jarvis.session.nombreUsu);
			conexionOpc.send(envio)
		}
		btenviarClave.onclick = function(){			
			var clave=document.getElementById('clave').value;
			var newClave=document.getElementById('newClave').value;
			var newClave2=document.getElementById('newClave2').value;
			if(newClave==newClave2){
				conexionOpc=crearXMLHttpRequest();
				conexionOpc.onreadystatechange = procesarUpdate;
				conexionOpc.open('POST','corAcceso', true);
				conexionOpc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				//obtengo los datos del formulario
				var email=document.getElementById('email').value;
				var apellido=document.getElementById('apellido').value;
				var nombre=document.getElementById('nombre').value;
				var seudonimo=document.getElementById('seudonimo').value;
				//declaro el envio
				var envio="TipoPet="+encodeURIComponent("web")+"&Operacion="+encodeURIComponent("actualizarClave");
				envio+="&Pass="+encodeURIComponent(clave)+"&NewClave="+encodeURIComponent(newClave);
				envio+="&Nombre="+encodeURIComponent(jarvis.session.nombreUsu);
				conexionOpc.send(envio)
			}else{
				alert("claves no coinciden");
			}
		}
	}
};
//--------------------------------------FUNCIONAMIENTO DE CARGA DE SCRIPT-------------------//
arranque();
function arranque(){
	//aviso al motor que el script arranco
	jarvis.libCargada("Opciones");
	//agrego el operador a la libreria
	jarvis.buscarLib("Opciones").op = new Settings();
	//construyo las opciones
	jarvis.buscarLib("Opciones").op.construirOpciones();
	jarvis.buscarLib("Opciones").op.darVida();
	//cargar opciones
	conexionOpc=crearXMLHttpRequest();
	conexionOpc.onreadystatechange = procesarDatos;
	conexionOpc.open('POST','corAcceso', true);
	conexionOpc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	var envio="TipoPet="+encodeURIComponent("web")+"&Operacion="+encodeURIComponent("datosPer");
	envio+="&Nombre="+encodeURIComponent(jarvis.session.nombreUsu);
	conexionOpc.send(envio);
}
//----------------------------------------FUNCIONES EXTERIORES----------------------------//
function procesarDatos(){
	if(conexionOpc.readyState == 4){
		//recivo el xml con los usuarios
		var xml=conexionOpc.responseXML;
		console.log("datos personales cargados");
		//cadenaHtml donde se guardan todas las partes a agregar
		if(xml.getElementsByTagName('success')[0].textContent==0){
			//extraigo el mensaje
			var mensaje=xml.getElementsByTagName('mensaje')[0].textContent;
			alert(mensaje);
		}else{
			//extarigo los elementos
			document.getElementById('email').value=xml.getElementsByTagName('Email')[0].textContent;
			document.getElementById('apellido').value=xml.getElementsByTagName('Apellido')[0].textContent;
			document.getElementById('nombre').value=xml.getElementsByTagName('Nombre')[0].textContent;
			document.getElementById('seudonimo').value=xml.getElementsByTagName('Seudonimo')[0].textContent;
			//activo el formulario
			var boton=document.getElementById('enviarDatosOp');
			boton.disabled=false;
			boton.textContent="Enviar";
					
		}
	}
}
function procesarUpdate(){
	if(conexionOpc.readyState == 4){
		//recivo el xml con los usuarios
		var xml=conexionOpc.responseXML;
		//cadenaHtml donde se guardan todas las partes a agregar
		if(xml.getElementsByTagName('success')[0].textContent==0){
			console.log("error");
		}else{
			console.log("sin error");
		}

		var mensaje=xml.getElementsByTagName('mensaje')[0].textContent;
		alert(mensaje);

		document.getElementById('clave').value="";
		document.getElementById('newClave').value="";
		document.getElementById('newClave2').value="";
		document.getElementById('newClave2').style.backgroundColor="white";
	}
}