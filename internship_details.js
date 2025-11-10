// Initialize EmailJS
(function() {
    emailjs.init({
        publicKey: "N7Qk-3SH-uMcmYv8v",
    });
})();

document.addEventListener('DOMContentLoaded', function() {
    console.log('Internship details page loaded');
    
    // Get selected internship from sessionStorage
    const selectedInternship = JSON.parse(sessionStorage.getItem('selectedInternship'));
    const internshipDatabase = JSON.parse(sessionStorage.getItem('internshipDatabase'));
    
    if (!selectedInternship) {
        console.error('No internship selected');
        window.location.href = 'career.html';
        return;
    }
    
    console.log('Selected internship:', selectedInternship);
    
    // Populate page with internship details
    populateDetails(selectedInternship, internshipDatabase);
    
    // Create and setup application modal
    createApplicationModal();
    setupApplicationModal();
    
    function populateDetails(details, database) {
        // Set icon
        const iconImg = document.getElementById('headerIconImg');
        if (iconImg && details.icon) {
            iconImg.src = details.icon;
        }
        
        // Set title
        const titleEl = document.getElementById('internshipTitle');
        if (titleEl) {
            titleEl.textContent = details.title;
        }
        
        // Set basic info
        document.getElementById('durationValue').textContent = details.duration;
        document.getElementById('projectTypeValue').textContent = details.projectType;
        document.getElementById('locationValue').textContent = details.location;
        
        // Get custom details from database
        const customDetails = database[details.title];
        
        if (customDetails) {
            // Set description
            document.getElementById('internshipDescription').textContent = customDetails.description;
            
            // Populate topics
            const topicsList = document.getElementById('topicsList');
            topicsList.innerHTML = '';
            customDetails.topics.forEach(topic => {
                const li = document.createElement('li');
                li.textContent = `• ${topic}`;
                topicsList.appendChild(li);
            });
            
            // Populate benefits
            const benefitsList = document.getElementById('benefitsList');
            benefitsList.innerHTML = '';
            customDetails.benefits.forEach(benefit => {
                const li = document.createElement('li');
                li.textContent = `✓ ${benefit}`;
                benefitsList.appendChild(li);
            });
            
            // Populate requirements
            const requirementsList = document.getElementById('requirementsList');
            requirementsList.innerHTML = '';
            customDetails.requirements.forEach(req => {
                const li = document.createElement('li');
                li.textContent = `→ ${req}`;
                requirementsList.appendChild(li);
            });
        }
    }
    
    function createApplicationModal() {
        const modalHTML = `
            <div class="modal-overlay" id="modalOverlay"></div>
            <div class="modal-container" id="modalContainer">
                <div class="modal-header">
                    <div class="modal-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
                            <path d="M9 18v-6" />
                            <path d="M15 18v-6" />
                            <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3L14 3H10L8 5H5a2 2 0 0 0-2 2z" />
                        </svg>
                    </div>
                    <h2>Job Application</h2>
                    <p>Please fill the form to apply for the <b>paid</b> internship. Make sure the information you provided is correct.</p>
                    <button class="close-modal" id="closeModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="applicationForm">
                        <div class="form-group">
                            <label for="fullName">Full name</label>
                            <input type="text" id="fullName" name="name" placeholder="Full Name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="Email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="contact">Contact</label>
                            <input type="tel" id="contact" name="contact" placeholder="Contact Number" required pattern="[0-9]{10}">
                        </div>
                        
                        <div class="form-group">
                            <label for="address">Address</label>
                            <textarea id="address" name="address" placeholder="Your address" required></textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="city">Your City & State</label>
                                <input type="text" id="city" name="city" placeholder="City & State" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="technology">Technology</label>
                                <input type="text" id="technology" name="technology" placeholder="Technology" required readonly>
                            </div>
                        </div>
                        
                        <div class="form-group" style="background: #252b3d; padding: 15px; border-radius: 8px; border: 1px solid rgba(74, 158, 255, 0.3);">
                            <p style="color: #4da6ff; margin: 0; font-size: 14px;">
                                📧 <strong>Important:</strong> After submitting this form, please email your resume to <strong>thinkorix@gmail.com</strong> with the subject line: "Resume - [Your Name] - [Technology]"
                            </p>
                        </div>
                        
                        <button type="submit" class="submit-btn">SUBMIT</button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    function setupApplicationModal() {
        const proceedBtn = document.getElementById('proceedToApply');
        const modalOverlay = document.getElementById('modalOverlay');
        const modalContainer = document.getElementById('modalContainer');
        const closeBtn = document.getElementById('closeModal');
        const applicationForm = document.getElementById('applicationForm');
        
        let scrollPosition = 0;
        
        // Open modal when proceed button is clicked
        proceedBtn.addEventListener('click', openModal);
        
        // Close modal handlers
        closeBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);
        modalContainer.addEventListener('click', e => e.stopPropagation());
        
        // Handle form submission
        applicationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                return;
            }
            
            const submitBtn = applicationForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'SUBMITTING...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            try {
                const name = document.getElementById('fullName').value;
                const email = document.getElementById('email').value;
                const contact = document.getElementById('contact').value;
                const address = document.getElementById('address').value;
                const city = document.getElementById('city').value;
                const technology = selectedInternship.title;
                
                const templateParams = {
                    from_name: name,
                    from_email: email,
                    contact: contact,
                    address: address,
                    city: city,
                    technology: technology,
                    subject: `New Internship Application - ${technology}`,
                    message: `
New internship application received:

Name: ${name}
Email: ${email}
Contact: ${contact}
Address: ${address}
City: ${city}
Technology: ${technology}

Please request the resume from the applicant at: ${email}
                    `
                };
                
                console.log('Sending emails...', templateParams);
                
                const adminResponse = await emailjs.send(
                    'service_zj9vz1t',
                    'template_7sbsm1b',
                    templateParams
                );
                
                console.log('Admin email sent!', adminResponse.status);
                
                const confirmationResponse = await emailjs.send(
                    'service_zj9vz1t',
                    'template_dnniys6',
                    templateParams
                );
                
                console.log('Confirmation email sent!', confirmationResponse.status);
                
                showSuccessMessage();
                
                setTimeout(() => {
                    closeModal();
                    applicationForm.reset();
                }, 2500);
                
            } catch (error) {
                console.error('EmailJS Error:', error);
                showErrorMessage('Failed to submit application. Please try again.');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        });
        
        function openModal() {
            console.log('Opening application modal');
            
            // Save scroll position
            scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            
            // Lock body scroll
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPosition}px`;
            document.body.style.width = '100%';
            
            // Populate technology field
            const techInput = document.getElementById('technology');
            if (techInput) {
                techInput.value = selectedInternship.title;
                techInput.readOnly = true;
            }
            
            // Show modal
            modalOverlay.classList.add('active');
            modalContainer.classList.add('active');
        }
        
        function closeModal() {
            console.log('Closing application modal');
            
            // Unlock body scroll
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollPosition);
            
            // Hide modal
            modalOverlay.classList.remove('active');
            modalContainer.classList.remove('active');
        }
        
        // Close modal on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
                closeModal();
            }
        });
    }
    
    function validateForm() {
        const form = document.getElementById('applicationForm');
        const inputs = form.querySelectorAll('input[required]:not([readonly]), textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#f56565';
                showErrorTooltip(input, 'Please fill in this field');
            } else {
                input.style.borderColor = 'rgba(255,255,255,0.2)';
            }
        });
        
        const emailInput = document.getElementById('email');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value && !emailPattern.test(emailInput.value)) {
            isValid = false;
            emailInput.style.borderColor = '#f56565';
            showErrorTooltip(emailInput, 'Please enter a valid email address');
        }
        
        const contactInput = document.getElementById('contact');
        const phonePattern = /^[0-9]{10}$/;
        if (contactInput.value && !phonePattern.test(contactInput.value)) {
            isValid = false;
            contactInput.style.borderColor = '#f56565';
            showErrorTooltip(contactInput, 'Please enter a valid 10-digit phone number');
        }
        
        return isValid;
    }
    
    function showErrorTooltip(element, message) {
        const existingTooltip = element.parentElement.querySelector('.error-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        const tooltip = document.createElement('div');
        tooltip.className = 'error-tooltip';
        tooltip.textContent = message;
        tooltip.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            background: #f56565;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.85rem;
            margin-top: 5px;
            z-index: 10;
            animation: fadeIn 0.2s ease;
        `;
        
        element.parentElement.style.position = 'relative';
        element.parentElement.appendChild(tooltip);
        
        setTimeout(() => tooltip.remove(), 3000);
    }
    
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 20px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-weight: 600;
            max-width: 400px;
        `;
        successMessage.innerHTML = `
            <strong style="font-size: 1.1rem;">✓ Success!</strong><br>
            <span style="font-size: 0.9rem;">Your application has been submitted successfully.</span><br>
            <span style="font-size: 0.85rem; opacity: 0.9; display: block; margin-top: 8px;">
                📧 Check your email for confirmation & next steps!
            </span>
        `;
        
        document.body.appendChild(successMessage);
        setTimeout(() => successMessage.remove(), 4000);
    }
    
    function showErrorMessage(message) {
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f56565;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-weight: 600;
        `;
        errorMessage.innerHTML = `
            <strong style="font-size: 1.1rem;">✗ Error!</strong><br>
            <span style="font-size: 0.9rem;">${message}</span>
        `;
        
        document.body.appendChild(errorMessage);
        setTimeout(() => errorMessage.remove(), 3000);
    }
});