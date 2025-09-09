/**
 * Professional Academic Portfolio JavaScript
 * Simplified for academic focus - complex cinematic effects removed
 */

class AcademicPortfolio {
  constructor() {
    this.sections = [];
    this.activeSection = '';
    this.isDark = localStorage.getItem('darkMode') !== 'false'; // Default to dark theme
    this.observer = null;
    
    this.init();
  }

  init() {
    this.setupTheme();
    this.setupNavigation();
    this.setupIntersectionObserver();
    this.setupSideNavigation();
    this.setupMobileMenu();
    this.setupScrollToTop();
    this.setupAnimations();
    this.setupSearch();
    this.setupModal();
    this.setupAchievementScroll();
    this.setupInteractiveExcellence();
    this.setupScrollRevealAnimations();
  }

  // Theme Management
  setupTheme() {
    // Apply initial theme (dark is default, light is the alternative)
    document.documentElement.classList.toggle('light', !this.isDark);
    
    // Theme toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // Update theme toggle icon
    this.updateThemeIcon();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('light', !this.isDark);
    localStorage.setItem('darkMode', this.isDark.toString());
    this.updateThemeIcon();
  }

  updateThemeIcon() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    const icon = themeToggle.querySelector('svg use');
    if (icon) {
      icon.setAttribute('href', this.isDark ? '#sun' : '#moon');
    }
  }

  // Navigation
  setupNavigation() {
    // Main navigation sections
    const sections = document.querySelectorAll('section[id]');
    this.sections = Array.from(sections).map(section => ({
      id: section.id,
      element: section,
      navItem: document.querySelector(`[href="#${section.id}"]`)
    }));

    // Navigation click handlers
    document.addEventListener('click', (e) => {
      if (e.target.matches('[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
      }
    });
  }

  scrollToSection(target) {
    let element;
    if (typeof target === 'string') {
      element = document.getElementById(target);
    } else {
      element = target;
    }
    
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Intersection Observer for active section tracking
  setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.setActiveSection(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-50px 0px -50px 0px',
        threshold: 0.2
      }
    );

    this.sections.forEach(section => {
      if (section.element) {
        this.observer.observe(section.element);
      }
    });
  }

  setActiveSection(sectionId) {
    this.activeSection = sectionId;
    
    // Update navigation active states
    this.sections.forEach(section => {
      if (section.navItem) {
        section.navItem.classList.toggle('active', section.id === sectionId);
      }
    });
  }

  // Side Navigation (Desktop)
  setupSideNavigation() {
    const sideNav = document.querySelector('.side-nav');
    if (!sideNav) return;

    // Generate navigation items
    this.sections.forEach(section => {
      if (section.id === 'intro') return; // Skip hero section
      
      const navItem = document.createElement('a');
      navItem.href = `#${section.id}`;
      navItem.className = 'side-nav-item';
      navItem.innerHTML = `
        <div class="side-nav-dot"></div>
        <span class="side-nav-label">${this.formatSectionTitle(section.id)}</span>
      `;
      sideNav.appendChild(navItem);
    });

    // Setup Section Progress Navigation
    this.setupSectionProgress();
  }

  // Section Progress Dots Navigation
  setupSectionProgress() {
    const progressDots = document.querySelectorAll('.section-progress-dot');
    if (!progressDots.length) return;

    // Handle dot clicks
    progressDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetSection = dot.dataset.section;
        const element = document.getElementById(targetSection);
        if (element) {
          this.smoothScrollToSection(element);
        }
      });
    });

    // Update progress based on scroll
    this.updateSectionProgress();
  }

  // Smooth scroll to section  
  smoothScrollToSection(element) {
    const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
    const targetOffset = element.offsetTop - navHeight - 20;
    
    window.scrollTo({
      top: targetOffset,
      behavior: 'smooth'
    });
  }

  // Update section progress dots based on scroll position
  updateSectionProgress() {
    const progressDots = document.querySelectorAll('.section-progress-dot');
    const sections = ['intro', 'pillars', 'about', 'recent-work', 'connect'];
    
    if (!progressDots.length) return;
    
    const updateProgress = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      let activeSection = 'intro';
      
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const sectionTop = scrollY + rect.top;
          const sectionHeight = rect.height;
          
          // Check if section is in view (considering 30% visibility)
          if (scrollY >= sectionTop - windowHeight * 0.7 && 
              scrollY < sectionTop + sectionHeight - windowHeight * 0.3) {
            activeSection = sectionId;
          }
        }
      });
      
      // Update active dot
      progressDots.forEach(dot => {
        const isActive = dot.dataset.section === activeSection;
        dot.classList.toggle('active', isActive);
      });

      // Update navbar progress bar
      this.updateNavbarProgress(activeSection, sections);
    };
    
    // Update on scroll with throttling
    window.addEventListener('scroll', this.throttle(updateProgress, 16), { passive: true });
    updateProgress(); // Initial update
  }

  // Throttle function for performance
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // Update navbar progress bar
  updateNavbarProgress(activeSection, sections) {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    const sectionIndex = sections.indexOf(activeSection);
    const progress = ((sectionIndex + 1) / sections.length) * 100;
    
    // Remove all existing progress classes
    navbar.classList.remove('progress-25', 'progress-50', 'progress-75', 'progress-100');
    
    // Add appropriate progress class
    if (progress >= 75) navbar.classList.add('progress-100');
    else if (progress >= 50) navbar.classList.add('progress-75');
    else if (progress >= 25) navbar.classList.add('progress-50');
    else if (progress > 0) navbar.classList.add('progress-25');
  }

  formatSectionTitle(sectionId) {
    return sectionId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Mobile Menu
  setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    
    if (!menuToggle || !mobileNav) return;

    // Toggle menu
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Close button
    if (mobileNavClose) {
      mobileNavClose.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
        mobileNav.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });

    // Close menu on navigation
    mobileNav.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        mobileNav.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  }

  // Scroll to Top Button
  setupScrollToTop() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (!scrollButton) return;

    // Show/hide based on scroll position
    window.addEventListener('scroll', this.throttle(() => {
      const shouldShow = window.scrollY > 300;
      scrollButton.classList.toggle('visible', shouldShow);
    }, 100));

    // Click handler
    scrollButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Simple animations
  setupAnimations() {
    // Stagger card animations on scroll
    this.staggerAnimations('.achievement-card-static', 100);
    this.staggerAnimations('.excellence-card', 150);
    this.staggerAnimations('.story-chapter-card', 100);
    this.staggerAnimations('.publication-card', 100);
    this.staggerAnimations('.work-item', 150);
    this.staggerAnimations('.card', 100);
  }

  staggerAnimations(selector, delay) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      el.style.animationDelay = `${index * delay}ms`;
    });
  }

  // Search functionality
  setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (!searchInput) return;

    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      
      if (query.length < 2) {
        if (searchResults) searchResults.style.display = 'none';
        return;
      }
      
      searchTimeout = setTimeout(() => {
        this.performSearch(query);
      }, 300);
    });
  }

  performSearch(query) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;
    
    // Simple content search
    const sections = document.querySelectorAll('section[id]');
    const results = [];
    
    sections.forEach(section => {
      const content = section.textContent.toLowerCase();
      if (content.includes(query.toLowerCase())) {
        const title = section.querySelector('h1, h2, h3')?.textContent || this.formatSectionTitle(section.id);
        results.push({
          title,
          id: section.id,
          snippet: this.extractSnippet(section.textContent, query)
        });
      }
    });

    this.displaySearchResults(results, query);
  }

  extractSnippet(content, query) {
    const index = content.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return '';
    
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + query.length + 50);
    
    return '...' + content.substring(start, end) + '...';
  }

  displaySearchResults(results, query) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
    } else {
      searchResults.innerHTML = results.map(result => `
        <div class="search-result-item">
          <h4><a href="#${result.id}">${result.title}</a></h4>
          <p>${result.snippet}</p>
        </div>
      `).join('');
    }
    
    searchResults.style.display = 'block';
  }

  // Modal functionality
  setupModal() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
          e.preventDefault();
        const modalId = trigger.dataset.modal;
        this.openModal(modalId);
      });
    });
    
    modals.forEach(modal => {
      const closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal(modal.id));
      }
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  closeAllModals() {
    document.querySelectorAll('.modal.open').forEach(modal => {
      modal.classList.remove('open');
    });
    document.body.style.overflow = '';
  }

  // Back-and-Forth Auto-Scroll Setup (like CodePen example)
  setupAchievementScroll() {
    const matrix = document.querySelector('.achievement-matrix');
    if (!matrix) return;

    console.log('Achievement back-and-forth scroll initialized');

    // Define scroll speed and interval (matching CodePen example)
    const scrollSpeed = 2; // Pixels per interval
    const scrollInterval = 30; // Milliseconds
    let scrollDirection = 'right'; // Initial direction
    let scrollIntervalId = null;

    // Function to scroll container automatically
    function autoScroll() {
      if (scrollDirection === 'right') {
        matrix.scrollLeft += scrollSpeed;
        // Check if reached end of scroll
        if (matrix.scrollLeft >= matrix.scrollWidth - matrix.clientWidth) {
          scrollDirection = 'left';
        }
      } else if (scrollDirection === 'left') {
        matrix.scrollLeft -= scrollSpeed;
        // Check if scrolled back to start
        if (matrix.scrollLeft <= 0) {
          scrollDirection = 'right';
        }
      }
    }

    // Start auto-scrolling
    function startAutoScroll() {
      if (scrollIntervalId) clearInterval(scrollIntervalId);
      scrollIntervalId = setInterval(autoScroll, scrollInterval);
    }

    // Stop auto-scrolling
    function stopAutoScroll() {
      if (scrollIntervalId) {
        clearInterval(scrollIntervalId);
        scrollIntervalId = null;
      }
    }

    // Start immediately
    startAutoScroll();

    // Stop auto-scrolling when mouse enters container
    matrix.addEventListener('mouseenter', stopAutoScroll);

    // Resume auto-scrolling when mouse leaves container  
    matrix.addEventListener('mouseleave', startAutoScroll);

    // Optional: Stop on card click
    const achievementItems = matrix.querySelectorAll('.achievement-item');
    achievementItems.forEach(item => {
      item.addEventListener('click', stopAutoScroll);
    });
  }

  // Modern Interactive Excellence Grid Setup
  setupInteractiveExcellence() {
    const list = document.querySelector('.excellence-interactive-grid');
    if (!list) return;
    
    const items = list.querySelectorAll('li');
    if (items.length === 0) return;

    console.log('Interactive Excellence Grid initialized');

    // Set active card based on interaction
    const setActiveCard = (event) => {
      const closest = event.target.closest('li');
      if (!closest) return;
      
      const index = [...items].indexOf(closest);
      
      // Create dynamic grid columns
      const cols = new Array(list.children.length)
        .fill()
        .map((_, i) => {
          items[i].dataset.active = (index === i).toString();
          return index === i ? '10fr' : '1fr';
        })
        .join(' ');
      
      list.style.setProperty('grid-template-columns', cols);
    };

    // Sync article widths for proper content display
    const syncArticleWidths = () => {
      const maxWidth = Math.max(...[...items].map(item => item.offsetWidth));
      list.style.setProperty('--article-width', maxWidth);
    };

    // Add event listeners
    list.addEventListener('focus', setActiveCard, true);
    list.addEventListener('click', setActiveCard);
    list.addEventListener('pointermove', setActiveCard);
    
    // Handle window resize
    window.addEventListener('resize', syncArticleWidths);
    
    // Initial sync
    syncArticleWidths();
  }

  // CodePen ScrollReveal Animations Setup
  setupScrollRevealAnimations() {
    // Check if ScrollReveal is available
    if (typeof ScrollReveal === 'undefined') {
      console.warn('ScrollReveal not loaded');
      return;
    }

    // ScrollReveal Settings (matching CodePen)
    const sr = ScrollReveal({
      origin: 'top',
      distance: '80px',
      duration: 2000,
      reset: true
    });

    // Excellence Section Animations
    sr.reveal('.excellence-fluid-title', {});
    sr.reveal('.excellence-modern .excellence-description', {delay: 200});
    sr.reveal('.excellence-interactive-grid', {delay: 400});
    
    // Achievement Matrix Animation  
    sr.reveal('.achievement-matrix', {origin: 'bottom', delay: 300});
    
    // Additional section animations
    sr.reveal('.hero-quote-main', {origin: 'left', delay: 100});
    sr.reveal('.hero-quote-secondary', {origin: 'right', delay: 300});
  }


  // Utility function for throttling
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Professional Academic Portfolio - Simplified JavaScript
// Complex cinematic controller removed for clean, academic-focused design

// Form handling
class FormHandler {
  constructor() {
    this.setupForms();
  }

  setupForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', this.handleSubmit.bind(this));
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      // This would typically send to a server
      // For GitHub Pages, you might use Netlify Forms or similar
      await this.submitForm(formData);
      
      this.showSuccess('Thank you! Your message has been sent.');
      form.reset();
    } catch (error) {
      this.showError('Sorry, there was an error sending your message. Please try again.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  async submitForm(formData) {
    // Placeholder for form submission
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Navigation Dropdown Handler
class NavigationDropdown {
  constructor() {
    this.init();
  }

  init() {
    this.initDesktopDropdown();
    this.initMobileDropdown();
  }

  initDesktopDropdown() {
    const dropdown = document.querySelector('.nav-dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (!dropdown || !dropdownMenu) return;

    let hoverTimeout;

    // Show dropdown on hover
    dropdown.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
      dropdownMenu.style.display = 'grid';
    });

    // Hide dropdown on mouse leave with delay
    dropdown.addEventListener('mouseleave', () => {
      hoverTimeout = setTimeout(() => {
        dropdownMenu.style.display = 'none';
      }, 100);
    });

    // Prevent dropdown from closing when hovering over it
    dropdownMenu.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
    });

    dropdownMenu.addEventListener('mouseleave', () => {
      hoverTimeout = setTimeout(() => {
        dropdownMenu.style.display = 'none';
      }, 100);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdownMenu.style.display = 'none';
      }
    });

    // Handle keyboard navigation
    dropdown.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdownMenu.style.display = 'none';
        dropdown.querySelector('.dropdown-trigger').focus();
      }
    });
  }

  initMobileDropdown() {
    const mobileDropdown = document.querySelector('.mobile-dropdown');
    const mobileDropdownTrigger = document.querySelector('.mobile-dropdown-trigger');
    const mobileDropdownMenu = document.querySelector('.mobile-dropdown-menu');
    
    if (!mobileDropdown || !mobileDropdownTrigger || !mobileDropdownMenu) return;

    mobileDropdownTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      mobileDropdown.classList.toggle('active');
    });

    // Close mobile dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileDropdown.contains(e.target)) {
        mobileDropdown.classList.remove('active');
      }
    });

    // Handle keyboard navigation for mobile
    mobileDropdownTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        mobileDropdown.classList.toggle('active');
      }
      if (e.key === 'Escape') {
        mobileDropdown.classList.remove('active');
      }
    });
  }
}

// Publication Gallery Filter System
class PublicationGallery {
  constructor() {
    this.init();
  }

  init() {
    this.filters = document.querySelectorAll('.filter-btn');
    this.publications = document.querySelectorAll('.publication-card');
    
    if (this.filters.length === 0 || this.publications.length === 0) return;
    
    this.setupFilters();
  }

  setupFilters() {
    this.filters.forEach(filter => {
      filter.addEventListener('click', (e) => {
        e.preventDefault();
        const filterValue = filter.getAttribute('data-filter');
        
        // Update active state
        this.filters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        
        // Filter publications with smooth animation
        this.filterPublications(filterValue);
      });
    });
  }

  filterPublications(filterValue) {
    this.publications.forEach((publication, index) => {
      const category = publication.getAttribute('data-category');
      const shouldShow = filterValue === 'all' || category === filterValue;
      
      if (shouldShow) {
        // Show with staggered animation
        setTimeout(() => {
          publication.style.display = 'flex';
          publication.style.opacity = '0';
          publication.style.transform = 'translateY(20px) scale(0.95)';
          
          // Trigger reflow
          publication.offsetHeight;
          
          publication.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
          publication.style.opacity = '1';
          publication.style.transform = 'translateY(0) scale(1)';
        }, index * 100);
      } else {
        // Hide with fade out
        publication.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        publication.style.opacity = '0';
        publication.style.transform = 'translateY(-10px) scale(0.95)';
        
        setTimeout(() => {
          publication.style.display = 'none';
        }, 300);
      }
    });
  }
}

// Enhanced Publication Card Interactions
class PublicationCardEffects {
  constructor() {
    this.init();
  }

  init() {
    this.cards = document.querySelectorAll('.publication-card');
    this.setupCardEffects();
  }

  setupCardEffects() {
    this.cards.forEach(card => {
      // Enhanced hover effects
      card.addEventListener('mouseenter', (e) => {
        this.enhanceCardHover(card, true);
      });

      card.addEventListener('mouseleave', (e) => {
        this.enhanceCardHover(card, false);
      });

      // Intersection Observer for scroll animations
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards';
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      observer.observe(card);
    });
  }

  enhanceCardHover(card, isHovering) {
    const icon = card.querySelector('.publication-icon');
    const content = card.querySelector('.publication-content');
    
    if (isHovering) {
      // Add subtle glow effect
      card.style.boxShadow = `
        0 20px 40px -12px rgba(0, 0, 0, 0.25),
        0 8px 16px -4px rgba(0, 0, 0, 0.1),
        0 0 0 1px rgba(255, 255, 255, 0.1)
      `;
      
      // Enhanced icon animation
      if (icon) {
        icon.style.transform = 'rotate(5deg) scale(1.1)';
        icon.style.background = `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.3) 0%, 
          rgba(255, 255, 255, 0.2) 100%
        )`;
      }
      
      // Subtle content shift
      if (content) {
        content.style.transform = 'translateY(-2px)';
      }
    } else {
      // Reset animations
      card.style.boxShadow = '';
      
      if (icon) {
        icon.style.transform = '';
        icon.style.background = '';
      }
      
      if (content) {
        content.style.transform = '';
      }
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AcademicPortfolio();
  new FormHandler();
  new NavigationDropdown();
  new PublicationGallery();
  new PublicationCardEffects();
  
  // Initialize Keynote Progress Indicators for expertise page
  if (document.querySelector('.keynote-section')) {
    new KeynoteProgressIndicators();
  }
});

// Giant Typography Keynote Progress Indicators
class KeynoteProgressIndicators {
  constructor() {
    this.sections = document.querySelectorAll('.keynote-section');
    this.dots = document.querySelectorAll('.progress-dot');
    this.currentSection = 0;
    
    if (this.sections.length > 0 && this.dots.length > 0) {
      this.init();
    }
  }
  
  init() {
    this.setupIntersectionObserver();
    this.setupClickHandlers();
    this.setupKeyboardNavigation();
  }
  
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = Array.from(this.sections).indexOf(entry.target);
          this.updateActiveSection(sectionIndex);
        }
      });
    }, options);
    
    this.sections.forEach((section) => {
      this.observer.observe(section);
    });
  }
  
  setupClickHandlers() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.scrollToSection(index);
      });
    });
  }
  
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        this.nextSection();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        this.previousSection();
      }
    });
  }
  
  updateActiveSection(index) {
    if (index >= 0 && index < this.dots.length) {
      this.currentSection = index;
      
      // Update dots
      this.dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }
  }
  
  scrollToSection(index) {
    if (index >= 0 && index < this.sections.length) {
      this.sections[index].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
  
  nextSection() {
    const nextIndex = Math.min(this.currentSection + 1, this.sections.length - 1);
    if (nextIndex !== this.currentSection) {
      this.scrollToSection(nextIndex);
    }
  }
  
  previousSection() {
    const prevIndex = Math.max(this.currentSection - 1, 0);
    if (prevIndex !== this.currentSection) {
      this.scrollToSection(prevIndex);
    }
  }
}

// Simple scroll setup - no complex initialization needed

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AcademicPortfolio, FormHandler };
}