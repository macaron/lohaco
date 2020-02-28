const puppeteer = require('puppeteer');
const fs = require('fs');
const COOKIE_JSON_PATH = 'lohaco.json';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0')

  const cookies = JSON.parse(fs.readFileSync(COOKIE_JSON_PATH, 'utf-8'));
  for (let cookie of cookies) {
    await page.setCookie(cookie);
  }

  // マスク販売ページを開く
  await page.goto('https://lohaco.jp/product/X322876/');
  // カゴに追加
  await page.click('.funcBtnsBlock');
  
  // カートページを開く
  await page.goto("https://lohaco.jp/sf/cart/");
  page.click(".orderConfirmBtn");

  await page.waitForNavigation({
    waitUntil: 'domcontentloaded'
  });

  // 「送料が発生しているます」モーダルを閉じる
  page.click('.modalClose');

  // 購入！
  const orderCompleteButtons = await page.$$('.orderCompleteBtn');
  const buy = await orderCompleteButtons[1].$('a.btn');
  buy.click();

  // 購入後の画面をスクリーンショットを撮る
  await page.screenshot({path: 'screenshot.png', fullPage: true});

  await browser.close();
})();
