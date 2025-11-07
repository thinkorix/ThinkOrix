// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create modal HTML and inject into the page
    createModalHTML();
    
    // Get all apply buttons
    const applyButtons = document.querySelectorAll('.apply-btn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContainer = document.getElementById('modalContainer');
    const closeModalBtn = document.getElementById('closeModal');
    const applicationForm = document.getElementById('applicationForm');
    
    let selectedInternship = '';
    
    // Add click event to all apply buttons
    applyButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Get the internship title from the card
            const card = this.closest('.internship-card');
            const internshipTitle = card.querySelector('h2').textContent;
            selectedInternship = internshipTitle;
            
            // Update and lock the technology field
            const techSelect = document.getElementById('technology');
            if (techSelect) {
                // Set the selected technology
                techSelect.value = internshipTitle;
                
                // Disable the select to make it non-changeable
                techSelect.disabled = true;
                
                // Add visual indicator that it's locked
                techSelect.style.background = '#f7fafc';
            }
            
            // Show modal
            openModal();
        });
    });
    
    // Close modal when clicking close button
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', closeModal);
    
    // Prevent closing when clicking inside modal
    modalContainer.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Handle form submission
    applicationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Get form data
        const formData = new FormData(applicationForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Add the locked technology value
        data.technology = selectedInternship;
        
        // Show success message
        showSuccessMessage();
        
        // Close modal after short delay
        setTimeout(() => {
            closeModal();
            applicationForm.reset();
        }, 2000);
        
        // In a real application, you would send this data to a server
        console.log('Form submitted:', data);
    });
    
    // Function to create modal HTML
    function createModalHTML() {
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
                            <input type="text" id="fullName" name="fullName" placeholder="Full Name" required>
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
                                <input type="email" id="technology" name="technology" placeholder="technology" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="resume">Upload Resume</label>
                            <div class="file-input-wrapper">
                                <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" required>
                            </div>
                        </div>
                        
                        <button type="submit" class="submit-btn">SUBMIT</button>
                    </form>
                </div>
            </div>
        `;
        
        // Insert modal HTML at the end of body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Function to open modal
    function openModal() {
        modalOverlay.classList.add('active');
        modalContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Function to close modal
    function closeModal() {
        modalOverlay.classList.remove('active');
        modalContainer.classList.remove('active');
        document.body.style.overflow = '';
        
        // Re-enable the technology select when closing
        const techSelect = document.getElementById('technology');
        if (techSelect) {
            techSelect.disabled = false;
            techSelect.style.background = '';
        }
    }
    
    // Function to validate form
    function validateForm() {
        const form = applicationForm;
        const inputs = form.querySelectorAll('input[required]:not([disabled]), select[required]:not([disabled]), textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#f56565';
                
                // Show error tooltip
                showErrorTooltip(input, 'Please fill in this field');
            } else {
                input.style.borderColor = '#e2e8f0';
            }
        });
        
        // Validate email format
        const emailInput = document.getElementById('email');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value && !emailPattern.test(emailInput.value)) {
            isValid = false;
            emailInput.style.borderColor = '#f56565';
            showErrorTooltip(emailInput, 'Please enter a valid email address');
        }
        
        // Validate phone number
        const contactInput = document.getElementById('contact');
        const phonePattern = /^[0-9]{10}$/;
        if (contactInput.value && !phonePattern.test(contactInput.value)) {
            isValid = false;
            contactInput.style.borderColor = '#f56565';
            showErrorTooltip(contactInput, 'Please enter a valid 10-digit phone number');
        }
        
        return isValid;
    }
    
    // Function to show error tooltip
    function showErrorTooltip(element, message) {
        // Remove existing tooltip if any
        const existingTooltip = element.parentElement.querySelector('.error-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        // Create tooltip
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
        
        // Remove tooltip after 3 seconds
        setTimeout(() => {
            tooltip.remove();
        }, 3000);
    }
    
    // Function to show success message
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-weight: 600;
        `;
        successMessage.innerHTML = `
            <strong style="font-size: 1.1rem;">✓ Success!</strong><br>
            <span style="font-size: 0.9rem;">Your application has been submitted successfully.</span>
        `;
        
        document.body.appendChild(successMessage);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                successMessage.remove();
            }, 300);
        }, 2000);
    }
    
    // Close modal on ESC key press
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
            closeModal();
        }
    });
});

// Add animations CSS
const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style);

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