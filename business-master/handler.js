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

module.exports.saveBusiness = (event, context, callback) => {
  const business = JSON.parse(event.body);

  var cmp = validation.compare(schema["schema"], Object.keys(business));

  if (cmp == 0) {
    console.log("Cabeceras correctas");
    business.businessId = uuidv1();
    databaseManager.saveBusiness(business).then(response => {
      console.log(response);
      callback(null, createResponse(200, response));
    });
  }
  else {
    callback(null, createResponse(400, { "errorMessage": cmp }));
  }

};

module.exports.getBusiness = (event, context, callback) => {
  const businessId = event.pathParameters.businessId;

  databaseManager.getBusiness(businessId).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });
};

module.exports.getAllBusiness = (event, context, callback) => {

  databaseManager.getAllBusiness().then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });
};

module.exports.deleteBusiness = (event, context, callback) => {
  const businessId = event.pathParameters.businessId;

  databaseManager.deleteBusiness(businessId).then(response => {
    callback(null, createResponse(200, 'Dato del Negocio fue Eliminado'));
  });
};

module.exports.updateBusiness = (event, context, callback) => {
  const businessId = event.pathParameters.businessId;

  const body = JSON.parse(event.body);
  const paramName = body.paramName;
  const paramValue = body.paramValue;

  databaseManager.updateBusiness(businessId, paramName, paramValue).then(response => {
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
