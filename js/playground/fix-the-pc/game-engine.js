// ============================================================================
// FIX THE PC — CORE TROUBLESHOOTING GAME ENGINE
// Manages active case state, workflow stages (Complaint -> Investigation ->
// Diagnosis -> Repair -> Verification -> Completion), timer, and activity log.
// ============================================================================

window.FixPCGameEngine = (function () {
    "use strict";

    let session = null;
    let timerIntervalId = null;
    let onTickCallback = null;

    function getScenarios() {
        return Array.isArray(window.FIX_PC_SCENARIOS) ? window.FIX_PC_SCENARIOS : [];
    }

    function getScenarioById(id) {
        const numId = Number(id);
        return getScenarios().find((s) => s.id === numId) || null;
    }

    function stopTimer() {
        if (timerIntervalId !== null) {
            window.clearInterval(timerIntervalId);
            timerIntervalId = null;
        }
    }

    function startTimer() {
        stopTimer();
        timerIntervalId = window.setInterval(() => {
            if (!session || session.isCompleted) return;
            session.elapsedSeconds += 1;
            if (typeof onTickCallback === "function") {
                onTickCallback(session.elapsedSeconds);
            }
        }, 1000);
    }

    /**
     * Starts a new troubleshooting case session.
     * @param {number} caseId - 1..12
     * @param {"career"|"freeplay"} mode
     * @param {"beginner"|"intermediate"|"advanced"} difficulty
     */
    function startCase(caseId, mode, difficulty) {
        stopTimer();
        const scenario = getScenarioById(caseId);
        if (!scenario) return null;

        const filteredOptions = window.FixPCDiagnostics.getScenarioOptionsForDifficulty(
            scenario,
            difficulty
        );

        session = {
            caseId: scenario.id,
            scenario,
            mode: mode === "career" ? "career" : "freeplay",
            difficulty: difficulty || "beginner",
            score: window.FixPCScoring.INITIAL_SCORE,
            elapsedSeconds: 0,
            performedDiagnostics: [],
            hasRequiredEvidence: false,
            selectedDiagnosisId: null,
            diagnosisConfirmed: false,
            confirmedDiagnosisObj: null,
            powerOffSafetyActive: false,
            selectedRepairId: null,
            repairPerformed: false,
            performedRepairObj: null,
            isVerified: false,
            isCompleted: false,
            hintsUsed: 0,
            incorrectDiagnoses: 0,
            incorrectRepairs: 0,
            unnecessaryDiagnostics: 0,
            activityLog: [
                {
                    time: "00:00",
                    type: "info",
                    text: `Ticket ${scenario.code} opened for ${scenario.customerName}. Begin investigation before selecting a diagnosis.`
                }
            ],
            filteredOptions,
            completionReport: null
        };

        startTimer();
        return getSessionSnapshot();
    }

    function appendLog(type, text) {
        if (!session) return;
        const timeStr = formatTime(session.elapsedSeconds);
        session.activityLog.unshift({ time: timeStr, type, text });
    }

    /**
     * Stage 1: Execute a diagnostic tool/action.
     */
    function runDiagnosticAction(actionId) {
        if (!session || session.isCompleted) return null;

        if (session.performedDiagnostics.includes(actionId)) {
            return {
                alreadyRun: true,
                message: "This diagnostic check has already been performed. Check the Technician Activity Log."
            };
        }

        const action = session.scenario.diagnosticActions.find((a) => a.id === actionId);
        if (!action) return null;

        session.performedDiagnostics.push(action.id);

        if (!action.isRelevant) {
            session.unnecessaryDiagnostics += 1;
            session.score = window.FixPCScoring.applyPenalty(
                session.score,
                "UNNECESSARY_DIAGNOSTIC"
            );
            appendLog("penalty", `[−5 PTS] ${action.label}: ${action.result}`);
        } else {
            appendLog(
                action.revealsKeyEvidence ? "evidence" : "info",
                `[DIAGNOSTIC] ${action.label}: ${action.result}`
            );
        }

        session.hasRequiredEvidence = window.FixPCDiagnostics.hasCollectedRequiredEvidence(
            session.scenario,
            session.performedDiagnostics,
            session.difficulty
        );

        return {
            action,
            hasRequiredEvidence: session.hasRequiredEvidence,
            score: session.score
        };
    }

    /**
     * Stage 2: Submit a root-cause diagnosis.
     * Requires key diagnostic evidence to be collected first.
     */
    function submitDiagnosis(diagnosisId) {
        if (!session || session.isCompleted) return null;

        if (!session.hasRequiredEvidence) {
            return {
                success: false,
                blockedByInvestigation: true,
                message:
                    "Investigation Incomplete: Run the relevant diagnostic checks to uncover key hardware evidence before locking in a root cause diagnosis."
            };
        }

        if (session.diagnosisConfirmed) {
            return {
                success: true,
                alreadyConfirmed: true,
                message: "Root cause diagnosis is already confirmed. Proceed to the Repair step."
            };
        }

        const diagObj = session.scenario.diagnoses.find((d) => d.id === diagnosisId);
        if (!diagObj) {
            return {
                success: false,
                message: "Please select a root cause diagnosis option first."
            };
        }

        session.selectedDiagnosisId = diagnosisId;

        if (diagObj.isCorrect) {
            session.diagnosisConfirmed = true;
            session.confirmedDiagnosisObj = diagObj;
            appendLog(
                "success",
                `[DIAGNOSIS CONFIRMED] Root cause identified: ${diagObj.label}. Proceed to Repair.`
            );
            return {
                success: true,
                message: `Correct diagnosis confirmed: ${diagObj.label}. Now select and perform the appropriate repair.`
            };
        } else {
            session.incorrectDiagnoses += 1;
            session.score = window.FixPCScoring.applyPenalty(
                session.score,
                "INCORRECT_DIAGNOSIS"
            );
            appendLog(
                "penalty",
                `[−10 PTS] Incorrect diagnosis rejected ("${diagObj.label}"). Review your diagnostic findings.`
            );
            return {
                success: false,
                message: `Incorrect diagnosis (−10 pts): "${diagObj.label}" does not match the diagnostic evidence collected.`
            };
        }
    }

    /**
     * Toggles the ESD / AC Power-Off Safety switch before internal repairs.
     */
    function togglePowerOffSafety(forceValue) {
        if (!session || session.isCompleted) return false;
        session.powerOffSafetyActive =
            typeof forceValue === "boolean" ? forceValue : !session.powerOffSafetyActive;

        appendLog(
            "info",
            session.powerOffSafetyActive
                ? "[SAFETY] PC powered down, AC cord unplugged, and residual flea power discharged."
                : "[SAFETY] AC power reconnected to workstation."
        );
        return session.powerOffSafetyActive;
    }

    /**
     * Stage 3: Perform a repair action.
     * Requires Diagnosis to be confirmed first, and enforces Power-Off safety for internal repairs.
     */
    function performRepair(repairId) {
        if (!session || session.isCompleted) return null;

        if (!session.diagnosisConfirmed) {
            return {
                success: false,
                message: "Confirm the root cause in Step 2 (Diagnosis) before performing a repair."
            };
        }

        if (session.repairPerformed) {
            return {
                success: true,
                message: "Repair has been performed. Click 'Verify Repair & Run System Test' to verify the fix."
            };
        }

        const repairObj = session.scenario.repairs.find((r) => r.id === repairId);
        if (!repairObj) {
            return {
                success: false,
                message: "Please select a repair action first."
            };
        }

        // Safety check: Internal hardware repairs require powering off and unplugging AC first!
        if (repairObj.requiresPowerOff && !session.powerOffSafetyActive) {
            return {
                success: false,
                safetyBlocked: true,
                message:
                    "SAFETY WARNING: This internal hardware procedure requires powering off the PC and unplugging the AC power cord first! Activate the 'Power Off & Unplug AC' safety switch above before performing this repair."
            };
        }

        session.selectedRepairId = repairId;

        if (repairObj.isCorrect) {
            session.repairPerformed = true;
            session.performedRepairObj = repairObj;
            appendLog(
                "success",
                `[REPAIR PERFORMED] ${repairObj.label}. Ready for Step 4: System Verification.`
            );
            return {
                success: true,
                message: `Repair completed: "${repairObj.label}". Now click 'Verify Repair & Run System Test' to confirm the system is restored.`
            };
        } else {
            session.incorrectRepairs += 1;
            session.score = window.FixPCScoring.applyPenalty(session.score, "INCORRECT_REPAIR");
            appendLog(
                "penalty",
                `[−10 PTS] Ineffective or unsafe repair attempted ("${repairObj.label}").`
            );
            return {
                success: false,
                message: `Incorrect repair (−10 pts): "${repairObj.label}" does not resolve the diagnosed root cause.`
            };
        }
    }

    /**
     * Stage 4: Verify that the repair resolved the fault and complete the case.
     */
    function verifySystemRepair() {
        if (!session) return null;
        if (session.isCompleted) return session.completionReport;

        if (!session.diagnosisConfirmed) {
            return {
                success: false,
                message: "Cannot verify yet: You must investigate and confirm a root-cause diagnosis first."
            };
        }

        if (!session.repairPerformed) {
            return {
                success: false,
                message: "Cannot verify yet: Perform the corrective repair in Step 3 before running verification."
            };
        }

        stopTimer();
        if (session.elapsedSeconds < 1) {
            session.elapsedSeconds = 1;
        }
        session.isVerified = true;
        session.isCompleted = true;

        // Calculate XP, save Career progress, and check achievements
        const saved = window.FixPCStorage.loadState();
        const isCareer = session.mode === "career";
        const alreadyDoneInCareer = saved.completedCases.includes(session.caseId);

        const xpResult = window.FixPCScoring.calculateCareerXp({
            isCareerMode: isCareer,
            alreadyCompletedInCareer: alreadyDoneInCareer,
            finalScore: session.score,
            hintsUsed: session.hintsUsed,
            incorrectRepairs: session.incorrectRepairs
        });

        // Update best score for this case (tracked across runs)
        const prevBest = saved.bestScores[session.caseId] || 0;
        if (session.score > prevBest) {
            saved.bestScores[session.caseId] = session.score;
        }

        // Track no-hint completions for the "No Hints Needed" achievement
        if (session.hintsUsed === 0 && !saved.noHintCases.includes(session.caseId)) {
            saved.noHintCases.push(session.caseId);
        }

        if (isCareer) {
            if (!alreadyDoneInCareer) {
                saved.completedCases.push(session.caseId);
                saved.totalXp += xpResult.totalXpEarned;
            }
        }

        const achEval = window.FixPCAchievements.evaluateUnlocks(saved, {
            caseId: session.caseId,
            elapsedSeconds: session.elapsedSeconds,
            finalScore: session.score,
            hintsUsed: session.hintsUsed
        });

        saved.unlockedAchievements = achEval.allUnlockedIds;
        window.FixPCStorage.saveState(saved);

        const careerSummary = window.FixPCCareer.getCareerSummary(saved);

        appendLog("success", `[VERIFIED] ${session.scenario.verificationText}`);

        const nextCaseId = session.caseId < 12 ? session.caseId + 1 : null;
        const nextScenario = nextCaseId ? getScenarioById(nextCaseId) : null;

        session.completionReport = {
            success: true,
            caseId: session.caseId,
            code: session.scenario.code,
            title: session.scenario.title,
            mode: session.mode,
            rootCause: session.confirmedDiagnosisObj ? session.confirmedDiagnosisObj.label : "",
            repairPerformed: session.performedRepairObj ? session.performedRepairObj.label : "",
            verificationText: session.scenario.verificationText,
            educationalExplanation: session.scenario.educationalExplanation,
            finalScore: session.score,
            xpEarned: xpResult.totalXpEarned,
            xpBreakdown: xpResult.breakdown,
            xpReason: xpResult.reason,
            elapsedSeconds: session.elapsedSeconds,
            formattedTime: formatTime(session.elapsedSeconds),
            newlyUnlockedAchievements: achEval.newlyUnlocked,
            careerSummary,
            nextScenario
        };

        return session.completionReport;
    }

    /**
     * Requests a contextual hint for the current workflow stage (−5 points on first use per stage or per click).
     */
    function requestHint() {
        if (!session || session.isCompleted) return null;

        session.hintsUsed += 1;
        session.score = window.FixPCScoring.applyPenalty(session.score, "HINT_USED");

        const hintText = window.FixPCHints.getContextualHint(session.scenario, session);
        appendLog("penalty", `[−5 PTS] Hint requested: ${hintText}`);

        return {
            hintText,
            score: session.score,
            hintsUsed: session.hintsUsed
        };
    }

    function getSessionSnapshot() {
        if (!session) return null;
        return Object.assign({}, session, {
            formattedTime: formatTime(session.elapsedSeconds),
            activityLog: session.activityLog.slice()
        });
    }

    function formatTime(seconds) {
        const total = Math.max(0, Math.floor(Number(seconds) || 0));
        const m = Math.floor(total / 60);
        const s = total % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }

    function setOnTick(cb) {
        onTickCallback = cb;
    }

    function cleanup() {
        stopTimer();
        session = null;
    }

    return {
        getScenarios,
        getScenarioById,
        startCase,
        runDiagnosticAction,
        submitDiagnosis,
        togglePowerOffSafety,
        performRepair,
        verifySystemRepair,
        requestHint,
        getSessionSnapshot,
        formatTime,
        setOnTick,
        cleanup
    };
})();
