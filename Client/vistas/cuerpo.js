var Construc = function(){
	this.estado = 'sinUsar';
	this.estructuraActiva = null;
};
Construc.prototype.construirInicio = function() {
	this.estructuraActiva = 'chatGeneral';
	//cargo las librerias necesarias(chat,...)
	jarvis.usarLib('Chat',function(){
		//TODO: cargar las librerias y usar un callback justo despues
		if(!jarvis.buscarLib('Chat').op){
			jarvis.buscarLib('Chat').op = new ChatManager();
		}
		jarvis.buscarLib('Chat').op.mostrarUsuario();
	});

	//elimino la ventana acceso
	UI.quitarVentana('Acceso');

	//TODO: agrego la lista de chats disponibles
	  //codigo...

	//TODO: agrego el contenedor del chat
		//codigo...

};
/*****************************************************************************************************************************/
arranque();
function arranque(){
	//aviso al motor que el script arranco
	jarvis.libCargada("Cuerpo");
	//agrego el operador a la libreria
	jarvis.construct = new Construc();
	jarvis.construct.estado = 'enUso';
	jarvis.construct.construirInicio();
}
