import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '../screenshots');

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

async function capture() {
  const executablePath = findBrowserExecutable();
  console.log('Using browser executable:', executablePath || 'bundled chromium');

  const browser = await chromium.launch({
    executablePath,
    headless: true,
  });

  const url = process.env.SITE_URL || 'http://127.0.0.1:5888';
  console.log('Capturing screenshots from:', url);

  // 1. Desktop Viewport (1920x1080)
  console.log('\n--- Desktop 1920x1080 ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(url);

  // Capture Splash Screen midway (after 700ms)
  await desktopPage.waitForTimeout(700);
  await desktopPage.screenshot({
    path: path.join(outputDir, 'desktop_splash_screen.png'),
    fullPage: false,
  });
  console.log('Saved: desktop_splash_screen.png');

  // Wait for splash screen to complete and content to reveal (total ~2.4s)
  await desktopPage.waitForTimeout(2500);

  // Capture Bio tab with "Bio" button and official brand avatars
  await desktopPage.screenshot({
    path: path.join(outputDir, 'desktop_bio_with_brand_avatars.png'),
    fullPage: false,
  });
  console.log('Saved: desktop_bio_with_brand_avatars.png');

  // Switch to My Work
  const workTab = desktopPage.locator('button:has-text("My Work")');
  if (await workTab.count() > 0) {
    await workTab.first().click();
    await desktopPage.waitForTimeout(800);
    await desktopPage.screenshot({
      path: path.join(outputDir, 'desktop_my_work.png'),
      fullPage: false,
    });
    console.log('Saved: desktop_my_work.png');
  }

  await desktopContext.close();

  // 2. Mobile Viewport (390x844 - iPhone 14)
  console.log('\n--- Mobile 390x844 ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(url);

  // Wait for splash screen to complete on mobile
  await mobilePage.waitForTimeout(3000);

  // Mobile Bio with Bio tab and official brand avatars
  await mobilePage.screenshot({
    path: path.join(outputDir, 'mobile_bio_with_brand_avatars.png'),
    fullPage: false,
  });
  console.log('Saved: mobile_bio_with_brand_avatars.png');

  await mobileContext.close();
  await browser.close();
  console.log('\nAll new screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
