const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    height: 200,
    width: 200,
    // This is hardcoded value which makes it possible to use only devices with pixel ratio = 3. You can change it
    // and regenerate reference images if you want to use device with different pixel ratio
    // see: https://reactnative.dev/docs/pixelratio
    deviceScaleFactor: 3,
  });
  const casesPath = path.resolve('e2e', 'cases');
  const referencesPath = path.resolve('e2e', 'references');
  const cases = fs.readdirSync(casesPath);
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

main();
