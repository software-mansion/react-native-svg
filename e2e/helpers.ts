import { E2EMessage } from './types';
import { PNG } from 'pngjs';
import fs from 'node:fs';
import pixelmatch from 'pixelmatch';

const replacer = (key: string, value: any) => {
  if (key === 'type' && typeof value !== 'string') return value.displayName;
  return value;
};

export const sendToDeviceAndReceive = <R>(message: E2EMessage) =>
  new Promise<R>((resolve) => {
    global.client.once('message', (message) => {
      const parsedMessage: E2EMessage = JSON.parse(message.toString('utf-8'));
      resolve(parsedMessage as R);
    });
    global.client.send(JSON.stringify(message, replacer));
  });

export const compareImages = (
  image1: Buffer,
  image2: Buffer,
  opts: {
    width: number;
    height: number;
    pixelRatio: number;
    diffFilePath?: string;
    renderedFilePath?: string;
  }
) => {
  const referencePng = PNG.sync.read(image1);
  const responsePng = PNG.sync.read(image2);

  const diffPng = new PNG({
    height: referencePng.height,
    width: referencePng.width,
  });

  const pixelDiff = pixelmatch(
    referencePng.data,
    responsePng.data,
    diffPng.data,
    opts.width * opts.pixelRatio,
    opts.height * opts.pixelRatio,
    {
      // That #5f00a0 is the color of the diff pixels
      diffColor: [95, 0, 160],
    }
  );
  if (opts.renderedFilePath) {
    fs.writeFileSync(opts.renderedFilePath, PNG.sync.write(responsePng));
  }
  if (opts.diffFilePath) {
    fs.writeFileSync(opts.diffFilePath, PNG.sync.write(diffPng));
  }
  return pixelDiff;
};
