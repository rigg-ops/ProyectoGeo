const fs = require('fs');
const path = require('path');

const files = [
    { name: 'ndwiData', path: 'assets/P10/10Bueno/Aguilar_NDWI_post.tif' },
    // MNDWI is very large (82MB), uncomment to attempt processing
    { name: 'mndwiData', path: 'assets/P10/10Bueno/Aguilar_MNDWI_post.tif' }
];

let outputContent = '// Practice 10 Data (Base64 encoded TIFs)\n\n';

files.forEach(file => {
    try {
        const filePath = path.join(__dirname, file.path);
        console.log(`Processing ${file.name} from ${filePath}...`);

        if (fs.existsSync(filePath)) {
            const fileBuffer = fs.readFileSync(filePath);
            const base64String = fileBuffer.toString('base64');
            outputContent += `const ${file.name} = "${base64String}";\n`;
            console.log(`✅ Processed ${file.name} (Size: ${(base64String.length / 1024 / 1024).toFixed(2)} MB)`);
        } else {
            console.error(`❌ File not found: ${filePath}`);
        }
    } catch (err) {
        console.error(`❌ Error processing ${file.name}:`, err);
    }
});

const outputPath = path.join(__dirname, 'assets/p10_data.js');
// Check if we have enough memory/disk space implies we just try to write
try {
    fs.writeFileSync(outputPath, outputContent);
    console.log(`\n🎉 Data written to ${outputPath}`);
} catch (err) {
    console.error(`❌ Error writing output file:`, err);
}
