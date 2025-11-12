// Initialize EmailJS with your Public Key
(function() {
    emailjs.init({
        publicKey: "N7Qk-3SH-uMcmYv8v",
    });
})();

// Enhanced Internship Details Database with Special Programs
const internshipDatabase = {
    // Special 15 Days Programs
    "Python Internship - Intensive": {
        description: "Fast-track intensive Python program covering core concepts in 15 days",
        topics: [
            "Python Fundamentals & Syntax",
            "Data Structures (Lists, Tuples, Dictionaries)",
            "Functions & Modules",
            "File Handling & Exception Handling",
            "Basic OOP Concepts",
            "Mini Project Development"
        ],
        benefits: [
            "Intensive daily sessions",
            "Quick skill development",
            "Mini project completion",
            "Certificate of completion",
            "Perfect for beginners"
        ],
        requirements: [
            "No prior programming experience needed",
            "Dedication to intensive learning",
            "2-3 hours daily commitment"
        ]
    },
    "Data Science - Intensive": {
        description: "Accelerated introduction to Data Science fundamentals in 15 days",
        topics: [
            "Introduction to Data Science",
            "Python for Data Science",
            "NumPy & Pandas Basics",
            "Data Visualization (Matplotlib, Seaborn)",
            "Statistical Analysis Basics",
            "Simple Data Analysis Project"
        ],
        benefits: [
            "Quick introduction to field",
            "Hands-on practice daily",
            "Real dataset analysis",
            "Certificate of completion",
            "Career path guidance"
        ],
        requirements: [
            "Basic Python knowledge helpful",
            "Interest in data analysis",
            "Analytical mindset"
        ]
    },

    // Special 1 Month Programs
    "Python Internship - Foundation": {
        description: "Comprehensive foundation in Python programming over 1 month",
        topics: [
            "Complete Python Fundamentals",
            "Advanced Data Structures",
            "Object-Oriented Programming",
            "File Operations & Data Handling",
            "Working with APIs",
            "Database Basics (SQLite)",
            "Optional: Web Scraping Introduction",
            "Mini/Full Project Options"
        ],
        benefits: [
            "Structured learning path",
            "Weekly assignments & projects",
            "Mentor guidance",
            "Certificate of completion",
            "Portfolio project"
        ],
        requirements: [
            "Basic computer knowledge",
            "Commitment to regular practice",
            "1-2 hours daily study time"
        ]
    },
    "Data Science - Foundation": {
        description: "Solid foundation in Data Science concepts and tools in 1 month",
        topics: [
            "Python Programming Refresher",
            "Statistics & Probability",
            "Data Manipulation (Pandas, NumPy)",
            "Data Visualization Tools",
            "Exploratory Data Analysis",
            "Introduction to ML Concepts",
            "SQL for Data Science",
            "End-to-end Data Project"
        ],
        benefits: [
            "Comprehensive curriculum",
            "Real-world datasets",
            "Weekly mentor sessions",
            "Project-based learning",
            "Certificate + Portfolio"
        ],
        requirements: [
            "Basic Python recommended",
            "Mathematical aptitude",
            "Commitment to learning"
        ]
    },

    // Regular 6-Month Programs
    "Python Internship (Advance Python)": {
        description: "Master advanced Python concepts and build real-world applications",
        topics: [
            "Basic Concepts of Python",
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
            "Certificate of completion"
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
            "Certificate + Portfolio review"
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
            "Push Notifications & Background Services"
        ],
        benefits: [
            "Build complete mobile applications",
            "Learn industry coding standards",
            "Code review sessions"
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
        
        const internshipTitleElement = card.querySelector('h2');
        if (!internshipTitleElement) {
            console.error('Could not find internship title');
            return;
        }
        
        // Get full title including badge
        let internshipTitle = internshipTitleElement.textContent.trim();
        
        // Remove badge text if present (e.g., "15 Days" or "1 Month")
        const badge = internshipTitleElement.querySelector('.special-badge');
        if (badge) {
            internshipTitle = internshipTitle.replace(badge.textContent, '').trim();
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