import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function findBrowserExecutable() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  if (fs.existsSync(chromePath)) return chromePath;
  if (fs.existsSync(edgePath)) return edgePath;
  return undefined;
}

async function runVerification() {
  const port = 5889;
  console.log(`Starting vite preview on port ${port}...`);
  const server = spawn('npx', ['vite', 'preview', '--port', String(port), '--host', '127.0.0.1', '--strictPort'], {
    shell: true,
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => process.stdout.write(`[preview] ${d}`));
  server.stderr.on('data', (d) => process.stderr.write(`[preview err] ${d}`));

  // Wait a couple seconds for preview server
  await new Promise((r) => setTimeout(r, 2500));

  const browser = await chromium.launch({
    headless: true,
    executablePath: findBrowserExecutable(),
  });

  const page = await browser.newPage();
  const failedRequests = [];
  page.on('requestfailed', (req) => {
    failedRequests.push({ url: req.url(), failure: req.failure() });
  });

  page.on('response', (res) => {
    if (res.status() >= 400) {
      failedRequests.push({ url: res.url(), status: res.status() });
    }
  });

  try {
    console.log('Navigating to http://127.0.0.1:5889/ ...');
    await page.goto('http://127.0.0.1:5889/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Check Bio Tab images
    console.log('Checking images on Bio tab...');
    const imagesBio = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map((img) => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      }));
    });
    console.log('Bio Tab Images:', JSON.stringify(imagesBio, null, 2));

    // Click My Works tab
    console.log('Switching to My works tab...');
    await page.click('button:has-text("Работы"), button:has-text("My work"), button:has-text("Мои работы")');
    await page.waitForTimeout(600);

    const imagesWorks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map((img) => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      }));
    });
    console.log('Works Tab Images:', JSON.stringify(imagesWorks, null, 2));

    // Click Certificates tab
    console.log('Switching to Certificates tab...');
    await page.click('button:has-text("Certificates"), button:has-text("Certs")');
    await page.waitForTimeout(600);

    const imagesCerts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map((img) => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      }));
    });
    console.log('Certificates Tab Images:', JSON.stringify(imagesCerts, null, 2));

    // Check broken images
    const allImages = [...imagesBio, ...imagesWorks, ...imagesCerts];
    const broken = allImages.filter((img) => !img.complete || img.naturalWidth === 0);

    console.log('\n--- VERIFICATION SUMMARY ---');
    console.log(`Total images inspected: ${allImages.length}`);
    console.log(`Failed network requests: ${failedRequests.length}`);
    if (failedRequests.length > 0) {
      console.error('Failed requests:', failedRequests);
    }
    console.log(`Broken images: ${broken.length}`);
    if (broken.length > 0) {
      console.error('Broken images:', broken);
    }

    if (failedRequests.length > 0 || broken.length > 0) {
      console.error('VERIFICATION FAILED!');
      process.exitCode = 1;
    } else {
      console.log('ALL AVIF IMAGES LOADED PERFECTLY! PASS!');
    }
  } finally {
    await browser.close();
    server.kill();
    // make sure port is freed on windows
    try {
      spawn('taskkill', ['/F', '/T', '/PID', String(server.pid)]);
    } catch {}
  }
}

runVerification().catch((err) => {
  console.error(err);
  process.exit(1);
});
