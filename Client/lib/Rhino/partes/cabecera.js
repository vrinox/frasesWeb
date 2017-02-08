var Cabecera = function(){

	this.estado = 'porConstriur';
	this.nodo = null;
	this.construir();
};
Cabecera.prototype.construir = function(){
	var contenedor = obtenerContenedor();
	var elemento = document.createElement('div');
	elemento.setAttribute('cabecera','');
	elemento.innerHTML = "<button type='button' menuBtn id='menuBtn'><i class='material-icons md-36 white'>menu</i></button><div titulo>CloudRhino</div>";
	contenedor.insertBefore(elemento,contenedor.firstChild);
	this.funcionamientoBoton();
	this.estado='enUso';
	this.nodo = elemento;
};
Cabecera.prototype.cambiarTexto = function(texto){
	this.nodo.querySelector('div[titulo]').innerHTML = texto;
};
Cabecera.prototype.funcionamientoBoton = function() {
	//funcionamiento boton
	var botonMenu=document.getElementById('menuBtn');
	botonMenu.onclick=function(){
		var menu = document.getElementById('menu');
		if(menu.getAttribute('estado')=='visible'){
			menu.style.marginLeft='calc(-100%)';
			menu.setAttribute('estado','oculto');
		}else if(menu.getAttribute('estado')=='oculto'){
			menu.style.marginLeft='0px';
			menu.setAttribute('estado','visible');
		}
	};
};
Cabecera.prototype.agregarHTML = function(html){
	this.nodo.innerHTML+=html;
	this.funcionamientoBoton();
};
