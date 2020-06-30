const DockerServiceClass = require('../services/docker-service');
const DynamoDbServiceClass = require('../services/dynamodb-service');

const Container = require('typedi').Container;

const factory = {
  DockerService: Container.get(DockerServiceClass),
  DynamoDbService: Container.get(DynamoDbServiceClass)
};

module.exports = factory;
