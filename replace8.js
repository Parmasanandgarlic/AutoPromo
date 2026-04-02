import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/border-r border-black/g, 'border-r-2 border-black');
content = content.replace(/border-b border-black/g, 'border-b-2 border-black');
content = content.replace(/border-t border-black/g, 'border-t-2 border-black');

fs.writeFileSync('src/App.tsx', content);
console.log('Replacements complete');
