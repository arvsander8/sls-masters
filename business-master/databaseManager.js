'use strict';

const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.ITEMS_DYNAMODB_TABLE;

module.exports.initializateDynamoClient = newDynamo => {
  dynamo = newDynamo;
};

module.exports.saveBusiness = business => {
  const params = {
    TableName: TABLE_NAME,
    Item: business
  };

  return dynamo.put(params).promise().then(() => {
    return business.businessId;
  });
};

module.exports.getBusiness = businessId => {
  const params = {
    Key: {
      businessId: businessId
    },
    TableName: TABLE_NAME
  };

  return dynamo.get(params).promise().then(result => {
    return result.Item;
  });
};

module.exports.getAllBusiness = businessId => {
  const params = {
    TableName: TABLE_NAME
  };

  return dynamo.scan(params).promise().then(result => {
    return result;
  });
};

module.exports.deleteBusiness = businessId => {
  const params = {
    Key: {
      businessId: businessId
    },
    TableName: TABLE_NAME
  };

  return dynamo.delete(params).promise();
};

module.exports.updateBusiness = (businessId, paramsName, paramsValue) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      businessId
    },
    ConditionExpression: 'attribute_exists(businessId)',
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
