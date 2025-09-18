// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initialize everything else
  initNavigation();
  initSmoothScrolling();
  initAnimations();    
  initBanner();
  initButtons();
  initVideoPlaceholder();
  initMobileMenu();
  initObserver();
  initCardHoverEffects();
  initWorkflowAnimation();
  initUseCaseDemos();
});



// ======================
// Navigation
// ======================
function initNavigation() {
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav a');

  if (!header || !navLinks.length) return;

  window.addEventListener('scroll', function() {
    header.classList.toggle('scrolled', window.scrollY > 50);
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
// Initial Animations
// ======================
function initAnimations() {
  const animatedElements = document.querySelectorAll('.card, .step, .stat');
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
}


// ======================
// Banner
// ======================
function initBanner() {
  const banner = document.querySelector('.banner');
  const closeButton = document.querySelector('.banner-close');
  if (!banner || !closeButton) return;

  closeButton.addEventListener('click', function() {
    banner.style.transform = 'translateY(-100%)';
    banner.style.transition = 'transform 0.5s ease';
    setTimeout(() => banner.remove(), 500);
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
// Intersection Observer
// ======================
function initObserver() {
  const animatedElements = document.querySelectorAll('.card, .step, .stat');
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
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => observer.observe(el));
}


// ======================
// Card Hover Effects
// ======================
function initCardHoverEffects() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => card.style.zIndex = '10');
    card.addEventListener('mouseleave', () => card.style.zIndex = '');
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
  const stepDuration = 1200;

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
      setTimeout(() => { startAnimation(); }, 800);
      return;
    }

    animationInterval = setInterval(animateStep, stepDuration);
  }

  function animateStep() {
    if (currentStep < totalSteps) {
      steps[currentStep].classList.add('animate', 'active');

      const percent = ((currentStep + 1) / totalSteps) * 100;
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
          animateCounters();
          setTimeout(() => { resetAnimation(); startAnimation(); }, 1500);
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

  function animateCounters() {
    animateCounter('stat1', 45, 1500);
    animateCounter('stat2', 100, 1500);
    animateCounter('stat3', 24, 1500);
  }

  function animateCounter(elementId, finalValue, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startValue = 0;
    const increment = finalValue / (duration / 16);
    let currentValue = startValue;

    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= finalValue) {
        clearInterval(timer);
        element.textContent = finalValue;
      } else {
        element.textContent = Math.floor(currentValue);
      }
    }, 16);
  }

  startAnimation();
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
const video = document.getElementById('tutorial-video');
const playButton = document.querySelector('.play-button');

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
