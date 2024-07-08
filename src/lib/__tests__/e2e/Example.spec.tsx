import { SvgFromXml } from 'react-native-svg';
import * as fs from 'node:fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { sendToDeviceAndReceive } from '../../../../e2e/helpers';
import { RenderResponse } from '../../../../e2e/types';
import path from 'path';

const width = 200;
const height = 200;
const maxPixelDiff = width * height * 0.005;

const testCases = fs.readdirSync(path.resolve('e2e', 'cases'));
testCases.forEach((testCase) => {
  test(`rendered SVG (${testCase}) difference should be less than 0.5%`, async () => {
    const base = path.resolve('e2e', 'cases', testCase);
    const response = await sendToDeviceAndReceive<RenderResponse>({
      type: 'renderRequest',
      data: <SvgFromXml xml={fs.readFileSync(base).toString('utf-8')} />,
      height,
      width,
    });
    const referencePng = PNG.sync.read(
      fs.readFileSync(
        path.resolve('e2e', 'references', testCase.replace('.svg', '.png'))
      )
    );
    const responsePng = PNG.sync.read(Buffer.from(response.data, 'base64'));

    const diffPng = new PNG({
      height: referencePng.height,
      width: referencePng.width,
    });
    const pixelDiff = pixelmatch(
      referencePng.data,
      responsePng.data,
      diffPng.data,
      height * 3,
      width * 3,
      {
        diffColor: [95, 0, 160],
      }
    );

    fs.writeFileSync(
      `e2e/diffs/${expect.getState().currentTestName}-diff.png`,
      PNG.sync.write(diffPng)
    );

    // Check if there is more than 2% different pixels in whole snapshot
    expect(pixelDiff).toBeLessThan(maxPixelDiff * 3);
  });
});
