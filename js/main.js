// DOM Elements
const nav = document.querySelector('nav');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('nav ul li a');
const sections = document.querySelectorAll('section');
const galleryFilters = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const serviceCards = document.querySelectorAll('.service-card');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');

// Initialize AOS (Animate On Scroll) - Add this library via CDN in your HTML
document.addEventListener('DOMContentLoaded', function() {
    // Initialize testimonial slider
    initTestimonialSlider();
    
    // Initialize gallery filters
    initGalleryFilters();
    
    // Initialize animations for elements
    initAnimations();
    
    // Initialize scroll effects
    initScrollEffects();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Form validation
    initFormValidation();
});

// Navigation scroll effect
function initScrollEffects() {
    window.addEventListener('scroll', function() {
        // Navigation bar effect on scroll
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Active navigation link based on scroll position
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 70,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu after clicking a link
                    document.querySelector('nav ul').classList.remove('show');
                }
            }
        });
    });
}

// Initialize animations for elements that should animate on page load
function initAnimations() {
    // Add fade-in animation to services cards with delay
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300);
    });
    
    // Add hover effects to gallery items
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('.gallery-overlay').style.transform = 'translateY(0)';
            this.querySelector('.gallery-overlay').style.opacity = '1';
        });
        
        item.addEventListener('mouseleave', function() {
            this.querySelector('.gallery-overlay').style.transform = 'translateY(100px)';
            this.querySelector('.gallery-overlay').style.opacity = '0';
        });
    });
    
    // Add scroll reveal animations to sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });
}

// Gallery filter functionality
function initGalleryFilters() {
    galleryFilters.forEach(button => {
        button.addEventListener('click', function() {
            // Update active filter button
            galleryFilters.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Animate gallery items based on filter
            galleryItems.forEach(item => {
                item.style.transition = 'all 0.4s ease';
                
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                    setTimeout(() => {
                        item.style.display = 'block';
                    }, 400);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400);
                }
            });
        });
    });
}

// Simple testimonial slider
function initTestimonialSlider() {
    let currentSlide = 0;
    const totalSlides = testimonialSlides.length;
    
    // Hide all slides except the first one
    testimonialSlides.forEach((slide, index) => {
        if (index !== 0) {
            slide.style.display = 'none';
        }
    });
    
    // Function to show a specific slide
    function showSlide(index) {
        // Hide current slide with fade-out effect
        testimonialSlides[currentSlide].style.opacity = '0';
        setTimeout(() => {
            testimonialSlides[currentSlide].style.display = 'none';
            
            // Update current slide index
            currentSlide = index;
            
            // Show new slide with fade-in effect
            testimonialSlides[currentSlide].style.display = 'block';
            setTimeout(() => {
                testimonialSlides[currentSlide].style.opacity = '1';
            }, 50);
        }, 400);
    }
    
    // Auto-rotate slides every 5 seconds
    setInterval(() => {
        let nextSlide = (currentSlide + 1) % totalSlides;
        showSlide(nextSlide);
    }, 5000);
    
    // Apply initial styling
    testimonialSlides.forEach(slide => {
        slide.style.transition = 'opacity 0.4s ease';
        slide.style.opacity = '1';
    });
}

// Mobile menu toggle
function initMobileMenu() {
    menuToggle.addEventListener('click', function() {
        const navMenu = document.querySelector('nav ul');
        navMenu.classList.toggle('show');
        
        // Change menu icon if needed
        if (navMenu.classList.contains('show')) {
            this.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            this.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// Form validation
function initFormValidation() {
    const bookingForm = document.querySelector('.booking-form form');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let valid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                    
                    // Remove error class on input
                    field.addEventListener('input', function() {
                        this.classList.remove('error');
                    });
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (valid) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Your appointment request has been submitted successfully! We will contact you soon.';
                
                // Append after form
                this.parentNode.appendChild(successMessage);
                
                // Reset form
                this.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    setTimeout(() => {
                        successMessage.remove();
                    }, 300);
                }, 5000);
                
                // Add success message animation
                setTimeout(() => {
                    successMessage.style.opacity = '1';
                }, 10);
            }
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput.value.trim() && isValidEmail(emailInput.value)) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'newsletter-success';
                successMessage.textContent = 'Thank you for subscribing to our newsletter!';
                
                // Append after form
                this.parentNode.insertBefore(successMessage, this.nextSibling);
                
                // Reset form
                this.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    setTimeout(() => {
                        successMessage.remove();
                    }, 300);
                }, 3000);
                
                // Add success message animation
                setTimeout(() => {
                    successMessage.style.opacity = '1';
                }, 10);
            } else {
                emailInput.classList.add('error');
            }
        });
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add some parallax effects to hero section
window.addEventListener('scroll', function() {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const scrollValue = window.scrollY;
        heroSection.style.backgroundPositionY = `${scrollValue * 0.5}px`;
    }
});

// Add CSS classes for animations
document.head.insertAdjacentHTML('beforeend', `
<style>
    /* Animation classes */
    .section-hidden {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .section-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Mobile menu styles */
    @media (max-width: 768px) {
        nav ul {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            align-items: center;
            padding: 20px 0;
            transform: translateY(-150%);
            transition: transform 0.4s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        nav ul.show {
            transform: translateY(0);
        }
        
        nav ul li {
            margin: 15px 0;
        }
        
        .menu-toggle {
            display: block;
        }
    }
    
    /* Form styling */
    .form-group .error {
        border: 1px solid #ff6b6b !important;
    }
    
    .form-success, .newsletter-success {
        background-color: #d4edda;
        color: #155724;
        padding: 15px;
        border-radius: 5px;
        margin-top: 20px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    /* Active navigation link */
    nav ul li a.active {
        color: var(--secondary-color);
        font-weight: 600;
    }
</style>
`);
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');

    menuToggle.addEventListener('click', () => {
        navUl.classList.toggle('active');
    });

    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });
});