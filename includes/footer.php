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
                </div>
                <p class="modal-description" id="modalDescription"></p>
                <div class="modal-tags" id="modalTags"></div>
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
                    <img src="image/project-jennina-18th-birthday.png" alt="Jennina's 18th Birthday Invitation Website Preview" class="invitation-promo-img">
                    <div class="invitation-promo-img-caption">
                        <span>Project Preview: Jennina's 18th Birthday Invitation</span>
                    </div>
                </div>
                <p class="invitation-promo-desc">
                    Planning a birthday, wedding, debut, or special occasion? I can create a personalized invitation website with background music, animations, RSVP forms, photo galleries, countdown timers, and event location maps!
                </p>
                <div class="invitation-promo-feature-tags">
                    <span class="tag-pill">🎵 Music</span>
                    <span class="tag-pill">✨ Animations</span>
                    <span class="tag-pill">📸 Gallery</span>
                    <span class="tag-pill">📝 RSVP</span>
                    <span class="tag-pill">⏳ Countdown</span>
                    <span class="tag-pill">📍 Maps</span>
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

<?php
$jsVersion = (string)(@filemtime(__DIR__ . '/../js/main.js') ?: '20261030');
?>
    <script src="js/config.js?v=<?= $jsVersion ?>"></script>
    <script src="js/main.js?v=<?= $jsVersion ?>"></script>
    <script src="js/blackhole-bg.js?v=<?= $jsVersion ?>"></script>
<?php if ($includePlaygroundScripts): ?>
    <script src="js/playground/build-a-pc/components.js"></script>
    <script src="js/playground/build-a-pc/storage.js"></script>
    <script src="js/playground/build-a-pc/game-state.js"></script>
    <script src="js/playground/build-a-pc/drag-drop.js"></script>
    <script src="js/playground/build-a-pc/pc-simulator.js"></script>
    <script src="js/playground/fix-the-pc/scenarios.js"></script>
    <script src="js/playground/fix-the-pc/diagnostics.js"></script>
    <script src="js/playground/fix-the-pc/scoring.js"></script>
    <script src="js/playground/fix-the-pc/achievements.js"></script>
    <script src="js/playground/fix-the-pc/storage.js"></script>
    <script src="js/playground/fix-the-pc/career-mode.js"></script>
    <script src="js/playground/fix-the-pc/hints.js"></script>
    <script src="js/playground/fix-the-pc/game-engine.js"></script>
    <script src="js/playground/fix-the-pc/ui.js"></script>
    <script src="js/playground/fix-the-pc/main.js"></script>
    <script src="js/playground/circuit-connect/components.js"></script>
    <script src="js/playground/circuit-connect/levels.js"></script>
    <script src="js/playground/circuit-connect/circuit-validator.js"></script>
    <script src="js/playground/circuit-connect/wire-system.js"></script>
    <script src="js/playground/circuit-connect/scoring.js"></script>
    <script src="js/playground/circuit-connect/achievements.js"></script>
    <script src="js/playground/circuit-connect/storage.js"></script>
    <script src="js/playground/circuit-connect/game-engine.js"></script>
    <script src="js/playground/circuit-connect/ui.js"></script>
    <script src="js/playground/circuit-connect/main.js"></script>
    <script src="js/playground/minimal-snake/snake.js"></script>
<?php endif; ?>
</body>
</html>
