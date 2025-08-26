// Apple-Style Mobile Menu JavaScript
(function () {
    'use strict';
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
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
        
        // Enhanced touch interactions for presentation cards
        const initTouchInteractions = () => {
            const presentationCards = document.querySelectorAll('.presentation-card');
            
            presentationCards.forEach(card => {
                let touchStartTime = 0;
                let touchStartY = 0;
                
                card.addEventListener('touchstart', (e) => {
                    touchStartTime = Date.now();
                    touchStartY = e.touches[0].clientY;
                    
                    // Add visual feedback
                    card.style.transform = 'translateY(-2px) scale(0.98)';
                    card.style.transition = 'transform 0.1s ease';
                }, { passive: true });
                
                card.addEventListener('touchend', (e) => {
                    const touchDuration = Date.now() - touchStartTime;
                    
                    // Remove visual feedback
                    card.style.transform = '';
                    card.style.transition = 'transform 0.3s ease';
                    
                    // Handle tap (short touch)
                    if (touchDuration < 300) {
                        const link = card.querySelector('a');
                        if (link) {
                            // Add small delay for visual feedback
                            setTimeout(() => {
                                window.location.href = link.href;
                            }, 100);
                        }
                    }
                }, { passive: true });
                
                card.addEventListener('touchcancel', () => {
                    // Remove visual feedback on cancel
                    card.style.transform = '';
                    card.style.transition = 'transform 0.3s ease';
                }, { passive: true });
            });
        };
        
        // Initialize touch interactions
        initTouchInteractions();
        
        // Smooth scrolling for anchor links
        const initSmoothScrolling = () => {
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            
            anchorLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        
                        // Close mobile menu if open
                        if (isMenuOpen) {
                            closeMenu();
                        }
                        
                        // Smooth scroll to target
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        };
        
        // Initialize smooth scrolling
        initSmoothScrolling();
        
        // Performance optimization: debounce resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Reinitialize touch interactions on resize
                initTouchInteractions();
            }, 250);
        });
    });
})();
