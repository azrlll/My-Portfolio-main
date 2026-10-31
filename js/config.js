// ============================================================================
// PORTFOLIO CONFIGURATION FILE — KEVIN CHRISTOPHER
// Edit this file to update your social links, GitHub integration, projects,
// skills, and blog entries without touching the core HTML or logic.
// ============================================================================

// =====================================
// KEVIN'S SOCIAL MEDIA LINKS
// MANUALLY UPDATE THESE VALUES
// =====================================

// TODO: Add GitHub profile URL (e.g., "https://github.com/your-username")
// TODO: Add LinkedIn profile URL (e.g., "https://www.linkedin.com/in/your-profile")
// TODO: Add Facebook profile URL (e.g., "https://www.facebook.com/your-profile")
// TODO: Add Instagram profile URL (e.g., "https://www.instagram.com/your-handle")
// TODO: Add email address (e.g., "your.email@example.com")

const SOCIAL_LINKS = {
    github: "https://github.com/azrlll?tab=repositories",    // TODO: Add GitHub profile URL
    linkedin: "https://www.linkedin.com/in/kevin-christopher-993200447",  // TODO: Add LinkedIn profile URL
    facebook: "https://www.facebook.com/itsyaboyazrl",  // TODO: Add Facebook profile URL
    instagram: "https://www.instagram.com/aazrll_ll/", // TODO: Add Instagram profile URL
    email: "kevinreal2006@gmail.com"      // TODO: Add email address (will automatically format as mailto:)
};

// =====================================
// GITHUB INTEGRATION CONFIGURATION
// =====================================
// Set your GitHub username below to automatically fetch and display your public
// repositories in the Projects section. Leave empty ("") if you haven't set it yet.
const GITHUB_CONFIG = {
    username: "", // TODO: Add your GitHub username (e.g., "kevinchristopher")
    maxRepos: 6,
    excludeForks: true,
    // Repository names listed here (or matching manual project titles) won't be duplicated
    excludeRepos: [
        "drivesphere",
        "calculator",
        "status-checker",
        "task-repeater"
    ]
};

// =====================================
// PERSONAL INFORMATION
// =====================================
const PERSONAL_INFO = {
    name: "Kevin Christopher",
    fullName: "Kevin Christopher",
    course: "Bachelor of Science in Information Technology (BSIT)",
    identity: "IT Student, Hardware Enthusiast, and Vibe Coder",
    sidebarSubtitle: "BSIT STUDENT / VIBE CODER",
    primaryInterest: "Computer Hardware",
    additionalInterest: "Software Development",
    heroHeadingLine1: "Kevin Christopher",
    introduction: "A BSIT student with a strong interest in computer hardware and a passion for software development. I enjoy exploring how technology works, experimenting with ideas, and building functional digital projects through vibe coding.",
    profilePhoto: "image/profile.png"
};

// =====================================
// MANUAL / CURATED PROJECTS
// =====================================
// Add new projects to this array.
// - Leave `githubUrl` or `liveUrl` as "" if not available yet.
// - Set `featured: true` to display the project on the Home section as well.
const PROJECTS_DATA = [
    {
        id: "jennina-18th-birthday",
        title: "18th Birthday Invitation",
        category: "Digital Invitation Website",
        featured: true,
        description: "I made a digital invitation website for an 18th birthday celebration. It has a royal green and gold design with an invitation that visitors can open to see the event details.",
        tags: ["Digital Invitation", "Web Design", "HTML & CSS", "Responsive"],
        image: "image/project-jennina-18th-birthday.png",
        githubUrl: "",
        liveUrl: ""
    },
    {
        id: "hanz-and-jane-wedding",
        title: "Wedding Invitation",
        category: "Wedding Invitation Website",
        featured: true,
        description: "This is the first website project I worked on. It's a wedding invitation website with a welcome screen, falling flowers, and pages where guests can see the wedding details. Special thanks to Adrian and Lawrence for helping me with my first website project. I learned a lot while working with them.",
        tags: ["First Web Project", "Wedding Website", "Teamwork", "Interactive UI"],
        image: "image/project-hanz-and-jane-wedding.png",
        githubUrl: "",
        liveUrl: ""
    },
    {
        id: "halcyon-home",
        title: "Halcyon Home — Furniture Website",
        category: "Furniture Website",
        featured: false,
        description: "I worked on a furniture website where visitors can browse home furniture and explore different categories. This project helped me learn more about website design and how to organize a webpage.",
        tags: ["Furniture Website", "Web Design", "Layout Structure", "UI/UX"],
        image: "image/project-halcyon-home-furniture.png",
        githubUrl: "",
        liveUrl: ""
    },
    {
        id: "arduino-clock",
        title: "Arduino Clock",
        category: "Arduino • Hardware Prototyping",
        featured: false,
        description: "A simple Arduino project that displays the real-time date and time on a 16x2 backlit LCD screen using an Arduino Uno, a breadboard, and a Real-Time Clock (RTC) module.",
        tags: ["Arduino Uno", "16x2 LCD", "RTC Module", "Hardware Prototyping"],
        image: "image/arduino-clock.jpg",
        githubUrl: "",
        liveUrl: ""
    },
    {
        id: "arduino-joystick-game",
        title: "Arduino Game with Joystick",
        category: "Arduino • Interactive Mini-Game",
        featured: false,
        description: "A simple Arduino project featuring a playable side-scrolling obstacle-jumping game on a 16x2 LCD screen, controlled using an analog thumb joystick wired to an Arduino Uno on a breadboard.",
        tags: ["Arduino Uno", "Joystick Module", "16x2 LCD", "Embedded C++"],
        image: "image/arduino-joystick-game.jpg",
        githubUrl: "",
        liveUrl: ""
    },
    {
        id: "arduino-led-button",
        title: "Arduino LED & Push Button",
        category: "Arduino • Circuit Basics",
        featured: false,
        description: "A simple circuit using an Arduino Uno, breadboard, LEDs, and a push button. Pressing the button turns the LED lights on and off.",
        tags: ["Arduino Uno", "Breadboard", "LED Lights", "Push Button"],
        image: "image/arduino-led-button.jpg",
        githubUrl: "",
        liveUrl: ""
    },
    {
        id: "arduino-lcd-hello-world",
        title: "Arduino LCD \"Hello World\"",
        category: "Arduino • Display Output",
        featured: false,
        description: "My first test connecting an Arduino Uno to a 16x2 LCD screen. It shows basic text and displays \"Hello World\" on the blue screen.",
        tags: ["Arduino Uno", "16x2 LCD", "Jumper Wires", "Text Output"],
        image: "image/arduino-lcd-hello-world.png",
        githubUrl: "",
        liveUrl: ""
    },
    {
        id: "arduino-mode-selector",
        title: "Arduino Mode Switcher",
        category: "Arduino • Interactive Control",
        featured: false,
        description: "An interactive Arduino project with a push button and an LCD screen. Each time you press the button, it switches to a different mode on the display.",
        tags: ["Arduino Uno", "16x2 LCD", "Push Button", "State Switching"],
        image: "image/arduino-mode-selector.jpg",
        githubUrl: "",
        liveUrl: ""
    },
    {
        id: "arduino-custom-characters",
        title: "Arduino LCD Custom Characters",
        category: "Arduino • Pixel Graphics",
        featured: false,
        description: "A creative Arduino project that makes custom pixel icons on a 16x2 LCD screen, such as a heart, a bell, a robot, a music note, and a lock.",
        tags: ["Arduino Uno", "16x2 LCD", "Custom Icons", "Pixel Art"],
        image: "image/arduino-custom-characters.png",
        githubUrl: "",
        liveUrl: ""
    }
];

// =====================================
// SKILLS & INTERESTS
// =====================================
const SKILLS_DATA = [
    {
        id: "hardware",
        eyebrow: "CATEGORY 01 / HARDWARE",
        category: "Computer Hardware (Main Interest)",
        subtitle: "I enjoy learning about PC parts, building computers, and fixing hardware issues.",
        previewTags: [
            {
                tag: "PC Assembly",
                fullName: "PC Assembly & Component Selection",
                description: "I know how to choose computer parts and put them together."
            },
            {
                tag: "Diagnostics",
                fullName: "Hardware Diagnostics & Troubleshooting",
                description: "I can check simple hardware problems like loose RAM, display errors, and high heat."
            },
            {
                tag: "Architecture",
                fullName: "System Architecture & Peripherals",
                description: "I study how the CPU, motherboard, storage, and devices connect and work together."
            },
            {
                tag: "Cooling & Thermals",
                fullName: "Thermal & Performance Optimization",
                description: "I like checking system temperatures and setting up case fans so the PC stays cool."
            }
        ],
        items: [
            {
                name: "PC Assembly & Component Selection",
                level: "Core Interest",
                description: "I know how to choose matching parts and put together a desktop PC. I am still practicing cable management and finding good deals on components."
            },
            {
                name: "Hardware Diagnostics & Troubleshooting",
                level: "Hands-On",
                description: "I can check simple hardware problems like loose RAM, display errors, and high heat. I like testing each part to find what is causing the issue."
            },
            {
                name: "System Architecture & Peripherals",
                level: "Learning",
                description: "I study how the CPU, motherboard, storage, and devices talk to each other. It helps me understand how computers actually work."
            },
            {
                name: "Thermal & Performance Optimization",
                level: "Tinkering",
                description: "I like checking system temperatures, setting up case fans for good airflow, and tuning basic BIOS settings so the PC stays cool."
            }
        ]
    },
    {
        id: "software",
        eyebrow: "CATEGORY 02 / SOFTWARE",
        category: "Software Development & Coding",
        subtitle: "Languages and tools I use to write code, make web pages, and practice what I learn in class.",
        previewTags: [
            {
                tag: "HTML5 & CSS3",
                fullName: "HTML5 & CSS3 Responsive Design",
                description: "I use HTML and CSS to structure web pages and style them so they look good on phones and computers."
            },
            {
                tag: "JavaScript",
                fullName: "JavaScript (ES6+)",
                description: "I use JavaScript to add buttons, animations, and other features to websites."
            },
            {
                tag: "C Programming",
                fullName: "C Programming Fundamentals",
                description: "I learned basic programming logic in college using C, like variables, loops, and terminal programs."
            },
            {
                tag: "Vibe Coding",
                fullName: "AI-Assisted Web Development (Vibe Coding)",
                description: "I use AI tools to help me build websites, fix errors, and learn coding."
            },
            {
                tag: "AI & Tech",
                fullName: "AI and Technology",
                description: "I enjoy learning about AI and new tech tools, trying new ideas, and picking up new skills."
            }
        ],
        items: [
            {
                name: "HTML5 & Semantic Markup",
                level: "Frontend",
                description: "I use HTML to build the basic structure of websites with proper headings, sections, and forms so the page is easy to read."
            },
            {
                name: "CSS3 & Responsive Layout Design",
                level: "Frontend",
                description: "I use CSS to style web pages, adjust spacing, and make sure layouts look good on both phones and computer screens."
            },
            {
                name: "JavaScript (ES6+)",
                level: "Frontend",
                description: "I write basic JavaScript to add buttons that work, open popups, and make web pages interactive."
            },
            {
                name: "C Programming Fundamentals",
                level: "College Coursework",
                description: "I learned basic coding logic in college using C, like working with variables, loops, switch cases, and small terminal programs."
            },
            {
                name: "AI-Assisted Web Development (Vibe Coding)",
                level: "Workflow",
                description: "I use AI tools to help me build websites and create projects. I am still learning how to improve designs, fix errors, and make websites work properly."
            },
            {
                name: "AI and Technology",
                level: "Interest",
                description: "I enjoy learning about AI and new technology. I like trying different tools, exploring new ideas, and learning new skills."
            }
        ]
    },
    {
        id: "mindset",
        eyebrow: "CATEGORY 03 / MINDSET",
        category: "Core Competencies & Mindset",
        subtitle: "Good habits and ways of thinking I use when doing school projects and studying IT.",
        previewTags: [
            {
                tag: "Problem Solving",
                fullName: "Problem Solving & Algorithmic Thinking",
                description: "When my code breaks or a computer won't boot, I stay calm and test things one by one."
            },
            {
                tag: "Technical Communication",
                fullName: "Technical Communication & Teamwork",
                description: "I explain technical ideas and errors in simple words so classmates and others can understand."
            },
            {
                tag: "Continuous Learning",
                fullName: "Adaptability & Continuous Learning",
                description: "Technology keeps changing, so I like learning new tools, asking questions, and improving."
            }
        ],
        items: [
            {
                name: "Problem Solving & Algorithmic Thinking",
                level: "Mindset",
                description: "When my code breaks or a computer will not boot, I stay calm and test things one by one until I figure out the problem."
            },
            {
                name: "Technical Communication",
                level: "Teamwork",
                description: "I try to explain technical ideas and errors in simple everyday words so classmates and others can easily understand."
            },
            {
                name: "Adaptability & Continuous Learning",
                level: "Growth",
                description: "Technology keeps changing, so I like learning new tools, asking questions when I get stuck, and growing as an IT student."
            }
        ]
    }
];

// =====================================
// BLOG & LEARNING NOTES
// =====================================
const BLOG_DATA = [
    {
        id: "hardware-to-code",
        date: "Upcoming Note",
        readTime: "Learning Log",
        status: "Drafting",
        title: "Why Understanding Computer Hardware Makes Coding More Intuitive",
        excerpt: "Exploring how tinkering with physical PC components, memory, and processors connects to writing cleaner logic and appreciating how software interacts with the machine."
    },
    {
        id: "vibe-coding-workflow",
        date: "Upcoming Note",
        readTime: "Reflections",
        status: "Drafting",
        title: "Building Projects Through Vibe Coding as a BSIT Student",
        excerpt: "How combining foundational programming concepts from class with modern rapid-prototyping workflows helps turn ideas like Drivesphere into functional interfaces."
    },
    {
        id: "c-programming-foundations",
        date: "Learning Experience",
        readTime: "Academic Notes",
        status: "Published Note",
        title: "Starting with C: Control Flow, Loops, and Terminal Logic",
        excerpt: "Key takeaways from building early command-line programs in C—from switch-case calculators to conditional grading tools and loop-based multiplication generators."
    }
];
