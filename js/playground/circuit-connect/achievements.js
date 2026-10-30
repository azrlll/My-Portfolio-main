// ============================================================================
// CIRCUIT CONNECT — ACHIEVEMENTS MODULE
// Defines and evaluates all 6 unlockable electronics puzzle achievements.
// ============================================================================

window.CircuitConnectAchievements = (function () {
    "use strict";

    const ACHIEVEMENTS = [
        {
            id: "first-spark",
            title: "First Spark",
            description: "Complete Level 1."
        },
        {
            id: "circuit-apprentice",
            title: "Circuit Apprentice",
            description: "Complete five levels."
        },
        {
            id: "wiring-specialist",
            title: "Wiring Specialist",
            description: "Complete ten levels."
        },
        {
            id: "circuit-master",
            title: "Circuit Master",
            description: "Complete all 15 levels."
        },
        {
            id: "perfect-connection",
            title: "Perfect Connection",
            description: "Finish a level with 100 points."
        },
        {
            id: "independent-thinker",
            title: "Independent Thinker",
            description: "Complete five different levels without hints."
        }
    ];

    function getAllAchievements() {
        return ACHIEVEMENTS.slice();
    }

    /**
     * Evaluates achievement unlocks after a level completion.
     * Returns an array of newly unlocked achievement objects.
     */
    function evaluateUnlocks(savedState, latestCompletion) {
        const unlockedSet = new Set(savedState.unlockedAchievements || []);
        const completedSet = new Set(savedState.completedLevels || []);
        const noHintSet = new Set(savedState.noHintLevels || []);
        const newlyUnlocked = [];

        function tryUnlock(id) {
            if (!unlockedSet.has(id)) {
                unlockedSet.add(id);
                const found = ACHIEVEMENTS.find((a) => a.id === id);
                if (found) newlyUnlocked.push(found);
            }
        }

        // 1. First Spark — Complete Level 1
        if (completedSet.has(1)) {
            tryUnlock("first-spark");
        }

        // 2. Circuit Apprentice — Complete five levels
        if (completedSet.size >= 5) {
            tryUnlock("circuit-apprentice");
        }

        // 3. Wiring Specialist — Complete ten levels
        if (completedSet.size >= 10) {
            tryUnlock("wiring-specialist");
        }

        // 4. Circuit Master — Complete all 15 levels
        let allFifteen = true;
        for (let i = 1; i <= 15; i++) {
            if (!completedSet.has(i)) {
                allFifteen = false;
                break;
            }
        }
        if (allFifteen) {
            tryUnlock("circuit-master");
        }

        // 5. Perfect Connection — Finish a level with 100 points
        if (latestCompletion && latestCompletion.finalScore === 100) {
            tryUnlock("perfect-connection");
        }

        // 6. Independent Thinker — Complete five different levels without hints
        if (noHintSet.size >= 5) {
            tryUnlock("independent-thinker");
        }

        return newlyUnlocked;
    }

    return {
        getAllAchievements,
        evaluateUnlocks
    };
})();
