// scrape-chamber-full-parallel.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const url = "https://business.thechambersj.com/list/";

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log("Navigating to page...");
  // Debug snippet to see HTML
  await page.goto(url, { waitUntil: "networkidle2" });
  const html = await page.content();
  console.log(html); // See if .mn-listing-item exists
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

  // Wait for iframe
  await page.waitForSelector('iframe', { timeout: 30000 });
  const frameHandle = await page.$('iframe');
  const frame = await frameHandle.contentFrame();

  // Wait for company items
  await frame.waitForSelector('.mn-listing-item', { timeout: 30000 });

  // Scroll until all results load
  let previousHeight;
  while (true) {
    previousHeight = await frame.evaluate('document.body.scrollHeight');
    await frame.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await page.waitForTimeout ? await page.waitForTimeout(1500) : await page.waitFor(1500);
    let newHeight = await frame.evaluate('document.body.scrollHeight');
    if (newHeight === previousHeight) break;
  }

  // Get profile links
  const profileLinks = await frame.evaluate(() => {
    let links = [];
    document.querySelectorAll('.mn-listing-item a.mn-listing-name').forEach(a => {
      if (a.href) links.push(a.href);
    });
    return links;
  });

  console.log(`Found ${profileLinks.length} company profiles`);

  const concurrency = 5; // Number of pages to scrape at once
  let allCompanies = [];

  // Helper to scrape one profile
  const scrapeProfile = async (link) => {
    const profilePage = await browser.newPage();
    await profilePage.goto(link, { waitUntil: 'networkidle2', timeout: 0 });
    await profilePage.waitForSelector('.mn-profile', { timeout: 15000 }).catch(() => {});

    const data = await profilePage.evaluate(() => {
      const getText = (selector) => document.querySelector(selector)?.innerText.trim() || "";
      const getHref = (selector) => document.querySelector(selector)?.href.trim() || "";

      return {
        company: getText('.mn-profile-name'),
        contact: getText('.mn-contact-name'),
        email: getHref('a[href^="mailto:"]').replace('mailto:', ''),
        website: getHref('a[target="_blank"]:not([href^="mailto:"])'),
        phone: getText('a[href^="tel:"]')
      };
    });

    await profilePage.close();
    return data;
  };

  // Process profiles in batches
  for (let i = 0; i < profileLinks.length; i += concurrency) {
    const batch = profileLinks.slice(i, i + concurrency);
    console.log(`Scraping batch ${i / concurrency + 1} of ${Math.ceil(profileLinks.length / concurrency)}`);

    const results = await Promise.all(batch.map(link => scrapeProfile(link)));
    allCompanies.push(...results);
  }

  console.log(`✅ Scraped ${allCompanies.length} companies with full details`);

  // Save to CSV
  let csvContent = "Company,Contact,Email,Website,Phone\n" + allCompanies.map(c =>
    `"${c.company.replace(/"/g, '""')}","${c.contact.replace(/"/g, '""')}","${c.email}","${c.website}","${c.phone}"`
  ).join("\n");

  const filePath = path.join(__dirname, "companies.csv");
  fs.writeFileSync(filePath, csvContent, "utf8");

  console.log(`💾 CSV saved to ${filePath}`);
  await browser.close();
})();

