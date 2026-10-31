// ============================================================================
// CIRCUIT CONNECT — USER INTERFACE CONTROLLER
// Renders Main Menu, How to Play, 15-Card Level Select, Achievements, and the
// 3-Panel Interactive Circuit Workbench (Toolbox, Circuit Board, Level Info).
// ============================================================================

window.CircuitConnectUI = (function () {
    "use strict";

    let rootEl = null;
    let onReturnToPlaygroundCallback = null;
    let pendingResetProgressConfirm = false;
    let pendingResetBoardConfirm = false;

    function escapeHtml(str) {
        return String(str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function init(mountElement, options) {
        rootEl = mountElement;
        const opts = options || {};
        onReturnToPlaygroundCallback = typeof opts.onReturnToPlayground === "function" ? opts.onReturnToPlayground : null;
        renderMainMenu();
    }

    // ========================================================================
    // 1. MAIN MENU SCREEN
    // ========================================================================
    function renderMainMenu() {
        if (!rootEl) return;
        pendingResetProgressConfirm = false;
        window.CircuitConnectEngine.cleanup();

        const saved = window.CircuitConnectStorage.loadState();
        const totalLevels = (window.CIRCUIT_CONNECT_LEVELS || []).length;
        const completedCount = saved.completedLevels.length;
        const currentLevel = saved.highestUnlockedLevel || 1;
        const unlockedAchCount = (saved.unlockedAchievements || []).length;

        rootEl.innerHTML = `
            <div class="cc-screen cc-main-menu">
                <div class="cc-top-nav">
                    <button type="button" class="pc-ctrl-btn" id="ccBtnBackToPlayground">&larr; BACK TO PLAYGROUND</button>
                    <div class="cc-menu-badges">
                        <span class="cc-pill">CURRENT LEVEL: <strong>LEVEL ${String(currentLevel).padStart(2, "0")}</strong></span>
                        <span class="cc-pill">COMPLETED: <strong>${completedCount} / ${totalLevels}</strong></span>
                        <span class="cc-pill">ACHIEVEMENTS: <strong>${unlockedAchCount} / 6</strong></span>
                    </div>
                </div>

                <div class="cc-hero-card">
                    <div class="cc-hero-top">
                        <div>
                            <span class="section-eyebrow">PLAYGROUND / GAME 03 • EDUCATIONAL DC SIMULATION</span>
                            <h2 class="cc-hero-title">CIRCUIT CONNECT.</h2>
                            <p class="cc-hero-subtitle">BUILD THE CONNECTION. POWER THE SYSTEM.</p>
                            <p class="cc-hero-desc">Explore the fundamentals of electronics through interactive circuit puzzles.</p>
                        </div>
                    </div>

                    <div class="cc-menu-actions-grid">
                        <button type="button" class="btn btn-primary cc-menu-primary-btn" id="ccBtnPlayLevels">
                            <span>PLAY LEVELS (LEVEL ${String(currentLevel).padStart(2, "0")})</span>
                        </button>
                        <button type="button" class="btn btn-secondary" id="ccBtnLevelSelect">
                            <span>LEVEL SELECT (15)</span>
                        </button>
                        <button type="button" class="btn btn-secondary" id="ccBtnHowToPlay">
                            <span>HOW TO PLAY</span>
                        </button>
                        <button type="button" class="btn btn-secondary" id="ccBtnAchievements">
                            <span>ACHIEVEMENTS (${unlockedAchCount}/6)</span>
                        </button>
                    </div>
                </div>

                <div class="cc-menu-overview-grid">
                    <div class="cc-overview-card">
                        <span class="cc-overview-tag">BEGINNER • LEVELS 01–05</span>
                        <h3 class="cc-overview-title">DC Loops, Switches &amp; Series Circuits</h3>
                        <p class="cc-overview-text">Master closed loops, current-limiting resistors, LED polarity, active piezo buzzers, and series lamp paths.</p>
                    </div>
                    <div class="cc-overview-card">
                        <span class="cc-overview-tag">INTERMEDIATE • LEVELS 06–10</span>
                        <h3 class="cc-overview-title">Parallel Branches &amp; Fault Repair</h3>
                        <p class="cc-overview-text">Build independent parallel lighting branches, master-switched loads, multi-polarity protection paths, and repair faulty wiring.</p>
                    </div>
                    <div class="cc-overview-card">
                        <span class="cc-overview-tag">ADVANCED • LEVELS 11–15</span>
                        <h3 class="cc-overview-title">Ohm's Law, Transistors &amp; Logic Gates</h3>
                        <p class="cc-overview-text">Select optimal resistor values, wire silicon rectifier diodes, switch loads with NPN transistors, and build hardware AND logic.</p>
                    </div>
                </div>
            </div>
        `;

        const backBtn = rootEl.querySelector("#ccBtnBackToPlayground");
        if (backBtn) {
            backBtn.addEventListener("click", () => {
                window.CircuitConnectEngine.cleanup();
                if (onReturnToPlaygroundCallback) onReturnToPlaygroundCallback();
            });
        }

        const playBtn = rootEl.querySelector("#ccBtnPlayLevels");
        if (playBtn) {
            playBtn.addEventListener("click", () => {
                launchLevel(currentLevel);
            });
        }

        const levelSelectBtn = rootEl.querySelector("#ccBtnLevelSelect");
        if (levelSelectBtn) {
            levelSelectBtn.addEventListener("click", renderLevelSelect);
        }

        const howBtn = rootEl.querySelector("#ccBtnHowToPlay");
        if (howBtn) {
            howBtn.addEventListener("click", renderHowToPlay);
        }

        const achBtn = rootEl.querySelector("#ccBtnAchievements");
        if (achBtn) {
            achBtn.addEventListener("click", renderAchievements);
        }
    }

    // ========================================================================
    // 2. HOW TO PLAY SCREEN
    // ========================================================================
    function renderHowToPlay() {
        if (!rootEl) return;
        window.CircuitConnectEngine.cleanup();

        rootEl.innerHTML = `
            <div class="cc-screen">
                <div class="cc-top-nav">
                    <button type="button" class="pc-ctrl-btn" id="ccHowBackBtn">&larr; BACK TO MENU</button>
                    <span class="cc-pill">EDUCATIONAL LOW-VOLTAGE DC SIMULATION</span>
                </div>

                <div class="cc-panel-card">
                    <span class="section-eyebrow">GUIDE &amp; RULES</span>
                    <h2 class="cc-section-heading">How to Play Circuit Connect</h2>
                    <p class="cc-section-sub">Build functional low-voltage DC circuits by wiring component terminals and verifying circuit topology.</p>

                    <div class="cc-howto-grid">
                        <div class="cc-howto-item">
                            <h4>1. Connecting Terminals (Desktop &amp; Mobile)</h4>
                            <p>Click or tap any component terminal button (such as <code>BAT1 [+]</code>) to start a wire. Then click or tap a destination terminal on another component (such as <code>R1 [T1]</code>) to complete the connection. No dragging is required.</p>
                        </div>
                        <div class="cc-howto-item">
                            <h4>2. Removing, Undoing &amp; Resetting Wires</h4>
                            <p>Click any wire directly on the circuit board or click the <code>&times;</code> button next to a connection in the Right Panel to remove it. Use <strong>UNDO</strong> to revert your last wire action or <strong>RESET CIRCUIT</strong> to start the level fresh.</p>
                        </div>
                        <div class="cc-howto-item">
                            <h4>3. Polarity &amp; Current-Limiting Resistors</h4>
                            <p>LEDs, Diodes, and Buzzers are polarized: current must enter <strong>Anode (+) / POS (+)</strong> and exit <strong>Cathode (&minus;) / NEG (&minus;)</strong>. Every LED also requires a series current-limiting resistor to prevent burnout.</p>
                        </div>
                        <div class="cc-howto-item">
                            <h4>4. Interactive Switches &amp; Testing</h4>
                            <p>Toggle SPST switches between <strong>OPEN</strong> and <strong>CLOSED</strong> by clicking the switch button on the component card. When your circuit is complete, press <strong>TEST CIRCUIT</strong> to run the simulation engine.</p>
                        </div>
                        <div class="cc-howto-item">
                            <h4>5. Scoring &amp; Hints</h4>
                            <p>Each level begins at <strong>100 points</strong>. Incorrect circuit tests deduct <strong>&minus;10</strong>, hints deduct <strong>&minus;5</strong>, and unnecessary connections deduct <strong>&minus;2</strong> (minimum score: 0).</p>
                        </div>
                        <div class="cc-howto-item">
                            <h4>6. Safety Notice</h4>
                            <p>This workbench is a simplified educational simulation of low-voltage DC electronics (5V–12V). Never experiment with household mains electricity.</p>
                        </div>
                    </div>

                    <div style="margin-top: 22px;">
                        <button type="button" class="btn btn-primary" id="ccHowStartBtn">
                            <span>GO TO LEVEL SELECT</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        rootEl.querySelector("#ccHowBackBtn").addEventListener("click", renderMainMenu);
        rootEl.querySelector("#ccHowStartBtn").addEventListener("click", renderLevelSelect);
    }

    // ========================================================================
    // 3. LEVEL SELECT SCREEN (15 CARDS)
    // ========================================================================
    function renderLevelSelect() {
        if (!rootEl) return;
        window.CircuitConnectEngine.cleanup();

        const saved = window.CircuitConnectStorage.loadState();
        const levels = window.CIRCUIT_CONNECT_LEVELS || [];
        const completedSet = new Set(saved.completedLevels || []);

        const cardsHtml = levels
            .map((lvl) => {
                const isUnlocked = window.CircuitConnectStorage.isLevelUnlocked(lvl.id);
                const isCompleted = completedSet.has(lvl.id);
                const bestScore = saved.bestScores[lvl.id];
                const bestTime = saved.bestTimes[lvl.id];

                let statusBadge = `<span class="cc-lvl-status is-locked">LOCKED</span>`;
                if (isCompleted) {
                    statusBadge = `<span class="cc-lvl-status is-completed">&#10003; COMPLETED</span>`;
                } else if (isUnlocked) {
                    statusBadge = `<span class="cc-lvl-status is-unlocked">UNLOCKED</span>`;
                }

                return `
                    <article class="cc-level-card ${isUnlocked ? "is-unlocked" : "is-locked"} ${isCompleted ? "is-completed" : ""}">
                        <div>
                            <div class="cc-level-card-top">
                                <span class="cc-level-code">${escapeHtml(lvl.code)}</span>
                                ${statusBadge}
                            </div>
                            <h3 class="cc-level-name">${escapeHtml(lvl.name)}</h3>
                            <span class="cc-diff-tag diff-${lvl.difficulty.toLowerCase()}">${escapeHtml(lvl.difficulty)}</span>
                            <p class="cc-level-obj">${escapeHtml(lvl.objective)}</p>
                        </div>

                        <div class="cc-level-card-footer">
                            <div class="cc-level-metrics">
                                <span>BEST SCORE: <strong>${bestScore !== undefined ? bestScore + " PTS" : "--"}</strong></span>
                                <span>BEST TIME: <strong>${bestTime !== undefined ? window.CircuitConnectScoring.formatTime(bestTime) : "--:--"}</strong></span>
                            </div>
                            <button type="button"
                                class="btn ${isUnlocked ? "btn-primary" : "btn-secondary"} cc-launch-lvl-btn"
                                data-level-id="${lvl.id}"
                                ${isUnlocked ? "" : "disabled aria-disabled='true'"}>
                                <span>${isCompleted ? "REPLAY LEVEL" : isUnlocked ? "PLAY LEVEL" : "LOCKED"}</span>
                            </button>
                        </div>
                    </article>
                `;
            })
            .join("");

        rootEl.innerHTML = `
            <div class="cc-screen">
                <div class="cc-top-nav">
                    <button type="button" class="pc-ctrl-btn" id="ccLvlBackMenuBtn">&larr; BACK TO MENU</button>
                    <div class="cc-menu-badges">
                        <span class="cc-pill">COMPLETED: <strong>${completedSet.size} / ${levels.length}</strong></span>
                        <span class="cc-pill">HIGHEST UNLOCKED: <strong>LEVEL ${String(saved.highestUnlockedLevel).padStart(2, "0")}</strong></span>
                    </div>
                </div>

                <div class="cc-panel-card">
                    <span class="section-eyebrow">15 PROGRESSIVE PUZZLES</span>
                    <h2 class="cc-section-heading">Select a Circuit Level</h2>
                    <p class="cc-section-sub">Complete each level to unlock the next challenge. Completed levels remain replayable at any time.</p>

                    <div class="cc-levels-grid">
                        ${cardsHtml}
                    </div>
                </div>
            </div>
        `;

        rootEl.querySelector("#ccLvlBackMenuBtn").addEventListener("click", renderMainMenu);

        rootEl.querySelectorAll(".cc-launch-lvl-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const lvlId = Number(btn.getAttribute("data-level-id"));
                if (window.CircuitConnectStorage.isLevelUnlocked(lvlId)) {
                    launchLevel(lvlId);
                }
            });
        });
    }

    // ========================================================================
    // 4. ACHIEVEMENTS & RESET PROGRESS SCREEN
    // ========================================================================
    function renderAchievements() {
        if (!rootEl) return;
        window.CircuitConnectEngine.cleanup();

        const saved = window.CircuitConnectStorage.loadState();
        const unlockedSet = new Set(saved.unlockedAchievements || []);
        const allAchievements = window.CircuitConnectAchievements.getAllAchievements();

        const achHtml = allAchievements
            .map((ach) => {
                const isUnlocked = unlockedSet.has(ach.id);
                return `
                    <div class="cc-ach-card ${isUnlocked ? "is-unlocked" : "is-locked"}">
                        <div class="cc-ach-top">
                            <span class="cc-ach-badge">${isUnlocked ? "&#10003; UNLOCKED" : "LOCKED"}</span>
                        </div>
                        <h3 class="cc-ach-title">${escapeHtml(ach.title)}</h3>
                        <p class="cc-ach-desc">${escapeHtml(ach.description)}</p>
                    </div>
                `;
            })
            .join("");

        rootEl.innerHTML = `
            <div class="cc-screen">
                <div class="cc-top-nav">
                    <button type="button" class="pc-ctrl-btn" id="ccAchBackBtn">&larr; BACK TO MENU</button>
                    <span class="cc-pill">ACHIEVEMENTS UNLOCKED: <strong>${unlockedSet.size} / ${allAchievements.length}</strong></span>
                </div>

                <div class="cc-panel-card">
                    <span class="section-eyebrow">MILESTONES &amp; RECORDS</span>
                    <h2 class="cc-section-heading">Circuit Connect Achievements</h2>
                    <p class="cc-section-sub">Achievements unlock automatically as you solve circuit levels, achieve perfect 100-point scores, and build without hints.</p>

                    <div class="cc-ach-grid">
                        ${achHtml}
                    </div>

                    <div class="cc-reset-zone">
                        <div>
                            <h4 class="cc-reset-title">Reset Circuit Connect Progress</h4>
                            <p class="cc-reset-desc">Clears your completed levels, best scores, and achievements for Circuit Connect only. Build a PC and Fix the PC progress will not be affected.</p>
                        </div>
                        <div class="cc-reset-actions">
                            ${
                                !pendingResetProgressConfirm
                                    ? `<button type="button" class="pc-ctrl-btn" id="ccBtnAskResetProgress">Reset Game Progress</button>`
                                    : `
                                        <span class="cc-confirm-label">Confirm full reset?</span>
                                        <button type="button" class="pc-ctrl-btn cc-btn-danger" id="ccBtnConfirmResetProgress">Yes, Reset Progress</button>
                                        <button type="button" class="pc-ctrl-btn" id="ccBtnCancelResetProgress">Cancel</button>
                                      `
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;

        rootEl.querySelector("#ccAchBackBtn").addEventListener("click", renderMainMenu);

        const askBtn = rootEl.querySelector("#ccBtnAskResetProgress");
        if (askBtn) {
            askBtn.addEventListener("click", () => {
                pendingResetProgressConfirm = true;
                renderAchievements();
            });
        }

        const confirmBtn = rootEl.querySelector("#ccBtnConfirmResetProgress");
        if (confirmBtn) {
            confirmBtn.addEventListener("click", () => {
                window.CircuitConnectStorage.resetProgress();
                pendingResetProgressConfirm = false;
                renderAchievements();
            });
        }

        const cancelBtn = rootEl.querySelector("#ccBtnCancelResetProgress");
        if (cancelBtn) {
            cancelBtn.addEventListener("click", () => {
                pendingResetProgressConfirm = false;
                renderAchievements();
            });
        }
    }

    // ========================================================================
    // 5. THREE-PANEL CIRCUIT WORKBENCH
    // ========================================================================
    function launchLevel(levelId) {
        if (!window.CircuitConnectStorage.isLevelUnlocked(levelId)) {
            renderLevelSelect();
            return;
        }
        pendingResetBoardConfirm = false;
        window.CircuitConnectEngine.startLevel(levelId, {
            onStateChange: (snapshot) => {
                renderWorkbench(snapshot);
            },
            onTick: (elapsedSeconds) => {
                const timerEl = rootEl ? rootEl.querySelector("#ccWorkbenchTimer") : null;
                if (timerEl) {
                    timerEl.textContent = window.CircuitConnectScoring.formatTime(elapsedSeconds);
                }
            }
        });
    }

    function renderWorkbench(snapshot) {
        if (!rootEl || !snapshot) return;

        const level = snapshot.level;
        const saved = window.CircuitConnectStorage.loadState();
        const showGrid = saved.preferences && saved.preferences.showGrid !== false;
        const energizedCompSet = new Set(snapshot.energizedComponents || []);

        // 1. Build LEFT PANEL — Component Toolbox items
        const toolboxHtml = (level.components || [])
            .map((comp) => {
                const meta = window.CircuitConnectComponents.getTypeMetadata(comp.type);
                const isEnergized = energizedCompSet.has(comp.id);
                const isSwClosed = snapshot.switchStates[comp.id];
                const termsText = (meta.terminals || []).map((t) => `${t.label}`).join(" / ");

                return `
                    <div class="cc-toolbox-item ${isEnergized ? "is-energized" : ""}">
                        <div class="cc-toolbox-item-header">
                            <span class="cc-toolbox-comp-label">${escapeHtml(comp.label)}</span>
                            <span class="cc-toolbox-comp-spec">${escapeHtml(comp.spec || meta.defaultSpec)}</span>
                        </div>
                        <div class="cc-toolbox-symbol-wrap">
                            ${window.CircuitConnectComponents.renderSymbolSvg(comp.type, {
                                energized: isEnergized,
                                switchClosed: isSwClosed
                            })}
                        </div>
                        <div class="cc-toolbox-meta">
                            <span>Terminals: <code>${escapeHtml(termsText)}</code></span>
                            ${
                                comp.type === "switch"
                                    ? `<button type="button" class="cc-switch-toggle-btn ${isSwClosed ? "is-closed" : "is-open"}"
                                        data-switch-id="${comp.id}"
                                        ${snapshot.isCompleted ? "disabled" : ""}>
                                        State: ${isSwClosed ? "CLOSED (ON)" : "OPEN (OFF)"}
                                       </button>`
                                    : ""
                            }
                        </div>
                    </div>
                `;
            })
            .join("");

        // 2. Build CENTER PANEL — Circuit Board 3x3 cells
        const gridCells = [];
        for (let r = 1; r <= 3; r++) {
            for (let c = 1; c <= 3; c++) {
                const comp = (level.components || []).find((item) => item.row === r && item.col === c);
                if (!comp) {
                    gridCells.push(`<div class="cc-board-cell is-empty" data-row="${r}" data-col="${c}"></div>`);
                    continue;
                }

                const meta = window.CircuitConnectComponents.getTypeMetadata(comp.type);
                const isEnergized = energizedCompSet.has(comp.id);
                const isSwClosed = snapshot.switchStates[comp.id];

                // Build clickable terminal buttons for this component
                const terminalsHtml = (meta.terminals || [])
                    .map((term) => {
                        const fullTermId = `${comp.id}:${term.key}`;
                        const isSelected = snapshot.selectedTerminal === fullTermId;
                        const connectedCount = snapshot.wires.filter((w) => w[0] === fullTermId || w[1] === fullTermId).length;

                        return `
                            <button type="button"
                                class="cc-terminal-btn ${isSelected ? "is-selected" : ""} ${connectedCount > 0 ? "is-connected" : ""}"
                                data-terminal-id="${fullTermId}"
                                ${snapshot.isCompleted ? "disabled" : ""}
                                aria-label="Terminal ${escapeHtml(term.fullLabel)} on ${escapeHtml(comp.label)}">
                                <span class="cc-terminal-pin"></span>
                                <span class="cc-terminal-text">${escapeHtml(term.label)}</span>
                            </button>
                        `;
                    })
                    .join("");

                let outputStateBadge = "";
                if (comp.type === "led") {
                    outputStateBadge = `<span class="cc-power-indicator ${isEnergized ? "is-on" : ""}">${isEnergized ? "LED LIT" : "LED OFF"}</span>`;
                } else if (comp.type === "bulb") {
                    outputStateBadge = `<span class="cc-power-indicator ${isEnergized ? "is-on" : ""}">${isEnergized ? "LAMP ON" : "LAMP OFF"}</span>`;
                } else if (comp.type === "buzzer") {
                    outputStateBadge = `<span class="cc-power-indicator ${isEnergized ? "is-on" : ""}">${isEnergized ? "ACTIVE TONE" : "SILENT"}</span>`;
                } else if (comp.type === "switch") {
                    outputStateBadge = `
                        <button type="button" class="cc-board-switch-pill ${isSwClosed ? "is-closed" : "is-open"}"
                            data-switch-id="${comp.id}"
                            ${snapshot.isCompleted ? "disabled" : ""}>
                            ${isSwClosed ? "CLOSED" : "OPEN"} (Toggle)
                        </button>
                    `;
                }

                gridCells.push(`
                    <div class="cc-board-cell has-component" data-row="${r}" data-col="${c}">
                        <div class="cc-board-node ${isEnergized ? "is-energized" : ""}" data-comp-id="${comp.id}">
                            <div class="cc-node-header">
                                <span class="cc-node-label">${escapeHtml(comp.label)}</span>
                                ${outputStateBadge}
                            </div>
                            <div class="cc-node-schematic">
                                ${window.CircuitConnectComponents.renderSymbolSvg(comp.type, {
                                    energized: isEnergized,
                                    switchClosed: isSwClosed
                                })}
                            </div>
                            <div class="cc-node-terminals">
                                ${terminalsHtml}
                            </div>
                        </div>
                    </div>
                `);
            }
        }

        // 3. Build RIGHT PANEL — Active Wire List & Revealed Hints
        const wiresListHtml =
            snapshot.wires.length === 0
                ? `<p class="cc-empty-note">No wires connected yet. Click two terminals on the board to add a wire.</p>`
                : snapshot.wires
                      .map((w, idx) => {
                          const labelA = snapshot.getTerminalLabel(w[0]);
                          const labelB = snapshot.getTerminalLabel(w[1]);
                          return `
                              <div class="cc-wire-item">
                                  <span class="cc-wire-item-text">${escapeHtml(labelA)} &harr; ${escapeHtml(labelB)}</span>
                                  ${
                                      !snapshot.isCompleted
                                          ? `<button type="button" class="cc-wire-remove-btn" data-remove-wire="${idx}" aria-label="Remove wire ${idx + 1}">&times;</button>`
                                          : ""
                                  }
                              </div>
                          `;
                      })
                      .join("");

        const hintsHtml =
            snapshot.revealedHints.length === 0
                ? `<p class="cc-empty-note">No hints used (${snapshot.totalHints - snapshot.hintsUsed} available).</p>`
                : snapshot.revealedHints
                      .map((h, i) => `<div class="cc-hint-box"><strong>Hint ${i + 1}:</strong> ${escapeHtml(h)}</div>`)
                      .join("");

        const hasNextLevel = level.id < 15;

        rootEl.innerHTML = `
            <div class="cc-screen cc-workbench-screen">
                <!-- Top Workbench Navigation Bar -->
                <div class="cc-top-nav">
                    <div class="cc-nav-left">
                        <button type="button" class="pc-ctrl-btn" id="ccWbBackMenuBtn">&larr; Main Menu</button>
                        <button type="button" class="pc-ctrl-btn" id="ccWbLevelSelectBtn">Level Select</button>
                    </div>
                    <div class="cc-nav-right">
                        <span class="cc-pill">EDUCATIONAL DC CIRCUIT SIMULATION</span>
                        <button type="button" class="pc-ctrl-btn" id="ccWbToggleGridBtn">
                            Grid: ${showGrid ? "ON" : "OFF"}
                        </button>
                    </div>
                </div>

                <!-- 3-Panel Interactive Workbench Layout -->
                <div class="cc-workbench-layout">
                    <!-- LEFT PANEL: COMPONENT TOOLBOX -->
                    <aside class="cc-panel cc-left-toolbox" aria-label="Component Toolbox">
                        <div class="cc-panel-header">
                            <h3 class="cc-panel-title">Component Toolbox</h3>
                            <span class="cc-panel-tag">${level.components.length} Parts</span>
                        </div>
                        <p class="cc-toolbox-helper">Available components for ${escapeHtml(level.code)}. Toggle switches directly below or on the board.</p>
                        <div class="cc-toolbox-list">
                            ${toolboxHtml}
                        </div>
                    </aside>

                    <!-- CENTER PANEL: INTERACTIVE CIRCUIT BOARD -->
                    <section class="cc-panel cc-center-board-panel" aria-label="Interactive Circuit Board">
                        <div class="cc-board-toolbar">
                            <div class="cc-toolbar-left">
                                <span class="cc-board-title">${escapeHtml(level.code)} — ${escapeHtml(level.name)}</span>
                                <span class="cc-power-badge ${snapshot.isCompleted ? "is-energized" : ""}">
                                    ${snapshot.isCompleted ? "POWER: ENERGIZED (ON)" : "POWER: STANDBY (UNVERIFIED)"}
                                </span>
                            </div>
                            <div class="cc-toolbar-actions">
                                <button type="button" class="pc-ctrl-btn" id="ccBtnUndo" ${!snapshot.canUndo || snapshot.isCompleted ? "disabled" : ""}>
                                    Undo
                                </button>
                                ${
                                    !pendingResetBoardConfirm
                                        ? `<button type="button" class="pc-ctrl-btn" id="ccBtnAskResetBoard" ${snapshot.isCompleted ? "disabled" : ""}>Reset Circuit</button>`
                                        : `
                                            <button type="button" class="pc-ctrl-btn cc-btn-danger" id="ccBtnConfirmResetBoard">Confirm Reset</button>
                                            <button type="button" class="pc-ctrl-btn" id="ccBtnCancelResetBoard">Cancel</button>
                                          `
                                }
                                <button type="button" class="pc-ctrl-btn" id="ccBtnHint" ${snapshot.isCompleted || snapshot.hintsUsed >= snapshot.totalHints ? "disabled" : ""}>
                                    Hint (${snapshot.totalHints - snapshot.hintsUsed})
                                </button>
                                <button type="button" class="btn btn-primary cc-test-btn" id="ccBtnTestCircuit" ${snapshot.isCompleted ? "disabled" : ""}>
                                    <span>TEST CIRCUIT</span>
                                </button>
                            </div>
                        </div>

                        <!-- Live Diagnostic / Completion Feedback Banner -->
                        <div class="cc-status-banner status-${escapeHtml(snapshot.statusBanner.type)}" role="status" aria-live="polite">
                            <div class="cc-status-banner-head">
                                <strong>${escapeHtml(snapshot.statusBanner.title)}</strong>
                            </div>
                            <p>${escapeHtml(snapshot.statusBanner.message)}</p>
                        </div>

                        <!-- Interactive Schematic Grid Canvas + SVG Wire Layer -->
                        <div class="cc-board-canvas ${showGrid ? "has-grid" : ""}" id="ccBoardCanvas">
                            <svg class="cc-wire-svg" id="ccWireSvg" aria-label="Circuit wire connections"></svg>
                            <div class="cc-board-grid">
                                ${gridCells.join("")}
                            </div>
                        </div>

                        ${
                            snapshot.isCompleted
                                ? `
                                    <div class="cc-completion-card" role="region" aria-label="Level Complete">
                                        <div class="cc-completion-top">
                                            <div>
                                                <span class="cc-completion-eyebrow">LEVEL ${String(level.id).padStart(2, "0")} COMPLETE</span>
                                                <h3 class="cc-completion-heading">CIRCUIT COMPLETE.</h3>
                                                <p class="cc-completion-lead">Power is flowing correctly. Your system is working!</p>
                                            </div>
                                            <div class="cc-completion-score-box">
                                                <span>FINAL SCORE</span>
                                                <strong>${snapshot.currentScore} / 100</strong>
                                            </div>
                                        </div>
                                        <p class="cc-completion-edu"><strong>How It Works:</strong> ${escapeHtml(level.educationalExplanation)}</p>
                                        ${
                                            snapshot.newlyUnlockedAchievements.length > 0
                                                ? `
                                                    <div class="cc-newly-unlocked">
                                                        <strong>Achievement Unlocked:</strong>
                                                        ${snapshot.newlyUnlockedAchievements.map((a) => `<span class="cc-ach-pill">&#10003; ${escapeHtml(a.title)}</span>`).join(" ")}
                                                    </div>
                                                  `
                                                : ""
                                        }
                                        <div class="cc-completion-actions">
                                            ${
                                                hasNextLevel
                                                    ? `<button type="button" class="btn btn-primary" id="ccBtnNextLevel"><span>NEXT LEVEL (LEVEL ${String(level.id + 1).padStart(2, "0")}) &rarr;</span></button>`
                                                    : `<button type="button" class="btn btn-primary" id="ccBtnFinishAll"><span>VIEW ALL ACHIEVEMENTS</span></button>`
                                            }
                                            <button type="button" class="btn btn-secondary" id="ccBtnReplayLevel">
                                                <span>REPLAY LEVEL</span>
                                            </button>
                                            <button type="button" class="btn btn-secondary" id="ccBtnCompleteLevelSelect">
                                                <span>LEVEL SELECT</span>
                                            </button>
                                        </div>
                                    </div>
                                  `
                                : ""
                        }
                    </section>

                    <!-- RIGHT PANEL: LEVEL INFORMATION & TELEMETRY -->
                    <aside class="cc-panel cc-right-info-panel" aria-label="Level Information">
                        <div class="cc-panel-header">
                            <h3 class="cc-panel-title">Level Information</h3>
                            <span class="cc-diff-tag diff-${level.difficulty.toLowerCase()}">${escapeHtml(level.difficulty)}</span>
                        </div>

                        <div class="cc-info-block">
                            <span class="cc-info-label">OBJECTIVE • ${escapeHtml(level.code)}</span>
                            <p class="cc-info-objective">${escapeHtml(level.objective)}</p>
                            <p class="cc-info-desc">${escapeHtml(level.description)}</p>
                        </div>

                        <div class="cc-metrics-grid">
                            <div class="cc-metric-box">
                                <span class="cc-metric-name">SCORE</span>
                                <strong class="cc-metric-val">${snapshot.currentScore} PTS</strong>
                            </div>
                            <div class="cc-metric-box">
                                <span class="cc-metric-name">TIMER</span>
                                <strong class="cc-metric-val" id="ccWorkbenchTimer">${snapshot.formattedTime}</strong>
                            </div>
                            <div class="cc-metric-box">
                                <span class="cc-metric-name">CONNECTIONS</span>
                                <strong class="cc-metric-val">${snapshot.wires.length}</strong>
                            </div>
                            <div class="cc-metric-box">
                                <span class="cc-metric-name">HINTS LEFT</span>
                                <strong class="cc-metric-val">${snapshot.totalHints - snapshot.hintsUsed} / ${snapshot.totalHints}</strong>
                            </div>
                        </div>

                        <div class="cc-info-block">
                            <span class="cc-info-label">CIRCUIT STATUS</span>
                            <div class="cc-circuit-status-pill ${snapshot.isCompleted ? "is-complete" : snapshot.failedTests > 0 ? "is-fault" : ""}">
                                ${
                                    snapshot.isCompleted
                                        ? "CIRCUIT COMPLETE • ENERGIZED"
                                        : snapshot.selectedTerminal
                                        ? `CONNECTING FROM ${escapeHtml(snapshot.selectedTerminal)}...`
                                        : `AWAITING VERIFICATION (${snapshot.testsCount} TESTS RUN)`
                                }
                            </div>
                        </div>

                        <div class="cc-info-block">
                            <span class="cc-info-label">ACTIVE CONNECTIONS (${snapshot.wires.length})</span>
                            <div class="cc-wires-list">
                                ${wiresListHtml}
                            </div>
                        </div>

                        <div class="cc-info-block">
                            <span class="cc-info-label">HINTS (${snapshot.hintsUsed} / ${snapshot.totalHints} USED)</span>
                            <div class="cc-hints-list">
                                ${hintsHtml}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        `;

        // Bind Navigation & Toolbar Events
        rootEl.querySelector("#ccWbBackMenuBtn").addEventListener("click", renderMainMenu);
        rootEl.querySelector("#ccWbLevelSelectBtn").addEventListener("click", renderLevelSelect);

        const gridBtn = rootEl.querySelector("#ccWbToggleGridBtn");
        if (gridBtn) {
            gridBtn.addEventListener("click", () => {
                const st = window.CircuitConnectStorage.loadState();
                st.preferences = st.preferences || {};
                st.preferences.showGrid = st.preferences.showGrid === false;
                window.CircuitConnectStorage.saveState(st);
                renderWorkbench(window.CircuitConnectEngine.getSessionSnapshot());
            });
        }

        const undoBtn = rootEl.querySelector("#ccBtnUndo");
        if (undoBtn) {
            undoBtn.addEventListener("click", () => {
                pendingResetBoardConfirm = false;
                window.CircuitConnectEngine.undoLastAction();
            });
        }

        const askResetBtn = rootEl.querySelector("#ccBtnAskResetBoard");
        if (askResetBtn) {
            askResetBtn.addEventListener("click", () => {
                pendingResetBoardConfirm = true;
                renderWorkbench(window.CircuitConnectEngine.getSessionSnapshot());
            });
        }

        const confirmResetBtn = rootEl.querySelector("#ccBtnConfirmResetBoard");
        if (confirmResetBtn) {
            confirmResetBtn.addEventListener("click", () => {
                pendingResetBoardConfirm = false;
                window.CircuitConnectEngine.resetCircuit();
            });
        }

        const cancelResetBtn = rootEl.querySelector("#ccBtnCancelResetBoard");
        if (cancelResetBtn) {
            cancelResetBtn.addEventListener("click", () => {
                pendingResetBoardConfirm = false;
                renderWorkbench(window.CircuitConnectEngine.getSessionSnapshot());
            });
        }

        const hintBtn = rootEl.querySelector("#ccBtnHint");
        if (hintBtn) {
            hintBtn.addEventListener("click", () => {
                window.CircuitConnectEngine.requestHint();
            });
        }

        const testBtn = rootEl.querySelector("#ccBtnTestCircuit");
        if (testBtn) {
            testBtn.addEventListener("click", () => {
                pendingResetBoardConfirm = false;
                window.CircuitConnectEngine.testCircuit();
            });
        }

        // Bind Terminal Buttons on the Circuit Board
        rootEl.querySelectorAll(".cc-terminal-btn").forEach((termBtn) => {
            termBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const termId = termBtn.getAttribute("data-terminal-id");
                if (termId) {
                    window.CircuitConnectEngine.selectTerminal(termId);
                }
            });
        });

        // Bind Switch Toggle Buttons (both in Toolbox and on Board)
        rootEl.querySelectorAll("[data-switch-id]").forEach((swBtn) => {
            swBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const swId = swBtn.getAttribute("data-switch-id");
                if (swId) {
                    window.CircuitConnectEngine.toggleSwitch(swId);
                }
            });
        });

        // Bind Remove Wire Buttons in the Right Panel
        rootEl.querySelectorAll("[data-remove-wire]").forEach((remBtn) => {
            remBtn.addEventListener("click", () => {
                const idx = Number(remBtn.getAttribute("data-remove-wire"));
                if (!Number.isNaN(idx)) {
                    window.CircuitConnectEngine.removeWireAtIndex(idx);
                }
            });
        });

        // Bind Completion Screen Buttons if visible
        const nextLvlBtn = rootEl.querySelector("#ccBtnNextLevel");
        if (nextLvlBtn) {
            nextLvlBtn.addEventListener("click", () => {
                launchLevel(level.id + 1);
            });
        }

        const finishAllBtn = rootEl.querySelector("#ccBtnFinishAll");
        if (finishAllBtn) {
            finishAllBtn.addEventListener("click", renderAchievements);
        }

        const replayBtn = rootEl.querySelector("#ccBtnReplayLevel");
        if (replayBtn) {
            replayBtn.addEventListener("click", () => {
                launchLevel(level.id);
            });
        }

        const completeSelectBtn = rootEl.querySelector("#ccBtnCompleteLevelSelect");
        if (completeSelectBtn) {
            completeSelectBtn.addEventListener("click", renderLevelSelect);
        }

        // Attach and render SVG wires after DOM layout
        const boardCanvas = rootEl.querySelector("#ccBoardCanvas");
        const wireSvg = rootEl.querySelector("#ccWireSvg");
        if (boardCanvas && wireSvg && window.CircuitConnectWireSystem) {
            window.CircuitConnectWireSystem.attach(boardCanvas, wireSvg, {
                onRemoveWire: (wireIndex) => {
                    window.CircuitConnectEngine.removeWireAtIndex(wireIndex);
                }
            });

            requestAnimationFrame(() => {
                window.CircuitConnectWireSystem.renderWires({
                    wires: snapshot.wires,
                    energizedWireIndices: snapshot.energizedWires,
                    selectedTerminal: snapshot.selectedTerminal
                });
            });
        }
    }

    return {
        init,
        renderMainMenu,
        renderHowToPlay,
        renderLevelSelect,
        renderAchievements,
        launchLevel
    };
})();
