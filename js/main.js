// Professor Atef Allam Website - Optimized JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Configuration constants
    const CONFIG = {
        SCROLL_THRESHOLD: 50,
        ANIMATION_DURATION: 2000,
        INTERSECTION_THRESHOLD: 0.4,
        MOBILE_BREAKPOINT: 768,
        TOUCH_DELAY: 300,
        SWIPE_THRESHOLD: 50
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

    // Enhanced mobile menu functionality
    const initMobileMenu = () => {
        if (!elements.mobileMenuToggle || !elements.navMenu) return;

        let isMenuOpen = false;

        const toggleMenu = () => {
            isMenuOpen = !isMenuOpen;
            elements.navMenu.classList.toggle('active', isMenuOpen);
            elements.mobileMenuToggle.classList.toggle('active', isMenuOpen);
            elements.mobileMenuToggle.setAttribute('aria-expanded', isMenuOpen);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        };

        const closeMenu = () => {
            if (isMenuOpen) {
                isMenuOpen = false;
                elements.navMenu.classList.remove('active');
                elements.mobileMenuToggle.classList.remove('active');
                elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                
                // Close any open dropdowns
                document.querySelectorAll('.dropdown-container.active').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        };

        // Toggle menu on button click
        addEventListenerSafely(elements.mobileMenuToggle, 'click', toggleMenu);

        // Close menu when clicking nav links (except dropdown toggles)
        elements.navMenu.addEventListener('click', (e) => {
            const clickedLink = e.target.closest('.nav-link');
            if (clickedLink && !clickedLink.closest('.dropdown-container')) {
                setTimeout(closeMenu, 300); // Small delay for smooth transition
            }
        });

        // Enhanced dropdown toggles for mobile with touch support
        const dropdownContainers = document.querySelectorAll('.dropdown-container');
        dropdownContainers.forEach(container => {
            const dropdownToggle = container.querySelector('.nav-link');
            if (dropdownToggle) {
                let touchStartTime = 0;
                
                // Touch start handler
                addEventListenerSafely(dropdownToggle, 'touchstart', (e) => {
                    touchStartTime = Date.now();
                    if (window.innerWidth <= CONFIG.MOBILE_BREAKPOINT) {
                        dropdownToggle.style.backgroundColor = 'rgba(116, 185, 255, 0.1)';
                    }
                }, { passive: true });
                
                // Touch end handler
                addEventListenerSafely(dropdownToggle, 'touchend', (e) => {
                    if (window.innerWidth <= CONFIG.MOBILE_BREAKPOINT) {
                        setTimeout(() => {
                            dropdownToggle.style.backgroundColor = '';
                        }, 150);
                    }
                }, { passive: true });
                
                // Click handler with improved mobile detection
                addEventListenerSafely(dropdownToggle, 'click', (e) => {
                    if (window.innerWidth <= CONFIG.MOBILE_BREAKPOINT) {
                        e.preventDefault();
                        
                        // Add haptic feedback for supported devices
                        if ('vibrate' in navigator) {
                            navigator.vibrate(10);
                        }
                        
                        const isCurrentlyActive = container.classList.contains('active');
                        
                        // Close other dropdowns first
                        dropdownContainers.forEach(otherContainer => {
                            if (otherContainer !== container) {
                                otherContainer.classList.remove('active');
                            }
                        });
                        
                        // Toggle current dropdown
                        container.classList.toggle('active', !isCurrentlyActive);
                        
                        // Scroll dropdown into view if opened
                        if (!isCurrentlyActive) {
                            setTimeout(() => {
                                container.scrollIntoView({ 
                                    behavior: 'smooth', 
                                    block: 'nearest' 
                                });
                            }, 100);
                        }
                    }
                });
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        });

        // Close menu on window resize if switching to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && isMenuOpen) {
                closeMenu();
            }
        });

        // Handle touch gestures for menu
        let touchStartY = 0;
        let touchStartX = 0;

        elements.navMenu.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        elements.navMenu.addEventListener('touchmove', (e) => {
            if (!isMenuOpen) return;
            
            const touchY = e.touches[0].clientY;
            const touchX = e.touches[0].clientX;
            const deltaY = touchStartY - touchY;
            const deltaX = Math.abs(touchStartX - touchX);
            
            // Close menu on upward swipe (and not too much horizontal movement)
            if (deltaY > 50 && deltaX < 100) {
                closeMenu();
            }
        }, { passive: true });
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

    // Enhanced stats counter with touch interactions
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

        // Add touch interactions for hero stats
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats && window.innerWidth <= 768) {
            const statItems = heroStats.querySelectorAll('.stat-item');
            
            // Add touch feedback
            statItems.forEach(item => {
                item.addEventListener('touchstart', () => {
                    item.style.transform = 'translateY(-3px) scale(0.98)';
                }, { passive: true });
                
                item.addEventListener('touchend', () => {
                    setTimeout(() => {
                        item.style.transform = '';
                    }, 150);
                }, { passive: true });
                
                // Add focus for accessibility
                item.setAttribute('tabindex', '0');
                item.setAttribute('role', 'button');
                item.setAttribute('aria-label', `Statistic: ${item.textContent}`);
            });

            // Smooth scroll indicators for mobile
            let isScrolling = false;
            heroStats.addEventListener('scroll', () => {
                if (!isScrolling) {
                    heroStats.style.scrollBehavior = 'smooth';
                    isScrolling = true;
                    setTimeout(() => {
                        isScrolling = false;
                    }, 150);
                }
            }, { passive: true });
        }
    };

    // Enhanced presentations with mobile swipe functionality
    const initPresentationsToggle = () => {
        if (!elements.togglePresentationsBtn || !elements.additionalPresentations) return;

        let isExpanded = false;
        
        // Enhanced mobile swipe functionality for presentations
        const initMobileSwipe = () => {
            if (window.innerWidth > CONFIG.MOBILE_BREAKPOINT) return;
            
            const presentationCards = document.querySelectorAll('.presentation-card');
            const presentationsContainer = document.querySelector('#featured-presentations');
            
            // Add scroll snap for better mobile experience
            if (presentationsContainer) {
                presentationsContainer.style.scrollSnapType = 'x mandatory';
                presentationsContainer.style.scrollBehavior = 'smooth';
            }
            
            presentationCards.forEach((card, index) => {
                let startX = 0;
                let startY = 0;
                let isScrolling = false;
                let touchStartTime = 0;
                
                // Add scroll snap align
                card.style.scrollSnapAlign = 'center';
                
                card.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                    isScrolling = false;
                    touchStartTime = Date.now();
                    
                    // Add touch feedback with better animation
                    card.style.transition = 'transform 0.1s ease-out';
                    card.style.transform = 'translateY(-3px) scale(0.97)';
                    
                    // Add subtle haptic feedback
                    if ('vibrate' in navigator) {
                        navigator.vibrate(5);
                    }
                }, { passive: true });
                
                card.addEventListener('touchmove', (e) => {
                    if (!startX || !startY) return;
                    
                    const currentX = e.touches[0].clientX;
                    const currentY = e.touches[0].clientY;
                    const diffX = Math.abs(currentX - startX);
                    const diffY = Math.abs(currentY - startY);
                    
                    // Determine if user is scrolling vertically
                    if (diffY > diffX) {
                        isScrolling = true;
                    }
                }, { passive: true });
                
                card.addEventListener('touchend', (e) => {
                    // Remove touch feedback
                    setTimeout(() => {
                        card.style.transform = '';
                    }, 150);
                    
                    // If not scrolling and it's a tap, add ripple effect
                    if (!isScrolling && startX && startY) {
                        const rect = card.getBoundingClientRect();
                        const ripple = document.createElement('div');
                        const size = Math.max(rect.width, rect.height);
                        
                        ripple.style.cssText = `
                            position: absolute;
                            border-radius: 50%;
                            background: rgba(116, 185, 255, 0.3);
                            transform: scale(0);
                            animation: ripple 0.6s linear;
                            pointer-events: none;
                            width: ${size}px;
                            height: ${size}px;
                            left: ${e.changedTouches[0].clientX - rect.left - size/2}px;
                            top: ${e.changedTouches[0].clientY - rect.top - size/2}px;
                        `;
                        
                        card.style.position = 'relative';
                        card.appendChild(ripple);
                        
                        setTimeout(() => {
                            if (ripple.parentNode) {
                                ripple.parentNode.removeChild(ripple);
                            }
                        }, 600);
                    }
                    
                    startX = 0;
                    startY = 0;
                }, { passive: true });
            });
            
            // Add CSS animation for ripple effect
            if (!document.querySelector('#ripple-animation')) {
                const style = document.createElement('style');
                style.id = 'ripple-animation';
                style.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        };
        
        // Initialize mobile swipe on load and resize
        initMobileSwipe();
        window.addEventListener('resize', initMobileSwipe);
        
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

    // Smart dropdown positioning functionality
    const initSmartDropdowns = () => {
        const dropdownContainers = document.querySelectorAll('.dropdown-container');
        
        const positionDropdown = (container) => {
            const dropdown = container.querySelector('.mega-dropdown');
            if (!dropdown) return;
            
            // Reset positioning
            dropdown.style.left = '';
            dropdown.style.right = '';
            dropdown.style.transform = '';
            
            // Get dimensions and positions
            const containerRect = container.getBoundingClientRect();
            const dropdownRect = dropdown.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            
            // Calculate if dropdown would overflow right edge
            const dropdownWidth = dropdown.offsetWidth || 1000; // fallback to default width
            const containerCenter = containerRect.left + containerRect.width / 2;
            const dropdownLeft = containerCenter - dropdownWidth / 2;
            const dropdownRight = dropdownLeft + dropdownWidth;
            
            // Check for overflow and adjust positioning
            if (dropdownRight > viewportWidth - 20) { // 20px margin
                // Align to right edge of container
                dropdown.style.left = 'auto';
                dropdown.style.right = '0';
                dropdown.style.transform = 'translateY(0)';
                // Store positioning type for hover state
                dropdown.setAttribute('data-position', 'right');
            } else if (dropdownLeft < 20) { // 20px margin
                // Align to left edge of container
                dropdown.style.left = '0';
                dropdown.style.right = 'auto';
                dropdown.style.transform = 'translateY(0)';
                dropdown.setAttribute('data-position', 'left');
            } else {
                // Center align (default)
                dropdown.style.left = '50%';
                dropdown.style.right = 'auto';
                dropdown.style.transform = 'translateX(-50%) translateY(0)';
                dropdown.setAttribute('data-position', 'center');
            }
        };
        
        // Position dropdowns on hover
        dropdownContainers.forEach(container => {
            addEventListenerSafely(container, 'mouseenter', () => {
                // Small delay to ensure dropdown is visible
                setTimeout(() => positionDropdown(container), 10);
            });
        });
        
        // Reposition on window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                dropdownContainers.forEach(container => {
                    if (container.matches(':hover')) {
                        positionDropdown(container);
                    }
                });
            }, 100);
        }, { passive: true });
    };

    // Enhanced performance optimization utilities
    const initPerformanceOptimizations = () => {
        // Mobile-specific performance optimizations
        const isMobile = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
        const isLowEndDevice = navigator.hardwareConcurrency <= 2;
        
        // Lazy load images with intersection observer
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, { 
                rootMargin: isMobile ? '100px' : '50px',
                threshold: isMobile ? 0.1 : 0.25
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
        
        // Mobile-specific optimizations
        if (isMobile) {
            // Reduce animation complexity on mobile
            document.documentElement.style.setProperty('--animation-duration', '0.2s');
            
            // Optimize scroll performance
            const scrollElements = document.querySelectorAll('[data-scroll-optimize]');
            scrollElements.forEach(el => {
                el.style.willChange = 'transform';
            });
            
            // Debounce resize events more aggressively on mobile
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    // Trigger layout recalculation
                    document.body.style.display = 'none';
                    document.body.offsetHeight; // Force reflow
                    document.body.style.display = '';
                }, 250);
            }, { passive: true });
        }
        
        // Low-end device optimizations
        if (isLowEndDevice) {
            // Disable complex animations
            document.documentElement.classList.add('reduce-motion');
            
            // Reduce intersection observer frequency
            CONFIG.INTERSECTION_THRESHOLD = 0.5;
        }

        // Preload critical resources
        const preloadCriticalResources = () => {
            const criticalImages = [
                'images/prof-atef-allam.jpg'
            ];
            
            criticalImages.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                document.head.appendChild(link);
            });
        };

        // Optimize font loading
        const optimizeFontLoading = () => {
            if ('fonts' in document) {
                // Preload critical fonts
                const criticalFonts = [
                    'Lato',
                    'Roboto',
                    'Open Sans'
                ];
                
                criticalFonts.forEach(font => {
                    document.fonts.load(`1em ${font}`).catch(() => {
                        // Fallback font handling
                        console.warn(`Failed to load font: ${font}`);
                    });
                });
            }
        };

        // Reduce layout shifts
        const reduceLayoutShifts = () => {
            // Add aspect ratio containers for images
            const images = document.querySelectorAll('img:not([width]):not([height])');
            images.forEach(img => {
                img.addEventListener('load', () => {
                    if (!img.style.aspectRatio && img.naturalWidth && img.naturalHeight) {
                        img.style.aspectRatio = `${img.naturalWidth}/${img.naturalHeight}`;
                    }
                });
            });
        };

        // Initialize optimizations
        preloadCriticalResources();
        optimizeFontLoading();
        reduceLayoutShifts();
        
        // Add performance monitoring
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData && console.log) {
                        console.log(`Page load time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
                    }
                }, 0);
            });
        }
    };

    // Apple-Style Mobile Menu functionality
    const initMobileMenu = () => {
        const header = document.querySelector('.header');
        const icon = document.querySelector('.icon-container');
        
        if (!header || !icon) return;
        
        let isMenuOpen = false;
        
        const toggleMenu = () => {
            isMenuOpen = !isMenuOpen;
            header.classList.toggle('menu-open', isMenuOpen);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isMenuOpen ? 'hidden' : '';
            
            // Add haptic feedback on supported devices
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        };
        
        const closeMenu = () => {
            if (isMenuOpen) {
                isMenuOpen = false;
                header.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        };
        
        // Toggle menu on icon click
        icon.addEventListener('click', toggleMenu);
        
        // Close menu when clicking menu items
        const menuItems = document.querySelectorAll('.menu-item a');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                // Small delay for smooth transition
                setTimeout(closeMenu, 200);
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        });
        
        // Close menu on orientation change or resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 767 && isMenuOpen) {
                closeMenu();
            }
        });
    };

    // Initialize all functionality
    const init = () => {
        try {
            initPerformanceOptimizations();
            initSmoothScrolling();
            initMobileMenu();
            initNavigationScrollEffect();
            initStatsCounter();
            initPresentationsToggle();
            initSmartDropdowns();
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
