export default () => {
  global.client.terminate();
  global.server.clients.forEach((client) => client.terminate())
  global.server.close()
};
