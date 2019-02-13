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

module.exports.saveUnit = (event, context, callback) => {
  const unit = JSON.parse(event.body);

  var cmp = validation.compare(schema["schema"], Object.keys(unit));

  if (cmp == 0) {
    console.log("Cabeceras correctas");
    unit.unitId = uuidv1();
    databaseManager.saveUnit(unit).then(response => {
      console.log(response);
      callback(null, createResponse(200, response));
    });
  }
  else {
    callback(null, createResponse(400, { "errorMessage": cmp }));
  }



};

module.exports.getUnit = (event, context, callback) => {
  const unitId = event.pathParameters.unitId;

  databaseManager.getUnit(unitId).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });
};

module.exports.getAllUnit = (event, context, callback) => {

  databaseManager.getAllUnit().then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });
};

module.exports.deleteUnit = (event, context, callback) => {
  const unitId = event.pathParameters.unitId;

  databaseManager.deleteUnit(unitId).then(response => {
    callback(null, createResponse(200, 'Unidad de Medida fue Eliminado'));
  });
};

module.exports.updateUnit = (event, context, callback) => {
  const unitId = event.pathParameters.unitId;

  const body = JSON.parse(event.body);
  const paramName = body.paramName;
  const paramValue = body.paramValue;

  databaseManager.updateUnit(unitId, paramName, paramValue).then(response => {
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
