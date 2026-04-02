import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace standard green buttons with brutalist style
content = content.replace(/className="bg-\[#52b788\] hover:bg-\[#40916c\] text-black px-6 py-2 rounded-lg font-bold transition-colors"/g, 'className="bg-[#52b788] hover:bg-[#40916c] text-black px-6 py-2 rounded-lg font-bold transition-all border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none"');

content = content.replace(/className="bg-\[#52b788\] hover:bg-\[#40916c\] text-black px-4 py-2 rounded-lg font-bold transition-colors"/g, 'className="bg-[#52b788] hover:bg-[#40916c] text-black px-4 py-2 rounded-lg font-bold transition-all border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none"');

content = content.replace(/className="bg-\[#74c69d\] hover:bg-\[#52b788\] text-black px-6 py-2 rounded-lg font-bold transition-colors flex items-center"/g, 'className="bg-[#74c69d] hover:bg-[#52b788] text-black px-6 py-2 rounded-lg font-bold transition-all border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none flex items-center"');

content = content.replace(/className="bg-\[#52b788\] hover:bg-\[#40916c\] text-black px-6 py-2 rounded-lg font-bold transition-colors flex items-center"/g, 'className="bg-[#52b788] hover:bg-[#40916c] text-black px-6 py-2 rounded-lg font-bold transition-all border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none flex items-center"');

content = content.replace(/className="w-full bg-\[#52b788\] hover:bg-\[#74c69d\] text-black font-bold py-2 px-4 rounded-lg transition-colors"/g, 'className="w-full bg-[#52b788] hover:bg-[#74c69d] text-black font-bold py-2 px-4 rounded-lg transition-all border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none"');

// Stop buttons (red)
content = content.replace(/className="bg-rose-950\/50 hover:bg-rose-900\/50 text-rose-400 px-6 py-2 rounded-lg font-bold transition-colors flex items-center"/g, 'className="bg-rose-500 hover:bg-rose-600 text-black px-6 py-2 rounded-lg font-bold transition-all border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none flex items-center"');

fs.writeFileSync('src/App.tsx', content);
console.log('Replacements complete');
