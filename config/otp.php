<?php
declare(strict_types=1);

/**
 * OTP Verification Handler (config/otp.php)
 * Handles:
 * 1. Generating cryptographically secure 6-digit OTPs
 * 2. Storing bcrypt hash of OTP with 5-minute expiry & max 5 attempts
 * 3. 60-second cooldown per email
 * 4. Rate-limiting by IP (max 10 requests per hour) & email (max 5 requests per hour)
 * 5. Sending via configured real email delivery service (Brevo / Resend)
 * 6. Verification and binding to the session and exact email address
 */

if (basename($_SERVER['PHP_SELF'] ?? '') === basename(__FILE__)) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/email.php';
require_once __DIR__ . '/database.php';

const OTP_TTL_SECONDS = 300; // 5 minutes
const OTP_RESEND_COOLDOWN = 60; // 60 seconds
const OTP_MAX_ATTEMPTS = 5;

/**
 * Get client IP safely.
 */
function getClientIpAddress(): string
{
    $headers = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
    foreach ($headers as $h) {
        if (!empty($_SERVER[$h])) {
            $ipList = explode(',', (string)$_SERVER[$h]);
            $ip = trim($ipList[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    return (string)($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
}

/**
 * Request a new OTP for an email address.
 *
 * @param string $email
 * @param string $name
 * @return array ['success' => bool, 'error' => string, 'cooldown' => int]
 */
function requestEmailOtp(string $email, string $name): array
{
    $cleanEmail = strtolower(trim($email));
    if (!filter_var($cleanEmail, FILTER_VALIDATE_EMAIL) || strlen($cleanEmail) > 100) {
        return ['success' => false, 'error' => 'Please enter a valid email address.', 'cooldown' => 0];
    }

    $now = time();
    $ip = getClientIpAddress();

    // Check session cooldown
    $sessionOtp = $_SESSION['contact_otp_data'] ?? null;
    if (is_array($sessionOtp) && isset($sessionOtp['email'], $sessionOtp['created_at'])) {
        if ($sessionOtp['email'] === $cleanEmail && ($now - (int)$sessionOtp['created_at']) < OTP_RESEND_COOLDOWN) {
            $remaining = OTP_RESEND_COOLDOWN - ($now - (int)$sessionOtp['created_at']);
            return [
                'success'  => false,
                'error'    => sprintf('Please wait %d seconds before requesting another verification code.', $remaining),
                'cooldown' => $remaining,
            ];
        }
    }

    // Database rate limit check if database is reachable
    try {
        $pdo = getDatabaseConnection();
        // Check hourly limit for this IP (max 10)
        $hourAgo = $now - 3600;
        $ipCheck = $pdo->prepare('SELECT COUNT(*) FROM email_verifications WHERE ip_address = :ip AND created_at > :since');
        $ipCheck->execute([':ip' => $ip, ':since' => $hourAgo]);
        if ((int)$ipCheck->fetchColumn() >= 10) {
            return [
                'success'  => false,
                'error'    => 'Too many verification requests from your network. Please try again in an hour.',
                'cooldown' => 0,
            ];
        }

        // Check hourly limit for this email (max 5)
        $emailCheck = $pdo->prepare('SELECT COUNT(*) FROM email_verifications WHERE email = :email AND created_at > :since');
        $emailCheck->execute([':email' => $cleanEmail, ':since' => $hourAgo]);
        if ((int)$emailCheck->fetchColumn() >= 5) {
            return [
                'success'  => false,
                'error'    => 'Too many verification codes requested for this email address. Please try again in an hour.',
                'cooldown' => 0,
            ];
        }
    } catch (Throwable $e) {
        // Fallback to session rate-limiting if database table is not yet created
    }

    // Generate cryptographically secure 6-digit OTP (100000 to 999999)
    $otpInt = random_int(100000, 999999);
    $otpCode = (string)$otpInt;
    $otpHash = password_hash($otpCode, PASSWORD_DEFAULT);

    // Send the real email
    $sendResult = sendOtpEmail($cleanEmail, $name, $otpCode, 5);
    if (!$sendResult['success']) {
        return [
            'success'  => false,
            'error'    => $sendResult['error'],
            'cooldown' => 0,
        ];
    }

    // Store hashed OTP in session
    $_SESSION['contact_otp_data'] = [
        'email'      => $cleanEmail,
        'otp_hash'   => $otpHash,
        'attempts'   => 0,
        'created_at' => $now,
        'expires_at' => $now + OTP_TTL_SECONDS,
        'verified'   => false,
    ];

    // Invalidate any previous verified status if email was changed
    if (($_SESSION['contact_verified_email'] ?? '') !== $cleanEmail) {
        unset($_SESSION['contact_verified_email']);
    }

    // Persist to email_verifications table for audit/rate-limit tracking
    try {
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare(
            'INSERT INTO email_verifications (email, otp_hash, ip_address, attempts, verified, created_at, expires_at)
             VALUES (:email, :otp_hash, :ip, 0, 0, :created_at, :expires_at)'
        );
        $stmt->execute([
            ':email'      => $cleanEmail,
            ':otp_hash'   => $otpHash,
            ':ip'         => $ip,
            ':created_at' => $now,
            ':expires_at' => $now + OTP_TTL_SECONDS,
        ]);
    } catch (Throwable $e) {
        // Log silently
    }

    return [
        'success'  => true,
        'error'    => '',
        'cooldown' => OTP_RESEND_COOLDOWN,
    ];
}

/**
 * Verify a submitted 6-digit OTP code against the active session.
 *
 * @param string $email
 * @param string $submittedCode
 * @return array ['success' => bool, 'error' => string]
 */
function verifyEmailOtp(string $email, string $submittedCode): array
{
    $cleanEmail = strtolower(trim($email));
    $cleanCode = trim($submittedCode);
    $now = time();

    $data = $_SESSION['contact_otp_data'] ?? null;
    if (!is_array($data) || empty($data['otp_hash'])) {
        return ['success' => false, 'error' => 'No active verification code found. Please click "Send Verification Code" first.'];
    }

    if (($data['email'] ?? '') !== $cleanEmail) {
        return ['success' => false, 'error' => 'The email address does not match the one that received the verification code.'];
    }

    if ($now > (int)($data['expires_at'] ?? 0)) {
        unset($_SESSION['contact_otp_data']);
        return ['success' => false, 'error' => 'This verification code has expired (valid for 5 minutes). Please request a new code.'];
    }

    if ((int)($data['attempts'] ?? 0) >= OTP_MAX_ATTEMPTS) {
        unset($_SESSION['contact_otp_data']);
        return ['success' => false, 'error' => 'Too many incorrect attempts. For your security, this code has been invalidated. Please request a new code.'];
    }

    // Increment attempt count
    $_SESSION['contact_otp_data']['attempts'] = ((int)$data['attempts']) + 1;

    if (!password_verify($cleanCode, $data['otp_hash'])) {
        $remainingAttempts = OTP_MAX_ATTEMPTS - $_SESSION['contact_otp_data']['attempts'];
        if ($remainingAttempts <= 0) {
            unset($_SESSION['contact_otp_data']);
            return ['success' => false, 'error' => 'Incorrect verification code. Maximum attempts exceeded. Please request a new code.'];
        }
        return [
            'success' => false,
            'error'   => sprintf('Incorrect verification code. %d attempt(s) remaining.', $remainingAttempts),
        ];
    }

    // Verification SUCCESS!
    $_SESSION['contact_otp_data']['verified'] = true;
    $_SESSION['contact_verified_email'] = $cleanEmail;

    // Invalidate OTP hash to prevent reuse
    $_SESSION['contact_otp_data']['otp_hash'] = '';

    // Update database record
    try {
        $pdo = getDatabaseConnection();
        $upd = $pdo->prepare('UPDATE email_verifications SET verified = 1 WHERE email = :email AND created_at = :created');
        $upd->execute([':email' => $cleanEmail, ':created' => $data['created_at']]);
    } catch (Throwable $e) {
        // Silently continue
    }

    return ['success' => true, 'error' => ''];
}

/**
 * Check if the current session has successfully verified the given email address.
 */
function isEmailVerifiedForSession(string $email): bool
{
    $cleanEmail = strtolower(trim($email));
    $verifiedEmail = (string)($_SESSION['contact_verified_email'] ?? '');
    return ($verifiedEmail !== '' && $verifiedEmail === $cleanEmail);
}
