const factory = require('./config/di-factory');
const dockerService = factory.DockerService;
const dynamoDbService = factory.DynamoDbService;

const env = require('./config/config');
const clusterName = env.CLUSTER_ARN.split('/')[1];

const getContainerList = async () => {
  let containerArray = [];
  const containerList = await dockerService.listAllContainers();
  for (let container of containerList) {
    let containerName = container['Names'][0].split('/')[1];
    if (!containerName.includes('ecs-demo-app') && containerName !== 'ecs-agent') {
      let containerInfo = await dockerService.getContainer(container['Id']);
      containerArray.push(containerInfo);
    }
  }
  return containerArray;
}

const filterEnvAndSecrets = (envs) => {
  const secrets = {};
  const variables = {};
  for (let data of envs) {
    const { 0: key, 1: value } = data.split(/=(.+)/);
    const { 0: identifier, 1: secretKey } = key.split(/_(.+)/);
    if (identifier === 'SECRET') {
      secrets[`${secretKey}`] = value;
    } else {
      variables[`${key}`] = value;
    }
  }
  return { secrets, variables };
}

const putData = async (container) => {
  try {
    const { Labels: labels, Env } = container.Config;
    const { variables, secrets } = filterEnvAndSecrets(Env);
    const containerName = container['Name'].split('/')[1];
    let itemData = {
      clusterName,
      containerId: container.Id,
      containerName,
      labels,
      variables,
      secrets
    }
    await dynamoDbService.putItem(itemData);
    console.log('Save success...');
  } catch (err) {
    throw err;
  }
}

const deleteItem = async (containerId) => {
  try {
    await dynamoDbService.deleteItem(clusterName, containerId);
    console.log('Delete success...');
  } catch (err) {
    throw err;
  }
};

const main = async () => {
  try {
    console.log('Get containers list...');
    const containers = await getContainerList();
    console.log(JSON.stringify(containers));
    for (let container of containers) {
      if (container.State.Status === 'exited') {
        console.log(`Delete container ${clusterName}-${container.Id} data...`)
        deleteItem(container.Id);
      }
      if (container.State.Status === 'running') {
        console.log('Save containers data to db...')
        putData(container);
      }
    }
  } catch (err) {
    throw err;
  }
}

main()
  .catch(err => console.error(JSON.stringify(err)));
