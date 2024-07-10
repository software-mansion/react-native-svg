import { SvgFromXml } from 'react-native-svg';
import * as fs from 'node:fs';
import { compareImages, sendToDeviceAndReceive } from '../../../../e2e/helpers';
import { RenderResponse } from '../../../../e2e/types';
import path from 'path';

const width = 200;
const height = 200;
const maxPixelDiff = width * height * 0.005;
const targetPixelRatio = 3.0;

const testCases = fs.readdirSync(path.resolve('e2e', 'cases'));
testCases.forEach((testCase) => {
  test(`Web browser rendered SVG should have less than 0.05% differences between device rendered SVG (${testCase})`, async () => {
    const testCaseSvg = path.resolve('e2e', 'cases', testCase);
    const svgXml = fs.readFileSync(testCaseSvg).toString('utf-8');
    const response = await sendToDeviceAndReceive<RenderResponse>({
      type: 'renderRequest',
      data: <SvgFromXml xml={svgXml} />,
      height,
      width,
    });

    const referenceFilePath = path.resolve(
      'e2e',
      'references',
      testCase.replace('.svg', '.png')
    );
    const renderedFilePath = path.resolve(
      'e2e',
      'rendered',
      `${testCase.replace('.svg', '')}-${global.os}-${global.arch}-rendered.png`
    );
    const diffFilePath = path.resolve(
      'e2e',
      'diffs',
      `${testCase.replace('.svg', '')}-${global.os}-${global.arch}-diff.png`
    );
    const referenceFileBuffer = fs.readFileSync(referenceFilePath);
    const renderedDataBuffer = Buffer.from(response.data, 'base64');

    // Compare reference file (from /e2e/references) with SVG rendered on actual device.
    // Reference files can be generated off of /e2e/cases with `yarn generateE2eReferences`.
    const amountOfDifferentPixels = compareImages(
      referenceFileBuffer,
      renderedDataBuffer,
      {
        width,
        height,
        pixelRatio: targetPixelRatio,
        diffFilePath,
        renderedFilePath,
      }
    );
    // Check if there is more than 0.5% different pixels in whole snapshot
    expect(amountOfDifferentPixels).toBeLessThan(
      maxPixelDiff * targetPixelRatio
    );
  });
});
