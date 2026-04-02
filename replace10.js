import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Change border-black to border-[#95d5b2]
content = content.replace(/border-black/g, 'border-[#95d5b2]');
// Change shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] to shadow-[4px_4px_0px_0px_#95d5b2]
content = content.replace(/shadow-\[4px_4px_0px_0px_rgba\(0,0,0,1\)\]/g, 'shadow-[4px_4px_0px_0px_#95d5b2]');
// Change shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] to shadow-[2px_2px_0px_0px_#95d5b2]
content = content.replace(/shadow-\[2px_2px_0px_0px_rgba\(0,0,0,1\)\]/g, 'shadow-[2px_2px_0px_0px_#95d5b2]');
// Make borders thicker
content = content.replace(/border-2/g, 'border-4');
content = content.replace(/border-b-2/g, 'border-b-4');
content = content.replace(/border-r-2/g, 'border-r-4');
content = content.replace(/border-t-2/g, 'border-t-4');

// Add CRT effect class to the main container
content = content.replace(/className="h-screen w-full overflow-hidden bg-black text-\[#d8f3dc\] font-sans flex flex-col selection:bg-\[#52b788\] selection:text-black"/, 'className="h-screen w-full overflow-hidden bg-black text-[#d8f3dc] font-mono flex flex-col selection:bg-[#52b788] selection:text-black crt"');

fs.writeFileSync('src/App.tsx', content);
console.log('Replacements complete');
