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
        id: "old-portfolio",
        title: "My Old Portfolio Website",
        category: "Web Development / Personal Project",
        featured: false,
        description: "This is my old personal portfolio website that I created when I was still learning web development. It has a simple design with sections for my profile, skills, projects, and contact information. This project helped me practice HTML and CSS and improve my website design skills.",
        tags: ["HTML", "CSS", "JavaScript"],
        technologies: ["HTML", "CSS", "JavaScript"],
        image: "image/project-old-portfolio.png",
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
// DEVELOPER JOURNAL DATA
// Edit, add, or remove entries below to update your personal journal.
// =====================================
const JOURNAL_DATA = [
    {
        id: "how-i-started-building-websites",
        featured: true,
        title: "How I Started Building Websites",
        category: "Personal Experiences",
        date: "Student Journey",
        readTime: "3 min read",
        excerpt: "A personal reflection on my earliest experiments with HTML and CSS, the excitement of making my first web page come alive, and how small coding steps sparked a lasting interest in front-end development.",
        paragraphs: [
            "When I first opened a code editor to write HTML, it felt like discovering a completely new creative medium. Seeing a few lines of nested tags transform into a real, visible page in a browser was an unforgettable moment. I started with simple layouts—testing headings, playing with colors, and figuring out how margins and paddings interacted.",
            "In the beginning, CSS was both thrilling and humbling. Elements wouldn't always align where I expected them to, and getting a page to look consistent across different screen sizes was a real puzzle. But each small breakthrough—mastering Flexbox, understanding the box model, and organizing stylesheets—built my confidence step by step.",
            "Over time, creating my first portfolio and small web experiments shifted my mindset from merely browsing the internet to thinking about how digital experiences are built, styled, and optimized. It taught me that web development isn't about knowing everything immediately; it's about staying curious, testing ideas patiently, and improving one piece at a time."
        ],
        image: ""
    },
    {
        id: "experience-using-ai-to-build-websites",
        featured: false,
        title: "My Experience Using AI to Build Websites",
        category: "Learning Experiences",
        date: "Development Reflections",
        readTime: "4 min read",
        excerpt: "Reflections on using AI coding assistants for brainstorming and debugging—and why critically reviewing, testing, and understanding every line of code remains essential.",
        paragraphs: [
            "Incorporating AI tools into my workflow has been one of the most eye-opening experiences in my journey as an IT student. When starting a new component or exploring a layout idea, AI can rapidly generate prototypes, suggest alternative CSS approaches, and help break down syntax errors that would otherwise take hours to decipher.",
            "However, the most important lesson I’ve learned is that AI is a collaborator, not an autopilot. Generated code often looks convincing on the surface but can carry hidden assumptions, redundant styles, or edge-case bugs that break in real browser environments. Blindly copying and pasting without understanding is a quick way to lose control of your own codebase.",
            "Because of this, I treat AI as a pair programmer: I use it to brainstorm possibilities, generate initial snippets, and explain unfamiliar syntax. But the responsibility to step through the code, verify its responsiveness, test it across devices, and ensure it fits my project's architecture always rests with me."
        ],
        image: ""
    },
    {
        id: "exploring-computer-hardware",
        featured: false,
        title: "Exploring Computer Hardware",
        category: "Personal Experiences",
        date: "Hands-on Tech",
        readTime: "3 min read",
        excerpt: "Why tinkering with physical PC components, memory, and cooling systems gives me a deeper appreciation for software performance and system architecture.",
        paragraphs: [
            "Long before I wrote my first line of JavaScript, I was fascinated by the physical components that power computers. Understanding how CPUs process instructions, how RAM serves as high-speed working memory, and why thermal management dictates overall system stability made computing feel grounded and real.",
            "Troubleshooting hardware issues—diagnosing why a system won't POST, checking power connections, or inspecting components—taught me methodical problem-solving. You can't just guess; you have to isolate variables step-by-step until you identify the bottleneck or failing link.",
            "That physical perspective directly influences how I write code today. Knowing how the browser engine interacts with hardware resources makes me more conscious of memory leaks, excessive DOM re-renders, and animation frame rates. Software and hardware aren't separate worlds—they are two sides of the same machine."
        ],
        image: ""
    },
    {
        id: "building-my-personal-portfolio",
        featured: false,
        title: "Building My Personal Portfolio",
        category: "Project Journey",
        date: "Project Case Note",
        readTime: "4 min read",
        excerpt: "The story behind creating this portfolio: crafting the Interstellar theme, designing an interactive 3D coverflow, and solving real-world responsive challenges.",
        paragraphs: [
            "Designing this portfolio has been my most ambitious personal project to date. I wanted it to feel like an authentic reflection of my interests: blending a futuristic, space-inspired aesthetic with practical information architecture that recruiters and visitors can navigate smoothly.",
            "Building features like the cinematic 3D Coverflow gallery, interactive PC-building playground mini-tools, and a secure contact system with real email verification pushed me far outside my comfort zone. I spent hours tuning CSS perspective values, fine-tuning easing curves, and ensuring that mobile swipe gestures felt natural without interfering with page scroll.",
            "Every iteration brought unexpected challenges—from background canvas jittering during mobile scroll to modal accessibility. Overcoming those hurdles made this portfolio more than just a showcase of past work; the website itself became my biggest learning laboratory."
        ],
        image: ""
    },
    {
        id: "what-im-learning-as-a-bsit-student",
        featured: false,
        title: "What I'm Learning as a BSIT Student",
        category: "Learning Experiences",
        date: "Academic Growth",
        readTime: "3 min read",
        excerpt: "Balancing college coursework with independent projects, embracing bugs as teachers, and cultivating the discipline needed to grow into a capable IT professional.",
        paragraphs: [
            "Being a Bachelor of Science in Information Technology (BSIT) student is an exciting journey of constant adaptation. College coursework provides essential foundations—database concepts, networking, algorithms, and systems analysis—while independent projects give me the freedom to apply those theories to tangible user experiences.",
            "One of the biggest lessons I've embraced is that encountering errors and getting stuck is not a sign of failure; it is the exact moment real learning happens. Whether it's debugging SQL queries, resolving PHP session anomalies, or refining responsive CSS breakpoints, each challenge demands patience and research.",
            "As I continue my studies, my goal is to keep bridging theory with practice: building projects that solve real problems, asking questions when I don't know the answer, and maintaining the curiosity that made me fall in love with technology in the first place."
        ],
        image: ""
    }
];

// Backwards-compatible alias for existing references
const BLOG_DATA = JOURNAL_DATA;
