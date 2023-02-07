const express = require('express');
const ms = require('ms');
const app = express();
const puppeteer = require('puppeteer');

let browser;

app.get('/', async (req, res) => {
  try {
    if (!browser) {
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }

    const page = await browser.newPage();
    await page.goto('https://www.tiktok.com/@birobirobirodev', {
      waitUntil: 'load',
      setTimeout: ms('0s'),
    });
    await page.waitForSelector('[data-e2e="followers-count"]');
    const followersCount = await page.$eval('[data-e2e="followers-count"]', (el) => el.innerText);


    res.send({
      "followers": followersCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

