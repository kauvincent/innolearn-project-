// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      mobileMenuBtn.innerHTML = mobileMenu.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-container') && mobileMenu && mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
      if (mobileMenuBtn) {
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    }
  });

  // Set active navigation link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Initialize all components
  initForms();
  initSearch();
  initFilters();
  initAccordion();
  initDarkMode();
  initChat();
  initLoader();
});

// Form Validation
function initForms() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    // Real-time validation
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('input', () => validateInput(input));
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
      if (!validateForm(form)) {
        e.preventDefault();
      } else {
        showLoadingState(form);
        
        // Simulate form submission
        if (form.id === 'signup-form') {
          e.preventDefault();
          simulateSignup(form);
        } else if (form.id === 'signin-form') {
          e.preventDefault();
          simulateSignin(form);
        } else if (form.id === 'search-form') {
          e.preventDefault();
          handleSearch(form);
        }
      }
    });
    
    // Password confirmation validation
    const passwordInput = form.querySelector('input[type="password"]');
    const confirmPasswordInput = form.querySelector('input[name="confirm-password"]');
    
    if (passwordInput && confirmPasswordInput) {
      confirmPasswordInput.addEventListener('input', () => {
        if (passwordInput.value !== confirmPasswordInput.value) {
          setError(confirmPasswordInput, 'Passwords must match');
        } else {
          clearError(confirmPasswordInput);
        }
      });
    }
  });
}

function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('.form-control[required]');
  
  inputs.forEach(input => {
    if (!validateInput(input)) {
      isValid = false;
    }
  });
  
  // Validate checkbox
  const checkbox = form.querySelector('input[type="checkbox"][required]');
  if (checkbox && !checkbox.checked) {
    const group = checkbox.closest('.form-group');
    group.classList.add('has-error');
    group.querySelector('.error-message').textContent = 'You must agree to the terms';
    isValid = false;
  }
  
  return isValid;
}

function validateInput(input) {
  const group = input.closest('.form-group');
  group.classList.remove('has-error');
  
  if (!input.value.trim()) {
    setError(input, 'This field is required');
    return false;
  }
  
  if (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value)) {
    setError(input, 'Please enter a valid email address');
    return false;
  }
  
  if (input.type === 'password' && input.value.length < 6) {
    setError(input, 'Password must be at least 6 characters');
    return false;
  }
  
  return true;
}

function setError(input, message) {
  const group = input.closest('.form-group');
  group.classList.add('has-error');
  const errorElement = group.querySelector('.error-message');
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearError(input) {
  const group = input.closest('.form-group');
  group.classList.remove('has-error');
}

function showLoadingState(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  }
}

function simulateSignup(form) {
  setTimeout(() => {
    // In a real app, you would handle the API response here
    window.location.href = 'index.html';
  }, 1500);
}

function simulateSignin(form) {
  setTimeout(() => {
    // In a real app, you would handle the API response here
    window.location.href = 'index.html';
  }, 1500);
}

// Search Functionality
function initSearch() {
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const query = searchForm.querySelector('input').value.trim();
      if (query) {
        // In a real app, redirect to search results
        alert(`Searching for: ${query}`);
        // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
      }
    });
  }
}

// Course Filtering
function initFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.textContent.toLowerCase();
        filterCourses(filter);
      });
    });
  }
}

function filterCourses(filter) {
  const courses = document.querySelectorAll('.card');
  
  courses.forEach(course => {
    if (filter === 'all') {
      course.style.display = 'block';
      return;
    }
    
    const courseLevel = course.querySelector('.card-meta span:last-child').textContent.toLowerCase();
    const courseTitle = course.querySelector('h3').textContent.toLowerCase();
    
    if (courseLevel.includes(filter) || courseTitle.includes(filter)) {
      course.style.display = 'block';
    } else {
      course.style.display = 'none';
    }
  });
}

// Accordion
function initAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (accordionItems) {
    accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');
      
      header.addEventListener('click', () => {
        const isActive = content.classList.contains('active');
        
        // Close all items
        document.querySelectorAll('.accordion-content').forEach(el => {
          el.classList.remove('active');
          el.previousElementSibling.querySelector('i').className = 'fas fa-chevron-down';
        });
        
        // Open current if it was closed
        if (!isActive) {
          content.classList.add('active');
          header.querySelector('i').className = 'fas fa-chevron-up';
        }
      });
    });
  }
}

// Dark Mode
function initDarkMode() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    // Check for saved preference or prefer-color-scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode === 'true' || (savedMode === null && prefersDark)) {
      document.documentElement.classList.add('dark-mode');
      themeToggle.querySelector('i').className = 'fas fa-sun';
    }
    
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark-mode');
      const icon = themeToggle.querySelector('i');
      
      if (document.documentElement.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('darkMode', 'true');
      } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('darkMode', 'false');
      }
    });
  }
}

// Chat Functionality
function initChat() {
  const chatInput = document.querySelector('.chat-input');
  const sendBtn = document.querySelector('.send-btn');
  const chatBox = document.querySelector('.chat-box');
  const quickReplies = document.querySelectorAll('.quick-replies .filter-btn');

  function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isUser ? 'user-message' : 'bot-message');
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot-message', 'typing');
    typingDiv.innerHTML = `
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingDiv;
  }

  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
      addMessage(message, true);
      chatInput.value = '';
      
      const typingIndicator = showTypingIndicator();
      
      setTimeout(() => {
        typingIndicator.remove();
        const responses = [
          "Interesting question! Let me explain that concept...",
          "I'd be happy to help with that! Here's what you need to know...",
          "Great question! The answer involves several key points...",
          "I understand what you're asking. Here's a detailed explanation..."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse);
      }, 1500);
    }
  }

  if (quickReplies) {
    quickReplies.forEach(button => {
      button.addEventListener('click', () => {
        const message = button.textContent;
        addMessage(message, true);
        
        const typingIndicator = showTypingIndicator();
        
        setTimeout(() => {
          typingIndicator.remove();
          addMessage("Here's some information about " + message + "...");
        }, 1500);
      });
    });
  }
}

// Page Loader
function initLoader() {
  const loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', () => {
      loader.style.display = 'flex';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 1000);
    });
  }
}

// Initialize progress chart animation
function initProgressChart() {
  const chart = document.querySelector('.chart');
  if (chart) {
    const percent = chart.querySelector('.percent');
    const path = chart.querySelector('svg path:last-child');
    const targetPercent = parseInt(chart.dataset.percent);
    let currentPercent = 0;
    
    const animateChart = () => {
      if (currentPercent < targetPercent) {
        currentPercent++;
        percent.textContent = `${currentPercent}%`;
        const dashArray = `${currentPercent}, 100`;
        path.setAttribute('stroke-dasharray', dashArray);
        setTimeout(animateChart, 20);
      }
    };
    
    animateChart();
  }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initForms();
  initSearch();
  initFilters();
  initAccordion();
  initDarkMode();
  initChat();
  initLoader();
  initProgressChart();
});