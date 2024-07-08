const path = require('path');
const puppeteer = require('puppeteer')
const fs = require('fs');

const main = async () => {
  const browser = await puppeteer.launch()
  // https://pptr.dev/api/puppeteer.viewport#properties => moze fix na popsute skalowanie
  const page = await browser.newPage()
  await page.setViewport({
    height: 200,
    width: 200,
    deviceScaleFactor: 3
  })
  const casesPath = path.resolve('e2e', 'cases')
  const referencesPath = path.resolve('e2e', 'references')
  const cases = fs.readdirSync(casesPath)
  for (const testCase of cases) {
    const svgPath = path.resolve(casesPath, testCase)
    await page.goto(`file://${svgPath}`)
    await page.$eval('svg', (ev: Element) => {
      ev.setAttribute('width', '200')
      ev.setAttribute('height', '200')
    })
    const svg = await page.waitForSelector('svg')
    await svg.screenshot({
      path: path.resolve(referencesPath, testCase.replace('.svg', '.png'))
    })
  }

  await browser.close()
}

main()
