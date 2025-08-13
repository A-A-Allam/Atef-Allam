// Professor Atef Allam Website - Optimized JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Configuration constants
    const CONFIG = {
        SCROLL_THRESHOLD: 50,
        ANIMATION_DURATION: 2000,
        INTERSECTION_THRESHOLD: 0.4
    };

    // Cache DOM elements for better performance
    const elements = {
        navLinks: document.querySelectorAll('a[href^="#"]'),
        mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
        navMenu: document.querySelector('.nav-menu'),
        navigation: document.querySelector('.main-navigation'),
        statNumbers: document.querySelectorAll('.stat-number'),
        togglePresentationsBtn: document.querySelector('#toggle-presentations'),
        additionalPresentations: document.querySelector('#additional-presentations'),
        showLessBtn: document.querySelector('#show-less-presentations'),
        showLessContainer: document.querySelector('#show-less-container'),
        showAllContainer: document.querySelector('#show-all-container')
    };

    // Utility functions
    const throttle = (func, delay) => {
        let inThrottle = false;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                requestAnimationFrame(() => inThrottle = false);
            }
        };
    };

    const addEventListenerSafely = (element, event, handler, options = {}) => {
        if (element) {
            element.addEventListener(event, handler, options);
            return true;
        }
        return false;
    };

    // Smooth scrolling functionality
    const initSmoothScrolling = () => {
        elements.navLinks.forEach(link => {
            addEventListenerSafely(link, 'click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                targetSection?.scrollIntoView({ behavior: 'smooth' });
            });
        });
    };

    // Mobile menu functionality
    const initMobileMenu = () => {
        if (elements.mobileMenuToggle && elements.navMenu) {
            addEventListenerSafely(elements.mobileMenuToggle, 'click', () => {
                elements.navMenu.classList.toggle('active');
            });
        }
    };

    // Navigation scroll effect with throttling
    const initNavigationScrollEffect = () => {
        if (!elements.navigation) return;

        const handleScroll = throttle(() => {
            const scrolled = window.scrollY > CONFIG.SCROLL_THRESHOLD;
            elements.navigation.classList.toggle('scrolled', scrolled);
        }, 16); // ~60fps

        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // Stats counter animation with optimizations
    const initStatsCounter = () => {
        if (!elements.statNumbers.length) return;

        const parseTargetAndSuffix = (el) => {
            const text = (el.textContent || '').trim();
            const numericMatch = text.replace(/,/g, '').match(/\d+/);
            const targetNumber = numericMatch ? parseInt(numericMatch[0], 10) : 0;
            const suffixMatch = text.match(/[^\d\s,]+$/);
            const suffix = suffixMatch?.[0] || '';
            return { targetNumber, suffix };
        };

        const animateCounter = (el, endValue, suffix) => {
            let startTimestamp = null;
            const startValue = 0;
            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / CONFIG.ANIMATION_DURATION, 1);
                const eased = easeOutCubic(progress);
                const currentValue = Math.floor(startValue + (endValue - startValue) * eased);
                
                el.textContent = `${currentValue}${suffix}`;
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };
            requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const { targetNumber, suffix } = parseTargetAndSuffix(entry.target);
                    animateCounter(entry.target, targetNumber, suffix);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: CONFIG.INTERSECTION_THRESHOLD });

        elements.statNumbers.forEach((el) => observer.observe(el));
    };

    // Presentations toggle functionality
    const initPresentationsToggle = () => {
        if (!elements.togglePresentationsBtn || !elements.additionalPresentations) return;

        let isExpanded = false;
        
        const showPresentations = () => {
            const additionalSection = elements.additionalPresentations;
            
            // Hide the Show All button
            if (elements.showAllContainer) {
                elements.showAllContainer.style.display = 'none';
            }
            
            // Show additional presentations with smooth animation
            additionalSection.style.display = 'flex';
            
            // Force reflow before adding class for smooth animation
            additionalSection.offsetHeight;
            additionalSection.classList.add('show');
            
            // Show the elegant Show Less button
            if (elements.showLessContainer) {
                elements.showLessContainer.style.display = 'block';
                setTimeout(() => {
                    elements.showLessContainer.style.opacity = '1';
                }, 100);
            }
            
            isExpanded = true;
        };

        const hidePresentations = () => {
            const additionalSection = elements.additionalPresentations;
            
            // Hide additional presentations
            additionalSection.classList.remove('show');
            additionalSection.style.display = 'none';
            
            // Hide the Show Less button
            if (elements.showLessContainer) {
                elements.showLessContainer.style.display = 'none';
                elements.showLessContainer.style.opacity = '0';
            }
            
            // Show the Show All button again
            if (elements.showAllContainer) {
                elements.showAllContainer.style.display = 'block';
            }
            
            // Scroll to presentations section smoothly
            setTimeout(() => {
                document.querySelector('#presentations').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
            
            isExpanded = false;
        };

        const togglePresentations = () => {
            if (isExpanded) {
                hidePresentations();
            } else {
                showPresentations();
            }
        };

        // Add event listeners for both buttons
        addEventListenerSafely(elements.togglePresentationsBtn, 'click', showPresentations);
        if (elements.showLessBtn) {
            addEventListenerSafely(elements.showLessBtn, 'click', hidePresentations);
        }
    };

    // Initialize all functionality
    const init = () => {
        try {
            initSmoothScrolling();
            initMobileMenu();
            initNavigationScrollEffect();
            initStatsCounter();
            initPresentationsToggle();
        } catch (error) {
            // Graceful error handling in production
            if (window.console && console.error) {
                console.error('Error initializing website functionality:', error);
            }
        }
    };

    // Start the application
    init();
});
