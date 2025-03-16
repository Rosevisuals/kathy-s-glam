// script.js - Kathy's Glam Hub Functionality

// Utility Functions
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Portfolio Functionality (unchanged)
function initializePortfolio() {
    const filters = document.querySelectorAll('.filters button');
    const categoryTitle = document.querySelector('.category-title');
    const items = document.querySelectorAll('.gallery .item');

    filters.forEach((button, index) => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');
            filters.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            if (categoryTitle) {
                categoryTitle.textContent = filter === 'all' ? 'All Work' :
                                           filter === 'clients' ? 'Client Work' : 'Classes';
                categoryTitle.classList.remove('visible');
                setTimeout(() => categoryTitle.classList.add('visible'), 50);
            }

            items.forEach(item => {
                const category = item.getAttribute('data-category');
                item.style.display = (filter === 'all' || category === filter) ? 'block' : 'none';
                if (item.style.display === 'block') {
                    item.classList.remove('visible');
                    setTimeout(() => item.classList.add('visible'), 100);
                }
            });
        });

        const text = button.querySelector('.text-reveal');
        if (text) text.style.animationDelay = `${index * 0.2}s`;
    });

    const observerOptions = {
        root: null,
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const item = entry.target;
                setTimeout(() => item.classList.add('visible'), index * 150);
                observer.unobserve(item);
            }
        });
    }, observerOptions);

    items.forEach(item => observer.observe(item));

    items.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            img.addEventListener('load', () => img.classList.add('loaded'));
            if (img.complete) img.classList.add('loaded');
        }
    });

    document.querySelectorAll('.portfolio h1 .text-reveal').forEach((span, index) => {
        span.style.animationDelay = `${index * 0.3}s`;
    });
}

// Booking Functionality
function initializeBooking() {
    const form = document.getElementById('booking-form');
    if (!form) {
        console.error('Booking form not found!');
        return;
    }

    // Dynamic Options and Preview
    function updateOptionsAndPreview() {
        const type = document.getElementById('type')?.value;
        const service = document.getElementById('service')?.value;
        const classType = document.getElementById('class')?.value;
        const serviceOptions = document.getElementById('service-options');
        const classOptions = document.getElementById('class-options');
        const preview = document.getElementById('preview');

        if (serviceOptions) serviceOptions.style.display = type === 'service' ? 'block' : 'none';
        if (classOptions) classOptions.style.display = type === 'class' ? 'block' : 'none';

        const previews = {
            service: {
                bridal: 'Bridal Makeup',
                event: 'Event Makeup',
                photoshoot: 'Photoshoot Makeup'
            },
            class: {
                beginner: 'Beginner Makeup Class',
                advanced: 'Advanced Techniques Class'
            }
        };

        if (preview) {
            if (type === 'service' && service) {
                preview.textContent = previews.service[service];
            } else if (type === 'class' && classType) {
                preview.textContent = previews.class[classType];
            } else {
                preview.textContent = '';
            }
        }
    }

    // Time Slots
    function updateTimeSlots() {
        const date = document.getElementById('date')?.value;
        const timeSelect = document.getElementById('time');
        if (!date || !timeSelect) return;

        const availableSlots = {
            '2025-03-20': ['09:00', '11:00', '13:00'],
            '2025-03-25': ['10:00', '14:00', '16:00']
        };
        const slots = availableSlots[date] || ['09:00', '11:00', '13:00', '15:00'];

        timeSelect.innerHTML = '<option value="">-- Select a Time --</option>';
        slots.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot;
            option.textContent = slot;
            timeSelect.appendChild(option);
        });
    }

    // Multi-step Form
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-bar .step');
    let currentStep = 1;

    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < 3) {
                steps[currentStep - 1].style.display = 'none';
                currentStep++;
                steps[currentStep - 1].style.display = 'block';
                progressSteps.forEach(s => s.classList.remove('active'));
                progressSteps[currentStep - 1].classList.add('active');
                updateTimeSlots();
            }
        });
    });

    document.querySelectorAll('.prev-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                steps[currentStep - 1].style.display = 'none';
                currentStep--;
                steps[currentStep - 1].style.display = 'block';
                progressSteps.forEach(s => s.classList.remove('active'));
                progressSteps[currentStep - 1].classList.add('active');
            }
        });
    });

    // Event Listeners for Options
    document.getElementById('type')?.addEventListener('change', updateOptionsAndPreview);
    document.getElementById('service')?.addEventListener('change', updateOptionsAndPreview);
    document.getElementById('class')?.addEventListener('change', updateOptionsAndPreview);
    document.getElementById('date')?.addEventListener('change', updateTimeSlots);
    updateOptionsAndPreview();
    updateTimeSlots();

    // Form Submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('Form submitted!'); // Debug log

        const type = document.getElementById('type')?.value;
        const service = document.getElementById('service')?.value;
        const classType = document.getElementById('class')?.value;
        const date = document.getElementById('date')?.value;
        const time = document.getElementById('time')?.value;
        const name = document.getElementById('name')?.value;
        const email = document.getElementById('email')?.value;
        const phone = document.getElementById('phone')?.value;
        const notes = document.getElementById('notes')?.value;
        const terms = document.getElementById('terms')?.checked;

        // Validation
        if (!type || !name || !email || !phone || !date || !time || !terms ||
            (type === 'service' && !service) || (type === 'class' && !classType)) {
            console.error('Validation failed:', { type, name, email, phone, date, time, terms, service, classType });
            alert('Please fill out all required fields and agree to the terms.');
            return;
        }

        const booking = {
            type,
            details: type === 'service' ? service : classType,
            date,
            time,
            name,
            email,
            phone,
            notes,
            timestamp: new Date().toISOString()
        };

        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Custom Notification
        const serviceNames = {
            service: {
                bridal: 'Bridal Makeup',
                event: 'Event Makeup',
                photoshoot: 'Photoshoot Makeup'
            },
            class: {
                beginner: 'Beginner Makeup Class',
                advanced: 'Advanced Techniques Class'
            }
        };
        const bookedItem = type === 'service' ? serviceNames.service[service] : serviceNames.class[classType];
        const notificationMessage = `Your appointment for ${bookedItem} on ${date} at ${time} has been made. We shall notify you shortly.`;

        const modal = document.getElementById('confirmation-modal');
        const notification = document.getElementById('booking-notification');
        if (modal && notification) {
            notification.textContent = notificationMessage;
            modal.style.display = 'flex';
            const closeModal = document.getElementById('close-modal');
            if (closeModal) {
                closeModal.addEventListener('click', () => {
                    modal.style.display = 'none';
                }, { once: true });
            }
            setTimeout(() => modal.style.display = 'none', 7000);
        } else {
            console.error('Modal or notification element not found!');
        }

        this.reset();
        currentStep = 1;
        steps.forEach((step, index) => {
            step.style.display = index === 0 ? 'block' : 'none';
        });
        progressSteps.forEach(s => s.classList.remove('active'));
        progressSteps[0].classList.add('active');
        updateOptionsAndPreview();

        console.log('Booking saved:', booking);
    });

    // Text Animation for Heading
    document.querySelectorAll('.booking h1 .text-reveal').forEach((span, index) => {
        span.style.animationDelay = `${index * 0.3}s`;
    });

    // Debug Button Click (optional)
    document.getElementById('submit-booking')?.addEventListener('click', () => {
        console.log('Submit button clicked!');
    });
}

// General Page Enhancements
function initializeGeneral() {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const backToTop = document.createElement('button');
    backToTop.textContent = '↑';
    backToTop.className = 'back-to-top';
    document.body.appendChild(backToTop);

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
}

// Initialize Based on Page
document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split('/').pop() || 'index.html';

    switch (page) {
        case 'portfolio.html':
            initializePortfolio();
            initializeGeneral();
            break;
        case 'booking.html':
            initializeBooking();
            initializeGeneral();
            break;
        default:
            initializeGeneral();
            break;
    }
});
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
});ss