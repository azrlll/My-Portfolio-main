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

                <!-- Custom Invitation Website Service Banner / CTA -->
                <div class="invitation-cta-banner" id="invitationCta">
                    <div class="invitation-cta-glow" aria-hidden="true"></div>
                    <div class="invitation-cta-inner">
                        <div class="invitation-cta-top">
                            <span class="invitation-promo-badge">
                                <span class="invitation-badge-dot" aria-hidden="true"></span>
                                <span>PERSONALIZED DIGITAL INVITATIONS</span>
                            </span>
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
                 5. CONTACT SECTION — Two-Step Interactive Form, Real Email OTP & MySQL
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
                            Connect with me through my social profiles or send a direct message using the two-step form.
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
                                    Fill in your email address and verify it with the 6-digit code sent to your inbox to submit your message.
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

            <!-- =========================================================
                 6. PLAYGROUND SECTION — Interactive Hardware Simulators
            ========================================================== -->
            <section class="content-section playground-section" id="playground" aria-label="Playground Hardware Simulators and Games" hidden>
                <!-- GAME 01 VIEW: Build a PC — Mini Simulator (Preserved Intact) -->
                <div class="playground-game-view" id="buildPcGameView">
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

<?php require __DIR__ . '/includes/footer.php'; ?>
