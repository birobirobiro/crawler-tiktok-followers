const express = require('express');
const ms = require('ms');
const app = express();
// const puppeteer = require('puppeteer');
import chromium from 'chrome-aws-lambda';


// let browser;

// app.get('/', async (req, res) => {
//   try {
//     if (!browser) {
//       browser = await puppeteer.launch({
//         args: ['--no-sandbox', '--disable-setuid-sandbox']
//       });
//     }

const browser = await chromium.puppeteer.launch({
  args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath,
  headless: true,
  ignoreHTTPSErrors: true,
});

const page = await browser.newPage();
await page.setDefaultNavigationTimeout(0);

await page.goto('https://www.tiktok.com/@birobirobirodev', {
  waitUntil: 'load',
  setTimeout: ms('0s'),
});
await page.waitForSelector('[data-e2e="followers-count"]');
const followersCount = await page.$eval('[data-e2e="followers-count"]', (el) => el.innerText);


try {
  res.send({
    "followers": followersCount,
  });
}
catch (err) {
  console.error(err);
  res.status(500).send({
    error: err.message,
  });
};

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

