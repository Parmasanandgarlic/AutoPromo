import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/<div className="bg-\[#06140f\] border border-black rounded-xl overflow-hidden shadow-lg shadow-black\/80">\n\s*<table className="w-full text-left text-sm">/g, '<div className="bg-[#06140f] border border-black rounded-xl overflow-x-auto shadow-lg shadow-black/80">\n                <table className="w-full text-left text-sm min-w-[600px]">');

fs.writeFileSync('src/App.tsx', content);
console.log('Replacements complete');
