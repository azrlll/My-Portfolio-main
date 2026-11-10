<?php
declare(strict_types=1);

/**
 * Shared Footer, Lightbox Modal & JavaScript Includes
 * Included by index.php and contact.php.
 */

$includePlaygroundScripts = $includePlaygroundScripts ?? true;
?>
        </main>
    </div>

    <!-- Image / Project Preview Lightbox Modal -->
    <div class="modal-overlay" id="projectModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" hidden>
        <div class="modal-card">
            <div class="modal-header">
                <div>
                    <span class="modal-category" id="modalCategory">Project Preview</span>
                    <h3 class="modal-title" id="modalTitle">Project Title</h3>
                </div>
                <button type="button" class="modal-close-btn" id="modalCloseBtn" aria-label="Close preview">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="modal-image-wrapper" id="modalImageWrapper">
                    <img src="" alt="" id="modalImage">
                    <div class="modal-svg-container" id="modalSvgContainer" hidden></div>
                </div>
                <p class="modal-description" id="modalDescription"></p>
                <div class="modal-tags" id="modalTags"></div>
            </div>
        </div>
    </div>

    <!-- Developer Journal Article Reading Lightbox Modal -->
    <div class="modal-overlay journal-modal-overlay" id="journalModal" role="dialog" aria-modal="true" aria-labelledby="journalModalTitle" hidden>
        <div class="modal-card journal-modal-card">
            <div class="modal-header journal-modal-header">
                <div class="journal-modal-title-group">
                    <div class="journal-modal-meta-top">
                        <span class="journal-category-pill" id="journalModalCategory">Personal Experiences</span>
                        <span class="journal-modal-readtime" id="journalModalReadTime">3 min read</span>
                    </div>
                    <h3 class="modal-title journal-modal-title" id="journalModalTitle">Entry Title</h3>
                    <div class="journal-modal-submeta" id="journalModalDate">Student Journey</div>
                </div>
                <button type="button" class="modal-close-btn" id="journalModalCloseBtn" aria-label="Close journal entry">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body journal-modal-body">
                <div class="journal-article-prose" id="journalModalContent">
                    <!-- Paragraphs populated dynamically by openJournalModal -->
                </div>
                <div class="journal-modal-actions">
                    <button type="button" class="btn btn-secondary journal-modal-back-btn" id="journalModalBackBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width: 16px; height: 16px; margin-right: 6px;">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        <span>Back to Journal</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Promotional Invitation Website Popup (Appears once per session after 5s) -->
    <div class="modal-overlay invitation-promo-overlay" id="invitationPromoModal" role="dialog" aria-modal="true" aria-labelledby="invitationPromoTitle" hidden>
        <div class="modal-card invitation-promo-card">
            <div class="modal-header invitation-promo-header">
                <div class="invitation-promo-title-wrap">
                    <h3 class="modal-title invitation-promo-title" id="invitationPromoTitle">Want Your Own Invitation Website?</h3>
                </div>
                <button type="button" class="modal-close-btn invitation-promo-close" id="invitationPromoCloseBtn" aria-label="Close invitation popup">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body invitation-promo-body">
                <div class="invitation-promo-image-wrap">
                    <img src="image/project-jennina-18th-birthday.png" alt="18th Birthday Invitation Website Preview" class="invitation-promo-img">
                    <div class="invitation-promo-img-caption">
                        <span>Project Preview: 18th Birthday Invitation</span>
                    </div>
                </div>
                <p class="invitation-promo-desc">
                    Planning a birthday, wedding, debut, or special celebration? I can build a custom invitation website for you with background music, photo galleries, RSVP forms, countdown timers, and location maps so your guests have an easy, memorable way to see all the details.
                </p>
                <div class="invitation-promo-feature-tags" aria-label="Available invitation features">
                    <span class="tag-pill">
                        <svg class="chip-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M9 18V5l12-2v13"></path>
                            <circle cx="6" cy="18" r="3"></circle>
                            <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                        <span>Music</span>
                    </span>
                    <span class="tag-pill">
                        <svg class="chip-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path>
                        </svg>
                        <span>Animations</span>
                    </span>
                    <span class="tag-pill">
                        <svg class="chip-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                            <circle cx="12" cy="13" r="3"></circle>
                        </svg>
                        <span>Gallery</span>
                    </span>
                    <span class="tag-pill">
                        <svg class="chip-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                            <path d="m9 14 2 2 4-4"></path>
                            <rect x="8" y="2" width="8" height="4" rx="1"></rect>
                        </svg>
                        <span>RSVP</span>
                    </span>
                    <span class="tag-pill">
                        <svg class="chip-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M5 22h14"></path>
                            <path d="M5 2h14"></path>
                            <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path>
                            <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path>
                        </svg>
                        <span>Countdown</span>
                    </span>
                    <span class="tag-pill">
                        <svg class="chip-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>Maps</span>
                    </span>
                </div>
                <div class="invitation-promo-actions">
                    <button type="button" class="btn btn-secondary invitation-promo-dismiss" id="invitationPromoDismissBtn">
                        Not Now
                    </button>
                    <a href="#contact" class="btn btn-primary invitation-promo-contact" id="invitationPromoContactBtn">
                        <span>Contact Me</span>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Subtle Notification Toast (for unconfigured social links or messages) -->
    <div class="toast-notification" id="toastNotification" role="status" aria-live="polite" hidden></div>

<?php if ($includePlaygroundScripts): ?>
    <!-- Playground Game Modal (Appears only when visitor clicks a game in the sidebar) -->
    <?php require __DIR__ . '/playground-modal.php'; ?>
<?php endif; ?>

<?php
$jsConfigVer = function_exists('getPortfolioAssetVersion') ? getPortfolioAssetVersion('js/config.js') : (string)(@filemtime(__DIR__ . '/../js/config.js') ?: '20261102');
$jsMainVer = function_exists('getPortfolioAssetVersion') ? getPortfolioAssetVersion('js/main.js') : (string)(@filemtime(__DIR__ . '/../js/main.js') ?: '20261102');
$pgVer = $deployVersion ?? 'live';
?>
    <script src="js/config.js?v=<?= $jsConfigVer ?>"></script>
    <script src="js/main.js?v=<?= $jsMainVer ?>"></script>
<?php if ($includePlaygroundScripts): ?>
    <script src="js/playground/build-a-pc/components.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/build-a-pc/storage.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/build-a-pc/game-state.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/build-a-pc/drag-drop.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/build-a-pc/pc-simulator.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/fix-the-pc/scenarios.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/fix-the-pc/diagnostics.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/fix-the-pc/scoring.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/fix-the-pc/achievements.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/fix-the-pc/storage.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/fix-the-pc/career-mode.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/fix-the-pc/hints.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/fix-the-pc/game-engine.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/fix-the-pc/ui.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/fix-the-pc/main.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/circuit-connect/components.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/circuit-connect/levels.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/circuit-connect/circuit-validator.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/circuit-connect/wire-system.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/circuit-connect/scoring.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/circuit-connect/achievements.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/circuit-connect/storage.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/circuit-connect/game-engine.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/circuit-connect/ui.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/circuit-connect/main.js?v=<?= $pgVer ?>"></script>
    <script src="js/playground/minimal-snake/snake.js?v=<?= $pgVer ?>"></script>
<?php endif; ?>
</body>
</html>
