<?php
declare(strict_types=1);

/**
 * Main Portfolio Entry Page (index.php)
 * Preserves all existing sections, projects, skills, blog notes, and
 * all 3 interactive Playground games (Build a PC, Fix the PC, Circuit Connect).
 */

$currentPage = 'index';
$pageTitle = 'Kevin Christopher | Portfolio';
$includePlaygroundScripts = true;

require __DIR__ . '/includes/header.php';
?>

            <!-- =========================================================
                    1. HOME SECTION — Introduction & Featured Work
                ========================================================= -->
            <section class="content-section hero-section" id="home" aria-labelledby="heroHeading">
                <div class="hero-container">
                    <div class="hero-top-grid">
                        <div class="hero-text-col">
                            <h1 class="hero-title" id="heroHeading">
                                <span class="hero-line-primary" id="heroLine1">Kevin Christopher</span>
                            </h1>

                            <p class="hero-description" id="heroIntro">
                                A BSIT student with a strong interest in computer hardware and a passion for software development. I enjoy exploring how technology works, experimenting with ideas, and building functional digital projects through vibe coding.
                            </p>

                            <div class="hero-actions">
                                <a href="#projects" class="btn btn-primary">
                                    <span>VIEW PROJECTS</span>
                                </a>
                                <a href="#profile" class="btn btn-secondary">
                                    <span>ABOUT ME</span>
                                </a>
                            </div>
                        </div>

                        <div class="hero-image-col">
                            <div class="hero-avatar-frame">
                                <img src="image/profile.png" alt="Kevin Christopher" id="profileImage">
                            </div>
                        </div>
                    </div>

                    <div class="hero-divider" role="separator"></div>

                    <div class="scroll-explore">
                        <a href="#featured-work" class="scroll-explore-link">
                            <span>SCROLL TO EXPLORE</span>
                            <span class="scroll-arrow" aria-hidden="true">&darr;</span>
                        </a>
                    </div>
                </div>

                <!-- Featured Work Preview inside Home -->
                <div class="featured-preview" id="featured-work">
                    <div class="subsection-header">
                        <div>
                            <span class="section-eyebrow">FEATURED WORK</span>
                            <h2 class="subsection-title">Selected Projects</h2>
                        </div>
                        <a href="#projects" class="text-link">
                            <span>View all projects</span>
                            <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                    <div class="featured-grid" id="featuredProjectsGrid">
                        <!-- Populated dynamically from PROJECTS_DATA (featured: true) -->
                    </div>
                </div>
            </section>

            <!-- =========================================================
                    2. PROFILE SECTION — Personal Background & Interests
                ========================================================== -->
            <section class="content-section" id="profile" aria-labelledby="profileHeading">
                <div class="section-header">
                    <span class="section-eyebrow">01 / PROFILE</span>
                    <h2 class="section-title" id="profileHeading">Personal Background &amp; Interests</h2>
                    <p class="section-subtitle">Academic foundation, hardware curiosity, and approach to building software.</p>
                </div>

                <div class="profile-details">
                    <div class="bio-card">
                        <h3 class="card-heading">Who I Am</h3>
                        <p class="bio-paragraph">
                            I'm Kevin, an IT student who loves computer hardware and building software projects. I enjoy seeing how technology works, trying out new ideas, and creating cool digital projects through vibe coding.
                        </p>
                        <p class="bio-paragraph">
                            Whether I'm studying for class, designing web layouts, or fixing PC parts, I learn best by getting hands-on. When I'm away from my code editor, I'm usually tinkering with hardware or playing FPS games on my laptop and phone.
                        </p>
                    </div>

                    <div class="info-cards-grid">
                        <div class="info-stat-card">
                            <span class="info-label">NAME</span>
                            <strong class="info-value" id="profileFullName">Kevin Christopher</strong>
                        </div>
                        <div class="info-stat-card">
                            <span class="info-label">COURSE</span>
                            <strong class="info-value" id="profileCourse">Bachelor of Science in Information Technology (BSIT)</strong>
                        </div>
                        <div class="info-stat-card">
                            <span class="info-label">IDENTITY</span>
                            <strong class="info-value" id="profileIdentity">BSIT Student, Hardware Enthusiast &amp; Vibe Coder</strong>
                        </div>
                        <div class="info-stat-card">
                            <span class="info-label">PRIMARY INTEREST</span>
                            <strong class="info-value" id="profilePrimaryInterest">Computer Hardware</strong>
                            <p class="info-note">PC architecture, component diagnostics, assembly, and system performance.</p>
                        </div>
                        <div class="info-stat-card">
                            <span class="info-label">ADDITIONAL INTEREST</span>
                            <strong class="info-value" id="profileAdditionalInterest">Software Development</strong>
                            <p class="info-note">Web applications, C programming fundamentals, and modern vibe coding workflows.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- =========================================================
                 3. PROJECTS SECTION — Existing Projects
            ========================================================== -->
            <section class="content-section" id="projects" aria-labelledby="projectsHeading">
                <div class="section-header">
                    <span class="section-eyebrow">02 / PROJECTS</span>
                    <h2 class="section-title" id="projectsHeading">Projects &amp; Builds</h2>
                    <p class="section-subtitle">Websites, hardware prototypes, and interactive projects.</p>
                </div>

                <!-- Curated / Manual Projects -->
                <div class="projects-block">
                    <div class="block-label-row">
                        <h3 class="block-title">Curated Projects</h3>
                        <span class="block-count" id="manualProjectsCount">6 Projects</span>
                    </div>
                    <div class="projects-grid" id="projectsGrid">
                        <!-- Rendered from PROJECTS_DATA in js/config.js -->
                    </div>
                </div>
            </section>

            <!-- =========================================================
                 4. SKILLS SECTION — Hardware & Software Interests
            ========================================================== -->
            <section class="content-section" id="skills" aria-labelledby="skillsHeading">
                <div class="section-header">
                    <span class="section-eyebrow">03 / SKILLS</span>
                    <h2 class="section-title" id="skillsHeading">Hardware &amp; Software Interests</h2>
                    <p class="section-subtitle">Things I like working with, studying in college, and learning as I build projects.</p>
                </div>

                <div class="skills-explorer-wrapper" id="skillsContainer">
                    <!-- Interactive Skills Explorer rendered from SKILLS_DATA in js/config.js -->
                </div>
            </section>

            <!-- =========================================================
                 5. BLOG SECTION — Future Articles & Learning Experiences
            ========================================================== -->
            <section class="content-section" id="blog" aria-labelledby="blogHeading">
                <div class="section-header">
                    <span class="section-eyebrow">04 / BLOG</span>
                    <h2 class="section-title" id="blogHeading">Notes &amp; Learning Experiences</h2>
                    <p class="section-subtitle">Thoughts on computer hardware, BSIT coursework, and building projects through vibe coding.</p>
                </div>

                <div class="blog-grid" id="blogContainer">
                    <!-- Rendered from BLOG_DATA in js/config.js -->
                </div>
            </section>

            <!-- =========================================================
                 6. PLAYGROUND SECTION — Interactive Hardware Simulators
            ========================================================== -->
            <section class="content-section playground-section" id="playground" aria-labelledby="playgroundHeading">
                <!-- Playground Hub View: Select between Game 01, Game 02, and Game 03 -->
                <div class="playground-hub-view" id="playgroundHubView">
                    <div class="section-header">
                        <span class="section-eyebrow">04.5 / PLAYGROUND</span>
                        <h2 class="section-title" id="playgroundHeading">Interactive Hardware Simulators</h2>
                        <p class="section-subtitle">Hands-on virtual PC assembly, hardware troubleshooting, and electronics simulators built right into my portfolio.</p>
                    </div>

                    <div class="playground-game-cards">
                        <!-- GAME 01 — BUILD A PC -->
                        <article class="playground-game-card">
                            <span class="game-card-eyebrow">GAME 01 &mdash; BUILD A PC</span>
                            <h3 class="game-card-title">BUILD A PC</h3>
                            <span class="game-card-subtitle">Hardware Assembly Simulator</span>
                            <p class="game-card-desc">Assemble a virtual computer by placing components into their correct slots.</p>
                            <div class="game-card-meta">
                                <span class="game-meta-tag">6 Hardware Components</span>
                                <span class="game-meta-tag">3 Difficulty Modes</span>
                                <span class="game-meta-tag">Personal Best Timer</span>
                            </div>
                            <button type="button" class="btn btn-primary" id="btnPlayBuildPc">
                                <span>PLAY BUILD A PC</span>
                            </button>
                        </article>

                        <!-- GAME 02 — FIX THE PC -->
                        <article class="playground-game-card">
                            <span class="game-card-eyebrow">GAME 02 &mdash; FIX THE PC</span>
                            <h3 class="game-card-title">FIX THE PC</h3>
                            <span class="game-card-subtitle">Hardware Troubleshooting Simulator</span>
                            <p class="game-card-desc">Diagnose computer problems, perform repairs, and build your career as a virtual PC technician.</p>
                            <div class="game-card-meta">
                                <span class="game-meta-tag">12 Diagnostic Cases</span>
                                <span class="game-meta-tag">Career &amp; Free Play Modes</span>
                                <span class="game-meta-tag">XP, Ranks &amp; Achievements</span>
                            </div>
                            <button type="button" class="btn btn-primary" id="btnPlayFixPc">
                                <span>PLAY FIX THE PC</span>
                            </button>
                        </article>

                        <!-- GAME 03 — CIRCUIT CONNECT -->
                        <article class="playground-game-card">
                            <span class="game-card-eyebrow">GAME 03 &mdash; CIRCUIT CONNECT</span>
                            <h3 class="game-card-title">CIRCUIT CONNECT</h3>
                            <span class="game-card-subtitle">Electronics Puzzle Simulator</span>
                            <p class="game-card-desc">Connect the components. Complete the circuit. Power up your creation.</p>
                            <div class="game-card-meta">
                                <span class="game-meta-tag">Category: Electronics Puzzle</span>
                                <span class="game-meta-tag">Difficulty: Medium</span>
                                <span class="game-meta-tag">15 Circuit Levels</span>
                            </div>
                            <button type="button" class="btn btn-primary" id="btnPlayCircuitConnect">
                                <span>PLAY CIRCUIT CONNECT</span>
                            </button>
                        </article>

                        <!-- GAME 04 — MINIMAL SNAKE -->
                        <article class="playground-game-card">
                            <span class="game-card-eyebrow">GAME 04 &mdash; MINIMAL SNAKE</span>
                            <h3 class="game-card-title">MINIMAL SNAKE</h3>
                            <span class="game-card-subtitle">Classic Arcade Simulator</span>
                            <p class="game-card-desc">Navigate the grid, collect food, and grow your snake in a sleek monochrome arcade experience.</p>
                            <div class="game-card-meta">
                                <span class="game-meta-tag">3 Difficulty Modes</span>
                                <span class="game-meta-tag">Persistent High Scores</span>
                                <span class="game-meta-tag">Mobile &amp; Keyboard Ready</span>
                            </div>
                            <button type="button" class="btn btn-primary" id="btnPlaySnake">
                                <span>PLAY MINIMAL SNAKE</span>
                            </button>
                        </article>
                    </div>
                </div>

                <!-- GAME 01 VIEW: Build a PC — Mini Simulator (Preserved Intact) -->
                <div class="playground-game-view" id="buildPcGameView" hidden>
                    <div class="game-view-backbar">
                        <button type="button" class="pc-ctrl-btn" id="btnBackFromBuildPc">&larr; Back to Playground</button>
                    </div>

                    <div class="section-header">
                        <span class="section-eyebrow">PLAYGROUND / GAME 01</span>
                        <h2 class="section-title">BUILD A PC.</h2>
                        <p class="playground-subtitle-italic">Assemble a computer, one component at a time.</p>
                        <p class="section-subtitle">Assemble your components. Test your skills.</p>
                    </div>

                    <div class="pc-simulator-app" id="pcSimulatorApp">
                        <!-- Top Bar: Progress Tracker, Timer, Personal Best, Difficulty -->
                        <div class="pc-sim-topbar">
                            <div class="pc-sim-progress-block">
                                <div class="pc-sim-progress-header">
                                    <span class="pc-sim-progress-label" id="pcSimProgressText">COMPONENTS INSTALLED: 0 / 6</span>
                                </div>
                                <div class="pc-sim-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="6" aria-valuenow="0">
                                    <div class="pc-sim-progress-fill" id="pcSimProgressFill"></div>
                                </div>
                            </div>

                            <div class="pc-sim-metrics">
                                <div class="pc-metric-pill" aria-live="off">
                                    <span class="pc-metric-label">TIME:</span>
                                    <span class="pc-metric-val" id="pcSimTimer">00:00</span>
                                </div>

                                <div class="pc-metric-pill">
                                    <span class="pc-metric-label">BEST:</span>
                                    <span class="pc-metric-val" id="pcSimBestTime">--:--</span>
                                    <button type="button" class="pc-reset-best-btn" id="pcSimResetBestBtn" hidden aria-label="Reset personal best time">Reset</button>
                                </div>

                                <div class="pc-difficulty-group" role="group" aria-label="Simulator difficulty">
                                    <button type="button" class="pc-diff-btn active" data-difficulty="beginner" aria-pressed="true">Beginner</button>
                                    <button type="button" class="pc-diff-btn" data-difficulty="intermediate" aria-pressed="false">Intermediate</button>
                                    <button type="button" class="pc-diff-btn" data-difficulty="advanced" aria-pressed="false">Advanced</button>
                                </div>
                            </div>
                        </div>

                        <!-- Two-Column Simulator Interface -->
                        <div class="pc-sim-workspace">
                            <!-- Left Column: PC Case & Motherboard Assembly Area -->
                            <div class="pc-sim-case-panel">
                                <div class="pc-panel-title-row">
                                    <h3 class="pc-panel-heading">PC Case &amp; Motherboard Assembly</h3>
                                    <span class="pc-panel-subtag">ATX Mid-Tower</span>
                                </div>

                                <div class="pc-chassis-diagram" id="pcSimChassis" data-difficulty="beginner">
                                    <!-- Motherboard Tray (Upper Section) -->
                                    <div class="pc-motherboard-tray" aria-label="Motherboard installation area">
                                        <div class="mobo-header-strip">
                                            <span>MOTHERBOARD PCB (ATX)</span>
                                            <span>VRM / I/O</span>
                                        </div>

                                        <!-- Upper Row: CPU Socket (and Cooler Mount) + DDR5 DIMM Slots -->
                                        <div class="mobo-upper-grid">
                                            <div class="pc-drop-slot slot-cpu-zone" id="pcSlotCpu" data-slot-id="slot-cpu" role="button" tabindex="0" aria-label="CPU Socket and CPU Cooler mounting location">
                                                <!-- Hydrated by pc-simulator.js -->
                                            </div>

                                            <div class="pc-drop-slot slot-ram-zone" id="pcSlotRam" data-slot-id="slot-ram" role="button" tabindex="0" aria-label="DDR5 DIMM memory slots">
                                                <!-- Hydrated by pc-simulator.js -->
                                            </div>
                                        </div>

                                        <!-- Lower Stack: M.2 NVMe Storage Slot + PCIe x16 GPU Slot -->
                                        <div class="mobo-lower-stack">
                                            <div class="pc-drop-slot slot-ssd-zone" id="pcSlotSsd" data-slot-id="slot-ssd" role="button" tabindex="0" aria-label="M.2 NVMe SSD slot">
                                                <!-- Hydrated by pc-simulator.js -->
                                            </div>

                                            <div class="pc-drop-slot slot-gpu-zone" id="pcSlotGpu" data-slot-id="slot-gpu" role="button" tabindex="0" aria-label="PCIe x16 graphics card slot">
                                                <!-- Hydrated by pc-simulator.js -->
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Lower Case PSU Shroud Compartment -->
                                    <div class="pc-psu-compartment" aria-label="PC Case Power Supply Compartment">
                                        <div class="psu-shroud-label">
                                            <span>LOWER CASE COMPARTMENT</span>
                                            <span>PSU SHROUD</span>
                                        </div>
                                        <div class="pc-drop-slot slot-psu-zone" id="pcSlotPsu" data-slot-id="slot-psu" role="button" tabindex="0" aria-label="Power Supply Unit case compartment">
                                            <!-- Hydrated by pc-simulator.js -->
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column: Instructions, Controls, Feedback & Available Components -->
                            <div class="pc-sim-control-panel">
                                <!-- Component Inspector & Action Controls -->
                                <div class="pc-inspector-card">
                                    <div class="pc-inspector-top">
                                        <h3 class="pc-inspector-title" id="pcSimSelectedTitle">Select or Drag a Component</h3>
                                        <div class="pc-action-btns">
                                            <button type="button" class="pc-ctrl-btn" id="pcSimHintBtn">Hint</button>
                                            <button type="button" class="pc-ctrl-btn" id="pcSimRestartBtn">Restart</button>
                                        </div>
                                    </div>
                                    <p class="pc-inspector-desc" id="pcSimSelectedDesc">
                                        Click or drag any hardware component below to view its function and install it into the PC case or motherboard.
                                    </p>
                                    <p class="pc-inspector-inst" id="pcSimSelectedInst">
                                        Tip: On desktop, drag a component to its slot or click to select and click the target slot. On mobile, tap a component then tap its destination.
                                    </p>
                                </div>

                                <!-- Dismissible Contextual Hint Banner -->
                                <div class="pc-hint-banner" id="pcSimHintBanner" role="region" aria-label="Component Hint" hidden>
                                    <span id="pcSimHintText"></span>
                                    <button type="button" class="pc-hint-dismiss" id="pcSimHintDismiss">Dismiss</button>
                                </div>

                                <!-- Live Placement Status Feedback -->
                                <div class="pc-sim-feedback is-neutral" id="pcSimFeedback" role="status" aria-live="polite">
                                    [STATUS] Simulator ready. Drag a component or click to select and assemble the PC.
                                </div>

                                <!-- Available Hardware Components Tray -->
                                <div>
                                    <div class="pc-panel-title-row">
                                        <h3 class="pc-panel-heading">Available Components</h3>
                                        <span class="pc-panel-subtag">Drag or Tap to Install</span>
                                    </div>
                                    <div class="pc-components-tray" id="pcSimComponentsTray">
                                        <!-- Hydrated by pc-simulator.js -->
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Build Completion Screen -->
                        <div class="pc-completion-overlay" id="pcSimCompletionOverlay" role="region" aria-labelledby="pcSimCompleteHeading" hidden>
                            <div class="pc-completion-header">
                                <span class="pc-completion-badge" id="pcSimFinalBestNotice">Personal Best</span>
                                <h3 class="pc-completion-title" id="pcSimCompleteHeading">BUILD COMPLETE!</h3>
                                <p class="pc-completion-lead">Nice work! You've successfully assembled your virtual PC.</p>
                                <p class="pc-completion-sub">Interested in seeing what I've been building? Explore my projects.</p>
                            </div>

                            <div class="pc-completion-stats">
                                <div class="pc-stat-box">
                                    <span class="pc-stat-label">Completion Time</span>
                                    <strong class="pc-stat-val" id="pcSimFinalTime">00:00</strong>
                                </div>
                                <div class="pc-stat-box">
                                    <span class="pc-stat-label">Incorrect Attempts</span>
                                    <strong class="pc-stat-val" id="pcSimFinalErrors">0</strong>
                                </div>
                                <div class="pc-stat-box">
                                    <span class="pc-stat-label">Hints Used</span>
                                    <strong class="pc-stat-val" id="pcSimFinalHints">0</strong>
                                </div>
                            </div>

                            <div class="pc-completion-actions">
                                <button type="button" class="btn btn-primary" id="pcSimPlayAgainBtn">
                                    <span>PLAY AGAIN</span>
                                </button>
                                <a href="#projects" class="btn btn-secondary" id="pcSimViewProjectsBtn">
                                    <span>VIEW MY PROJECTS</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- GAME 02 VIEW: Fix the PC — Troubleshooting Simulator -->
                <div class="playground-game-view" id="fixPcGameView" hidden>
                    <div id="fixPcAppRoot"></div>
                </div>

                <!-- GAME 03 VIEW: Circuit Connect — Electronics Puzzle Simulator -->
                <div class="playground-game-view" id="circuitConnectGameView" hidden>
                    <div id="circuitConnectAppRoot"></div>
                </div>

                <!-- GAME 04 VIEW: Minimal Snake — Classic Arcade Simulator -->
                <div class="playground-game-view" id="snakeGameView" hidden>
                    <div class="game-view-backbar">
                        <button type="button" class="btn-snake-back" id="btnBackFromSnake">&larr; Back to Playground</button>
                    </div>

                    <div class="snake-game-wrapper">
                        <div class="snake-header">
                            <span class="snake-eyebrow">PLAYGROUND / GAME 04</span>
                            <h2 class="snake-title">MINIMAL SNAKE</h2>
                            <p class="snake-subtitle">A classic arcade experience with a modern monochrome aesthetic.</p>
                        </div>

                        <!-- Mode & Difficulty Selection Bar -->
                        <div class="snake-difficulty-bar">
                            <span class="snake-diff-label">DIFFICULTY SELECTION</span>
                            <div class="snake-diff-options" role="radiogroup" aria-label="Game Difficulty">
                                <button type="button" class="snake-diff-btn" data-diff="easy" aria-label="Easy mode: 180 milliseconds, 10 points per food">
                                    <span>Easy</span>
                                    <small>180ms &bull; 10pts</small>
                                </button>
                                <button type="button" class="snake-diff-btn active" data-diff="intermediate" aria-label="Intermediate mode: 120 milliseconds, 20 points per food">
                                    <span>Intermediate</span>
                                    <small>120ms &bull; 20pts</small>
                                </button>
                                <button type="button" class="snake-diff-btn" data-diff="hard" aria-label="Hard mode: 75 milliseconds, 30 points per food">
                                    <span>Hard</span>
                                    <small>75ms &bull; 30pts</small>
                                </button>
                            </div>
                        </div>

                        <!-- Scoreboard Card -->
                        <div class="snake-scoreboard-card">
                            <div class="snake-stat-pill">
                                <span class="stat-name">SCORE</span>
                                <strong class="stat-val" id="snakeScore">0</strong>
                            </div>
                            <div class="snake-stat-pill">
                                <span class="stat-name">BEST</span>
                                <strong class="stat-val highlight" id="snakeBest">0</strong>
                            </div>
                            <div class="snake-stat-pill">
                                <span class="stat-name">MODE</span>
                                <strong class="stat-val mode-text" id="snakeModeLabel">INTERMEDIATE</strong>
                            </div>
                        </div>

                        <!-- Game Board Canvas Container -->
                        <div class="snake-board-frame">
                            <canvas id="snakeCanvas" width="400" height="400" aria-label="Minimal Snake Game Board"></canvas>

                            <!-- Start / Ready Overlay -->
                            <div class="snake-overlay snake-overlay-start" id="snakeStartOverlay">
                                <div class="snake-overlay-card">
                                    <span class="overlay-badge">ARCADE READY</span>
                                    <h3>MINIMAL SNAKE</h3>
                                    <p>Press <strong>Start Game</strong> or any <strong>Arrow Key / WASD</strong> to begin.</p>
                                    <button type="button" class="btn btn-primary" id="btnOverlayStart">
                                        <span>START GAME</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Pause Overlay -->
                            <div class="snake-overlay" id="snakePauseOverlay" hidden>
                                <div class="snake-overlay-card">
                                    <span class="overlay-badge">PAUSED</span>
                                    <h3>GAME PAUSED</h3>
                                    <p>Take a breath. Press <strong>Resume</strong> or <strong>Space</strong> to continue.</p>
                                    <button type="button" class="btn btn-primary" id="btnOverlayResume">
                                        <span>RESUME GAME</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Game Over Overlay -->
                            <div class="snake-overlay" id="snakeGameOverOverlay" hidden>
                                <div class="snake-overlay-card">
                                    <span class="overlay-badge alert">GAME OVER</span>
                                    <h3>CRASHED!</h3>
                                    <div class="game-over-stats">
                                        <div class="go-stat">
                                            <span>FINAL SCORE</span>
                                            <strong id="goFinalScore">0</strong>
                                        </div>
                                        <div class="go-stat">
                                            <span>BEST RECORD</span>
                                            <strong id="goBestScore">0</strong>
                                        </div>
                                    </div>
                                    <div class="new-record-banner" id="goNewRecordBanner" hidden>
                                        &starf; NEW HIGH SCORE! &starf;
                                    </div>
                                    <button type="button" class="btn btn-primary" id="btnOverlayRestart">
                                        <span>PLAY AGAIN</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Action Control Buttons -->
                        <div class="snake-actions-row">
                            <button type="button" class="btn btn-secondary" id="btnSnakeActionPause" disabled>
                                <span id="btnSnakePauseText">PAUSE</span>
                            </button>
                            <button type="button" class="btn btn-secondary" id="btnSnakeActionRestart">
                                <span>RESTART</span>
                            </button>
                        </div>

                        <!-- Mobile Touch Virtual D-Pad -->
                        <div class="snake-touch-controls" id="snakeTouchControls" aria-label="Mobile Virtual D-Pad">
                            <button type="button" class="snake-dpad-btn dpad-up" id="btnDpadUp" aria-label="Move Up">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
                            </button>
                            <div class="snake-dpad-middle">
                                <button type="button" class="snake-dpad-btn dpad-left" id="btnDpadLeft" aria-label="Move Left">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </button>
                                <div class="snake-dpad-center"></div>
                                <button type="button" class="snake-dpad-btn dpad-right" id="btnDpadRight" aria-label="Move Right">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                            <button type="button" class="snake-dpad-btn dpad-down" id="btnDpadDown" aria-label="Move Down">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                        </div>

                        <!-- Keyboard Controls Help Note -->
                        <div class="snake-help-note">
                            <span class="help-key">W</span> / <span class="help-key">&uarr;</span> Up &bull;
                            <span class="help-key">A</span> / <span class="help-key">&larr;</span> Left &bull;
                            <span class="help-key">S</span> / <span class="help-key">&darr;</span> Down &bull;
                            <span class="help-key">D</span> / <span class="help-key">&rarr;</span> Right &bull;
                            <span class="help-key">Space</span> / <span class="help-key">P</span> Pause
                        </div>
                    </div>
                </div>
            </section>

            <!-- =========================================================
                 7. CONTACT SECTION — Direct Link & Two-Step Entry to contact.php
            ========================================================== -->
            <section class="content-section" id="contact" aria-labelledby="contactHeading">
                <div class="section-header">
                    <span class="section-eyebrow">05 / CONTACT</span>
                    <h2 class="section-title" id="contactHeading">Get In Touch</h2>
                    <p class="section-subtitle">Have a question, project idea, or want to talk about PC hardware and code? Reach out below.</p>
                </div>

                <div class="contact-layout">
                    <!-- Direct Social & Communication Channels -->
                    <div class="contact-channels-card">
                        <h3 class="card-heading">Communication Channels</h3>
                        <p class="card-subtext">
                            Connect with me through my social profiles or send a direct message using the interactive two-step contact page.
                        </p>
                        <div class="contact-links-list" id="contactSocialGrid">
                            <!-- Populated from SOCIAL_LINKS in js/config.js -->
                        </div>
                    </div>

                    <!-- Step 1 Entry Card Posting Directly to contact.php -->
                    <div class="contact-form-card">
                        <span class="section-eyebrow">STEP 1 OF 2</span>
                        <h3 class="card-heading">What's Your Name?</h3>
                        <p class="card-subtext">Enter your name below to unlock the personalized contact form and send me a message.</p>
                        <form action="contact.php" method="post" class="contact-form">
                            <input type="hidden" name="action" value="set_name">
                            <div class="form-group">
                                <label for="homeVisitorName">Your Name</label>
                                <input type="text" id="homeVisitorName" name="visitor_name" maxlength="100" placeholder="Enter your name..." required>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">
                                    <span>CONTINUE</span>
                                </button>
                                <a href="contact.php" class="btn btn-secondary">
                                    <span>OPEN CONTACT PAGE</span>
                                </a>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="section-footer-nav">
                    <a href="#home" class="back-to-top-link">
                        <span>BACK TO TOP</span>
                        <span aria-hidden="true">&uarr;</span>
                    </a>
                </div>
            </section>

<?php require __DIR__ . '/includes/footer.php'; ?>
