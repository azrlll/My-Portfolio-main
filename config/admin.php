<?php
declare(strict_types=1);

/**
 * Admin Authentication Configuration
 * The school project requires ONLY ONE database table (`contact_messages`).
 * Therefore, the single administrator username and bcrypt password_hash() are
 * stored in this protected server-side configuration file.
 *
 * Plain-text passwords are NEVER stored here.
 * To generate a new password hash via CLI, run:
 *   php -r "echo password_hash('your_new_password', PASSWORD_DEFAULT);"
 */

if (basename($_SERVER['PHP_SELF'] ?? '') === basename(__FILE__)) {
    http_response_code(403);
    exit('Forbidden');
}

// Allow overriding from a private file outside the public web root when available
$externalAdminConfigPath = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'portfolio_admin_config.php';
$externalAdminConfig = [];
if (is_file($externalAdminConfigPath) && is_readable($externalAdminConfigPath)) {
    $loadedAdmin = include $externalAdminConfigPath;
    if (is_array($loadedAdmin)) {
        $externalAdminConfig = $loadedAdmin;
    }
}

define(
    'ADMIN_USERNAME',
    (string)($externalAdminConfig['ADMIN_USERNAME'] ?? getenv('PORTFOLIO_ADMIN_USER') ?: 'admin')
);

// Bcrypt hash generated via password_hash(..., PASSWORD_DEFAULT)
define(
    'ADMIN_PASSWORD_HASH',
    (string)($externalAdminConfig['ADMIN_PASSWORD_HASH'] ?? getenv('PORTFOLIO_ADMIN_HASH') ?: '$2y$10$C8A0cmUCeak/pm6Z8OWJAOIcYH/YgbG4b.o/tpeghH3Xl/sizMs/6')
);

// Basic Login Attempt Rate-Limiting Settings
define('ADMIN_MAX_LOGIN_ATTEMPTS', 5);
define('ADMIN_LOCKOUT_SECONDS', 300); // 5 minutes lockout after 5 failed attempts
