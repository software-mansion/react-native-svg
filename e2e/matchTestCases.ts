import { maxPixelDiff, targetPixelRatio } from './env';
// import { storeFailedResult } from './readFailedCases';
import { FailedResults, HandshakeMessageData } from './types';

const extractSvgNumber = (testCase: string) => {
  const match = testCase.match(/(\d+)\.svg$/)!;
  return parseInt(match[1], 10).toString();
};

export function verifyComparisons(
  amountOfDifferentPixels: number,
  failedCases: FailedResults,
  global: HandshakeMessageData,
  testCase: string
) {
  // if (amountOfDifferentPixels > maxPixelDiff * targetPixelRatio) {
  //   storeFailedResult(global.os, global.arch, matchTestCase(testCase));
  // }
  if (
    failedCases[global.os][global.arch].includes(extractSvgNumber(testCase))
  ) {
    expect(amountOfDifferentPixels).toBeGreaterThan(
      maxPixelDiff * targetPixelRatio
    );
  } else {
    expect(amountOfDifferentPixels).toBeLessThan(
      maxPixelDiff * targetPixelRatio
    );
  }
}
