/*----------------------------------------------------------------------------------------------------*/
/*------------------------------Objeto Motor----------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var Motor = function(entidadActiva){

	this.estado='apagado';
	//entidad activa es decir la entidad que inicio el motor o la que esta en uso en el momento
	this.entidadActiva=entidadActiva;
	//todos los registros que tiene la entidad activa entidad activa
	this.registrosEntAct = null;
	//tipo de peticion
	this.TipoPet = 'web';

	//busqueda en bd
	this.buscarRegistros = function(entidad,callback){
		var conexionBuscar=crearXMLHttpRequest();
		conexionBuscar.onreadystatechange = function(){
			if (conexionBuscar.readyState == 4){
		        callback(JSON.parse(conexionBuscar.responseText));
		    }
		};
		conexionBuscar.open('POST','corMotor', true);
		conexionBuscar.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="operacion="+encodeURIComponent("buscar")+'&entidad='+encodeURIComponent(entidad);
		conexionBuscar.send(envio);
	};

	this.Busqueda = function(info,callback){
		var conexionBusqueda=crearXMLHttpRequest();
		conexionBusqueda.onreadystatechange = function(){
			if (conexionBusqueda.readyState == 4){
		            callback(JSON.parse(conexionBusqueda.responseText));
		    }
		};
		conexionBusqueda.open('POST','corMotor', true);
		conexionBusqueda.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="operacion="+encodeURIComponent(info.operacion)+'&entidad='+encodeURIComponent(info.entidad);
		envio+="&codigo="+encodeURIComponent(info.codigo);
		conexionBusqueda.send(envio);
	};

	this.Operacion = function(peticion,callback){

		//si no se le paso el valor de la entidad a afectar en la peticion el tomara por defecto a
		//la entidad que se encuentra activa en el momento de la misma
		peticion.entidad = peticion.entidad || this.entidadActiva;

		//si no recive el parametro de manejarCarga toma por defecto el valor de falso
		peticion.manejarOperacion = peticion.manejarOperacion || false;

		//si no recibe el tipo de peticion toma por defecto web
		peticion.TipoPet = peticion.TipoPet || this.TipoPet;
		var conexionMotor=crearXMLHttpRequest();
		conexionMotor.onreadystatechange = function(){
			if (conexionMotor.readyState == 4){
				var respuesta;
				//si el manejar carga es verdadero culmino la carga
				if(peticion.manejarOperacion === true){
					UI.buscarCuadroCarga(peticion.nombreCuadro).terminarCarga();
					respuesta = JSON.parse(conexionMotor.responseText);
					callback(respuesta);
				}else{
					respuesta = JSON.parse(conexionMotor.responseText);
					if(respuesta.success === 1){
		            	callback(respuesta);
					}else{
						UI.crearMensaje(respuesta.mensaje);
						UI.elementos.formulario.forma.destruirNodo();
					}
				}
		    }
		};
		conexionMotor.open('POST','corMotor', true);
		conexionMotor.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio='';
		for(var llave in peticion){
			envio+=llave.toLowerCase()+'='+encodeURIComponent(peticion[llave])+'&';
		}
		conexionMotor.send(envio);
	};

	this.manejarOperacion = function(peticion,cuadroCarga,callback){
		//------------Cuadro Carga-------------------------------
			cuadroCarga.contenedor.innerHTML='';
			var cuadroDeCarga = UI.crearCuadroDeCarga(cuadroCarga.cuadro,cuadroCarga.contenedor);
			cuadroDeCarga.style.marginTop = '80px';
		//-----------------------------------------------------------
		//le digo que la peticion fue por manejarOperacion
		peticion.manejarOperacion = true;
		peticion.nombreCuadro = cuadroCarga.cuadro.nombre;
		this.Operacion(peticion,callback);
	};
	this.guardar = function(entidad,info,callback){
		var conexionMotor=crearXMLHttpRequest();
		conexionMotor.onreadystatechange = function(){
			if (conexionMotor.readyState == 4){
		        var respuesta = JSON.parse(conexionMotor.responseText);
				if(respuesta.success === 1){
	            	callback(respuesta);
				}else{
					UI.crearMensaje(respuesta.mensaje);
					UI.elementos.formulario.forma.destruirNodo();
				}
		    }
		};
		conexionMotor.open('POST','corMotor', true);
		conexionMotor.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="operacion="+encodeURIComponent('guardar')+'&entidad='+encodeURIComponent(entidad)+'&';
		for(var x=0;x<info.length;x++){
			envio+=info[x].nombre.toLowerCase()+'='+encodeURIComponent(info[x].valor)+'&';
		}
		conexionMotor.send(envio);
	};
};
//--------------------------------AJAX---------------------------------------
function crearXMLHttpRequest()
{
  var xmlHttp=null;
  if (window.ActiveXObject)
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  else
    if (window.XMLHttpRequest)
      xmlHttp = new XMLHttpRequest();
  return xmlHttp;
}
/****************************************************************************************************************************************/
arranque();
function arranque(){
	//aviso al motor que el script arranco
	jarvis.libCargada("torque");
}
