// Initialize EmailJS with your Public Key
(function() {
    emailjs.init({
        publicKey: "N7Qk-3SH-uMcmYv8v",
    });
})();

// Internship Details Database
const internshipDatabase = {
    "Python Internship (Advance Python)": {
        description: "Master advanced Python concepts and build real-world applications",
        topics: [
            "Basic Connecepts of Python",
            "Object-Oriented Programming (OOP)",
            "Web Scraping with BeautifulSoup & Selenium",
            "Async Programming & Multithreading",
            "Database Integration (MySQL, PostgreSQL, MongoDB)",
            "Testing & Debugging Techniques"
        ],
        benefits: [
            "Work on industry level projects",
            "Weekly code reviews & mentorship",
            "Access to premium learning resources",
            "Certificate of completion",
        ],
        requirements: [
            "Basic Python knowledge required",
            "Understanding of programming fundamentals",
            "Passion for learning and problem-solving"
        ]
    },
    "Machine Learning Internship": {
        description: "Dive deep into ML algorithms and build intelligent systems",
        topics: [
            "Supervised & Unsupervised Learning",
            "Linear & Logistic Regression",
            "Decision Trees & Random Forests",
            "Neural Networks & Deep Learning Basics",
            "Model Evaluation & Optimization",
            "Feature Engineering & Selection",
            "Scikit-learn, TensorFlow, Keras"
        ],
        benefits: [
            "Build ML projects for your portfolio",
            "Industry-relevant projects",
            "Work with real datasets",
            "Learn industry best practices",
            "Guidance from ML experts",
            "Certificate + Portfolio review",
        ],
        requirements: [
            "Python programming experience",
            "Basic statistics & mathematics knowledge",
            "Eagerness to work with data"
        ]
    },
    "Data Science Internship": {
        description: "Transform data into actionable insights and business solutions",
        topics: [
            "Data Cleaning & Preprocessing",
            "Exploratory Data Analysis (EDA)",
            "Statistical Analysis & Hypothesis Testing",
            "Data Manipulation & Analysis (Numpy,Pandas)",
            "Data Visualization (Matplotlib, Seaborn, Plotly)",
            "SQL & Database Querying",
            "Python Libraries: Pandas, NumPy, SciPy",
            "Business Intelligence & Reporting",
            "Basic Knowledge of ML",
            "Power BI"
        ],
        benefits: [
            "Analyze real business datasets",
            "Create interactive dashboards",
            "Learn data storytelling techniques",
            "Industry-relevant projects",
            "Career guidance & networking"
        ],
        requirements: [
            "Basic Python & SQL knowledge",
            "Analytical thinking skills",
            "Interest in data-driven decision making"
        ]
    },
    "Data Analyst Internship": {
        description: "Master data analysis tools and techniques for business insights",
        topics: [
            "Advanced Excel & Google Sheets",
            "SQL Queries & Database Management",
            "Power BI Visualization",
            "Statistical Analysis Techniques",
            "Python for Data Analysis (Pandas)",
            "KPI Development & Tracking",
            "Report Writing & Presentation"
        ],
        benefits: [
            "Work on business analytics projects",
            "Create professional reports & dashboards",
            "Learn from experienced analysts",
            "Able Build a strong analytics portfolio",
            "Job placement assistance"
        ],
        requirements: [
            "Basic understanding of Excel & SQL",
            "Good communication skills",
            "Attention to detail"
        ]
    },
    "Flutter Internship (Advance Flutter)": {
        description: "Build beautiful cross-platform mobile apps with Flutter",
        topics: [
            "Advanced Flutter Widgets & Layouts",
            "State Management (GetX)",
            "REST API Integration & HTTP Requests",
            "Firebase Integration (Auth, Firestore)",
            "Push Notifications & Background Services",
        ],
        benefits: [
            "Build complete mobile applications",
            "Learn industry coding standards",
            "Code review sessions",
        ],
        requirements: [
            "Basic Flutter & Dart knowledge",
            "Understanding of mobile UI/UX",
            "Problem-solving mindset"
        ]
    },
    "SQL Internship (Advance)": {
        description: "Master database design, optimization, and complex queries",
        topics: [
            "Advanced SQL Queries & Joins",
            "Stored Procedures & Functions",
            "Database Design & Normalization",
            "Query Optimization & Indexing",
            "Transactions & ACID Properties",
            "Window Functions & CTEs",
            "MySQL, PostgreSQL, SQL Server"
        ],
        benefits: [
            "Work on database projects",
            "Learn performance optimization",
            "Real-world query challenges",
            "Database certification prep",
            "Interview preparation"
        ],
        requirements: [
            "Basic SQL knowledge",
            "Logical thinking skills",
            "Interest in data management"
        ]
    }
};

// Store internship database in sessionStorage for access on details page
sessionStorage.setItem('internshipDatabase', JSON.stringify(internshipDatabase));

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing career page...');
    
    // Initialize buttons with redirect functionality
    setTimeout(initializeButtons, 300);
    
    function initializeButtons() {
        const applyButtons = document.querySelectorAll('.apply-btn');
        console.log('Found apply buttons:', applyButtons.length);
        
        applyButtons.forEach((button, index) => {
            console.log(`Setting up button ${index + 1}`);
            
            // Remove any existing event listeners by cloning
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Click handler that redirects to details page
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Button clicked!');
                handleApplyClick.call(this, e);
            }, { passive: false });
            
            // Touch handling for mobile
            let touchStartTime = 0;
            let touchStartY = 0;
            
            newButton.addEventListener('touchstart', function(e) {
                touchStartTime = Date.now();
                touchStartY = e.touches[0].clientY;
                console.log('Touch start detected');
            }, { passive: true });
            
            newButton.addEventListener('touchend', function(e) {
                const touchEndTime = Date.now();
                const touchEndY = e.changedTouches[0].clientY;
                const timeDiff = touchEndTime - touchStartTime;
                const yDiff = Math.abs(touchEndY - touchStartY);
                
                if (timeDiff < 500 && yDiff < 15) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Touch tap detected, triggering click');
                    handleApplyClick.call(this, e);
                }
            }, { passive: false });
        });
    }
    
    function handleApplyClick(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        console.log('handleApplyClick triggered!');
        
        const card = this.closest('.internship-card');
        if (!card) {
            console.error('Could not find internship card');
            return;
        }
        
        const internshipTitle = card.querySelector('h2')?.textContent;
        if (!internshipTitle) {
            console.error('Could not find internship title');
            return;
        }
        
        console.log('Selected internship:', internshipTitle);
        
        // Extract internship details from card
        const detailItems = card.querySelectorAll('.detail-item span');
        const internshipDetails = {
            title: internshipTitle,
            duration: detailItems[0]?.textContent || 'N/A',
            projectType: detailItems[1]?.textContent || 'N/A',
            location: detailItems[2]?.textContent || 'N/A',
            icon: card.querySelector('.internship-icon img')?.src || ''
        };
        
        // Store selected internship details in sessionStorage
        sessionStorage.setItem('selectedInternship', JSON.stringify(internshipDetails));
        
        // Redirect to details page
        window.location.href = 'internship_details.html';
    }
    
    console.log('Career page initialized successfully');
});