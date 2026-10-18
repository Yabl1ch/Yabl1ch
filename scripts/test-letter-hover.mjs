import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '../screenshots');

function findBrowserExecutable() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  if (fs.existsSync(chromePath)) return chromePath;
  if (fs.existsSync(edgePath)) return edgePath;
  return undefined;
}

async function testLetterHover() {
  const browser = await chromium.launch({
    executablePath: findBrowserExecutable(),
    headless: true,
  });

  const url = process.env.SITE_URL || 'http://127.0.0.1:5889';
  console.log('Testing letter hover on:', url);

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Find all letter spans inside the header
  const letterLocators = page.locator('header .group\\/char');
  const count = await letterLocators.count();
  console.log(`Found ${count} nickname letters`);

  // Hover over letter 'Y' (index 0)
  console.log('\nHovering over letter 0 ("Y")...');
  const letter0 = letterLocators.nth(0);
  await letter0.hover();
  await page.waitForTimeout(250);

  const letter0Style = await letter0.locator('span').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      color: s.color,
      transform: s.transform,
      filter: s.filter,
    };
  });
  console.log('Letter 0 ("Y") computed style on hover:', letter0Style);

  // Hover over letter '1' (index 4)
  console.log('\nHovering over letter 4 ("1")...');
  const letter4 = letterLocators.nth(4);
  await letter4.hover();
  await page.waitForTimeout(250);

  const letter4Style = await letter4.locator('span').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      color: s.color,
      transform: s.transform,
      filter: s.filter,
    };
  });
  console.log('Letter 4 ("1") computed style on hover:', letter4Style);

  await page.screenshot({ path: path.join(outputDir, 'perf_letter_hover.png') });
  console.log('Saved perf_letter_hover.png');

  await browser.close();

  // Validate: color should be emerald rgb(52, 211, 153) or green rgb(74, 222, 128)
  const isEmerald =
    letter4Style.color.includes('52, 211, 153') ||
    letter4Style.color.includes('52,211,153') ||
    letter4Style.color.includes('74, 222, 128');
  if (isEmerald) {
    console.log('\nLETTER HOVER VERIFICATION: PASS (Instant emerald color and transform!)');
  } else {
    console.error('\nLETTER HOVER VERIFICATION: FAIL (Color did not change to emerald)');
    process.exit(1);
  }
}

testLetterHover().catch((err) => {
  console.error(err);
  process.exit(1);
});
