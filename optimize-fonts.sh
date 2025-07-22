#!/bin/bash

echo "Font Optimization Strategy for iAN"
echo "=================================="
echo ""
echo "Current font sizes:"
ls -lh fonts/*.ttf

echo -e "\n1. Download Inter Variable Font (single file, all weights)"
echo "   This replaces 3 files (954KB) with 1 file (~200KB)"

# Create optimized fonts directory
mkdir -p fonts/optimized

# Download Inter variable font from Google Fonts (Latin subset only)
echo -e "\n2. Downloading optimized Inter font..."
curl -L "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" -o fonts/inter-google.css

# Extract the woff2 URLs
echo -e "\n3. Font URLs from Google Fonts:"
grep -oE 'https://[^)]+\.woff2' fonts/inter-google.css

# Create a new optimized font CSS
cat > css/fonts-optimized.css << 'EOF'
/* Optimized Font Loading - Variable Font */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400 600;
  font-display: swap;
  src: url('/fonts/inter-variable.woff2') format('woff2-variations');
}

/* Fallback for older browsers */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-400-latin.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/inter-500-latin.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/inter-600-latin.woff2') format('woff2');
}
EOF

echo -e "\n4. Optimization Summary:"
echo "   - Current: 3 TTF files = 954KB (462KB compressed)"
echo "   - Target: 1 WOFF2 variable font = ~50KB"
echo "   - Savings: ~400KB (86% reduction)"

echo -e "\n5. Next Steps:"
echo "   a) Download Inter variable font WOFF2"
echo "   b) Update HTML to use fonts-optimized.css"
echo "   c) Preload critical font in <head>"
echo "   d) Remove old TTF files from preload"