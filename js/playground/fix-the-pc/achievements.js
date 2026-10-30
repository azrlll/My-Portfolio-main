// ============================================================================
// FIX THE PC — ACHIEVEMENTS MODULE
// Defines and evaluates all 6 technician achievements.
// ============================================================================

window.FixPCAchievements = (function () {
    "use strict";

    const ACHIEVEMENT_LIST = [
        {
            id: "first-repair",
            title: "First Repair",
            description: "Complete one career case."
        },
        {
            id: "quick-thinker",
            title: "Quick Thinker",
            description: "Complete a case in under two minutes."
        },
        {
            id: "perfect-diagnosis",
            title: "Perfect Diagnosis",
            description: "Finish a case with 100 points."
        },
        {
            id: "no-hints-needed",
            title: "No Hints Needed",
            description: "Complete three different cases without hints."
        },
        {
            id: "hardware-specialist",
            title: "Hardware Specialist",
            description: "Complete all Level 3 cases (Cases 7–9)."
        },
        {
            id: "troubleshooting-expert",
            title: "Troubleshooting Expert",
            description: "Complete all 12 cases."
        }
    ];

    function getAllAchievements() {
        return ACHIEVEMENT_LIST.slice();
    }

    /**
     * Evaluates which achievements should be unlocked given the updated storage state
     * and the latest completed case metrics.
     * Returns an array of newly unlocked achievement objects.
     */
    function evaluateUnlocks(savedState, latestRun) {
        const currentlyUnlocked = new Set(savedState.unlockedAchievements || []);
        const completedCareerSet = new Set(savedState.completedCases || []);
        const noHintCasesSet = new Set(savedState.noHintCases || []);
        const newlyUnlocked = [];

        function tryUnlock(id) {
            if (!currentlyUnlocked.has(id)) {
                currentlyUnlocked.add(id);
                const def = ACHIEVEMENT_LIST.find((a) => a.id === id);
                if (def) newlyUnlocked.push(def);
            }
        }

        // 1. First Repair — Complete one career case
        if (completedCareerSet.size >= 1) {
            tryUnlock("first-repair");
        }

        // 2. Quick Thinker — Complete a case in under two minutes (< 120 seconds)
        if (latestRun && latestRun.elapsedSeconds < 120) {
            tryUnlock("quick-thinker");
        }

        // 3. Perfect Diagnosis — Finish a case with 100 points
        if (latestRun && latestRun.finalScore === 100) {
            tryUnlock("perfect-diagnosis");
        }

        // 4. No Hints Needed — Complete three different cases without hints
        if (noHintCasesSet.size >= 3) {
            tryUnlock("no-hints-needed");
        }

        // 5. Hardware Specialist — Complete all Level 3 cases (7, 8, 9)
        if (completedCareerSet.has(7) && completedCareerSet.has(8) && completedCareerSet.has(9)) {
            tryUnlock("hardware-specialist");
        }

        // 6. Troubleshooting Expert — Complete all 12 cases
        let allTwelveDone = true;
        for (let i = 1; i <= 12; i++) {
            if (!completedCareerSet.has(i)) {
                allTwelveDone = false;
                break;
            }
        }
        if (allTwelveDone) {
            tryUnlock("troubleshooting-expert");
        }

        return {
            allUnlockedIds: Array.from(currentlyUnlocked),
            newlyUnlocked
        };
    }

    return {
        getAllAchievements,
        evaluateUnlocks
    };
})();
