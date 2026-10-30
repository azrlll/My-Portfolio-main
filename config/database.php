<?php
declare(strict_types=1);

/**
 * Reusable PDO Database Connection Configuration
 * Supports environment variables for production hosting while defaulting to
 * standard local XAMPP credentials (127.0.0.1 / root / "" / portfolio_db).
 * Never exposes database credentials or raw SQL error messages to visitors.
 */

if (basename($_SERVER['PHP_SELF'] ?? '') === basename(__FILE__)) {
    http_response_code(403);
    exit('Forbidden');
}

/**
 * Returns a configured PDO connection instance to `portfolio_db`.
 *
 * @return PDO
 * @throws RuntimeException When the database connection fails (generic message only).
 */
function getDatabaseConnection(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    // Optional private override file stored outside webroot or in config/env.local.php
    $externalEnvPath = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'portfolio_env.php';
    $localEnvPath = __DIR__ . DIRECTORY_SEPARATOR . 'env.local.php';

    $envConfig = [];
    if (is_file($externalEnvPath) && is_readable($externalEnvPath)) {
        $loaded = include $externalEnvPath;
        if (is_array($loaded)) {
            $envConfig = array_merge($envConfig, $loaded);
        }
    } elseif (is_file($localEnvPath) && is_readable($localEnvPath)) {
        $loaded = include $localEnvPath;
        if (is_array($loaded)) {
            $envConfig = array_merge($envConfig, $loaded);
        }
    }

    $dbHost = (string)($envConfig['DB_HOST'] ?? getenv('DB_HOST') ?: '127.0.0.1');
    $dbPort = (string)($envConfig['DB_PORT'] ?? getenv('DB_PORT') ?: '3306');
    $dbName = (string)($envConfig['DB_NAME'] ?? getenv('DB_NAME') ?: 'portfolio_db');
    $dbUser = (string)($envConfig['DB_USER'] ?? getenv('DB_USER') ?: 'root');
    $dbPass = (string)($envConfig['DB_PASS'] ?? (getenv('DB_PASS') !== false ? getenv('DB_PASS') : ''));

    $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $dbHost, $dbPort, $dbName);

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO($dsn, $dbUser, $dbPass, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Log detailed error server-side only; never display raw credentials or stack trace to visitors
        error_log('[Portfolio DB Error] ' . $e->getMessage());
        throw new RuntimeException('Unable to connect to the database at this time. Please try again later.');
    }
}
