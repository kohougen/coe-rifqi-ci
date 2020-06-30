const Docker = require('dockerode');
const fs = require('fs');

const socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
const stats = fs.statSync(socket);

if (!stats.isSocket()) {
  throw new Error('Are you sure the docker is running?');
}

const docker = new Docker({
  socketPath: socket
});

class DockerService {
  constructor() { }

  async listAllContainers() {
    let containers;
    let opts = {
      all: true
    }
    try {
      containers = await docker.listContainers(opts);
      return containers;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async getContainer(id) {
    let container, containerData;
    try {
      container = docker.getContainer(id);
      containerData = await container.inspect();
      return containerData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

module.exports = DockerService;
