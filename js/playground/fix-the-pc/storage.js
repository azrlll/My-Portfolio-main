// ============================================================================
// FIX THE PC — LOCALSTORAGE PERSISTENCE MODULE
// Saves and loads Technician Career progress, XP, rank, best scores,
// unlocked achievements, and difficulty setting.
// ============================================================================

window.FixPCStorage = (function () {
    "use strict";

    const STORAGE_KEY = "kevin_portfolio_fix_the_pc_save_v1";

    function getDefaultState() {
        return {
            completedCases: [],       // Array of completed Career case IDs (1..12)
            noHintCases: [],          // Array of distinct case IDs completed with 0 hints
            totalXp: 0,
            bestScores: {},           // Map of caseId -> highest score (0..100)
            unlockedAchievements: [], // Array of achievement IDs
            selectedDifficulty: "beginner"
        };
    }

    function isAvailable() {
        try {
            const k = "__fix_pc_storage_test__";
            window.localStorage.setItem(k, "1");
            window.localStorage.removeItem(k);
            return true;
        } catch (err) {
            return false;
        }
    }

    let memoryFallbackState = getDefaultState();

    function loadState() {
        if (!isAvailable()) {
            return Object.assign({}, memoryFallbackState);
        }
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return getDefaultState();
            const parsed = JSON.parse(raw);
            return {
                completedCases: Array.isArray(parsed.completedCases) ? parsed.completedCases : [],
                noHintCases: Array.isArray(parsed.noHintCases) ? parsed.noHintCases : [],
                totalXp: Number.isFinite(parsed.totalXp) ? parsed.totalXp : 0,
                bestScores: parsed.bestScores && typeof parsed.bestScores === "object" ? parsed.bestScores : {},
                unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : [],
                selectedDifficulty: ["beginner", "intermediate", "advanced"].includes(parsed.selectedDifficulty)
                    ? parsed.selectedDifficulty
                    : "beginner"
            };
        } catch (err) {
            return getDefaultState();
        }
    }

    function saveState(newState) {
        memoryFallbackState = Object.assign(getDefaultState(), newState);
        if (!isAvailable()) return false;
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryFallbackState));
            return true;
        } catch (err) {
            return false;
        }
    }

    function resetCareerProgress() {
        const fresh = getDefaultState();
        memoryFallbackState = fresh;
        if (isAvailable()) {
            try {
                window.localStorage.removeItem(STORAGE_KEY);
            } catch (err) {
                // Ignore
            }
        }
        return fresh;
    }

    return {
        loadState,
        saveState,
        resetCareerProgress
    };
})();
