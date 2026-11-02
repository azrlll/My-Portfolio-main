// ============================================================================
// FIX THE PC — ENTRY POINT
// Initializes Fix the PC UI container and engine.
// Multi-game navigation and sidebar dropdown are coordinated by Playground Manager.
// ============================================================================

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        const fixPcMount = document.getElementById("fixPcAppRoot");
        if (fixPcMount && window.FixPCUI) {
            window.FixPCUI.init(fixPcMount, {
                onReturnToPlayground: () => {
                    if (window.PlaygroundManager && typeof window.PlaygroundManager.closeModal === "function") {
                        window.PlaygroundManager.closeModal();
                    }
                }
            });
        }
    });
})();
