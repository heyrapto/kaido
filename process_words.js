const fs = require('fs');

const text = fs.readFileSync('/Users/mac/kaido/words.md', 'utf8');
const lines = text.split('\n');

const words = [];
for (let line of lines) {
  if (!line || line.startsWith('Word\tDefinition')) continue;
  const parts = line.split('\t');
  if (parts.length >= 2) {
    const word = parts[0].trim().toLowerCase();
    const def = parts[1].trim();
    // Only keep words of reasonable length (4 to 10 chars)
    // Only alphabetical characters
    if (/^[a-z]{4,10}$/.test(word)) {
      words.push({ word, def });
    }
  }
}

// Write to dictionary.ts
let out = `export const OBSCURE_WORDS: { word: string, def: string }[] = [\n`;
for (const w of words) {
  // escape quotes
  const defSafe = w.def.replace(/"/g, '\\"');
  out += `  { word: "${w.word}", def: "${defSafe}" },\n`;
}
out += `];\n`;

fs.writeFileSync('/Users/mac/kaido/app/lib/dictionary.ts', out);
console.log('Successfully wrote', words.length, 'words to app/lib/dictionary.ts');
