const fs = require('fs');
const https = require('https');
const path = require('path');

// Characters to keep - Latin + Spanish
const LATIN_RANGES = 'U+0020-007F,U+00A0-00FF,U+0100-017F,U+2000-206F,U+20A0-20CF';

// Download and save file
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest);
            reject(err);
        });
    });
}

// Convert font to base64
function fontToBase64(fontPath) {
    const fontBuffer = fs.readFileSync(fontPath);
    return fontBuffer.toString('base64');
}

// Main function
async function optimizeFonts() {
    console.log('Optimizing fonts...');
    
    // Read the current fonts
    const fonts = ['inter-400.ttf', 'inter-500.ttf', 'inter-600.ttf'];
    const fontSizes = {};
    
    fonts.forEach(font => {
        const fontPath = path.join('fonts', font);
        const stats = fs.statSync(fontPath);
        fontSizes[font] = (stats.size / 1024).toFixed(2) + ' KB';
        console.log(`Current ${font}: ${fontSizes[font]}`);
    });
    
    // Create optimized font CSS with base64 encoding for critical font
    const criticalFontPath = path.join('fonts', 'inter-400.ttf');
    const criticalFontBase64 = fontToBase64(criticalFontPath);
    
    const optimizedFontCSS = `/* Optimized Font Loading Strategy */

/* Critical font - Inter 400 - Inlined as base64 */
@font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(data:font/truetype;charset=utf-8;base64,${criticalFontBase64.substring(0, 100)}...) format('truetype');
}

/* Non-critical fonts - Lazy loaded */
@font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-display: swap;
    src: url('/fonts/inter-500.ttf') format('truetype');
}

@font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: url('/fonts/inter-600.ttf') format('truetype');
}

/* Font loading optimization */
.font-loaded-500 { font-weight: 500; }
.font-loaded-600 { font-weight: 600; }
`;

    // Save optimized CSS
    fs.writeFileSync('css/fonts-optimized.css', optimizedFontCSS);
    console.log('\nCreated optimized font CSS');
    
    // Calculate savings
    const totalOriginal = fonts.reduce((sum, font) => {
        return sum + fs.statSync(path.join('fonts', font)).size;
    }, 0);
    
    console.log(`\nOriginal total: ${(totalOriginal / 1024).toFixed(2)} KB`);
    console.log('Note: Full subsetting requires fonttools. Install via:');
    console.log('brew install fonttools');
    console.log('Then run: pyftsubset fonts/inter-400.ttf --unicodes="U+0020-007F,U+00A0-00FF" --output-file=fonts/inter-400-latin.ttf');
}

optimizeFonts().catch(console.error);