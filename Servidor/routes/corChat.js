var express = require('express');
var router = express.Router();


//modelo o clase necesario para su conexion
var chatModel = require("../clases/clsChat");

router.post('/',function(req, res, next)
{
	//creamos un objeto con los datos a insertar del usuario
	var Operacion = req.body.Operacion;
	var TipoPet = req.body.TipoPet;
	if(TipoPet=='web'){
		if(Operacion=='cargarp2p'){
			var reqData = {
				nombre : req.body.Nombre
			}
			chatModel.setData(reqData);
			chatModel.cargarp2p(function(error,data){
				/* estructura de respuesta xml
				<cuerpo>
					<p2p>
						<person>
							<nombre></nombre>
						</person>
					</p2p>
					<success></success>
					<user></user>
				</cuerpo>
				*/
				if(data.length>0){
					var xmlResponse='<?xml version="1.0" encoding="UTF-8"?>';
					xmlResponse+="<cuerpo>";
					xmlResponse+="<p2p>";
					for(var x=0;x<data.length;x++){
						xmlResponse+="<person>";
							xmlResponse+="<nombreUsu>"+data[x].p2p+"</nombreUsu>";
							xmlResponse+="<nombre>"+data[x].nu+"</nombre>";
							xmlResponse+="<apellido>"+data[x].au+"</apellido>";
						xmlResponse+="</person>";
					}
					xmlResponse+="</p2p>";
					xmlResponse+="<success>1</success>";
					xmlResponse+="</cuerpo>";
				}else{
					var xmlResponse='<?xml version="1.0" encoding="UTF-8"?>';
					xmlResponse+="<cuerpo>";
					xmlResponse+="<success>0</success>";
					xmlResponse+="</cuerpo>";
				}
				res.header('Content-Type','text/xml');
				res.send(xmlResponse);
			});
		}
		else if(Operacion=='cargarChat')
		{

			var reqData = {
				nombre : req.body.Nombre,
				user : req.body.Chat
			}
			chatModel.setData(reqData);
			chatModel.cargarChat(function(error,data){

			/* estructura de respuesta xml
			<cuerpo>
				<success></success>
				<user></user>
				<messages>
					<msg>
						<id></id>
						<status></status>
						<cont></cont>
						<fecha></fecha>
					</msg>
					<msg>
						<id></id>
						<status></status>
						<cont></cont>
						<fecha></fecha>
					</msg>
				</messges>
			</cuerpo>
			*/
				console.log(data);
				if(data.length>0){
					var xmlResponse='<?xml version="1.0" encoding="UTF-8"?>';
					xmlResponse+="<cuerpo>";
					xmlResponse+="<success>1</success>";
					xmlResponse+="<user>"+reqData.user+"</user>";
					xmlResponse+="<messages>";
					for(var x=0;x<data.length;x++){
						xmlResponse+="<msg>";
							xmlResponse+="<id>"+data[x].id+"</id>";
							xmlResponse+="<estado>"+data[x].estado+"</estado>";
							xmlResponse+="<cont>"+data[x].cont+"</cont>";
							xmlResponse+="<fecha>"+data[x].fecha+"</fecha>";
							xmlResponse+="<emisor>"+data[x].emisor+"</emisor>";
						xmlResponse+="</msg>";
					}
					xmlResponse+="</messages>";
					xmlResponse+="</cuerpo>";
				}else{
					var xmlResponse='<?xml version="1.0" encoding="UTF-8"?>';
					xmlResponse+="<cuerpo>";
					xmlResponse+="<success>0</success>";
					xmlResponse+="<msg>chat vacio</msg>";
					xmlResponse+="<user>"+reqData.user+"</user>";
					xmlResponse+="</cuerpo>";
				}
				console.log(xmlResponse);
				res.header('Content-Type','text/xml');
				res.send(xmlResponse);
			});
		}
	}

});
module.exports = router;
