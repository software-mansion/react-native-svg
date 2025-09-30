export type E2EMessage = HandshakeMessage | RenderRequest | RenderResponse;

export interface HandshakeMessage {
  type: 'handshake';
  data: {
    os: string;
    arch: 'paper' | 'fabric';
    platformVersion: string;
  };
}

export type OS = 'ios' | 'android';
export type Arch = 'paper' | 'fabric';
export interface HandshakeMessageData {
  os: OS;
  arch: Arch;
  platformVersion: string;
}

export interface RenderRequest {
  type: 'renderRequest';
  data: any;
  width: number;
  height: number;
}

export interface RenderResponse {
  type: 'renderResponse';
  data: string; // as base64
}

export interface FailedResults {
  ios: {
    paper: string[];
    fabric: string[];
  };
  android: { paper: string[]; fabric: string[] };
}
