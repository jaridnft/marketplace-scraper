// dependencies
import puppeteer from 'puppeteer';
import { autoScroll, prepareItems } from './helpers.mjs';

// config
const query = encodeURIComponent(process.env.SEARCH_QUERY);
const city = encodeURIComponent(process.env.SEARCH_CITY);
const maxPrice = process.env.MAX_PRICE;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    `https://www.facebook.com/marketplace/${city}/search/?query=${query}&maxPrice=${maxPrice}`
  );
  await autoScroll(page);

  let titles = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('[data-testid="marketplace_pdp_title"]')
    ).map(title => title.innerText.replace(/’|'/g, ''))
  );

  let prices = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        '[data-testid="marketplace_feed_item"] div div:first-child div div'
      )
    ).map(price => price.innerText.replace(/\$/g, ''))
  );

  let urls = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('[data-testid="marketplace_feed_item"]')
    ).map(item => item.href)
  );

  // @TODO: get picture URLs and add onto 'items'
  // @TODO: set up polling
  // @TODO: generate email

  const items = await prepareItems(titles, prices, urls);
  await browser.close();
})();
