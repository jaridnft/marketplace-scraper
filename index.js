// dependencies
const puppeteer = require('puppeteer');

// config
const searchQuery = encodeURIComponent('arcteryx womens');
const city = encodeURIComponent('vancouver');
const maxPrice = 400;
let items = [];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    `https://www.facebook.com/marketplace/${city}/search/?query=${searchQuery}&maxPrice=${maxPrice}`
  );
  await autoScroll(page);

  titles = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('[data-testid="marketplace_pdp_title"]')
    ).map(title => title.innerText.replace(/’|'/g, ''))
  );

  prices = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        '[data-testid="marketplace_feed_item"] div div:first-child div div'
      )
    ).map(price => price.innerText.replace(/\$/g, ''))
  );

  urls = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('[data-testid="marketplace_feed_item"]')
    ).map(item => item.href)
  );

  await prepareItems(titles, prices, urls);
  await browser.close();
})();

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

async function prepareItems(titles, prices, urls) {
  for (let i = 0; i < titles.length; i++) {
    let item = {
      title: titles[i],
      price: prices[i],
      url: urls[i]
    };

    items.push(item);
  }
}
