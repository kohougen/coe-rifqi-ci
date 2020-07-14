const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-1' });

const docClient = new AWS.DynamoDB.DocumentClient();

const { TABLE_NAME: tableName } = require('../config/config');

class DynamoDbService {
  async getItem (clusterName, containerId) {
    const params = {
      TableName: tableName,
      Key: { clusterName, containerId }
    };
    const { Item } = await docClient.get(params).promise();
    return Item;
  }

  async putItem (itemData) {
    const params = {
      TableName: tableName,
      Item: itemData
    };
    await docClient.put(params).promise();
  }

  async deleteItem (clusterName, containerId) {
    const params = {
      TableName: tableName,
      Key: { clusterName, containerId }
    };
    await docClient.delete(params).promise();
  }
}

module.exports = DynamoDbService;
