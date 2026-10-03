import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '../screenshots');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Find Chrome or Edge executable on Windows
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

  const url = process.env.SITE_URL || 'http://localhost:5173';
  console.log('Capturing screenshots from:', url);

  // 1. Desktop Viewport (1920x1080)
  console.log('\n--- Desktop 1920x1080 ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(url, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1500); // Wait for entrance animations

  // Desktop Bio
  await desktopPage.screenshot({
    path: path.join(outputDir, 'desktop_bio.png'),
    fullPage: false,
  });
  console.log('Saved: desktop_bio.png');

  // Switch to My Work tab
  const workTab = desktopPage.locator('button:has-text("My Work")');
  if (await workTab.count() > 0) {
    await workTab.first().click();
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({
      path: path.join(outputDir, 'desktop_my_work.png'),
      fullPage: false,
    });
    console.log('Saved: desktop_my_work.png');

    // Click first project (MudroHub)
    const firstProject = desktopPage.locator('text=MudroHub').first();
    if (await firstProject.count() > 0) {
      await firstProject.click();
      await desktopPage.waitForTimeout(1000);
      await desktopPage.screenshot({
        path: path.join(outputDir, 'desktop_modal_mudrohub.png'),
        fullPage: false,
      });
      console.log('Saved: desktop_modal_mudrohub.png');

      // Close modal
      const closeBtn = desktopPage.locator('button[aria-label="Закрыть"], button[aria-label="Close"], button:has-text("✕")').first();
      if (await closeBtn.count() > 0) {
        await closeBtn.click();
        await desktopPage.waitForTimeout(800);
      } else {
        await desktopPage.keyboard.press('Escape');
        await desktopPage.waitForTimeout(800);
      }
    }
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
  await mobilePage.goto(url, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1500);

  // Mobile Bio
  await mobilePage.screenshot({
    path: path.join(outputDir, 'mobile_bio.png'),
    fullPage: false,
  });
  console.log('Saved: mobile_bio.png');

  // Switch to My Work
  const mobileWorkTab = mobilePage.locator('button:has-text("My Work")');
  if (await mobileWorkTab.count() > 0) {
    await mobileWorkTab.first().click();
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({
      path: path.join(outputDir, 'mobile_my_work.png'),
      fullPage: false,
    });
    console.log('Saved: mobile_my_work.png');

    // Open project modal on mobile
    const mobileFirstProj = mobilePage.locator('text=MudroHub').first();
    if (await mobileFirstProj.count() > 0) {
      await mobileFirstProj.click();
      await mobilePage.waitForTimeout(1000);
      await mobilePage.screenshot({
        path: path.join(outputDir, 'mobile_modal.png'),
        fullPage: false,
      });
      console.log('Saved: mobile_modal.png');
    }
  }

  await mobileContext.close();
  await browser.close();
  console.log('\nAll screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
