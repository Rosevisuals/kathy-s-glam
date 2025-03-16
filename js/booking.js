// booking.js - Kathy's Glam Hub Booking Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Navbar Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');
    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', () => navUl.classList.toggle('active'));
    } else {
        console.error('Menu toggle or nav ul not found');
    }

    // Form Elements
    const form = document.getElementById('booking-form');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-bar .step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const typeSelect = document.getElementById('type');
    const serviceOptions = document.getElementById('service-options');
    const classOptions = document.getElementById('class-options');
    const preview = document.getElementById('preview');
    const timeSelect = document.getElementById('time');
    const modal = document.getElementById('confirmation-modal');
    const closeModal = document.getElementById('close-modal');
    const notification = document.getElementById('booking-notification');

    let currentStep = 1;

    // Debugging: Log if critical elements are missing
    if (!form || steps.length === 0 || progressSteps.length === 0) {
        console.error('Form or steps not found:', { form, steps, progressSteps });
        return;
    }

    // Text Reveal Animation Order
    document.querySelectorAll('.text-reveal').forEach((span, index) => {
        span.style.setProperty('--order', index);
    });

    // Populate Time Options (9 AM - 5 PM)
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
        times.push(`${hour}:00`);
        if (hour < 17) times.push(`${hour}:30`);
    }
    times.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
    });

    // Show/Hide Service or Class Options
    if (typeSelect) {
        typeSelect.addEventListener('change', () => {
            const value = typeSelect.value;
            serviceOptions.style.display = value === 'service' ? 'block' : 'none';
            classOptions.style.display = value === 'class' ? 'block' : 'none';
            preview.style.opacity = '0';
            setTimeout(() => {
                preview.textContent = value === 'service' ? 
                    'Choose your makeup service above.' : 
                    value === 'class' ? 'Select your class type.' : '';
                preview.style.opacity = '1';
            }, 300);
        });
    } else {
        console.error('typeSelect not found');
    }

    // Navigation Between Steps
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep < 3 && validateStep(currentStep)) {
                currentStep++;
                updateForm();
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateForm();
            }
        });
    });

    // Form Submission
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            if (validateStep(currentStep)) {
                const formData = new FormData(form);
                const bookingDetails = `
                    Booking Type: ${formData.get('type')}<br>
                    ${formData.get('type') === 'service' ? 'Service: ' + formData.get('service') : 'Class: ' + formData.get('class')}<br>
                    Date: ${formData.get('date')}<br>
                    Time: ${formData.get('time')}<br>
                    Name: ${formData.get('name')}<br>
                    Email: ${formData.get('email')}<br>
                    Phone: ${formData.get('phone')}<br>
                    Notes: ${formData.get('notes') || 'None'}
                `;
                notification.innerHTML = `Booking Confirmed!<br><br>${bookingDetails}`;
                modal.classList.add('active');
                form.reset();
                currentStep = 1;
                updateForm();
            }
        });
    } else {
        console.error('Form not found');
    }

    // Close Modal
    if (closeModal) {
        closeModal.addEventListener('click', () => modal.classList.remove('active'));
    } else {
        console.error('closeModal not found');
    }

    // Update Form Display
    function updateForm() {
        steps.forEach((step, index) => {
            step.classList.toggle('active', parseInt(step.dataset.step) === currentStep);
        });
        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', parseInt(step.dataset.step) <= currentStep);
        });
    }

    // Validate Current Step
    function validateStep(step) {
        if (!steps[step - 1]) {
            console.error(`Step ${step} not found`);
            return false;
        }
        const inputs = steps[step - 1].querySelectorAll('input[required], select[required]');
        let valid = true;
        inputs.forEach(input => {
            if (!input.value) {
                input.style.borderColor = '#e74c3c'; // Error color (red)
                valid = false;
            } else {
                input.style.borderColor = '#f2d4e6'; // Accent color (light pink, previously var(--accent-color))
            }
        });
        if (step === 1 && typeSelect && typeSelect.value) {
            const selectedInput = steps[0].querySelector(`#${typeSelect.value}`);
            if (selectedInput && !selectedInput.value) {
                selectedInput.style.borderColor = '#e74c3c'; // Error color (red)
                valid = false;
            }
        }
        return valid;
    }

    // Initial Setup
    updateForm();
});
