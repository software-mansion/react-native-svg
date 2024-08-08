import { WebSocketServer } from 'ws';

// This is little hack, we don't use syntax sugar with `async` here as we need to manually resolve promise
// whenever a client connects using resolve callback. In result the Jest will wait until some device connects,
// so it can be used to render test cases.
const setupJest = () =>
  new Promise<void>((resolve) => {
    const wsServer = new WebSocketServer({ port: 7123 });
    wsServer.on('connection', (client) => {
      global.client = client;

      // Add handler for one-time handshake message that confirms the client has connected properly
      client.once('message', (message) => {
        const parsedMessage = JSON.parse(message.toString('utf-8'));
        console.log(
          `[react-native-svg] Received handshake from a test client: ${JSON.stringify(
            parsedMessage
          )}`
        );

        global.os = parsedMessage.os;
        global.arch = parsedMessage.arch;

        console.log(`[react-native-svg] Running E2E test suites...\n`);
        resolve();
      });
    });

    console.log(
      '\n\n[react-native-svg] E2E WebSocket server is running, waiting for client connection. Run example app and select E2E from examples list.\n'
    );
    global.server = wsServer;
  });

export default setupJest;
