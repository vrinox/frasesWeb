var conecionNF;
//--------------------------------------OBJETO ESTRUCTURA-----------------------------------//
var Estructura = function(nombre,html){

	this.nombre = nombre;

	this.html = html;

}
//--------------------------------------OBJETO CONSTRUCTOR-----------------------------------//
var Constructor = function(){

	this.estructurasDisponibles = [];

	this.estructuraEnUso=null;

	this.verificarEstructura = function(nombre){
		var validado=false;
		for(var x=0;x<this.estructurasDisponibles.length;x++){
			if(nombre==this.estructurasDisponibles[x].nombre){
				validado=true;
			}
		}
		return validado;
	}
	this.estrucAdd = function(estruc){
		this.estructurasDisponibles[this.estructurasDisponibles.length] = estruc;
	};

	this.obtenerEstruc = function(nombre){
		for(var x=0;x<this.estructurasDisponibles.length;x++){
			if(nombre==this.estructurasDisponibles[x].nombre){
				return this.estructurasDisponibles[x];
			}
		}
	}
	this.cambiarEstruc = function(nombre){
		if(!this.verificarEstructura(nombre)){
			alert("estructura no existe");
		}else{
			var estruc=this.obtenerEstruc(nombre);
		}
		this.estructuraEnUso = estruc;
		this.crearArmazon();
	};

	this.crearArmazon = function(){
		document.body.innerHTML=this.estructuraEnUso.html;
	};

	this.mostrarEstEnUso = function(){
		return this.estructuraEnUso.nombre;
	};

	this.arranque = function(){
		//aqui armo y declaro todos los tipos de estructura
		//estructura basica
		var html = "<div id='contenedor'> </div>";
		var nombre = "basica";
		var estrucBas = new Estructura(nombre,html);
		//agrego la estructura al constructor
		this.estrucAdd(estrucBas);
		var data = {
			nombreUsu : jarvis.session.nombreUsu
		}
		var identModule = this.construirIdentUsuario(data);
		//escructura de inicio
		html = "<div id='contenedor'>\
					<div fondo></div>\
					<div cabecera-ini>\
						<span icono-app><i class='icon32 icon-white icon-book'></i>FrasesWEB</span>\
						<i id='menuCs' menu class='icon32 icon-white icon-refresh' title='Actualizar'></i>\
						<i id='menuPer' menu title='datos personales'></i>\
						<i id='menuFav' menu class='icon32 icon-white icon-star-on' title='favoritos'></i>\
						<i id='menuNew' menu title='agregar una frase'></i>\
					</div>\
					<div id='contenedorFrases'><div primero></div>"+identModule+"</div>\
				</div>";
		nombre = "inicio";
		var estrucIni = new Estructura(nombre,html);
		//agrego la estructura
		this.estrucAdd(estrucIni);
		this.cambiarEstruc("basica");
		this.construirAcceso();

	}
	//--------------------------------Metodos de utilizacion de capas-----------------------------------------//
	this.abrirCapas	= function(){
		this.construirCapaExterior();
		var contenido=this.construirCapaContenido();
		return contenido;
	};

	this.cerrarCapas = function(){
		this.destruirCapaExterior();
		this.destruirCapaContedido();
	};

	this.construirCapaContenido	= function(){
		var contenido=document.createElement('div');
		contenido.id='capaContenido';
		document.body.insertBefore(contenido,document.body.firstChild);
		return contenido;
	};

	this.destruirCapaContedido = function(){
		var contenido=document.getElementById("capaContenido");
		contenido.parentNode.removeChild(contenido);
	};

	this.construirCapaExterior = function(){
		var capa=document.createElement('div');
		capa.id="exterior";
		capa.style.width=window.innerWidth+"px";
		capa.style.height=parseInt(window.innerWidth+200)+"px";
		capa.onclick=function(){jarvis.construc.cerrarCapas()};
		document.body.insertBefore(capa,document.body.firstChild);
		document.getElementById('contenedor').style.position="fixed";
		setTimeout(function(){
			document.getElementById('exterior').style.opacity="0.5";
		},50);
	};

	this.destruirCapaExterior = function(){
		var capa=document.getElementById('exterior');
		exterior.style.opacity="0";
		setTimeout(function(){
			document.getElementById('exterior').parentNode.removeChild(document.getElementById('exterior'));
		},500);
		document.getElementById('contenedor').style.position='inherit';
	};
	//----------------------------------------Metodos de construccion-----------------------------//
	this.construirInicio = function(){
		if(this.mostrarEstEnUso()!="inicio"){
			this.cambiarEstruc("inicio");
			inicio = new Inicio();
			inicio.darVida();
			if(jarvis.buscarLib('Chat').cargada){
				jarvis.buscarLib("Chat").op.construirDashBoard();
				jarvis.buscarLib("Chat").op.darVida();
			}else{
				jarvis.usarLib("Chat");	
			}	
		}
	}

	this.construirAcceso = function(){
		if(this.mostrarEstEnUso()!="basica"){
			this.cambiarEstruc("basica");
		}
		var htmlFormulario = jarvis.buscarLib("Acceso").op.crearFormulario();
		document.getElementById("contenedor").innerHTML=htmlFormulario;
		jarvis.buscarLib("Acceso").op.darVida();
	}
	
	this.construirIdentUsuario = function(data){
		console.log(data);
		var boton="";
		var username = "";
		newData = {
			nombreUsu : ' ',
			nombre : ' ',
			apellido : ' ',
			boton : 'disabled',
			texto : ' '
		}
		switch(data.tipo){
			case "perfil":
			if(data.nombreUsu!=jarvis.session.nombreUsu){
				var texto = (data.estado==1)?"dejar de seguir":"seguir";
				boton="<input type='button' onclick='inicio.seguir(this)' user='"+data.nombreUsu+"' value='"+texto+"' id='btnSeguir'>";
				newData.nombreUsu = data.nombreUsu;
				newData.texto = texto;
				newData.boton = 'enable';
			}
			break;
			case "busqueda":
				return "";
			break;
			case "inicio":
				data.nombreUsu = jarvis.session.nombreUsu;
			break;
		}
		var iniciales = newData.nombre.substr(0,1).toUpperCase()+newData.apellido.substr(0,1).toUpperCase();
		var seccionDerecha = "<div cardButton><input type='button' value='seguir'></div>";
		var html = "<div chatCab><div cardLogo><div iniciales>"+iniciales+"</div></div><div cardTitle >"+newData.nombre+" "+newData.apellido+"</div>";
		html += seccionDerecha+"</div>";
		var html2 = '<div cardId>\
								<div cardFlipCont id="cardIdCont" onclick="flip(this)">\
									<figure class="front">'+html+'</figure>\
									<figure class="back"><h3>Informacion de Contacto</h3></figure>\
								</div>\
							</div>'; 
		return html2;
	};
	//metodos ejecutados en la instanciacion del objeto
}
//--------------------------------------OBJETO INICIO---------------------------------------//
var Inicio = function(){

	this.buscarFrases = function(tipo,parametro){
		tipo = tipo || jarvis.session.nombreUsu;
		conexionAcc=crearXMLHttpRequest();
		conexionAcc.onreadystatechange = this.cargarFrases;
		conexionAcc.open('POST','corFrase', true);
		conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="TipoPet="+encodeURIComponent("web")+"&Operacion="+encodeURIComponent(tipo)
			envio+="&Parametro="+encodeURIComponent(parametro)+"&NombreUsu="+encodeURIComponent(jarvis.session.nombreUsu);
		conexionAcc.send(envio);

	};

	this.darVida = function(){
		document.getElementById("contenedor").style.height="auto";
		this.buscarFrases('cargarInicio');
		var menuCs = document.getElementById("menuCs");
		var menuPer = document.getElementById("menuPer");
		var menuFav = document.getElementById("menuFav");
		var menuNew = document.getElementById("menuNew");
		menuCs.onclick = function(){
			inicio.buscarFrases('cargarInicio');
		}
		menuNew.onclick = function(){
			document.getElementById("menuNew").onclick=function(){};
			destruirElResto();
			construirForm();
		}
		menuFav.onclick = function(){
			if(!document.getElementById('exterior')){
				jarvis.construc.abrirCapas();
			}
		}
		menuPer.onclick = function(){
			document.getElementById("menuPer").onclick=function(){};			
			destruirElResto();
			construirDatosP();
		}
	};

	this.seguir = function(obj){
		conexionAcc=crearXMLHttpRequest();
		conexionAcc.onreadystatechange = this.respSeguir;
		conexionAcc.open('POST','corAcceso', true);
		conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="TipoPet="+encodeURIComponent("web")+"&Operacion="+encodeURIComponent('seguir');
			envio+="&Parametro="+encodeURIComponent(obj.getAttribute('user'))+"&NombreUsu="+encodeURIComponent(jarvis.session.nombreUsu);
		conexionAcc.send(envio);
	}
	this.respSeguir = function(){
		if(conexionAcc.readyState == 4){
			var xml=conexionAcc.responseXML;
			var success = xml.getElementsByTagName('success')[0].textContent;
			var accion = xml.getElementsByTagName('accion')[0].textContent;
			console.log(accion);
			if(success==1){
				var boton = document.getElementById('btnSeguir');
				if(accion=="seguir"){
					boton.value="dejar de seguir";
				}else{
					boton.value="seguir";
				}
			}else{
				alert("no se pudo realizar la operacion");
			}
		}
	}
	this.cargarFrases = function(){
		if(conexionAcc.readyState == 4){
			//recivo el xml con las frases
			var xml=conexionAcc.responseXML;
			//cadenaHtml donde se guardan todas las partes a agregar
			if(xml.getElementsByTagName('success')[0].textContent==0){
				//extraigo el mensaje
				var mensaje=xml.getElementsByTagName('mensaje')[0].textContent;
				alert(mensaje);
			}else{
				var frase;
				var elemento;
				var html;
				//extraigo las frases
				var frases=xml.getElementsByTagName('frases')[0].childNodes;
				var data = {
					nombreUsu : jarvis.session.nombreUsu
				}
				var data;
				var control = xml.getElementsByTagName('control')[0];
				switch(control.getElementsByTagName('tipo')[0].textContent){
					case "perfil":
						data = {
							tipo : "perfil",
							nombreUsu : control.getElementsByTagName('parametro')[0].textContent,
							estado : control.getElementsByTagName('estado')[0].textContent,
							nombre : control.getElementsByTagName('nombre')[0].textContent,
							apellido : control.getElementsByTagName('apellido')[0].textContent,
						}
					break;
					case "busqueda":
						data = {
							tipo : "busqueda",
							parametro : control.getElementsByTagName('parametro')[0].textContent,
						}
					break;
					case "inicio":
						data = {
							tipo : "inicio"
						}
					break;
				}

				var identModule=jarvis.construc.construirIdentUsuario(data);
				document.getElementById('contenedorFrases').innerHTML="<div primero></div>"+identModule;
				for(var x=0;x<frases.length;x++){
					frase=frases[x];
					elemento = document.createElement('div');
					elemento.setAttribute("frase","");
					var autorText;
					if(frase.getElementsByTagName("seudonimo")[0].textContent=='1'){
						autorText="<au onclick='inicio.buscarFrases(\"busqueda\",this.textContent)'>"+frase.getElementsByTagName("seu")[0].textContent+"</au>";
					}else{
						autorText="<au onclick='inicio.buscarFrases(\"perfil\",this.textContent)'>"+frase.getElementsByTagName("autor")[0].textContent+"</au>";
					}
					html = "<div contenido><quotes>"+'"'+"</quotes>"+frase.getElementsByTagName("contenido")[0].textContent+"<quotes>"+'"'+"</quotes></div>\
							<div parte-inferior><span autor>By: "+autorText+"</span></div>";
					elemento.innerHTML=html;
					document.getElementById('contenedorFrases').appendChild(elemento);
				}
			}
		}
	};
}
//------------------------------------------NUEVA FRASE ------------------------------------------
function construirForm(){
	//construyo el contenedor
	var form = document.createElement('div');
	form.name = 'nuevaFrase';
	form.id = 'nF';
	//luego el contenido 
	var html = "<textarea maxlength='220' placeholder='Aqui es donde te pones creativo(a)' name='panelEsc' id='nfPanel'></textarea>\
				<div botoneraNF>\
					<l nfEnviar onclick='enviarNF()'>\
						<i class='icon32 icon-white icon-sent'></i>Enviar\
					</l>\
					<div usarSeudonimo>Utilizar seudonimo<input type='checkbox' id='usarSeudonimo'></div>\
				</div>";
	form.innerHTML = html;
	document.getElementById('contenedor').insertBefore(form,document.getElementById('contenedor').firstChild);
	//creo la capa exterior
	if(!document.getElementById('exterior')){
		jarvis.construc.construirCapaExterior();
	}
	var exterior=document.getElementById('exterior');
	exterior.onclick=function(){
		destruirForm();
		jarvis.construc.destruirCapaExterior();
	}
	document.body.insertBefore(exterior,document.body.firstChild);
	setTimeout(function(){
		document.getElementById('nF').style.margin="24px 25% ";
		document.getElementById('exterior').style.opacity="0.5";
	},50);
}

function destruirForm(){
	var exterior=document.getElementById('exterior');
	var form=document.getElementById('nF');
	form.style.margin="-180px 25% ";
	setTimeout(function(){
		document.getElementById('nF').parentNode.removeChild(document.getElementById('nF'));
		document.getElementById("menuNew").onclick=function(){
			document.getElementById("menuNew").onclick=function(){};
			destruirElResto();
			construirForm();
		};
	},510);
}

function enviarNF(){
	var panel=document.getElementById('nfPanel');
	if(panel.value.trim()==""){
		alert("escribe algo no seas flojo");
		return;
	}
	var usarSeudonimo;
	if(document.getElementById('usarSeudonimo').checked==false){
		usarSeudonimo='no';
	}else{
		usarSeudonimo='si';
	}
	conexionAcc=crearXMLHttpRequest();
	conexionAcc.onreadystatechange = procesarNF;
	conexionAcc.open('POST','corFrase', true);
	conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	var envio="TipoPet="+encodeURIComponent("web")+"&Operacion="+encodeURIComponent("enviarNF");
	envio += "&Frase="+encodeURIComponent(panel.value.trim()) + "&US="+encodeURIComponent(usarSeudonimo);
	envio += "&Usuario="+encodeURIComponent(jarvis.session.nombreUsu);
	conexionAcc.send(envio);

}

function procesarNF(){
	if(conexionAcc.readyState == 4){
		//recivo el xml con los usuarios
		var xml=conexionAcc.responseXML;
		//cadenaHtml donde se guardan todas las partes a agregar
		if(xml.getElementsByTagName('success')[0].textContent==0){
			//extraigo el mensaje
			var mensaje=xml.getElementsByTagName('mensaje')[0].textContent;
			alert(mensaje);
			destruirForm();
			jarvis.construc.destruirCapaExterior();
		}else{
			destruirForm();
			jarvis.construc.destruirCapaExterior();
			var mensaje=xml.getElementsByTagName('mensaje')[0].textContent;
			inicio.buscarFrases('cargarInicio');
		}
	}	
}
//---------------------------------------------DATOS PERSONALES---------------------------
function construirDatosP(){
	//construyo el contenedor
	var form = document.createElement('div');
	form.name = 'Personales';
	form.id = 'dP';
	//luego el contenido 
	var html = "<div tituloPer>Datos Personales</div>\
				<div contentNombre><i class='icon icon-gray icon-user'></i><span per>"+jarvis.session.nombreUsu+"</span></div>\
				<div contentNombre onclick='modificarDatos()'><i class='icon icon-gray icon-gear'></i><span per>Opciones</div>\
				<div cs onclick='jarvis.session.cerrarSession();'><i class='icon icon-gray icon-locked'></i><span per>Salir</div>";
	form.innerHTML = html;
	document.getElementById('contenedor').insertBefore(form,document.getElementById('contenedor').firstChild);
	//creo la capa exterior
	if(!document.getElementById('exterior')){
		jarvis.construc.construirCapaExterior();
	}
	exterior.onclick=function(){
		destruirDatosP();
		jarvis.construc.destruirCapaExterior();
	}
	document.body.insertBefore(exterior,document.body.firstChild);
	setTimeout(function(){
		document.getElementById('dP').style.marginTop="24px";
		document.getElementById('exterior').style.opacity="0.5";
	},50);
}

function destruirDatosP(){
	var exterior=document.getElementById('exterior');
	var form=document.getElementById('dP');
	form.style.marginTop="-180px";
	setTimeout(function(){
		document.getElementById('dP').parentNode.removeChild(document.getElementById('dP'));
		document.getElementById("menuPer").onclick=function(){
			document.getElementById("menuPer").onclick=function(){};			
			destruirElResto();
			construirDatosP();
		};
	},500);
}
//--------------------------------------------------GENERALES-------------------------------------
function destruirElResto(){
	if(document.getElementById('dP')){
		var form=document.getElementById('dP');
		form.style.marginTop="-180px";
		setTimeout(function(){
			document.getElementById('dP').parentNode.removeChild(document.getElementById('dP'));
			document.getElementById("menuPer").onclick=function(){
				destruirElResto();
				construirDatosP();
				document.getElementById("menuPer").onclick=function(){};
			};
		},500);
	}
	if(document.getElementById('nF')){
		var form=document.getElementById('nF');
		form.style.margin="-180px 25% ";
		setTimeout(function(){
			document.getElementById('nF').parentNode.removeChild(document.getElementById('nF'));
			document.getElementById("menuNew").onclick=function(){
				destruirElResto();
				construirForm();
				document.getElementById("menuNew").onclick=function(){};
			};
		},500);
	}
}
function modificarDatos(){
	destruirDatosP();
	jarvis.construc.construirCapaContenido().innerHTML="<h1></h1>";
	document.getElementById('exterior').onclick= function(){jarvis.construc.cerrarCapas();};
	if(jarvis.buscarLib('Opciones').cargada){
		jarvis.buscarLib("Opciones").op.construirOpciones();
		jarvis.buscarLib("Opciones").op.darVida();
	}else{
		jarvis.usarLib("Opciones");	
	}		
}
function flip(obj){
	if(obj.style.transform!='rotateX(180deg)'){
		obj.style.transform='rotateX(180deg)';
	}else{
		obj.style.transform='rotateX(0)';
	}
}