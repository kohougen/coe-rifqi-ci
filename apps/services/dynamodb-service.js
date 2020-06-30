const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-1' });

const docClient = new AWS.DynamoDB.DocumentClient();

const { TABLE_NAME: tableName } = require('../config/config');

class DynamoDbService {

  constructor() { }

  async getItem(clusterName, containerId) {
    let params = {
      TableName: tableName,
      Key: { clusterName, containerId }
    };
    try {
      const { Item } = await docClient.get(params).promise();
      return Item;
    } catch (err) {
      throw err;
    }
  }

  async putItem (itemData) {
    let params = {
      TableName: tableName,
      Item: itemData
    }
    try {
      await docClient.put(params).promise();
    } catch (err) {
      throw err;
    }
  }

  async deleteItem(clusterName, containerId) {
    let params = {
      TableName : tableName,
      Key: { clusterName, containerId }
    }
    try {
      await docClient.delete(params).promise();
    } catch (err) {
      throw err;
    }
  }
}

module.exports = DynamoDbService;
