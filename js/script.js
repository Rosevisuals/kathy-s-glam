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

// Portfolio Functionality
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

// Navbar Toggle and Scroll Behavior
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');

    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', () => {
            navUl.classList.toggle('active');
        });
    } else {
        console.error('Menu toggle or nav ul not found');
    }

    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (nav) {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        }
    });
});

// Initialize Based on Page
document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split('/').pop() || 'index.html';

    switch (page) {
        case 'portfolio.html':
            initializePortfolio();
            initializeGeneral();
            break;
        default:
            initializeGeneral();
            break;
    }
});
