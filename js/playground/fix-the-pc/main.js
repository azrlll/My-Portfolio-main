// ============================================================================
// FIX THE PC — ENTRY POINT & PLAYGROUND HUB SWITCHER
// Manages switching between the Playground Game Selection cards, Game 01
// (Build a PC), and Game 02 (Fix the PC) independently.
// ============================================================================

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        const hubView = document.getElementById("playgroundHubView");
        const buildPcView = document.getElementById("buildPcGameView");
        const fixPcView = document.getElementById("fixPcGameView");
        const fixPcMount = document.getElementById("fixPcAppRoot");

        const playBuildPcBtn = document.getElementById("btnPlayBuildPc");
        const playFixPcBtn = document.getElementById("btnPlayFixPc");
        const backFromBuildPcBtn = document.getElementById("btnBackFromBuildPc");

        function showPlaygroundHub() {
            if (window.FixPCGameEngine && typeof window.FixPCGameEngine.cleanup === "function") {
                window.FixPCGameEngine.cleanup();
            }
            if (hubView) hubView.hidden = false;
            if (buildPcView) buildPcView.hidden = true;
            if (fixPcView) fixPcView.hidden = true;
        }

        function openBuildPcGame() {
            if (hubView) hubView.hidden = true;
            if (buildPcView) buildPcView.hidden = false;
            if (fixPcView) fixPcView.hidden = true;
        }

        function openFixPcGame() {
            if (hubView) hubView.hidden = true;
            if (buildPcView) buildPcView.hidden = true;
            if (fixPcView) fixPcView.hidden = false;
            if (window.FixPCUI && typeof window.FixPCUI.renderMainMenu === "function") {
                window.FixPCUI.renderMainMenu();
            }
        }

        if (playBuildPcBtn) {
            playBuildPcBtn.addEventListener("click", openBuildPcGame);
        }

        if (playFixPcBtn) {
            playFixPcBtn.addEventListener("click", openFixPcGame);
        }

        if (backFromBuildPcBtn) {
            backFromBuildPcBtn.addEventListener("click", showPlaygroundHub);
        }

        if (fixPcMount && window.FixPCUI) {
            window.FixPCUI.init(fixPcMount, {
                onReturnToPlayground: showPlaygroundHub
            });
        }
    });
})();
