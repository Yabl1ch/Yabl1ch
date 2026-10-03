import fs from 'fs';

const aboutme = fs.readFileSync('About me/ABOUTME.md', 'utf8').replace(/\r\n/g, '\n').trim();
const bioTs = fs.readFileSync('src/data/bio.ts', 'utf8');

// Read the paragraphs using regex or dynamic import
const paragraphsMatch = bioTs.match(/paragraphs:\s*\[([\s\S]*?)\]/);
if (!paragraphsMatch) {
  console.error('Could not find paragraphs in src/data/bio.ts');
  process.exit(1);
}

// Evaluate array of strings
const lines = eval('[' + paragraphsMatch[1] + ']');
const bioText = lines.join('\n\n').replace(/\r\n/g, '\n').trim();

console.log('ABOUTME length:', aboutme.length);
console.log('BioText length:', bioText.length);
if (aboutme === bioText) {
  console.log('VERBATIM MATCH: PASS (100% exact match)');
} else {
  console.error('MISMATCH FOUND: FAIL');
  for (let i = 0; i < Math.max(aboutme.length, bioText.length); i++) {
    if (aboutme[i] !== bioText[i]) {
      console.log(`Diff at char ${i}: expected '${aboutme[i]}' (${aboutme.charCodeAt(i)}), got '${bioText[i]}' (${bioText.charCodeAt(i)})`);
      console.log(`Context aboutme: ${aboutme.slice(Math.max(0, i-20), i+20)}`);
      console.log(`Context bioText: ${bioText.slice(Math.max(0, i-20), i+20)}`);
      break;
    }
  }
  process.exit(1);
}
