const express = require('express');
const ms = require('ms');
const app = express();
const puppeteer = require('puppeteer');

let browser;

function removeFollowers(str) {
  return str.replace(/\s*K\s*followers\s*/, '');
}

app.get('/', async (req, res) => {
  try {
    if (!browser) {
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);


    // Tiktok
    await page.goto('https://www.tiktok.com/@birobirobirodev', {
      waitUntil: 'load',
      setTimeout: ms('0s'),
    });
    await page.waitForSelector('[data-e2e="followers-count"]');
    const TiktokFollowers = await page.$eval('[data-e2e="followers-count"]', (el) => el.innerText);

    // KooApp
    await page.goto('https://www.kooapp.com/profile/birobirobiro', {
      waitUntil: 'load',
      setTimeout: ms('0s'),
    });

    await page.waitForTimeout('2ms');

    await page.waitForSelector('span[class^="Follow_follow__count__t1dQ2"');
    const KooAppFollowers = await page.$eval('span[class^="Follow_follow__count__t1dQ2"', (el) => el.innerText);

    // LinkedIn
    await page.goto('https://www.linkedin.com/in/birobirobiro/?original_referer=', {
      waitUntil: 'load',
      setTimeout: ms('0s'),
    });

    await page.waitForTimeout('2ms');

    await page.waitForSelector('span[class^="top-card__subline-item"');
    const LinkedInFollowers = await page.$eval('span[class^="top-card__subline-item"', (el) => el.innerText);

    res.send({
      "tiktok": TiktokFollowers,
      "kooapp": KooAppFollowers,
      "linkedin": Number(removeFollowers(LinkedInFollowers)) * 1000,
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

