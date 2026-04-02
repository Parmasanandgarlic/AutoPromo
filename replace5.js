import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold transition-colors flex items-center"/g, 'className="bg-rose-400 hover:bg-rose-500 text-black px-6 py-2 rounded-lg font-bold transition-all border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none flex items-center"');

fs.writeFileSync('src/App.tsx', content);
console.log('Replacements complete');
