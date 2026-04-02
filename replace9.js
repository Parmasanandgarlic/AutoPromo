import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/className={`px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 transition-all \$\{toast.type === 'error' \? 'bg-rose-950\/50 border-black text-rose-400' : 'bg-\[#52b788\]\/10 border-\[#52b788\]\/20 text-\[#52b788\]'}`}/g, 'className={`px-4 py-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 flex items-center gap-3 transition-all ${toast.type === \'error\' ? \'bg-rose-950/80 border-black text-rose-400\' : \'bg-[#06140f] border-black text-[#52b788]\'}`}');

fs.writeFileSync('src/App.tsx', content);
console.log('Replacements complete');
