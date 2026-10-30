# Kevin Christopher — Personal Portfolio

A minimalist, monochrome personal portfolio website for **Kevin Christopher** (BSIT Student, Hardware Enthusiast, and Vibe Coder).

## Project Structure

```text
My-Portfolio-main/
├── index.php                         # Main PHP portfolio page (Home, Profile, Projects, Skills, Blog, Playground)
├── contact.php                       # Two-step PHP & MySQL Contact Page ("What's Your Name?" -> "Welcome [Name] to my Portfolio!")
├── index.html                        # Preserved static HTML backup
├── circuit-connect.html              # Optional standalone route for Game 03: Circuit Connect
├── style.css                         # Minimalist monochrome stylesheet (Dark & Light modes + Admin & Contact styles)
├── admin/
│   ├── login.php                     # Secure session-based Admin Login (password_verify + rate limiting + CSRF)
│   ├── dashboard.php                 # Protected "Portfolio Admin Dashboard" displaying contact_messages
│   └── logout.php                    # Session destruction & redirect to admin/login.php
├── config/
│   ├── .htaccess                     # Denies direct public HTTP access to config/ files
│   ├── database.php                  # Reusable PDO database connection (UTF-8mb4, prepared statements)
│   ├── admin.php                     # Single-admin username & bcrypt password_hash() configuration
│   └── generate_hash.php             # CLI helper script to generate password_hash() values
├── includes/
│   ├── header.php                    # Shared HTML <head>, Mobile Header, and Left Fixed Sidebar
│   └── footer.php                    # Shared Lightbox Modal, Toast, and JS script includes
├── database/
│   └── portfolio_db.sql              # phpMyAdmin-importable SQL creating `portfolio_db` & `contact_messages`
├── css/
│   └── playground/
│       ├── pc-simulator.css          # Stylesheet for Game 01: Build a PC Mini Simulator
│       ├── fix-the-pc.css            # Stylesheet for Game 02: Fix the PC Troubleshooting Simulator
│       └── circuit-connect.css       # Stylesheet for Game 03: Circuit Connect Electronics Puzzle
├── js/
│   ├── config.js                     # Central configuration for Social Links, GitHub, Projects, Skills, and Info
│   ├── main.js                       # UI logic, theme toggle, GitHub API integration, and modals
│   └── playground/
│       ├── components.js             # Game 01: Hardware component & slot definitions
│       ├── storage.js                # Game 01: localStorage personal best time manager
│       ├── game-state.js             # Game 01: Simulator state, timer, and placement validation logic
│       ├── drag-drop.js              # Game 01: Pointer Events drag-and-drop & tap-to-install controller
│       ├── pc-simulator.js           # Game 01: Simulator UI controller & event bindings
│       ├── fix-the-pc/
│       │   ├── scenarios.js          # Game 02: All 12 troubleshooting cases across Levels 1–4
│       │   ├── diagnostics.js        # Game 02: Diagnostic tool filtering & evidence validation
│       │   ├── scoring.js            # Game 02: Score penalty engine & first-clear Career XP calculator
│       │   ├── achievements.js       # Game 02: 6 technician achievements & unlock conditions
│       │   ├── storage.js            # Game 02: localStorage save/reset manager for Career & Free Play
│       │   ├── career-mode.js        # Game 02: Technician rank progression & sequential case unlock logic
│       │   ├── hints.js              # Game 02: Contextual stage-aware hint generator
│       │   ├── game-engine.js        # Game 02: Core troubleshooting state machine, timer & safety checks
│       │   ├── ui.js                 # Game 02: Main Menu, Career Dashboard, Free Play & Workstation UI
│       │   └── main.js               # Game 02: Playground Hub switcher
│       └── circuit-connect/
│           ├── components.js         # Game 03: Electronic component catalog & schematic SVG symbols
│           ├── levels.js             # Game 03: All 15 circuit puzzle levels (Beginner, Intermediate, Advanced)
│           ├── circuit-validator.js  # Game 03: Topological graph & electrical rules validation engine
│           ├── wire-system.js        # Game 03: Interactive SVG wire rendering & resize alignment
│           ├── scoring.js            # Game 03: Score calculation & timer formatter
│           ├── achievements.js       # Game 03: 6 circuit achievements & unlock logic
│           ├── storage.js            # Game 03: Isolated localStorage save/reset manager
│           ├── game-engine.js        # Game 03: Workbench session state, undo/reset, switches & testing
│           ├── ui.js                 # Game 03: Main Menu, How to Play, Level Select, Achievements & Workbench UI
│           └── main.js               # Game 03: Playground Hub & standalone page bootstrap
├── image/
│   ├── ako.png                       # Profile portrait
│   ├── proj1.png                     # Calculator (C program screenshot)
│   ├── proj2.png                     # Status Checker (C program screenshot)
│   ├── proj3.png                     # Task Repeater (C program screenshot)
│   ├── facebook.png                  # Preserved legacy asset
│   ├── github.png                    # Preserved legacy asset
│   ├── instagram.png                 # Preserved legacy asset
│   └── playground/                   # Local SVG hardware illustrations for the simulators
│       ├── cpu.svg
│       ├── ram.svg
│       ├── gpu.svg
│       ├── ssd.svg
│       ├── cpu-cooler.svg
│       ├── psu.svg
│       ├── motherboard.svg
│       ├── pc-case.svg
│       ├── fix-the-pc/
│       │   ├── workstation.svg       # Technician monitor & desktop tower diagnostic schematic
│       │   ├── diagnostic-tools.svg  # Hardware inspection & test bench icon set
│       │   └── safety-power.svg      # ESD & AC power isolation icon
│       └── circuit-connect/
│           └── circuit-icons.svg     # Electronic schematic symbol banner
└── README.md                         # Documentation and customization instructions
```

---

## How to Customize Your Portfolio

All personal data, social media links, GitHub integration settings, projects, skills, and blog entries are stored in **`js/config.js`**. You do not need to edit `index.html` or `js/main.js` for routine updates.

### 1. Updating Social Media Links

Open `js/config.js` and locate the `SOCIAL_LINKS` block at the top of the file:

```javascript
const SOCIAL_LINKS = {
    github: "https://github.com/your-username",
    linkedin: "https://www.linkedin.com/in/your-profile",
    facebook: "https://www.facebook.com/your-profile",
    instagram: "https://www.instagram.com/your-handle",
    email: "your.email@example.com"
};
```

- When a link is empty (`""`), the button remains visible in the sidebar and contact section without using broken `#` links, showing a polite prompt to configure `js/config.js`.
- As soon as you add a URL or email address, it automatically becomes an active link.

### 2. Enabling Automatic GitHub Repository Sync

In `js/config.js`, update `GITHUB_CONFIG`:

```javascript
const GITHUB_CONFIG = {
    username: "your-github-username",
    maxRepos: 6,
    excludeForks: true,
    excludeRepos: [
        "drivesphere",
        "calculator",
        "status-checker",
        "task-repeater"
    ]
};
```

- When `username` is filled in, the portfolio fetches your latest public repositories via the GitHub REST API and prevents duplicates against your manually curated projects.

### 3. Editing Personal Information

Update the `PERSONAL_INFO` object in `js/config.js` to modify your name, course, identity, hero headings, introduction, or profile photo path (`image/ako.png`).

### 4. Adding or Updating Projects

In `js/config.js`, add or edit entries in the `PROJECTS_DATA` array:

```javascript
{
    id: "drivesphere",
    title: "Drivesphere — Vehicle Rental & Fleet Management System",
    category: "Web Application • Featured System",
    featured: true, // Set true to also display on the Home section
    description: "Project description...",
    tags: ["Fleet Management", "Web Development"],
    image: "image/your-screenshot.png", // Leave "" for clean system wireframe card
    githubUrl: "", // Optional GitHub repo link
    liveUrl: ""    // Optional live demo link
}
```

---

## Build a PC — Mini Simulator

The **Playground** section (`#playground`) features an interactive 2D **Build a PC — Mini Simulator** that runs 100% locally in the browser using HTML5, CSS3, JavaScript, and local SVG illustrations.

### How the Simulator Works

Visitors assemble a virtual desktop computer by installing 6 hardware components into their designated locations on the ATX motherboard and PC case diagram:

1. **CPU** &rarr; CPU Socket (`slot-cpu`)
2. **RAM** &rarr; DDR5 DIMM Slots (`slot-ram`)
3. **M.2 SSD** &rarr; M.2 NVMe Storage Slot (`slot-ssd`)
4. **CPU Cooler** &rarr; Mounts directly over the CPU Socket (`slot-cooler` / `slot-cpu` — requires the **CPU** to be installed first)
5. **GPU** &rarr; PCIe x16 Slot (`slot-gpu`)
6. **PSU** &rarr; Lower PC Case PSU Shroud Compartment (`slot-psu`)

Visitors can install components using:
- **Drag-and-Drop**: Click and hold (or touch and drag) a component card from the tray and drop it onto its slot.
- **Tap-to-Select & Tap-to-Install**: Click/tap a component card to select it, then click/tap the destination slot on the diagram.
- **Keyboard Navigation**: Use `Tab` to focus a component card or slot and press `Enter` or `Space`.

### Where the Game Files Are Located

- **Styles**: `css/playground/pc-simulator.css`
- **Component Definitions**: `js/playground/components.js`
- **Local High Score Storage**: `js/playground/storage.js`
- **Game State & Validation Rules**: `js/playground/game-state.js`
- **Pointer Drag-and-Drop Engine**: `js/playground/drag-drop.js`
- **Simulator UI Controller**: `js/playground/pc-simulator.js`
- **SVG Illustrations**: `image/playground/*.svg`

### How Component Placement Is Validated

Validation is handled in `PCSimState.attemptInstall(componentId, targetSlotId)` inside `js/playground/game-state.js`:
1. Verifies the component has not already been installed.
2. Checks that the target slot matches the component's `targetSlot` property (`slot-cpu` accepts `cpu` first and `cpu-cooler` once `cpu` is installed).
3. Verifies hardware prerequisites (`requires: "cpu"` on `cpu-cooler` prevents mounting the cooler before the processor is seated).
4. In **Advanced** difficulty, enforces installing core motherboard components (`cpu`, `ram`, `ssd`) before seating the full-length `gpu`.

### How to Modify Components

Open `js/playground/components.js` and edit `window.PC_SIM_COMPONENTS`. Each component object supports:
- `id`: Unique identifier (`"cpu"`, `"ram"`, etc.)
- `name`: Short display title
- `fullName`: Detailed hardware name
- `shortSpec`: Technical specification badge
- `targetSlot`: Target slot ID (`"slot-cpu"`, `"slot-ram"`, `"slot-ssd"`, `"slot-cooler"`, `"slot-gpu"`, `"slot-psu"`)
- `requires`: Optional prerequisite component ID (e.g., `"cpu"`)
- `iconPath`: Path to the SVG illustration in `image/playground/`
- `description`, `instruction`, and `hint`: Text shown in the inspector and Hint banner

### How to Adjust Game Difficulty

The simulator includes three built-in difficulty modes selectable at the top of the Playground:
- **Beginner**: Full slot labels, automatic target slot highlighting when a component is selected, and step-by-step instructions.
- **Intermediate**: Standard labels without automatic destination highlighting.
- **Advanced**: Minimal technical slot codes (`SOCKET_1`, `DIMM_A2_B2`, etc.), no automatic destination highlights, and stricter installation order rules.

You can customize difficulty behavior in `js/playground/game-state.js` (`attemptInstall`) and `js/playground/pc-simulator.js` (`renderBoardSlots` and `renderSelectedInspector`).

### How Local High Scores Are Stored

Personal best completion times are stored in the browser's `localStorage` under the key `kevin_portfolio_pc_sim_best_seconds` (managed by `js/playground/storage.js`).
- The record updates only when a visitor completes all 6 installations faster than their previous best time.
- Visitors can clear their saved time at any point using the **Reset** button next to `BEST:`.
- If `localStorage` is disabled or unavailable (e.g., strict private browsing), the simulator catches storage exceptions gracefully and continues functioning normally.

### Troubleshooting Common Problems

- **Components do not appear in the tray**: Ensure all five scripts (`components.js`, `storage.js`, `game-state.js`, `drag-drop.js`, and `pc-simulator.js`) are loaded in order at the bottom of `index.html`.
- **CPU Cooler placement is rejected**: Make sure the **CPU** is installed in the CPU Socket first; the simulator requires seating the processor before mounting the cooler.
- **SVG illustrations not loading**: Verify the `image/playground/` folder contains `cpu.svg`, `ram.svg`, `gpu.svg`, `ssd.svg`, `cpu-cooler.svg`, `psu.svg`, `motherboard.svg`, and `pc-case.svg`.

---

## Fix the PC — Troubleshooting Simulator

Alongside **Build a PC — Mini Simulator**, the **Playground** section features a second complete game: **Fix the PC — Troubleshooting Simulator** (`GAME 02 — FIX THE PC`). Visitors can launch either game independently from the Playground Hub and return at any time using the **&larr; Back to Playground** button.

### Game Modes

1. **Technician Career Mode (`START CAREER` / `CONTINUE CAREER`)**
   - Begin as a **Technician in Training** and progress through **4 Technician Ranks** across **12 structured hardware troubleshooting cases**:
     - **Level 1 — Technician in Training**: Cases 1–3
     - **Level 2 — Junior Technician**: Cases 4–6 (unlocks after completing Level 1)
     - **Level 3 — Skilled Technician**: Cases 7–9 (unlocks after completing Level 2)
     - **Level 4 — Expert Technician**: Cases 10–12 (unlocks after completing Level 3)
     - **Master PC Technician**: Awarded upon completing all 12 Career cases.
   - Includes a persistent **Career Dashboard** displaying Current Rank, Total XP, Cases Completed (`X / 12`), Career Progress Bar, Unlocked Achievements (`X / 6`), and a **Reset Career Progress** button with confirmation.

2. **Free Play Mode (`START FREE PLAY`)**
   - All 12 troubleshooting cases are unlocked immediately for practice at any difficulty (**Beginner**, **Intermediate**, or **Advanced**).
   - Free Play sessions track your score and completion time without awarding Career XP or altering Career progression.

### Core Troubleshooting Workflow

Every case follows a realistic 5-stage technician workflow inside the interactive workstation:
1. **Customer Complaint &rarr; Investigation**: Read the customer's reported symptom and run diagnostic actions to inspect cables, slots, thermals, power rails, or BIOS settings.
2. **Diagnosis**: Once key diagnostic evidence is uncovered, select the root cause from the diagnosis options.
3. **Safety Check &amp; Repair**: For internal hardware repairs, toggle the **Power Off &amp; Unplug AC** safety switch first, then execute the appropriate repair action.
4. **Verification**: Click **Power On &amp; Run System Verification** to test whether the system boots, outputs video, and passes stability checks.
5. **Completion Summary**: View the Root Cause Explanation, Repair Summary, Score Breakdown, Time Taken, XP Earned, and any newly unlocked Achievements.

### All 12 Troubleshooting Cases

| Case | Level / Rank | Title | Root Cause | Required Repair |
| :--- | :--- | :--- | :--- | :--- |
| **01** | Level 1 — Technician in Training | PC Won't Turn On | PSU Rear Master Switch OFF (`O`) | Flip the PSU Switch to ON (`I`) |
| **02** | Level 1 — Technician in Training | Monitor Shows "No Signal" | HDMI Cable Plugged Into Motherboard Instead of GPU | Connect HDMI Cable to the Dedicated GPU Port |
| **03** | Level 1 — Technician in Training | Memory Error Beeps | Unseated DDR5 RAM Module in Slot B2 | Reseat the RAM Module Firmly Until Latches Click |
| **04** | Level 2 — Junior Technician | No Bootable Device Found | Disconnected SATA Data Cable on Boot SSD | Reconnect the Loose SATA Data Cable |
| **05** | Level 2 — Junior Technician | Overheating Shutdown | Unplugged `CPU_FAN` Header &amp; Dried Thermal Paste | Clean/Reapply Thermal Paste &amp; Connect `CPU_FAN` |
| **06** | Level 2 — Junior Technician | Graphics Card Failure | Missing 8-Pin PCIe Auxiliary GPU Power Connector | Connect the 8-Pin PCIe Power Cable &amp; Reseat GPU |
| **07** | Level 3 — Skilled Technician | Random Restart Under Load | Failing / Undersized 450W Power Supply Unit (`+12V` Drop) | Replace with a 750W 80+ Gold PSU |
| **08** | Level 3 — Skilled Technician | New CPU Not Detected | Outdated Motherboard BIOS Version (`F2` vs `F14`) | Flash Motherboard BIOS Using USB BIOS Flashback |
| **09** | Level 3 — Skilled Technician | Half of Installed RAM Missing | RAM Sticks Installed in Adjacent Slots (`A1` &amp; `A2`) | Move RAM Modules to Dual-Channel Slots `A2` &amp; `B2` |
| **10** | Level 4 — Expert Technician | PC Turns On Then Immediately Off | Unplugged 8-Pin `EPS12V` CPU Power Cable | Connect the 8-Pin `EPS12V` CPU Power Connector |
| **11** | Level 4 — Expert Technician | Severe Thermal Throttling | Plastic Protective Film Left on CPU Cooler Coldplate | Remove Plastic Film, Apply Paste &amp; Remount Cooler |
| **12** | Level 4 — Expert Technician | No Display After Full Upgrade | Unseated GPU + Corrupted CMOS Training State | Clear CMOS Jumper, Reseat GPU &amp; Connect PCIe Power |

### Scoring, XP &amp; Achievements

- **Case Scoring** (`js/playground/fix-the-pc/scoring.js`):
  - Starting Score: **100 points** (minimum floor: **0 points**)
  - Unnecessary diagnostic test: **-5 points**
  - Wrong diagnosis attempt: **-10 points**
  - Wrong repair or attempting internal work with AC power live: **-10 points**
  - Using a Hint: **-5 points**
- **Career XP Rewards** (awarded on the **first completion** of each Career case to prevent replay farming):
  - First Case Completion: **+100 XP**
  - Score &ge; 90: **+50 XP**
  - No Hints Used: **+25 XP**
  - No Wrong Repairs: **+25 XP**
  - Replaying an already-completed Career case or playing in Free Play awards **0 XP** while still updating best scores and fastest times.
- **Technician Achievements** (`js/playground/fix-the-pc/achievements.js`):
  1. **First Repair**: Complete your first troubleshooting case.
  2. **Quick Thinker**: Complete any troubleshooting case in under 60 seconds.
  3. **Perfect Diagnosis**: Complete a case with a perfect 100/100 score.
  4. **No Hints Needed**: Complete 3 troubleshooting cases without using hints.
  5. **Hardware Specialist**: Complete all 9 cases across Levels 1, 2, and 3.
  6. **Troubleshooting Expert**: Complete all 12 Career Mode cases.

### How to Modify or Add Cases

Open `js/playground/fix-the-pc/scenarios.js` and edit `window.FIX_PC_SCENARIOS`. Each case object contains:
- `id`, `number`, `level`, `rankTitle`, `title`, `category`
- `customerName` and `complaint`
- `initialMonitorState` (`status`, `title`, `detail`, `powerLed`)
- `repairedMonitorState` (`status`, `title`, `detail`, `powerLed`)
- `requiresPowerOffForRepair`: Set `true` if the player must power off &amp; unplug AC before performing internal repairs
- `keyEvidenceIds`: Array of diagnostic action IDs that unlock diagnosis
- `diagnostics`: Array of diagnostic actions (`id`, `label`, `toolCategory`, `isRelevant`, `logOutput`, `evidenceText`)
- `diagnoses`: Array of root-cause choices (`id`, `label`, `isCorrect`, `feedback`)
- `repairs`: Array of repair actions (`id`, `label`, `requiresPowerOff`, `isCorrect`, `logOutput`, `verifyOutput`)
- `hints`: Stage-specific hints (`investigate`, `diagnose`, `repair`)
- `explanation` and `repairSummary`: Shown on the Case Complete screen

### How Career Progress Is Stored

Career and Free Play stats are persisted in `localStorage` under the key `kevin_portfolio_fix_the_pc_save_v1` via `js/playground/fix-the-pc/storage.js`. If `localStorage` is unavailable, the game falls back to an in-memory session store automatically.

---

## Circuit Connect — Electronics Puzzle Simulator

The third game in the **Playground** section is **Circuit Connect — Electronics Puzzle Simulator** (`GAME 03 — CIRCUIT CONNECT`), an interactive low-voltage DC circuit workbench with **15 progressive levels**.

### Core Workbench & Wiring System

- **3-Panel Workbench**:
  1. **Left Panel — Component Toolbox**: Displays the electronic components for the current level, their terminal labels, specifications, and interactive toggle controls for switches.
  2. **Center Panel — Interactive Circuit Board**: Features a 3&times;3 component grid with touch-friendly clickable terminal pins (`data-terminal-id`) and a responsive SVG wire overlay (`js/playground/circuit-connect/wire-system.js`) that stays aligned across window resizes.
  3. **Right Panel — Level Information**: Shows the puzzle objective, difficulty badge, live score, timer, active wire list (with one-click wire removal), hints remaining, and real-time circuit status.
- **How Wiring Works (Desktop & Mobile)**:
  - Click or tap a starting terminal on any component, then click or tap a destination terminal on another component to create a wire.
  - Click any existing wire on the board (or its `&times;` button in the Right Panel) to remove it, use **Undo** to revert your last wire action, or **Reset Circuit** (with confirmation) to restore the level's starting board.

### Topological Circuit Simulation Engine

Validation is handled by `CircuitConnectValidator.validateCircuit(level, wires, switchStates)` in `js/playground/circuit-connect/circuit-validator.js`:
- Groups connected terminals into equipotential electrical nets via a Union-Find (`DisjointSet`) structure and traces directed paths from `Battery (+)` to `Battery (−)`.
- Detects and reports specific electrical faults:
  - **Incomplete Circuits / Open Loops**
  - **Direct Battery Short Circuits & Component Pin Self-Shorts**
  - **Open Switches** (`SW1`, `SW_A`, `SW_B`)
  - **Reversed Polarity** on LEDs, Silicon Diodes, and Polarized Buzzers
  - **Missing or Wrong-Value Current-Limiting Resistors** for LED paths (including Ohm's Law validation in Level 11)
  - **Series vs. Parallel Branch Topology Mismatches** and **NPN Transistor Base/Collector/Emitter Switching** (Level 13)

### All 15 Levels

| Level | Difficulty | Name | Core Concept |
| :--- | :--- | :--- | :--- |
| **01** | Beginner | Light It Up | 9V Battery, 330 &Omega; Resistor, and Red LED closed loop |
| **02** | Beginner | Complete the Loop | Adding and closing an SPST Switch in series with an LED |
| **03** | Beginner | Two Lights | Dual LEDs with current-limiting resistors |
| **04** | Beginner | The Buzzer | Switched circuit with a polarized DC Piezo Buzzer |
| **05** | Beginner | Series Circuit | Strict single-loop series circuit with two lamps and 0V Ground Reference |
| **06** | Intermediate | Parallel Lighting | Two independent parallel LED + Resistor branches |
| **07** | Intermediate | Switch Control | Master switch controlling a lamp and status LED branch |
| **08** | Intermediate | Polarity Challenge | Multi-component polarity with a 1N4007 Diode, LED, and Buzzer |
| **09** | Intermediate | Circuit Repair | Removing pre-wired short/reversed faults and repairing the loop |
| **10** | Intermediate | Dual Output System | Master-switched parallel visual (LED) and audible (Buzzer) alarm branches |
| **11** | Advanced | Resistor Challenge | Selecting the 330 &Omega; resistor via Ohm's Law (`10 Ω` vs `330 Ω` vs `100 kΩ`) |
| **12** | Advanced | Diode Direction | Forward-biased silicon protection diode with Ground Reference |
| **13** | Advanced | Transistor Switch | NPN Transistor (`B`/`C`/`E`) low-side switch with `10 kΩ` base and `330 Ω` load resistors |
| **14** | Advanced | Logic Connection | Hardware Series AND Logic Gate (`Y = SW_A AND SW_B`) |
| **15** | Advanced | Master Circuit | Complete switched, diode-protected dual-output power &amp; alarm system |

### Scoring, Achievements &amp; LocalStorage Persistence

- **Scoring (`js/playground/circuit-connect/scoring.js`)**:
  - Starts at **100 points** (minimum **0**): **&minus;10** per failed circuit test, **&minus;5** per hint used, **&minus;2** per unnecessary connection.
- **Achievements (`js/playground/circuit-connect/achievements.js`)**:
  - **First Spark** (Complete Level 1), **Circuit Apprentice** (Complete 5 levels), **Wiring Specialist** (Complete 10 levels), **Circuit Master** (Complete all 15 levels), **Perfect Connection** (Finish a level with 100 points), and **Independent Thinker** (Complete 5 different levels without hints).
- **Progress Saving (`js/playground/circuit-connect/storage.js`)**:
  - Saved under the isolated key `kevin_portfolio_circuit_connect_save_v1` so it never conflicts with `Build a PC` or `Fix the PC`.

---

## PHP & MySQL Integration (Contact Form & Admin Panel)

### 1. Database Schema (`database/portfolio_db.sql`)
- **Database Name**: `portfolio_db`
- **Table Name**: `contact_messages` (the only table required by the project specification):
  - `id INT PRIMARY KEY AUTO_INCREMENT`
  - `name VARCHAR(100) NOT NULL`
  - `email VARCHAR(100) NOT NULL`
  - `message TEXT NOT NULL`
  - `date_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

### 2. Two-Step Contact Page (`contact.php`)
1. **Step 1 — Ask for Visitor's Name**:
   - Displays `"What's Your Name?"` with a required Name field and **Continue** button.
2. **Step 2 — Personalized Welcome & Message Form**:
   - Displays `"Welcome [Name] to my Portfolio!"` (escaped with `htmlspecialchars()` to prevent XSS).
   - Displays the Email and Message fields (while preserving the visitor's name from Step 1).
   - Validates all inputs and the CSRF token server-side, saves the message to MySQL using a PDO prepared statement, and uses the **Post/Redirect/Get (PRG)** pattern to display:
     `"Thank you, [Name]! Your message has been sent successfully."`

### 3. Admin Authentication & Dashboard (`admin/`)
- **Admin Login (`admin/login.php`)**:
  - Not linked in public navigation.
  - Verifies credentials against `config/admin.php` using `password_verify()` (only the bcrypt `password_hash()` is stored, never plain text), regenerates the session ID via `session_regenerate_id(true)`, and enforces basic login attempt rate limiting (5 attempts per 5-minute window).
- **Admin Dashboard (`admin/dashboard.php`)**:
  - Protected by session authentication; unauthenticated requests redirect to `admin/login.php`.
  - Displays `"Portfolio Admin Dashboard"`, total message count, search by Name or Email, pagination, and a responsive table showing **Name**, **Email**, **Message**, and **Date Sent** (newest first).
- **Logout (`admin/logout.php`)**:
  - Clears `$_SESSION`, invalidates the session cookie, destroys the session, and redirects to `admin/login.php`.

---

## Running Locally with XAMPP

1. **Copy or Link into XAMPP `htdocs`**:
   - Place the project folder inside `C:\xampp\htdocs\My-Portfolio-main` (or point Apache to your project directory).
2. **Start Apache and MySQL**:
   - Open the **XAMPP Control Panel** and start **Apache** and **MySQL**.
3. **Import the Database**:
   - Open `http://localhost/phpmyadmin` in your browser.
   - Click the **Import** tab, select `database/portfolio_db.sql`, and click **Import** (or run via CLI: `C:\xampp\mysql\bin\mysql.exe -u root < database/portfolio_db.sql`).
4. **Open the Website**:
   - Portfolio Home: `http://localhost/My-Portfolio-main/index.php`
   - Two-Step Contact Page: `http://localhost/My-Portfolio-main/contact.php`
   - Admin Login: `http://localhost/My-Portfolio-main/admin/login.php`

---

## Online Deployment Guide (PHP & MySQL Web Hosting)

Because this application uses server-side PHP 8+, sessions, and a MySQL database, deploy it to a PHP/MySQL-compatible host (such as **Hostinger**, **InfinityFree**, **000webhost/AwardSpace**, **Railway**, or **cPanel shared hosting**)—do **not** use static-only hosts like GitHub Pages.

1. **Create the Production MySQL Database**:
   - In your hosting control panel (cPanel / hPanel), create a MySQL database and database user.
   - Open **phpMyAdmin** on your host and import the table structure from `database/portfolio_db.sql`.
2. **Configure Production Database Credentials**:
   - Either set environment variables (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`) in your hosting panel, or create `config/env.local.php` on the server returning an array with your production credentials:
     ```php
     <?php
     return [
         'DB_HOST' => 'your-production-mysql-host',
         'DB_PORT' => '3306',
         'DB_NAME' => 'your_production_db_name',
         'DB_USER' => 'your_production_db_user',
         'DB_PASS' => 'your_production_db_password',
     ];
     ```
3. **Upload Files**:
   - Upload all project files to your host's `public_html` / `htdocs` directory (do **not** upload `admin_credentials.txt`).
4. **Update Admin Password After School Evaluation**:
   - The school test credentials (`admin` / `123456`) are configured for instructor grading. After evaluation, generate a new strong password hash using:
     ```bash
     php config/generate_hash.php "YourNewStrongPassword"
     ```
     and replace `ADMIN_PASSWORD_HASH` in `config/admin.php`.
