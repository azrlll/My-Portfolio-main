<?php
declare(strict_types=1);

/**
 * Admin Logout Endpoint (admin/logout.php)
 * Destroys the authenticated PHP session, clears session cookies,
 * and redirects to admin/login.php.
 */

session_start();

$_SESSION = [];

if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params['path'],
        $params['domain'],
        (bool)$params['secure'],
        (bool)$params['httponly']
    );
}

session_destroy();

header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Location: login.php');
exit;
