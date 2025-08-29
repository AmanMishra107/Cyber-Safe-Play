/**
 * Universal Smooth Scroll Utility
 * Works across all browsers with fallback support
 */

// Check if smooth scroll is supported
const isSmoothScrollSupported = 'scrollBehavior' in document.documentElement.style;

/**
 * Smooth scroll to element with fallback animation
 * @param {string|HTMLElement} target - Element ID or element
 * @param {number} duration - Animation duration in ms
 * @param {number} offset - Offset from top in pixels
 * @param {Function} callback - Callback after scroll complete
 */
export const smoothScrollTo = (target, duration = 800, offset = 0, callback) => {
    const targetElement = typeof target === 'string' ?
        document.getElementById(target) :
        target;

    if (!targetElement) {
        console.warn(`Smooth scroll target not found: ${target}`);
        return;
    }

    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

    // Use native smooth scroll if supported
    if (isSmoothScrollSupported) {
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        if (callback) {
            // Estimate scroll completion time
            setTimeout(callback, Math.min(duration, 1000));
        }
        return;
    }

    // Fallback animation for older browsers
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);

        window.scrollTo(0, run);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        } else if (callback) {
            callback();
        }
    }

    requestAnimationFrame(animation);
};

/**
 * Easing function for smooth animation
 */
function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

/**
 * Auto-bind smooth scroll to all anchor links
 * @param {string} selector - CSS selector for anchor links
 * @param {number} offset - Offset from top (useful for fixed headers)
 */
export const initSmoothScroll = (selector = 'a[href^="#"]', offset = 80) => {
    document.querySelectorAll(selector).forEach(anchor => {
        // Skip if already has event listener
        if (anchor.dataset.smoothScrollBound) return;

        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just a hash or empty
            if (!href || href === '#' || href === '#0') return;

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                smoothScrollTo(targetElement, 800, offset);

                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            }
        });

        // Mark as bound
        anchor.dataset.smoothScrollBound = 'true';
    });
};

/**
 * Smooth scroll to top function
 * @param {number} duration - Animation duration
 */
export const scrollToTop = (duration = 600) => {
    if (isSmoothScrollSupported) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        return;
    }

    const startPosition = window.pageYOffset;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, -startPosition, duration);

        window.scrollTo(0, run);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
};

/**
 * Get scroll progress as percentage
 */
export const getScrollProgress = () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return (winScroll / height) * 100;
};

/**
 * Check if element is in viewport
 * @param {HTMLElement} element 
 * @param {number} threshold - Percentage of element that should be visible
 */
export const isInViewport = (element, threshold = 0.1) => {
    const rect = element.getBoundingClientRect();
    const elementHeight = rect.height;
    const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

    return visibleHeight / elementHeight >= threshold;
};