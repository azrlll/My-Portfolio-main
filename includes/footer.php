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

    <!-- Subtle Notification Toast (for unconfigured social links or messages) -->
    <div class="toast-notification" id="toastNotification" role="status" aria-live="polite" hidden></div>

    <script src="js/config.js"></script>
    <script src="js/main.js"></script>
<?php if ($includePlaygroundScripts): ?>
    <script src="js/playground/components.js"></script>
    <script src="js/playground/storage.js"></script>
    <script src="js/playground/game-state.js"></script>
    <script src="js/playground/drag-drop.js"></script>
    <script src="js/playground/pc-simulator.js"></script>
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
<?php endif; ?>
</body>
</html>
