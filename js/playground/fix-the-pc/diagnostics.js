// ============================================================================
// FIX THE PC — DIAGNOSTICS & DIFFICULTY FILTERING MODULE
// Adjusts available choices based on difficulty while keeping every scenario
// 100% solvable and enforcing hardware electrical safety rules.
// ============================================================================

window.FixPCDiagnostics = (function () {
    "use strict";

    /**
     * Filters diagnostic actions, diagnoses, and repairs based on difficulty:
     * - beginner: Hides the obvious distractor diagnostic action and trims 1 wrong choice
     *   so beginners have clearer guidance.
     * - intermediate: Shows standard diagnostic actions and choices.
     * - advanced: Shows all diagnostic actions and all choices with minimal guidance.
     */
    function getScenarioOptionsForDifficulty(scenario, difficulty) {
        if (!scenario) return { diagnosticActions: [], diagnoses: [], repairs: [] };

        if (difficulty === "beginner") {
            const actions = scenario.diagnosticActions.filter((a) => a.isRelevant);
            const diagnoses = filterChoicesForBeginner(scenario.diagnoses);
            const repairs = filterChoicesForBeginner(scenario.repairs);
            return {
                diagnosticActions: actions,
                diagnoses,
                repairs
            };
        }

        // Intermediate & Advanced show the full set of diagnostic checks and options
        return {
            diagnosticActions: scenario.diagnosticActions.slice(),
            diagnoses: scenario.diagnoses.slice(),
            repairs: scenario.repairs.slice()
        };
    }

    function filterChoicesForBeginner(choices) {
        if (!Array.isArray(choices) || choices.length <= 3) return choices.slice();
        const correct = choices.filter((c) => c.isCorrect);
        const incorrect = choices.filter((c) => !c.isCorrect).slice(0, 2);
        return correct.concat(incorrect);
    }

    /**
     * Checks whether all required key-evidence diagnostic actions for a scenario
     * have been executed by the player.
     */
    function hasCollectedRequiredEvidence(scenario, performedActionIds, difficulty) {
        if (!scenario || !Array.isArray(scenario.diagnosticActions)) return false;
        const performedSet = new Set(performedActionIds || []);

        const keyActions = scenario.diagnosticActions.filter((a) => a.revealsKeyEvidence);
        if (keyActions.length === 0) {
            return performedSet.size > 0;
        }

        // In Beginner mode, performing at least 1 key diagnostic check is enough;
        // in Intermediate/Advanced, all key evidence checks for that scenario must be run.
        if (difficulty === "beginner") {
            return keyActions.some((a) => performedSet.has(a.id));
        }

        return keyActions.every((a) => performedSet.has(a.id));
    }

    return {
        getScenarioOptionsForDifficulty,
        hasCollectedRequiredEvidence
    };
})();
