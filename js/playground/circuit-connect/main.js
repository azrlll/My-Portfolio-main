// ============================================================================
// PLAYGROUND COORDINATOR & SIDEBAR NAVIGATION MANAGER
// Manages switching directly between the four interactive hardware games:
//   01 - Build a PC
//   02 - Fix the PC
//   03 - Circuit Connect
//   04 - Minimal Snake
// Provides smooth expanding/collapsing sidebar dropdown, URL synchronization,
// responsive mobile menu handling, and persistent game state upon refresh.
// ============================================================================

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        const buildPcView = document.getElementById("buildPcGameView");
        const fixPcView = document.getElementById("fixPcGameView");
        const circuitConnectView = document.getElementById("circuitConnectGameView");
        const snakeView = document.getElementById("snakeGameView");
        const circuitConnectMount = document.getElementById("circuitConnectAppRoot");

        const navGroupPlayground = document.getElementById("navGroupPlayground") || document.querySelector(".nav-group-playground");
        const navPlaygroundHubLink = document.getElementById("navPlaygroundHubLink");
        const sidebarSubItems = document.querySelectorAll(".nav-subitem[data-open-game]");

        let currentGameKey = "build-pc";

        function setActiveSubmenuGame(gameKey) {
            currentGameKey = gameKey;
            sidebarSubItems.forEach((item) => {
                const matches = item.getAttribute("data-open-game") === gameKey;
                item.classList.toggle("active", matches);
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
                try { window.CircuitConnectEngine.cleanup(); } catch (e) { /* ignore */ }
            }
            if (window.FixPCGameEngine && typeof window.FixPCGameEngine.cleanup === "function") {
                try { window.FixPCGameEngine.cleanup(); } catch (e) { /* ignore */ }
            }
            if (window.MinimalSnakeGame && typeof window.MinimalSnakeGame.cleanup === "function") {
                try { window.MinimalSnakeGame.cleanup(); } catch (e) { /* ignore */ }
            }
        }

        function switchGame(gameKey, shouldScroll) {
            cleanupAllGames();

            const playgroundSection = document.getElementById("playground");
            if (playgroundSection) {
                playgroundSection.hidden = false;
            }

            if (buildPcView) buildPcView.hidden = true;
            if (fixPcView) fixPcView.hidden = true;
            if (circuitConnectView) circuitConnectView.hidden = true;
            if (snakeView) snakeView.hidden = true;

            switch (gameKey) {
                case "fix-pc":
                    if (fixPcView) fixPcView.hidden = false;
                    if (window.FixPCUI && typeof window.FixPCUI.renderMainMenu === "function") {
                        window.FixPCUI.renderMainMenu();
                    }
                    break;

                case "circuit-connect":
                    if (circuitConnectView) circuitConnectView.hidden = false;
                    if (window.CircuitConnectUI && typeof window.CircuitConnectUI.renderMainMenu === "function") {
                        window.CircuitConnectUI.renderMainMenu();
                    }
                    break;

                case "snake":
                    if (snakeView) snakeView.hidden = false;
                    if (window.MinimalSnakeGame && typeof window.MinimalSnakeGame.openGame === "function") {
                        window.MinimalSnakeGame.openGame();
                    }
                    break;

                case "build-pc":
                default:
                    gameKey = "build-pc";
                    if (buildPcView) buildPcView.hidden = false;
                    break;
            }

            setActiveSubmenuGame(gameKey);

            // Expand dropdown & highlight active state
            if (navGroupPlayground) {
                navGroupPlayground.classList.add("is-expanded");
            }
            if (navPlaygroundHubLink) {
                navPlaygroundHubLink.setAttribute("aria-expanded", "true");
            }

            document.querySelectorAll(".nav-item").forEach((item) => {
                item.classList.toggle("active", item.getAttribute("data-section") === "playground");
            });

            // Update URL without full page reload for refresh persistence
            try {
                const currentSearch = new URLSearchParams(window.location.search);
                if (currentSearch.get("game") !== gameKey) {
                    currentSearch.set("game", gameKey);
                    const newUrl = `${window.location.pathname}?${currentSearch.toString()}#playground`;
                    window.history.replaceState({ game: gameKey }, "", newUrl);
                }
            } catch (err) {
                // Ignore URLSearchParams error in legacy environments
            }

            if (shouldScroll) {
                const playgroundSection = document.getElementById("playground");
                if (playgroundSection) {
                    playgroundSection.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        }

        // Toggle Playground Dropdown smoothly when heading itself is clicked
        if (navPlaygroundHubLink) {
            navPlaygroundHubLink.addEventListener("click", (e) => {
                const isContactPage = window.location.pathname.endsWith("contact.php");
                if (isContactPage) {
                    // Navigate to index playground
                    return;
                }

                e.preventDefault();
                if (!navGroupPlayground) return;

                const willBeExpanded = !navGroupPlayground.classList.contains("is-expanded");
                navGroupPlayground.classList.toggle("is-expanded", willBeExpanded);
                navPlaygroundHubLink.setAttribute("aria-expanded", String(willBeExpanded));

                // If expanded, highlight Playground nav item and ensure current game is visible
                if (willBeExpanded) {
                    document.querySelectorAll(".nav-item").forEach((item) => {
                        item.classList.toggle("active", item.getAttribute("data-section") === "playground");
                    });
                    switchGame(currentGameKey || "build-pc", false);
                }
            });
        }

        // Direct one-click game selection from the Sidebar Playground submenu
        sidebarSubItems.forEach((subLink) => {
            subLink.addEventListener("click", (e) => {
                const isContactPage = window.location.pathname.endsWith("contact.php");
                if (isContactPage) {
                    return; // Let standard link navigation open index.php?game=...#playground
                }

                e.preventDefault();
                const targetGame = subLink.getAttribute("data-open-game");
                if (targetGame) {
                    switchGame(targetGame, true);
                }
                closeMobileDrawerIfOpen();
            });
        });

        // Mount Circuit Connect UI inside index.php
        if (circuitConnectMount && window.CircuitConnectUI) {
            window.CircuitConnectUI.init(circuitConnectMount, {
                onReturnToPlayground: () => switchGame(currentGameKey, false)
            });
        }

        // Auto-select game based on URL (?game=...) or hash on initial load
        try {
            const params = new URLSearchParams(window.location.search);
            const queryGame = params.get("game");
            const hash = (window.location.hash || "").replace("#", "");

            const validGames = ["build-pc", "fix-pc", "circuit-connect", "snake"];

            if (validGames.includes(queryGame)) {
                switchGame(queryGame, hash === "playground");
            } else if (validGames.includes(hash)) {
                switchGame(hash, true);
            } else if (hash === "playground") {
                switchGame("build-pc", true);
            } else {
                // Default: build-pc view is active in the DOM
                setActiveSubmenuGame("build-pc");
            }
        } catch (err) {
            setActiveSubmenuGame("build-pc");
        }

        // Expose PlaygroundManager API globally for any component
        window.PlaygroundManager = {
            switchGame: switchGame,
            getCurrentGame: () => currentGameKey,
            expandDropdown: () => {
                if (navGroupPlayground) navGroupPlayground.classList.add("is-expanded");
                if (navPlaygroundHubLink) navPlaygroundHubLink.setAttribute("aria-expanded", "true");
            },
            collapseDropdown: () => {
                if (navGroupPlayground) navGroupPlayground.classList.remove("is-expanded");
                if (navPlaygroundHubLink) navPlaygroundHubLink.setAttribute("aria-expanded", "false");
            }
        };
    });
})();
