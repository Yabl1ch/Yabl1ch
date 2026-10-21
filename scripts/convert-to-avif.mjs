import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const targetDirs = [
  path.join(rootDir, 'public'),
  path.join(rootDir, 'About me'),
  path.join(rootDir, 'My works'),
  path.join(rootDir, 'Сертификаты'),
];

function findImages(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(findImages(fullPath));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

async function convertAll() {
  console.log('Starting AVIF conversion of all project images...\n');

  let totalOldBytes = 0;
  let totalNewBytes = 0;
  let convertedCount = 0;

  for (const dir of targetDirs) {
    const images = findImages(dir);
    console.log(`Processing folder: ${path.relative(rootDir, dir)} (${images.length} images)`);

    for (const imgPath of images) {
      const ext = path.extname(imgPath);
      const avifPath = imgPath.slice(0, -ext.length) + '.avif';
      const oldSize = fs.statSync(imgPath).size;

      try {
        await sharp(imgPath)
          .avif({
            quality: 80,
            effort: 6,
            chromaSubsampling: '4:2:0',
          })
          .toFile(avifPath);

        const newSize = fs.statSync(avifPath).size;
        const savings = (((oldSize - newSize) / oldSize) * 100).toFixed(1);

        console.log(`  ✓ ${path.relative(rootDir, avifPath)}: ${(oldSize / 1024).toFixed(1)} KB -> ${(newSize / 1024).toFixed(1)} KB (-${savings}%)`);

        totalOldBytes += oldSize;
        totalNewBytes += newSize;
        convertedCount++;

        // If inside public/, delete the old file so only AVIF is shipped
        if (imgPath.includes(path.join(rootDir, 'public'))) {
          fs.unlinkSync(imgPath);
          console.log(`    (removed old ${ext} from public/)`);
        }
      } catch (err) {
        console.error(`  ✗ Error converting ${imgPath}:`, err.message);
      }
    }
    console.log('');
  }

  const totalSavings = (((totalOldBytes - totalNewBytes) / totalOldBytes) * 100).toFixed(1);
  console.log('----------------------------------------------------');
  console.log(`Total images converted: ${convertedCount}`);
  console.log(`Total original size:    ${(totalOldBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total AVIF size:        ${(totalNewBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total savings:          -${totalSavings}%`);
  console.log('----------------------------------------------------\n');
}

convertAll().catch(console.error);
