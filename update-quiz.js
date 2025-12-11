const fs = require('fs');
const path = require('path');

// Get image files from images directory
const imagesDir = path.join(__dirname, 'images');
const files = fs.readdirSync(imagesDir);

// Filter image files
const imageFiles = files.filter(f => 
    f.endsWith('.png') || 
    f.endsWith('.jpg') || 
    f.endsWith('.jpeg')
);

// Group into pairs
const pairs = [];
const processed = new Set();

imageFiles.forEach(file => {
    if (processed.has(file)) return;

    let animeName;
    if (file.includes('-zoomed')) {
        animeName = file.split('-zoomed')[0];
    } else if (file.includes('-full')) {
        animeName = file.split('-full')[0];
    } else {
        return;
    }

    const zoomed = imageFiles.find(f => f.startsWith(`${animeName}-zoomed`));
    const full = imageFiles.find(f => f.startsWith(`${animeName}-full`));

    if (zoomed && full && !processed.has(zoomed)) {
        const readableName = animeName
            .replace(/-/g, ' ')
            .replace(/^\d+\s*/, '')
            .trim();

        pairs.push({
            anime: readableName,
            zoomed: zoomed,
            full: full
        });

        processed.add(zoomed);
        processed.add(full);
    }
});

if (pairs.length === 0) {
    console.error('No image pairs found in images folder!');
    process.exit(1);
}

// Generate quizData code
let quizDataCode = 'const quizData = [\n';
pairs.forEach((pair, index) => {
    quizDataCode += `    { zoomed: '${pair.zoomed}', full: '${pair.full}', answer: '${pair.anime}' }`;
    if (index < pairs.length - 1) {
        quizDataCode += ',';
    }
    quizDataCode += '\n';
});
quizDataCode += '];';

// Read current script.js
const scriptPath = path.join(__dirname, 'script.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Replace quizData array
const regex = /\/\/\s*Quiz data[^\n]*\nconst quizData = \[[^\]]*\];/s;
scriptContent = scriptContent.replace(
    regex,
    `// Quiz data - pairs of images (zoomed and full versions)\n${quizDataCode}`
);

// Write back to script.js
fs.writeFileSync(scriptPath, scriptContent, 'utf8');

console.log('✓ Quiz updated successfully!');
console.log(`Found ${pairs.length} anime pairs:`);
pairs.forEach((pair, i) => {
    console.log(`  ${i + 1}. ${pair.anime}`);
});
