'use strict';

const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.ITEMS_DYNAMODB_TABLE;

module.exports.initializateDynamoClient = newDynamo => {
  dynamo = newDynamo;
};

module.exports.saveCategory = category => {
  const params = {
    TableName: TABLE_NAME,
    Item: category
  };

  return dynamo.put(params).promise().then(() => {
    try {
      return category.categoryId;
    } catch (error) {

    }
  });
};

module.exports.getCategory = categoryId => {
  const params = {
    Key: {
      categoryId: categoryId
    },
    TableName: TABLE_NAME
  };

  return dynamo.get(params).promise().then(result => {
    return result.Item;
  });
};

module.exports.getAllCategory = categoryId => {
  const params = {
    TableName: TABLE_NAME
  };

  return dynamo.scan(params).promise().then(result => {
    return result;
  });
};

module.exports.deleteCategory = categoryId => {
  const params = {
    Key: {
      categoryId: categoryId
    },
    TableName: TABLE_NAME
  };

  return dynamo.delete(params).promise();
};

module.exports.updateCategory = (categoryId, paramsName, paramsValue) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      categoryId
    },
    ConditionExpression: 'attribute_exists(categoryId)',
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
