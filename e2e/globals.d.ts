/* eslint-disable no-var */
import { WebSocket as WsWebSocket, WebSocketServer } from 'ws';

declare global {
  namespace globalThis {
    // Leave it as var, changing to let will cause it not to work
    var server: WebSocketServer;
    var client: WsWebSocket;
    var os: string;
    var arch: string;
  }
}
