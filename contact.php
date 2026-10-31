<?php
declare(strict_types=1);

/**
 * Legacy Contact Endpoint (contact.php)
 * Preserved for backwards compatibility, API endpoints (AJAX OTP), and form processing.
 * Direct visits are smoothly redirected (301 Moved Permanently) to index.php#contact.
 */

require_once __DIR__ . '/includes/contact-handler.php';

// If reaching here on a GET request, redirect visitor to the continuous Contact section on index.php
$target = 'index.php#contact';
if (!empty($_GET['status']) && $_GET['status'] === 'sent') {
    $target = 'index.php?status=sent#contact';
}

header('HTTP/1.1 301 Moved Permanently');
header('Location: ' . $target);
exit;
