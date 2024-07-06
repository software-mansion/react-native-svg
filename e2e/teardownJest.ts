export default () => {
  if (global.client) global.client.close();
  if (global.server) global.server.close();
};
