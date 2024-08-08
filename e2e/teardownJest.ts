export default () => {
  global.server.clients.forEach((client) => client.close(1000))
  global.server.close()
};
