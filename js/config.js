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
    identity: "BSIT Student, Hardware Enthusiast, and Vibe Coder",
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
        id: "arduino-clock",
        title: "Arduino Clock",
        category: "Arduino • Hardware Prototyping",
        featured: true,
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
        featured: true,
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
        category: "Computer Hardware (Primary Interest)",
        subtitle: "Hands-on exploration of PC architecture, components, and diagnostics",
        items: [
            { name: "PC Assembly & Component Selection", level: "Core Interest" },
            { name: "Hardware Diagnostics & Troubleshooting", level: "Hands-On" },
            { name: "System Architecture & Peripherals", level: "Exploration" },
            { name: "Thermal & Performance Optimization", level: "Enthusiast" }
        ]
    },
    {
        category: "Software Development & Vibe Coding",
        subtitle: "Building functional digital projects and learning core programming foundations",
        items: [
            { name: "HTML5 & Semantic Markup", level: "Frontend" },
            { name: "CSS3 & Responsive Layout Design", level: "Frontend" },
            { name: "JavaScript (ES6+)", level: "Frontend" },
            { name: "C Programming Fundamentals", level: "Academic / Core" },
            { name: "AI-Assisted Vibe Coding & Rapid Prototyping", level: "Workflow" }
        ]
    },
    {
        category: "Core Competencies & Mindset",
        subtitle: "Essential problem-solving and collaboration skills from BSIT studies",
        items: [
            { name: "Problem Solving & Algorithmic Thinking", level: "Foundation" },
            { name: "Technical Communication", level: "Collaboration" },
            { name: "Adaptability & Continuous Learning", level: "Mindset" }
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
