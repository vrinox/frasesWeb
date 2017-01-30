var conexionContactos;
var Contactos = function(){};
Contactos.prototype.construirBusqueda = function(){
	var modal = UI.crearVentanaModal({
		cuerpo:{
			clases:['lista'],
			html:''
		}
	});
	var lista =  UI.agregarLista({
		titulo: 'Agregar Contacto',
		clases: ['enbebida'],
    	campo_nombre: 'nombreUsu',
		carga: {
			uso:true,
			peticion:{
				entidad:'contacto',
				operacion:'listar',
				usuario:jarvis.session.nombreUsu
			},
			espera:{
				cuadro:{
					nombre:'buscarContacto',
					mensaje:'Buscando ...'
				}
			},
			respuesta: this.rellenarLista
		},
    	onclickSlot: this.verContacto
	},modal.partes.cuerpo.nodo);
};
Contactos.prototype.rellenarLista = function(lista) {
	lista.Slots.forEach(function(slot){
		slot.atributos.pendientes = 0;
		var card = createCard(slot.atributos,'chat');
		slot.nodo.innerHTML = '';
		slot.nodo.appendChild(card);
	});
};
Contactos.prototype.verContacto = function(slot) {
	var nombre = (slot.atributos.nombre)?slot.atributos.nombre+' '+slot.atributos.apellido:slot.atributos.nombreUsu;
	var mensaje={
		titulo:'Desea seguir a '+nombre,
		cuerpo: 'Realmente desea seguir al usuario '+nombre+'<br>Si lo hace podra comunicarse con el se mostrar en su lista de contactos',
	};

	var verificacion = UI.crearVerificacion(mensaje,function(){
		var pet = {
			entidad:'contacto',
			operacion:'agregar',
			nombreUsu: slot.atributos.nombreUsu,
			parametro: jarvis.session.nombreUsu
		};
		var cuadro = {
			contenedor :UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.nodo,
			cuadro:{
				nombre: 'agregarContacto',
				mensaje:'Agregando a '+nombre
			}
		};
		torque.manejarOperacion(pet,cuadro,function(respuesta){
			if(respuesta.success){
				UI.agregarToasts({
					texto:'contacto agregado de forma exitosa',
					tipo:'web-arriba-derecha'
				});
				if(respuesta.accion!=='borrar'){
					jarvis.construc.llenarListadoContactos([respuesta.contacto]);
				}
			}else{
				UI.agregarToasts({
					texto:'error al agregar el contacto intente de nuevo mas tarde',
					tipo:'web-arriba-derecha-alto'
				});
			}
			UI.elementos.modalWindow.eliminarUltimaCapa();
		});
	});
};
//--------------------------------------FUNCIONAMIENTO DE CARGA DE SCRIPT-------------------//
arranque();
function arranque(){
	//aviso al motor que el script arranco
	jarvis.libCargada("Contactos");
}
