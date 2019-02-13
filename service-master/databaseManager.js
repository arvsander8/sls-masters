'use strict';

const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.ITEMS_DYNAMODB_TABLE;

module.exports.initializateDynamoClient = newDynamo => {
  dynamo = newDynamo;
};

module.exports.saveService = service => {
  const params = {
    TableName: TABLE_NAME,
    Item: service
  };

  return dynamo.put(params).promise().then(() => {
    return service.serviceId;
  });
};

module.exports.getService = serviceId => {
  const params = {
    Key: {
      serviceId: serviceId
    },
    TableName: TABLE_NAME
  };

  return dynamo.get(params).promise().then(result => {
    return result.Item;
  });
};

module.exports.getAllService = serviceId => {
  const params = {
    TableName: TABLE_NAME
  };

  return dynamo.scan(params).promise().then(result => {
    return result;
  }).catch(function(err) {
    return err
  });;
};

module.exports.deleteService = serviceId => {
  const params = {
    Key: {
      serviceId: serviceId
    },
    TableName: TABLE_NAME
  };

  return dynamo.delete(params).promise();
};

module.exports.updateService = (serviceId, paramsName, paramsValue) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      serviceId
    },
    ConditionExpression: 'attribute_exists(serviceId)',
    UpdateExpression: 'set ' + paramsName + ' = :v',
    ExpressionAttributeValues: {
      ':v': paramsValue
    },
    ReturnValues: 'ALL_NEW'
  };

  return dynamo.update(params).promise().then(response => {
    return response.Attributes;
  });
};
