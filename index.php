<?php
declare(strict_types=1);

/**
 * Main Portfolio Entry Page (index.php)
 * Preserves all existing sections, projects, skills, blog notes, and
 * all 4 interactive Playground games (Build a PC, Fix the PC, Circuit Connect, Minimal Snake).
 */

$currentPage = 'index';
$pageTitle = 'Kevin Christopher | Portfolio';
$includePlaygroundScripts = true;

require_once __DIR__ . '/includes/contact-handler.php';
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
                                I'm an IT student who enjoys working with computers, especially hardware. I also love building websites, exploring new ideas, and learning how technology works. I enjoy solving problems, trying different approaches, and turning my ideas into real projects. I'm always looking for ways to improve my skills, whether it's through hands-on experience or exploring new tools like AI.
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
                    <p class="section-subtitle">A quick look at who I am, what I study in college, and what I enjoy building.</p>
                </div>

                <div class="profile-details">
                    <div class="bio-card">
                        <h3 class="card-heading">Who I Am</h3>
                        <p class="bio-paragraph">
                            Hi, I'm Kevin! I'm an IT student who enjoys working with computer hardware and building websites. I like exploring new ideas, learning about technology, and turning my ideas into real projects by working alongside AI.
                        </p>
                        <p class="bio-paragraph">
                            I prefer learning by actually doing things, whether it's working on school projects, building websites, or fixing computers. In my free time, I usually play FPS games on my laptop or phone, or spend time exploring new programming languages, AI tools, and other things related to technology.
                        </p>
                    </div>

                    <div class="info-cards-grid">
                        <div class="info-stat-card">
                            <span class="info-label">NAME</span>
                            <strong class="info-value" id="profileFullName">Kevin Christopher</strong>
                        </div>
                        <div class="info-stat-card">
                            <span class="info-label">COURSE</span>
                            <strong class="info-value" id="profileCourse">Bachelor of Science in Information Technology</strong>
                        </div>
                        <div class="info-stat-card">
                            <span class="info-label">IDENTITY</span>
                            <strong class="info-value" id="profileIdentity">IT Student, Hardware Enthusiast &amp; Web Developer</strong>
                        </div>
                        <div class="info-stat-card">
                            <span class="info-label">PRIMARY INTEREST</span>
                            <strong class="info-value" id="profilePrimaryInterest">Computer Hardware</strong>
                            <p class="info-note">Building PCs, choosing matching parts, and troubleshooting hardware issues.</p>
                        </div>
                        <div class="info-stat-card">
                            <span class="info-label">ADDITIONAL INTEREST</span>
                            <strong class="info-value" id="profileAdditionalInterest">Web Development</strong>
                            <p class="info-note">Building responsive websites, writing code, and trying out new tech tools.</p>
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
                    <p class="section-subtitle">A collection of websites I've built, Arduino circuits I've wired, and projects I've worked on.</p>
                </div>

                <!-- Cinematic 3D Coverflow Gallery -->
                <div class="coverflow-gallery" id="projectsCoverflow" role="region" aria-roledescription="carousel" aria-label="Projects 3D Coverflow Gallery" tabindex="0">
                    <div class="coverflow-controls-top">
                        <div class="coverflow-meta">
                            <span class="coverflow-label">PROJECT SPOTLIGHT</span>
                            <span class="coverflow-counter" id="coverflowCounter" aria-live="polite">01 / 10</span>
                        </div>
                        <div class="coverflow-nav-buttons" role="group" aria-label="Gallery navigation controls">
                            <button type="button" class="coverflow-btn coverflow-btn-prev" id="coverflowPrevBtn" aria-label="Previous project">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>
                            <button type="button" class="coverflow-btn coverflow-btn-next" id="coverflowNextBtn" aria-label="Next project">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- 3D Perspective Stage -->
                    <div class="coverflow-stage" id="coverflowStage">
                        <div class="coverflow-track" id="coverflowTrack">
                            <!-- Populated dynamically from PROJECTS_DATA in js/config.js -->
                        </div>
                    </div>

                    <!-- Spotlight Details Pane (Directly below centered card) -->
                    <div class="coverflow-spotlight" id="coverflowSpotlight" aria-live="polite">
                        <div class="spotlight-content" id="spotlightContent">
                            <div class="spotlight-meta-row">
                                <span class="spotlight-category" id="spotlightCategory">Category</span>
                                <span class="spotlight-badge" id="spotlightBadge" hidden>Featured</span>
                            </div>
                            <h3 class="spotlight-title" id="spotlightTitle">Project Title</h3>
                            <p class="spotlight-desc" id="spotlightDesc">Project description...</p>
                            <div class="spotlight-tags" id="spotlightTags"></div>
                            <div class="spotlight-actions" id="spotlightActions"></div>
                        </div>
                    </div>
                </div>

                <!-- Custom Invitation Website Service Banner / CTA -->
                <div class="invitation-cta-banner" id="invitationCta">
                    <div class="invitation-cta-glow" aria-hidden="true"></div>
                    <div class="invitation-cta-inner">
                        <div class="invitation-cta-top">
                            <h3 class="invitation-cta-title">
                                <span>Want Your Own Invitation Website?</span>
                                <svg class="invitation-title-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </svg>
                            </h3>
                            <p class="invitation-cta-lead">
                                Planning a birthday, wedding, debut, or any special occasion? I can help you create a personalized invitation website!
                            </p>
                        </div>

                        <div class="invitation-features-box">
                            <p class="invitation-features-desc">
                                We can include <strong>background music</strong>, <strong>animated backgrounds</strong>, <strong>interactive elements</strong>, <strong>photo galleries</strong>, <strong>RSVP forms</strong>, <strong>countdown timers</strong>, <strong>event locations with maps</strong>, <strong>dress-code guides</strong>, and <strong>other custom features</strong> to make your invitation more special, interactive, and memorable.
                            </p>
                            <div class="invitation-feature-chips" aria-label="Available invitation features">
                                <span class="invitation-chip">
                                    <svg class="chip-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M9 18V5l12-2v13"></path>
                                        <circle cx="6" cy="18" r="3"></circle>
                                        <circle cx="18" cy="16" r="3"></circle>
                                    </svg>
                                    <span>Background Music</span>
                                </span>
                                <span class="invitation-chip">
                                    <svg class="chip-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path>
                                    </svg>
                                    <span>Animated Backgrounds</span>
                                </span>
                                <span class="invitation-chip">
                                    <svg class="chip-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <line x1="6" x2="10" y1="12" y2="12"></line>
                                        <line x1="8" x2="8" y1="10" y2="14"></line>
                                        <line x1="15" x2="15.01" y1="13" y2="13"></line>
                                        <line x1="18" x2="18.01" y1="11" y2="11"></line>
                                        <rect width="20" height="12" x="2" y="6" rx="2"></rect>
                                    </svg>
                                    <span>Interactive Elements</span>
                                </span>
                                <span class="invitation-chip">
                                    <svg class="chip-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                                        <circle cx="12" cy="13" r="3"></circle>
                                    </svg>
                                    <span>Photo Galleries</span>
                                </span>
                                <span class="invitation-chip">
                                    <svg class="chip-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                        <path d="m9 14 2 2 4-4"></path>
                                        <rect x="8" y="2" width="8" height="4" rx="1"></rect>
                                    </svg>
                                    <span>RSVP Forms</span>
                                </span>
                                <span class="invitation-chip">
                                    <svg class="chip-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <line x1="10" x2="14" y1="2" y2="2"></line>
                                        <line x1="12" x2="15" y1="14" y2="11"></line>
                                        <circle cx="12" cy="14" r="8"></circle>
                                    </svg>
                                    <span>Countdown Timers</span>
                                </span>
                                <span class="invitation-chip">
                                    <svg class="chip-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <span>Event Locations &amp; Maps</span>
                                </span>
                                <span class="invitation-chip">
                                    <svg class="chip-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
                                    </svg>
                                    <span>Dress-Code Guides</span>
                                </span>
                                <span class="invitation-chip">
                                    <svg class="chip-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
                                        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
                                        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
                                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
                                    </svg>
                                    <span>Custom Layouts</span>
                                </span>
                            </div>
                        </div>

                        <div class="invitation-cta-bottom">
                            <div class="invitation-cta-text-wrap">
                                <p class="invitation-cta-interest">
                                    <strong>Interested in having me as your invitation website designer?</strong> Feel free to contact me and share your preferred layout, design ideas, or concept for your invitation. You can also send reference images, color themes, or examples of what you have in mind so we can plan how your website will look.
                                </p>
                                <p class="invitation-cta-sparkle">
                                    <span>Let's turn your ideas into something special!</span>
                                    <svg class="invitation-inline-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path>
                                    </svg>
                                </p>
                            </div>
                            <div class="invitation-cta-btn-wrap">
                                <a href="#contact" class="btn btn-primary invitation-btn">
                                    <span>Contact Me</span>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M5 12h14"></path>
                                        <path d="m12 5 7 7-7 7"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
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
                 5. DEVELOPER JOURNAL — Personal Reflections, Progress & Discoveries
            ========================================================== -->
            <section class="content-section" id="blog" aria-labelledby="blogHeading">
                <div class="section-header">
                    <span class="section-eyebrow">04 / DEVELOPER JOURNAL</span>
                    <h2 class="section-title" id="blogHeading">Developer Journal</h2>
                    <p class="section-subtitle">Personal notes and lessons I've learned while exploring PC hardware, web development, and technology.</p>
                </div>

                <!-- Category Filters -->
                <div class="journal-filter-bar" id="journalFilterBar" role="tablist" aria-label="Journal Categories">
                    <button type="button" class="journal-filter-btn is-active" data-filter="all" role="tab" aria-selected="true">
                        <span>All Entries</span>
                        <span class="journal-filter-count" id="journalCountAll">5</span>
                    </button>
                    <button type="button" class="journal-filter-btn" data-filter="Personal Experiences" role="tab" aria-selected="false">
                        <span>Personal Experiences</span>
                    </button>
                    <button type="button" class="journal-filter-btn" data-filter="Project Journey" role="tab" aria-selected="false">
                        <span>Project Journey</span>
                    </button>
                    <button type="button" class="journal-filter-btn" data-filter="Learning Experiences" role="tab" aria-selected="false">
                        <span>Learning Experiences</span>
                    </button>
                </div>

                <!-- Journal Container (Featured Entry on top + Grid of smaller entries below) -->
                <div class="journal-container" id="journalContainer">
                    <!-- Rendered dynamically from JOURNAL_DATA in js/config.js -->
                </div>
            </section>

            <!-- =========================================================
                 5. CONTACT SECTION — Two-Step Interactive Form, Real Email OTP & MySQL
            ========================================================== -->
            <section class="content-section" id="contact" aria-labelledby="contactHeading">
                <div class="section-header">
                    <span class="section-eyebrow">05 / CONTACT</span>
                    <h2 class="section-title" id="contactHeading">Get In Touch</h2>
                    <p class="section-subtitle">Have a question, want to talk about PC hardware or websites, or need an invitation website? Feel free to reach out below.</p>
                </div>

                <div class="contact-layout">
                    <!-- Direct Social & Communication Channels -->
                    <div class="contact-channels-card">
                        <h3 class="card-heading">Communication Channels</h3>
                        <p class="card-subtext">
                            You can reach me on my social accounts or send me a message directly using the form below.
                        </p>
                        <div class="contact-links-list" id="contactSocialGrid">
                            <!-- Populated from SOCIAL_LINKS in js/config.js -->
                        </div>
                    </div>

                    <!-- Two-Step PHP & MySQL Contact Card -->
                    <div class="contact-form-card">
                        <div id="contactAlertArea">
                            <?php if ($successMessage !== ''): ?>
                                <div class="php-alert php-alert-success" role="status" aria-live="polite">
                                    <strong>Message Sent</strong>
                                    <p><?= htmlspecialchars($successMessage, ENT_QUOTES, 'UTF-8') ?></p>
                                </div>
                            <?php endif; ?>

                            <?php if (!empty($errors)): ?>
                                <div class="php-alert php-alert-error" role="alert">
                                    <strong>Please check the following:</strong>
                                    <ul class="php-error-list">
                                        <?php foreach ($errors as $err): ?>
                                            <li><?= htmlspecialchars($err, ENT_QUOTES, 'UTF-8') ?></li>
                                        <?php endforeach; ?>
                                    </ul>
                                </div>
                            <?php endif; ?>
                        </div>

                        <!-- =====================================================
                             STEP 1 — ASK FOR VISITOR'S NAME
                        ====================================================== -->
                        <div class="contact-step-container" id="contactStepOne" <?= $visitorName !== '' ? 'hidden' : '' ?>>
                            <div class="contact-step-header">
                                <span class="step-indicator-pill">STEP 1 OF 2</span>
                                <h3 class="card-heading">What's Your Name?</h3>
                                <p class="card-subtext">Please enter your name below to continue to the contact form.</p>
                            </div>

                            <form action="index.php#contact" method="post" class="contact-form" id="stepOneNameForm" novalidate>
                                <input type="hidden" name="action" value="set_name">
                                <div class="form-group">
                                    <label for="visitorNameInput">Name</label>
                                    <input
                                        type="text"
                                        id="visitorNameInput"
                                        name="visitor_name"
                                        maxlength="100"
                                        value="<?= htmlspecialchars($visitorName, ENT_QUOTES, 'UTF-8') ?>"
                                        placeholder="Enter your name"
                                        required
                                    >
                                </div>

                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary" id="btnContinueStepOne">
                                        <span>CONTINUE</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- =====================================================
                             STEP 2 — PERSONALIZED WELCOME & CONTACT FORM
                        ====================================================== -->
                        <div class="contact-step-container" id="contactStepTwo" <?= $visitorName === '' ? 'hidden' : '' ?>>
                            <div class="contact-step-header">
                                <div class="step-header-row">
                                    <span class="step-indicator-pill">STEP 2 OF 2</span>
                                    <a href="index.php?reset_name=1#contact" class="step-change-name-link" id="linkChangeName">Change Name</a>
                                </div>
                                <h3 class="card-heading welcome-personalized-heading" id="welcomeVisitorHeading">
                                    Welcome <?= htmlspecialchars($visitorName !== '' ? $visitorName : 'Visitor', ENT_QUOTES, 'UTF-8') ?> to my Portfolio!
                                </h3>
                                <p class="card-subtext">
                                    Enter your email address and verify it with the 6-digit code sent to your inbox to submit your message.
                                </p>
                            </div>

                            <form action="index.php#contact" method="post" class="contact-form" id="stepTwoContactForm" novalidate>
                                <input type="hidden" name="action" value="send_message">
                                <input type="hidden" name="csrf_token" id="contactCsrfToken" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">
                                <input type="hidden" name="name" id="hiddenSenderName" value="<?= htmlspecialchars($visitorName, ENT_QUOTES, 'UTF-8') ?>">

                                <!-- Honeypot field hidden from human visitors -->
                                <div class="hp-field-wrap" aria-hidden="true">
                                    <label for="websiteUrlHp">Website</label>
                                    <input type="text" id="websiteUrlHp" name="website_url_hp" tabindex="-1" autocomplete="off">
                                </div>

                                <div class="form-group">
                                    <label for="senderNameDisplay">Sending As</label>
                                    <input
                                        type="text"
                                        id="senderNameDisplay"
                                        value="<?= htmlspecialchars($visitorName, ENT_QUOTES, 'UTF-8') ?>"
                                        readonly
                                        class="input-readonly"
                                    >
                                </div>

                                <!-- Email Input & Send OTP Button -->
                                <div class="form-group">
                                    <label for="senderEmail">Email Address</label>
                                    <div class="input-with-action">
                                        <input
                                            type="email"
                                            id="senderEmail"
                                            name="email"
                                            maxlength="100"
                                            value="<?= htmlspecialchars($emailInput, ENT_QUOTES, 'UTF-8') ?>"
                                            placeholder="your.email@example.com"
                                            required
                                            autocomplete="email"
                                        >
                                        <button
                                            type="button"
                                            id="btnSendOtp"
                                            class="btn btn-secondary btn-input-action"
                                        >
                                            <span id="btnSendOtpText">SEND CODE</span>
                                        </button>
                                    </div>
                                    <span class="field-hint" id="emailOtpHint">
                                        We will send a real 6-digit verification code to this email.
                                    </span>
                                </div>

                                <!-- OTP Verification Section (Revealed once OTP is sent) -->
                                <div class="otp-verification-panel" id="otpPanel" style="display: none;">
                                    <div class="form-group">
                                        <div class="otp-label-row">
                                            <label for="otpCodeInput">6-Digit Verification Code</label>
                                            <span class="otp-expiry-hint" id="otpExpiryHint">Expires in 5:00</span>
                                        </div>
                                        <div class="input-with-action">
                                            <input
                                                type="text"
                                                id="otpCodeInput"
                                                name="otp_code"
                                                maxlength="6"
                                                pattern="[0-9]{6}"
                                                placeholder="123456"
                                                inputmode="numeric"
                                                autocomplete="one-time-code"
                                            >
                                            <button
                                                type="button"
                                                id="btnVerifyOtp"
                                                class="btn btn-primary btn-input-action"
                                            >
                                                <span>VERIFY CODE</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Verification Status Banner -->
                                <div class="otp-status-banner" id="otpStatusBanner" style="display: none;" role="status">
                                    <div class="otp-status-icon" id="otpStatusIcon"></div>
                                    <div class="otp-status-body">
                                        <strong id="otpStatusTitle"></strong>
                                        <p id="otpStatusDesc"></p>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="senderMessage">Message</label>
                                    <textarea
                                        id="senderMessage"
                                        name="message"
                                        rows="5"
                                        maxlength="5000"
                                        placeholder="Write your message here..."
                                        required
                                    ><?= htmlspecialchars($messageInput, ENT_QUOTES, 'UTF-8') ?></textarea>
                                </div>

                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary" id="btnSubmitMessage">
                                        <span>SUBMIT MESSAGE</span>
                                    </button>
                                    <span class="form-feedback" id="submitButtonNotice">
                                        Verify your email first to enable message submission.
                                    </span>
                                </div>
                            </form>
                        </div>
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
