const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'assets', 'SEVERIDAD.tif');
const outputPath = path.join(__dirname, 'assets', 'severidad_data.js');

try {
    console.log(`Reading from: ${inputPath}`);
    if (!fs.existsSync(inputPath)) {
        console.error("Error: Input file does not exist.");
        process.exit(1);
    }

    const fileBuffer = fs.readFileSync(inputPath);
    const base64String = fileBuffer.toString('base64');

    const jsContent = `const severidadData = "${base64String}";`;

    fs.writeFileSync(outputPath, jsContent);
    console.log(`Successfully created ${outputPath} with size ${jsContent.length} bytes.`);

} catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
}
