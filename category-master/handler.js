'use strict';

const databaseManager = require('./databaseManager');
const uuidv1 = require('uuid/v1');

function createResponse(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

module.exports.saveCategory = (event, context, callback) => {
  const category = JSON.parse(event.body);

  if(Object.keys(product).length == 3)
  {
    if( Object.keys(category)[0] == 'code' &&
        Object.keys(category)[1] == 'description' &&
        Object.keys(category)[2] == 'type' 
         ){
          console.log("Cabeceras correctas");
          category.categoryId = uuidv1();
          databaseManager.saveCategory(category).then(response => {
            console.log(response);
            callback(null, createResponse(200, response));
          });
        }
        else{
          callback( null, createResponse(502, {'message':'Alguno de los campos no esta bien definido'}));
        }

  }
  else{
    callback( null, createResponse(502, {'message':"Debe ingresar los 3 campos obligatorios"}));
  }

};

module.exports.getCategory = (event, context, callback) => {
  const categoryId = event.pathParameters.categoryId;

  databaseManager.getCategory(categoryId).then(response => {
    console.log(response);
    callback(null, createResponse(200, response));
  });
};

module.exports.deleteCategory = (event, context, callback) => {
  const categoryId = event.pathParameters.categoryId;

  databaseManager.deleteCategory(categoryId).then(response => {
    callback(null, createResponse(200, 'Category was deleted'));
  });
};

module.exports.updateCategory = (event, context, callback) => {
  const categoryId = event.pathParameters.categoryId;

  const body = JSON.parse(event.body);
  const paramName = body.paramName;
  const paramValue = body.paramValue;

  databaseManager.updateCategory(categoryId, paramName, paramValue).then(response => {
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
