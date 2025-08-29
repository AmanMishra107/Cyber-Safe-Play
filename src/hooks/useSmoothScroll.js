import { useEffect, useCallback } from 'react';
import { initSmoothScroll, smoothScrollTo, scrollToTop } from '../utils/smoothScroll';

/**
 * React hook for smooth scrolling
 * @param {number} headerOffset - Offset for fixed headers
 */
export const useSmoothScroll = (headerOffset = 80) => {
    useEffect(() => {
        // Initialize smooth scroll on mount
        initSmoothScroll('a[href^="#"]', headerOffset);
    }, [headerOffset]);

    const scrollTo = useCallback((target, duration, offset, callback) => {
        smoothScrollTo(target, duration, offset || headerOffset, callback);
    }, [headerOffset]);

    const scrollTop = useCallback((duration) => {
        scrollToTop(duration);
    }, []);

    return {
        scrollTo,
        scrollTop,
    };
};

/**
 * Hook for scroll progress tracking
 */
export const useScrollProgress = (callback) => {
    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;

            if (callback) callback(scrolled);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [callback]);
};