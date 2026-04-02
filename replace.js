import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Colors
content = content.replace(/bg-\[#081c15\]/g, 'bg-[#06140f]');
content = content.replace(/border-\[#1b4332\]/g, 'border-black');
content = content.replace(/divide-\[#1b4332\]/g, 'divide-black');
content = content.replace(/shadow-\[#04100c\]\/50/g, 'shadow-black/80');
content = content.replace(/bg-\[#04100c\]/g, 'bg-black');

// Reds
content = content.replace(/text-red-400/g, 'text-rose-400/90');
content = content.replace(/hover:text-red-300/g, 'hover:text-rose-300');
content = content.replace(/text-\[#ff5f56\]/g, 'text-rose-400');
content = content.replace(/bg-\[#ff5f56\]\/10/g, 'bg-rose-950/50');
content = content.replace(/border-\[#ff5f56\]\/20/g, 'border-black');

// Yellows
content = content.replace(/text-yellow-500/g, 'text-amber-400/90');
content = content.replace(/bg-yellow-500\/10/g, 'bg-amber-950/30');

// Layout / Resizability
// Make sure the main container is h-screen w-full
content = content.replace(/className="h-screen bg-black text-\[#d8f3dc\] flex flex-col font-sans"/, 'className="h-screen w-full bg-black text-[#d8f3dc] flex flex-col font-sans overflow-hidden"');

fs.writeFileSync('src/App.tsx', content);
console.log('Replacements complete');
