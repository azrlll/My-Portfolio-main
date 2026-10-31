// ============================================================================
// MINIMAL SNAKE — CLASSIC ARCADE SIMULATOR
// Fully functional monochrome arcade game featuring:
// - 3 Difficulty Modes (Easy: 180ms/10pts, Intermediate: 120ms/20pts, Hard: 75ms/30pts)
// - Persistent separate high scores via localStorage
// - Collision detection (wall & self)
// - Safe food spawning outside snake
// - Pause / Resume & Restart
// - Keyboard (Arrows / WASD) & Mobile Touch D-Pad + Swipe Controls
// ============================================================================

(function () {
    "use strict";

    const GRID_SIZE = 20; // 20x20 grid
    const CANVAS_WIDTH = 400;
    const CANVAS_HEIGHT = 400;
    const CELL_SIZE = CANVAS_WIDTH / GRID_SIZE; // 20px per cell

    const DIFFICULTIES = {
        easy: {
            name: "EASY",
            speedMs: 180,
            pointsPerFood: 10,
            storageKey: "kc_snake_best_easy"
        },
        intermediate: {
            name: "INTERMEDIATE",
            speedMs: 120,
            pointsPerFood: 20,
            storageKey: "kc_snake_best_intermediate"
        },
        hard: {
            name: "HARD",
            speedMs: 75,
            pointsPerFood: 30,
            storageKey: "kc_snake_best_hard"
        }
    };

    let currentDifficulty = "intermediate";
    let score = 0;
    let bestScores = {
        easy: 0,
        intermediate: 0,
        hard: 0
    };

    let gameState = "idle"; // "idle" | "running" | "paused" | "game_over"
    let gameLoopTimer = null;

    // Snake representation: array of {x, y}
    let snake = [];
    let direction = { x: 1, y: 0 };
    let inputQueue = [];

    // Food representation: {x, y}
    let food = { x: 14, y: 10 };

    let isNewHighScore = false;

    // DOM Elements
    let canvas, ctx;
    let scoreEl, bestEl, modeLabelEl;
    let diffButtons;
    let btnActionPause, btnPauseText, btnActionRestart;
    let startOverlay, pauseOverlay, gameOverOverlay;
    let btnOverlayStart, btnOverlayResume, btnOverlayRestart;
    let goFinalScoreEl, goBestScoreEl, goNewRecordBanner;
    let dpadUp, dpadDown, dpadLeft, dpadRight;
    let hubView, snakeView;

    // ------------------------------------------------------------------------
    // STORAGE & PERSISTENCE
    // ------------------------------------------------------------------------
    function loadHighScores() {
        Object.keys(DIFFICULTIES).forEach((diff) => {
            try {
                const saved = localStorage.getItem(DIFFICULTIES[diff].storageKey);
                bestScores[diff] = saved !== null ? Math.max(0, parseInt(saved, 10) || 0) : 0;
            } catch (e) {
                bestScores[diff] = 0;
            }
        });
    }

    function saveHighScore(diff, val) {
        try {
            localStorage.setItem(DIFFICULTIES[diff].storageKey, String(val));
        } catch (e) {
            // Ignore storage errors in private mode
        }
    }

    // ------------------------------------------------------------------------
    // BOARD & FOOD SPAWNING
    // ------------------------------------------------------------------------
    function resetSnake() {
        const startY = 10;
        snake = [
            { x: 8, y: startY },
            { x: 7, y: startY },
            { x: 6, y: startY }
        ];
        direction = { x: 1, y: 0 };
        inputQueue = [];
    }

    function spawnFood() {
        let attempts = 0;
        let newX, newY, onSnake;
        do {
            newX = Math.floor(Math.random() * GRID_SIZE);
            newY = Math.floor(Math.random() * GRID_SIZE);
            onSnake = snake.some((seg) => seg.x === newX && seg.y === newY);
            attempts++;
        } while (onSnake && attempts < 1000);

        food = { x: newX, y: newY };
    }

    // ------------------------------------------------------------------------
    // GAME CONTROL FUNCTIONS
    // ------------------------------------------------------------------------
    function updateScoreUI() {
        if (scoreEl) scoreEl.textContent = String(score);
        if (bestEl) bestEl.textContent = String(bestScores[currentDifficulty]);
        if (modeLabelEl) modeLabelEl.textContent = DIFFICULTIES[currentDifficulty].name;
    }

    function startGame() {
        if (gameState === "running") return;

        score = 0;
        isNewHighScore = false;
        resetSnake();
        spawnFood();
        updateScoreUI();

        if (startOverlay) startOverlay.hidden = true;
        if (pauseOverlay) pauseOverlay.hidden = true;
        if (gameOverOverlay) gameOverOverlay.hidden = true;

        if (btnActionPause) {
            btnActionPause.disabled = false;
            btnActionPause.classList.remove("btn-primary");
            btnActionPause.classList.add("btn-secondary");
        }
        if (btnPauseText) btnPauseText.textContent = "PAUSE";

        gameState = "running";
        scheduleNextTick();
        render();
    }

    function pauseGame() {
        if (gameState !== "running") return;

        gameState = "paused";
        if (gameLoopTimer) {
            clearTimeout(gameLoopTimer);
            gameLoopTimer = null;
        }

        if (pauseOverlay) pauseOverlay.hidden = false;
        if (btnPauseText) btnPauseText.textContent = "RESUME";
        if (btnActionPause) {
            btnActionPause.classList.remove("btn-secondary");
            btnActionPause.classList.add("btn-primary");
        }
        render();
    }

    function resumeGame() {
        if (gameState !== "paused") return;

        gameState = "running";
        if (pauseOverlay) pauseOverlay.hidden = true;
        if (btnPauseText) btnPauseText.textContent = "PAUSE";
        if (btnActionPause) {
            btnActionPause.classList.remove("btn-primary");
            btnActionPause.classList.add("btn-secondary");
        }

        scheduleNextTick();
        render();
    }

    function togglePause() {
        if (gameState === "running") {
            pauseGame();
        } else if (gameState === "paused") {
            resumeGame();
        }
    }

    function restartGame() {
        if (gameLoopTimer) {
            clearTimeout(gameLoopTimer);
            gameLoopTimer = null;
        }
        startGame();
    }

    function gameOver() {
        gameState = "game_over";
        if (gameLoopTimer) {
            clearTimeout(gameLoopTimer);
            gameLoopTimer = null;
        }

        if (btnActionPause) {
            btnActionPause.disabled = true;
            btnActionPause.classList.remove("btn-primary");
            btnActionPause.classList.add("btn-secondary");
        }
        if (btnPauseText) btnPauseText.textContent = "PAUSE";

        if (goFinalScoreEl) goFinalScoreEl.textContent = String(score);
        if (goBestScoreEl) goBestScoreEl.textContent = String(bestScores[currentDifficulty]);
        if (goNewRecordBanner) goNewRecordBanner.hidden = !isNewHighScore;

        if (gameOverOverlay) gameOverOverlay.hidden = false;
        render();
    }

    function setDifficulty(diff) {
        if (!DIFFICULTIES[diff]) return;

        // If game is actively running, confirm or restart to preserve speed & score integrity
        if (gameState === "running" && score > 0) {
            const confirmed = window.confirm(
                `Switching difficulty to ${DIFFICULTIES[diff].name} will restart the current game. Continue?`
            );
            if (!confirmed) return;
        }

        currentDifficulty = diff;

        diffButtons.forEach((btn) => {
            btn.classList.toggle("active", btn.getAttribute("data-diff") === diff);
        });

        updateScoreUI();

        if (gameState === "running" || gameState === "paused" || gameState === "game_over") {
            restartGame();
        } else {
            render();
        }
    }

    // ------------------------------------------------------------------------
    // CORE GAME LOOP & TICK
    // ------------------------------------------------------------------------
    function scheduleNextTick() {
        if (gameState !== "running") return;
        const speed = DIFFICULTIES[currentDifficulty].speedMs;
        gameLoopTimer = setTimeout(gameTick, speed);
    }

    function gameTick() {
        if (gameState !== "running") return;

        // Process buffered input
        if (inputQueue.length > 0) {
            const nextDir = inputQueue.shift();
            // Prevent 180-degree instant reversal
            if (nextDir.x !== -direction.x || nextDir.y !== -direction.y) {
                direction = nextDir;
            }
        }

        // Calculate next head position
        const head = snake[0];
        const nextX = head.x + direction.x;
        const nextY = head.y + direction.y;

        // 1. Wall collision check
        if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
            gameOver();
            return;
        }

        // 2. Self collision check
        const selfHit = snake.some((seg, idx) => {
            // Check against all body parts except the very tail if it's going to move
            return seg.x === nextX && seg.y === nextY;
        });

        if (selfHit) {
            gameOver();
            return;
        }

        // Create new head
        const newHead = { x: nextX, y: nextY };
        snake.unshift(newHead);

        // 3. Food check
        if (nextX === food.x && nextY === food.y) {
            // Food eaten: gain score and grow
            const pts = DIFFICULTIES[currentDifficulty].pointsPerFood;
            score += pts;

            if (score > bestScores[currentDifficulty]) {
                bestScores[currentDifficulty] = score;
                isNewHighScore = true;
                saveHighScore(currentDifficulty, score);
            }

            updateScoreUI();
            spawnFood();
        } else {
            // Normal step: remove tail segment
            snake.pop();
        }

        render();
        scheduleNextTick();
    }

    // ------------------------------------------------------------------------
    // CANVAS RENDERING (Matching the reference aesthetic)
    // ------------------------------------------------------------------------
    function render() {
        if (!ctx) return;

        // Clear canvas
        ctx.fillStyle = "#0c0f1a"; // Deep arcade navy matching image
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw subtle grid lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
        ctx.lineWidth = 1;

        for (let x = 0; x <= CANVAS_WIDTH; x += CELL_SIZE) {
            ctx.beginPath();
            ctx.moveTo(x + 0.5, 0);
            ctx.lineTo(x + 0.5, CANVAS_HEIGHT);
            ctx.stroke();
        }
        for (let y = 0; y <= CANVAS_HEIGHT; y += CELL_SIZE) {
            ctx.beginPath();
            ctx.moveTo(0, y + 0.5);
            ctx.lineTo(CANVAS_WIDTH, y + 0.5);
            ctx.stroke();
        }

        // Draw Food (glowing circular dot)
        if (food) {
            const foodCenterX = food.x * CELL_SIZE + CELL_SIZE / 2;
            const foodCenterY = food.y * CELL_SIZE + CELL_SIZE / 2;
            const foodRadius = CELL_SIZE / 2 - 3;

            // Outer soft glow
            const glowGradient = ctx.createRadialGradient(
                foodCenterX, foodCenterY, 2,
                foodCenterX, foodCenterY, CELL_SIZE * 0.9
            );
            glowGradient.addColorStop(0, "rgba(244, 63, 94, 0.5)");
            glowGradient.addColorStop(1, "rgba(244, 63, 94, 0)");
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(foodCenterX, foodCenterY, CELL_SIZE * 0.9, 0, Math.PI * 2);
            ctx.fill();

            // Core food circle
            ctx.fillStyle = "#f43f5e"; // Bright coral pink
            ctx.beginPath();
            ctx.arc(foodCenterX, foodCenterY, foodRadius, 0, Math.PI * 2);
            ctx.fill();

            // Inner specular highlight
            ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
            ctx.beginPath();
            ctx.arc(foodCenterX - 2, foodCenterY - 2, foodRadius * 0.35, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw Snake Segments
        const segmentRadius = 4;
        const segmentInset = 1.5;

        snake.forEach((seg, idx) => {
            const segX = seg.x * CELL_SIZE + segmentInset;
            const segY = seg.y * CELL_SIZE + segmentInset;
            const segW = CELL_SIZE - segmentInset * 2;
            const segH = CELL_SIZE - segmentInset * 2;

            ctx.fillStyle = "#34d399"; // Vibrant green from reference

            // Draw rounded rectangle for body segment
            drawRoundedRect(ctx, segX, segY, segW, segH, segmentRadius);
            ctx.fill();

            // Draw head details (eyes)
            if (idx === 0) {
                drawSnakeEyes(ctx, segX, segY, segW, segH, direction);
            }
        });
    }

    function drawRoundedRect(context, x, y, width, height, radius) {
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(x + width - radius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + radius);
        context.lineTo(x + width, y + height - radius);
        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        context.lineTo(x + radius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.closePath();
    }

    function drawSnakeEyes(context, x, y, width, height, dir) {
        // Two cute white square eyes positioned towards movement direction
        const eyeSize = 3;
        context.fillStyle = "#ffffff";

        let eye1X, eye1Y, eye2X, eye2Y;

        if (dir.x === 1) { // Moving Right
            eye1X = x + width - 5;
            eye1Y = y + 4;
            eye2X = x + width - 5;
            eye2Y = y + height - 7;
        } else if (dir.x === -1) { // Moving Left
            eye1X = x + 2;
            eye1Y = y + 4;
            eye2X = x + 2;
            eye2Y = y + height - 7;
        } else if (dir.y === -1) { // Moving Up
            eye1X = x + 4;
            eye1Y = y + 2;
            eye2X = x + width - 7;
            eye2Y = y + 2;
        } else { // Moving Down
            eye1X = x + 4;
            eye1Y = y + height - 5;
            eye2X = x + width - 7;
            eye2Y = y + height - 5;
        }

        context.fillRect(eye1X, eye1Y, eyeSize, eyeSize);
        context.fillRect(eye2X, eye2Y, eyeSize, eyeSize);
    }

    // ------------------------------------------------------------------------
    // INPUT HANDLING (Keyboard, Virtual D-Pad & Touch Gestures)
    // ------------------------------------------------------------------------
    function queueDirection(newDir) {
        if (gameState === "idle") {
            startGame();
        } else if (gameState === "paused") {
            resumeGame();
        }

        if (gameState !== "running") return;

        // Check against the last buffered direction or current direction
        const lastDir = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : direction;

        // Cannot move directly backward
        if (newDir.x === -lastDir.x && newDir.y === -lastDir.y) return;
        // Cannot queue identical direction
        if (newDir.x === lastDir.x && newDir.y === lastDir.y) return;

        if (inputQueue.length < 3) {
            inputQueue.push(newDir);
        }
    }

    function handleKeyDown(e) {
        // Only capture game keys if the snake view is currently visible
        if (!snakeView || snakeView.hidden) return;

        const code = e.code;
        const key = e.key.toLowerCase();

        if (code === "ArrowUp" || key === "w") {
            e.preventDefault();
            queueDirection({ x: 0, y: -1 });
        } else if (code === "ArrowDown" || key === "s") {
            e.preventDefault();
            queueDirection({ x: 0, y: 1 });
        } else if (code === "ArrowLeft" || key === "a") {
            e.preventDefault();
            queueDirection({ x: -1, y: 0 });
        } else if (code === "ArrowRight" || key === "d") {
            e.preventDefault();
            queueDirection({ x: 1, y: 0 });
        } else if (code === "Space" || key === "p" || code === "Escape") {
            e.preventDefault();
            if (gameState === "running" || gameState === "paused") {
                togglePause();
            } else if (gameState === "idle") {
                startGame();
            }
        }
    }

    // Touch Swipe Support on Canvas
    function setupTouchSwipe() {
        if (!canvas) return;

        let touchStartX = 0;
        let touchStartY = 0;
        const MIN_SWIPE_DIST = 20;

        canvas.addEventListener("touchstart", (e) => {
            if (e.touches && e.touches[0]) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        canvas.addEventListener("touchend", (e) => {
            if (!e.changedTouches || !e.changedTouches[0]) return;
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (Math.abs(dx) > MIN_SWIPE_DIST) {
                    queueDirection(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
                }
            } else {
                if (Math.abs(dy) > MIN_SWIPE_DIST) {
                    queueDirection(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
                }
            }
        }, { passive: true });
    }

    // ------------------------------------------------------------------------
    // PLAYGROUND HUB INTEGRATION & CLEANUP
    // ------------------------------------------------------------------------
    function cleanup() {
        if (gameLoopTimer) {
            clearTimeout(gameLoopTimer);
            gameLoopTimer = null;
        }
        gameState = "idle";
        if (startOverlay) startOverlay.hidden = false;
        if (pauseOverlay) pauseOverlay.hidden = true;
        if (gameOverOverlay) gameOverOverlay.hidden = true;
        if (btnActionPause) {
            btnActionPause.disabled = true;
            btnActionPause.classList.remove("btn-primary");
            btnActionPause.classList.add("btn-secondary");
        }
    }

    function showHub() {
        cleanup();
        if (hubView) hubView.hidden = false;
        if (snakeView) snakeView.hidden = true;

        const buildPcView = document.getElementById("buildPcGameView");
        const fixPcView = document.getElementById("fixPcGameView");
        const circuitConnectView = document.getElementById("circuitConnectGameView");

        if (buildPcView) buildPcView.hidden = true;
        if (fixPcView) fixPcView.hidden = true;
        if (circuitConnectView) circuitConnectView.hidden = true;

        document.querySelectorAll(".nav-subitem[data-open-game]").forEach((item) => {
            item.classList.remove("active");
        });
    }

    function openSnakeGame() {
        // Clean up any running simulators
        if (window.CircuitConnectEngine && typeof window.CircuitConnectEngine.cleanup === "function") {
            window.CircuitConnectEngine.cleanup();
        }
        if (window.FixPCGameEngine && typeof window.FixPCGameEngine.cleanup === "function") {
            window.FixPCGameEngine.cleanup();
        }

        const buildPcView = document.getElementById("buildPcGameView");
        const fixPcView = document.getElementById("fixPcGameView");
        const circuitConnectView = document.getElementById("circuitConnectGameView");

        if (hubView) hubView.hidden = true;
        if (buildPcView) buildPcView.hidden = true;
        if (fixPcView) fixPcView.hidden = true;
        if (circuitConnectView) circuitConnectView.hidden = true;
        if (snakeView) snakeView.hidden = false;

        document.querySelectorAll(".nav-subitem[data-open-game]").forEach((item) => {
            item.classList.toggle("active", item.getAttribute("data-open-game") === "snake");
        });

        // Set up initial state and canvas
        resetSnake();
        spawnFood();
        updateScoreUI();
        render();
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------
    function init() {
        canvas = document.getElementById("snakeCanvas");
        if (!canvas) return;

        ctx = canvas.getContext("2d");

        // Set exact dimensions
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        // UI references
        scoreEl = document.getElementById("snakeScore");
        bestEl = document.getElementById("snakeBest");
        modeLabelEl = document.getElementById("snakeModeLabel");
        diffButtons = Array.from(document.querySelectorAll(".snake-diff-btn"));

        btnActionPause = document.getElementById("btnSnakeActionPause");
        btnPauseText = document.getElementById("btnSnakePauseText");
        btnActionRestart = document.getElementById("btnSnakeActionRestart");

        startOverlay = document.getElementById("snakeStartOverlay");
        pauseOverlay = document.getElementById("snakePauseOverlay");
        gameOverOverlay = document.getElementById("snakeGameOverOverlay");

        btnOverlayStart = document.getElementById("btnOverlayStart");
        btnOverlayResume = document.getElementById("btnOverlayResume");
        btnOverlayRestart = document.getElementById("btnOverlayRestart");

        goFinalScoreEl = document.getElementById("goFinalScore");
        goBestScoreEl = document.getElementById("goBestScore");
        goNewRecordBanner = document.getElementById("goNewRecordBanner");

        dpadUp = document.getElementById("btnDpadUp");
        dpadDown = document.getElementById("btnDpadDown");
        dpadLeft = document.getElementById("btnDpadLeft");
        dpadRight = document.getElementById("btnDpadRight");

        hubView = document.getElementById("playgroundHubView");
        snakeView = document.getElementById("snakeGameView");

        const btnPlaySnake = document.getElementById("btnPlaySnake");
        const btnBackFromSnake = document.getElementById("btnBackFromSnake");

        loadHighScores();
        updateScoreUI();
        resetSnake();
        spawnFood();
        render();

        // Bind Hub & Navigation
        if (btnPlaySnake) btnPlaySnake.addEventListener("click", openSnakeGame);
        if (btnBackFromSnake) btnBackFromSnake.addEventListener("click", showHub);

        // Bind Overlay Buttons
        if (btnOverlayStart) btnOverlayStart.addEventListener("click", startGame);
        if (btnOverlayResume) btnOverlayResume.addEventListener("click", resumeGame);
        if (btnOverlayRestart) btnOverlayRestart.addEventListener("click", restartGame);

        // Bind Action Bar Buttons
        if (btnActionPause) btnActionPause.addEventListener("click", togglePause);
        if (btnActionRestart) btnActionRestart.addEventListener("click", restartGame);

        // Bind Difficulty Mode Buttons
        diffButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const diff = btn.getAttribute("data-diff");
                setDifficulty(diff);
            });
        });

        // Bind Virtual D-Pad Touch Buttons (with touch-action preventDefault)
        if (dpadUp) {
            dpadUp.addEventListener("pointerdown", (e) => {
                e.preventDefault();
                queueDirection({ x: 0, y: -1 });
            });
        }
        if (dpadDown) {
            dpadDown.addEventListener("pointerdown", (e) => {
                e.preventDefault();
                queueDirection({ x: 0, y: 1 });
            });
        }
        if (dpadLeft) {
            dpadLeft.addEventListener("pointerdown", (e) => {
                e.preventDefault();
                queueDirection({ x: -1, y: 0 });
            });
        }
        if (dpadRight) {
            dpadRight.addEventListener("pointerdown", (e) => {
                e.preventDefault();
                queueDirection({ x: 1, y: 0 });
            });
        }

        // Setup Touch Swipe
        setupTouchSwipe();

        // Keyboard Event Listener
        window.addEventListener("keydown", handleKeyDown);

        // Sidebar link listener
        document.querySelectorAll('.nav-subitem[data-open-game="snake"]').forEach((item) => {
            item.addEventListener("click", openSnakeGame);
        });

        // Auto-open if query param ?game=snake
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get("game") === "snake") {
                openSnakeGame();
            }
        } catch (e) {
            // Ignore URLSearchParams error
        }
    }

    // Expose API for playground hub coordination
    window.MinimalSnakeGame = {
        init: init,
        cleanup: cleanup,
        openGame: openSnakeGame,
        showHub: showHub
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
