export async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
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

export async function prepareItems(titles, prices, urls) {
  let items = [];

  for (let i = 0; i < titles.length; i++) {
    let item = {
      title: titles[i],
      price: prices[i],
      url: urls[i]
    };

    items.push(item);
  }
  
  return items;
}
