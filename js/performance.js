// Core Web Vitals Performance Optimizations
// INP, LCP, CLS optimizations for 2025

// Task Scheduling for better INP
function scheduleTask(callback, priority = 'user-blocking') {
    if ('scheduler' in window && 'postTask' in scheduler) {
        return scheduler.postTask(callback, { priority });
    } else {
        return new Promise(resolve => {
            setTimeout(() => resolve(callback()), 0);
        });
    }
}

// Break long tasks into smaller chunks
function processInChunks(items, processor, chunkSize = 100) {
    let index = 0;
    
    function processChunk() {
        let count = 0;
        while (count < chunkSize && index < items.length) {
            processor(items[index], index);
            index++;
            count++;
        }
        
        if (index < items.length) {
            scheduleTask(processChunk, 'user-visible');
        }
    }
    
    processChunk();
}

// Lazy loading with Intersection Observer
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// Optimize event listeners for better INP
function optimizeEventListeners() {
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(() => {
            // Handle scroll events here
            scheduleTask(() => {
                // Scroll handling logic
            }, 'user-visible');
        });
    }, { passive: true });

    // Optimize button clicks for INP
    document.addEventListener('click', (e) => {
        if (e.target.matches('.btn, button, [role="button"]')) {
            scheduleTask(() => {
                // Handle button interactions
                e.target.style.transform = 'translateY(-2px)';
                setTimeout(() => {
                    e.target.style.transform = '';
                }, 150);
            }, 'user-blocking');
        }
    });
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalResources = [
        { href: 'css/styles.css', as: 'style' },
        { href: 'assets/logo/logo ian.png', as: 'image', fetchpriority: 'high' }
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.fetchpriority) {
            link.fetchPriority = resource.fetchpriority;
        }
        document.head.appendChild(link);
    });
}

// Font loading optimization
function optimizeFontLoading() {
    // Use Font Loading API if available
    if ('fonts' in document) {
        const interFont = new FontFace('Inter', 'url(https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap)');
        interFont.display = 'swap';
        
        interFont.load().then(font => {
            document.fonts.add(font);
        }).catch(err => {
            console.warn('Font loading failed:', err);
        });
    }
}

// CLS prevention utilities
function preventLayoutShifts() {
    // Set explicit dimensions for images without them
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
        if (img.naturalWidth && img.naturalHeight) {
            const aspectRatio = img.naturalHeight / img.naturalWidth;
            img.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
        }
    });

    // Reserve space for dynamic content
    const dynamicContainers = document.querySelectorAll('.dynamic-content');
    dynamicContainers.forEach(container => {
        if (!container.style.minHeight) {
            container.style.minHeight = '200px';
        }
    });
}

// Web Vitals measurement
function measureWebVitals() {
    // Only measure in production
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        return;
    }

    // Load web-vitals library dynamically
    import('https://unpkg.com/web-vitals@3/dist/web-vitals.js')
        .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(console.log);
            getFID(console.log);
            getFCP(console.log);
            getLCP(console.log);
            getTTFB(console.log);
        })
        .catch(err => console.warn('Web Vitals measurement failed:', err));
}

// Initialize all optimizations
function initPerformanceOptimizations() {
    // Use scheduler if available
    if ('scheduler' in window && 'postTask' in scheduler) {
        scheduler.postTask(() => {
            initLazyLoading();
            optimizeEventListeners();
            preventLayoutShifts();
            optimizeFontLoading();
            measureWebVitals();
        }, { priority: 'user-visible' });
    } else {
        // Fallback for browsers without Scheduler API
        requestIdleCallback(() => {
            initLazyLoading();
            optimizeEventListeners();
            preventLayoutShifts();
            optimizeFontLoading();
            measureWebVitals();
        }, { timeout: 2000 });
    }
}

// Start optimizations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);
} else {
    initPerformanceOptimizations();
}

// Export functions for use in other scripts
window.performanceUtils = {
    scheduleTask,
    processInChunks,
    initLazyLoading,
    optimizeEventListeners,
    preloadCriticalResources,
    preventLayoutShifts
};