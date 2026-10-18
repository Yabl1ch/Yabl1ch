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

  const url = process.env.SITE_URL || 'http://127.0.0.1:5889';
  console.log('Capturing screenshots from:', url);

  // 1. Desktop Viewport (1920x1080)
  console.log('\n--- Desktop 1920x1080 ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktopContext.newPage();
  
  // Listen for console errors
  desktopPage.on('console', msg => console.log('PAGE LOG:', msg.text()));
  desktopPage.on('pageerror', err => console.error('PAGE ERROR:', err));

  await desktopPage.goto(url, { waitUntil: 'domcontentloaded' });

  // Capture glowing grid squares manifesting (~280ms into 0.5s phase)
  await desktopPage.waitForTimeout(280);
  await desktopPage.screenshot({
    path: path.join(outputDir, 'desktop_grid_manifesting.png'),
    fullPage: false,
  });
  console.log('Saved: desktop_grid_manifesting.png');

  // Capture content reveal (~600ms into 0.5s-0.7s reveal phase)
  await desktopPage.waitForTimeout(320);
  await desktopPage.screenshot({
    path: path.join(outputDir, 'desktop_content_reveal.png'),
    fullPage: false,
  });
  console.log('Saved: desktop_content_reveal.png');

  // Wait for intro to complete (after 700ms total)
  await desktopPage.waitForTimeout(400);

  // Capture Bio tab after intro completes
  await desktopPage.screenshot({
    path: path.join(outputDir, 'desktop_bio_with_github_avatar.png'),
    fullPage: false,
  });
  console.log('Saved: desktop_bio_with_github_avatar.png');

  // Hover over Telegram social card to test green liquid glass
  console.log('Hovering on social card to capture green liquid glass effect...');
  await desktopPage.hover('text="Telegram"');
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(outputDir, 'desktop_social_liquid_glass.png'),
    fullPage: false,
  });
  console.log('Saved: desktop_social_liquid_glass.png');

  // Click on "My certificates" tab
  console.log('Navigating to My certificates tab...');
  await desktopPage.click('text="My certificates"');
  await desktopPage.waitForTimeout(600);

  // Capture "My certificates" grid view
  await desktopPage.screenshot({
    path: path.join(outputDir, 'desktop_certificates_tab.png'),
    fullPage: false,
  });
  console.log('Saved: desktop_certificates_tab.png');

  // Hover over the IBM certificate card to test smooth hover
  console.log('Hovering on IBM certificate card...');
  await desktopPage.hover('text="Artificial Intelligence Fundamentals"');
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(outputDir, 'desktop_certificate_hover.png'),
    fullPage: false,
  });
  console.log('Saved: desktop_certificate_hover.png');

  // Click on the first certificate to open CertificateModal
  console.log('Opening CertificateModal for Introduction to Generative AI...');
  await desktopPage.click('text="Introduction to Generative AI"');
  await desktopPage.waitForTimeout(500);

  // Verify verification link is present
  const verifyLink = await desktopPage.getAttribute('a:has-text("Проверить подлинность")', 'href');
  console.log('Found verification URL:', verifyLink);

  // Capture modal view with cover & verification link
  await desktopPage.screenshot({
    path: path.join(outputDir, 'desktop_certificate_modal.png'),
    fullPage: false,
  });
  console.log('Saved: desktop_certificate_modal.png');

  // Test copy link button and toast
  await desktopPage.click('button:has-text("Скопировать ссылку")');
  await desktopPage.waitForTimeout(300);

  // Close modal
  await desktopPage.click('button:has-text("Закрыть")');
  await desktopPage.waitForTimeout(400);

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
  await mobilePage.goto(url, { waitUntil: 'domcontentloaded' });

  // Wait for 0.7s intro to finish on mobile
  await mobilePage.waitForTimeout(1000);

  // Mobile Bio with Bio tab and official brand avatars
  await mobilePage.screenshot({
    path: path.join(outputDir, 'mobile_bio_with_brand_avatars.png'),
    fullPage: false,
  });
  console.log('Saved: mobile_bio_with_brand_avatars.png');

  // Switch to My certificates on mobile
  await mobilePage.click('text="My certificates"');
  await mobilePage.waitForTimeout(500);

  await mobilePage.screenshot({
    path: path.join(outputDir, 'mobile_certificates_tab.png'),
    fullPage: false,
  });
  console.log('Saved: mobile_certificates_tab.png');

  await mobileContext.close();
  await browser.close();
  console.log('\nAll new screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
