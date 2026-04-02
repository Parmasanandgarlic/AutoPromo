import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/className="w-full bg-black border border-black rounded-lg px-4 py-2 text-\[#d8f3dc\] focus:outline-none focus:border-\[#52b788\]"/g, 'className="w-full bg-black border-2 border-black rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors"');

content = content.replace(/className="flex-1 bg-black border border-black rounded-lg px-4 py-2 text-\[#d8f3dc\] focus:outline-none focus:border-\[#52b788\]"/g, 'className="flex-1 bg-black border-2 border-black rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors"');

content = content.replace(/className="bg-black border border-black rounded-lg px-4 py-2 text-\[#d8f3dc\] focus:outline-none focus:border-\[#52b788\]"/g, 'className="bg-black border-2 border-black rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors"');

content = content.replace(/className="w-full md:w-1\/2 bg-black border border-black rounded-lg px-4 py-2 text-\[#d8f3dc\] focus:outline-none focus:border-\[#52b788\]"/g, 'className="w-full md:w-1/2 bg-black border-2 border-black rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors"');

content = content.replace(/className="w-full h-32 bg-black border border-black rounded-lg px-4 py-3 text-\[#d8f3dc\] focus:outline-none focus:border-\[#52b788\] font-mono text-sm leading-relaxed"/g, 'className="w-full h-32 bg-black border-2 border-black rounded-lg px-4 py-3 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] font-mono text-sm leading-relaxed transition-colors"');

content = content.replace(/className="w-32 bg-black border border-black rounded-lg px-4 py-2 text-\[#d8f3dc\] focus:outline-none focus:border-\[#52b788\]"/g, 'className="w-32 bg-black border-2 border-black rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors"');

content = content.replace(/className="w-full bg-black border border-black rounded-lg px-4 py-2 text-\[#d8f3dc\] focus:outline-none focus:border-\[#52b788\] h-24"/g, 'className="w-full bg-black border-2 border-black rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] h-24 transition-colors"');

fs.writeFileSync('src/App.tsx', content);
console.log('Replacements complete');
