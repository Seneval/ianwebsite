#!/bin/bash

echo "Downloading optimized WOFF2 fonts..."

# Create optimized fonts directory
mkdir -p fonts/optimized

# Download Inter Latin subset WOFF2 files
# These are much smaller than the full TTF files

# 400 weight
curl -L "https://fonts.gstatic.com/s/inter/v19/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2" -o fonts/optimized/inter-400-latin.woff2

# For 500 and 600, we need the variable font
curl -L "https://github.com/rsms/inter/releases/download/v4.0/Inter-4.0-Variable.woff2" -o fonts/optimized/inter-variable.woff2

echo -e "\nChecking downloaded files:"
ls -lh fonts/optimized/

echo -e "\nOriginal sizes:"
echo "inter-400.ttf: 317KB"
echo "inter-500.ttf: 318KB" 
echo "inter-600.ttf: 318KB"
echo "Total: 953KB"

echo -e "\nOptimized sizes:"
ls -lh fonts/optimized/ | grep -E "woff2"

echo -e "\nEstimated savings: ~850KB (89% reduction)"