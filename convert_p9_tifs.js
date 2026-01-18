const fs = require('fs');
const path = require('path');

const files = [
    { name: 'saviData', path: 'assets/p9/Aguilar_SAVI_post.tif' },
    { name: 'eviData', path: 'assets/p9/Aguilar_EVI_post.tif' }
];

let outputContent = '// Practice 9 Data (Base64 encoded TIFs)\n\n';

files.forEach(file => {
    try {
        const filePath = path.join(__dirname, file.path);
        if (fs.existsSync(filePath)) {
            const fileBuffer = fs.readFileSync(filePath);
            const base64String = fileBuffer.toString('base64');
            outputContent += `const ${file.name} = "${base64String}";\n`;
            console.log(`✅ Processed ${file.name}`);
        } else {
            console.error(`❌ File not found: ${filePath}`);
        }
    } catch (err) {
        console.error(`❌ Error processing ${file.name}:`, err);
    }
});

const outputPath = path.join(__dirname, 'assets/p9_data.js');
fs.writeFileSync(outputPath, outputContent);
console.log(`\n🎉 Data written to ${outputPath}`);
