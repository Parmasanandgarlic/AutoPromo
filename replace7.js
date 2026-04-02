import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/border border-black/g, 'border-2 border-black');

fs.writeFileSync('src/App.tsx', content);
console.log('Replacements complete');
