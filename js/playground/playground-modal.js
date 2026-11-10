/**
 * Playground Modal Manager & Navigation Coordinator
 * Kevin's Hardware Studio Portfolio
 * Coordinates opening, closing, and switching the two playground games:
 *   01 - TypeKalang (Monkeytype-inspired typing speed game)
 *   02 - Minimal Snake (Classic arcade game)
 */
(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        // Modal Container & Controls
        const playgroundModal = document.getElementById("playgroundModal");
        const playgroundModalCloseBtn = document.getElementById("playgroundModalCloseBtn");
        const playgroundModalExitBtn = document.getElementById("playgroundModalExitBtn");
        const playgroundModalBadge = document.getElementById("playgroundModalBadge");
        const playgroundModalTitle = document.getElementById("playgroundModalTitle");
        const playgroundModalDesc = document.getElementById("playgroundModalDesc");

        // Game Views
        const typekalangView = document.getElementById("typekalangGameView");
        const snakeView = document.getElementById("snakeGameView");

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
            "typekalang": {
                badge: "PLAYGROUND / GAME 01",
                title: "TypeKalang",
                desc: "Type your way through a quick challenge and see how fast you can go.",
                init: () => {
                    if (window.TypeKalangGame && typeof window.TypeKalangGame.openGame === "function") {
                        window.TypeKalangGame.openGame();
                    }
                },
                cleanup: () => {
                    if (window.TypeKalangGame && typeof window.TypeKalangGame.cleanup === "function") {
                        window.TypeKalangGame.cleanup();
                    }
                }
            },
            "snake": {
                badge: "PLAYGROUND / GAME 02",
                title: "Minimal Snake",
                desc: "Play the classic Snake game and try to beat your best score.",
                init: () => {
                    if (window.MinimalSnakeGame && typeof window.MinimalSnakeGame.openGame === "function") {
                        window.MinimalSnakeGame.openGame();
                    }
                },
                cleanup: () => {
                    if (window.MinimalSnakeGame && typeof window.MinimalSnakeGame.cleanup === "function") {
                        window.MinimalSnakeGame.cleanup();
                    }
                }
            }
        };

        // --------------------------------------------------------------------
        // 2. CLEANUP ACTIVE SESSIONS & STOP LOOPS / TIMERS
        // --------------------------------------------------------------------
        function cleanupAllGames() {
            if (GAME_META.typekalang && typeof GAME_META.typekalang.cleanup === "function") {
                try { GAME_META.typekalang.cleanup(); } catch (e) {}
            }
            if (GAME_META.snake && typeof GAME_META.snake.cleanup === "function") {
                try { GAME_META.snake.cleanup(); } catch (e) {}
            }
        }

        // --------------------------------------------------------------------
        // 3. SET ACTIVE SIDEBAR SUBMENU INDICATOR
        // --------------------------------------------------------------------
        function setActiveSubmenuGame(gameKey) {
            sidebarSubItems.forEach((item) => {
                const target = item.getAttribute("data-open-game");
                if (target === gameKey) {
                    item.classList.add("active");
                } else {
                    item.classList.remove("active");
                }
            });
        }

        // --------------------------------------------------------------------
        // 4. OPEN PLAYGROUND MODAL
        // --------------------------------------------------------------------
        function openPlaygroundModal(gameKey, triggerBtn = null) {
            if (!playgroundModal) return;

            if (triggerBtn) lastTriggerElement = triggerBtn;

            // Default to typekalang if key is invalid or unrecognized
            if (!GAME_META[gameKey]) {
                gameKey = "typekalang";
            }

            // End any currently running game session first
            cleanupAllGames();

            // Hide all game views
            if (typekalangView) typekalangView.hidden = true;
            if (snakeView) snakeView.hidden = true;

            // Update modal header information
            const meta = GAME_META[gameKey];
            if (playgroundModalBadge) playgroundModalBadge.textContent = meta.badge;
            if (playgroundModalTitle) playgroundModalTitle.textContent = meta.title;
            if (playgroundModalDesc && meta.desc) playgroundModalDesc.textContent = meta.desc;

            // Show selected game view
            switch (gameKey) {
                case "snake":
                    if (snakeView) snakeView.hidden = false;
                    break;
                case "typekalang":
                default:
                    if (typekalangView) typekalangView.hidden = false;
                    break;
            }

            // Start a fresh game session
            currentGameKey = gameKey;
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
                if (typekalangView) typekalangView.hidden = true;
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
                const isExpanded = navGroupPlayground && navGroupPlayground.classList.contains("is-expanded");
                if (isExpanded) {
                    navGroupPlayground.classList.remove("is-expanded");
                    navPlaygroundHubLink.setAttribute("aria-expanded", "false");
                } else {
                    if (navGroupPlayground) navGroupPlayground.classList.add("is-expanded");
                    navPlaygroundHubLink.setAttribute("aria-expanded", "true");
                }
            });
        }

        // Close dropdown when mouse leaves the playground menu group
        if (navGroupPlayground) {
            navGroupPlayground.addEventListener("mouseleave", () => {
                navGroupPlayground.classList.remove("is-expanded");
                if (navPlaygroundHubLink) {
                    navPlaygroundHubLink.setAttribute("aria-expanded", "false");
                    if (typeof navPlaygroundHubLink.blur === "function") navPlaygroundHubLink.blur();
                }
            });
        }

        // Helper to close mobile drawer when link clicked
        function closeMobileDrawerIfOpen() {
            const sidebar = document.getElementById("sidebar");
            const backdrop = document.getElementById("sidebarBackdrop");
            const toggle = document.getElementById("mobileMenuToggle");
            if (sidebar && sidebar.classList.contains("is-open")) {
                sidebar.classList.remove("is-open");
                if (backdrop) backdrop.classList.remove("is-active");
                if (toggle) toggle.setAttribute("aria-expanded", "false");
                document.body.style.overflow = "";
            }
        }

        // --------------------------------------------------------------------
        // 8. SIDEBAR SUBITEMS CLICK ACTION: OPEN POPUP MODAL
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
        // 9. HANDLE INCOMING URL PARAMETERS (?game=...) SAFELY
        // --------------------------------------------------------------------
        try {
            const params = new URLSearchParams(window.location.search);
            let queryGame = params.get("game");
            const hash = (window.location.hash || "").replace("#", "");
            const validGames = ["typekalang", "snake"];

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

            // Map old game links to typekalang gracefully
            if (queryGame && ["build-pc", "fix-pc", "circuit-connect"].includes(queryGame)) {
                queryGame = "typekalang";
            }
            if (hash && ["build-pc", "fix-pc", "circuit-connect"].includes(hash)) {
                queryGame = "typekalang";
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
        // 10. EXPOSE PLAYGROUND MANAGER GLOBALLY
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
