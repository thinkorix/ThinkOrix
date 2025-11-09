// Initialize EmailJS with your Public Key
(function() {
    emailjs.init({
        publicKey: "N7Qk-3SH-uMcmYv8v",
    });
})();

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create both modals HTML and inject into the page
    createDetailsModalHTML();
    createApplicationModalHTML();
    
    // Get all apply buttons
    const applyButtons = document.querySelectorAll('.apply-btn');
    const detailsModal = document.getElementById('detailsModalOverlay');
    const detailsContainer = document.getElementById('detailsModalContainer');
    const closeDetailsBtn = document.getElementById('closeDetailsModal');
    const proceedToApplyBtn = document.getElementById('proceedToApply');
    
    const applicationModalOverlay = document.getElementById('modalOverlay');
    const applicationModalContainer = document.getElementById('modalContainer');
    const closeApplicationBtn = document.getElementById('closeModal');
    const applicationForm = document.getElementById('applicationForm');
    
    let selectedInternship = '';
    let internshipDetails = {};
    
    // Add click event to all apply buttons
    applyButtons.forEach((button) => {
        button.addEventListener('click', function() {
            const card = this.closest('.internship-card');
            const internshipTitle = card.querySelector('h2').textContent;
            selectedInternship = internshipTitle;
            
            // Extract internship details from card
            const detailItems = card.querySelectorAll('.detail-item span');
            internshipDetails = {
                title: internshipTitle,
                duration: detailItems[0]?.textContent || 'N/A',
                projectType: detailItems[1]?.textContent || 'N/A',
                location: detailItems[2]?.textContent || 'N/A',
                icon: card.querySelector('.internship-icon img')?.src || ''
            };
            
            // Show details modal first
            showDetailsModal(internshipDetails);
        });
    });
    
    // Details modal close handlers
    closeDetailsBtn.addEventListener('click', closeDetailsModal);
    detailsModal.addEventListener('click', closeDetailsModal);
    detailsContainer.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Proceed to application form
    proceedToApplyBtn.addEventListener('click', function() {
        closeDetailsModal();
        setTimeout(() => {
            openApplicationModal();
        }, 300);
    });
    
    // Application modal close handlers
    closeApplicationBtn.addEventListener('click', closeApplicationModal);
    applicationModalOverlay.addEventListener('click', closeApplicationModal);
    applicationModalContainer.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Handle form submission with EmailJS
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
            // Get form values
            const name = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const contact = document.getElementById('contact').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const technology = selectedInternship;
            
            // Prepare template parameters
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
            
            // Send email to admin
            const adminResponse = await emailjs.send(
                'service_zj9vz1t',
                'template_7sbsm1b',
                templateParams
            );
            
            console.log('Admin email sent!', adminResponse.status);
            
            // Send confirmation email to applicant
            const confirmationResponse = await emailjs.send(
                'service_zj9vz1t',
                'template_dnniys6',
                templateParams
            );
            
            console.log('Confirmation email sent!', confirmationResponse.status);
            console.log('✅ Both emails sent successfully!');
            
            showSuccessMessage();
            
            setTimeout(() => {
                closeApplicationModal();
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
    
    // Create Details Modal HTML
    function createDetailsModalHTML() {
        const modalHTML = `
            <div class="details-modal-overlay" id="detailsModalOverlay"></div>
            <div class="details-modal-container" id="detailsModalContainer">
                <div class="details-modal-header">
                    <div class="details-modal-icon" id="detailsModalIcon">
                        <img src="" alt="Internship" id="detailsIconImg">
                    </div>
                    <h2 id="detailsModalTitle">Internship Details</h2>
                    <button class="close-modal" id="closeDetailsModal">&times;</button>
                </div>
                <div class="details-modal-body">
                    <div class="detail-row">
                        <div class="detail-label">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 6v6l4 2"/>
                            </svg>
                            <span>Duration:</span>
                        </div>
                        <div class="detail-value" id="detailsDuration">0 - 6 Months</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                <path d="M9 11l3 3L22 4"/>
                                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                            </svg>
                            <span>Project Type:</span>
                        </div>
                        <div class="detail-value" id="detailsProjectType">With/Without Project</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            <span>Location:</span>
                        </div>
                        <div class="detail-value" id="detailsLocation">Remote</div>
                    </div>
                    
                    <div class="detail-row highlight">
                        <div class="detail-label">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                            </svg>
                            <span>Stipend:</span>
                        </div>
                        <div class="detail-value" style="color: #48bb78; font-weight: 600;">Paid Internship</div>
                    </div>
                    
                    <div class="benefits-section">
                        <h3>What You'll Get:</h3>
                        <ul>
                            <li>✓ Hands-on experience with real projects</li>
                            <li>✓ Mentorship from industry professionals</li>
                            <li>✓ Certificate of completion</li>
                            <li>✓ Flexible working hours</li>
                            <li>✓ Opportunity for full-time employment</li>
                        </ul>
                    </div>
                    
                    <button class="proceed-btn" id="proceedToApply">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                            <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
                            <path d="M9 18v-6" />
                            <path d="M15 18v-6" />
                            <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3L14 3H10L8 5H5a2 2 0 0 0-2 2z" />
                        </svg>
                        PROCEED TO APPLICATION
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Create Application Form Modal HTML
    function createApplicationModalHTML() {
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
    
    function showDetailsModal(details) {
        document.getElementById('detailsModalTitle').textContent = details.title;
        document.getElementById('detailsIconImg').src = details.icon;
        document.getElementById('detailsDuration').textContent = details.duration;
        document.getElementById('detailsProjectType').textContent = details.projectType;
        document.getElementById('detailsLocation').textContent = details.location;
        
        detailsModal.classList.add('active');
        detailsContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeDetailsModal() {
        detailsModal.classList.remove('active');
        detailsContainer.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function openApplicationModal() {
        const techInput = document.getElementById('technology');
        if (techInput) {
            techInput.value = selectedInternship;
            techInput.readOnly = true;
            techInput.style.background = '#1a1f2e';
            techInput.style.cursor = 'not-allowed';
        }
        
        applicationModalOverlay.classList.add('active');
        applicationModalContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeApplicationModal() {
        applicationModalOverlay.classList.remove('active');
        applicationModalContainer.classList.remove('active');
        document.body.style.overflow = '';
        
        const techInput = document.getElementById('technology');
        if (techInput) {
            techInput.readOnly = false;
            techInput.style.background = '';
            techInput.style.cursor = '';
        }
    }
    
    function validateForm() {
        const form = applicationForm;
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
        
        setTimeout(() => {
            tooltip.remove();
        }, 3000);
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
        
        setTimeout(() => {
            successMessage.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                successMessage.remove();
            }, 300);
        }, 4000);
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
        
        setTimeout(() => {
            errorMessage.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                errorMessage.remove();
            }, 300);
        }, 3000);
    }
    
    // Close modals on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (applicationModalContainer.classList.contains('active')) {
                closeApplicationModal();
            } else if (detailsContainer.classList.contains('active')) {
                closeDetailsModal();
            }
        }
    });
});

// Add animations and styles CSS
const style = document.createElement('style');
style.textContent = `
    /* Details Modal Overlay - Separate from Application Modal */
    .details-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .details-modal-overlay.active {
        opacity: 1;
        visibility: visible;
    }
    
    .details-modal-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        background: linear-gradient(135deg, #1a1f2e 0%, #252b3d 100%);
        border-radius: 20px;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        z-index: 1001;
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .details-modal-container.active {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    
    .details-modal-header {
        position: relative;
        padding: 30px;
        text-align: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .details-modal-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
        background: rgba(74, 158, 255, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid rgba(74, 158, 255, 0.3);
    }
    
    .details-modal-icon img {
        width: 50px;
        height: 50px;
        object-fit: contain;
    }
    
    .details-modal-header h2 {
        color: #ffffff;
        font-size: 1.8rem;
        margin: 0 0 10px 0;
    }
    
    .details-modal-body {
        padding: 30px;
    }
    
    .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        margin-bottom: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
    }
    
    .detail-row:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(74, 158, 255, 0.3);
    }
    
    .detail-row.highlight {
        background: rgba(72, 187, 120, 0.1);
        border-color: rgba(72, 187, 120, 0.3);
    }
    
    .detail-label {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #a0aec0;
        font-weight: 500;
    }
    
    .detail-label svg {
        color: #4a9eff;
    }
    
    .detail-value {
        color: #ffffff;
        font-weight: 600;
    }
    
    .benefits-section {
        margin-top: 30px;
        padding: 20px;
        background: rgba(74, 158, 255, 0.05);
        border-radius: 10px;
        border: 1px solid rgba(74, 158, 255, 0.2);
    }
    
    .benefits-section h3 {
        color: #4a9eff;
        margin: 0 0 15px 0;
        font-size: 1.2rem;
    }
    
    .benefits-section ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .benefits-section li {
        color: #cbd5e0;
        padding: 8px 0;
        font-size: 0.95rem;
    }
    
    .proceed-btn {
        width: 100%;
        margin-top: 25px;
        padding: 15px;
        background: linear-gradient(135deg, #4a9eff 0%, #357abd 100%);
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    
    .proceed-btn:hover {
        background: linear-gradient(135deg, #357abd 0%, #2563a8 100%);
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(74, 158, 255, 0.3);
    }
    
    .proceed-btn svg {
        width: 20px;
        height: 20px;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @media (max-width: 768px) {
        .details-modal-container {
            width: 95%;
        }
        
        .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
        }
        
        .detail-value {
            margin-left: 30px;
        }
    }
`;
document.head.appendChild(style);





// // Initialize EmailJS with your Public Key
// (function() {
//     emailjs.init({
//         publicKey: "N7Qk-3SH-uMcmYv8v",
//     });
// })();

// // Wait for DOM to be fully loaded
// document.addEventListener('DOMContentLoaded', function() {
//     // Create modal HTML and inject into the page
//     createModalHTML();
    
//     // Get all apply buttons
//     const applyButtons = document.querySelectorAll('.apply-btn');
//     const modalOverlay = document.getElementById('modalOverlay');
//     const modalContainer = document.getElementById('modalContainer');
//     const closeModalBtn = document.getElementById('closeModal');
//     const applicationForm = document.getElementById('applicationForm');
    
//     let selectedInternship = '';
    
//     // Add click event to all apply buttons
//     applyButtons.forEach((button, index) => {
//         button.addEventListener('click', function() {
//             const card = this.closest('.internship-card');
//             const internshipTitle = card.querySelector('h2').textContent;
//             selectedInternship = internshipTitle;
            
//             const techInput = document.getElementById('technology');
//             if (techInput) {
//                 techInput.value = internshipTitle;
//                 techInput.readOnly = true;
//                 techInput.style.background = '#1a1f2e';
//                 techInput.style.cursor = 'not-allowed';
//             }
            
//             openModal();
//         });
//     });
    
//     // Close modal handlers
//     closeModalBtn.addEventListener('click', closeModal);
//     modalOverlay.addEventListener('click', closeModal);
//     modalContainer.addEventListener('click', function(e) {
//         e.stopPropagation();
//     });
    
//     // Handle form submission with EmailJS
//     applicationForm.addEventListener('submit', async function(e) {
//         e.preventDefault();
        
//         if (!validateForm()) {
//             return;
//         }
        
//         const submitBtn = applicationForm.querySelector('.submit-btn');
//         const originalBtnText = submitBtn.textContent;
//         submitBtn.textContent = 'SUBMITTING...';
//         submitBtn.disabled = true;
//         submitBtn.style.opacity = '0.7';
        
//         try {
//             // Get form values
//             const name = document.getElementById('fullName').value;
//             const email = document.getElementById('email').value;
//             const contact = document.getElementById('contact').value;
//             const address = document.getElementById('address').value;
//             const city = document.getElementById('city').value;
//             const technology = selectedInternship;
            
//             // Prepare template parameters (WITHOUT file)
//             const templateParams = {
//                 from_name: name,
//                 from_email: email,
//                 contact: contact,
//                 address: address,
//                 city: city,
//                 technology: technology,
//                 subject: `New Internship Application - ${technology}`,
//                 message: `
// New internship application received:

// Name: ${name}
// Email: ${email}
// Contact: ${contact}
// Address: ${address}
// City: ${city}
// Technology: ${technology}

// Please request the resume from the applicant at: ${email}
//                 `
//             };
            
//             console.log('Sending emails...', templateParams);
            
//             // Send email to admin (thinkorix@gmail.com)
//             const adminResponse = await emailjs.send(
//                 'service_zj9vz1t',
//                 'template_7sbsm1b',
//                 templateParams
//             );
            
//             console.log('Admin email sent!', adminResponse.status);
            
//             // Send confirmation email to applicant
//             const confirmationResponse = await emailjs.send(
//                 'service_zj9vz1t',
//                 'template_dnniys6', // ⚠️ REPLACE THIS with your confirmation template ID
//                 templateParams
//             );
            
//             console.log('Confirmation email sent!', confirmationResponse.status);
//             console.log('✅ Both emails sent successfully!');
            
//             showSuccessMessage();
            
//             setTimeout(() => {
//                 closeModal();
//                 applicationForm.reset();
//             }, 2500);
            
//         } catch (error) {
//             console.error('EmailJS Error:', error);
//             showErrorMessage('Failed to submit application. Please try again.');
//         } finally {
//             submitBtn.textContent = originalBtnText;
//             submitBtn.disabled = false;
//             submitBtn.style.opacity = '1';
//         }
//     });
    
//     function createModalHTML() {
//         const modalHTML = `
//             <div class="modal-overlay" id="modalOverlay"></div>
//             <div class="modal-container" id="modalContainer">
//                 <div class="modal-header">
//                     <div class="modal-icon">
//                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                             <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
//                             <path d="M9 18v-6" />
//                             <path d="M15 18v-6" />
//                             <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3L14 3H10L8 5H5a2 2 0 0 0-2 2z" />
//                         </svg>
//                     </div>
//                     <h2>Job Application</h2>
//                     <p>Please fill the form to apply for the <b>paid</b> internship. Make sure the information you provided is correct.</p>
//                     <button class="close-modal" id="closeModal">&times;</button>
//                 </div>
//                 <div class="modal-body">
//                     <form id="applicationForm">
//                         <div class="form-group">
//                             <label for="fullName">Full name</label>
//                             <input type="text" id="fullName" name="name" placeholder="Full Name" required>
//                         </div>
                        
//                         <div class="form-group">
//                             <label for="email">Email</label>
//                             <input type="email" id="email" name="email" placeholder="Email" required>
//                         </div>
                        
//                         <div class="form-group">
//                             <label for="contact">Contact</label>
//                             <input type="tel" id="contact" name="contact" placeholder="Contact Number" required pattern="[0-9]{10}">
//                         </div>
                        
//                         <div class="form-group">
//                             <label for="address">Address</label>
//                             <textarea id="address" name="address" placeholder="Your address" required></textarea>
//                         </div>
                        
//                         <div class="form-row">
//                             <div class="form-group">
//                                 <label for="city">Your City & State</label>
//                                 <input type="text" id="city" name="city" placeholder="City & State" required>
//                             </div>
                            
//                             <div class="form-group">
//                                 <label for="technology">Technology</label>
//                                 <input type="text" id="technology" name="technology" placeholder="Technology" required readonly>
//                             </div>
//                         </div>
                        
//                         <div class="form-group" style="background: #252b3d; padding: 15px; border-radius: 8px; border: 1px solid rgba(74, 158, 255, 0.3);">
//                             <p style="color: #4da6ff; margin: 0; font-size: 14px;">
//                                 📧 <strong>Important:</strong> After submitting this form, please email your resume to <strong>thinkorix@gmail.com</strong> with the subject line: "Resume - [Your Name] - [Technology]"
//                             </p>
//                         </div>
                        
//                         <button type="submit" class="submit-btn">SUBMIT</button>
//                     </form>
//                 </div>
//             </div>
//         `;
        
//         document.body.insertAdjacentHTML('beforeend', modalHTML);
//     }
    
//     function openModal() {
//         modalOverlay.classList.add('active');
//         modalContainer.classList.add('active');
//         document.body.style.overflow = 'hidden';
//     }
    
//     function closeModal() {
//         modalOverlay.classList.remove('active');
//         modalContainer.classList.remove('active');
//         document.body.style.overflow = '';
        
//         const techInput = document.getElementById('technology');
//         if (techInput) {
//             techInput.readOnly = false;
//             techInput.style.background = '';
//             techInput.style.cursor = '';
//         }
//     }
    
//     function validateForm() {
//         const form = applicationForm;
//         const inputs = form.querySelectorAll('input[required]:not([readonly]), textarea[required]');
//         let isValid = true;
        
//         inputs.forEach(input => {
//             if (!input.value.trim()) {
//                 isValid = false;
//                 input.style.borderColor = '#f56565';
//                 showErrorTooltip(input, 'Please fill in this field');
//             } else {
//                 input.style.borderColor = 'rgba(255,255,255,0.2)';
//             }
//         });
        
//         const emailInput = document.getElementById('email');
//         const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (emailInput.value && !emailPattern.test(emailInput.value)) {
//             isValid = false;
//             emailInput.style.borderColor = '#f56565';
//             showErrorTooltip(emailInput, 'Please enter a valid email address');
//         }
        
//         const contactInput = document.getElementById('contact');
//         const phonePattern = /^[0-9]{10}$/;
//         if (contactInput.value && !phonePattern.test(contactInput.value)) {
//             isValid = false;
//             contactInput.style.borderColor = '#f56565';
//             showErrorTooltip(contactInput, 'Please enter a valid 10-digit phone number');
//         }
        
//         return isValid;
//     }
    
//     function showErrorTooltip(element, message) {
//         const existingTooltip = element.parentElement.querySelector('.error-tooltip');
//         if (existingTooltip) {
//             existingTooltip.remove();
//         }
        
//         const tooltip = document.createElement('div');
//         tooltip.className = 'error-tooltip';
//         tooltip.textContent = message;
//         tooltip.style.cssText = `
//             position: absolute;
//             top: 100%;
//             left: 0;
//             background: #f56565;
//             color: white;
//             padding: 5px 10px;
//             border-radius: 4px;
//             font-size: 0.85rem;
//             margin-top: 5px;
//             z-index: 10;
//             animation: fadeIn 0.2s ease;
//         `;
        
//         element.parentElement.style.position = 'relative';
//         element.parentElement.appendChild(tooltip);
        
//         setTimeout(() => {
//             tooltip.remove();
//         }, 3000);
//     }
    
//     function showSuccessMessage() {
//         const successMessage = document.createElement('div');
//         successMessage.style.cssText = `
//             position: fixed;
//             top: 20px;
//             right: 20px;
//             background: #48bb78;
//             color: white;
//             padding: 20px 25px;
//             border-radius: 8px;
//             box-shadow: 0 4px 15px rgba(0,0,0,0.2);
//             z-index: 10000;
//             animation: slideInRight 0.3s ease;
//             font-weight: 600;
//             max-width: 400px;
//         `;
//         successMessage.innerHTML = `
//             <strong style="font-size: 1.1rem;">✓ Success!</strong><br>
//             <span style="font-size: 0.9rem;">Your application has been submitted successfully.</span><br>
//             <span style="font-size: 0.85rem; opacity: 0.9; display: block; margin-top: 8px;">
//                 📧 Check your email for confirmation & next steps!
//             </span>
//         `;
        
//         document.body.appendChild(successMessage);
        
//         setTimeout(() => {
//             successMessage.style.animation = 'slideOutRight 0.3s ease';
//             setTimeout(() => {
//                 successMessage.remove();
//             }, 300);
//         }, 4000);
//     }
    
//     function showErrorMessage(message) {
//         const errorMessage = document.createElement('div');
//         errorMessage.style.cssText = `
//             position: fixed;
//             top: 20px;
//             right: 20px;
//             background: #f56565;
//             color: white;
//             padding: 15px 20px;
//             border-radius: 8px;
//             box-shadow: 0 4px 15px rgba(0,0,0,0.2);
//             z-index: 10000;
//             animation: slideInRight 0.3s ease;
//             font-weight: 600;
//         `;
//         errorMessage.innerHTML = `
//             <strong style="font-size: 1.1rem;">✗ Error!</strong><br>
//             <span style="font-size: 0.9rem;">${message}</span>
//         `;
        
//         document.body.appendChild(errorMessage);
        
//         setTimeout(() => {
//             errorMessage.style.animation = 'slideOutRight 0.3s ease';
//             setTimeout(() => {
//                 errorMessage.remove();
//             }, 300);
//         }, 3000);
//     }
    
//     document.addEventListener('keydown', function(e) {
//         if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
//             closeModal();
//         }
//     });
// });

// // Add animations CSS
// const style = document.createElement('style');
// style.textContent = `
//     @keyframes slideInRight {
//         from {
//             transform: translateX(400px);
//             opacity: 0;
//         }
//         to {
//             transform: translateX(0);
//             opacity: 1;
//         }
//     }
    
//     @keyframes slideOutRight {
//         from {
//             transform: translateX(0);
//             opacity: 1;
//         }
//         to {
//             transform: translateX(400px);
//             opacity: 0;
//         }
//     }
    
//     @keyframes fadeIn {
//         from {
//             opacity: 0;
//         }
//         to {
//             opacity: 1;
//         }
//     }
// `;
// document.head.appendChild(style);








// // Initialize EmailJS with your Public Key
// (function() {
//     emailjs.init({
//         publicKey: "N7Qk-3SH-uMcmYv8v", // Replace with your EmailJS public key
//     });
// })();

// // Wait for DOM to be fully loaded
// document.addEventListener('DOMContentLoaded', function() {
//     // Create modal HTML and inject into the page
//     createModalHTML();
    
//     // Get all apply buttons
//     const applyButtons = document.querySelectorAll('.apply-btn');
//     const modalOverlay = document.getElementById('modalOverlay');
//     const modalContainer = document.getElementById('modalContainer');
//     const closeModalBtn = document.getElementById('closeModal');
//     const applicationForm = document.getElementById('applicationForm');
    
//     let selectedInternship = '';
    
//     // Add click event to all apply buttons
//     applyButtons.forEach((button, index) => {
//         button.addEventListener('click', function() {
//             const card = this.closest('.internship-card');
//             const internshipTitle = card.querySelector('h2').textContent;
//             selectedInternship = internshipTitle;
            
//             const techInput = document.getElementById('technology');
//             if (techInput) {
//                 techInput.value = internshipTitle;
//                 techInput.readOnly = true;
//                 techInput.style.background = '#1a1f2e';
//                 techInput.style.cursor = 'not-allowed';
//             }
            
//             openModal();
//         });
//     });
    
//     // Close modal handlers
//     closeModalBtn.addEventListener('click', closeModal);
//     modalOverlay.addEventListener('click', closeModal);
//     modalContainer.addEventListener('click', function(e) {
//         e.stopPropagation();
//     });
    
//     // Handle form submission with EmailJS
//     applicationForm.addEventListener('submit', async function(e) {
//         e.preventDefault();
        
//         if (!validateForm()) {
//             return;
//         }
        
//         const submitBtn = applicationForm.querySelector('.submit-btn');
//         const originalBtnText = submitBtn.textContent;
//         submitBtn.textContent = 'SUBMITTING...';
//         submitBtn.disabled = true;
//         submitBtn.style.opacity = '0.7';
        
//         try {
//             // Get form values
//             const name = document.getElementById('fullName').value;
//             const email = document.getElementById('email').value;
//             const contact = document.getElementById('contact').value;
//             const address = document.getElementById('address').value;
//             const city = document.getElementById('city').value;
//             const technology = selectedInternship;
            
//             // Get file
//             const fileInput = document.getElementById('resume');
//             const file = fileInput.files[0];
            
//             // Read file as base64
//             const reader = new FileReader();
//             reader.readAsDataURL(file);
            
//             reader.onload = async function() {
//                 const base64File = reader.result.split(',')[1];
                
//                 // Prepare template parameters
//                 const templateParams = {
//                     to_email: 'thinkorix@gmail.com',
//                     from_name: name,
//                     from_email: email,
//                     contact: contact,
//                     address: address,
//                     city: city,
//                     technology: technology,
//                     subject: `New Internship Application - ${technology}`,
//                     message: `
// New internship application received:

// Name: ${name}
// Email: ${email}
// Contact: ${contact}
// Address: ${address}
// City: ${city}
// Technology: ${technology}

// Resume attached.
//                     `,
//                     attachment: base64File,
//                     attachment_name: file.name
//                 };
                
//                 try {
//                     // Send email using EmailJS
//                     const response = await emailjs.send(
//                         'service_zj9vz1t',      // Replace with your Service ID
//                         'template_7sbsm1b',     // Replace with your Template ID
//                         templateParams
//                     );
                    
//                     console.log('SUCCESS!', response.status, response.text);
//                     showSuccessMessage();
                    
//                     setTimeout(() => {
//                         closeModal();
//                         applicationForm.reset();
//                     }, 2500);
                    
//                 } catch (error) {
//                     console.error('FAILED...', error);
//                     throw error;
//                 }
//             };
            
//             reader.onerror = function() {
//                 throw new Error('Failed to read file');
//             };
            
//         } catch (error) {
//             console.error('Error:', error);
//             showErrorMessage('Failed to submit application. Please try again.');
//         } finally {
//             submitBtn.textContent = originalBtnText;
//             submitBtn.disabled = false;
//             submitBtn.style.opacity = '1';
//         }
//     });
    
//     function createModalHTML() {
//         const modalHTML = `
//             <div class="modal-overlay" id="modalOverlay"></div>
//             <div class="modal-container" id="modalContainer">
//                 <div class="modal-header">
//                     <div class="modal-icon">
//                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                             <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
//                             <path d="M9 18v-6" />
//                             <path d="M15 18v-6" />
//                             <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3L14 3H10L8 5H5a2 2 0 0 0-2 2z" />
//                         </svg>
//                     </div>
//                     <h2>Job Application</h2>
//                     <p>Please fill the form to apply for the <b>paid</b> internship. Make sure the information you provided is correct.</p>
//                     <button class="close-modal" id="closeModal">&times;</button>
//                 </div>
//                 <div class="modal-body">
//                     <form id="applicationForm">
//                         <div class="form-group">
//                             <label for="fullName">Full name</label>
//                             <input type="text" id="fullName" name="name" placeholder="Full Name" required>
//                         </div>
                        
//                         <div class="form-group">
//                             <label for="email">Email</label>
//                             <input type="email" id="email" name="email" placeholder="Email" required>
//                         </div>
                        
//                         <div class="form-group">
//                             <label for="contact">Contact</label>
//                             <input type="tel" id="contact" name="contact" placeholder="Contact Number" required pattern="[0-9]{10}">
//                         </div>
                        
//                         <div class="form-group">
//                             <label for="address">Address</label>
//                             <textarea id="address" name="address" placeholder="Your address" required></textarea>
//                         </div>
                        
//                         <div class="form-row">
//                             <div class="form-group">
//                                 <label for="city">Your City & State</label>
//                                 <input type="text" id="city" name="city" placeholder="City & State" required>
//                             </div>
                            
//                             <div class="form-group">
//                                 <label for="technology">Technology</label>
//                                 <input type="text" id="technology" name="technology" placeholder="Technology" required readonly>
//                             </div>
//                         </div>
                        
//                         <div class="form-group">
//                             <label for="resume">Upload Resume</label>
//                             <div class="file-input-wrapper">
//                                 <input type="file" id="resume" name="attachment" accept=".pdf,.doc,.docx" required>
//                             </div>
//                             <small style="color: #b0b8c1;">Max file size: 500KB (EmailJS free plan)</small>
//                         </div>
                        
//                         <button type="submit" class="submit-btn">SUBMIT</button>
//                     </form>
//                 </div>
//             </div>
//         `;
        
//         document.body.insertAdjacentHTML('beforeend', modalHTML);
//     }
    
//     function openModal() {
//         modalOverlay.classList.add('active');
//         modalContainer.classList.add('active');
//         document.body.style.overflow = 'hidden';
//     }
    
//     function closeModal() {
//         modalOverlay.classList.remove('active');
//         modalContainer.classList.remove('active');
//         document.body.style.overflow = '';
        
//         const techInput = document.getElementById('technology');
//         if (techInput) {
//             techInput.readOnly = false;
//             techInput.style.background = '';
//             techInput.style.cursor = '';
//         }
//     }
    
//     function validateForm() {
//         const form = applicationForm;
//         const inputs = form.querySelectorAll('input[required]:not([readonly]), textarea[required]');
//         let isValid = true;
        
//         inputs.forEach(input => {
//             if (!input.value.trim()) {
//                 isValid = false;
//                 input.style.borderColor = '#f56565';
//                 showErrorTooltip(input, 'Please fill in this field');
//             } else {
//                 input.style.borderColor = 'rgba(255,255,255,0.2)';
//             }
//         });
        
//         const emailInput = document.getElementById('email');
//         const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (emailInput.value && !emailPattern.test(emailInput.value)) {
//             isValid = false;
//             emailInput.style.borderColor = '#f56565';
//             showErrorTooltip(emailInput, 'Please enter a valid email address');
//         }
        
//         const contactInput = document.getElementById('contact');
//         const phonePattern = /^[0-9]{10}$/;
//         if (contactInput.value && !phonePattern.test(contactInput.value)) {
//             isValid = false;
//             contactInput.style.borderColor = '#f56565';
//             showErrorTooltip(contactInput, 'Please enter a valid 10-digit phone number');
//         }
        
//         const resumeInput = document.getElementById('resume');
//         if (!resumeInput.files || resumeInput.files.length === 0) {
//             isValid = false;
//             resumeInput.style.borderColor = '#f56565';
//             showErrorTooltip(resumeInput, 'Please upload your resume');
//         } else {
//             const fileSize = resumeInput.files[0].size / 1024; // in KB
//             if (fileSize > 500) {
//                 isValid = false;
//                 resumeInput.style.borderColor = '#f56565';
//                 showErrorTooltip(resumeInput, 'File size should not exceed 500KB for EmailJS free plan');
//             }
//         }
        
//         return isValid;
//     }
    
//     function showErrorTooltip(element, message) {
//         const existingTooltip = element.parentElement.querySelector('.error-tooltip');
//         if (existingTooltip) {
//             existingTooltip.remove();
//         }
        
//         const tooltip = document.createElement('div');
//         tooltip.className = 'error-tooltip';
//         tooltip.textContent = message;
//         tooltip.style.cssText = `
//             position: absolute;
//             top: 100%;
//             left: 0;
//             background: #f56565;
//             color: white;
//             padding: 5px 10px;
//             border-radius: 4px;
//             font-size: 0.85rem;
//             margin-top: 5px;
//             z-index: 10;
//             animation: fadeIn 0.2s ease;
//         `;
        
//         element.parentElement.style.position = 'relative';
//         element.parentElement.appendChild(tooltip);
        
//         setTimeout(() => {
//             tooltip.remove();
//         }, 3000);
//     }
    
//     function showSuccessMessage() {
//         const successMessage = document.createElement('div');
//         successMessage.style.cssText = `
//             position: fixed;
//             top: 20px;
//             right: 20px;
//             background: #48bb78;
//             color: white;
//             padding: 15px 20px;
//             border-radius: 8px;
//             box-shadow: 0 4px 15px rgba(0,0,0,0.2);
//             z-index: 10000;
//             animation: slideInRight 0.3s ease;
//             font-weight: 600;
//         `;
//         successMessage.innerHTML = `
//             <strong style="font-size: 1.1rem;">✓ Success!</strong><br>
//             <span style="font-size: 0.9rem;">Your application has been submitted successfully.</span>
//         `;
        
//         document.body.appendChild(successMessage);
        
//         setTimeout(() => {
//             successMessage.style.animation = 'slideOutRight 0.3s ease';
//             setTimeout(() => {
//                 successMessage.remove();
//             }, 300);
//         }, 2500);
//     }
    
//     function showErrorMessage(message) {
//         const errorMessage = document.createElement('div');
//         errorMessage.style.cssText = `
//             position: fixed;
//             top: 20px;
//             right: 20px;
//             background: #f56565;
//             color: white;
//             padding: 15px 20px;
//             border-radius: 8px;
//             box-shadow: 0 4px 15px rgba(0,0,0,0.2);
//             z-index: 10000;
//             animation: slideInRight 0.3s ease;
//             font-weight: 600;
//         `;
//         errorMessage.innerHTML = `
//             <strong style="font-size: 1.1rem;">✗ Error!</strong><br>
//             <span style="font-size: 0.9rem;">${message}</span>
//         `;
        
//         document.body.appendChild(errorMessage);
        
//         setTimeout(() => {
//             errorMessage.style.animation = 'slideOutRight 0.3s ease';
//             setTimeout(() => {
//                 errorMessage.remove();
//             }, 300);
//         }, 3000);
//     }
    
//     document.addEventListener('keydown', function(e) {
//         if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
//             closeModal();
//         }
//     });
// });

// // Add animations CSS
// const style = document.createElement('style');
// style.textContent = `
//     @keyframes slideInRight {
//         from {
//             transform: translateX(400px);
//             opacity: 0;
//         }
//         to {
//             transform: translateX(0);
//             opacity: 1;
//         }
//     }
    
//     @keyframes slideOutRight {
//         from {
//             transform: translateX(0);
//             opacity: 1;
//         }
//         to {
//             transform: translateX(400px);
//             opacity: 0;
//         }
//     }
    
//     @keyframes fadeIn {
//         from {
//             opacity: 0;
//         }
//         to {
//             opacity: 1;
//         }
//     }
// `;
// document.head.appendChild(style);

























// Wait for DOM to be fully loaded
// document.addEventListener('DOMContentLoaded', function() {
//     // Create modal HTML and inject into the page
//     createModalHTML();
    
//     // Get all apply buttons
//     const applyButtons = document.querySelectorAll('.apply-btn');
//     const modalOverlay = document.getElementById('modalOverlay');
//     const modalContainer = document.getElementById('modalContainer');
//     const closeModalBtn = document.getElementById('closeModal');
//     const applicationForm = document.getElementById('applicationForm');
    
//     let selectedInternship = '';
    
//     // Initialize storage
//     initializeStorage();
    
//     // Add click event to all apply buttons
//     applyButtons.forEach((button, index) => {
//         button.addEventListener('click', function() {
//             // Get the internship title from the card
//             const card = this.closest('.internship-card');
//             const internshipTitle = card.querySelector('h2').textContent;
//             selectedInternship = internshipTitle;
            
//             // Update and lock the technology field
//             const techInput = document.getElementById('technology');
//             if (techInput) {
//                 // Set the selected technology
//                 techInput.value = internshipTitle;
                
//                 // Make it readonly instead of disabled so value gets submitted
//                 techInput.readOnly = true;
                
//                 // Add visual indicator that it's locked
//                 techInput.style.background = '#f7fafc';
//                 techInput.style.cursor = 'not-allowed';
//             }
            
//             // Show modal
//             openModal();
//         });
//     });
    
//     // Close modal when clicking close button
//     closeModalBtn.addEventListener('click', closeModal);
    
//     // Close modal when clicking overlay
//     modalOverlay.addEventListener('click', closeModal);
    
//     // Prevent closing when clicking inside modal
//     modalContainer.addEventListener('click', function(e) {
//         e.stopPropagation();
//     });
    
//     // Handle form submission
//     applicationForm.addEventListener('submit', async function(e) {
//         e.preventDefault();
        
//         // Validate form
//         if (!validateForm()) {
//             return;
//         }
        
//         // Get form data
//         const formData = new FormData(applicationForm);
//         const data = {
//             id: Date.now().toString(), // Unique ID
//             submittedAt: new Date().toISOString(),
//             fullName: formData.get('fullName'),
//             email: formData.get('email'),
//             contact: formData.get('contact'),
//             address: formData.get('address'),
//             city: formData.get('city'),
//             technology: selectedInternship,
//             resumeFileName: formData.get('resume')?.name || 'No file uploaded',
//             status: 'Pending'
//         };
        
//         // Handle resume file
//         const resumeFile = formData.get('resume');
//         if (resumeFile && resumeFile.size > 0) {
//             try {
//                 data.resumeData = await fileToBase64(resumeFile);
//                 data.resumeType = resumeFile.type;
//             } catch (error) {
//                 console.error('Error processing resume:', error);
//             }
//         }
        
//         // Save to storage
//         saveApplication(data);
        
//         // Show success message
//         showSuccessMessage();
        
//         // Close modal after short delay
//         setTimeout(() => {
//             closeModal();
//             applicationForm.reset();
//         }, 2000);
        
//         // Log saved data
//         console.log('Application saved:', data);
//         console.log('Total applications:', getAllApplications().length);
//     });
    
//     // Function to initialize storage
//     function initializeStorage() {
//         if (!localStorage.getItem('internshipApplications')) {
//             localStorage.setItem('internshipApplications', JSON.stringify([]));
//         }
//     }
    
//     // Function to save application
//     function saveApplication(data) {
//         try {
//             const applications = getAllApplications();
//             applications.push(data);
//             localStorage.setItem('internshipApplications', JSON.stringify(applications));
//             return true;
//         } catch (error) {
//             console.error('Error saving application:', error);
//             // If localStorage is full, show error
//             if (error.name === 'QuotaExceededError') {
//                 alert('Storage is full. Please clear some old applications.');
//             }
//             return false;
//         }
//     }
    
//     // Function to get all applications
//     function getAllApplications() {
//         try {
//             const data = localStorage.getItem('internshipApplications');
//             return data ? JSON.parse(data) : [];
//         } catch (error) {
//             console.error('Error retrieving applications:', error);
//             return [];
//         }
//     }
    
//     // Function to convert file to base64
//     function fileToBase64(file) {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = () => resolve(reader.result);
//             reader.onerror = reject;
//             reader.readAsDataURL(file);
//         });
//     }
    
//     // Function to create modal HTML
//     function createModalHTML() {
//         const modalHTML = `
//             <div class="modal-overlay" id="modalOverlay"></div>
//             <div class="modal-container" id="modalContainer">
//                 <div class="modal-header">
//                     <div class="modal-icon">
//                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                             <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
//                             <path d="M9 18v-6" />
//                             <path d="M15 18v-6" />
//                             <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3L14 3H10L8 5H5a2 2 0 0 0-2 2z" />
//                         </svg>
//                     </div>
//                     <h2>Job Application</h2>
//                     <p>Please fill the form to apply for the <b>paid</b> internship. Make sure the information you provided is correct.</p>
//                     <button class="close-modal" id="closeModal">&times;</button>
//                 </div>
//                 <div class="modal-body">
//                     <form id="applicationForm">
//                         <div class="form-group">
//                             <label for="fullName">Full name</label>
//                             <input type="text" id="fullName" name="fullName" placeholder="Full Name" required>
//                         </div>
                        
//                         <div class="form-group">
//                             <label for="email">Email</label>
//                             <input type="email" id="email" name="email" placeholder="Email" required>
//                         </div>
                        
//                         <div class="form-group">
//                             <label for="contact">Contact</label>
//                             <input type="tel" id="contact" name="contact" placeholder="Contact Number" required pattern="[0-9]{10}">
//                         </div>
                        
//                         <div class="form-group">
//                             <label for="address">Address</label>
//                             <textarea id="address" name="address" placeholder="Your address" required></textarea>
//                         </div>
                        
//                         <div class="form-row">
//                             <div class="form-group">
//                                 <label for="city">Your City & State</label>
//                                 <input type="text" id="city" name="city" placeholder="City & State" required>
//                             </div>
                            
//                             <div class="form-group">
//                                 <label for="technology">Technology</label>
//                                 <input type="text" id="technology" name="technology" placeholder="Technology" required>
//                             </div>
//                         </div>
                        
//                         <div class="form-group">
//                             <label for="resume">Upload Resume</label>
//                             <div class="file-input-wrapper">
//                                 <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" required>
//                             </div>
//                         </div>
                        
//                         <button type="submit" class="submit-btn">SUBMIT</button>
//                     </form>
//                 </div>
//             </div>
//         `;
        
//         // Insert modal HTML at the end of body
//         document.body.insertAdjacentHTML('beforeend', modalHTML);
//     }
    
//     // Function to open modal
//     function openModal() {
//         modalOverlay.classList.add('active');
//         modalContainer.classList.add('active');
//         document.body.style.overflow = 'hidden';
//     }
    
//     // Function to close modal
//     function closeModal() {
//         modalOverlay.classList.remove('active');
//         modalContainer.classList.remove('active');
//         document.body.style.overflow = '';
        
//         // Re-enable the technology input when closing
//         const techInput = document.getElementById('technology');
//         if (techInput) {
//             techInput.readOnly = false;
//             techInput.style.background = '';
//             techInput.style.cursor = '';
//         }
//     }
    
//     // Function to validate form
//     function validateForm() {
//         const form = applicationForm;
//         const inputs = form.querySelectorAll('input[required]:not([readonly]), select[required]:not([readonly]), textarea[required]');
//         let isValid = true;
        
//         inputs.forEach(input => {
//             if (!input.value.trim()) {
//                 isValid = false;
//                 input.style.borderColor = '#f56565';
                
//                 // Show error tooltip
//                 showErrorTooltip(input, 'Please fill in this field');
//             } else {
//                 input.style.borderColor = '#e2e8f0';
//             }
//         });
        
//         // Validate email format
//         const emailInput = document.getElementById('email');
//         const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (emailInput.value && !emailPattern.test(emailInput.value)) {
//             isValid = false;
//             emailInput.style.borderColor = '#f56565';
//             showErrorTooltip(emailInput, 'Please enter a valid email address');
//         }
        
//         // Validate phone number
//         const contactInput = document.getElementById('contact');
//         const phonePattern = /^[0-9]{10}$/;
//         if (contactInput.value && !phonePattern.test(contactInput.value)) {
//             isValid = false;
//             contactInput.style.borderColor = '#f56565';
//             showErrorTooltip(contactInput, 'Please enter a valid 10-digit phone number');
//         }
        
//         return isValid;
//     }
    
//     // Function to show error tooltip
//     function showErrorTooltip(element, message) {
//         // Remove existing tooltip if any
//         const existingTooltip = element.parentElement.querySelector('.error-tooltip');
//         if (existingTooltip) {
//             existingTooltip.remove();
//         }
        
//         // Create tooltip
//         const tooltip = document.createElement('div');
//         tooltip.className = 'error-tooltip';
//         tooltip.textContent = message;
//         tooltip.style.cssText = `
//             position: absolute;
//             top: 100%;
//             left: 0;
//             background: #f56565;
//             color: white;
//             padding: 5px 10px;
//             border-radius: 4px;
//             font-size: 0.85rem;
//             margin-top: 5px;
//             z-index: 10;
//             animation: fadeIn 0.2s ease;
//         `;
        
//         element.parentElement.style.position = 'relative';
//         element.parentElement.appendChild(tooltip);
        
//         // Remove tooltip after 3 seconds
//         setTimeout(() => {
//             tooltip.remove();
//         }, 3000);
//     }
    
//     // Function to show success message
//     function showSuccessMessage() {
//         const successMessage = document.createElement('div');
//         successMessage.style.cssText = `
//             position: fixed;
//             top: 20px;
//             right: 20px;
//             background: #48bb78;
//             color: white;
//             padding: 15px 20px;
//             border-radius: 8px;
//             box-shadow: 0 4px 15px rgba(0,0,0,0.2);
//             z-index: 10000;
//             animation: slideInRight 0.3s ease;
//             font-weight: 600;
//         `;
//         successMessage.innerHTML = `
//             <strong style="font-size: 1.1rem;">✓ Success!</strong><br>
//             <span style="font-size: 0.9rem;">Your application has been submitted successfully.</span>
//         `;
        
//         document.body.appendChild(successMessage);
        
//         // Remove success message after 3 seconds
//         setTimeout(() => {
//             successMessage.style.animation = 'slideOutRight 0.3s ease';
//             setTimeout(() => {
//                 successMessage.remove();
//             }, 300);
//         }, 2000);
//     }
    
//     // Close modal on ESC key press
//     document.addEventListener('keydown', function(e) {
//         if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
//             closeModal();
//         }
//     });
    
//     // Expose functions to window for console access
//     window.internshipApplications = {
//         getAll: getAllApplications,
//         getById: (id) => getAllApplications().find(app => app.id === id),
//         getByEmail: (email) => getAllApplications().filter(app => app.email === email),
//         getByTechnology: (tech) => getAllApplications().filter(app => app.technology === tech),
//         deleteById: (id) => {
//             const apps = getAllApplications().filter(app => app.id !== id);
//             localStorage.setItem('internshipApplications', JSON.stringify(apps));
//             console.log('Application deleted');
//         },
//         deleteAll: () => {
//             if (confirm('Are you sure you want to delete all applications?')) {
//                 localStorage.setItem('internshipApplications', JSON.stringify([]));
//                 console.log('All applications deleted');
//             }
//         },
//         exportToJSON: () => {
//             const data = JSON.stringify(getAllApplications(), null, 2);
//             const blob = new Blob([data], { type: 'application/json' });
//             const url = URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             a.href = url;
//             a.download = `internship-applications-${Date.now()}.json`;
//             a.click();
//             URL.revokeObjectURL(url);
//         },
//         exportToCSV: () => {
//             const apps = getAllApplications();
//             if (apps.length === 0) {
//                 alert('No applications to export');
//                 return;
//             }
            
//             const headers = ['ID', 'Full Name', 'Email', 'Contact', 'Address', 'City', 'Technology', 'Resume File', 'Status', 'Submitted At'];
//             const rows = apps.map(app => [
//                 app.id,
//                 app.fullName,
//                 app.email,
//                 app.contact,
//                 app.address,
//                 app.city,
//                 app.technology,
//                 app.resumeFileName,
//                 app.status,
//                 new Date(app.submittedAt).toLocaleString()
//             ]);
            
//             let csv = headers.join(',') + '\n';
//             rows.forEach(row => {
//                 csv += row.map(cell => `"${cell}"`).join(',') + '\n';
//             });
            
//             const blob = new Blob([csv], { type: 'text/csv' });
//             const url = URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             a.href = url;
//             a.download = `internship-applications-${Date.now()}.csv`;
//             a.click();
//             URL.revokeObjectURL(url);
//         },
//         downloadResume: (id) => {
//             const app = getAllApplications().find(a => a.id === id);
//             if (app && app.resumeData) {
//                 const a = document.createElement('a');
//                 a.href = app.resumeData;
//                 a.download = app.resumeFileName;
//                 a.click();
//             } else {
//                 console.log('Resume not found for this application');
//             }
//         },
//         showStats: () => {
//             const apps = getAllApplications();
//             const stats = {
//                 total: apps.length,
//                 byTechnology: {},
//                 byStatus: {},
//                 recentApplications: apps.slice(-5).map(a => ({
//                     name: a.fullName,
//                     technology: a.technology,
//                     date: new Date(a.submittedAt).toLocaleDateString()
//                 }))
//             };
            
//             apps.forEach(app => {
//                 stats.byTechnology[app.technology] = (stats.byTechnology[app.technology] || 0) + 1;
//                 stats.byStatus[app.status] = (stats.byStatus[app.status] || 0) + 1;
//             });
            
//             console.table(stats.byTechnology);
//             console.table(stats.byStatus);
//             console.log('Recent Applications:', stats.recentApplications);
//             console.log('Total Applications:', stats.total);
//         }
//     };
    
//     // Log helpful message
//     console.log('%c📊 Internship Application Manager', 'color: #0066cc; font-size: 16px; font-weight: bold;');
//     console.log('Use window.internshipApplications for data management:');
//     console.log('  - getAll() - Get all applications');
//     console.log('  - getById(id) - Get application by ID');
//     console.log('  - getByEmail(email) - Get applications by email');
//     console.log('  - getByTechnology(tech) - Get applications by technology');
//     console.log('  - deleteById(id) - Delete specific application');
//     console.log('  - deleteAll() - Delete all applications');
//     console.log('  - exportToJSON() - Export all data to JSON file');
//     console.log('  - exportToCSV() - Export all data to CSV file');
//     console.log('  - downloadResume(id) - Download resume for specific application');
//     console.log('  - showStats() - Show application statistics');
// });

// // Add animations CSS
// const style = document.createElement('style');
// style.textContent = `
//     @keyframes slideInRight {
//         from {
//             transform: translateX(400px);
//             opacity: 0;
//         }
//         to {
//             transform: translateX(0);
//             opacity: 1;
//         }
//     }
    
//     @keyframes slideOutRight {
//         from {
//             transform: translateX(0);
//             opacity: 1;
//         }
//         to {
//             transform: translateX(400px);
//             opacity: 0;
//         }
//     }
// `;
// document.head.appendChild(style);