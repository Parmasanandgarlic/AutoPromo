import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/border-\[#081c15\]/g, 'border-black');
content = content.replace(/text-\[#04100c\]/g, 'text-black');
content = content.replace(/bg-\[#04100c\]/g, 'bg-black');
content = content.replace(/shadow-\[#04100c\]/g, 'shadow-black');

fs.writeFileSync('src/App.tsx', content);
console.log('Replacements complete');
