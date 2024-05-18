const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const PAGES = [
  { url: 'https://ezpass.vercel.app/', output: 'build/index.html' },
  { url: 'https://ezpass.vercel.app/host', output: 'build/host.html' },
  // Add more pages as needed
];

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  for (const pageInfo of PAGES) {
    await page.goto(pageInfo.url, { waitUntil: 'networkidle0' });
    const content = await page.content();
    const outputPath = path.join(__dirname, pageInfo.output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, content);
  }

  await browser.close();
})();
