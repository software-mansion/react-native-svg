import { SvgFromXml } from 'react-native-svg';
import * as fs from 'node:fs';
import { compareImages, sendToDeviceAndReceive } from '../../e2e/helpers';
import { HandshakeMessageData, RenderResponse } from '../../e2e/types';
import path from 'path';
import {
  addAttach as attachImageToReport,
  addMsg as addMessageToReport,
} from 'jest-html-reporters/helper';
import { PNG } from 'pngjs';
import failedCases from '../../e2e/failedCases.json';
import { verifyComparisons } from '../../e2e/matchTestCases';
import { height, targetPixelRatio, width } from '../../e2e/env';

const testCases = fs
  .readdirSync(path.resolve('e2e', 'cases'))
  .filter((file) => file.endsWith('.svg'));
testCases.forEach((testCase) => {
  jest.setTimeout(90_000);
  test(`Web browser rendered SVG should have less than 0.05% differences between device rendered SVG (${testCase})`, async () => {
    await addMessageToReport({
      message: JSON.stringify({
        os: global.os,
        arch: global.arch,
      }),
    });
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
      global.os === 'android' ? 'references/android' : 'references/ios',
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

    // We use await everywhere instead Promise.all as we need to maintain order for ease of inspecting tests
    // Adding reference & rendered before comparison in case compareImages fails, so we can see why it failed
    await attachImageToReport({
      attach: fs.readFileSync(referenceFilePath),
      description: 'Reference image',
      bufferFormat: 'png',
    });
    await attachImageToReport({
      attach: PNG.sync.write(PNG.sync.read(renderedDataBuffer)),
      description: 'Actual rendered image',
      bufferFormat: 'png',
    });

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

    await attachImageToReport({
      attach: fs.readFileSync(diffFilePath),
      description: 'Differences',
      bufferFormat: 'png',
    });

    // Check if there is more than 0.5% different pixels in whole snapshot
    verifyComparisons(
      amountOfDifferentPixels,
      failedCases,
      global as unknown as HandshakeMessageData,
      testCase
    );
  });
});
