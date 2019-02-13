'use strict';

const databaseManager = require('./databaseManager');
const uuidv1 = require('uuid/v1');
var schema =  require('./schema.json');
var validation = require('./validateRequest.js');

function createResponse(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

module.exports.saveService = (event, context, callback) => {
  const service = JSON.parse(event.body);

  var cmp = validation.compare(schema["schema"], Object.keys(service));

  if (cmp == 0) {
    service.serviceId = uuidv1();
    databaseManager.saveService(service).then(response => {
      console.log(response);
      callback(null, createResponse(200, response));
    });
  }
  else {
    callback(null, createResponse(400, { "errorMessage": cmp }));
  }


};

module.exports.getService = (event, context, callback) => {
  const serviceId = event.pathParameters.serviceId;

  databaseManager.getService(serviceId).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });
};

module.exports.getAllService = (event, context, callback) => {

  databaseManager.getAllService().then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });
};

module.exports.deleteService = (event, context, callback) => {
  const serviceId = event.pathParameters.serviceId;

  databaseManager.deleteService(serviceId).then(response => {
    callback(null, createResponse(200, 'Serviceo fue Eliminado'));
  });
};

module.exports.updateService = (event, context, callback) => {
  const serviceId = event.pathParameters.serviceId;

  const body = JSON.parse(event.body);
  const paramName = body.paramName;
  const paramValue = body.paramValue;

  databaseManager.updateService(serviceId, paramName, paramValue).then(response => {
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
