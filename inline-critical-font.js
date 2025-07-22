const fs = require('fs');

// Read the critical font (Inter 400 Latin)
const fontPath = 'fonts/optimized/inter-400.woff2';
const fontBuffer = fs.readFileSync(fontPath);
const fontBase64 = fontBuffer.toString('base64');

// Create the inline font CSS
const inlineFontCSS = `/* Critical Font - Inter 400 Latin - Inlined for instant loading */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(data:font/woff2;charset=utf-8;base64,${fontBase64}) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}`;

// Save the inline font CSS
fs.writeFileSync('css/font-critical-inline.css', inlineFontCSS);

console.log('Critical font inlined successfully!');
console.log(`Original size: ${(fontBuffer.length / 1024).toFixed(2)} KB`);
console.log(`Base64 size: ${(fontBase64.length / 1024).toFixed(2)} KB`);
console.log(`\nThis font will load instantly with zero network request!`);

// Create the full optimized font strategy
const optimizedFontCSS = `/* Optimized Font Loading Strategy for iAN */

/* 1. Critical Font - Inlined (no network request) */
${inlineFontCSS}

/* 2. Non-critical fonts - Lazy loaded with preload */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/optimized/inter-500.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/optimized/inter-600.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Font smoothing for better rendering */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`;

fs.writeFileSync('css/fonts-final.css', optimizedFontCSS);

console.log('\nOptimization complete! Next steps:');
console.log('1. Replace fonts.css with fonts-final.css in HTML');
console.log('2. Remove TTF preloads from HTML head');
console.log('3. Add preload for inter-500.woff2 and inter-600.woff2');
console.log('4. Move old TTF files to backup folder');