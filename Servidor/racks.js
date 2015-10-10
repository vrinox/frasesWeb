var racks = {};

racks.plugs=new Array();

racks.buscarPlug = function(nombreUsu){
  for(var x=0;x<this.plugs.length;x++){
    if(this.plugs[x]!==null)
    {
      if(this.plugs[x].nombreUsu==nombreUsu)
      {
        return this.plugs[x];
      }    
    }
  }
  return false;
}
racks.addPlug = function(plug){
  for(var x=0;x<this.plugs.length;x++){
    if(this.plugs[x]===null){
      this.plugs[x]=plug;
      return;
    }
  }
  this.plugs[this.plugs.length]=plug;
}
racks.removePlug = function(nombreUsu){
 this.plugs[this.plugs.indexOf(this.buscarPlug(nombreUsu))]=null;
}

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
}
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
}
module.exports=racks;