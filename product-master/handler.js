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

module.exports.saveProduct = (event, context, callback) => {
  
  const product = JSON.parse(event.body);

 var cmp = validation.compare(schema["schema"], Object.keys(product));
  
  if(cmp == 0)
  {
          console.log("Cabeceras correctas");
          product.productId = uuidv1();
          databaseManager.saveProduct(product).then(response => {
            console.log(response);
            callback(null, createResponse(200, response));
          });
  }
  else{
    callback(null, createResponse(400, {"errorMessage":cmp}));
  }
    
  
};

module.exports.getProduct = (event, context, callback) => {
  const productId = event.pathParameters.productId;

  databaseManager.getProduct(productId).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });
};

module.exports.getAllProduct = (event, context, callback) => {

  databaseManager.getAllProduct().then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });
};

module.exports.deleteProduct = (event, context, callback) => {
  const productId = event.pathParameters.productId;

  databaseManager.deleteProduct(productId).then(response => {
    callback(null, createResponse(200, 'Producto fue Eliminado'));
  });
};

module.exports.updateProduct = (event, context, callback) => {
  const productId = event.pathParameters.productId;

  const body = JSON.parse(event.body);
  const paramName = body.paramName;
  const paramValue = body.paramValue;

  databaseManager.updateProduct(productId, paramName, paramValue).then(response => {
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
