import fs from 'fs';

let content = fs.readFileSync('src/index.css', 'utf8');

// Tone down scanlines
content = content.replace(/rgba\(0, 0, 0, 0\.25\)/g, 'rgba(0, 0, 0, 0.1)');
content = content.replace(/rgba\(255, 0, 0, 0\.06\)/g, 'rgba(255, 0, 0, 0.02)');
content = content.replace(/rgba\(0, 255, 0, 0\.02\)/g, 'rgba(0, 255, 0, 0.01)');
content = content.replace(/rgba\(0, 0, 255, 0\.06\)/g, 'rgba(0, 0, 255, 0.02)');

// Tone down text shadow
content = content.replace(/rgba\(0,30,255,0\.5\)/g, 'rgba(0,30,255,0.15)');
content = content.replace(/rgba\(255,0,80,0\.3\)/g, 'rgba(255,0,80,0.1)');
content = content.replace(/0 0 3px/g, '0 0 1px');

fs.writeFileSync('src/index.css', content);
console.log('Replacements complete');
