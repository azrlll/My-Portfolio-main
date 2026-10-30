<?php
declare(strict_types=1);

/**
 * Transactional Email Mailer for OTP Verification
 * Supports Brevo (Sendinblue) and Resend via HTTPS REST API (Port 443).
 * Fully compatible with InfinityFree free hosting and local XAMPP.
 * Never exposes credentials to frontend code.
 */

if (basename($_SERVER['PHP_SELF'] ?? '') === basename(__FILE__)) {
    http_response_code(403);
    exit('Forbidden');
}

/**
 * Load Email configuration from external or local private environment file.
 * Returns an array containing provider, api_key, sender_email, sender_name.
 */
function getEmailConfig(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }

    $externalEnvPath = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'portfolio_env.php';
    $localEnvPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'env.local.php';

    $env = [];
    if (is_file($externalEnvPath) && is_readable($externalEnvPath)) {
        $loaded = include $externalEnvPath;
        if (is_array($loaded)) {
            $env = array_merge($env, $loaded);
        }
    } elseif (is_file($localEnvPath) && is_readable($localEnvPath)) {
        $loaded = include $localEnvPath;
        if (is_array($loaded)) {
            $env = array_merge($env, $loaded);
        }
    }

    // Default configuration (supports Brevo, Resend, or custom SMTP/API)
    // Supports both BREVO_API_KEY and EMAIL_API_KEY in env.local.php
    $apiKey = (string)($env['BREVO_API_KEY'] ?? $env['EMAIL_API_KEY'] ?? getenv('BREVO_API_KEY') ?: getenv('EMAIL_API_KEY') ?: '');
    $config = [
        'provider'     => strtolower((string)($env['EMAIL_PROVIDER'] ?? getenv('EMAIL_PROVIDER') ?: 'brevo')),
        'api_key'      => $apiKey,
        'sender_email' => (string)($env['EMAIL_SENDER_EMAIL'] ?? getenv('EMAIL_SENDER_EMAIL') ?: 'kevinreal2006@gmail.com'),
        'sender_name'  => (string)($env['EMAIL_SENDER_NAME'] ?? getenv('EMAIL_SENDER_NAME') ?: 'Kevin Christopher Portfolio'),
    ];

    return $config;
}

/**
 * Send 6-Digit OTP via configured HTTPS Email Provider.
 *
 * @param string $recipientEmail Recipient email address
 * @param string $recipientName  Recipient visitor name
 * @param string $otpCode        6-digit OTP code
 * @param int    $ttlMinutes     Expiration window in minutes (default 5)
 * @return array ['success' => bool, 'error' => string]
 */
function sendOtpEmail(string $recipientEmail, string $recipientName, string $otpCode, int $ttlMinutes = 5): array
{
    $config = getEmailConfig();

    if (empty($config['api_key'])) {
        error_log('[Email Service] Missing EMAIL_API_KEY in configuration.');
        return [
            'success' => false,
            'error'   => 'The email verification service is not yet configured with an API key. Please contact the administrator.',
        ];
    }

    $provider = $config['provider'];
    $subject = 'Your Portfolio Verification Code';

    $safeName = htmlspecialchars($recipientName !== '' ? $recipientName : 'Visitor', ENT_QUOTES, 'UTF-8');
    $safeOtp = htmlspecialchars($otpCode, ENT_QUOTES, 'UTF-8');
    $year = date('Y');

    // Clean, minimalist HTML email template matching portfolio monochrome design
    $htmlContent = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Verification Code</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 520px; margin: 0 auto; background-color: #141414; border: 1px solid #262626; border-radius: 12px; overflow: hidden;">
    <tr>
      <td style="padding: 28px 24px; border-bottom: 1px solid #262626;">
        <span style="font-family: monospace; font-size: 11px; letter-spacing: 0.1em; color: #a3a3a3; text-transform: uppercase;">VERIFICATION REQUIRED</span>
        <h1 style="margin: 8px 0 0 0; font-size: 20px; font-weight: 700; color: #f5f5f5; letter-spacing: -0.02em;">Kevin Christopher | Portfolio</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px 24px;">
        <p style="margin: 0 0 16px 0; font-size: 15px; color: #d4d4d4; line-height: 1.5;">Hello <strong>{$safeName}</strong>,</p>
        <p style="margin: 0 0 24px 0; font-size: 14px; color: #a3a3a3; line-height: 1.6;">
          Use the 6-digit code below to verify your email address on the portfolio contact form.
        </p>
        <div style="background-color: #0a0a0a; border: 1px dashed #404040; border-radius: 8px; padding: 18px 24px; text-align: center; margin: 0 0 24px 0;">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 0.25em; color: #ffffff;">{$safeOtp}</span>
        </div>
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #737373;">
          &bull; This verification code expires in <strong>{$ttlMinutes} minutes</strong>.
        </p>
        <p style="margin: 0; font-size: 13px; color: #737373;">
          &bull; If you did not request this verification code, you can safely ignore this email.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 18px 24px; background-color: #0d0d0d; border-top: 1px solid #262626; text-align: center;">
        <p style="margin: 0; font-family: monospace; font-size: 11px; color: #525252;">&copy; {$year} Kevin Christopher &bull; BSIT Student &bull; Hardware &amp; Code</p>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

    $textContent = "Hello {$recipientName},\n\nYour portfolio verification code is: {$otpCode}\n\nThis code expires in {$ttlMinutes} minutes.\nIf you did not request this code, you can safely ignore this email.\n\nKevin Christopher Portfolio";

    if ($provider === 'resend') {
        return sendViaResend($config, $recipientEmail, $subject, $htmlContent, $textContent);
    }

    // Default: Brevo (Sendinblue) HTTPS REST API
    return sendViaBrevo($config, $recipientEmail, $recipientName, $subject, $htmlContent, $textContent);
}

/**
 * Send email via Brevo v3 REST API.
 */
function sendViaBrevo(array $config, string $recipientEmail, string $recipientName, string $subject, string $html, string $text): array
{
    $payload = [
        'sender' => [
            'name'  => $config['sender_name'],
            'email' => $config['sender_email'],
        ],
        'to' => [
            [
                'email' => $recipientEmail,
                'name'  => $recipientName !== '' ? $recipientName : 'Visitor',
            ],
        ],
        'subject'     => $subject,
        'htmlContent' => $html,
        'textContent' => $text,
    ];

    $ch = curl_init('https://api.brevo.com/v3/smtp/email');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_TIMEOUT, 12);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'accept: application/json',
        'api-key: ' . $config['api_key'],
        'content-type: application/json',
    ]);

    $rawResponse = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError !== '') {
        error_log('[Brevo API cURL Error] ' . $curlError);
        return [
            'success' => false,
            'error'   => 'Could not reach the email delivery server. Please check your internet connection and try again.',
        ];
    }

    if ($httpCode >= 200 && $httpCode < 300) {
        return ['success' => true, 'error' => ''];
    }

    $errorDetail = 'Failed to deliver email.';
    if (is_string($rawResponse)) {
        $decoded = json_decode($rawResponse, true);
        if (isset($decoded['message'])) {
            $errorDetail = (string)$decoded['message'];
        }
    }

    error_log("[Brevo API Error HTTP $httpCode] " . $rawResponse);
    return [
        'success' => false,
        'error'   => 'Email provider reported an error: ' . $errorDetail,
    ];
}

/**
 * Send email via Resend REST API.
 */
function sendViaResend(array $config, string $recipientEmail, string $subject, string $html, string $text): array
{
    $fromHeader = sprintf('%s <%s>', $config['sender_name'], $config['sender_email']);
    $payload = [
        'from'    => $fromHeader,
        'to'      => [$recipientEmail],
        'subject' => $subject,
        'html'    => $html,
        'text'    => $text,
    ];

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_TIMEOUT, 12);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $config['api_key'],
        'Content-Type: application/json',
    ]);

    $rawResponse = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError !== '') {
        error_log('[Resend API cURL Error] ' . $curlError);
        return [
            'success' => false,
            'error'   => 'Could not reach the email delivery server.',
        ];
    }

    if ($httpCode >= 200 && $httpCode < 300) {
        return ['success' => true, 'error' => ''];
    }

    $errorDetail = 'Failed to deliver email.';
    if (is_string($rawResponse)) {
        $decoded = json_decode($rawResponse, true);
        if (isset($decoded['message'])) {
            $errorDetail = (string)$decoded['message'];
        }
    }

    error_log("[Resend API Error HTTP $httpCode] " . $rawResponse);
    return [
        'success' => false,
        'error'   => 'Email provider reported an error: ' . $errorDetail,
    ];
}
