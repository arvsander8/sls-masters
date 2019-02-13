'use strict';

const databaseManager = require('./databaseManager');
const uuidv1 = require('uuid/v1');

function createResponse(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

module.exports.saveAppruval = (event, context, callback) => {
  const appruval = JSON.parse(event.body);
  if(Object.keys(appruval).length == 4)
  {
    if( Object.keys(appruval)[0] == 'code' &&
        Object.keys(appruval)[1] == 'rule' &&
        Object.keys(appruval)[2] == 'minValue' &&
        Object.keys(appruval)[3] == 'maxValue' ){
          console.log("Cabeceras correctas");
          appruval.appruvalId = uuidv1();
          databaseManager.saveAppruval(appruval).then(response => {
            console.log(response);
            callback(null, createResponse(200, response));
          });
        }
        else{
          callback( null, createResponse(502, {'message':'Alguno de los campos no esta bien definido'}));
        }

  }
  else{
    callback( null, createResponse(502, {'message':"Debe ingresar los 4 campos obligatorios"}));
  }

    
  
};

module.exports.getAppruval = (event, context, callback) => {
  const appruvalId = event.pathParameters.appruvalId;

  databaseManager.getAppruval(appruvalId).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });
};

module.exports.getAllAppruval = (event, context, callback) => {

  databaseManager.getAllAppruval().then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });
};

module.exports.deleteAppruval = (event, context, callback) => {
  const appruvalId = event.pathParameters.appruvalId;

  databaseManager.deleteAppruval(appruvalId).then(response => {
    callback(null, createResponse(200, 'Regla de Aprobacion fue Eliminado'));
  });
};

module.exports.updateAppruval = (event, context, callback) => {
  const appruvalId = event.pathParameters.appruvalId;

  const body = JSON.parse(event.body);
  const paramName = body.paramName;
  const paramValue = body.paramValue;

  databaseManager.updateAppruval(appruvalId, paramName, paramValue).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });
};

module.exports.triggerStream = (event, context, callback) => {
  console.log('trigger stream was called');

  const eventData = event.Records[0];
  //console.log(eventData);

  console.log(eventData.dynamodb.NewImage);
  callback(null, null);
};
