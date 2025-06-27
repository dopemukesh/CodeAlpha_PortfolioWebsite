// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Navigation functionality
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    console.log('Found elements:', {
        navbar: !!navbar,
        navLinks: navLinks.length,
        hamburger: !!hamburger,
        navMenu: !!navMenu
    });
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            console.log('Mobile menu toggled');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu
            if (navMenu) navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
            
            // Smooth scroll to target
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            console.log('Scrolling to:', targetId, 'Found:', !!targetSection);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
    
    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Simple intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                console.log('Element became visible:', entry.target.className);
            }
        });
    }, observerOptions);
    
    // Observe elements for animations - but make sure they're visible by default
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    console.log('Found animated elements:', animatedElements.length);
    
    animatedElements.forEach(el => {
        if (el) {
            // Make sure element is visible initially
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            observer.observe(el);
        }
    });
    
    // Skill bars animation
    const skillBars = document.querySelectorAll('.skill-fill');
    console.log('Found skill bars:', skillBars.length);
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillFill = entry.target;
                const width = skillFill.getAttribute('data-width');
                console.log('Animating skill bar:', width);
                if (width) {
                    setTimeout(() => {
                        skillFill.style.width = width + '%';
                    }, 200);
                }
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        if (bar) skillObserver.observe(bar);
    });
    
    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        console.log('Contact form found');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simple form validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    contactForm.reset();
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                }, 2000);
            }
        });
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add notification styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    color: white;
                    z-index: 10000;
                    max-width: 400px;
                    opacity: 0;
                    transform: translateX(100%);
                    transition: all 0.3s ease;
                }
                .notification.show {
                    opacity: 1;
                    transform: translateX(0);
                }
                .notification-success {
                    background: linear-gradient(135deg, #48bb78, #38a169);
                }
                .notification-error {
                    background: linear-gradient(135deg, #f56565, #e53e3e);
                }
                .notification-info {
                    background: linear-gradient(135deg, #4299e1, #3182ce);
                }
                .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                @media (max-width: 768px) {
                    .notification {
                        top: 10px;
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Close notification
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            });
        }
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize active nav link on page load
    setTimeout(updateActiveNavLink, 100);
    
    // Make sure all sections are visible on load
    const allSections = document.querySelectorAll('section');
    console.log('Found sections:', allSections.length);
    
    allSections.forEach((section, index) => {
        console.log(`Section ${index + 1}:`, section.id, section.offsetHeight);
        // Ensure sections are visible
        section.style.opacity = '1';
        section.style.visibility = 'visible';
        
        // Make sure content inside sections is visible
        const content = section.querySelectorAll('*');
        content.forEach(el => {
            if (el.style.opacity === '0' || el.style.visibility === 'hidden') {
                el.style.opacity = '1';
                el.style.visibility = 'visible';
            }
        });
    });
    
    console.log('Initialization complete');

     // Add loading animation
    window.addEventListener('load', function() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <p>Loading...</p>
            </div>
        `;
        
        // Add loader styles
        const loaderStyle = document.createElement('style');
        loaderStyle.textContent = `
            .page-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 1;
                transition: opacity 0.5s ease;
            }
            .page-loader.fade-out {
                opacity: 0;
                pointer-events: none;
            }
            .loader-content {
                text-align: center;
                color: #319795;
            }
            .loader-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid #e2e8f0;
                border-top: 4px solid #319795;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(loaderStyle);
        document.body.appendChild(loader);
        
        // Remove loader after page load
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.remove();
                loaderStyle.remove();
            }, 500);
        }, 1000);
    });
    
    // Add cursor trail effect
    function createCursorTrail() {
        const trail = [];
        const trailLength = 20;
        
        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: #319795;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${1 - i / trailLength};
                transition: all 0.1s ease;
            `;
            document.body.appendChild(dot);
            trail.push(dot);
        }
        
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function animateTrail() {
            let x = mouseX;
            let y = mouseY;
            
            trail.forEach((dot, index) => {
                const nextDot = trail[index + 1] || trail[0];
                
                dot.style.left = x + 'px';
                dot.style.top = y + 'px';
                
                x += (nextDot.offsetLeft - x) * 0.3;
                y += (nextDot.offsetTop - y) * 0.3;
            });
            
            requestAnimationFrame(animateTrail);
        }
        
        animateTrail();
    }
    
    // Initialize cursor trail on desktop
    if (window.innerWidth > 768) {
        createCursorTrail();
    }
});