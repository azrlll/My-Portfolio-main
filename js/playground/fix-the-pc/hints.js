// ============================================================================
// FIX THE PC — CONTEXTUAL HINTS MODULE
// Provides stage-aware hints tailored to the active case and difficulty.
// ============================================================================

window.FixPCHints = (function () {
    "use strict";

    /**
     * Returns a contextual hint string based on the current workflow stage of the case.
     */
    function getContextualHint(scenario, sessionState) {
        if (!scenario || !scenario.hints) {
            return "Run the diagnostic checks first to uncover evidence before selecting a root cause.";
        }

        if (!sessionState.hasRequiredEvidence) {
            return `Investigation Hint: ${scenario.hints.investigation}`;
        }

        if (!sessionState.diagnosisConfirmed) {
            return `Diagnosis Hint: ${scenario.hints.diagnosis}`;
        }

        if (!sessionState.repairPerformed) {
            return `Repair Hint: ${scenario.hints.repair}`;
        }

        return "Verification Hint: Click 'Verify Repair & Run System Test' to confirm the system boots and operates properly.";
    }

    return {
        getContextualHint
    };
})();
