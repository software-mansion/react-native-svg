import { maxPixelDiff, targetPixelRatio } from './env';
// import { storeFailedResult } from './readFailedCases';
import { FailedResults, HandshakeMessageData } from './types';

/** Extract test case name from filename (e.g., "1.svg" -> "1", "masking-path-01-b.svg" -> "masking-path-01-b") */
const extractTestCaseName = (testCase: string) => {
  return testCase.replace(/\.svg$/, '');
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
    failedCases[global.os][global.arch].includes(extractTestCaseName(testCase))
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
