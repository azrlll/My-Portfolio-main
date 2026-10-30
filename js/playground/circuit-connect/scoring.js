// ============================================================================
// CIRCUIT CONNECT — SCORING ENGINE
// Base Score: 100 points
// Penalties: -10 incorrect test, -5 hint used, -2 unnecessary connection
// Minimum Floor: 0 points
// ============================================================================

window.CircuitConnectScoring = (function () {
    "use strict";

    const BASE_SCORE = 100;
    const PENALTY_FAILED_TEST = 10;
    const PENALTY_HINT_USED = 5;
    const PENALTY_UNNECESSARY_WIRE = 2;

    function clampScore(val) {
        return Math.max(0, Math.min(BASE_SCORE, Math.round(val)));
    }

    function calculateCurrentScore(metrics) {
        const m = metrics || {};
        const failedTests = Number(m.failedTests || 0);
        const hintsUsed = Number(m.hintsUsed || 0);
        const unnecessaryWires = Number(m.unnecessaryWires || 0);

        const totalDeductions =
            failedTests * PENALTY_FAILED_TEST +
            hintsUsed * PENALTY_HINT_USED +
            unnecessaryWires * PENALTY_UNNECESSARY_WIRE;

        return clampScore(BASE_SCORE - totalDeductions);
    }

    function formatTime(totalSeconds) {
        const secs = Math.max(0, Math.floor(Number(totalSeconds) || 0));
        const mins = Math.floor(secs / 60);
        const rem = secs % 60;
        return `${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
    }

    return {
        BASE_SCORE,
        PENALTY_FAILED_TEST,
        PENALTY_HINT_USED,
        PENALTY_UNNECESSARY_WIRE,
        calculateCurrentScore,
        formatTime
    };
})();
