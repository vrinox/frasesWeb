var express = require('express');
var router = express.Router();

//modelo o clase necesario para su conexion
var accessModel = require("../clases/clsAcceso")

/* GET users listing. */
router.post("/", function(req,res)
{
	//creamos un objeto con los datos a insertar del usuario
	var Operacion = req.body.Operacion;
	var TipoPet = req.body.TipoPet;
	var formData = {
		nombreUsu : req.body.Nombre,
		clave_usu : req.body.Pass,
	};
	//mando la informacion a la clase para su utilizacion
	if((Operacion!="recuperarSession")&&(Operacion!="actualizarClave")){
		accessModel.setData(formData);
	}
	if(TipoPet=="web"){
		if(Operacion=='acceso')
		{
			//realizo la busqueda para el acceso
			accessModel.acceder(function(error,data){
				var xmlResponse='<?xml version="1.0" encoding="UTF-8"?>';
				xmlResponse+="<cuerpo>";
				if(data.success==1)
				{
					xmlResponse+="<session><NombreUsu>"+accessModel.innerData.nombreUsu+"</NombreUsu><HoraCon>"+data.HoraCon+"</HoraCon></session>";
					xmlResponse+="<success>1</success>";
				}
				else
				{
					xmlResponse+="<success>0</success>";
				}
				xmlResponse+="<mensaje>"+data.msg+"</mensaje>";
				xmlResponse+="</cuerpo>";
				
				res.header('Content-Type','text/xml');
				res.send(xmlResponse);
			});
		}
		else if(Operacion=="registro")
		{
			accessModel.registrar(function(error,data){
				if(data && data.affectedRows)
				{
					console.log("registro realizado con exito");
					var xmlResponse='<?xml version="1.0" encoding="UTF-8"?>';
					xmlResponse+="<cuerpo>";
					xmlResponse+="<success>1</success>";
					xmlResponse+="<mensaje>registro realizado con exito</mensaje>";
					xmlResponse+="</cuerpo>";
				}
				else
				{
					console.log("error en el registro");
					var xmlResponse='<?xml version="1.0" encoding="UTF-8"?>';
					xmlResponse+="<cuerpo>";
					xmlResponse+="<success>0</success>";
					xmlResponse+="<mensaje>Error interno del servidor</mensaje>";
					xmlResponse+="</cuerpo>";
				}
				res.header('Content-Type','text/xml');
				res.send(xmlResponse);
			});
		}
		else if(Operacion=="datosPer")
		{	
			accessModel.buscar(function(error,data){
				var xmlResponse='<?xml version="1.0" encoding="UTF-8"?>';
				xmlResponse+="<cuerpo>";

				if(data.success=='1')
				{
					var formData=accessModel.getData();
					xmlResponse+="<usuario><Nombre>"+formData.nombre+"</Nombre><Apellido>"+formData.apellido+"</Apellido>";
					xmlResponse+="<Email>"+formData.email+"</Email><Seudonimo>"+formData.seudonimo+"</Seudonimo></usuario>";
					xmlResponse+="<success>1</success>";
				}
				else
				{
					xmlResponse+="<success>0</success>";
				}
				xmlResponse+="<mensaje>"+data.msg+"</mensaje>";
				xmlResponse+="</cuerpo>";
				
				res.header('Content-Type','text/xml');
				res.send(xmlResponse);
			});
		}
		else if(Operacion=="actualizarDatos")
		{
			console.log("peticion de actualizacion obtenida");
			var reqData = {
				nombreUsu : req.body.NombreUsu,
				nombre : req.body.Nombre,
				apellido : req.body.Apellido,
				email : req.body.Email,
				seudonimo : req.body.Seudonimo
			}
			accessModel.setData(reqData);
			accessModel.actualizarDatos(function(error,data){

				var xmlResponse='<?xml version="1.0" encoding="UTF-8"?>';
				xmlResponse+="<cuerpo>";
				xmlResponse+="<success>"+data.success+"</success>";
				xmlResponse+="<mensaje>"+data.msg+"</mensaje>";
				xmlResponse+="</cuerpo>";
				res.header('Content-Type','text/xml');
				res.send(xmlResponse);
			});
		}
		else if(Operacion=="actualizarClave")
		{
			var reqData = {
				nombreUsu : req.body.Nombre,
				clave_usu : req.body.Pass,
				newClave : accessModel.encriptarPass(req.body.NewClave,req.body.Nombre)
			}
			accessModel.setData(reqData);
			accessModel.actualizarClave(function(error,data){
				var xmlResponse='<?xml version="1.0" encoding="UTF-8"?>';
				xmlResponse+="<cuerpo>";
				xmlResponse+="<success>"+data.success+"</success>";
				xmlResponse+="<mensaje>"+data.msg+"</mensaje>";
				xmlResponse+="</cuerpo>";
				res.header('Content-Type','text/xml');
				res.send(xmlResponse);
			});
		}
		else if(Operacion=="seguir")
		{
			var reqData = {
				nombreUsu : req.body.NombreUsu,
				parametro : req.body.Parametro
			}

			console.log(reqData);
			accessModel.setData(reqData);
			accessModel.seguir(function(error, data){
				
				var success=(data.affectedRows!="0")?1:0;
				
				var xmlResponse='<?xml version="1.0" encoding="UTF-8"?>';
				xmlResponse+="<cuerpo>";
				xmlResponse+="<success>"+success+"</success>";
				xmlResponse+="<accion>"+data.accion+"</accion>";
				xmlResponse+="</cuerpo>";
				res.header('Content-Type','text/xml');
				res.send(xmlResponse);
			});
		}

	}else if(TipoPet=="mobile"){

	}
});

router.get('/',function(req,res,next){
	res.end("Si es esta ruta");
});
module.exports = router;
