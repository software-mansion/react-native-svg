const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');

const generateReferences = async (
  platform: 'android' | 'ios',
  scaleFactor: number
) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({
    width: 200,
    height: 200,
    // This is value which makes it possible to use only devices with particular pixel ratio. You can change it
    // and regenerate reference images if you want to use device with different pixel ratio
    // see: https://reactnative.dev/docs/pixelratio
    deviceScaleFactor: scaleFactor,
  });

  const casesPath = path.resolve('e2e', 'cases');
  const referencesPath = path.resolve('e2e', 'references', platform);
  const cases = fs
    .readdirSync(casesPath)
    .filter((file: string) => file.endsWith('.svg'));

  for (const testCase of cases) {
    const svgPath = path.resolve(casesPath, testCase);
    await page.goto(`file://${svgPath}`);
    await page.$eval('svg', (ev: Element) => {
      ev.setAttribute('width', '200');
      ev.setAttribute('height', '200');
    });
    const svg = await page.waitForSelector('svg');
    await svg.screenshot({
      path: path.resolve(referencesPath, testCase.replace('.svg', '.png')),
    });
  }

  await browser.close();
};

const main = async () => {
  await generateReferences('ios', 3.0);
  // We use 2.625 for Android which corresponds to Pixel 7 device becuase the emulator with 3.0 is not available currently on CI
  await generateReferences('android', 2.625);
};

main();
