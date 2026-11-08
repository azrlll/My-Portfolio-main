// ============================================================================
// PLAYGROUND MODAL MANAGER & SIDEBAR NAVIGATION COORDINATOR
// Manages opening, closing, and switching the four interactive games inside a
// smooth, cinematic modal overlay above the portfolio content:
//   01 - Build a PC
//   02 - Fix the PC
//   03 - Circuit Connect
//   04 - Minimal Snake
//
// Ensures zero reserved homepage space when closed, complete cleanup of
// timers/loops/listeners on exit, mobile & desktop responsiveness, and clean URLs.
// ============================================================================

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        // Modal Container & Controls
        const playgroundModal = document.getElementById("playgroundModal");
        const playgroundModalCloseBtn = document.getElementById("playgroundModalCloseBtn");
        const playgroundModalExitBtn = document.getElementById("playgroundModalExitBtn");
        const playgroundModalBadge = document.getElementById("playgroundModalBadge");
        const playgroundModalTitle = document.getElementById("playgroundModalTitle");

        // Game Views
        const buildPcView = document.getElementById("buildPcGameView");
        const fixPcView = document.getElementById("fixPcGameView");
        const circuitConnectView = document.getElementById("circuitConnectGameView");
        const snakeView = document.getElementById("snakeGameView");
        const circuitConnectMount = document.getElementById("circuitConnectAppRoot");

        // Sidebar Navigation
        const navGroupPlayground = document.getElementById("navGroupPlayground") || document.querySelector(".nav-group-playground");
        const navPlaygroundHubLink = document.getElementById("navPlaygroundHubLink");
        const sidebarSubItems = document.querySelectorAll(".nav-subitem[data-open-game]");

        let currentGameKey = null;
        let lastTriggerElement = null;

        // --------------------------------------------------------------------
        // 1. GAME METADATA & INITIALIZERS
        // --------------------------------------------------------------------
        const GAME_META = {
            "build-pc": {
                badge: "PLAYGROUND / GAME 01",
                title: "Build a PC",
                init: () => {
                    if (window.PCSimulator && typeof window.PCSimulator.restartGame === "function") {
                        window.PCSimulator.restartGame();
                    } else if (window.PCSimState && typeof window.PCSimState.resetState === "function") {
                        window.PCSimState.resetState();
                    }
                }
            },
            "fix-pc": {
                badge: "PLAYGROUND / GAME 02",
                title: "Fix the PC",
                init: () => {
                    if (window.FixPCUI && typeof window.FixPCUI.renderMainMenu === "function") {
                        window.FixPCUI.renderMainMenu();
                    }
                }
            },
            "circuit-connect": {
                badge: "PLAYGROUND / GAME 03",
                title: "Circuit Connect",
                init: () => {
                    if (window.CircuitConnectUI && typeof window.CircuitConnectUI.renderMainMenu === "function") {
                        window.CircuitConnectUI.renderMainMenu();
                    }
                }
            },
            "snake": {
                badge: "PLAYGROUND / GAME 04",
                title: "Minimal Snake",
                init: () => {
                    if (window.MinimalSnakeGame && typeof window.MinimalSnakeGame.openGame === "function") {
                        window.MinimalSnakeGame.openGame();
                    }
                }
            }
        };

        // --------------------------------------------------------------------
        // 2. CLEANUP ACTIVE SESSIONS & STOP LOOPS / TIMERS
        // --------------------------------------------------------------------
        function cleanupAllGames() {
            // Build a PC cleanup
            if (window.PCSimulator && typeof window.PCSimulator.cleanup === "function") {
                try { window.PCSimulator.cleanup(); } catch (e) { /* ignore */ }
            } else if (window.PCSimState && typeof window.PCSimState.resetState === "function") {
                try { window.PCSimState.resetState(); } catch (e) { /* ignore */ }
            }

            // Fix the PC cleanup
            if (window.FixPCGameEngine && typeof window.FixPCGameEngine.cleanup === "function") {
                try { window.FixPCGameEngine.cleanup(); } catch (e) { /* ignore */ }
            }

            // Circuit Connect cleanup
            if (window.CircuitConnectEngine && typeof window.CircuitConnectEngine.cleanup === "function") {
                try { window.CircuitConnectEngine.cleanup(); } catch (e) { /* ignore */ }
            }

            // Minimal Snake cleanup
            if (window.MinimalSnakeGame && typeof window.MinimalSnakeGame.cleanup === "function") {
                try { window.MinimalSnakeGame.cleanup(); } catch (e) { /* ignore */ }
            }
        }

        // --------------------------------------------------------------------
        // 3. SIDEBAR SUBMENU HIGHLIGHTING & MOBILE DRAWER
        // --------------------------------------------------------------------
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

        // --------------------------------------------------------------------
        // 4. OPEN PLAYGROUND MODAL
        // --------------------------------------------------------------------
        function openPlaygroundModal(gameKey, triggerBtn) {
            if (!playgroundModal) return;
            if (triggerBtn) lastTriggerElement = triggerBtn;

            if (!GAME_META[gameKey]) {
                gameKey = "build-pc";
            }

            // End any currently running game session first
            cleanupAllGames();

            // Hide all game views
            if (buildPcView) buildPcView.hidden = true;
            if (fixPcView) fixPcView.hidden = true;
            if (circuitConnectView) circuitConnectView.hidden = true;
            if (snakeView) snakeView.hidden = true;

            // Update modal header information
            const meta = GAME_META[gameKey];
            if (playgroundModalBadge) playgroundModalBadge.textContent = meta.badge;
            if (playgroundModalTitle) playgroundModalTitle.textContent = meta.title;

            // Show selected game view
            switch (gameKey) {
                case "fix-pc":
                    if (fixPcView) fixPcView.hidden = false;
                    break;
                case "circuit-connect":
                    if (circuitConnectView) circuitConnectView.hidden = false;
                    break;
                case "snake":
                    if (snakeView) snakeView.hidden = false;
                    break;
                case "build-pc":
                default:
                    if (buildPcView) buildPcView.hidden = false;
                    break;
            }

            // Start a fresh game session
            meta.init();
            setActiveSubmenuGame(gameKey);

            // Display modal smoothly with scale and fade animation
            playgroundModal.hidden = false;
            playgroundModal.classList.remove("is-closing");
            requestAnimationFrame(() => {
                playgroundModal.classList.add("is-open");
            });

            // Prevent background page scrolling while playing
            document.body.style.overflow = "hidden";

            // Focus close button for accessibility
            if (playgroundModalCloseBtn && typeof playgroundModalCloseBtn.focus === "function") {
                playgroundModalCloseBtn.focus();
            }
        }

        // --------------------------------------------------------------------
        // 5. CLOSE PLAYGROUND MODAL
        // --------------------------------------------------------------------
        function closePlaygroundModal() {
            if (!playgroundModal || playgroundModal.hidden) return;

            playgroundModal.classList.remove("is-open");
            playgroundModal.classList.add("is-closing");

            // Stop all timers, animations, and game loops immediately
            cleanupAllGames();

            setTimeout(() => {
                playgroundModal.hidden = true;
                playgroundModal.classList.remove("is-closing");

                // Hide all views inside the modal
                if (buildPcView) buildPcView.hidden = true;
                if (fixPcView) fixPcView.hidden = true;
                if (circuitConnectView) circuitConnectView.hidden = true;
                if (snakeView) snakeView.hidden = true;

                // Restore page scroll
                document.body.style.overflow = "";

                // Collapse sidebar playground dropdown and reset indicators
                currentGameKey = null;
                sidebarSubItems.forEach((item) => {
                    item.classList.remove("active");
                    if (typeof item.blur === "function") item.blur();
                });
                if (navGroupPlayground) {
                    navGroupPlayground.classList.remove("is-expanded");
                }
                if (navPlaygroundHubLink) {
                    navPlaygroundHubLink.setAttribute("aria-expanded", "false");
                    if (typeof navPlaygroundHubLink.blur === "function") navPlaygroundHubLink.blur();
                }

                // Clean up any residual URL hashes or query params so address bar remains completely clean
                try {
                    if (window.location.hash || window.location.search) {
                        history.replaceState(null, document.title, window.location.pathname);
                    }
                } catch (e) {}

                // Return focus to trigger element without scrolling the page
                if (lastTriggerElement && typeof lastTriggerElement.focus === "function") {
                    try { lastTriggerElement.focus({ preventScroll: true }); } catch (e) {}
                }
            }, 300);
        }

        // --------------------------------------------------------------------
        // 6. EVENT LISTENERS: CLOSE, EXIT, BACKDROP & ESCAPE KEY
        // --------------------------------------------------------------------
        if (playgroundModalCloseBtn) {
            playgroundModalCloseBtn.addEventListener("click", closePlaygroundModal);
        }

        if (playgroundModalExitBtn) {
            playgroundModalExitBtn.addEventListener("click", closePlaygroundModal);
        }

        if (playgroundModal) {
            playgroundModal.addEventListener("click", (e) => {
                if (e.target === playgroundModal) {
                    closePlaygroundModal();
                }
            });
        }

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && playgroundModal && !playgroundModal.hidden) {
                closePlaygroundModal();
            }
        });

        // --------------------------------------------------------------------
        // 7. SIDEBAR PLAYGROUND DROPDOWN TOGGLE & AUTO-CLOSE
        // --------------------------------------------------------------------
        if (navPlaygroundHubLink) {
            navPlaygroundHubLink.addEventListener("click", (e) => {
                e.preventDefault();
                if (!navGroupPlayground) return;

                const willBeExpanded = !navGroupPlayground.classList.contains("is-expanded");
                navGroupPlayground.classList.toggle("is-expanded", willBeExpanded);
                navPlaygroundHubLink.setAttribute("aria-expanded", String(willBeExpanded));
            });
        }

        // Close dropdown when mouse leaves the playground menu group
        if (navGroupPlayground) {
            navGroupPlayground.addEventListener("mouseleave", () => {
                navGroupPlayground.classList.remove("is-expanded");
                if (navPlaygroundHubLink) {
                    navPlaygroundHubLink.setAttribute("aria-expanded", "false");
                }
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (navGroupPlayground && !navGroupPlayground.contains(e.target)) {
                navGroupPlayground.classList.remove("is-expanded");
                if (navPlaygroundHubLink) {
                    navPlaygroundHubLink.setAttribute("aria-expanded", "false");
                }
            }
        });

        // --------------------------------------------------------------------
        // 8. SIDEBAR GAME SELECTION: OPEN POPUP MODAL
        // --------------------------------------------------------------------
        sidebarSubItems.forEach((subLink) => {
            subLink.addEventListener("click", (e) => {
                e.preventDefault();
                const targetGame = subLink.getAttribute("data-open-game");
                if (targetGame) {
                    openPlaygroundModal(targetGame, subLink);
                }
                // Automatically collapse playground dropdown and blur link
                if (typeof subLink.blur === "function") subLink.blur();
                if (navGroupPlayground) {
                    navGroupPlayground.classList.remove("is-expanded");
                }
                if (navPlaygroundHubLink) {
                    navPlaygroundHubLink.setAttribute("aria-expanded", "false");
                    if (typeof navPlaygroundHubLink.blur === "function") navPlaygroundHubLink.blur();
                }
                closeMobileDrawerIfOpen();
            });
        });

        // --------------------------------------------------------------------
        // 9. MOUNT CIRCUIT CONNECT UI
        // --------------------------------------------------------------------
        if (circuitConnectMount && window.CircuitConnectUI) {
            window.CircuitConnectUI.init(circuitConnectMount, {
                onReturnToPlayground: closePlaygroundModal
            });
        }

        // --------------------------------------------------------------------
        // 10. HANDLE INCOMING URL PARAMETERS (?game=...) SAFELY
        // --------------------------------------------------------------------
        try {
            const params = new URLSearchParams(window.location.search);
            let queryGame = params.get("game");
            const hash = (window.location.hash || "").replace("#", "");
            const validGames = ["build-pc", "fix-pc", "circuit-connect", "snake"];

            // Check if game was stored in sessionStorage by earlier Clean URL sanitizer
            if (!queryGame) {
                try {
                    const savedGame = sessionStorage.getItem("active_playground_game");
                    if (savedGame) {
                        sessionStorage.removeItem("active_playground_game");
                        queryGame = savedGame;
                    }
                } catch (e) {}
            }

            if (queryGame && validGames.includes(queryGame)) {
                openPlaygroundModal(queryGame);
            } else if (validGames.includes(hash)) {
                openPlaygroundModal(hash);
            }

            // Instantly clean query parameters and hash so address bar stays pristine
            if (window.location.search || window.location.hash === "#playground") {
                const cleanParams = new URLSearchParams(window.location.search);
                cleanParams.delete("game");
                cleanParams.delete("i");
                const remaining = cleanParams.toString();
                const cleanUrl = window.location.pathname + (remaining ? "?" + remaining : "") + (window.location.hash === "#playground" ? "" : window.location.hash);
                window.history.replaceState(null, document.title, cleanUrl);
            }
        } catch (err) {
            // Ignore legacy browser errors
        }

        // --------------------------------------------------------------------
        // 11. EXPOSE PLAYGROUND MANAGER GLOBALLY
        // --------------------------------------------------------------------
        window.PlaygroundManager = {
            openModal: openPlaygroundModal,
            closeModal: closePlaygroundModal,
            isModalOpen: () => playgroundModal && !playgroundModal.hidden,
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
