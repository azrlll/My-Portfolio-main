// ============================================================================
// FIX THE PC — TECHNICIAN CAREER PROGRESSION MODULE
// Computes Technician Rank, Career Level, unlocked cases, and completion status.
// ============================================================================

window.FixPCCareer = (function () {
    "use strict";

    /**
     * Progression rules from prompt Section 5:
     * - Start at Case 1 (Level 1 — Technician in Training)
     * - Unlock the next case after completing the previous case
     * - Complete Cases 1–3 to advance to Junior Technician (Level 2)
     * - Complete Cases 4–6 to advance to Skilled Technician (Level 3)
     * - Complete Cases 7–9 to advance to Expert Technician (Level 4)
     * - Complete Cases 10–12 to finish the career (Expert Technician — Career Completed)
     */
    function getCareerSummary(savedState) {
        const completedSet = new Set((savedState && savedState.completedCases) || []);
        const totalCases = 12;
        const completedCount = completedSet.size;

        const level1Done = completedSet.has(1) && completedSet.has(2) && completedSet.has(3);
        const level2Done = level1Done && completedSet.has(4) && completedSet.has(5) && completedSet.has(6);
        const level3Done = level2Done && completedSet.has(7) && completedSet.has(8) && completedSet.has(9);
        const careerDone = level3Done && completedSet.has(10) && completedSet.has(11) && completedSet.has(12);

        let rankTitle = "Technician in Training";
        let careerLevel = 1;

        if (careerDone) {
            rankTitle = "Expert Technician (Career Completed)";
            careerLevel = 4;
        } else if (level3Done) {
            rankTitle = "Expert Technician";
            careerLevel = 4;
        } else if (level2Done) {
            rankTitle = "Skilled Technician";
            careerLevel = 3;
        } else if (level1Done) {
            rankTitle = "Junior Technician";
            careerLevel = 2;
        }

        // Determine highest unlocked case ID (Case 1 is always unlocked; Case N unlocks when Case N-1 is completed)
        let nextPlayableCaseId = 1;
        for (let i = 1; i <= totalCases; i++) {
            if (!completedSet.has(i)) {
                nextPlayableCaseId = i;
                break;
            }
            if (i === totalCases) {
                nextPlayableCaseId = totalCases;
            }
        }

        return {
            rankTitle,
            careerLevel,
            totalXp: (savedState && savedState.totalXp) || 0,
            completedCount,
            totalCases,
            progressPercent: Math.round((completedCount / totalCases) * 100),
            careerCompleted: careerDone,
            nextPlayableCaseId
        };
    }

    /**
     * A Career case `caseId` is unlocked if `caseId === 1` or `caseId - 1` is completed.
     */
    function isCaseUnlockedInCareer(caseId, savedState) {
        if (caseId <= 1) return true;
        const completedSet = new Set((savedState && savedState.completedCases) || []);
        return completedSet.has(caseId - 1) || completedSet.has(caseId);
    }

    return {
        getCareerSummary,
        isCaseUnlockedInCareer
    };
})();
