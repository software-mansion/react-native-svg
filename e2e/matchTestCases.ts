import { maxPixelDiff, targetPixelRatio } from './env';
import { FailedResults, HandshakeMessageData } from './types';

const matchTestCase = (testCase: string) => {
  const match = testCase.match(/(\d+)\.svg$/)!;
  return parseInt(match[1], 10).toString();
};

export function checkFailedCases(
  amountOfDifferentPixels: number,
  failedCases: FailedResults,
  global: HandshakeMessageData,
  testCase: string
) {
  if (failedCases[global.os][global.arch].includes(matchTestCase(testCase))) {
    expect(amountOfDifferentPixels).toBeGreaterThan(
      maxPixelDiff * targetPixelRatio
    );
  } else {
    expect(amountOfDifferentPixels).toBeLessThan(
      maxPixelDiff * targetPixelRatio
    );
  }
}
