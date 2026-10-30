-- ============================================================================
-- PERSONAL PORTFOLIO DATABASE — KEVIN CHRISTOPHER
-- Database Name: portfolio_db
-- Required Table: contact_messages
-- Importable directly via phpMyAdmin or MySQL CLI
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `portfolio_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `portfolio_db`;

CREATE TABLE IF NOT EXISTS `contact_messages` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `message` TEXT NOT NULL,
    `date_sent` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional Email OTP Verification Audit & Rate-Limit Table
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
