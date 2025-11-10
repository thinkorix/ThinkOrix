// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get all required elements
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const closeBtn = document.getElementById('closeBtn');
    const navLinks = document.querySelectorAll('.nav-link');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    // Check if elements exist before adding listeners
    if (!hamburger || !sidebar || !sidebarOverlay || !closeBtn) {
        console.error('Navigation elements not found!');
        return;
    }

    // ============================================
    // SIDEBAR TOGGLE FUNCTIONS
    // ============================================
    
    function openSidebar() {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        hamburger.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        openSidebar();
    });

    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeSidebar();
    });

    sidebarOverlay.addEventListener('click', function() {
        closeSidebar();
    });

    sidebar.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    // ============================================
    // ACTIVE PAGE DETECTION
    // ============================================
    
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    function setActiveLink(links) {
        links.forEach(link => {
            const href = link.getAttribute("href");
            link.classList.remove("active");
            
            if (href === currentPage || 
                (href === "index.html" && (currentPage === "" || currentPage === "/"))) {
                link.classList.add("active");
            }
        });
    }

    setActiveLink(navLinks);
    setActiveLink(sidebarLinks);

    // ============================================
    // SIDEBAR LINK CLICK HANDLER
    // ============================================
    
    sidebarLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            sidebarLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");

            const href = this.getAttribute("href");
            navLinks.forEach(l => {
                l.classList.remove("active");
                if (l.getAttribute("href") === href) {
                    l.classList.add("active");
                }
            });

            setTimeout(() => {
                closeSidebar();
            }, 200);
        });
    });

    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            navLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // ============================================
    // WINDOW RESIZE HANDLER
    // ============================================
    
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 1024 && sidebar.classList.contains('active')) {
                closeSidebar();
            }
        }, 250);
    });

    console.log('Navigation script loaded successfully!');
});

// ============================================
// NEWSLETTER SUBSCRIPTION WITH EMAILJS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const newsletterBtn = document.querySelector('.newsletter-btn');
    const newsletterInput = document.querySelector('#newsletter-email');

    if (newsletterBtn && newsletterInput) {
        newsletterBtn.addEventListener('click', function() {
            const email = newsletterInput.value.trim();
            
            if (!email) {
                showMessage('Please enter your email address', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            subscribeNewsletter(email);
        });
        
        newsletterInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                newsletterBtn.click();
            }
        });
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function subscribeNewsletter(email) {
    const newsletterBtn = document.querySelector('.newsletter-btn');
    const newsletterInput = document.querySelector('#newsletter-email');
    const originalText = newsletterBtn.textContent;
    
    newsletterBtn.textContent = 'Subscribing...';
    newsletterBtn.disabled = true;
    
    // EmailJS configuration - REPLACE WITH YOUR CREDENTIALS
    const serviceID = 'tanishq_xr';
    const templateID = 'template_mpwplzf';
    
    const templateParams = {
        subscriber_email: email,
        to_email: 'thinkorixteam@gmail.com',
        message: `New newsletter subscription from: ${email}`,
        reply_to: email,
        current_date: new Date().toLocaleString()
    };
    
    emailjs.send(serviceID, templateID, templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showMessage('🎉 Thank you for subscribing! You\'ll receive updates from ThinkOrix.', 'success');
            newsletterInput.value = '';
        }, function(error) {
            console.error('FAILED...', error);
            showMessage('Oops! Something went wrong. Please try again later.', 'error');
        })
        .finally(function() {
            newsletterBtn.textContent = originalText;
            newsletterBtn.disabled = false;
        });
}

function showMessage(message, type) {
    alert(message);
    // You can replace this with a nicer toast notification if you want
}