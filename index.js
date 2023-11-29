const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeProducts(url) {
  const browser = await puppeteer.launch({
    headless: false, // Запуск в режиме с открытым браузером
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  // Изменение User-Agent
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  );

  // Отключение JavaScript, если необходимо
  await page.setJavaScriptEnabled(false);

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Имитация поведения человека
    await page.waitForTimeout(5000);

    const products = await page.evaluate(() => {
      let items = [];
      document.querySelectorAll('.catalog-product').forEach((product) => {
        let title = product.querySelector('.catalog-product__name')?.innerText;
        let price = product.querySelector('.product-buy__price')?.innerText;
        if (title && price) {
          items.push({ title, price });
        }
      });
      return items;
    });

    console.log(products); // Проверка извлеченных данных

    // Здесь добавьте код для сохранения данных в CSV
  } catch (error) {
    console.error('Ошибка при скрапинге данных:', error);
  } finally {
    await browser.close();
  }
}

// URL категории с сайта DNS-shop.ru
const url = 'https://www.dns-shop.ru/catalog/17a8d26216404e77/vstraivaemye-xolodilniki/';
scrapeProducts(url);
