// ============================================================================
// CIRCUIT CONNECT — ENTRY POINT & PLAYGROUND HUB INTEGRATION
// Coordinates Game 03 (Circuit Connect) alongside Game 01 (Build a PC)
// and Game 02 (Fix the PC), and binds the Sidebar Playground hover submenu
// for direct one-click game launching.
// ============================================================================

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        const hubView = document.getElementById("playgroundHubView");
        const buildPcView = document.getElementById("buildPcGameView");
        const fixPcView = document.getElementById("fixPcGameView");
        const circuitConnectView = document.getElementById("circuitConnectGameView");
        const snakeView = document.getElementById("snakeGameView");
        const circuitConnectMount = document.getElementById("circuitConnectAppRoot");

        const playBuildPcBtn = document.getElementById("btnPlayBuildPc");
        const playFixPcBtn = document.getElementById("btnPlayFixPc");
        const playCircuitConnectBtn = document.getElementById("btnPlayCircuitConnect");
        const playSnakeBtn = document.getElementById("btnPlaySnake");
        const backFromBuildPcBtn = document.getElementById("btnBackFromBuildPc");
        const navPlaygroundHubLink = document.getElementById("navPlaygroundHubLink");
        const sidebarSubItems = document.querySelectorAll(".nav-subitem[data-open-game]");

        function setActiveSubmenuGame(gameKey) {
            sidebarSubItems.forEach((item) => {
                item.classList.toggle("active", item.getAttribute("data-open-game") === gameKey);
            });
        }

        function closeMobileDrawerIfOpen() {
            const sidebar = document.getElementById("sidebar");
            const mobileMenuBtn = document.getElementById("mobileMenuToggle");
            const backdrop = document.getElementById("sidebarBackdrop");
            if (sidebar) sidebar.classList.remove("is-open");
            if (backdrop) backdrop.classList.remove("is-visible");
            if (mobileMenuBtn) mobileMenuBtn.setAttribute("aria-expanded", "false");
        }

        function cleanupAllGames() {
            if (window.CircuitConnectEngine && typeof window.CircuitConnectEngine.cleanup === "function") {
                window.CircuitConnectEngine.cleanup();
            }
            if (window.FixPCGameEngine && typeof window.FixPCGameEngine.cleanup === "function") {
                window.FixPCGameEngine.cleanup();
            }
            if (window.MinimalSnakeGame && typeof window.MinimalSnakeGame.cleanup === "function") {
                window.MinimalSnakeGame.cleanup();
            }
        }

        function showPlaygroundHub() {
            cleanupAllGames();
            if (hubView) hubView.hidden = false;
            if (buildPcView) buildPcView.hidden = true;
            if (fixPcView) fixPcView.hidden = true;
            if (circuitConnectView) circuitConnectView.hidden = true;
            if (snakeView) snakeView.hidden = true;
            setActiveSubmenuGame(null);
        }

        function openBuildPcGame() {
            cleanupAllGames();
            if (hubView) hubView.hidden = true;
            if (buildPcView) buildPcView.hidden = false;
            if (fixPcView) fixPcView.hidden = true;
            if (circuitConnectView) circuitConnectView.hidden = true;
            if (snakeView) snakeView.hidden = true;
            setActiveSubmenuGame("build-pc");
        }

        function openFixPcGame() {
            cleanupAllGames();
            if (hubView) hubView.hidden = true;
            if (buildPcView) buildPcView.hidden = true;
            if (fixPcView) fixPcView.hidden = false;
            if (circuitConnectView) circuitConnectView.hidden = true;
            if (snakeView) snakeView.hidden = true;
            if (window.FixPCUI && typeof window.FixPCUI.renderMainMenu === "function") {
                window.FixPCUI.renderMainMenu();
            }
            setActiveSubmenuGame("fix-pc");
        }

        function openCircuitConnectGame() {
            cleanupAllGames();
            if (hubView) hubView.hidden = true;
            if (buildPcView) buildPcView.hidden = true;
            if (fixPcView) fixPcView.hidden = true;
            if (circuitConnectView) circuitConnectView.hidden = false;
            if (snakeView) snakeView.hidden = true;

            if (window.CircuitConnectUI && typeof window.CircuitConnectUI.renderMainMenu === "function") {
                window.CircuitConnectUI.renderMainMenu();
            }
            setActiveSubmenuGame("circuit-connect");
        }

        function openSnakeGame() {
            cleanupAllGames();
            if (hubView) hubView.hidden = true;
            if (buildPcView) buildPcView.hidden = true;
            if (fixPcView) fixPcView.hidden = true;
            if (circuitConnectView) circuitConnectView.hidden = true;
            if (snakeView) snakeView.hidden = false;

            if (window.MinimalSnakeGame && typeof window.MinimalSnakeGame.openGame === "function") {
                window.MinimalSnakeGame.openGame();
            }
            setActiveSubmenuGame("snake");
        }

        if (playCircuitConnectBtn) {
            playCircuitConnectBtn.addEventListener("click", openCircuitConnectGame);
        }

        if (playBuildPcBtn) {
            playBuildPcBtn.addEventListener("click", openBuildPcGame);
        }

        if (playFixPcBtn) {
            playFixPcBtn.addEventListener("click", openFixPcGame);
        }

        if (playSnakeBtn) {
            playSnakeBtn.addEventListener("click", openSnakeGame);
        }

        if (backFromBuildPcBtn) {
            backFromBuildPcBtn.addEventListener("click", showPlaygroundHub);
        }

        if (navPlaygroundHubLink) {
            navPlaygroundHubLink.addEventListener("click", () => {
                showPlaygroundHub();
            });
        }

        // Direct one-click game selection from the Sidebar Playground hover submenu
        sidebarSubItems.forEach((subLink) => {
            subLink.addEventListener("click", () => {
                const targetGame = subLink.getAttribute("data-open-game");
                if (targetGame === "build-pc") {
                    openBuildPcGame();
                } else if (targetGame === "fix-pc") {
                    openFixPcGame();
                } else if (targetGame === "circuit-connect") {
                    openCircuitConnectGame();
                } else if (targetGame === "snake") {
                    openSnakeGame();
                }

                // Activate the parent Playground nav item
                document.querySelectorAll(".nav-item").forEach((item) => {
                    item.classList.toggle("active", item.getAttribute("data-section") === "playground");
                });

                closeMobileDrawerIfOpen();
            });
        });

        // Mount inside index.php Playground section
        if (circuitConnectMount && window.CircuitConnectUI) {
            window.CircuitConnectUI.init(circuitConnectMount, {
                onReturnToPlayground: showPlaygroundHub
            });
        }

        // Auto-open game if navigated from contact.php via ?game=build-pc|fix-pc|circuit-connect|snake
        try {
            const params = new URLSearchParams(window.location.search);
            const requestedGame = params.get("game");
            if (requestedGame === "build-pc") {
                openBuildPcGame();
            } else if (requestedGame === "fix-pc") {
                openFixPcGame();
            } else if (requestedGame === "circuit-connect") {
                openCircuitConnectGame();
            } else if (requestedGame === "snake") {
                openSnakeGame();
            }
        } catch (err) {
            // Ignore URLSearchParams errors on older browsers
        }
    });
})();
