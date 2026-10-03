import fs from 'fs';
import path from 'path';

const emojiRegex = /\p{Extended_Pictographic}|\p{Emoji_Presentation}/u;

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        results = results.concat(walk(fullPath));
      }
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const filesToCheck = [
  ...walk('src'),
  ...walk('public'),
  'index.html'
];

let foundEmojis = 0;
for (const file of filesToCheck) {
  if (!fs.existsSync(file)) continue;
  // skip binary files if any
  if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.ico') || file.endsWith('.webp')) continue;
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const matches = line.match(new RegExp(emojiRegex, 'gu'));
    if (matches) {
      console.log(`EMOJI FOUND in ${file}:${idx + 1}: ${matches.join(' ')}`);
      console.log(`  Line: ${line.trim()}`);
      foundEmojis += matches.length;
    }
  });
}

console.log(`Total emojis found: ${foundEmojis}`);
if (foundEmojis > 0) {
  process.exit(1);
} else {
  console.log('ZERO EMOJIS CONFIRMED: PASS');
}
