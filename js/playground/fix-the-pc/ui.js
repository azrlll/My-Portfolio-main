// ============================================================================
// FIX THE PC — USER INTERFACE & WORKSTATION RENDERER
// Renders Main Menu, Career Dashboard, Free Play Selector, Interactive
// Technician Workstation, and Case / Career Completion screens.
// ============================================================================

window.FixPCUI = (function () {
    "use strict";

    let rootEl = null;
    let currentView = "menu"; // "menu" | "career" | "freeplay" | "workstation"
    let activeHintMessage = null;
    let resetConfirmPending = false;
    let onReturnToPlaygroundCallback = null;

    function init(containerElement, options) {
        rootEl = containerElement;
        if (options && typeof options.onReturnToPlayground === "function") {
            onReturnToPlaygroundCallback = options.onReturnToPlayground;
        }

        window.FixPCGameEngine.setOnTick((seconds) => {
            const timerEl = document.getElementById("fixPcLiveTimer");
            if (timerEl) {
                timerEl.textContent = window.FixPCGameEngine.formatTime(seconds);
            }
        });

        renderMainMenu();
    }

    // ------------------------------------------------------------------------
    // 1. MAIN MENU VIEW
    // ------------------------------------------------------------------------
    function renderMainMenu() {
        if (!rootEl) return;
        window.FixPCGameEngine.cleanup();
        currentView = "menu";
        activeHintMessage = null;
        resetConfirmPending = false;

        const saved = window.FixPCStorage.loadState();
        const summary = window.FixPCCareer.getCareerSummary(saved);
        const careerBtnLabel = summary.completedCount > 0 ? "CONTINUE CAREER" : "START CAREER";

        rootEl.innerHTML = `
            <div class="fixpc-screen fixpc-menu-screen">
                <div class="fixpc-top-nav">
                    <button type="button" class="pc-ctrl-btn" id="fixPcBackToHubBtn">
                        &larr; Back to Playground
                    </button>
                    <span class="fixpc-rank-pill">RANK: ${escapeHtml(summary.rankTitle.toUpperCase())} &bull; ${summary.totalXp} XP</span>
                </div>

                <div class="fixpc-hero-banner">
                    <span class="section-eyebrow">PLAYGROUND / GAME 02</span>
                    <h2 class="fixpc-main-title">FIX THE PC.</h2>
                    <p class="fixpc-main-subtitle">Diagnose the problem. Find the cause. Fix the system.</p>
                </div>

                <div class="fixpc-mode-cards-grid">
                    <!-- Technician Career Mode Card -->
                    <article class="fixpc-mode-card">
                        <div>
                            <div class="fixpc-mode-card-top">
                                <span class="fixpc-mode-tag">PROGRESSION MODE</span>
                                <span class="fixpc-mode-progress">${summary.completedCount} / 12 Cases Solved</span>
                            </div>
                            <h3 class="fixpc-mode-heading">TECHNICIAN CAREER MODE</h3>
                            <p class="fixpc-mode-desc">
                                Start as a technician in training, solve increasingly difficult cases, earn XP, and unlock new ranks.
                            </p>
                            <div class="fixpc-career-mini-stats">
                                <span>Current Rank: <strong>${escapeHtml(summary.rankTitle)}</strong></span>
                                <span>Total XP: <strong>${summary.totalXp} XP</strong></span>
                            </div>
                        </div>
                        <button type="button" class="btn btn-primary fixpc-full-btn" id="fixPcOpenCareerBtn">
                            <span>${careerBtnLabel}</span>
                        </button>
                    </article>

                    <!-- Free Play Mode Card -->
                    <article class="fixpc-mode-card">
                        <div>
                            <div class="fixpc-mode-card-top">
                                <span class="fixpc-mode-tag">PRACTICE MODE</span>
                                <span class="fixpc-mode-progress">All 12 Cases Unlocked</span>
                            </div>
                            <h3 class="fixpc-mode-heading">FREE PLAY MODE</h3>
                            <p class="fixpc-mode-desc">
                                Choose any troubleshooting case and practice without progression requirements.
                            </p>
                            <div class="fixpc-career-mini-stats">
                                <span>Access: <strong>Cases 01–12 Immediate</strong></span>
                                <span>Difficulty: <strong>Beginner / Intermediate / Advanced</strong></span>
                            </div>
                        </div>
                        <button type="button" class="btn btn-secondary fixpc-full-btn" id="fixPcOpenFreePlayBtn">
                            <span>START FREE PLAY</span>
                        </button>
                    </article>
                </div>
            </div>
        `;

        const backBtn = document.getElementById("fixPcBackToHubBtn");
        if (backBtn) {
            backBtn.addEventListener("click", () => {
                if (typeof onReturnToPlaygroundCallback === "function") {
                    onReturnToPlaygroundCallback();
                }
            });
        }

        const careerBtn = document.getElementById("fixPcOpenCareerBtn");
        if (careerBtn) {
            careerBtn.addEventListener("click", () => renderCareerDashboard());
        }

        const freePlayBtn = document.getElementById("fixPcOpenFreePlayBtn");
        if (freePlayBtn) {
            freePlayBtn.addEventListener("click", () => renderFreePlaySelector());
        }
    }

    // ------------------------------------------------------------------------
    // 2. TECHNICIAN CAREER DASHBOARD VIEW
    // ------------------------------------------------------------------------
    function renderCareerDashboard() {
        if (!rootEl) return;
        window.FixPCGameEngine.cleanup();
        currentView = "career";
        activeHintMessage = null;

        const saved = window.FixPCStorage.loadState();
        const summary = window.FixPCCareer.getCareerSummary(saved);
        const scenarios = window.FixPCGameEngine.getScenarios();
        const achievements = window.FixPCAchievements.getAllAchievements();
        const unlockedAchSet = new Set(saved.unlockedAchievements || []);
        const completedSet = new Set(saved.completedCases || []);
        const lockedCount = summary.totalCases - summary.completedCount;

        const careerCompleteBannerHtml = summary.careerCompleted
            ? `
                <div class="fixpc-career-complete-banner" role="region" aria-label="Career Completed">
                    <div>
                        <span class="fixpc-badge-pill">ALL 12 CASES SOLVED</span>
                        <h3>EXPERT TECHNICIAN — CAREER COMPLETED.</h3>
                        <p>You have diagnosed and repaired every hardware and system fault across all four technician levels. You can replay any case below to sharpen your time and score.</p>
                    </div>
                </div>
            `
            : "";

        const resetControlHtml = resetConfirmPending
            ? `
                <div class="fixpc-reset-confirm-row">
                    <span>Erase all Career XP, unlocked cases &amp; achievements?</span>
                    <button type="button" class="pc-ctrl-btn is-danger" id="fixPcConfirmResetYes">Yes, Reset</button>
                    <button type="button" class="pc-ctrl-btn" id="fixPcConfirmResetNo">Cancel</button>
                </div>
            `
            : `
                <button type="button" class="pc-ctrl-btn" id="fixPcResetCareerBtn">Reset Career Progress</button>
            `;

        rootEl.innerHTML = `
            <div class="fixpc-screen fixpc-dashboard-screen">
                <div class="fixpc-top-nav">
                    <div class="fixpc-nav-left-group">
                        <button type="button" class="pc-ctrl-btn" id="fixPcBackToMenuBtn">&larr; Fix the PC Menu</button>
                        <button type="button" class="pc-ctrl-btn" id="fixPcDashToHubBtn">Back to Playground</button>
                    </div>
                    <div class="pc-difficulty-group" role="group" aria-label="Difficulty selector">
                        ${renderDifficultyButtonsHtml(saved.selectedDifficulty)}
                    </div>
                </div>

                ${careerCompleteBannerHtml}

                <!-- Career Stats Dashboard Card -->
                <div class="fixpc-career-overview-card">
                    <div class="fixpc-career-header-row">
                        <div>
                            <span class="section-eyebrow">TECHNICIAN CAREER DASHBOARD</span>
                            <h3 class="fixpc-rank-heading">${escapeHtml(summary.rankTitle)}</h3>
                            <p class="fixpc-disclaimer-note">
                                Note: Technician ranks and achievements are in-game progression milestones rather than professional certifications.
                            </p>
                        </div>
                        <button type="button" class="btn btn-primary" id="fixPcPlayNextCareerCaseBtn">
                            <span>${summary.careerCompleted ? "REPLAY CASE 12" : `LAUNCH CASE ${String(summary.nextPlayableCaseId).padStart(2, "0")}`}</span>
                        </button>
                    </div>

                    <div class="fixpc-career-stats-grid">
                        <div class="fixpc-stat-tile">
                            <span class="fixpc-stat-label">CAREER LEVEL</span>
                            <strong class="fixpc-stat-val">Level ${summary.careerLevel} / 4</strong>
                        </div>
                        <div class="fixpc-stat-tile">
                            <span class="fixpc-stat-label">TOTAL XP</span>
                            <strong class="fixpc-stat-val">${summary.totalXp} XP</strong>
                        </div>
                        <div class="fixpc-stat-tile">
                            <span class="fixpc-stat-label">COMPLETED CASES</span>
                            <strong class="fixpc-stat-val">${summary.completedCount} / 12</strong>
                        </div>
                        <div class="fixpc-stat-tile">
                            <span class="fixpc-stat-label">LOCKED CASES</span>
                            <strong class="fixpc-stat-val">${lockedCount}</strong>
                        </div>
                    </div>

                    <div class="fixpc-career-progress-wrap">
                        <div class="fixpc-career-progress-labels">
                            <span>CAREER PROGRESSION</span>
                            <span>${summary.progressPercent}%</span>
                        </div>
                        <div class="pc-sim-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${summary.progressPercent}">
                            <div class="pc-sim-progress-fill" style="width: ${summary.progressPercent}%"></div>
                        </div>
                    </div>

                    <div class="fixpc-career-footer-row">
                        ${resetControlHtml}
                    </div>
                </div>

                <!-- Cases 1–12 Grouped by Level -->
                <div class="fixpc-cases-section">
                    <h4 class="fixpc-section-heading">Career Troubleshooting Cases (01–12)</h4>
                    ${renderCasesByLevelHtml(scenarios, saved, true)}
                </div>

                <!-- Achievements Section -->
                <div class="fixpc-achievements-section" id="fixPcAchievementsSection">
                    <div class="fixpc-section-heading-row">
                        <h4 class="fixpc-section-heading">Technician Achievements</h4>
                        <span class="fixpc-ach-counter">${unlockedAchSet.size} / ${achievements.length} Unlocked</span>
                    </div>
                    <div class="fixpc-achievements-grid">
                        ${achievements
                            .map((ach) => {
                                const unlocked = unlockedAchSet.has(ach.id);
                                return `
                                    <div class="fixpc-ach-card${unlocked ? " is-unlocked" : " is-locked"}">
                                        <div class="fixpc-ach-top">
                                            <strong class="fixpc-ach-title">${escapeHtml(ach.title)}</strong>
                                            <span class="fixpc-ach-badge">${unlocked ? "UNLOCKED &#10003;" : "LOCKED"}</span>
                                        </div>
                                        <p class="fixpc-ach-desc">${escapeHtml(ach.description)}</p>
                                    </div>
                                `;
                            })
                            .join("")}
                    </div>
                </div>
            </div>
        `;

        bindDashboardEvents(saved, summary);
    }

    function bindDashboardEvents(saved, summary) {
        const backMenuBtn = document.getElementById("fixPcBackToMenuBtn");
        if (backMenuBtn) backMenuBtn.addEventListener("click", renderMainMenu);

        const backHubBtn = document.getElementById("fixPcDashToHubBtn");
        if (backHubBtn) {
            backHubBtn.addEventListener("click", () => {
                if (typeof onReturnToPlaygroundCallback === "function") {
                    onReturnToPlaygroundCallback();
                }
            });
        }

        const nextCaseBtn = document.getElementById("fixPcPlayNextCareerCaseBtn");
        if (nextCaseBtn) {
            nextCaseBtn.addEventListener("click", () => {
                launchWorkstationCase(summary.nextPlayableCaseId, "career");
            });
        }

        // Difficulty buttons
        document.querySelectorAll(".fixpc-diff-btn[data-diff]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const diff = btn.getAttribute("data-diff");
                const latest = window.FixPCStorage.loadState();
                latest.selectedDifficulty = diff;
                window.FixPCStorage.saveState(latest);
                renderCareerDashboard();
            });
        });

        // Reset Career Progress confirmation
        const resetBtn = document.getElementById("fixPcResetCareerBtn");
        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                resetConfirmPending = true;
                renderCareerDashboard();
            });
        }

        const confirmYes = document.getElementById("fixPcConfirmResetYes");
        if (confirmYes) {
            confirmYes.addEventListener("click", () => {
                window.FixPCStorage.resetCareerProgress();
                resetConfirmPending = false;
                renderCareerDashboard();
            });
        }

        const confirmNo = document.getElementById("fixPcConfirmResetNo");
        if (confirmNo) {
            confirmNo.addEventListener("click", () => {
                resetConfirmPending = false;
                renderCareerDashboard();
            });
        }

        // Case Launch Buttons (Unlocked only)
        document.querySelectorAll(".js-launch-career-case[data-case-id]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const caseId = Number(btn.getAttribute("data-case-id"));
                if (window.FixPCCareer.isCaseUnlockedInCareer(caseId, window.FixPCStorage.loadState())) {
                    launchWorkstationCase(caseId, "career");
                }
            });
        });
    }

    // ------------------------------------------------------------------------
    // 3. FREE PLAY CASE SELECTION VIEW
    // ------------------------------------------------------------------------
    function renderFreePlaySelector() {
        if (!rootEl) return;
        window.FixPCGameEngine.cleanup();
        currentView = "freeplay";
        activeHintMessage = null;

        const saved = window.FixPCStorage.loadState();
        const scenarios = window.FixPCGameEngine.getScenarios();

        rootEl.innerHTML = `
            <div class="fixpc-screen fixpc-freeplay-screen">
                <div class="fixpc-top-nav">
                    <div class="fixpc-nav-left-group">
                        <button type="button" class="pc-ctrl-btn" id="fixPcFreeToMenuBtn">&larr; Fix the PC Menu</button>
                        <button type="button" class="pc-ctrl-btn" id="fixPcFreeToHubBtn">Back to Playground</button>
                    </div>
                    <div class="pc-difficulty-group" role="group" aria-label="Difficulty selector">
                        ${renderDifficultyButtonsHtml(saved.selectedDifficulty)}
                    </div>
                </div>

                <div class="fixpc-freeplay-banner">
                    <span class="section-eyebrow">FREE PLAY MODE — PRACTICE SANDBOX</span>
                    <h3 class="fixpc-rank-heading">Select Any Troubleshooting Scenario (01–12)</h3>
                    <p class="fixpc-disclaimer-note">
                        Practice Mode: All 12 cases are open for practice at any difficulty. Free Play does not award Career XP or unlock Career cases.
                    </p>
                </div>

                <div class="fixpc-cases-section">
                    ${renderCasesByLevelHtml(scenarios, saved, false)}
                </div>
            </div>
        `;

        const backMenuBtn = document.getElementById("fixPcFreeToMenuBtn");
        if (backMenuBtn) backMenuBtn.addEventListener("click", renderMainMenu);

        const backHubBtn = document.getElementById("fixPcFreeToHubBtn");
        if (backHubBtn) {
            backHubBtn.addEventListener("click", () => {
                if (typeof onReturnToPlaygroundCallback === "function") {
                    onReturnToPlaygroundCallback();
                }
            });
        }

        document.querySelectorAll(".fixpc-diff-btn[data-diff]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const diff = btn.getAttribute("data-diff");
                const latest = window.FixPCStorage.loadState();
                latest.selectedDifficulty = diff;
                window.FixPCStorage.saveState(latest);
                renderFreePlaySelector();
            });
        });

        document.querySelectorAll(".js-launch-freeplay-case[data-case-id]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const caseId = Number(btn.getAttribute("data-case-id"));
                launchWorkstationCase(caseId, "freeplay");
            });
        });
    }

    function renderDifficultyButtonsHtml(selectedDiff) {
        const modes = [
            { id: "beginner", label: "Beginner" },
            { id: "intermediate", label: "Intermediate" },
            { id: "advanced", label: "Advanced" }
        ];
        return modes
            .map(
                (m) => `
                <button type="button" class="pc-diff-btn fixpc-diff-btn${
                    selectedDiff === m.id ? " active" : ""
                }" data-diff="${m.id}" aria-pressed="${selectedDiff === m.id}">
                    ${m.label}
                </button>
            `
            )
            .join("");
    }

    function renderCasesByLevelHtml(scenarios, savedState, isCareer) {
        const levels = [
            { level: 1, title: "LEVEL 1 — TECHNICIAN IN TRAINING" },
            { level: 2, title: "LEVEL 2 — JUNIOR TECHNICIAN" },
            { level: 3, title: "LEVEL 3 — SKILLED TECHNICIAN" },
            { level: 4, title: "LEVEL 4 — EXPERT TECHNICIAN" }
        ];
        const completedSet = new Set((savedState && savedState.completedCases) || []);
        const bestScores = (savedState && savedState.bestScores) || {};

        return levels
            .map((lvl) => {
                const groupScenarios = scenarios.filter((s) => s.level === lvl.level);
                const cardsHtml = groupScenarios
                    .map((scen) => {
                        const unlocked = isCareer
                            ? window.FixPCCareer.isCaseUnlockedInCareer(scen.id, savedState)
                            : true;
                        const completed = completedSet.has(scen.id);
                        const best = bestScores[scen.id];

                        const statusBadge = isCareer
                            ? completed
                                ? `<span class="fixpc-case-badge is-done">COMPLETED &#10003;</span>`
                                : unlocked
                                ? `<span class="fixpc-case-badge is-open">UNLOCKED</span>`
                                : `<span class="fixpc-case-badge is-locked">LOCKED</span>`
                            : `<span class="fixpc-case-badge is-open">FREE PLAY</span>`;

                        const bestScoreHtml =
                            best !== undefined
                                ? `<span class="fixpc-best-score">Best Score: ${best} / 100</span>`
                                : `<span class="fixpc-best-score">Best Score: --</span>`;

                        const actionBtnHtml = unlocked
                            ? `
                                <button type="button" class="pc-ctrl-btn ${
                                    isCareer ? "js-launch-career-case" : "js-launch-freeplay-case"
                                }" data-case-id="${scen.id}">
                                    ${isCareer ? (completed ? "Replay Case" : "Start Case") : "Practice Case"} &rarr;
                                </button>
                            `
                            : `
                                <button type="button" class="pc-ctrl-btn is-disabled" disabled aria-disabled="true">
                                    Complete Case ${String(scen.id - 1).padStart(2, "0")} to Unlock
                                </button>
                            `;

                        return `
                            <article class="fixpc-case-card${!unlocked ? " is-locked" : ""}${
                            completed && isCareer ? " is-completed" : ""
                        }">
                                <div>
                                    <div class="fixpc-case-card-top">
                                        <span class="fixpc-case-code">${escapeHtml(scen.code)}</span>
                                        ${statusBadge}
                                    </div>
                                    <h5 class="fixpc-case-title">${escapeHtml(scen.title)}</h5>
                                    <p class="fixpc-case-excerpt">${escapeHtml(scen.complaint)}</p>
                                </div>
                                <div class="fixpc-case-card-footer">
                                    ${bestScoreHtml}
                                    ${actionBtnHtml}
                                </div>
                            </article>
                        `;
                    })
                    .join("");

                return `
                    <div class="fixpc-level-block">
                        <h5 class="fixpc-level-header">${lvl.title}</h5>
                        <div class="fixpc-cases-grid">${cardsHtml}</div>
                    </div>
                `;
            })
            .join("");
    }

    // ------------------------------------------------------------------------
    // 4. INTERACTIVE TECHNICIAN WORKSTATION VIEW
    // ------------------------------------------------------------------------
    function launchWorkstationCase(caseId, mode) {
        const saved = window.FixPCStorage.loadState();
        const snap = window.FixPCGameEngine.startCase(
            caseId,
            mode,
            saved.selectedDifficulty || "beginner"
        );
        if (!snap) return;

        currentView = "workstation";
        activeHintMessage = null;
        renderWorkstation();
    }

    function renderWorkstation(feedbackObj) {
        if (!rootEl) return;
        const snap = window.FixPCGameEngine.getSessionSnapshot();
        if (!snap) return;

        if (snap.isCompleted && snap.completionReport) {
            renderCompletionScreen(snap.completionReport);
            return;
        }

        const scen = snap.scenario;
        const opts = snap.filteredOptions;

        // Determine current workflow step (1..4)
        const step1Done = snap.hasRequiredEvidence;
        const step2Done = snap.diagnosisConfirmed;
        const step3Done = snap.repairPerformed;

        const feedbackBannerHtml = feedbackObj
            ? `
                <div class="pc-sim-feedback is-${escapeHtml(feedbackObj.type || "neutral")}" role="status" aria-live="polite">
                    ${escapeHtml(feedbackObj.message)}
                </div>
            `
            : `
                <div class="pc-sim-feedback is-neutral" role="status" aria-live="polite">
                    [WORKFLOW] Step 1: Run diagnostic tools to investigate the customer complaint before selecting a diagnosis.
                </div>
            `;

        const hintBannerHtml = activeHintMessage
            ? `
                <div class="pc-hint-banner">
                    <span><strong>Technician Hint:</strong> ${escapeHtml(activeHintMessage)}</span>
                    <button type="button" class="pc-hint-dismiss" id="fixPcDismissHintBtn">Dismiss</button>
                </div>
            `
            : "";

        // Diagnostic buttons
        const diagnosticsHtml = opts.diagnosticActions
            .map((act) => {
                const alreadyRun = snap.performedDiagnostics.includes(act.id);
                return `
                    <button type="button" class="fixpc-action-btn js-run-diag${
                        alreadyRun ? " is-executed" : ""
                    }" data-diag-action-id="${escapeHtml(act.id)}" ${alreadyRun ? "disabled" : ""}>
                        <span class="fixpc-action-label">${escapeHtml(act.label)}</span>
                        <span class="fixpc-action-tag">${alreadyRun ? "COMPLETED &#10003;" : "RUN CHECK"}</span>
                    </button>
                `;
            })
            .join("");

        // Diagnosis options
        const diagnosesHtml = opts.diagnoses
            .map((diag) => {
                const isSelected = snap.selectedDiagnosisId === diag.id;
                const isLocked = !step1Done || step2Done;
                return `
                    <label class="fixpc-radio-card${isSelected ? " is-selected" : ""}${
                    isLocked ? " is-disabled" : ""
                }">
                        <input type="radio" name="fixpc_diagnosis" value="${escapeHtml(diag.id)}" ${
                    isSelected ? "checked" : ""
                } ${isLocked ? "disabled" : ""} />
                        <span>${escapeHtml(diag.label)}</span>
                    </label>
                `;
            })
            .join("");

        // Repair options
        const repairsHtml = opts.repairs
            .map((rep) => {
                const isSelected = snap.selectedRepairId === rep.id;
                const isLocked = !step2Done || step3Done;
                return `
                    <label class="fixpc-radio-card${isSelected ? " is-selected" : ""}${
                    isLocked ? " is-disabled" : ""
                }">
                        <input type="radio" name="fixpc_repair" value="${escapeHtml(rep.id)}" ${
                    isSelected ? "checked" : ""
                } ${isLocked ? "disabled" : ""} />
                        <span>
                            ${escapeHtml(rep.label)}
                            ${
                                rep.requiresPowerOff
                                    ? `<em class="fixpc-safety-req-tag">[Requires Power-Off Safety Switch]</em>`
                                    : ""
                            }
                        </span>
                    </label>
                `;
            })
            .join("");

        // Technician Activity Log
        const logEntriesHtml = snap.activityLog
            .map(
                (entry) => `
                <li class="fixpc-log-item is-${escapeHtml(entry.type)}">
                    <span class="fixpc-log-time">[${escapeHtml(entry.time)}]</span>
                    <span class="fixpc-log-text">${escapeHtml(entry.text)}</span>
                </li>
            `
            )
            .join("");

        rootEl.innerHTML = `
            <div class="fixpc-screen fixpc-workstation-screen">
                <!-- Top Workstation Bar -->
                <div class="pc-sim-topbar">
                    <div class="fixpc-ws-title-group">
                        <button type="button" class="pc-ctrl-btn" id="fixPcExitCaseBtn">
                            &larr; ${snap.mode === "career" ? "Career Dashboard" : "Free Play List"}
                        </button>
                        <div>
                            <span class="fixpc-case-code">${escapeHtml(scen.code)} &bull; ${escapeHtml(
            snap.mode === "career" ? "CAREER MODE" : "FREE PLAY"
        )} (${escapeHtml(snap.difficulty.toUpperCase())})</span>
                            <h3 class="fixpc-ws-heading">${escapeHtml(scen.title)}</h3>
                        </div>
                    </div>

                    <div class="pc-sim-metrics">
                        <div class="pc-metric-pill">
                            <span class="pc-metric-label">SCORE:</span>
                            <span class="pc-metric-val" id="fixPcLiveScore">${snap.score} PTS</span>
                        </div>
                        <div class="pc-metric-pill">
                            <span class="pc-metric-label">TIME:</span>
                            <span class="pc-metric-val" id="fixPcLiveTimer">${snap.formattedTime}</span>
                        </div>
                        <button type="button" class="pc-ctrl-btn" id="fixPcRequestHintBtn">
                            Hint (−5 pts)
                        </button>
                    </div>
                </div>

                <!-- Workflow Stepper -->
                <div class="fixpc-workflow-stepper" aria-label="Troubleshooting stages">
                    <div class="fixpc-step-pill ${!step1Done ? "is-current" : "is-done"}">
                        <span>1. Investigate ${step1Done ? "✓" : ""}</span>
                    </div>
                    <div class="fixpc-step-pill ${
                        step1Done && !step2Done ? "is-current" : step2Done ? "is-done" : ""
                    }">
                        <span>2. Diagnose ${step2Done ? "✓" : ""}</span>
                    </div>
                    <div class="fixpc-step-pill ${
                        step2Done && !step3Done ? "is-current" : step3Done ? "is-done" : ""
                    }">
                        <span>3. Repair ${step3Done ? "✓" : ""}</span>
                    </div>
                    <div class="fixpc-step-pill ${step3Done ? "is-current" : ""}">
                        <span>4. Verify</span>
                    </div>
                </div>

                ${hintBannerHtml}
                ${feedbackBannerHtml}

                <!-- Two-Column Technician Workbench -->
                <div class="fixpc-workbench-grid">
                    <!-- Left Column: Complaint, System Visual, Safety Switch & Activity Log -->
                    <div class="fixpc-left-col">
                        <!-- Customer Complaint Card -->
                        <div class="fixpc-panel-card">
                            <div class="pc-panel-title-row">
                                <span class="pc-panel-heading">CUSTOMER COMPLAINT</span>
                                <span class="pc-panel-subtag">${escapeHtml(scen.customerName)}</span>
                            </div>
                            <blockquote class="fixpc-complaint-quote">
                                "${escapeHtml(scen.complaint)}"
                            </blockquote>
                        </div>

                        <!-- Computer & Monitor Illustration + Telemetry -->
                        <div class="fixpc-panel-card">
                            <div class="pc-panel-title-row">
                                <span class="pc-panel-heading">WORKSTATION BENCH</span>
                                <span class="pc-panel-subtag">${
                                    snap.powerOffSafetyActive ? "AC UNPLUGGED (SAFE)" : "AC LIVE"
                                }</span>
                            </div>
                            <div class="fixpc-bench-illustration">
                                <img src="image/playground/fix-the-pc/workstation.svg" alt="Desktop computer and monitor workstation" />
                            </div>
                            <div class="fixpc-telemetry-boxes">
                                <div class="fixpc-telemetry-item">
                                    <span class="fixpc-tel-label">MONITOR STATUS</span>
                                    <strong class="fixpc-tel-val">${escapeHtml(
                                        step3Done ? "REPAIR APPLIED — READY TO VERIFY" : scen.symptomMonitor
                                    )}</strong>
                                </div>
                                <div class="fixpc-telemetry-item">
                                    <span class="fixpc-tel-label">TOWER / HARDWARE STATUS</span>
                                    <strong class="fixpc-tel-val">${escapeHtml(
                                        step3Done ? "AWAITING POST & VERIFICATION TEST" : scen.symptomTower
                                    )}</strong>
                                </div>
                            </div>

                            <!-- Electrical Safety Switch -->
                            <div class="fixpc-safety-bar">
                                <div class="fixpc-safety-info">
                                    <img src="image/playground/fix-the-pc/safety-power.svg" alt="" aria-hidden="true" />
                                    <div>
                                        <strong>Electrical Safety Switch</strong>
                                        <p>Power off PC &amp; unplug AC before internal hardware repairs.</p>
                                    </div>
                                </div>
                                <button type="button" class="pc-ctrl-btn ${
                                    snap.powerOffSafetyActive ? "is-active-safety" : ""
                                }" id="fixPcToggleSafetyBtn" aria-pressed="${snap.powerOffSafetyActive}">
                                    ${
                                        snap.powerOffSafetyActive
                                            ? "AC Unplugged (Safe) ✓"
                                            : "Power Off & Unplug AC"
                                    }
                                </button>
                            </div>
                        </div>

                        <!-- Technician Activity Log -->
                        <div class="fixpc-panel-card">
                            <div class="pc-panel-title-row">
                                <span class="pc-panel-heading">TECHNICIAN ACTIVITY LOG</span>
                                <span class="pc-panel-subtag">${snap.activityLog.length} Entries</span>
                            </div>
                            <ul class="fixpc-log-list" aria-live="polite">
                                ${logEntriesHtml}
                            </ul>
                        </div>
                    </div>

                    <!-- Right Column: Step 1 Diagnostics, Step 2 Diagnosis, Step 3 Repair, Step 4 Verify -->
                    <div class="fixpc-right-col">
                        <!-- Step 1: Diagnostic Tools -->
                        <div class="fixpc-panel-card">
                            <div class="pc-panel-title-row">
                                <span class="pc-panel-heading">STEP 1 — DIAGNOSTIC TOOLS</span>
                                <span class="pc-panel-subtag">${
                                    step1Done ? "Key Evidence Found ✓" : "Investigation Required"
                                }</span>
                            </div>
                            <p class="fixpc-step-subtext">
                                Run appropriate diagnostic checks to gather evidence. Unnecessary checks deduct 5 points.
                            </p>
                            <div class="fixpc-actions-stack">
                                ${diagnosticsHtml}
                            </div>
                        </div>

                        <!-- Step 2: Possible Root Causes -->
                        <div class="fixpc-panel-card">
                            <div class="pc-panel-title-row">
                                <span class="pc-panel-heading">STEP 2 — SELECT ROOT CAUSE DIAGNOSIS</span>
                                <span class="pc-panel-subtag">${
                                    step2Done
                                        ? "Confirmed ✓"
                                        : step1Done
                                        ? "Ready to Diagnose"
                                        : "Gather Evidence First"
                                }</span>
                            </div>
                            <div class="fixpc-radio-list">
                                ${diagnosesHtml}
                            </div>
                            <button type="button" class="btn btn-secondary fixpc-step-btn" id="fixPcConfirmDiagBtn" ${
                                !step1Done || step2Done ? "disabled" : ""
                            }>
                                <span>${step2Done ? "DIAGNOSIS CONFIRMED ✓" : "CONFIRM DIAGNOSIS"}</span>
                            </button>
                        </div>

                        <!-- Step 3: Repair Options -->
                        <div class="fixpc-panel-card">
                            <div class="pc-panel-title-row">
                                <span class="pc-panel-heading">STEP 3 — PERFORM REPAIR</span>
                                <span class="pc-panel-subtag">${
                                    step3Done
                                        ? "Repair Performed ✓"
                                        : step2Done
                                        ? "Select Repair Action"
                                        : "Confirm Diagnosis First"
                                }</span>
                            </div>
                            <div class="fixpc-radio-list">
                                ${repairsHtml}
                            </div>
                            <button type="button" class="btn btn-secondary fixpc-step-btn" id="fixPcPerformRepairBtn" ${
                                !step2Done || step3Done ? "disabled" : ""
                            }>
                                <span>${step3Done ? "REPAIR COMPLETED ✓" : "PERFORM SELECTED REPAIR"}</span>
                            </button>
                        </div>

                        <!-- Step 4: Verification Button -->
                        <div class="fixpc-panel-card fixpc-verify-card">
                            <div class="pc-panel-title-row">
                                <span class="pc-panel-heading">STEP 4 — SYSTEM VERIFICATION</span>
                                <span class="pc-panel-subtag">${
                                    step3Done ? "Ready to Verify!" : "Complete Step 3 First"
                                }</span>
                            </div>
                            <p class="fixpc-step-subtext">
                                Reconnect power, boot the system, and verify that the customer's issue is resolved.
                            </p>
                            <button type="button" class="btn btn-primary fixpc-full-btn" id="fixPcVerifyBtn" ${
                                !step3Done ? "disabled" : ""
                            }>
                                <span>VERIFY REPAIR &amp; COMPLETE CASE</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        bindWorkstationEvents(snap);
    }

    function bindWorkstationEvents(snap) {
        const exitBtn = document.getElementById("fixPcExitCaseBtn");
        if (exitBtn) {
            exitBtn.addEventListener("click", () => {
                if (snap.mode === "career") {
                    renderCareerDashboard();
                } else {
                    renderFreePlaySelector();
                }
            });
        }

        const hintBtn = document.getElementById("fixPcRequestHintBtn");
        if (hintBtn) {
            hintBtn.addEventListener("click", () => {
                const res = window.FixPCGameEngine.requestHint();
                if (res) {
                    activeHintMessage = res.hintText;
                    renderWorkstation({
                        type: "neutral",
                        message: `[HINT USED −5 PTS] ${res.hintText}`
                    });
                }
            });
        }

        const dismissHintBtn = document.getElementById("fixPcDismissHintBtn");
        if (dismissHintBtn) {
            dismissHintBtn.addEventListener("click", () => {
                activeHintMessage = null;
                renderWorkstation();
            });
        }

        const safetyBtn = document.getElementById("fixPcToggleSafetyBtn");
        if (safetyBtn) {
            safetyBtn.addEventListener("click", () => {
                const active = window.FixPCGameEngine.togglePowerOffSafety();
                renderWorkstation({
                    type: "neutral",
                    message: active
                        ? "[SAFETY ACTIVE] PC powered off and AC cord unplugged. Safe to perform internal hardware repairs."
                        : "[SAFETY OFF] AC power connected."
                });
            });
        }

        // Step 1: Diagnostic Tool Buttons
        document.querySelectorAll(".js-run-diag[data-diag-action-id]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const actionId = btn.getAttribute("data-diag-action-id");
                const res = window.FixPCGameEngine.runDiagnosticAction(actionId);
                if (!res) return;

                if (res.alreadyRun) {
                    renderWorkstation({ type: "neutral", message: res.message });
                    return;
                }

                const act = res.action;
                renderWorkstation({
                    type: act.isRelevant ? "success" : "error",
                    message: `${act.label}: ${act.result}`
                });
            });
        });

        // Step 2: Confirm Diagnosis Button
        const confirmDiagBtn = document.getElementById("fixPcConfirmDiagBtn");
        if (confirmDiagBtn) {
            confirmDiagBtn.addEventListener("click", () => {
                const checked = document.querySelector('input[name="fixpc_diagnosis"]:checked');
                const diagId = checked ? checked.value : null;
                const res = window.FixPCGameEngine.submitDiagnosis(diagId);
                if (res) {
                    renderWorkstation({
                        type: res.success ? "success" : "error",
                        message: res.message
                    });
                }
            });
        }

        // Step 3: Perform Repair Button
        const performRepairBtn = document.getElementById("fixPcPerformRepairBtn");
        if (performRepairBtn) {
            performRepairBtn.addEventListener("click", () => {
                const checked = document.querySelector('input[name="fixpc_repair"]:checked');
                const repId = checked ? checked.value : null;
                const res = window.FixPCGameEngine.performRepair(repId);
                if (res) {
                    renderWorkstation({
                        type: res.success ? "success" : "error",
                        message: res.message
                    });
                }
            });
        }

        // Step 4: Verify Button
        const verifyBtn = document.getElementById("fixPcVerifyBtn");
        if (verifyBtn) {
            verifyBtn.addEventListener("click", () => {
                const report = window.FixPCGameEngine.verifySystemRepair();
                if (report && report.success) {
                    renderCompletionScreen(report);
                } else if (report) {
                    renderWorkstation({
                        type: "error",
                        message: report.message
                    });
                }
            });
        }
    }

    // ------------------------------------------------------------------------
    // 5. CASE COMPLETION & CAREER COMPLETION SCREEN
    // ------------------------------------------------------------------------
    function renderCompletionScreen(report) {
        if (!rootEl || !report) return;

        const isCareerDone =
            report.mode === "career" &&
            report.careerSummary &&
            report.careerSummary.careerCompleted;

        const careerCompletedBlock = isCareerDone
            ? `
                <div class="fixpc-career-complete-banner">
                    <span class="fixpc-badge-pill">ALL 12 CAREER CASES COMPLETED</span>
                    <h3>EXPERT TECHNICIAN — CAREER COMPLETED.</h3>
                    <p>Congratulations! You have solved all 12 hardware and system troubleshooting cases and reached the highest in-game rank of Expert Technician.</p>
                    <p class="fixpc-disclaimer-note">
                         Clarifying Note: Technician ranks are in-game achievements rather than professional certifications.
                    </p>
                </div>
            `
            : "";

        const newAchievementsHtml =
            report.newlyUnlockedAchievements && report.newlyUnlockedAchievements.length > 0
                ? `
                    <div class="fixpc-complete-box">
                        <span class="fixpc-complete-label">ACHIEVEMENTS UNLOCKED</span>
                        <div class="fixpc-unlocked-pills">
                            ${report.newlyUnlockedAchievements
                                .map(
                                    (a) =>
                                        `<span class="fixpc-ach-pill">&#10003; ${escapeHtml(
                                            a.title
                                        )} — ${escapeHtml(a.description)}</span>`
                                )
                                .join("")}
                        </div>
                    </div>
                `
                : `
                    <div class="fixpc-complete-box">
                        <span class="fixpc-complete-label">ACHIEVEMENTS UNLOCKED</span>
                        <p class="fixpc-complete-text">No new achievements unlocked on this run.</p>
                    </div>
                `;

        const nextCaseBtnHtml = report.nextScenario
            ? `
                <button type="button" class="btn btn-primary" id="fixPcNextCaseBtn">
                    <span>NEXT CASE: ${escapeHtml(report.nextScenario.code)} &rarr;</span>
                </button>
            `
            : "";

        rootEl.innerHTML = `
            <div class="fixpc-screen fixpc-completion-screen">
                ${careerCompletedBlock}

                <div class="pc-completion-overlay">
                    <div class="pc-completion-header">
                        <span class="pc-completion-badge">${escapeHtml(report.code)} &bull; ${escapeHtml(
            report.title
        )}</span>
                        <h3 class="pc-completion-title">SYSTEM RESTORED.</h3>
                        <p class="pc-completion-lead">${escapeHtml(report.verificationText)}</p>
                    </div>

                    <div class="pc-completion-stats">
                        <div class="pc-stat-box">
                            <span class="pc-stat-label">Final Score</span>
                            <strong class="pc-stat-val">${report.finalScore} / 100</strong>
                        </div>
                        <div class="pc-stat-box">
                            <span class="pc-stat-label">XP Earned</span>
                            <strong class="pc-stat-val">+${report.xpEarned} XP</strong>
                            <span class="fixpc-xp-sub">${escapeHtml(report.xpReason)}</span>
                        </div>
                        <div class="pc-stat-box">
                            <span class="pc-stat-label">Time Taken</span>
                            <strong class="pc-stat-val">${escapeHtml(report.formattedTime)}</strong>
                        </div>
                    </div>

                    <div class="fixpc-summary-details">
                        <div class="fixpc-complete-box">
                            <span class="fixpc-complete-label">DIAGNOSED ROOT CAUSE</span>
                            <p class="fixpc-complete-text">${escapeHtml(report.rootCause)}</p>
                        </div>
                        <div class="fixpc-complete-box">
                            <span class="fixpc-complete-label">REPAIR PERFORMED</span>
                            <p class="fixpc-complete-text">${escapeHtml(report.repairPerformed)}</p>
                        </div>
                        <div class="fixpc-complete-box">
                            <span class="fixpc-complete-label">TECHNICAL TAKEAWAY</span>
                            <p class="fixpc-complete-text">${escapeHtml(report.educationalExplanation)}</p>
                        </div>
                        ${newAchievementsHtml}
                    </div>

                    <div class="pc-completion-actions">
                        ${nextCaseBtnHtml}
                        <button type="button" class="btn btn-secondary" id="fixPcReplayCurrentBtn">
                            <span>REPLAY CASE</span>
                        </button>
                        <button type="button" class="btn btn-secondary" id="fixPcReturnDashboardBtn">
                            <span>${
                                report.mode === "career"
                                    ? "CAREER DASHBOARD & ACHIEVEMENTS"
                                    : "FREE PLAY LIST"
                            }</span>
                        </button>
                        <button type="button" class="btn btn-secondary" id="fixPcCompleteToHubBtn">
                            <span>RETURN TO PLAYGROUND</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        const nextBtn = document.getElementById("fixPcNextCaseBtn");
        if (nextBtn && report.nextScenario) {
            nextBtn.addEventListener("click", () => {
                launchWorkstationCase(report.nextScenario.id, report.mode);
            });
        }

        const replayBtn = document.getElementById("fixPcReplayCurrentBtn");
        if (replayBtn) {
            replayBtn.addEventListener("click", () => {
                launchWorkstationCase(report.caseId, report.mode);
            });
        }

        const dashBtn = document.getElementById("fixPcReturnDashboardBtn");
        if (dashBtn) {
            dashBtn.addEventListener("click", () => {
                if (report.mode === "career") {
                    renderCareerDashboard();
                } else {
                    renderFreePlaySelector();
                }
            });
        }

        const hubBtn = document.getElementById("fixPcCompleteToHubBtn");
        if (hubBtn) {
            hubBtn.addEventListener("click", () => {
                if (typeof onReturnToPlaygroundCallback === "function") {
                    onReturnToPlaygroundCallback();
                }
            });
        }
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    return {
        init,
        renderMainMenu,
        renderCareerDashboard,
        renderFreePlaySelector,
        launchWorkstationCase
    };
})();
