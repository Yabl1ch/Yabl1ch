import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '../screenshots/mobile');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function findBrowserExecutable() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  if (fs.existsSync(chromePath)) return chromePath;
  if (fs.existsSync(edgePath)) return edgePath;
  return undefined;
}

async function testViewport(browser, width, height, deviceName) {
  console.log(`\n=== Testing Viewport: ${deviceName} (${width}x${height}) ===`);
  const url = process.env.SITE_URL || 'http://127.0.0.1:5889';
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    isMobile: width < 600,
    hasTouch: width < 600,
  });
  const page = await context.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);

  // Helper to check tabs overflow
  const checkTabOverflow = async (tabName) => {
    return await page.evaluate((name) => {
      const nav = document.querySelector('nav');
      const pill = nav ? nav.querySelector('div') : null;
      if (!pill) return { error: 'No pill container' };
      return {
        tabName: name,
        scrollWidth: pill.scrollWidth,
        clientWidth: pill.clientWidth,
        hasOverflow: pill.scrollWidth > pill.clientWidth,
        scrollLeft: pill.scrollLeft,
      };
    }, tabName);
  };

  // 1. Initial Bio
  let info = await checkTabOverflow('Bio');
  console.log('Tabs overflow in Bio:', info);
  await page.screenshot({ path: path.join(outputDir, `${deviceName}_01_bio.png`) });

  // 2. Switch to Work
  await page.click('button:has-text("Work")');
  await page.waitForTimeout(300);
  info = await checkTabOverflow('Work');
  console.log('Tabs overflow in Work:', info);
  await page.screenshot({ path: path.join(outputDir, `${deviceName}_02_work.png`) });

  // 3. Switch to Certificates
  await page.click('button:has-text("Cert")');
  await page.waitForTimeout(300);
  info = await checkTabOverflow('Certificates');
  console.log('Tabs overflow in Certificates:', info);
  await page.screenshot({ path: path.join(outputDir, `${deviceName}_03_certificates.png`) });

  // 4. Click a certificate to test responsive modal
  await page.click('article:has-text("Introduction to Generative AI")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outputDir, `${deviceName}_04_cert_modal.png`) });
  await page.click('button[aria-label="Закрыть окно"]');
  await page.waitForTimeout(200);

  await context.close();
  return info.hasOverflow;
}

async function run() {
  const browser = await chromium.launch({
    executablePath: findBrowserExecutable(),
    headless: true,
  });

  // Test iPhone SE (375x667)
  const overflowSE = await testViewport(browser, 375, 667, 'iphone_se');

  // Test iPhone 14/15 (390x844)
  const overflow14 = await testViewport(browser, 390, 844, 'iphone_14');

  // Test Desktop (1440x900)
  const overflowDesktop = await testViewport(browser, 1440, 900, 'desktop');

  await browser.close();

  if (overflowSE || overflow14 || overflowDesktop) {
    console.error('\nERROR: Tab overflow / horizontal scrollbar still detected!');
    process.exit(1);
  } else {
    console.log('\nSUCCESS: 0 Tab Overflow on ALL viewports! Zero horizontal scrollbars!');
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
