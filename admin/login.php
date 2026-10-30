<?php
declare(strict_types=1);

/**
 * Admin Login Page (admin/login.php)
 * Authenticates the portfolio administrator using PHP sessions, CSRF protection,
 * basic login attempt rate limiting, password_verify(), and session_regenerate_id(true).
 */

session_start();

// Prevent browser caching of auth pages
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

require_once dirname(__DIR__) . '/config/admin.php';

// Redirect already authenticated admins straight to the dashboard
if (!empty($_SESSION['admin_authenticated']) && $_SESSION['admin_authenticated'] === true) {
    header('Location: dashboard.php');
    exit;
}

if (empty($_SESSION['admin_csrf_token'])) {
    $_SESSION['admin_csrf_token'] = bin2hex(random_bytes(32));
}
$csrfToken = $_SESSION['admin_csrf_token'];

$errorMessage = '';
$usernameInput = '';

// Rate limiting state in session
$failedAttempts = (int)($_SESSION['admin_failed_attempts'] ?? 0);
$lockoutUntil = (int)($_SESSION['admin_lockout_until'] ?? 0);

if ($lockoutUntil > 0 && time() >= $lockoutUntil) {
    // Lockout window expired; reset counters
    $failedAttempts = 0;
    $lockoutUntil = 0;
    $_SESSION['admin_failed_attempts'] = 0;
    $_SESSION['admin_lockout_until'] = 0;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postedCsrf = (string)($_POST['csrf_token'] ?? '');
    $usernameInput = trim((string)($_POST['username'] ?? ''));
    $passwordInput = (string)($_POST['password'] ?? '');

    if ($lockoutUntil > time()) {
        $remainingSeconds = $lockoutUntil - time();
        $errorMessage = sprintf(
            'Too many failed login attempts. Please wait %d seconds before trying again.',
            $remainingSeconds
        );
    } elseif (!hash_equals($csrfToken, $postedCsrf)) {
        $errorMessage = 'Invalid security token. Please refresh the page and try again.';
    } elseif ($usernameInput === '' || $passwordInput === '') {
        $errorMessage = 'Please enter both username and password.';
    } else {
        // Constant-time username comparison + bcrypt password_verify()
        $userMatches = hash_equals(ADMIN_USERNAME, $usernameInput);
        $passMatches = password_verify($passwordInput, ADMIN_PASSWORD_HASH);

        if ($userMatches && $passMatches) {
            // Successful authentication: regenerate session ID to prevent session fixation
            session_regenerate_id(true);
            $_SESSION['admin_authenticated'] = true;
            $_SESSION['admin_username'] = ADMIN_USERNAME;
            $_SESSION['admin_login_time'] = time();
            $_SESSION['admin_failed_attempts'] = 0;
            $_SESSION['admin_lockout_until'] = 0;
            $_SESSION['admin_csrf_token'] = bin2hex(random_bytes(32));

            header('Location: dashboard.php');
            exit;
        } else {
            $failedAttempts += 1;
            $_SESSION['admin_failed_attempts'] = $failedAttempts;

            if ($failedAttempts >= ADMIN_MAX_LOGIN_ATTEMPTS) {
                $_SESSION['admin_lockout_until'] = time() + ADMIN_LOCKOUT_SECONDS;
                $errorMessage = 'Too many failed login attempts. Login is temporarily locked for 5 minutes.';
            } else {
                // Generic error message that never reveals whether username or password was wrong
                $errorMessage = 'Invalid username or password.';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Admin Login | Kevin Christopher Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
</head>
<body class="admin-body">
    <main class="admin-auth-wrapper">
        <section class="admin-login-card" aria-labelledby="adminLoginHeading">
            <div class="admin-login-header">
                <span class="section-eyebrow">RESTRICTED ACCESS</span>
                <h1 class="admin-login-title" id="adminLoginHeading">Admin Login</h1>
                <p class="admin-login-subtitle">Sign in to view contact messages submitted through the portfolio.</p>
            </div>

            <?php if ($errorMessage !== ''): ?>
                <div class="php-alert php-alert-error" role="alert">
                    <p><?= htmlspecialchars($errorMessage, ENT_QUOTES, 'UTF-8') ?></p>
                </div>
            <?php endif; ?>

            <form action="login.php" method="post" class="contact-form" novalidate>
                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">

                <div class="form-group">
                    <label for="adminUsername">Username</label>
                    <input
                        type="text"
                        id="adminUsername"
                        name="username"
                        value="<?= htmlspecialchars($usernameInput, ENT_QUOTES, 'UTF-8') ?>"
                        placeholder="Enter username"
                        autocomplete="username"
                        required
                        autofocus
                    >
                </div>

                <div class="form-group">
                    <label for="adminPassword">Password</label>
                    <input
                        type="password"
                        id="adminPassword"
                        name="password"
                        placeholder="Enter password"
                        autocomplete="current-password"
                        required
                    >
                </div>

                <div class="form-actions admin-login-actions">
                    <button type="submit" class="btn btn-primary admin-submit-btn">
                        <span>LOGIN</span>
                    </button>
                </div>
            </form>

            <div class="admin-login-footer">
                <a href="../index.php" class="text-link">&larr; Return to Portfolio</a>
            </div>
        </section>
    </main>
</body>
</html>
