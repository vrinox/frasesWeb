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

	UI.elementos.cabecera.agregarHTML('<button class="material-icons md-48 white listado">supervisor_account</button>');
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
	    		nombre: 'mensajes',
	    		html: "",
					clases:['mensajes']
	    	},{
					clases:['botonera'],
						nombre:'escritura',
						html:'<TextArea placeholder="Escribir"></TextArea><button type="button" class="icon material-icons mat-indigo500 white md-24">send</button>'
				}
	    ]
	},document.body.querySelector('div[contenedor]'));


	//construyo el listado
	jarvis.usarLib('Chat')
		.then(function(lib){
			if(!lib.op){
				lib.op = new ChatManager();
			}
			lib.op.pedirP2P(function(contactos){
				jarvis.construc.llenarListadoContactos(contactos);
			});
		});
};
Construc.prototype.llenarListadoContactos = function(contactos){
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
				codigo:"4",
				titulo: "Opciones",
				padre: "1",
				hijos:[],
				click: function(){
					jarvis.usarLib('Opciones');
				}
			},{
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
							UI.elementos.menu.abrirMenu();
							jarvis.construc.buscarContactos();
						}
					}
				]
			}
		]
	};
	UI.elementos.menu.agregarModulo(data);
};
Construc.prototype.buscarContactos = function(){
	jarvis.usarLib('Contactos')
		.then(function(lib){
			if(!lib.op){
				lib.op = new Contactos();
			}
			lib.op.construirBusqueda();
		});
};
Construc.prototype.construirAcceso = function(){
	var capas = UI.elementos.menu.nodo.querySelectorAll('div[subcapamenu]');
	capas.forEach(function(capa){
		capa.parentNode.removeChild(capa);
	});
	this.estructuraActiva = "acceso";
	UI.elementos.ventanas.forEach(function(ventana){
		UI.quitarVentana(ventana.atributos.nombre);
	});
	jarvis.buscarLib("Acceso").op.crearFormulario();
};
