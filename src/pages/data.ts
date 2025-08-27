export interface Question {
    id: number;
    question: string;
    options: string[];
    correct: number;
    skill: string;
  }
  
  export type Category = 'frontend' | 'backend' | 'mobile' | 'ux-design' | 'data-science' | 'cybersecurity';
  export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
  
  export const questionSets: Record<Category, Record<Difficulty, Question[]>> = {
    frontend: {
      beginner: [
        {
          id: 1,
          question: "What does HTML stand for?",
          options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Home Tool Markup Language",
            "Hyperlink and Text Markup Language"
          ],
          correct: 0,
          skill: "HTML Basics"
        },
        {
          id: 2,
          question: "Which HTML tag is used to create a hyperlink?",
          options: ["<link>", "<a>", "<href>", "<url>"],
          correct: 1,
          skill: "HTML Basics"
        },
        {
          id: 3,
          question: "What does CSS stand for?",
          options: [
            "Computer Style Sheets",
            "Creative Style Sheets",
            "Cascading Style Sheets",
            "Colorful Style Sheets"
          ],
          correct: 2,
          skill: "CSS Basics"
        },
        {
          id: 4,
          question: "Which property is used to change the background color in CSS?",
          options: ["color", "bgcolor", "background-color", "bg-color"],
          correct: 2,
          skill: "CSS Basics"
        },
        {
          id: 5,
          question: "What is the correct HTML element for the largest heading?",
          options: ["<h6>", "<h1>", "<heading>", "<header>"],
          correct: 1,
          skill: "HTML Basics"
        }
      ],
      intermediate: [
        {
          id: 1,
          question: "What is the purpose of the Virtual DOM in React?",
          options: [
            "To replace the real DOM entirely",
            "To improve performance by minimizing direct DOM manipulation",
            "To add styling to components",
            "To handle server-side rendering"
          ],
          correct: 1,
          skill: "React Concepts"
        },
        {
          id: 2,
          question: "Which CSS property is used to create a flexbox layout?",
          options: ["display: flex", "layout: flexbox", "flex: true", "position: flex"],
          correct: 0,
          skill: "CSS Layout"
        },
        {
          id: 3,
          question: "What is the difference between == and === in JavaScript?",
          options: [
            "No difference",
            "=== checks type and value, == only checks value",
            "== is faster than ===",
            "=== is deprecated"
          ],
          correct: 1,
          skill: "JavaScript Operators"
        },
        {
          id: 4,
          question: "What is event bubbling in JavaScript?",
          options: [
            "Creating new events",
            "Events propagating from child to parent elements",
            "Removing events from elements",
            "Events happening in parallel"
          ],
          correct: 1,
          skill: "DOM Events"
        },
        {
          id: 5,
          question: "Which hook is used to manage component state in React?",
          options: ["useEffect", "useState", "useContext", "useRef"],
          correct: 1,
          skill: "React Hooks"
        }
      ],
      advanced: [
        {
          id: 1,
          question: "What is the purpose of useMemo in React?",
          options: [
            "To memorize component props",
            "To optimize performance by memoizing expensive calculations",
            "To cache API responses",
            "To create memorable variable names"
          ],
          correct: 1,
          skill: "React Performance"
        },
        {
          id: 2,
          question: "What is a closure in JavaScript?",
          options: [
            "A function that returns another function",
            "A function that has access to variables in its outer scope",
            "A way to close browser windows",
            "A type of loop statement"
          ],
          correct: 1,
          skill: "JavaScript Advanced"
        },
        {
          id: 3,
          question: "What is the difference between server-side rendering and client-side rendering?",
          options: [
            "No difference",
            "SSR renders on server, CSR renders in browser",
            "SSR is faster, CSR is slower",
            "SSR uses JavaScript, CSR uses HTML"
          ],
          correct: 1,
          skill: "Web Architecture"
        },
        {
          id: 4,
          question: "What is the purpose of code splitting in modern web applications?",
          options: [
            "To split code into multiple files",
            "To improve performance by loading code on demand",
            "To separate HTML, CSS, and JavaScript",
            "To create multiple versions of the same app"
          ],
          correct: 1,
          skill: "Performance Optimization"
        },
        {
          id: 5,
          question: "What is the difference between microtasks and macrotasks in JavaScript?",
          options: [
            "No difference",
            "Microtasks have higher priority and execute before macrotasks",
            "Macrotasks are smaller than microtasks",
            "Microtasks are deprecated"
          ],
          correct: 1,
          skill: "JavaScript Event Loop"
        }
      ]
    },
    backend: {
      beginner: [
        {
          id: 1,
          question: "What does API stand for?",
          options: [
            "Application Programming Interface",
            "Automated Program Interface",
            "Advanced Programming Integration",
            "Application Process Integration"
          ],
          correct: 0,
          skill: "API Basics"
        },
        {
          id: 2,
          question: "Which HTTP method is used to retrieve data?",
          options: ["POST", "PUT", "GET", "DELETE"],
          correct: 2,
          skill: "HTTP Methods"
        },
        {
          id: 3,
          question: "What is a database?",
          options: [
            "A collection of files",
            "A structured collection of data",
            "A programming language",
            "A web server"
          ],
          correct: 1,
          skill: "Database Concepts"
        },
        {
          id: 4,
          question: "What does SQL stand for?",
          options: [
            "Structured Query Language",
            "Simple Query Language",
            "Server Query Language",
            "System Query Language"
          ],
          correct: 0,
          skill: "SQL Basics"
        },
        {
          id: 5,
          question: "What is the purpose of a web server?",
          options: [
            "To store files",
            "To serve web pages and handle HTTP requests",
            "To design websites",
            "To write code"
          ],
          correct: 1,
          skill: "Server Concepts"
        }
      ],
      intermediate: [
        {
          id: 1,
          question: "What is the difference between authentication and authorization?",
          options: [
            "No difference",
            "Authentication verifies identity, authorization verifies permissions",
            "Authentication is for users, authorization is for admins",
            "Authentication is optional, authorization is required"
          ],
          correct: 1,
          skill: "Security Concepts"
        },
        {
          id: 2,
          question: "What is a RESTful API?",
          options: [
            "A fast API",
            "An API that follows REST architectural principles",
            "An API for mobile apps only",
            "An outdated API style"
          ],
          correct: 1,
          skill: "API Design"
        },
        {
          id: 3,
          question: "What is database normalization?",
          options: [
            "Making databases faster",
            "Organizing data to reduce redundancy and improve integrity",
            "Converting databases to JSON",
            "Backing up database data"
          ],
          correct: 1,
          skill: "Database Design"
        },
        {
          id: 4,
          question: "What is middleware in web applications?",
          options: [
            "Code that runs between request and response",
            "A type of database",
            "A frontend framework",
            "A programming language"
          ],
          correct: 0,
          skill: "Web Architecture"
        },
        {
          id: 5,
          question: "What is the purpose of environment variables?",
          options: [
            "To store code",
            "To configure applications without changing code",
            "To improve performance",
            "To create backups"
          ],
          correct: 1,
          skill: "Configuration Management"
        }
      ],
      advanced: [
        {
          id: 1,
          question: "What is database sharding?",
          options: [
            "Deleting old data",
            "Horizontally partitioning data across multiple databases",
            "Creating database backups",
            "Encrypting database content"
          ],
          correct: 1,
          skill: "Database Scaling"
        },
        {
          id: 2,
          question: "What is the CAP theorem in distributed systems?",
          options: [
            "A programming pattern",
            "Consistency, Availability, and Partition tolerance cannot all be guaranteed simultaneously",
            "A database optimization technique",
            "A security framework"
          ],
          correct: 1,
          skill: "Distributed Systems"
        },
        {
          id: 3,
          question: "What is the difference between horizontal and vertical scaling?",
          options: [
            "No difference",
            "Horizontal adds more servers, vertical adds more power to existing servers",
            "Horizontal is cheaper than vertical",
            "Vertical is always better than horizontal"
          ],
          correct: 1,
          skill: "System Architecture"
        },
        {
          id: 4,
          question: "What is eventual consistency in distributed systems?",
          options: [
            "Data is always consistent",
            "Data will become consistent over time without immediate synchronization",
            "Data is never consistent",
            "Consistency is not important"
          ],
          correct: 1,
          skill: "Distributed Data"
        },
        {
          id: 5,
          question: "What is the purpose of a message queue?",
          options: [
            "To store messages permanently",
            "To enable asynchronous communication between services",
            "To send emails",
            "To debug applications"
          ],
          correct: 1,
          skill: "System Integration"
        }
      ]
    },
    mobile: {
      beginner: [
        {
          id: 1,
          question: "What is the difference between native and hybrid mobile apps?",
          options: [
            "No difference",
            "Native apps are built for specific platforms, hybrid apps use web technologies",
            "Native apps are slower",
            "Hybrid apps don't work on mobile"
          ],
          correct: 1,
          skill: "Mobile App Types"
        },
        {
          id: 2,
          question: "Which language is primarily used for iOS development?",
          options: ["Java", "Swift", "Python", "JavaScript"],
          correct: 1,
          skill: "iOS Development"
        },
        {
          id: 3,
          question: "What is React Native?",
          options: [
            "A web framework",
            "A framework for building mobile apps using React",
            "A database",
            "A testing tool"
          ],
          correct: 1,
          skill: "Cross-Platform Development"
        },
        {
          id: 4,
          question: "What is the Android application file format?",
          options: [".exe", ".apk", ".app", ".zip"],
          correct: 1,
          skill: "Android Basics"
        },
        {
          id: 5,
          question: "What is a mobile app store?",
          options: [
            "A physical store",
            "A platform for distributing mobile applications",
            "A development tool",
            "A type of database"
          ],
          correct: 1,
          skill: "App Distribution"
        }
      ],
      intermediate: [
        {
          id: 1,
          question: "What is the lifecycle of a React Native component?",
          options: [
            "Mount, Update, Unmount",
            "Start, Run, End",
            "Create, Modify, Delete",
            "Init, Process, Destroy"
          ],
          correct: 0,
          skill: "React Native Lifecycle"
        },
        {
          id: 2,
          question: "What is the purpose of AsyncStorage in React Native?",
          options: [
            "To make API calls",
            "To store data locally on the device",
            "To handle animations",
            "To manage navigation"
          ],
          correct: 1,
          skill: "React Native Storage"
        },
        {
          id: 3,
          question: "What is the difference between Flexbox in React Native and CSS?",
          options: [
            "No difference",
            "React Native uses flexDirection: 'column' by default",
            "React Native doesn't support Flexbox",
            "CSS Flexbox is faster"
          ],
          correct: 1,
          skill: "Mobile Layout"
        },
        {
          id: 4,
          question: "What is the purpose of navigation in mobile apps?",
          options: [
            "To style components",
            "To move between different screens/views",
            "To handle data storage",
            "To make network requests"
          ],
          correct: 1,
          skill: "Mobile Navigation"
        },
        {
          id: 5,
          question: "What is platform-specific code in mobile development?",
          options: [
            "Code that works on all platforms",
            "Code written specifically for iOS or Android",
            "Code for web platforms only",
            "Deprecated coding practices"
          ],
          correct: 1,
          skill: "Platform Development"
        }
      ],
      advanced: [
        {
          id: 1,
          question: "What is the difference between bridge and JSI in React Native?",
          options: [
            "No difference",
            "JSI allows direct communication between JavaScript and native code",
            "Bridge is faster than JSI",
            "JSI is deprecated"
          ],
          correct: 1,
          skill: "React Native Architecture"
        },
        {
          id: 2,
          question: "What is code push in mobile app development?",
          options: [
            "Pushing code to repositories",
            "Updating app code without app store deployment",
            "A debugging technique",
            "A performance optimization"
          ],
          correct: 1,
          skill: "Mobile Deployment"
        },
        {
          id: 3,
          question: "What is the purpose of native modules in React Native?",
          options: [
            "To improve performance",
            "To access platform-specific APIs not available in JavaScript",
            "To handle routing",
            "To manage state"
          ],
          correct: 1,
          skill: "Native Integration"
        },
        {
          id: 4,
          question: "What is the difference between release and debug builds in mobile apps?",
          options: [
            "No difference",
            "Release builds are optimized and signed for distribution",
            "Debug builds are faster",
            "Release builds have more features"
          ],
          correct: 1,
          skill: "Mobile Build Process"
        },
        {
          id: 5,
          question: "What is memory management in mobile applications?",
          options: [
            "Automatic garbage collection only",
            "Managing app memory usage to prevent crashes and improve performance",
            "Storing data in external memory",
            "A debugging technique"
          ],
          correct: 1,
          skill: "Mobile Performance"
        }
      ]
    },
    'ux-design': {
      beginner: [
        {
          id: 1,
          question: "What does UX stand for?",
          options: [
            "User Experience",
            "User Extension",
            "Universal Experience",
            "User Experiment"
          ],
          correct: 0,
          skill: "UX Fundamentals"
        },
        {
          id: 2,
          question: "What is the difference between UX and UI?",
          options: [
            "No difference",
            "UX focuses on user experience, UI focuses on visual interface",
            "UX is for mobile, UI is for web",
            "UI is more important than UX"
          ],
          correct: 1,
          skill: "Design Fundamentals"
        },
        {
          id: 3,
          question: "What is a wireframe in design?",
          options: [
            "A final design mockup",
            "A low-fidelity structural blueprint of a page or app",
            "A color palette",
            "A user testing method"
          ],
          correct: 1,
          skill: "Design Process"
        },
        {
          id: 4,
          question: "What is user research?",
          options: [
            "Designing for users",
            "The process of understanding user behaviors and needs",
            "Testing code functionality",
            "Creating user accounts"
          ],
          correct: 1,
          skill: "User Research"
        },
        {
          id: 5,
          question: "What is a persona in UX design?",
          options: [
            "A real user",
            "A fictional character representing a user segment",
            "A design tool",
            "A testing method"
          ],
          correct: 1,
          skill: "User Research"
        }
      ],
      intermediate: [
        {
          id: 1,
          question: "What is information architecture?",
          options: [
            "Building architecture",
            "The structural design of shared information environments",
            "Database design",
            "Server architecture"
          ],
          correct: 1,
          skill: "Information Architecture"
        },
        {
          id: 2,
          question: "What is A/B testing in UX?",
          options: [
            "Testing two versions to see which performs better",
            "Testing on mobile vs desktop",
            "Testing accessibility features",
            "Testing loading speed"
          ],
          correct: 0,
          skill: "UX Testing"
        },
        {
          id: 3,
          question: "What is the purpose of user journey mapping?",
          options: [
            "Creating navigation menus",
            "Visualizing the user's experience across touchpoints",
            "Mapping server locations",
            "Planning development sprints"
          ],
          correct: 1,
          skill: "UX Strategy"
        },
        {
          id: 4,
          question: "What is accessibility in design?",
          options: [
            "Making designs look good",
            "Ensuring products are usable by people with disabilities",
            "Making designs load faster",
            "Reducing development time"
          ],
          correct: 1,
          skill: "Accessibility"
        },
        {
          id: 5,
          question: "What is design thinking?",
          options: [
            "A creative approach to problem-solving",
            "A programming methodology",
            "A project management tool",
            "A testing framework"
          ],
          correct: 0,
          skill: "Design Methodology"
        }
      ],
      advanced: [
        {
          id: 1,
          question: "What is service design?",
          options: [
            "Designing web services",
            "The planning and organizing of people, infrastructure, and materials",
            "API design",
            "Database service optimization"
          ],
          correct: 1,
          skill: "Service Design"
        },
        {
          id: 2,
          question: "What is behavioral psychology's role in UX?",
          options: [
            "It's not relevant",
            "Understanding how users think and behave to design better experiences",
            "Only for marketing",
            "Only for therapy apps"
          ],
          correct: 1,
          skill: "UX Psychology"
        },
        {
          id: 3,
          question: "What is the difference between quantitative and qualitative research in UX?",
          options: [
            "No difference",
            "Quantitative uses numbers, qualitative uses observations and opinions",
            "Quantitative is better than qualitative",
            "Qualitative is only for surveys"
          ],
          correct: 1,
          skill: "UX Research Methods"
        },
        {
          id: 4,
          question: "What is a design system in UX?",
          options: [
            "A collection of reusable components and guidelines",
            "Software for designers",
            "A project management system",
            "A testing framework"
          ],
          correct: 0,
          skill: "Design Systems"
        },
        {
          id: 5,
          question: "What is conversion rate optimization (CRO)?",
          options: [
            "Making websites load faster",
            "Improving the percentage of users who complete desired actions",
            "Converting files to different formats",
            "Optimizing server performance"
          ],
          correct: 1,
          skill: "Conversion Optimization"
        }
      ]
    },
    'data-science': {
      beginner: [
        {
          id: 1,
          question: "What is data science?",
          options: [
            "A programming language",
            "An interdisciplinary field that uses methods to extract knowledge from data",
            "A database management system",
            "A web development framework"
          ],
          correct: 1,
          skill: "Data Science Fundamentals"
        },
        {
          id: 2,
          question: "Which programming language is most commonly used in data science?",
          options: [
            "JavaScript",
            "Python",
            "HTML",
            "CSS"
          ],
          correct: 1,
          skill: "Programming for Data Science"
        },
        {
          id: 3,
          question: "What is a dataset?",
          options: [
            "A collection of data",
            "A programming function",
            "A visualization tool",
            "A machine learning model"
          ],
          correct: 0,
          skill: "Data Fundamentals"
        },
        {
          id: 4,
          question: "What does CSV stand for?",
          options: [
            "Computer System Values",
            "Comma Separated Values",
            "Central Server Variables",
            "Code Structure Validation"
          ],
          correct: 1,
          skill: "Data Formats"
        },
        {
          id: 5,
          question: "What is data visualization?",
          options: [
            "Writing code",
            "The graphical representation of data",
            "Data storage",
            "Data collection"
          ],
          correct: 1,
          skill: "Data Visualization"
        }
      ],
      intermediate: [
        {
          id: 1,
          question: "What is machine learning?",
          options: [
            "Learning to use machines",
            "A method that allows computers to learn from data without explicit programming",
            "Hardware optimization",
            "Software installation"
          ],
          correct: 1,
          skill: "Machine Learning Basics"
        },
        {
          id: 2,
          question: "What is the difference between supervised and unsupervised learning?",
          options: [
            "No difference",
            "Supervised uses labeled data, unsupervised finds patterns in unlabeled data",
            "Supervised is faster",
            "Unsupervised is more accurate"
          ],
          correct: 1,
          skill: "ML Algorithms"
        },
        {
          id: 3,
          question: "What is data cleaning?",
          options: [
            "Deleting all data",
            "The process of preparing data for analysis by removing errors",
            "Organizing files",
            "Backing up data"
          ],
          correct: 1,
          skill: "Data Preprocessing"
        },
        {
          id: 4,
          question: "What is correlation in statistics?",
          options: [
            "Causation between variables",
            "A measure of the linear relationship between two variables",
            "A type of chart",
            "A programming function"
          ],
          correct: 1,
          skill: "Statistics"
        },
        {
          id: 5,
          question: "What is a hypothesis in data science?",
          options: [
            "A final conclusion",
            "A testable statement or prediction about data",
            "A type of visualization",
            "A machine learning model"
          ],
          correct: 1,
          skill: "Statistical Analysis"
        }
      ],
      advanced: [
        {
          id: 1,
          question: "What is deep learning?",
          options: [
            "Learning deeply about a subject",
            "A subset of ML using neural networks with multiple layers",
            "Advanced statistics",
            "Complex data visualization"
          ],
          correct: 1,
          skill: "Deep Learning"
        },
        {
          id: 2,
          question: "What is feature engineering?",
          options: [
            "Building software features",
            "The process of selecting and transforming variables for ML models",
            "Hardware optimization",
            "Database design"
          ],
          correct: 1,
          skill: "Feature Engineering"
        },
        {
          id: 3,
          question: "What is cross-validation in machine learning?",
          options: [
            "Validating data twice",
            "A technique to assess model performance on unseen data",
            "Comparing two models",
            "Checking data accuracy"
          ],
          correct: 1,
          skill: "Model Validation"
        },
        {
          id: 4,
          question: "What is overfitting in machine learning?",
          options: [
            "Using too much data",
            "When a model learns training data too well and fails on new data",
            "Training for too long",
            "Using too many features"
          ],
          correct: 1,
          skill: "ML Concepts"
        },
        {
          id: 5,
          question: "What is ensemble learning?",
          options: [
            "Learning in groups",
            "Combining multiple models to improve performance",
            "Using large datasets",
            "Parallel processing"
          ],
          correct: 1,
          skill: "Advanced ML"
        }
      ]
    },
    cybersecurity: {
      beginner: [
        {
          id: 1,
          question: "What is cybersecurity?",
          options: [
            "Building secure buildings",
            "Protecting digital systems from threats",
            "Internet speed optimization",
            "Computer hardware repair"
          ],
          correct: 1,
          skill: "Security Fundamentals"
        },
        {
          id: 2,
          question: "What is a password?",
          options: [
            "A type of software",
            "A secret word or phrase used for authentication",
            "A security protocol",
            "A network connection"
          ],
          correct: 1,
          skill: "Authentication"
        },
        {
          id: 3,
          question: "What is malware?",
          options: [
            "Broken hardware",
            "Malicious software designed to harm systems",
            "Slow internet",
            "Old software"
          ],
          correct: 1,
          skill: "Threat Awareness"
        },
        {
          id: 4,
          question: "What is phishing?",
          options: [
            "A type of fishing",
            "Attempting to obtain sensitive information through deceptive emails",
            "Network troubleshooting",
            "Password recovery"
          ],
          correct: 1,
          skill: "Social Engineering"
        },
        {
          id: 5,
          question: "What is two-factor authentication?",
          options: [
            "Using two passwords",
            "An extra layer of security requiring two forms of identification",
            "Logging in twice",
            "Having two user accounts"
          ],
          correct: 1,
          skill: "Authentication"
        }
      ],
      intermediate: [
        {
          id: 1,
          question: "What is encryption?",
          options: [
            "Hiding files",
            "Converting data into a coded format to prevent unauthorized access",
            "Compressing data",
            "Backing up data"
          ],
          correct: 1,
          skill: "Cryptography"
        },
        {
          id: 2,
          question: "What is a firewall?",
          options: [
            "A physical wall",
            "A security system that monitors network traffic",
            "Antivirus software",
            "A backup system"
          ],
          correct: 1,
          skill: "Network Security"
        },
        {
          id: 3,
          question: "What is SQL injection?",
          options: [
            "Adding SQL to databases",
            "A code injection technique that exploits database vulnerabilities",
            "A database optimization method",
            "A way to speed up queries"
          ],
          correct: 1,
          skill: "Web Security"
        },
        {
          id: 4,
          question: "What is the principle of least privilege?",
          options: [
            "Having minimal software",
            "Giving users only the minimum access necessary for their role",
            "Using simple passwords",
            "Having few user accounts"
          ],
          correct: 1,
          skill: "Access Control"
        },
        {
          id: 5,
          question: "What is a security audit?",
          options: [
            "Counting security devices",
            "A systematic evaluation of security measures and vulnerabilities",
            "Installing security software",
            "Training employees"
          ],
          correct: 1,
          skill: "Security Assessment"
        }
      ],
      advanced: [
        {
          id: 1,
          question: "What is penetration testing?",
          options: [
            "Testing network speed",
            "Simulating cyberattacks to identify vulnerabilities",
            "Installing security patches",
            "Training security staff"
          ],
          correct: 1,
          skill: "Security Testing"
        },
        {
          id: 2,
          question: "What is zero-day vulnerability?",
          options: [
            "A vulnerability that takes zero days to fix",
            "A security flaw unknown to security vendors",
            "A vulnerability discovered on day zero",
            "A harmless security issue"
          ],
          correct: 1,
          skill: "Vulnerability Management"
        },
        {
          id: 3,
          question: "What is threat modeling?",
          options: [
            "Creating 3D models of threats",
            "Systematically identifying and evaluating potential security threats",
            "Modeling network architecture",
            "Designing security logos"
          ],
          correct: 1,
          skill: "Risk Assessment"
        },
        {
          id: 4,
          question: "What is behavioral analysis in cybersecurity?",
          options: [
            "Analyzing user behavior for psychological profiling",
            "Monitoring system behavior to detect anomalies and threats",
            "Studying criminal behavior",
            "Analyzing code behavior"
          ],
          correct: 1,
          skill: "Threat Detection"
        },
        {
          id: 5,
          question: "What is incident response?",
          options: [
            "Responding to customer complaints",
            "The organized approach to addressing security breaches",
            "Emergency building evacuation",
            "Technical support procedures"
          ],
          correct: 1,
          skill: "Incident Management"
        }
      ]
    }
  };