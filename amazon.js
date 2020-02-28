const puppeteer = require('puppeteer');
const fs = require('fs');
const COOKIE_JSON_PATH = 'amazon.json';

(async () => {
  const browser = await puppeteer.launch({
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--single-process'
    ],
    headless: true,
    executablePath: '/usr/bin/chromium-browser'
  });
  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0');

  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (['image', 'stylesheet', 'font'].indexOf(request.resourceType()) !== -1) {
        request.abort();
    } else {
        request.continue();
    }
  });

  const cookies = JSON.parse(fs.readFileSync(COOKIE_JSON_PATH, 'utf-8'));
  for (let cookie of cookies) {
    await page.setCookie(cookie);
  }

  try {
    // マスク販売ページを開く
    await page.goto('https://www.amazon.co.jp/dp/B07VBM91JB');
    const buyButton = await page.$('#oneClickBuyButton');

    if (buyButton !== null) {
      // ワンクリックで今すぐ買う
      page.click('#oneClickBuyButton');
      await page.waitForNavigation({waitUntil: "domcontentloaded"});
      // 購入後の画面をスクリーンショットを撮る
      await page.screenshot({path: './screenshot/success.png', fullPage: false});
      process.on("exit", function() {
        process.exit(0);
      });
    } else {
      await page.screenshot({path: './screenshot/failed.png', fullPage: false})
      process.on("exit", function() {
        process.exit(1);
      });
    }
  } catch(e) {
  } finally {
    await page.screenshot({path: './screenshot/latest.png', fullPage: false})
    await browser.close();
  }  
})();
