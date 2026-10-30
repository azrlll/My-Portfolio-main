-- ============================================================================
-- OTP VERIFICATION AUDIT & RATE-LIMIT TABLE (MIGRATION)
-- Database Name: portfolio_db
-- ============================================================================

CREATE TABLE IF NOT EXISTS `email_verifications` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `otp_hash` VARCHAR(255) NOT NULL,
    `ip_address` VARCHAR(45) NOT NULL DEFAULT '',
    `attempts` INT NOT NULL DEFAULT 0,
    `verified` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` INT NOT NULL,
    `expires_at` INT NOT NULL,
    INDEX `idx_email` (`email`),
    INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
