'use strict';

const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.ITEMS_DYNAMODB_TABLE;

module.exports.initializateDynamoClient = newDynamo => {
  dynamo = newDynamo;
};

module.exports.saveAppruval = appruval => {
  const params = {
    TableName: TABLE_NAME,
    Item: appruval
  };

  return dynamo.put(params).promise().then(() => {
    return appruval.appruvalId;
  });
};

module.exports.getAppruval = appruvalId => {
  const params = {
    Key: {
      appruvalId: appruvalId
    },
    TableName: TABLE_NAME
  };

  return dynamo.get(params).promise().then(result => {
    return result.Item;
  });
};

module.exports.getAllAppruval = appruvalId => {
  const params = {
    TableName: TABLE_NAME
  };

  return dynamo.scan(params).promise().then(result => {
    return result;
  });
};

module.exports.deleteAppruval = appruvalId => {
  const params = {
    Key: {
      appruvalId: appruvalId
    },
    TableName: TABLE_NAME
  };

  return dynamo.delete(params).promise();
};

module.exports.updateAppruval = (appruvalId, paramsName, paramsValue) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      appruvalId
    },
    ConditionExpression: 'attribute_exists(appruvalId)',
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
