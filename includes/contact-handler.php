<?php
declare(strict_types=1);

/**
 * Shared Contact Handler (includes/contact-handler.php)
 * Handles CSRF generation, AJAX endpoints (name, OTP, submission),
 * two-step form validation, and MySQL persistence.
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/otp.php';

// Generate CSRF token if not yet present in session
if (empty($_SESSION['contact_csrf_token'])) {
    $_SESSION['contact_csrf_token'] = bin2hex(random_bytes(32));
}
$csrfToken = (string)$_SESSION['contact_csrf_token'];

// ----------------------------------------------------------------------------
// 1. AJAX ENDPOINT FOR SAVING STEP 1 NAME (IN-PLACE TRANSITION)
// ----------------------------------------------------------------------------
if (isset($_GET['ajax_name'])) {
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
        exit;
    }

    $submittedName = trim((string)($_POST['visitor_name'] ?? ''));
    $submittedName = preg_replace('/[\x00-\x1F\x7F]/u', '', $submittedName) ?? '';

    if ($submittedName === '') {
        echo json_encode(['success' => false, 'error' => 'Please enter your name before continuing.']);
        exit;
    }
    if (mb_strlen($submittedName) < 2) {
        echo json_encode(['success' => false, 'error' => 'Please enter at least 2 characters for your name.']);
        exit;
    }
    if (mb_strlen($submittedName) > 100) {
        echo json_encode(['success' => false, 'error' => 'Name must not exceed 100 characters.']);
        exit;
    }

    $_SESSION['contact_visitor_name'] = $submittedName;
    echo json_encode(['success' => true, 'name' => $submittedName]);
    exit;
}

// ----------------------------------------------------------------------------
// 2. AJAX ENDPOINTS FOR REAL-TIME OTP SEND & VERIFY
// ----------------------------------------------------------------------------
if (isset($_GET['ajax_otp'])) {
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
        exit;
    }

    $postedToken = (string)($_POST['csrf_token'] ?? '');
    if (!hash_equals($csrfToken, $postedToken)) {
        echo json_encode(['success' => false, 'error' => 'Session expired or invalid security token. Please refresh the page.']);
        exit;
    }

    $otpAction = (string)($_POST['otp_action'] ?? '');
    $email = trim((string)($_POST['email'] ?? ''));
    $visitorName = trim((string)($_SESSION['contact_visitor_name'] ?? 'Visitor'));

    if ($otpAction === 'send') {
        $res = requestEmailOtp($email, $visitorName);
        echo json_encode($res);
        exit;
    }

    if ($otpAction === 'verify') {
        $code = trim((string)($_POST['otp_code'] ?? ''));
        $res = verifyEmailOtp($email, $code);
        echo json_encode($res);
        exit;
    }

    echo json_encode(['success' => false, 'error' => 'Unknown OTP action.']);
    exit;
}

// ----------------------------------------------------------------------------
// 3. RESET STEP 1 ("Change Name" or "Send Another Message")
// ----------------------------------------------------------------------------
if (isset($_GET['reset_name']) && $_GET['reset_name'] === '1') {
    unset(
        $_SESSION['contact_visitor_name'],
        $_SESSION['contact_flash_success'],
        $_SESSION['contact_otp_data'],
        $_SESSION['contact_verified_email']
    );

    if (isset($_GET['ajax']) || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false)) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['success' => true]);
        exit;
    }

    header('Location: index.php#contact');
    exit;
}

// ----------------------------------------------------------------------------
// 4. INITIALIZE VARIABLES
// ----------------------------------------------------------------------------
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

// ----------------------------------------------------------------------------
// 5. FORM SUBMISSION PROCESSING
// ----------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = (string)($_POST['action'] ?? '');
    $isAjaxSubmit = isset($_GET['ajax_submit']);

    // Step 1 Submission: Validate and store visitor's name
    if ($action === 'set_name') {
        $submittedName = trim((string)($_POST['visitor_name'] ?? ''));
        $submittedName = preg_replace('/[\x00-\x1F\x7F]/u', '', $submittedName) ?? '';

        if ($submittedName === '') {
            $errors[] = 'Please enter your name before continuing.';
        } elseif (mb_strlen($submittedName) < 2) {
            $errors[] = 'Please enter at least 2 characters for your name.';
        } elseif (mb_strlen($submittedName) > 100) {
            $errors[] = 'Name must not exceed 100 characters.';
        } else {
            $_SESSION['contact_visitor_name'] = $submittedName;
            if ($isAjaxSubmit) {
                header('Content-Type: application/json; charset=UTF-8');
                echo json_encode(['success' => true, 'name' => $submittedName]);
                exit;
            }
            header('Location: index.php#contact');
            exit;
        }

        if ($isAjaxSubmit && !empty($errors)) {
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode(['success' => false, 'error' => $errors[0]]);
            exit;
        }
    }

    // Step 2 Submission: Validate & insert contact message into MySQL
    elseif ($action === 'send_message') {
        $postedToken = (string)($_POST['csrf_token'] ?? '');
        $honeypot = trim((string)($_POST['website_url_hp'] ?? ''));

        $submittedName = trim((string)($_POST['name'] ?? $visitorName));
        $emailInput = trim((string)($_POST['email'] ?? ''));
        $messageInput = trim((string)($_POST['message'] ?? ''));

        if (!hash_equals($csrfToken, $postedToken)) {
            $errors[] = 'Invalid form security token. Please refresh the page and try again.';
        }

        // Honeypot spam check
        if ($honeypot !== '') {
            $errors[] = 'Spam submission detected.';
        }

        // Rate limiting (minimum 5 seconds between submissions)
        $lastSubmitTime = (int)($_SESSION['last_contact_submit_time'] ?? 0);
        if ($lastSubmitTime > 0 && (time() - $lastSubmitTime) < 5) {
            $errors[] = 'Please wait a few seconds before sending another message.';
        }

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

        // Verify that submitted email has passed REAL OTP verification
        if (!isEmailVerifiedForSession($emailInput)) {
            $errors[] = 'Add your real email cutie 😉 (and verify it with the 6-digit code sent to your inbox before submitting)';
        }

        if ($messageInput === '') {
            $errors[] = 'Please enter a message before submitting.';
        } elseif (mb_strlen($messageInput) < 5) {
            $errors[] = 'Your message must be at least 5 characters long.';
        } elseif (mb_strlen($messageInput) > 5000) {
            $errors[] = 'Your message is too long (maximum 5,000 characters).';
        }

        if ($submittedName !== '') {
            $visitorName = $submittedName;
            $_SESSION['contact_visitor_name'] = $visitorName;
        }

        if ($isAjaxSubmit && !empty($errors)) {
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode(['success' => false, 'error' => implode(' ', $errors)]);
            exit;
        }

        // Insert into database if all validations pass
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
                unset($_SESSION['contact_verified_email'], $_SESSION['contact_otp_data']);

                $successText = sprintf(
                    'Thank you, %s! Your message has been sent successfully.',
                    $visitorName
                );

                if ($isAjaxSubmit) {
                    header('Content-Type: application/json; charset=UTF-8');
                    echo json_encode(['success' => true, 'message' => $successText, 'name' => $visitorName]);
                    exit;
                }

                $_SESSION['contact_flash_success'] = $successText;
                header('Location: index.php?status=sent#contact');
                exit;
            } catch (Throwable $e) {
                $dbError = 'We could not save your message right now because the database is unavailable. Please ensure MySQL is running and try again.';
                if ($isAjaxSubmit) {
                    header('Content-Type: application/json; charset=UTF-8');
                    echo json_encode(['success' => false, 'error' => $dbError]);
                    exit;
                }
                $errors[] = $dbError;
            }
        }
    }
}

$isEmailVerified = isEmailVerifiedForSession($emailInput);
