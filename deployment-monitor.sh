#!/bin/bash

# Deployment Monitor Script for GitHub Pages
# Monitors when optimizations go live

echo "🚀 GitHub Pages Deployment Monitor"
echo "=================================="
echo "Monitoring: https://inteligenciaartificialparanegocios.com"
echo "Looking for: optimized WebP logos and preconnect hints"
echo ""

check_count=0
max_checks=20
sleep_interval=30

while [ $check_count -lt $max_checks ]; do
    check_count=$((check_count + 1))
    current_time=$(date "+%H:%M:%S")
    
    echo "[$current_time] Check #$check_count: Fetching homepage..."
    
    # Fetch homepage and check for optimizations
    response=$(curl -s "https://inteligenciaartificialparanegocios.com" || echo "FETCH_FAILED")
    
    if [ "$response" = "FETCH_FAILED" ]; then
        echo "❌ Failed to fetch page. Retrying in ${sleep_interval}s..."
    else
        # Check for WebP logo optimization
        webp_found=$(echo "$response" | grep -c "logo-80\.webp" || echo "0")
        
        # Check for Facebook preconnect hints
        preconnect_found=$(echo "$response" | grep -c "preconnect.*facebook" || echo "0")
        
        echo "   📊 WebP logos found: $webp_found"
        echo "   🔗 Preconnect hints found: $preconnect_found"
        
        if [ "$webp_found" -gt 0 ] && [ "$preconnect_found" -gt 0 ]; then
            echo ""
            echo "🎉 SUCCESS! Optimizations are LIVE!"
            echo "✅ WebP logos detected"
            echo "✅ Preconnect hints detected"
            echo ""
            echo "🔥 READY FOR PAGESPEED TEST!"
            echo "Run: https://pagespeed.web.dev/analysis/https-inteligenciaartificialparanegocios-com/56pmk9hqqg?hl=en&form_factor=mobile"
            exit 0
        else
            echo "   ⏳ Optimizations not yet deployed..."
        fi
    fi
    
    if [ $check_count -lt $max_checks ]; then
        echo "   💤 Waiting ${sleep_interval}s for next check..."
        sleep $sleep_interval
    fi
    echo ""
done

echo "⚠️  Timeout reached after $((max_checks * sleep_interval / 60)) minutes"
echo "   Optimizations may need more time to deploy"
echo "   Try checking manually or wait a bit longer"