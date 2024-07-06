import Svg, { Line } from 'react-native-svg';
import * as fs from 'node:fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { sendToDeviceAndReceive } from '../../../../e2e/helpers';
import { RenderResponse } from '../../../../e2e/types';

const width = 250;
const height = 100;
const maxPixelDiff = width * height * 0.02;

for (let i = 0; i < 10; i++) {
  test(`rendered line difference should be less than 2% (${
    i + 1
  })`, async () => {
    const response = await sendToDeviceAndReceive<RenderResponse>({
      type: 'renderRequest',
      data: (
        <Svg height={height} width={width}>
          <Line
            x1="10%"
            y1="10%"
            x2="90%"
            y2="90%"
            stroke="red"
            strokeWidth={Math.floor(Math.random() * 10)}
          />
        </Svg>
      ),
    });
    const referencePng = PNG.sync.read(fs.readFileSync('test.png'));
    const responsePng = PNG.sync.read(Buffer.from(response.data, 'base64'));
    const diffPng = new PNG({ height: height * 3, width: width * 3 });
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
}
