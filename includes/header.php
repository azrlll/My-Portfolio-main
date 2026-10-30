<?php
declare(strict_types=1);

/**
 * Shared Header & Fixed Left Sidebar Component
 * Included by index.php and contact.php.
 * Also handles real-time AJAX heartbeat pings (?viewer_ping=1|leave) for the Live Viewers widget.
 */

if (isset($_GET['viewer_ping'])) {
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

    $action = (string)$_GET['viewer_ping'];
    $rawClientId = (string)($_GET['cid'] ?? ($_SERVER['REMOTE_ADDR'] ?? 'anon'));
    $clientId = preg_replace('/[^a-zA-Z0-9_-]/', '', substr($rawClientId, 0, 64)) ?: 'anon';

    $storeFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'kevin_portfolio_live_viewers.json';
    $now = time();
    $ttl = 45; // Active window in seconds
    $activeSessions = [];

    $fp = @fopen($storeFile, 'c+');
    if ($fp !== false) {
        if (@flock($fp, LOCK_EX)) {
            $contents = stream_get_contents($fp);
            if (is_string($contents) && $contents !== '') {
                $decoded = json_decode($contents, true);
                if (is_array($decoded)) {
                    $activeSessions = $decoded;
                }
            }

            foreach ($activeSessions as $id => $lastSeen) {
                if (!is_int($lastSeen) || ($now - $lastSeen) > $ttl) {
                    unset($activeSessions[$id]);
                }
            }

            if ($action === 'leave') {
                unset($activeSessions[$clientId]);
            } else {
                $activeSessions[$clientId] = $now;
            }

            ftruncate($fp, 0);
            rewind($fp);
            fwrite($fp, (string)json_encode($activeSessions));
            fflush($fp);
            @flock($fp, LOCK_UN);
        }
        fclose($fp);
    } else {
        $activeSessions[$clientId] = $now;
    }

    $realActiveCount = max(1, count($activeSessions));
    echo json_encode([
        'ok' => true,
        'realActive' => $realActiveCount,
        'timestamp' => $now,
    ]);
    exit;
}

$currentPage = $currentPage ?? 'index';
$pageTitle = $pageTitle ?? 'Kevin Christopher | Portfolio';
$basePrefix = ($currentPage === 'index') ? '' : 'index.php';
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Portfolio of Kevin Christopher — BSIT Student, Hardware Enthusiast, and Vibe Coder exploring computer hardware and building with code.">
    <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></title>
    <!-- Google Fonts: Inter for crisp minimalist typography -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/playground/pc-simulator.css">
    <link rel="stylesheet" href="css/playground/fix-the-pc.css">
    <link rel="stylesheet" href="css/playground/circuit-connect.css">
</head>
<body>

    <!-- Mobile Top Header (Visible only on tablet/mobile) -->
    <header class="mobile-header" aria-label="Mobile Navigation Bar">
        <a href="<?= $basePrefix ?>#home" class="mobile-brand">
            <span class="brand-title">Kevin Christopher</span>
        </a>
        <div class="mobile-header-actions">
            <button type="button" class="mobile-theme-btn" id="mobileThemeToggle" aria-label="Toggle color theme">
                <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            </button>
            <button type="button" class="mobile-menu-btn" id="mobileMenuToggle" aria-expanded="false" aria-controls="sidebar" aria-label="Toggle navigation menu">
                <svg class="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    </header>

    <!-- Backdrop for Mobile Sidebar -->
    <div class="sidebar-backdrop" id="sidebarBackdrop" aria-hidden="true"></div>

    <!-- Main Layout Wrapper -->
    <div class="app-layout">

        <!-- Left Fixed Vertical Navigation Sidebar -->
        <aside class="sidebar" id="sidebar" aria-label="Primary Sidebar Navigation">
            <div class="sidebar-inner">
                <!-- Sidebar Header: Name Only -->
                <div class="sidebar-header">
                    <a href="<?= $basePrefix ?>#home" class="brand-link">
                        <span class="brand-title" id="sidebarBrandName">Kevin Christopher</span>
                    </a>
                </div>

                <!-- Scrollable Navigation & Social Area -->
                <div class="sidebar-scroll-area">
                    <!-- Primary Navigation -->
                    <nav class="sidebar-nav" aria-label="Section Navigation">
                        <ul class="nav-list">
                            <li>
                                <a href="<?= $basePrefix ?>#home" class="nav-item <?= $currentPage === 'index' ? 'active' : '' ?>" data-section="home">
                                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V9.5z"></path>
                                    </svg>
                                    <span>Home</span>
                                </a>
                            </li>
                            <li>
                                <a href="<?= $basePrefix ?>#profile" class="nav-item" data-section="profile">
                                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    <span>Profile</span>
                                </a>
                            </li>
                            <li>
                                <a href="<?= $basePrefix ?>#projects" class="nav-item" data-section="projects">
                                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    <span>Projects</span>
                                </a>
                            </li>
                            <li>
                                <a href="<?= $basePrefix ?>#skills" class="nav-item" data-section="skills">
                                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
                                        <line x1="2" y1="12" x2="22" y2="12"></line>
                                    </svg>
                                    <span>Skills</span>
                                </a>
                            </li>
                            <li>
                                <a href="<?= $basePrefix ?>#blog" class="nav-item" data-section="blog">
                                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                    </svg>
                                    <span>Blog</span>
                                </a>
                            </li>
                            <li class="nav-group-playground">
                                <a href="<?= $basePrefix ?>#playground" class="nav-item nav-item-playground" data-section="playground" id="navPlaygroundHubLink">
                                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <line x1="6" y1="12" x2="10" y2="12"></line>
                                        <line x1="8" y1="10" x2="8" y2="14"></line>
                                        <line x1="15" y1="13" x2="15.01" y2="13"></line>
                                        <line x1="18" y1="11" x2="18.01" y2="11"></line>
                                        <rect x="2" y="6" width="20" height="12" rx="6"></rect>
                                    </svg>
                                    <span>Playground</span>
                                    <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </a>
                                <ul class="nav-submenu" aria-label="Playground Games">
                                    <li>
                                        <a href="<?= $currentPage === 'index' ? '#playground' : 'index.php?game=build-pc#playground' ?>" class="nav-subitem" data-open-game="build-pc">
                                            <span class="nav-subitem-index">01</span>
                                            <span>Build a PC</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="<?= $currentPage === 'index' ? '#playground' : 'index.php?game=fix-pc#playground' ?>" class="nav-subitem" data-open-game="fix-pc">
                                            <span class="nav-subitem-index">02</span>
                                            <span>Fix the PC</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="<?= $currentPage === 'index' ? '#playground' : 'index.php?game=circuit-connect#playground' ?>" class="nav-subitem" data-open-game="circuit-connect">
                                            <span class="nav-subitem-index">03</span>
                                            <span>Circuit Connect</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="contact.php" class="nav-item <?= $currentPage === 'contact' ? 'active' : '' ?>" data-section="contact">
                                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </svg>
                                    <span>Contact</span>
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <!-- Social Links (Clean Monospace List) -->
                    <div class="sidebar-social">
                        <ul class="social-list" id="sidebarSocialList">
                            <!-- Hydrated dynamically from SOCIAL_LINKS in js/config.js -->
                        </ul>
                    </div>
                </div>

                <div class="sidebar-divider" role="separator"></div>

                <!-- Sidebar Footer: Live Viewers, Theme Switch & Signature -->
                <div class="sidebar-footer">
                    <!-- Live Website Viewers Widget -->
                    <div class="live-viewers-widget" id="liveViewersWidget" aria-live="polite" title="Active visitors viewing this portfolio right now">
                        <div class="viewer-avatars" id="liveViewerAvatars" aria-hidden="true">
                            <!-- Avatar 1: Bun + Glasses + Suspenders -->
                            <span class="viewer-avatar" data-avatar-index="0">
                                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="18" cy="18" r="18" fill="#EDEDED"/>
                                    <path d="M7 36C7 28.5 11.5 25 18 25C24.5 25 29 28.5 29 36H7Z" fill="#FAFAFA" stroke="#141414" stroke-width="1.6"/>
                                    <path d="M12.5 26V36M23.5 26V36" stroke="#141414" stroke-width="2.2"/>
                                    <circle cx="18" cy="7.5" r="3.2" fill="#141414"/>
                                    <circle cx="18" cy="16.5" r="6.2" fill="#FAFAFA" stroke="#141414" stroke-width="1.6"/>
                                    <path d="M12 15.2C12.5 11.2 15 9.8 18 9.8C21 9.8 23.5 11.2 24 15.2C22 13.6 19.5 13.4 18 13.4C16.5 13.4 14 13.6 12 15.2Z" fill="#141414"/>
                                    <rect x="13.6" y="15.2" width="3.6" height="2.4" rx="1" fill="#141414"/>
                                    <rect x="18.8" y="15.2" width="3.6" height="2.4" rx="1" fill="#141414"/>
                                    <line x1="17.2" y1="16.2" x2="18.8" y2="16.2" stroke="#141414" stroke-width="1.3"/>
                                    <path d="M16.5 20.2C17.3 20.8 18.7 20.8 19.5 20.2" stroke="#141414" stroke-width="1.3" stroke-linecap="round"/>
                                </svg>
                            </span>
                            <!-- Avatar 2: Light Hair + Dark Collar Shirt + Badge -->
                            <span class="viewer-avatar" data-avatar-index="1">
                                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="18" cy="18" r="18" fill="#EDEDED"/>
                                    <path d="M6.5 36C6.5 28.2 11.2 24.8 18 24.8C24.8 24.8 29.5 28.2 29.5 36H6.5Z" fill="#141414"/>
                                    <path d="M15 24.8L18 28.5L21 24.8" fill="#EDEDED"/>
                                    <circle cx="18" cy="31" r="1.4" fill="#EDEDED"/>
                                    <circle cx="18" cy="16" r="6.3" fill="#FAFAFA" stroke="#141414" stroke-width="1.6"/>
                                    <path d="M11.7 15C11.7 10.6 14.5 8.5 18.2 8.5C21.8 8.5 24.3 10.8 24.3 14.5C23 12.2 20.8 11.2 18 11.2C15.2 11.2 13 12.5 11.7 15Z" fill="#FAFAFA" stroke="#141414" stroke-width="1.5"/>
                                    <circle cx="15.8" cy="16.2" r="1" fill="#141414"/>
                                    <circle cx="20.4" cy="16.2" r="1" fill="#141414"/>
                                    <path d="M16.6 19.8H19.4" stroke="#141414" stroke-width="1.3" stroke-linecap="round"/>
                                </svg>
                            </span>
                            <!-- Avatar 3: Dark Swept Hair + Pinstripe Jacket -->
                            <span class="viewer-avatar" data-avatar-index="2">
                                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="18" cy="18" r="18" fill="#EDEDED"/>
                                    <path d="M6.5 36C6.5 28.2 11.2 24.8 18 24.8C24.8 24.8 29.5 28.2 29.5 36H6.5Z" fill="#141414"/>
                                    <line x1="14" y1="26" x2="14" y2="36" stroke="#EDEDED" stroke-width="1.1"/>
                                    <line x1="18" y1="25" x2="18" y2="36" stroke="#EDEDED" stroke-width="1.1"/>
                                    <line x1="22" y1="26" x2="22" y2="36" stroke="#EDEDED" stroke-width="1.1"/>
                                    <circle cx="18" cy="16" r="6.2" fill="#FAFAFA" stroke="#141414" stroke-width="1.6"/>
                                    <path d="M11.6 15.8C11.4 11 14.4 8.4 18.5 8.4C22.2 8.4 24.6 10.6 24.4 15.2C22.4 13.5 19.8 12.8 16.2 13.5C14.2 13.9 12.7 14.8 11.6 15.8Z" fill="#141414"/>
                                    <circle cx="15.7" cy="16.4" r="1.05" fill="#141414"/>
                                    <circle cx="20.3" cy="16.4" r="1.05" fill="#141414"/>
                                    <path d="M16.5 19.8C17.3 20.3 18.7 20.3 19.5 19.8" stroke="#141414" stroke-width="1.3" stroke-linecap="round"/>
                                </svg>
                            </span>
                            <!-- Avatar 4: Dark Bob/Cap Hair + White Collar Sweater -->
                            <span class="viewer-avatar" data-avatar-index="3">
                                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="18" cy="18" r="18" fill="#EDEDED"/>
                                    <path d="M6.5 36C6.5 28.4 11.2 25 18 25C24.8 25 29.5 28.4 29.5 36H6.5Z" fill="#141414"/>
                                    <path d="M14.2 25.2C15.5 27.2 20.5 27.2 21.8 25.2" stroke="#EDEDED" stroke-width="1.8" stroke-linecap="round"/>
                                    <circle cx="18" cy="16.2" r="6.2" fill="#FAFAFA" stroke="#141414" stroke-width="1.6"/>
                                    <path d="M11.5 16.5C11.5 11.2 14.2 8.8 18 8.8C21.8 8.8 24.5 11.2 24.5 16.5C23.2 14.2 21 13.4 18 13.4C15 13.4 12.8 14.2 11.5 16.5Z" fill="#141414"/>
                                    <circle cx="15.6" cy="16.5" r="1" fill="#141414"/>
                                    <circle cx="20.4" cy="16.5" r="1" fill="#141414"/>
                                    <path d="M16.6 20C17.4 20.4 18.6 20.4 19.4 20" stroke="#141414" stroke-width="1.3" stroke-linecap="round"/>
                                </svg>
                            </span>
                            <!-- Avatar 5: Tousled Hair + Hoodie (Shown when 5+ viewers) -->
                            <span class="viewer-avatar" data-avatar-index="4" hidden>
                                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="18" cy="18" r="18" fill="#EDEDED"/>
                                    <path d="M6.5 36C6.5 28.2 11.2 24.8 18 24.8C24.8 24.8 29.5 28.2 29.5 36H6.5Z" fill="#141414"/>
                                    <path d="M15.5 26.5V33M20.5 26.5V33" stroke="#EDEDED" stroke-width="1.3" stroke-linecap="round"/>
                                    <circle cx="18" cy="16" r="6.2" fill="#FAFAFA" stroke="#141414" stroke-width="1.6"/>
                                    <path d="M11.4 15.4C11.8 10.4 14.6 8.3 18 8.3C21.4 8.3 24.2 10.4 24.6 15.4C22.6 13.5 20.4 12.8 18 12.8C15.6 12.8 13.4 13.5 11.4 15.4Z" fill="#141414"/>
                                    <circle cx="15.6" cy="16.3" r="1" fill="#141414"/>
                                    <circle cx="20.4" cy="16.3" r="1" fill="#141414"/>
                                    <path d="M16.5 19.8H19.5" stroke="#141414" stroke-width="1.3" stroke-linecap="round"/>
                                </svg>
                            </span>
                        </div>
                        <p class="viewer-status-text">
                            <strong class="viewer-count" id="liveViewerCount">4</strong>
                            <span class="viewer-label" id="liveViewerLabel">people viewing now</span>
                        </p>
                    </div>

                    <button type="button" class="theme-switch-card" id="themeToggle" aria-label="Toggle color theme">
                        <span class="theme-switch-left">
                            <svg class="nav-icon icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                            <svg class="nav-icon icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                            <span class="theme-switch-label" id="themeToggleLabel">Dark Mode</span>
                        </span>
                        <span class="theme-switch-track" aria-hidden="true">
                            <span class="theme-switch-thumb"></span>
                        </span>
                    </button>

                    <div class="sidebar-meta-Sign">
                        <p class="copyright-text">&copy; <?= date('Y') ?> Kevin Christopher</p>
                        <p class="copyright-subtext">BSIT &bull; Hardware &amp; Code</p>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Spacious Main Content Area -->
        <main class="main-content" id="mainContent">
