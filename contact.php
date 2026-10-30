<?php
declare(strict_types=1);

/**
 * Contact Page (contact.php) — Two-Step Interactive Form & MySQL Persistence
 * Step 1: "What's Your Name?" -> Validates visitor name
 * Step 2: "Welcome [Name] to my Portfolio!" -> Collects Email & Message,
 *         validates CSRF + inputs, inserts into `contact_messages` via PDO
 *         prepared statement, and redirects via Post/Redirect/Get (PRG).
 */

session_start();

require_once __DIR__ . '/config/database.php';

// Generate CSRF token if not yet present in session
if (empty($_SESSION['contact_csrf_token'])) {
    $_SESSION['contact_csrf_token'] = bin2hex(random_bytes(32));
}
$csrfToken = $_SESSION['contact_csrf_token'];

// Allow resetting Step 1 ("Change Name" or "Send Another Message")
if (isset($_GET['reset_name']) && $_GET['reset_name'] === '1') {
    unset($_SESSION['contact_visitor_name'], $_SESSION['contact_flash_success']);
    header('Location: contact.php');
    exit;
}

$errors = [];
$visitorName = trim((string)($_SESSION['contact_visitor_name'] ?? ''));
$emailInput = '';
$messageInput = '';
$successMessage = '';

// Check for PRG flash success message from a completed database submission
if (!empty($_SESSION['contact_flash_success'])) {
    $successMessage = (string)$_SESSION['contact_flash_success'];
    unset($_SESSION['contact_flash_success']);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = (string)($_POST['action'] ?? '');

    // ------------------------------------------------------------------------
    // STEP 1 SUBMISSION: Validate and store visitor's name
    // ------------------------------------------------------------------------
    if ($action === 'set_name') {
        $submittedName = trim((string)($_POST['visitor_name'] ?? ''));
        // Strip control characters and tags for clean storage while escaping on output
        $submittedName = preg_replace('/[\x00-\x1F\x7F]/u', '', $submittedName) ?? '';

        if ($submittedName === '') {
            $errors[] = 'Please enter your name before continuing.';
        } elseif (mb_strlen($submittedName) < 2) {
            $errors[] = 'Please enter at least 2 characters for your name.';
        } elseif (mb_strlen($submittedName) > 100) {
            $errors[] = 'Name must not exceed 100 characters.';
        } else {
            $_SESSION['contact_visitor_name'] = $submittedName;
            // Redirect (PRG) to Step 2 so refreshing doesn't re-post Step 1
            header('Location: contact.php');
            exit;
        }
    }

    // ------------------------------------------------------------------------
    // STEP 2 SUBMISSION: Validate & insert contact message into MySQL
    // ------------------------------------------------------------------------
    elseif ($action === 'send_message') {
        $postedToken = (string)($_POST['csrf_token'] ?? '');
        $honeypot = trim((string)($_POST['website_url_hp'] ?? ''));

        $submittedName = trim((string)($_POST['name'] ?? $visitorName));
        $emailInput = trim((string)($_POST['email'] ?? ''));
        $messageInput = trim((string)($_POST['message'] ?? ''));

        if (!hash_equals($csrfToken, $postedToken)) {
            $errors[] = 'Invalid form security token. Please refresh the page and try again.';
        }

        // Basic spam honeypot check (must remain empty)
        if ($honeypot !== '') {
            $errors[] = 'Spam submission detected.';
        }

        // Basic rate-limiting (prevent rapid automated flooding within 5 seconds)
        $lastSubmitTime = (int)($_SESSION['last_contact_submit_time'] ?? 0);
        if ($lastSubmitTime > 0 && (time() - $lastSubmitTime) < 5) {
            $errors[] = 'Please wait a few seconds before sending another message.';
        }

        // Server-side validation of required fields
        if ($submittedName === '') {
            $errors[] = 'Your name is required. Please complete Step 1 first.';
        } elseif (mb_strlen($submittedName) > 100) {
            $errors[] = 'Name must not exceed 100 characters.';
        }

        if ($emailInput === '') {
            $errors[] = 'Please enter your email address.';
        } elseif (mb_strlen($emailInput) > 100 || !filter_var($emailInput, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Please enter a valid email address (e.g., name@example.com).';
        }

        if ($messageInput === '') {
            $errors[] = 'Please enter a message before submitting.';
        } elseif (mb_strlen($messageInput) < 5) {
            $errors[] = 'Your message must be at least 5 characters long.';
        } elseif (mb_strlen($messageInput) > 5000) {
            $errors[] = 'Your message is too long (maximum 5,000 characters).';
        }

        // Preserve the validated name for Step 2 display if errors occurred
        if ($submittedName !== '') {
            $visitorName = $submittedName;
            $_SESSION['contact_visitor_name'] = $visitorName;
        }

        // Insert into MySQL database ONLY if all validations pass
        if (empty($errors)) {
            try {
                $pdo = getDatabaseConnection();
                $stmt = $pdo->prepare(
                    'INSERT INTO contact_messages (name, email, message) VALUES (:name, :email, :message)'
                );
                $stmt->execute([
                    ':name'    => $visitorName,
                    ':email'   => $emailInput,
                    ':message' => $messageInput,
                ]);

                $_SESSION['last_contact_submit_time'] = time();
                $_SESSION['contact_csrf_token'] = bin2hex(random_bytes(32));
                $_SESSION['contact_flash_success'] = sprintf(
                    'Thank you, %s! Your message has been sent successfully.',
                    $visitorName
                );

                // Post/Redirect/Get pattern prevents duplicate insertions on browser refresh
                header('Location: contact.php?status=sent');
                exit;
            } catch (Throwable $e) {
                $errors[] = 'We could not save your message right now because the database is unavailable. Please ensure MySQL is running and try again.';
            }
        }
    }
}

$currentPage = 'contact';
$pageTitle = 'Contact | Kevin Christopher';
$includePlaygroundScripts = false;

require __DIR__ . '/includes/header.php';
?>

            <section class="content-section" id="contact" aria-labelledby="contactPageHeading">
                <div class="section-header">
                    <span class="section-eyebrow">05 / CONTACT</span>
                    <h1 class="section-title" id="contactPageHeading">Get In Touch</h1>
                    <p class="section-subtitle">Have a question, project idea, or want to talk about PC hardware and code? Reach out below.</p>
                </div>

                <div class="contact-layout">
                    <!-- Direct Social & Communication Channels -->
                    <div class="contact-channels-card">
                        <h2 class="card-heading">Communication Channels</h2>
                        <p class="card-subtext">
                            Connect with me through my social profiles or send a direct message using the two-step form.
                        </p>
                        <div class="contact-links-list" id="contactSocialGrid">
                            <!-- Populated from SOCIAL_LINKS in js/config.js -->
                        </div>
                    </div>

                    <!-- Two-Step PHP & MySQL Contact Card -->
                    <div class="contact-form-card">
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

                        <?php if ($visitorName === ''): ?>
                            <!-- =====================================================
                                 STEP 1 — ASK FOR VISITOR'S NAME
                            ====================================================== -->
                            <div class="contact-step-header">
                                <span class="step-indicator-pill">STEP 1 OF 2</span>
                                <h2 class="card-heading">What's Your Name?</h2>
                                <p class="card-subtext">Please enter your name below to continue to the contact form.</p>
                            </div>

                            <form action="contact.php" method="post" class="contact-form" id="stepOneNameForm" novalidate>
                                <input type="hidden" name="action" value="set_name">
                                <div class="form-group">
                                    <label for="visitorNameInput">Name</label>
                                    <input
                                        type="text"
                                        id="visitorNameInput"
                                        name="visitor_name"
                                        maxlength="100"
                                        placeholder="Enter your name"
                                        required
                                        autofocus
                                    >
                                </div>

                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary">
                                        <span>CONTINUE</span>
                                    </button>
                                </div>
                            </form>

                        <?php else: ?>
                            <!-- =====================================================
                                 STEP 2 — PERSONALIZED WELCOME & CONTACT FORM
                            ====================================================== -->
                            <div class="contact-step-header">
                                <div class="step-header-row">
                                    <span class="step-indicator-pill">STEP 2 OF 2</span>
                                    <a href="contact.php?reset_name=1" class="step-change-name-link">Change Name</a>
                                </div>
                                <h2 class="card-heading welcome-personalized-heading" id="welcomeVisitorHeading">
                                    Welcome <?= htmlspecialchars($visitorName, ENT_QUOTES, 'UTF-8') ?> to my Portfolio!
                                </h2>
                                <p class="card-subtext">
                                    Fill in your email address and message below, and it will be saved directly to my portfolio inbox.
                                </p>
                            </div>

                            <form action="contact.php" method="post" class="contact-form" id="stepTwoContactForm" novalidate>
                                <input type="hidden" name="action" value="send_message">
                                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">
                                <!-- Preserved Visitor Name from Step 1 -->
                                <input type="hidden" name="name" value="<?= htmlspecialchars($visitorName, ENT_QUOTES, 'UTF-8') ?>">

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

                                <div class="form-group">
                                    <label for="senderEmail">Email</label>
                                    <input
                                        type="email"
                                        id="senderEmail"
                                        name="email"
                                        maxlength="100"
                                        value="<?= htmlspecialchars($emailInput, ENT_QUOTES, 'UTF-8') ?>"
                                        placeholder="your.email@example.com"
                                        required
                                    >
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
                                    <button type="submit" class="btn btn-primary">
                                        <span>SUBMIT MESSAGE</span>
                                    </button>
                                </div>
                            </form>
                        <?php endif; ?>
                    </div>
                </div>

                <div class="section-footer-nav">
                    <a href="index.php#home" class="back-to-top-link">
                        <span>&larr; BACK TO HOME</span>
                    </a>
                </div>
            </section>

<?php require __DIR__ . '/includes/footer.php'; ?>
