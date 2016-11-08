var Construc = function(){
	this.estado = 'sinUsar';
	this.estructuraActiva = null;
};
Construc.prototype.construirInicio = function() {
	this.estructuraActiva = {
		nombre: 'chatGeneral'
	};
	

	//elimino la ventana acceso
	UI.quitarVentana('Acceso');

	//agrego la lista de chats disponibles
	this.estructuraActiva.latDer = UI.agregarVentana({
		clases: ['latDer'],
	    nombre: 'ListadoChats'
	},document.body.querySelector('div[contenedor]'));

	//agrego el contenedor de mensajes
	this.estructuraActiva.contenedorMensajes = UI.agregarVentana({
		clases: ['contMens'],
	    nombre: 'contenedorMensajes',
	    sectores:[
	    	{
	    		nombre: 'Bienvenido',
	    		html: "<div class='material-icons indigo500 ' bienvenidoIcon>info_outline</div>"+
	    				"<div class='indigo500' bienvenido> Bienvenido "+jarvis.session.nombreUsu+" <br> Por favor presiona un contancto para ver sus mensajes</div>"
	    	}
	    ]
	},document.body.querySelector('div[contenedor]'));

	//agrego el panel de escritura
	this.estructuraActiva.contenedorMensajes = UI.agregarVentana({
		clases: ['panelEsc'],
	    nombre: 'panelEsc',
	    sectores:[
	        {
	        	clases:['botonera'],
	            nombre:'escritura',
	            html:'<TextArea placeholder="Escribir"></TextArea><button type="button" class="icon material-icons mat-indigo500 white md-24">send</button>'
	        }
	    ]
	},document.body.querySelector('div[contenedor]'));

	//construyo el listado
	jarvis.usarLib('Chat',function(){
		if(!jarvis.buscarLib('Chat').op){
			jarvis.buscarLib('Chat').op = new ChatManager();
		}
		jarvis.buscarLib('Chat').op.pedirP2P(function(contactos){
			jarvis.construc.llenarListadoContactos(contactos);
		});
	});
};
Construc.prototype.llenarListadoContactos = function(contactos) {
	if(contactos){
		contactos.forEach(function(each){
			var newContac = jarvis.buscarLib('Chat').op.crearChatUnit(each);
			UI.buscarVentana('ListadoChats').nodo.appendChild(newContac.userChatCard);
		});
	}
};
Construc.prototype.llenarMenu = function() {
	var data = {
		codigo: "1",
		titulo: "menu",
		padre:null,
		hijos:[
			{
				codigo:"2",
				titulo: "contactos",
				padre: "1",
				hijos:[
					{
						codigo:"3",
						titulo:'Buscar Contacto',
						padre: "2",
						hijos:[],
						click: function(){
							jarvis.construc.buscarContactos();
						}
					}
				]
			}
		]
	}
	UI.elementos.menu.agregarModulo(data);
};
Construc.prototype.buscarContactos = function(){
	jarvis.usarLib('Contactos',function(){
		if(!jarvis.buscarLib('Contactos').op){
			jarvis.buscarLib('Contactos').op = new Contactos();
		}
		jarvis.buscarLib('Contactos').op.construirBusqueda();
	});
};
/*****************************************************************************************************************************/
arranque();
function arranque(){
	//aviso al motor que el script arranco
	jarvis.libCargada("Cuerpo");
	//agrego el operador a la libreria
	jarvis.construc = new Construc();
	jarvis.construc.estado = 'enUso';
}
