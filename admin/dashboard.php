<?php
declare(strict_types=1);

/**
 * Portfolio Admin Dashboard (admin/dashboard.php)
 * Protected administrator view displaying all contact messages stored in the
 * `contact_messages` table with search, pagination, newest-first sorting,
 * and strict output escaping.
 */

session_start();

// Prevent caching so logged-out users cannot view the dashboard via browser Back button
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

// Enforce authentication on every request
if (empty($_SESSION['admin_authenticated']) || $_SESSION['admin_authenticated'] !== true) {
    header('Location: login.php');
    exit;
}

require_once dirname(__DIR__) . '/config/database.php';

$searchQuery = trim((string)($_GET['q'] ?? ''));
$currentPageNum = max(1, (int)($_GET['page'] ?? 1));
$perPage = 15;
$offset = ($currentPageNum - 1) * $perPage;

$totalMessagesAll = 0;
$totalMatchedMessages = 0;
$messages = [];
$dbError = '';

try {
    $pdo = getDatabaseConnection();

    // Total count of all messages in contact_messages
    $totalStmt = $pdo->query('SELECT COUNT(*) FROM contact_messages');
    $totalMessagesAll = (int)$totalStmt->fetchColumn();

    if ($searchQuery !== '') {
        $likeParam = '%' . $searchQuery . '%';

        $countStmt = $pdo->prepare(
            'SELECT COUNT(*) FROM contact_messages WHERE name LIKE :q_name OR email LIKE :q_email'
        );
        $countStmt->execute([
            ':q_name'  => $likeParam,
            ':q_email' => $likeParam,
        ]);
        $totalMatchedMessages = (int)$countStmt->fetchColumn();

        $listStmt = $pdo->prepare(
            'SELECT id, name, email, message, date_sent
             FROM contact_messages
             WHERE name LIKE :q_name OR email LIKE :q_email
             ORDER BY date_sent DESC, id DESC
             LIMIT :limit OFFSET :offset'
        );
        $listStmt->bindValue(':q_name', $likeParam, PDO::PARAM_STR);
        $listStmt->bindValue(':q_email', $likeParam, PDO::PARAM_STR);
        $listStmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
        $listStmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $listStmt->execute();
        $messages = $listStmt->fetchAll();
    } else {
        $totalMatchedMessages = $totalMessagesAll;

        $listStmt = $pdo->prepare(
            'SELECT id, name, email, message, date_sent
             FROM contact_messages
             ORDER BY date_sent DESC, id DESC
             LIMIT :limit OFFSET :offset'
        );
        $listStmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
        $listStmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $listStmt->execute();
        $messages = $listStmt->fetchAll();
    }
} catch (Throwable $e) {
    $dbError = 'Unable to retrieve messages from the database. Please verify that MySQL is running and `portfolio_db` has been imported.';
}

$totalPages = max(1, (int)ceil($totalMatchedMessages / $perPage));
$adminUser = (string)($_SESSION['admin_username'] ?? 'admin');
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Portfolio Admin Dashboard | Kevin Christopher</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../style.css">
</head>
<body class="admin-body">
    <header class="admin-topbar">
        <div class="admin-topbar-inner">
            <div class="admin-brand-group">
                <span class="admin-badge">ADMIN PANEL</span>
                <span class="admin-user-meta">Signed in as <strong><?= htmlspecialchars($adminUser, ENT_QUOTES, 'UTF-8') ?></strong></span>
            </div>
            <div class="admin-topbar-actions">
                <a href="../index.php" class="btn btn-secondary admin-nav-btn">
                    <span>View Portfolio</span>
                </a>
                <a href="../contact.php" class="btn btn-secondary admin-nav-btn">
                    <span>Contact Page</span>
                </a>
                <a href="logout.php" class="btn btn-primary admin-nav-btn">
                    <span>Logout</span>
                </a>
            </div>
        </div>
    </header>

    <main class="admin-dashboard-container">
        <div class="admin-dashboard-header">
            <div>
                <span class="section-eyebrow">INBOX MANAGEMENT &bull; MYSQL DATABASE</span>
                <h1 class="section-title">Portfolio Admin Dashboard</h1>
                <p class="section-subtitle">All visitor messages submitted through the two-step portfolio contact form.</p>
            </div>

            <div class="admin-stats-row">
                <div class="admin-stat-pill">
                    <span class="admin-stat-label">TOTAL MESSAGES</span>
                    <strong class="admin-stat-value"><?= $totalMessagesAll ?></strong>
                </div>
                <?php if ($searchQuery !== ''): ?>
                    <div class="admin-stat-pill">
                        <span class="admin-stat-label">MATCHING FILTER</span>
                        <strong class="admin-stat-value"><?= $totalMatchedMessages ?></strong>
                    </div>
                <?php endif; ?>
            </div>
        </div>

        <?php if ($dbError !== ''): ?>
            <div class="php-alert php-alert-error" role="alert">
                <strong>Database Connection Notice</strong>
                <p><?= htmlspecialchars($dbError, ENT_QUOTES, 'UTF-8') ?></p>
            </div>
        <?php endif; ?>

        <!-- Search Filter Bar -->
        <div class="admin-toolbar-card">
            <form action="dashboard.php" method="get" class="admin-search-form">
                <div class="admin-search-input-wrap">
                    <label for="searchMessagesInput" class="sr-only">Search by Name or Email</label>
                    <input
                        type="search"
                        id="searchMessagesInput"
                        name="q"
                        value="<?= htmlspecialchars($searchQuery, ENT_QUOTES, 'UTF-8') ?>"
                        placeholder="Search messages by visitor name or email..."
                    >
                </div>
                <div class="admin-search-actions">
                    <button type="submit" class="btn btn-primary admin-nav-btn">
                        <span>Search</span>
                    </button>
                    <?php if ($searchQuery !== ''): ?>
                        <a href="dashboard.php" class="btn btn-secondary admin-nav-btn">
                            <span>Clear</span>
                        </a>
                    <?php endif; ?>
                </div>
            </form>
        </div>

        <!-- Responsive Contact Messages Table -->
        <div class="admin-table-card">
            <?php if (empty($messages)): ?>
                <div class="admin-empty-state">
                    <h2>No Contact Messages Found</h2>
                    <p>
                        <?= $searchQuery !== ''
                            ? 'No messages matched your search filter "' . htmlspecialchars($searchQuery, ENT_QUOTES, 'UTF-8') . '".'
                            : 'When visitors submit messages on contact.php, they will appear here automatically.' ?>
                    </p>
                </div>
            <?php else: ?>
                <div class="admin-table-responsive">
                    <table class="admin-messages-table">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Message</th>
                                <th scope="col">Date Sent</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($messages as $row): ?>
                                <tr>
                                    <td data-label="Name" class="col-name">
                                        <strong><?= htmlspecialchars((string)$row['name'], ENT_QUOTES, 'UTF-8') ?></strong>
                                    </td>
                                    <td data-label="Email" class="col-email">
                                        <a href="mailto:<?= htmlspecialchars((string)$row['email'], ENT_QUOTES, 'UTF-8') ?>">
                                            <?= htmlspecialchars((string)$row['email'], ENT_QUOTES, 'UTF-8') ?>
                                        </a>
                                    </td>
                                    <td data-label="Message" class="col-message">
                                        <div class="message-body-cell"><?= nl2br(htmlspecialchars((string)$row['message'], ENT_QUOTES, 'UTF-8')) ?></div>
                                    </td>
                                    <td data-label="Date Sent" class="col-date">
                                        <span class="date-mono"><?= htmlspecialchars((string)$row['date_sent'], ENT_QUOTES, 'UTF-8') ?></span>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>

                <?php if ($totalPages > 1): ?>
                    <nav class="admin-pagination" aria-label="Messages Pagination">
                        <?php for ($p = 1; $p <= $totalPages; $p++): ?>
                            <?php
                                $queryArgs = ['page' => $p];
                                if ($searchQuery !== '') {
                                    $queryArgs['q'] = $searchQuery;
                                }
                                $pageHref = 'dashboard.php?' . http_build_query($queryArgs);
                            ?>
                            <a
                                href="<?= htmlspecialchars($pageHref, ENT_QUOTES, 'UTF-8') ?>"
                                class="pagination-link <?= $p === $currentPageNum ? 'active' : '' ?>"
                            >
                                <?= $p ?>
                            </a>
                        <?php endfor; ?>
                    </nav>
                <?php endif; ?>
            <?php endif; ?>
        </div>
    </main>
</body>
</html>
