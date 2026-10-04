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
  await desktopPage.waitForTimeout(1200);

  // Desktop Bio (Collapsed)
  await desktopPage.screenshot({
    path: path.join(outputDir, 'desktop_bio_collapsed.png'),
    fullPage: false,
  });
  console.log('Saved: desktop_bio_collapsed.png');

  // Click Discord card to trigger copy toast
  const discordCard = desktopPage.locator('button:has-text("Discord")').first();
  if (await discordCard.count() > 0) {
    await discordCard.click();
    await desktopPage.waitForTimeout(400);
    await desktopPage.screenshot({
      path: path.join(outputDir, 'desktop_bio_toast_centered.png'),
      fullPage: false,
    });
    console.log('Saved: desktop_bio_toast_centered.png');
  }

  // Expand "Обо мне"
  const expandBtn = desktopPage.locator('button:has-text("Обо мне")').first();
  if (await expandBtn.count() > 0) {
    await expandBtn.click();
    await desktopPage.waitForTimeout(600);
    await desktopPage.screenshot({
      path: path.join(outputDir, 'desktop_bio_expanded.png'),
      fullPage: false,
    });
    console.log('Saved: desktop_bio_expanded.png');
  }

  // Switch to My Work tab
  const workTab = desktopPage.locator('button:has-text("My Work")');
  if (await workTab.count() > 0) {
    await workTab.first().click();
    await desktopPage.waitForTimeout(800);
    await desktopPage.screenshot({
      path: path.join(outputDir, 'desktop_my_work.png'),
      fullPage: false,
    });
    console.log('Saved: desktop_my_work.png');

    // Click first project (MudroHub)
    const firstProject = desktopPage.locator('text=MudroHub').first();
    if (await firstProject.count() > 0) {
      await firstProject.click();
      await desktopPage.waitForTimeout(800);
      await desktopPage.screenshot({
        path: path.join(outputDir, 'desktop_modal_mudrohub.png'),
        fullPage: false,
      });
      console.log('Saved: desktop_modal_mudrohub.png');

      // Click next image in carousel to test sliding animation
      const nextBtn = desktopPage.locator('button[aria-label="Следующий скриншот"]').first();
      if (await nextBtn.count() > 0) {
        await nextBtn.click();
        await desktopPage.waitForTimeout(500);
        await desktopPage.screenshot({
          path: path.join(outputDir, 'desktop_modal_slide2.png'),
          fullPage: false,
        });
        console.log('Saved: desktop_modal_slide2.png');
      }

      // Close modal
      await desktopPage.keyboard.press('Escape');
      await desktopPage.waitForTimeout(500);
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
  await mobilePage.waitForTimeout(1200);

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
    await mobilePage.waitForTimeout(800);
    await mobilePage.screenshot({
      path: path.join(outputDir, 'mobile_my_work.png'),
      fullPage: false,
    });
    console.log('Saved: mobile_my_work.png');

    // Open project modal on mobile
    const mobileFirstProj = mobilePage.locator('text=MudroHub').first();
    if (await mobileFirstProj.count() > 0) {
      await mobileFirstProj.click();
      await mobilePage.waitForTimeout(800);
      await mobilePage.screenshot({
        path: path.join(outputDir, 'mobile_modal.png'),
        fullPage: false,
      });
      console.log('Saved: mobile_modal.png');
    }
  }

  await mobileContext.close();
  await browser.close();
  console.log('\nAll updated screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
