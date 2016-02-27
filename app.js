var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//archivos que se encargan de manejar la rutas
var routes = require('./Servidor/routes/index');
var acceso = require('./Servidor/routes/corAcceso');
var frase = require('./Servidor/routes/corFrase');
var chat = require('./Servidor/routes/corChat');
//aplicacion
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'Client')));

//rutas externas
app.use('/', routes);
app.use('/corAcceso', acceso);
app.use('/corfrase', frase);
app.use('/corChat', chat);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//-----------------------------------------------funcionamiento http ----------------------------------------//
var http = require('http');
var port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
var debug = require('debug')('express_example:server');

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}



//-------------------------------------------Funcionamiento de Socket.io-------------------------------------//
var rack = require('./Servidor/racks');
var dateParser = require('./Servidor/dateParser')
var io = require('socket.io').listen(server);
var plugAssembler = require('./Servidor/plug');


io.sockets.on('connection',function(socket){
  //--------inicio identificacion ------------------------
  socket.on('identificacion',function(data){
    var atributos = {
      nombreUsu:data.nombre,
      horaDeConeccion:data.HDC,
      ultimaConeccion:new Date(),
    }
    if(rack.buscarPlug(atributos.nombreUsu)){
      socket.emit('identificacion',{text:"falsa"});
      rack.buscarPlug(atributos.nombreUsu).socket.emit('session',{text:"dobleSession"});
      console.log('doble session');
    }else{
      var plug = plugAssembler.configure(atributos,socket);
      rack.addPlug(plug);
      //identificacion en servidor
      console.log('\nconexion establecida con: '+plug.nombreUsu+"\nde direccion: "+plug.ip+"\n"); 
      rack.mostrarListaPlugs();
    }
  });
  //-----------inicio SESSION--- ------------------------
  socket.on('session',function(data){
    if(data.text=='cerrar')
    {
      rack.removePlug(data.nombreUsu);
      socket.emit('session',{text:"cerrada"});
      console.log('session de: '+data.nombreUsu+" cerrada");
    }
    else if(data.text=="recuperar")
    {
      var plug = rack.buscarPlugPorIp(socket.client.conn.remoteAddress);
      if(plug)
      {
        socket.emit('session',{
          text:"recuperada",
          nombreUsu:plug.nombreUsu,
          horaDeConeccion:plug.horaDeConeccion
        });
        //activo el plug
        plug.estado='conectado';
        //cierro el intervalo de cierre
        clearInterval(plug.idIntSes);
      }
      else
      {
        socket.emit('session',{
          text:"no recuperada",
          nombreUsu:"",
          horaDeConeccion:""
        });
      }
    }
  });
  //---------------------------Control de Chat--------------------------------------------------------
  socket.on('chatMsg',function(data){
    if(data.tipo=='envio')
    {
      console.log(data);
      rack.mostrarListaPlugs();
      var receptor = rack.buscarPlug(data.receptor);
      if(receptor){
        data.fecha = dateParser.getParseDate();
        console.log('disparando mensaje a receptor');
        receptor.socket.emit('chatMsg',data);
        var newData = {
          id : data.id,
          estado : 'recibidoServidor',
          fecha : data.fecha
        }
        console.log('disparando cambio de estado a emisor\n');
        console.log(newData);
        socket.emit('chatMsg',newData); 
      }
    }
    else if(data.tipo=='cambioEstado')
    {
      if(data.estado=='recibidoPorReceptor'){
        var emisor = rack.buscarPlug(data.receptor);
        console.log(emisor);
        emisor.socket.emit('chatMsg',data);
      }
    }
  });
  socket.on('connect_failed', function(){
    console.log('Connection Failed');
  });
  socket.on('disconnect',function(){
    plug=rack.buscarPlugPorSocket(socket);
    if(plug){
      plug.estado='esperando';
      //funcion settimeout
      plug.idIntSes=setTimeout(
        (function(plug){
          return function(){
            if(plug.estado=='esperando'){
              rack.removePlug(plug.nombreUsu);
            }
      }})(plug), 120000); 
    }
  });
});

module.exports = app;
