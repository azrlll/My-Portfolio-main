<?php
declare(strict_types=1);

/**
 * Playground Game Popup Modal Component
 * Renders on demand when a visitor clicks any of the 4 games in the sidebar dropdown.
 * Appears above portfolio content with a dimmed backdrop, comfortable responsive layout,
 * prominent Exit Game / Close controls, and zero reserved homepage layout space.
 */
?>
<!-- Playground Game Popup Modal -->
<div class="modal-overlay playground-modal-overlay" id="playgroundModal" role="dialog" aria-modal="true" aria-labelledby="playgroundModalTitle" hidden>
    <div class="modal-card playground-modal-card playground-section" id="playgroundModalCard">
        <!-- Persistent Modal Header with Title & Dual Exit Controls -->
        <div class="playground-modal-header" id="playgroundModalHeader">
            <div class="playground-modal-title-group">
                <span class="playground-modal-badge" id="playgroundModalBadge">PLAYGROUND / GAME 01</span>
                <h3 class="playground-modal-title" id="playgroundModalTitle">Build a PC</h3>
                <p class="playground-modal-desc" id="playgroundModalDesc" style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Try putting together a PC by placing the parts where they belong.</p>
            </div>
            <div class="playground-modal-actions">
                <button type="button" class="playground-modal-exit-btn" id="playgroundModalExitBtn" aria-label="Exit Game to Portfolio">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width: 14px; height: 14px;">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Exit Game</span>
                </button>
                <button type="button" class="modal-close-btn playground-modal-close-btn" id="playgroundModalCloseBtn" aria-label="Close game modal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Scrollable Modal Body containing the 4 Games -->
        <div class="playground-modal-body" id="playgroundModalBody">
            <!-- GAME 01 VIEW: Build a PC — Mini Simulator (Preserved Intact) -->
            <div class="playground-game-view" id="buildPcGameView" hidden>
                <div class="pc-simulator-app" id="pcSimulatorApp">
                    <!-- Top Bar: Progress Tracker, Timer, Personal Best, Difficulty -->
                    <div class="pc-sim-topbar">
                        <div class="pc-sim-progress-block">
                            <div class="pc-sim-progress-header">
                                <span class="pc-sim-progress-label" id="pcSimProgressText">COMPONENTS INSTALLED: 0 / 6</span>
                            </div>
                            <div class="pc-sim-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="6" aria-valuenow="0">
                                <div class="pc-sim-progress-fill" id="pcSimProgressFill"></div>
                            </div>
                        </div>

                        <div class="pc-sim-metrics">
                            <div class="pc-metric-pill" aria-live="off">
                                <span class="pc-metric-label">TIME:</span>
                                <span class="pc-metric-val" id="pcSimTimer">00:00</span>
                            </div>

                            <div class="pc-metric-pill">
                                <span class="pc-metric-label">BEST:</span>
                                <span class="pc-metric-val" id="pcSimBestTime">--:--</span>
                                <button type="button" class="pc-reset-best-btn" id="pcSimResetBestBtn" hidden aria-label="Reset personal best time">Reset</button>
                            </div>

                            <div class="pc-difficulty-group" role="group" aria-label="Simulator difficulty">
                                <button type="button" class="pc-diff-btn active" data-difficulty="beginner" aria-pressed="true">Beginner</button>
                                <button type="button" class="pc-diff-btn" data-difficulty="intermediate" aria-pressed="false">Intermediate</button>
                                <button type="button" class="pc-diff-btn" data-difficulty="advanced" aria-pressed="false">Advanced</button>
                            </div>
                        </div>
                    </div>

                    <!-- Two-Column Simulator Interface -->
                    <div class="pc-sim-workspace">
                        <!-- Left Column: PC Case & Motherboard Assembly Area -->
                        <div class="pc-sim-case-panel">
                            <div class="pc-panel-title-row">
                                <h3 class="pc-panel-heading">PC Case &amp; Motherboard Assembly</h3>
                                <span class="pc-panel-subtag">ATX Mid-Tower</span>
                            </div>

                            <div class="pc-chassis-diagram" id="pcSimChassis" data-difficulty="beginner">
                                <!-- Motherboard Tray (Upper Section) -->
                                <div class="pc-motherboard-tray" aria-label="Motherboard installation area">
                                    <div class="mobo-header-strip">
                                        <span>MOTHERBOARD PCB (ATX)</span>
                                        <span>VRM / I/O</span>
                                    </div>

                                    <!-- Upper Row: CPU Socket (and Cooler Mount) + DDR5 DIMM Slots -->
                                    <div class="mobo-upper-grid">
                                        <div class="pc-drop-slot slot-cpu-zone" id="pcSlotCpu" data-slot-id="slot-cpu" role="button" tabindex="0" aria-label="CPU Socket and CPU Cooler mounting location">
                                            <!-- Hydrated by pc-simulator.js -->
                                        </div>

                                        <div class="pc-drop-slot slot-ram-zone" id="pcSlotRam" data-slot-id="slot-ram" role="button" tabindex="0" aria-label="DDR5 DIMM memory slots">
                                            <!-- Hydrated by pc-simulator.js -->
                                        </div>
                                    </div>

                                    <!-- Lower Stack: M.2 NVMe Storage Slot + PCIe x16 GPU Slot -->
                                    <div class="mobo-lower-stack">
                                        <div class="pc-drop-slot slot-ssd-zone" id="pcSlotSsd" data-slot-id="slot-ssd" role="button" tabindex="0" aria-label="M.2 NVMe SSD slot">
                                            <!-- Hydrated by pc-simulator.js -->
                                        </div>

                                        <div class="pc-drop-slot slot-gpu-zone" id="pcSlotGpu" data-slot-id="slot-gpu" role="button" tabindex="0" aria-label="PCIe x16 graphics card slot">
                                            <!-- Hydrated by pc-simulator.js -->
                                        </div>
                                    </div>
                                </div>

                                <!-- Lower Case PSU Shroud Compartment -->
                                <div class="pc-psu-compartment" aria-label="PC Case Power Supply Compartment">
                                    <div class="psu-shroud-label">
                                        <span>LOWER CASE COMPARTMENT</span>
                                        <span>PSU SHROUD</span>
                                    </div>
                                    <div class="pc-drop-slot slot-psu-zone" id="pcSlotPsu" data-slot-id="slot-psu" role="button" tabindex="0" aria-label="Power Supply Unit case compartment">
                                        <!-- Hydrated by pc-simulator.js -->
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: Instructions, Controls, Feedback & Available Components -->
                        <div class="pc-sim-control-panel">
                            <!-- Component Inspector & Action Controls -->
                            <div class="pc-inspector-card">
                                <div class="pc-inspector-top">
                                    <h3 class="pc-inspector-title" id="pcSimSelectedTitle">Select or Drag a Component</h3>
                                    <div class="pc-action-btns">
                                        <button type="button" class="pc-ctrl-btn" id="pcSimHintBtn">Hint</button>
                                        <button type="button" class="pc-ctrl-btn" id="pcSimRestartBtn">Restart</button>
                                    </div>
                                </div>
                                <p class="pc-inspector-desc" id="pcSimSelectedDesc">
                                    Click or drag any hardware component below to view its function and install it into the PC case or motherboard.
                                </p>
                                <p class="pc-inspector-inst" id="pcSimSelectedInst">
                                    Tip: On desktop, drag a component to its slot or click to select and click the target slot. On mobile, tap a component then tap its destination.
                                </p>
                            </div>

                            <!-- Dismissible Contextual Hint Banner -->
                            <div class="pc-hint-banner" id="pcSimHintBanner" role="region" aria-label="Component Hint" hidden>
                                <span id="pcSimHintText"></span>
                                <button type="button" class="pc-hint-dismiss" id="pcSimHintDismiss">Dismiss</button>
                            </div>

                            <!-- Live Placement Status Feedback -->
                            <div class="pc-sim-feedback is-neutral" id="pcSimFeedback" role="status" aria-live="polite">
                                [STATUS] Simulator ready. Drag a component or click to select and assemble the PC.
                            </div>

                            <!-- Available Hardware Components Tray -->
                            <div>
                                <div class="pc-panel-title-row">
                                    <h3 class="pc-panel-heading">Available Components</h3>
                                    <span class="pc-panel-subtag">Drag or Tap to Install</span>
                                </div>
                                <div class="pc-components-tray" id="pcSimComponentsTray">
                                    <!-- Hydrated by pc-simulator.js -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Build Completion Screen -->
                    <div class="pc-completion-overlay" id="pcSimCompletionOverlay" role="region" aria-labelledby="pcSimCompleteHeading" hidden>
                        <div class="pc-completion-header">
                            <span class="pc-completion-badge" id="pcSimFinalBestNotice">Personal Best</span>
                            <h3 class="pc-completion-title" id="pcSimCompleteHeading">BUILD COMPLETE!</h3>
                            <p class="pc-completion-lead">Nice work! You've successfully assembled your virtual PC.</p>
                            <p class="pc-completion-sub">Interested in seeing what I've been building? Explore my projects.</p>
                        </div>

                        <div class="pc-completion-stats">
                            <div class="pc-stat-box">
                                <span class="pc-stat-label">Completion Time</span>
                                <strong class="pc-stat-val" id="pcSimFinalTime">00:00</strong>
                            </div>
                            <div class="pc-stat-box">
                                <span class="pc-stat-label">Incorrect Attempts</span>
                                <strong class="pc-stat-val" id="pcSimFinalErrors">0</strong>
                            </div>
                            <div class="pc-stat-box">
                                <span class="pc-stat-label">Hints Used</span>
                                <strong class="pc-stat-val" id="pcSimFinalHints">0</strong>
                            </div>
                        </div>

                        <div class="pc-completion-actions">
                            <button type="button" class="btn btn-primary" id="pcSimPlayAgainBtn">
                                <span>PLAY AGAIN</span>
                            </button>
                            <a href="#projects" class="btn btn-secondary" id="pcSimViewProjectsBtn">
                                <span>VIEW MY PROJECTS</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- GAME 02 VIEW: Fix the PC — Troubleshooting Simulator -->
            <div class="playground-game-view" id="fixPcGameView" hidden>
                <div id="fixPcAppRoot"></div>
            </div>

            <!-- GAME 03 VIEW: Circuit Connect — Electronics Puzzle Simulator -->
            <div class="playground-game-view" id="circuitConnectGameView" hidden>
                <div id="circuitConnectAppRoot"></div>
            </div>

            <!-- GAME 04 VIEW: Minimal Snake — Classic Arcade Simulator -->
            <div class="playground-game-view" id="snakeGameView" hidden>
                <div class="snake-game-wrapper">
                    <!-- Mode & Difficulty Selection Bar -->
                    <div class="snake-difficulty-bar">
                        <span class="snake-diff-label">DIFFICULTY SELECTION</span>
                        <div class="snake-diff-options" role="radiogroup" aria-label="Game Difficulty">
                            <button type="button" class="snake-diff-btn" data-diff="easy" aria-label="Easy mode: 180 milliseconds, 10 points per food">
                                <span>Easy</span>
                                <small>180ms &bull; 10pts</small>
                            </button>
                            <button type="button" class="snake-diff-btn active" data-diff="intermediate" aria-label="Intermediate mode: 120 milliseconds, 20 points per food">
                                <span>Intermediate</span>
                                <small>120ms &bull; 20pts</small>
                            </button>
                            <button type="button" class="snake-diff-btn" data-diff="hard" aria-label="Hard mode: 75 milliseconds, 30 points per food">
                                <span>Hard</span>
                                <small>75ms &bull; 30pts</small>
                            </button>
                        </div>
                    </div>

                    <!-- Scoreboard Card -->
                    <div class="snake-scoreboard-card">
                        <div class="snake-stat-pill">
                            <span class="stat-name">SCORE</span>
                            <strong class="stat-val" id="snakeScore">0</strong>
                        </div>
                        <div class="snake-stat-pill">
                            <span class="stat-name">BEST</span>
                            <strong class="stat-val highlight" id="snakeBest">0</strong>
                        </div>
                        <div class="snake-stat-pill">
                            <span class="stat-name">MODE</span>
                            <strong class="stat-val mode-text" id="snakeModeLabel">INTERMEDIATE</strong>
                        </div>
                    </div>

                    <!-- Game Board Canvas Container -->
                    <div class="snake-board-frame">
                        <canvas id="snakeCanvas" width="400" height="400" aria-label="Minimal Snake Game Board"></canvas>

                        <!-- Start / Ready Overlay -->
                        <div class="snake-overlay snake-overlay-start" id="snakeStartOverlay">
                            <div class="snake-overlay-card">
                                <span class="overlay-badge">ARCADE READY</span>
                                <h3>MINIMAL SNAKE</h3>
                                <p>Press <strong>Start Game</strong> or any <strong>Arrow Key / WASD</strong> to begin.</p>
                                <button type="button" class="btn btn-primary" id="btnOverlayStart">
                                    <span>START GAME</span>
                                </button>
                            </div>
                        </div>

                        <!-- Pause Overlay -->
                        <div class="snake-overlay" id="snakePauseOverlay" hidden>
                            <div class="snake-overlay-card">
                                <span class="overlay-badge">PAUSED</span>
                                <h3>GAME PAUSED</h3>
                                <p>Take a breath. Press <strong>Resume</strong> or <strong>Space</strong> to continue.</p>
                                <button type="button" class="btn btn-primary" id="btnOverlayResume">
                                    <span>RESUME GAME</span>
                                </button>
                            </div>
                        </div>

                        <!-- Game Over Overlay -->
                        <div class="snake-overlay" id="snakeGameOverOverlay" hidden>
                            <div class="snake-overlay-card">
                                <span class="overlay-badge alert">GAME OVER</span>
                                <h3>CRASHED!</h3>
                                <div class="game-over-stats">
                                    <div class="go-stat">
                                        <span>FINAL SCORE</span>
                                        <strong id="goFinalScore">0</strong>
                                    </div>
                                    <div class="go-stat">
                                        <span>BEST RECORD</span>
                                        <strong id="goBestScore">0</strong>
                                    </div>
                                </div>
                                <div class="new-record-banner" id="goNewRecordBanner" hidden>
                                    &starf; NEW HIGH SCORE! &starf;
                                </div>
                                <button type="button" class="btn btn-primary" id="btnOverlayRestart">
                                    <span>PLAY AGAIN</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Action Control Buttons -->
                    <div class="snake-actions-row">
                        <button type="button" class="btn btn-secondary" id="btnSnakeActionPause" disabled>
                            <span id="btnSnakePauseText">PAUSE</span>
                        </button>
                        <button type="button" class="btn btn-secondary" id="btnSnakeActionRestart">
                            <span>RESTART</span>
                        </button>
                    </div>

                    <!-- Mobile Touch Virtual D-Pad -->
                    <div class="snake-touch-controls" id="snakeTouchControls" aria-label="Mobile Virtual D-Pad">
                        <button type="button" class="snake-dpad-btn dpad-up" id="btnDpadUp" aria-label="Move Up">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
                        </button>
                        <div class="snake-dpad-middle">
                            <button type="button" class="snake-dpad-btn dpad-left" id="btnDpadLeft" aria-label="Move Left">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>
                            <div class="snake-dpad-center"></div>
                            <button type="button" class="snake-dpad-btn dpad-right" id="btnDpadRight" aria-label="Move Right">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        </div>
                        <button type="button" class="snake-dpad-btn dpad-down" id="btnDpadDown" aria-label="Move Down">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </button>
                    </div>

                    <!-- Keyboard Controls Help Note -->
                    <div class="snake-help-note">
                        <span class="help-key">W</span> / <span class="help-key">&uarr;</span> Up &bull;
                        <span class="help-key">A</span> / <span class="help-key">&larr;</span> Left &bull;
                        <span class="help-key">S</span> / <span class="help-key">&darr;</span> Down &bull;
                        <span class="help-key">D</span> / <span class="help-key">&rarr;</span> Right &bull;
                        <span class="help-key">Space</span> / <span class="help-key">P</span> Pause
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
