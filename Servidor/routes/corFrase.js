var express = require('express');
var router = express.Router();
//modelo o clase necesario para su conexion
var frasesModel = require("../clases/clsFrase")

/* GET users listing. */
router.post("/", function(req,res)
{
	//creamos un objeto con los datos a insertar del usuario
	var Operacion = req.body.Operacion;
	var TipoPet = req.body.TipoPet;
	
	if(TipoPet=="web"){
		if(Operacion=='enviarNF')
		{
			var usarSeudonimo = (req.body.US=='si')?1:0;
			var formData = {
				codigo : null,
				autor : req.body.Usuario,
				contenido : req.body.Frase,
				seudonimo : usarSeudonimo
			};
			frasesModel.setData(formData);
			frasesModel.registrar(function(error,data){
				if(data && data.affectedRows)
				{
					var xmlResponse='<?xml version="1.0" encoding="UTF-8"?>';
					xmlResponse+="<cuerpo>";
					xmlResponse+="<success>1</success>";
					xmlResponse+="<mensaje>registro realizado con exito</mensaje>";
					xmlResponse+="</cuerpo>";
				}else{
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
		else if(Operacion=="cargarInicio")
		{
			frasesModel.listar(function(error,data){
				if(data.length>0){
					var xmlResponse='<?xml version="1.0" encoding="UTF-8"?>';
					xmlResponse+="<cuerpo>";
					xmlResponse+="<frases>";
					for(var x=0;x<data.length;x++){
						xmlResponse+="<frase>";
							xmlResponse+="<autor>"+data[x].autor+"</autor>";
							xmlResponse+="<contenido>"+data[x].contenido+"</contenido>";
							xmlResponse+="<seu>"+data[x].Seu+"</seu>";
							xmlResponse+="<seudonimo>"+data[x].seudonimo+"</seudonimo>";
						xmlResponse+="</frase>";
					}
					xmlResponse+="</frases>";
					xmlResponse+="<success>1</success>";
					xmlResponse+="<control>";
						xmlResponse+="<tipo>inicio</tipo>";
					xmlResponse+="</control>";
					xmlResponse+="<mensaje>registro realizado con exito</mensaje>";
					xmlResponse+="</cuerpo>";
				}else{
					var xmlResponse='<?xml version="1.0" encoding="UTF-8"?>';
					xmlResponse+="<cuerpo>";
					xmlResponse+="<success>0</success>";
					xmlResponse+="<mensaje>no hay frases en este momento</mensaje>";
					xmlResponse+="</cuerpo>";
				}
				res.header('Content-Type','text/xml');
				res.send(xmlResponse);
			});
		}
		else if(Operacion=='perfil')
		{
			var reqData = {
				perfil : req.body.Parametro,
				nombreUsu : req.body.NombreUsu
			}
			frasesModel.setData(reqData);
			//verifico si el usuario es seguidor del perfil q esta buscando
			
				//una vez verificado cargo todas la data 
				frasesModel.buscarPerfil(function(error,data){
					frasesModel.verificarSeguidor();
					if(data.length>0){
						var xmlResponse='<?xml version="1.0" encoding="UTF-8"?>';
						xmlResponse+="<cuerpo>";
						xmlResponse+="<frases>";
						for(var x=0;x<data.length;x++){
							xmlResponse+="<frase>";
								xmlResponse+="<autor>"+data[x].autor+"</autor>";
								xmlResponse+="<contenido>"+data[x].contenido+"</contenido>";
								xmlResponse+="<seu>"+data[x].Seu+"</seu>";
								xmlResponse+="<seudonimo>"+data[x].seudonimo+"</seudonimo>";
							xmlResponse+="</frase>";
						}
						xmlResponse+="</frases>";
						xmlResponse+="<success>1</success>";
						xmlResponse+="<control>";
							xmlResponse+="<tipo>perfil</tipo>";
							xmlResponse+="<parametro>"+reqData.perfil+"</parametro>";
							xmlResponse+="<nombre>"+frasesModel.innerData.nombre+"</nombre>";
							xmlResponse+="<apellido>"+frasesModel.innerData.apellido+"</apellido>";
							xmlResponse+="<estado>"+frasesModel.innerData.estado+"</estado>";
						xmlResponse+="</control>";
						xmlResponse+="<mensaje>registro realizado con exito</mensaje>";
						xmlResponse+="</cuerpo>";
					}else{
						var xmlResponse='<?xml version="1.0" encoding="UTF-8"?>';
						xmlResponse+="<cuerpo>";
						xmlResponse+="<success>0</success>";
						xmlResponse+="<mensaje>no hay frases en este momento</mensaje>";
						xmlResponse+="</cuerpo>";
					}
					res.header('Content-Type','text/xml');
					res.send(xmlResponse);
				});	
		}
		else if(Operacion=='busqueda')
		{
			var reqData = {
				paramBusq : req.body.Parametro
			}
			frasesModel.setData(reqData);
			frasesModel.busqueda(function(error,data){
				if(data.length>0){
					var xmlResponse='<?xml version="1.0" encoding="UTF-8"?>';
					xmlResponse+="<cuerpo>";
					xmlResponse+="<frases>";
					for(var x=0;x<data.length;x++){
						xmlResponse+="<frase>";
							xmlResponse+="<autor>"+data[x].autor+"</autor>";
							xmlResponse+="<contenido>"+data[x].contenido+"</contenido>";
							xmlResponse+="<seu>"+data[x].Seu+"</seu>";
							xmlResponse+="<seudonimo>"+data[x].seudonimo+"</seudonimo>";
						xmlResponse+="</frase>";
					}
					xmlResponse+="</frases>";
					xmlResponse+="<success>1</success>";
					xmlResponse+="<control>";
						xmlResponse+="<tipo>busqueda</tipo>";
						xmlResponse+="<parametro>"+reqData.paramBusq+"</parametro>";
					xmlResponse+="</control>";
					xmlResponse+="<mensaje>registro realizado con exito</mensaje>";
					xmlResponse+="</cuerpo>";
				}else{
					var xmlResponse='<?xml version="1.0" encoding="UTF-8"?>';
					xmlResponse+="<cuerpo>";
					xmlResponse+="<success>0</success>";
					xmlResponse+="<mensaje>no hay frases en este momento</mensaje>";
					xmlResponse+="</cuerpo>";
				}
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

