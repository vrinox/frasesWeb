var conexionAcc;
var Acceso = function(){
	
	this.crearFormulario = function(){
		UI.agregarVentana({
		  tipo: 'centrado',
		  nombre: 'Ventana',
		  titulo:{
		    html: 'Acceso',
		    tipo: 'inverso'
		  },
		  sectores:[
			{
				nombre: 'formulario', //puede ser lo que sea
				formulario: {
					campos : [
						{
							tipo: 'campoDeTexto',
							parametros: {
							  requerido: true,
							  titulo:'Nombre de usuario',
							  nombre:'usuario',
							  tipo:'simple',
							  eslabon:'area',
							  max: 25,
							  usaToolTip:true
							}
						},{
							tipo: 'campoDeTexto',
							parametros: {
							  requerido: true,
							  titulo:'Clave de acceso',
							  nombre:'usuario',
							  tipo:'password',
							  eslabon:'area',
							  max: 25,
							  usaToolTip:true
							}
						}
					]
				},
				tipo: 'nuevo'
			},
			{
				nombre:'botonera',
				html:'<section botonera><button type="button" class="icon material-icons md-24 white mat-blue500">send</button></section>'
			}
		  ]
		},document.body.querySelector('div[contenedor]'));
	}
	 
}
//-----------------------------Acceso------------------------------------------------------------
function ingresar(){

 	var btEnviar = document.getElementById("BtAcc");
 	btEnviar.textContent='Accesando...';
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

	 	var btEnviar = document.getElementById("BtAcc");
	 	btEnviar.value='Ingresar';
		//recivo el xml con los usuarios
		var xml=conexionAcc.responseXML;
		console.log("respuesta aceptada");
		//cadenaHtml donde se guardan todas las partes a agregar
		if(xml.getElementsByTagName('success')[0].textContent==0){
			//extraigo el mensaje
			var mensaje=xml.getElementsByTagName('mensaje')[0].textContent;
			var btEnviar = document.getElementById("BtAcc");
 			btEnviar.textContent='Ingresar';
			alert(mensaje);
			jarvis.buscarLib("Acceso").op.darVida();
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