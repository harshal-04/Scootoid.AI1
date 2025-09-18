// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initialize everything else
  initNavigation();
  initSmoothScrolling();
  initHireMeAnimations();    
  initButtons();
  initVideoPlaceholder();
  initMobileMenu();
  initScrollObserver();
  initCardHoverEffects();
  initWorkflowAnimation();
  initUseCaseDemos();
  initHireMeScrollAnimations();
  initParallaxEffects();
  initStaggeredAnimations();
  initCounterAnimations();
});

// ======================
// Navigation with HireMe-style effects
// ======================
function initNavigation() {
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav a');

  if (!header || !navLinks.length) return;

  window.addEventListener('scroll', function() {
    const scrolled = window.scrollY > 50;
    header.classList.toggle('scrolled', scrolled);
    
    // HireMe-style header hide/show on scroll
    if (window.scrollY > 100) {
      if (window.scrollY > window.lastScrollY) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
    }
    window.lastScrollY = window.scrollY;
    
    updateActiveNavLink(navLinks);
  });

  updateActiveNavLink(navLinks);
}

function updateActiveNavLink(navLinks) {
  const sections = document.querySelectorAll('section');
  let currentSection = '';
  const scrollPosition = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');

    if (href === '#how' && currentSection === 'workflow-visualization') {
      link.classList.add('active');
    } else if (href === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}


// ======================
// Smooth Scrolling
// ======================
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = (targetId === '#how') 
        ? document.getElementById('workflow-visualization') 
        : document.querySelector(targetId);

      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        history.pushState(null, null, targetId);
      }
    });
  });
}


// ======================
// HireMe-style Initial Animations
// ======================
function initHireMeAnimations() {
  const animatedElements = document.querySelectorAll('.card, .step, .stat, .badge, .features li');
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(50px)';
    element.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
  });
}


// ======================
// Buttons - FIXED VERSION
// ======================
function initButtons() {
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Only prevent default for buttons without valid href
      if (!href || href === '#' || href.startsWith('javascript:')) {
        e.preventDefault();
      }
      
      // Only show loading animation for buttons that aren't external links
      if (!this.classList.contains('secondary') && (!href || href === '#')) {
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        this.classList.add('loading');

        setTimeout(() => {
          this.innerHTML = originalText;
          this.classList.remove('loading');
        }, 2000);
      }
    });
  });
}


// ======================
// Video Placeholder
// ======================
function initVideoPlaceholder() {
  const videoPlaceholder = document.querySelector('.video-placeholder');
  if (!videoPlaceholder) return;

  videoPlaceholder.addEventListener('click', function() {
    // future: replace with real video embed
  });
}


// ======================
// Mobile Menu
// ======================
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');
  if (!mobileMenuBtn || !nav) return;

  mobileMenuBtn.addEventListener('click', function() {
    nav.classList.toggle('active');
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-bars', !nav.classList.contains('active'));
    icon.classList.toggle('fa-times', nav.classList.contains('active'));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      mobileMenuBtn.querySelector('i').classList.remove('fa-times');
      mobileMenuBtn.querySelector('i').classList.add('fa-bars');
    });
  });

  document.addEventListener('click', function(e) {
    if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target) && nav.classList.contains('active')) {
      nav.classList.remove('active');
      mobileMenuBtn.querySelector('i').classList.remove('fa-times');
      mobileMenuBtn.querySelector('i').classList.add('fa-bars');
    }
  });
}


// ======================
// HireMe-style Scroll Observer
// ======================
function initScrollObserver() {
  const animatedElements = document.querySelectorAll('.card, .step, .stat, .comparison-block, .section h2');
  if (!('IntersectionObserver' in window)) {
    animatedElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.classList.add('animate');
          
          // Trigger counter animation for stats
          if (entry.target.classList.contains('stat')) {
            animateStatCounter(entry.target);
          }
        }, 100);
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}


// ======================
// Card Hover Effects
// ======================
function initCardHoverEffects() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.zIndex = '10';
      card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.zIndex = '';
      card.style.transform = 'translateY(0) scale(1)';
    });
  });
}


// ======================
// Workflow Animation
// ======================
function initWorkflowAnimation() {
  let currentStep = 0;
  let animationInterval;
  let isAnimating = false;
  const totalSteps = 6;
  const stepDuration = 1500; // Slower, more HireMe-like timing

  const progressBar = document.getElementById('progressBar');
  const progressPercentage = document.getElementById('progressPercentage');
  const steps = document.querySelectorAll('.workflow-step');
  const arrows = document.querySelectorAll('.flow-arrow');

  if (!progressBar || !progressPercentage || !steps.length) return;

  function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;

    if (currentStep >= totalSteps) {
      resetAnimation();
      setTimeout(() => { startAnimation(); }, 2000); // Longer pause between cycles
      return;
    }

    animationInterval = setInterval(animateStep, stepDuration);
  }

  function animateStep() {
    if (currentStep < totalSteps) {
      steps[currentStep].classList.add('animate', 'active');

      const percent = ((currentStep + 1) / totalSteps) * 100;
      // Smooth progress bar animation
      progressBar.style.transition = 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      progressBar.style.width = percent + '%';
      progressPercentage.textContent = Math.round(percent) + '%';

      if (currentStep > 0) {
        arrows[currentStep - 1].classList.add('animate', 'active');
        steps[currentStep - 1].classList.remove('active');
        steps[currentStep - 1].classList.add('completed');
      }

      currentStep++;

      if (currentStep === totalSteps) {
        clearInterval(animationInterval);
        setTimeout(() => {
          steps[totalSteps - 1].classList.remove('active');
          steps[totalSteps - 1].classList.add('completed');
          isAnimating = false;
          animateValueCounters();
          setTimeout(() => { resetAnimation(); startAnimation(); }, 3000);
        }, stepDuration);
      }
    } else {
      clearInterval(animationInterval);
    }
  }

  function resetAnimation() {
    clearInterval(animationInterval);
    currentStep = 0;
    isAnimating = false;
    progressBar.style.width = '0';
    progressPercentage.textContent = '0%';
    steps.forEach(step => step.classList.remove('animate', 'active', 'completed'));
    arrows.forEach(arrow => arrow.classList.remove('animate', 'active'));
  }

  function animateValueCounters() {
    animateCounter('stat1', 90, 2000);
    animateCounter('stat2', 100, 1500);
    animateCounter('stat3', 24, 1500);
    animateCounter('stat4', 0, 1000);
  }

  function animateCounter(elementId, finalValue, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startValue = 0;
    const increment = finalValue / (duration / 20); // Smoother animation
    let currentValue = startValue;

    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= finalValue) {
        clearInterval(timer);
        element.textContent = finalValue;
      } else {
        element.textContent = Math.floor(currentValue);
      }
    }, 20);
  }

  // Start animation when workflow section is visible
  const workflowSection = document.getElementById('workflow-visualization');
  if (workflowSection) {
    const workflowObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => startAnimation(), 500);
          workflowObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    workflowObserver.observe(workflowSection);
  }
}


// ======================
// Use Case Demos
// ======================
function simulateReportGeneration(type) {
  // Silent demo
}

function initUseCaseDemos() {
  const useCaseButtons = document.querySelectorAll('#use-cases .btn');
  useCaseButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      simulateReportGeneration(this.textContent);
    });
  });
}


// ======================
// HireMe-style Scroll Animations
// ======================
function initHireMeScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        entry.target.style.animationDelay = `${delay}s`;
        entry.target.style.animationFillMode = 'both';
        
        if (entry.target.classList.contains('slide-up')) {
          entry.target.style.animation = 'slideInUp 1s cubic-bezier(0.4, 0, 0.2, 1)';
        } else if (entry.target.classList.contains('slide-left')) {
          entry.target.style.animation = 'slideInLeft 1s cubic-bezier(0.4, 0, 0.2, 1)';
        } else if (entry.target.classList.contains('slide-right')) {
          entry.target.style.animation = 'slideInRight 1s cubic-bezier(0.4, 0, 0.2, 1)';
        } else if (entry.target.classList.contains('scale-in')) {
          entry.target.style.animation = 'scaleIn 1s cubic-bezier(0.4, 0, 0.2, 1)';
        } else if (entry.target.classList.contains('fade-in')) {
          entry.target.style.animation = 'fadeIn 1s ease-out';
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add animation classes to elements
  document.querySelectorAll('.card').forEach((el, index) => {
    el.classList.add('slide-up');
    el.dataset.delay = index * 0.15;
    observer.observe(el);
  });

  document.querySelectorAll('.step').forEach((el, index) => {
    el.classList.add('scale-in');
    el.dataset.delay = index * 0.2;
    observer.observe(el);
  });

  document.querySelectorAll('.stat').forEach((el, index) => {
    el.classList.add('slide-up');
    el.dataset.delay = index * 0.1;
    observer.observe(el);
  });
  
  document.querySelectorAll('.badge').forEach((el, index) => {
    el.classList.add('scale-in');
    el.dataset.delay = index * 0.1;
    observer.observe(el);
  });
}

// ======================
// HireMe-style Parallax Effects
// ======================
function initParallaxEffects() {
  const parallaxElements = document.querySelectorAll('.hero-image-container, .hero-wrapper::before');
  
  if (!parallaxElements.length) return;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3; // Gentler parallax effect

    parallaxElements.forEach(element => {
      if (element.classList.contains('hero-image-container')) {
        element.style.transform = `translateY(${rate}px)`;
      }
    });
  }

  // Throttle scroll events for better performance
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
      setTimeout(() => { ticking = false; }, 20);
    }
  }

  window.addEventListener('scroll', requestTick);
}

// ======================
// Staggered Animations (HireMe-style)
// ======================
function initStaggeredAnimations() {
  const staggerGroups = document.querySelectorAll('.badges-row, .features, .steps, .cards-container');
  
  staggerGroups.forEach(group => {
    const children = group.children;
    Array.from(children).forEach((child, index) => {
      child.style.animationDelay = `${index * 0.1}s`;
      child.classList.add('animate-on-scroll');
    });
  });
}

// ======================
// Counter Animations for Stats
// ======================
function initCounterAnimations() {
  function animateStatCounter(statElement) {
    const numberElement = statElement.querySelector('.stat-number');
    if (!numberElement) return;
    
    const finalValue = parseInt(numberElement.textContent) || 0;
    const duration = 2000;
    const startValue = 0;
    const increment = finalValue / (duration / 30);
    let currentValue = startValue;
    
    numberElement.textContent = '0';
    
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= finalValue) {
        clearInterval(timer);
        numberElement.textContent = finalValue;
      } else {
        numberElement.textContent = Math.floor(currentValue);
      }
    }, 30);
  }
  
  // Export function for use in scroll observer
  window.animateStatCounter = animateStatCounter;
}

// ======================
// Utility
// ======================
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// ======================
// Enhanced Video functionality
// ======================
const video = document.getElementById('tutorial-video');
const playButton = document.querySelector('.play-button');

if (video && playButton) {
  playButton.addEventListener('click', () => {
    if(video.paused) {
      video.play();
      playButton.classList.add('hidden');
    } else {
      video.pause();
      playButton.classList.remove('hidden');
    }
  });

  video.addEventListener('pause', () => {
    playButton.classList.remove('hidden');
  });

  video.addEventListener('ended', () => {
    playButton.classList.remove('hidden');
  });
  
  // Add loading state
  video.addEventListener('loadstart', () => {
    playButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  });
  
  video.addEventListener('canplay', () => {
    playButton.innerHTML = '&#9658;';
  });
}

// ======================
// Smooth scroll enhancements
// ======================
function enhancedSmoothScroll() {
  // Add momentum scrolling for iOS
  document.body.style.webkitOverflowScrolling = 'touch';
  
  // Enhanced easing for scroll animations
  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  };
  
  // Custom smooth scroll implementation
  window.smoothScrollTo = (target, duration = 1000) => {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
    if (!targetElement) return;
    
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutCubic(timeElapsed / duration) * distance;
      window.scrollTo(0, startPosition + run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    requestAnimationFrame(animation);
  };
}

// Initialize enhanced smooth scroll
enhancedSmoothScroll();

// ======================
// Performance optimizations
// ======================
function initPerformanceOptimizations() {
  // Lazy load images
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
  
  // Preload critical resources
  const preloadLinks = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
  ];
  
  preloadLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });
}

// Initialize performance optimizations
initPerformanceOptimizations();