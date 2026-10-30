<?php
declare(strict_types=1);

/**
 * CLI Utility: Generate a PHP password_hash() for config/admin.php
 * Usage (from terminal):
 *   php config/generate_hash.php "your_new_password"
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('This script can only be executed from the command line (CLI).');
}

$password = $argv[1] ?? '';
if ($password === '') {
    fwrite(STDERR, "Usage: php config/generate_hash.php <new_password>\n");
    exit(1);
}

$hash = password_hash($password, PASSWORD_DEFAULT);
echo "Generated password_hash():\n" . $hash . "\n";
