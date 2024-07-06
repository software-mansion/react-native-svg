export type E2EMessage = HandshakeMessage | RenderRequest | RenderResponse;

export interface HandshakeMessage {
  type: 'handshake';
  data: {
    os: string;
    arch: 'paper' | 'fabric';
    platformVersion: string;
  };
}

export interface RenderRequest {
  type: 'renderRequest';
  data: any;
}

export interface RenderResponse {
  type: 'renderResponse';
  data: string; // as base64
}
