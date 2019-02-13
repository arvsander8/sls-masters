'use strict';

const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.ITEMS_DYNAMODB_TABLE;

module.exports.initializateDynamoClient = newDynamo => {
  dynamo = newDynamo;
};

module.exports.saveUnit = unit => {
  const params = {
    TableName: TABLE_NAME,
    Item: unit
  };

  return dynamo.put(params).promise().then(() => {
    return unit.unitId;
  });
};

module.exports.getUnit = unitId => {
  const params = {
    Key: {
      unitId: unitId
    },
    TableName: TABLE_NAME
  };

  return dynamo.get(params).promise().then(result => {
    return result.Item;
  });
};

module.exports.getAllUnit = unitId => {
  const params = {
    TableName: TABLE_NAME
  };

  return dynamo.scan(params).promise().then(result => {
    return result;
  });
};

module.exports.deleteUnit = unitId => {
  const params = {
    Key: {
      unitId: unitId
    },
    TableName: TABLE_NAME
  };

  return dynamo.delete(params).promise();
};

module.exports.updateUnit = (unitId, paramsName, paramsValue) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      unitId
    },
    ConditionExpression: 'attribute_exists(unitId)',
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
