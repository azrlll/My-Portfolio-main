<?php
declare(strict_types=1);

/**
 * Playground Game Popup Modal Component
 * Renders on demand when a visitor clicks any of the games in the sidebar dropdown:
 *   01 - TypeKalang (Monkeytype-inspired typing speed game)
 *   02 - Minimal Snake (Classic arcade game)
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
                <h3 class="playground-modal-title" id="playgroundModalTitle">TypeKalang</h3>
                <p class="playground-modal-desc" id="playgroundModalDesc" style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Type your way through a quick challenge and see how fast you can go.</p>
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

        <!-- Scrollable Modal Body containing the 2 Games -->
        <div class="playground-modal-body" id="playgroundModalBody">
            <!-- GAME 01 VIEW: TypeKalang — Typing Speed Game -->
            <div class="playground-game-view" id="typekalangGameView" hidden>
                <div class="typekalang-app" id="typekalangApp">
                    <!-- Top Control Bar: Mode, Difficulty & Restart -->
                    <div class="tk-control-bar">
                        <div class="tk-selectors-group">
                            <!-- Time Selector -->
                            <div class="tk-selector-row" role="radiogroup" aria-label="Test Duration">
                                <span class="tk-selector-label">TIME</span>
                                <button type="button" class="tk-mode-btn" data-tk-time="15" aria-pressed="false">15s</button>
                                <button type="button" class="tk-mode-btn is-active" data-tk-time="30" aria-pressed="true">30s</button>
                                <button type="button" class="tk-mode-btn" data-tk-time="60" aria-pressed="false">60s</button>
                            </div>

                            <!-- Difficulty Selector -->
                            <div class="tk-selector-row" role="radiogroup" aria-label="Test Difficulty">
                                <span class="tk-selector-label">DIFFICULTY</span>
                                <button type="button" class="tk-mode-btn" data-tk-diff="easy" aria-pressed="false">Easy</button>
                                <button type="button" class="tk-mode-btn is-active" data-tk-diff="normal" aria-pressed="true">Normal</button>
                                <button type="button" class="tk-mode-btn" data-tk-diff="hard" aria-pressed="false">Hard</button>
                            </div>
                        </div>

                        <!-- Manual Restart Button -->
                        <button type="button" class="tk-restart-btn" id="tkRestartBtn" aria-label="Restart typing test">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <polyline points="23 4 23 10 17 10"></polyline>
                                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                            </svg>
                            <span>Restart</span>
                        </button>
                    </div>

                    <!-- Live Metrics Strip -->
                    <div class="tk-stats-strip" aria-label="Live Typing Metrics">
                        <div class="tk-stat-pill">
                            <span class="tk-stat-label">TIME</span>
                            <strong class="tk-stat-value highlight" id="tkTimerDisplay">30s</strong>
                        </div>
                        <div class="tk-stat-pill">
                            <span class="tk-stat-label">WPM</span>
                            <strong class="tk-stat-value" id="tkWpmDisplay">0</strong>
                        </div>
                        <div class="tk-stat-pill">
                            <span class="tk-stat-label">ACC</span>
                            <strong class="tk-stat-value" id="tkAccuracyDisplay">100%</strong>
                        </div>
                    </div>

                    <!-- Main Typing Arena -->
                    <div class="tk-typing-arena" id="tkTypingArena">
                        <!-- Real Hidden Input for Native Keyboard Support (Desktop, Laptop, Android & iOS) -->
                        <input
                            type="text"
                            class="tk-hidden-input"
                            id="tkInput"
                            autocomplete="off"
                            autocorrect="off"
                            autocapitalize="off"
                            spellcheck="false"
                            inputmode="text"
                            enterkeyhint="done"
                            data-gramm="false"
                            data-gramm_editor="false"
                            data-enable-grammarly="false"
                            aria-label="TypeKalang Typing Input"
                        >

                        <!-- Words Stream & Smooth Animated Caret -->
                        <div class="tk-words-container" id="tkWordsContainer">
                            <div class="tk-caret" id="tkCaret" aria-hidden="true"></div>
                            <div class="tk-words-stream" id="tkWordsStream" aria-live="polite">
                                <!-- Populated dynamically by typekalang.js -->
                            </div>
                        </div>

                        <!-- Click / Tap to Focus Prompt -->
                        <div class="tk-focus-prompt" id="tkFocusPrompt">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                <line x1="6" y1="8" x2="6" y2="8"></line>
                                <line x1="10" y1="8" x2="10" y2="8"></line>
                                <line x1="14" y1="8" x2="14" y2="8"></line>
                                <line x1="18" y1="8" x2="18" y2="8"></line>
                                <line x1="6" y1="12" x2="6" y2="12"></line>
                                <line x1="18" y1="12" x2="18" y2="12"></line>
                                <line x1="7" y1="16" x2="17" y2="16"></line>
                            </svg>
                            <span>Click here or start typing to begin the challenge</span>
                        </div>

                        <!-- Results Overlay Screen (Revealed on Timer Expiration) -->
                        <div class="tk-results-overlay" id="tkResultsOverlay" role="dialog" aria-labelledby="tkResultsTitle" hidden>
                            <div class="tk-results-card">
                                <div class="tk-results-header">
                                    <span class="tk-results-badge">TEST COMPLETE</span>
                                    <h3 class="tk-results-title" id="tkResultsTitle">TypeKalang Results</h3>
                                    <div class="tk-new-best-banner" id="tkResultsNewBestNotice" hidden>
                                        &starf; NEW PERSONAL BEST! &starf;
                                    </div>
                                </div>

                                <div class="tk-results-grid">
                                    <div class="tk-result-stat">
                                        <span class="tk-result-label">WPM</span>
                                        <strong class="tk-result-val highlight" id="tkResultsWpm">0</strong>
                                    </div>
                                    <div class="tk-result-stat">
                                        <span class="tk-result-label">Accuracy</span>
                                        <strong class="tk-result-val" id="tkResultsAcc">100%</strong>
                                    </div>
                                    <div class="tk-result-stat">
                                        <span class="tk-result-label">Correct</span>
                                        <strong class="tk-result-val" id="tkResultsCorrect">0</strong>
                                    </div>
                                    <div class="tk-result-stat">
                                        <span class="tk-result-label">Incorrect</span>
                                        <strong class="tk-result-val alert" id="tkResultsIncorrect">0</strong>
                                    </div>
                                </div>

                                <div class="tk-results-meta-row">
                                    <span>Mode: <strong id="tkResultsMode">30s • Normal</strong></span>
                                    <span>Personal Best: <strong id="tkResultsBest">-- WPM</strong></span>
                                </div>

                                <div class="tk-results-actions">
                                    <button type="button" class="btn btn-primary" id="tkPlayAgainBtn">
                                        <span>PLAY AGAIN</span>
                                    </button>
                                    <button type="button" class="btn btn-secondary" id="tkResultsChangeTimeBtn">
                                        <span>CHANGE TIME</span>
                                    </button>
                                    <button type="button" class="btn btn-secondary" id="tkResultsChangeDiffBtn">
                                        <span>CHANGE DIFFICULTY</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- GAME 02 VIEW: Minimal Snake — Classic Arcade Simulator -->
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
