var inspect = function(obj){

  var msg = [];

  for (var property in obj){
    if (typeof obj[property] == 'function'){
      var inicio = obj[property].toString().indexOf('function');
      var fin = obj[property].toString().indexOf(')')+1;
      var propertyValue=obj[property].toString().substring(inicio,fin);
      msg[msg.length] = {'type' : (typeof obj[property]), 'name' : property, 'value' : propertyValue};
    }
    else if (typeof obj[property] == 'unknown'){
      msg[msg.length] = {'type' : 'unknown', 'name' : property, value : 'unknown'};
    }
    else {
      msg[msg.length] ={'type' : (typeof obj[property]), 'name' : property, 'value' : obj[property]};
    }
  }
  return msg;  
}

module.exports = inspect;
