var racks = {};

racks.plugs=[];

racks.buscarPlug = function(nombreusu){
  for(var x=0;x<this.plugs.length;x++){
    if(this.plugs[x]!==null)
    {
      if(this.plugs[x].nombreusu==nombreusu)
      {
        return this.plugs[x];
      }
    }
  }
  return false;
};
racks.addPlug = function(plug){
  for(var x=0;x<this.plugs.length;x++){
    if(this.plugs[x]===null){
      console.log('encontro un espacio null detro de la lista de plugs');
      this.plugs[x]=plug;
      return;
    }
  }
  console.log('no encontro un plug null');
  console.log(this.plugs[this.plugs.length]);
  this.plugs[this.plugs.length]=plug;
};
racks.removePlug = function(nombreusu){
  console.log('buscando el plug:'+nombreusu);
  this.plugs[this.plugs.indexOf(this.buscarPlug(nombreusu))]=null;
};

racks.buscarPlugPorIp = function(ip){
  for(var x=0;x<this.plugs.length;x++){
    if(this.plugs[x]!==null)
    {
      if(this.plugs[x].ip==ip)
      {
        return this.plugs[x];
      }
    }
  }
  return false;
};
racks.buscarPlugPorSocket = function(Socket){
  for(var x=0;x<this.plugs.length;x++){
    if(this.plugs[x]!==null)
    {
      if(this.plugs[x].socket==Socket)
      {
        return this.plugs[x];
      }
    }
  }
  return false;
};
racks.mostrarListaPlugs = function(){
  var lista = "Lista de Personas Conectadas:\n";
  for(var x = 0; x < this.plugs.length; x++){
    lista += this.plugs[x].nombreusu+"\n";
  }
  console.log(lista);
} ;
module.exports=racks;
