type E2EMessage = HandshakeMessage | RenderRequest | RenderResponse;

interface HandshakeMessage {
  type: 'handshake';
  data: {
    os: string;
    arch: 'paper' | 'fabric';
    platformVersion: string;
  };
}

interface RenderRequest {
  type: 'renderRequest';
  data: any;
}

interface RenderResponse {
  type: 'renderResponse';
  data: string; // as base64
}
