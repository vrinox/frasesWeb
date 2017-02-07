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
	this.buscarRegistros = function(entidad){
		//creo la promesa
		return new Promise(function(resolve,reject){
			var req=crearXMLHttpRequest();
			req.onreadystatechange = function(){
				if (req.readyState == 4){
					if (req.status == 200) {
						//la resuelvo
				        resolve(req.responseText);
					}else{
				        //la rechazo
				    	reject('rechazada');
					}
			    }
			};
			req.open('POST','corMotor', true);
			req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			var envio="operacion="+encodeURIComponent("listar")+'&entidad='+encodeURIComponent(entidad);
			req.send(envio);
		});
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

	this.Operacion = function(peticion){

		//si no se le paso el valor de la entidad a afectar en la peticion el tomara por defecto a
		//la entidad que se encuentra activa en el momento de la misma
		peticion.entidad = peticion.entidad || this.entidadActiva;

		//si no recive el parametro de manejarCarga toma por defecto el valor de falso
		peticion.manejarOperacion = peticion.manejarOperacion || false;

		//si no recibe el tipo de peticion toma por defecto web
		peticion.TipoPet = peticion.TipoPet || this.TipoPet;

		return new Promise(function(completada,rechazada){
			var req=crearXMLHttpRequest();
			req.onreadystatechange = function(){
				if (req.readyState == 4){

					//si el manejar carga es verdadero culmino la carga
					if(peticion.manejarOperacion === true){
						UI.buscarCuadroCarga(peticion.nombreCuadro).terminarCarga();
					}

					if (req.status == 200) {
						//la resuelvo
						completada(req.responseText);
					}else{
				        //la rechazo
				    	rechazada(Error(req.statusText));
					}
			    }
			};
			req.open('POST','corMotor', true);
			req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			var envio='';
			for(var llave in peticion){
				envio+=llave.toLowerCase()+'='+encodeURIComponent(peticion[llave])+'&';
			}
			req.send(envio);
		});
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
		var promesa = this.Operacion(peticion).then(JSON.parse).then(this.evaluarRespuesta,function(respuesta){
				console.log('Error en carga de JSON');
			});
		if(callback){
			return promesa.then(callback);
		}else{
			return promesa;
		}
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
	this.evaluarRespuesta = function(respuesta){
		return new Promise(function(completada,rechazada){
			if(respuesta.success){
				completada(respuesta);
			}else{
				rechazada(respuesta);
			}
		});
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
