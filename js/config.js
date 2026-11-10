// ============================================================================
// PORTFOLIO CONFIGURATION FILE — KEVIN CHRISTOPHER
// Edit this file to update your social links, GitHub integration, projects,
// skills, and blog entries without touching the core HTML or logic.
// ============================================================================

// =====================================
// KEVIN'S SOCIAL MEDIA LINKS
// =====================================
const SOCIAL_LINKS = {
    github: "https://github.com/azrlll?tab=repositories",
    linkedin: "https://www.linkedin.com/in/kevin-christopher-993200447",
    facebook: "https://www.facebook.com/itsyaboyazrl",
    instagram: "https://www.instagram.com/aazrll_ll/",
    email: "kevinreal2006@gmail.com"
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
    course: "Bachelor of Science in Information Technology",
    identity: "IT Student, Hardware Enthusiast & Web Developer",
    sidebarSubtitle: "IT STUDENT / HARDWARE ENTHUSIAST",
    primaryInterest: "Computer Hardware",
    additionalInterest: "Web Development",
    heroHeadingLine1: "Kevin Christopher",
    introduction: "I'm an IT student who enjoys working with computers, especially hardware. I also love building websites, exploring new ideas, and learning how technology works. I enjoy solving problems, trying different approaches, and turning my ideas into real projects. I'm always looking for ways to improve my skills, whether it's through hands-on experience or exploring new tools like AI.",
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
        description: "A digital invitation website I created for an 18th birthday celebration. It features a royal green and gold theme, an envelope that visitors can open on screen, and sections showing the event details, photo gallery, and schedule.",
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
        description: "The first website project I ever worked on. It's a wedding invitation with a welcome screen, falling flower animations, and pages where guests can view the schedule and event info. Special thanks to Adrian and Lawrence for helping and guiding me while building it.",
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
        description: "A clean furniture website layout where visitors can browse different types of home furniture by category. Building this helped me practice organizing page structures and making product cards look neat and readable on both phones and computers.",
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
        description: "An earlier personal portfolio that I built when I was first learning HTML and CSS. It has simple sections for my profile, skills, projects, and contact info, and served as my starting point before designing my current portfolio.",
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
        description: "A digital clock I built on a breadboard using an Arduino Uno and an RTC module. It keeps accurate time and displays the live date and time on a backlit 16x2 LCD screen.",
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
        description: "A side-scrolling obstacle jumping game running on an Arduino Uno. I wired an analog joystick and a 16x2 LCD to a breadboard, so players can jump over moving obstacles by pushing the stick.",
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
        description: "A simple circuit project using an Arduino Uno, breadboard, LEDs, and a push button. Pressing the button toggles the lights, which helped me practice digital inputs and breadboard wiring.",
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
        description: "My first time connecting an Arduino Uno to a 16x2 LCD screen. I wired the display pins on a breadboard and wrote a short C++ sketch to output 'Hello World' on the screen.",
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
        description: "An interactive Arduino project with a push button that cycles through different information screens on an LCD each time you press it, practicing state switching in code.",
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
        description: "A creative Arduino experiment where I designed custom 5x8 pixel icons—like a heart, a bell, a robot, and a music note—by defining custom binary pixel maps in code and displaying them on an LCD screen.",
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
        subtitle: "I enjoy learning about computer parts, putting PCs together, and figuring out hardware problems.",
        previewTags: [
            {
                tag: "PC Assembly",
                fullName: "PC Assembly & Component Selection",
                description: "I know how to pick compatible parts and assemble a desktop computer."
            },
            {
                tag: "Diagnostics",
                fullName: "Hardware Diagnostics & Troubleshooting",
                description: "I test and troubleshoot common issues like loose RAM, display errors, and overheating."
            },
            {
                tag: "Architecture",
                fullName: "System Architecture & Peripherals",
                description: "I study how the CPU, motherboard, RAM, and storage connect and work together."
            },
            {
                tag: "Cooling & Thermals",
                fullName: "Thermal & Performance Optimization",
                description: "I check temperatures and set up case fans to keep components running cool."
            }
        ],
        items: [
            {
                name: "PC Assembly & Component Selection",
                level: "Core Interest",
                description: "I know how to choose matching parts and assemble a desktop PC, and I'm always practicing clean cable management."
            },
            {
                name: "Hardware Diagnostics & Troubleshooting",
                level: "Hands-On",
                description: "I test hardware issues like memory faults, display output problems, and high temperatures to find what is causing the error."
            },
            {
                name: "System Architecture & Peripherals",
                level: "Learning",
                description: "I study how components like the processor, motherboard, memory, and storage communicate with each other."
            },
            {
                name: "Thermal & Performance Optimization",
                level: "Tinkering",
                description: "I monitor system temperatures, organize case fan airflow, and check basic BIOS settings to keep the computer running smoothly."
            }
        ]
    },
    {
        id: "software",
        eyebrow: "CATEGORY 02 / SOFTWARE",
        category: "Software Development & Coding",
        subtitle: "The tools and languages I use to build web pages and write code for school and personal projects.",
        previewTags: [
            {
                tag: "HTML5 & CSS3",
                fullName: "HTML5 & CSS3 Responsive Design",
                description: "I use HTML to structure my pages and CSS to style them so they look good on phones and computers."
            },
            {
                tag: "JavaScript",
                fullName: "JavaScript (ES6+)",
                description: "I use JavaScript to add interactive features, buttons, and popups to my websites."
            },
            {
                tag: "C Programming",
                fullName: "C Programming Fundamentals",
                description: "I learned programming logic in college using C, working with loops, variables, and terminal programs."
            },
            {
                tag: "AI-Assisted Coding",
                fullName: "AI-Assisted Development",
                description: "I use AI tools to help me brainstorm ideas, test layouts, and learn how to fix errors."
            },
            {
                tag: "Tech Exploration",
                fullName: "Technology & Tool Exploration",
                description: "I enjoy exploring new software tools and learning practical skills with every project."
            }
        ],
        items: [
            {
                name: "HTML5 & Semantic Markup",
                level: "Frontend",
                description: "I use HTML to build the structure of my websites with clear headings, sections, and forms."
            },
            {
                name: "CSS3 & Responsive Layout Design",
                level: "Frontend",
                description: "I use CSS to style web pages, adjust spacing, and make sure layouts look clean on phones, tablets, and desktops."
            },
            {
                name: "JavaScript (ES6+)",
                level: "Frontend",
                description: "I use JavaScript to add interactive features like popup modals, filter buttons, and game logic."
            },
            {
                name: "C Programming Fundamentals",
                level: "College Coursework",
                description: "I learned programming fundamentals in college using C, practicing loops, conditional logic, and simple terminal tools."
            },
            {
                name: "AI-Assisted Development",
                level: "Workflow",
                description: "I use AI tools to brainstorm ideas, try different layout approaches, and debug code while making sure I understand every line."
            },
            {
                name: "Technology & Tool Exploration",
                level: "Interest",
                description: "I enjoy trying out new programming tools and technologies to see how they work and how I can apply them to my projects."
            }
        ]
    },
    {
        id: "mindset",
        eyebrow: "CATEGORY 03 / MINDSET",
        category: "Core Competencies & Mindset",
        subtitle: "The habits and approach I follow when building projects, studying IT, and fixing problems.",
        previewTags: [
            {
                tag: "Problem Solving",
                fullName: "Problem Solving & Analytical Thinking",
                description: "When code breaks or a computer won't turn on, I stay patient and test parts one by one."
            },
            {
                tag: "Communication",
                fullName: "Technical Communication & Teamwork",
                description: "I like explaining technical ideas in simple, everyday words so anyone can follow along."
            },
            {
                tag: "Continuous Learning",
                fullName: "Adaptability & Continuous Learning",
                description: "Technology changes fast, so I'm always open to asking questions and learning new skills."
            }
        ],
        items: [
            {
                name: "Problem Solving & Analytical Thinking",
                level: "Mindset",
                description: "When code breaks or a computer won't boot, I stay patient and isolate issues step by step until I find the cause."
            },
            {
                name: "Technical Communication & Teamwork",
                level: "Teamwork",
                description: "I try to explain technical ideas and issues in plain English so classmates and others can easily understand."
            },
            {
                name: "Adaptability & Continuous Learning",
                level: "Growth",
                description: "I stay curious about new tools, ask questions when I'm stuck, and work on improving my skills with every project."
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
        excerpt: "A look back at when I first tried making web pages with HTML and CSS, and how working on small practice projects helped me get into web development.",
        paragraphs: [
            "When I first started trying out HTML, it was really exciting to see simple code turn into an actual page on my screen. I began by making basic layouts, trying out different headings and colors, and seeing how margins and padding worked.",
            "At first, CSS was a bit confusing. Boxes and buttons wouldn't always go where I wanted them to, and making things look right on both my laptop and phone took a lot of trial and error. But as I practiced more with Flexbox and page layouts, things slowly started making more sense.",
            "Working on small practice websites helped me realize how much I enjoy building things for the web. I still have a lot to learn, but I really like figuring things out step by step and watching my projects get better over time."
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
        excerpt: "How I use AI tools to brainstorm ideas and fix code errors, and why testing and understanding everything myself is still the most important step.",
        paragraphs: [
            "Using AI tools while studying IT has been really helpful. Whenever I want to try a new website idea or get stuck on a weird error, I can ask AI for suggestions or use it to help me figure out what went wrong.",
            "One thing I quickly learned is that you can't just copy and paste what AI gives you without checking it. Sometimes the code has extra stuff I don't need, or it doesn't work properly when I test it on my phone. If I don't understand what the code is doing, it's easy to break the website.",
            "That's why I treat AI more like a study partner or coding helper. I use it to get ideas, learn new tags or CSS tricks, and speed up testing. But I always make sure to read the code, test it myself, and understand how everything works together."
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
        excerpt: "Why I enjoy learning about physical computer parts, putting PCs together, and how understanding hardware helps me understand computers better.",
        paragraphs: [
            "Even before I started writing code, I've always loved computer hardware. Learning what each part does—like how the CPU handles tasks, how RAM holds active data, and why good cooling matters—made computers feel really interesting to me.",
            "Troubleshooting hardware problems is one of my favorite parts. If a PC won't turn on or doesn't give a display, I like checking the parts one by one—reseating the RAM, checking power cables, or inspecting the motherboard until I find the issue.",
            "Learning about hardware also helps me when I build websites. Knowing how computers use memory and processor power reminds me to keep my code clean and avoid laggy animations. To me, hardware and software go hand in hand."
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
        excerpt: "What it was like creating my portfolio website, designing the Hardware Studio theme, and learning through trial and error.",
        paragraphs: [
            "Building this portfolio has been one of my favorite projects so far. I wanted to make a website that reflects my own personality and interests—combining a clean hardware studio theme with structured sections that are easy to browse.",
            "Adding things like the 3D project gallery, the mini PC-building tools in the Playground, and the contact verification form took a lot of experimenting. I had to tweak the animations and test swipe gestures over and over so they felt smooth on mobile phones.",
            "I ran into plenty of challenges along the way, like getting layouts to align properly across screen sizes and making sure menus close smoothly. Fixing those problems taught me a lot, and this website became a great way for me to practice and learn."
        ],
        image: ""
    },
    {
        id: "what-im-learning-as-an-it-student",
        featured: false,
        title: "What I'm Learning as an IT Student",
        category: "Learning Experiences",
        date: "Academic Growth",
        readTime: "3 min read",
        excerpt: "Balancing college coursework with my own projects, learning from mistakes, and working toward becoming a better IT student.",
        paragraphs: [
            "Being an IT student is an exciting journey of learning something new every day. In college, we cover fundamentals like databases, networking, and programming logic, while my personal projects give me a chance to try those ideas out for real.",
            "One of the biggest lessons I've learned is that running into errors is just part of the process. Whether it's fixing an SQL query, debugging PHP, or getting CSS to align properly on mobile, getting stuck is usually when I end up learning the most.",
            "As I keep going with my studies, my goal is to keep practicing by building real projects, asking questions whenever I'm unsure, and staying curious about how technology works."
        ],
        image: ""
    }
];

// Backwards-compatible alias for existing references
const BLOG_DATA = JOURNAL_DATA;
