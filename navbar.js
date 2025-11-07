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
    
    // Open sidebar when hamburger is clicked
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        openSidebar();
    });

    // Close sidebar when close button is clicked
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeSidebar();
    });

    // Close sidebar when overlay is clicked
    sidebarOverlay.addEventListener('click', function() {
        closeSidebar();
    });

    // Prevent sidebar from closing when clicking inside it
    sidebar.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Close sidebar with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    // ============================================
    // ACTIVE PAGE DETECTION
    // ============================================
    
    // Get current page filename
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    // Function to set active link
    function setActiveLink(links) {
        links.forEach(link => {
            const href = link.getAttribute("href");
            
            // Remove active class from all
            link.classList.remove("active");
            
            // Add active class to matching link
            if (href === currentPage || 
                (href === "index.html" && (currentPage === "" || currentPage === "/"))) {
                link.classList.add("active");
            }
        });
    }

    // Set active links on page load
    setActiveLink(navLinks);
    setActiveLink(sidebarLinks);

    // ============================================
    // SIDEBAR LINK CLICK HANDLER
    // ============================================
    
    // Close sidebar when a link is clicked
    sidebarLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            // Update active states
            sidebarLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");

            // Sync with nav links
            const href = this.getAttribute("href");
            navLinks.forEach(l => {
                l.classList.remove("active");
                if (l.getAttribute("href") === href) {
                    l.classList.add("active");
                }
            });

            // Close sidebar after short delay for better UX
            setTimeout(() => {
                closeSidebar();
            }, 200);
        });
    });

    // ============================================
    // DESKTOP NAV LINK CLICK HANDLER (Optional)
    // ============================================
    
    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            navLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // ============================================
    // WINDOW RESIZE HANDLER
    // ============================================
    
    // Close sidebar when window is resized to desktop view
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