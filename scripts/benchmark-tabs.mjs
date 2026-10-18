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

async function benchmark() {
  const executablePath = findBrowserExecutable();
  console.log('Using browser executable:', executablePath || 'bundled chromium');

  const browser = await chromium.launch({
    executablePath,
    headless: true,
  });

  const url = process.env.SITE_URL || 'http://127.0.0.1:5889';
  console.log('Benchmarking tab switching speed on:', url);

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  // Wait for 0.7s intro and initial content reveal to settle
  await page.waitForTimeout(1200);

  // 1. Benchmark Bio -> My Work
  console.log('\n--- Test 1: Switch to "My Work" ---');
  const t0 = Date.now();
  await page.click('button:has-text("My Work")');
  // Wait for MudroHub card to appear
  await page.waitForSelector('text="MudroHub"', { timeout: 1500 });
  const t1 = Date.now();
  console.log(`Latency to content visible in "My Work": ${t1 - t0}ms (Target: < 350ms)`);

  // Capture screenshot during / after transition
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outputDir, 'perf_my_work_immediate.png') });
  console.log('Saved: perf_my_work_immediate.png');

  // 2. Benchmark My Work -> My certificates
  console.log('\n--- Test 2: Switch to "My certificates" ---');
  const t2 = Date.now();
  await page.click('button:has-text("My certificates")');
  // Wait for first certificate card title to appear
  await page.waitForSelector('text="Introduction to Generative AI"', { timeout: 1500 });
  const t3 = Date.now();
  console.log(`Latency to content visible in "My certificates": ${t3 - t2}ms (Target: < 350ms)`);

  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outputDir, 'perf_my_certificates_immediate.png') });
  console.log('Saved: perf_my_certificates_immediate.png');

  // 3. Benchmark My certificates -> Bio
  console.log('\n--- Test 3: Switch back to "Bio" ---');
  const t4 = Date.now();
  await page.click('button:has-text("Bio")');
  await page.waitForSelector('text="Связь и соцсети"', { timeout: 1500 });
  const t5 = Date.now();
  console.log(`Latency to content visible in "Bio": ${t5 - t4}ms (Target: < 350ms)`);

  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outputDir, 'perf_bio_immediate.png') });
  console.log('Saved: perf_bio_immediate.png');

  await browser.close();

  const maxLatency = Math.max(t1 - t0, t3 - t2, t5 - t4);
  console.log(`\nOverall Maximum Content Latency: ${maxLatency}ms`);
  if (maxLatency < 400) {
    console.log('LIGHTNING-FAST STATUS: PASS (< 400ms across all tabs)');
  } else {
    console.error('LIGHTNING-FAST STATUS: FAIL (> 400ms)');
    process.exit(1);
  }
}

benchmark().catch((err) => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});
