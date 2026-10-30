// ============================================================================
// CIRCUIT CONNECT — LOCALSTORAGE PERSISTENCE MODULE
// Uses an isolated versioned storage key so Build a PC and Fix the PC saved
// data remain untouched.
// ============================================================================

window.CircuitConnectStorage = (function () {
    "use strict";

    const STORAGE_KEY = "kevin_portfolio_circuit_connect_save_v1";
    let memoryFallback = null;

    function createDefaultState() {
        return {
            version: 1,
            highestUnlockedLevel: 1,
            completedLevels: [],
            bestScores: {},
            bestTimes: {},
            noHintLevels: [],
            unlockedAchievements: [],
            preferences: {
                showGrid: true
            }
        };
    }

    function loadState() {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return createDefaultState();
            }
            const parsed = JSON.parse(raw);
            const def = createDefaultState();
            return {
                version: 1,
                highestUnlockedLevel: Math.max(1, Math.min(15, Number(parsed.highestUnlockedLevel) || 1)),
                completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels : def.completedLevels,
                bestScores: parsed.bestScores && typeof parsed.bestScores === "object" ? parsed.bestScores : def.bestScores,
                bestTimes: parsed.bestTimes && typeof parsed.bestTimes === "object" ? parsed.bestTimes : def.bestTimes,
                noHintLevels: Array.isArray(parsed.noHintLevels) ? parsed.noHintLevels : def.noHintLevels,
                unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : def.unlockedAchievements,
                preferences: parsed.preferences && typeof parsed.preferences === "object" ? parsed.preferences : def.preferences
            };
        } catch (err) {
            if (memoryFallback) return JSON.parse(JSON.stringify(memoryFallback));
            return createDefaultState();
        }
    }

    function saveState(state) {
        try {
            memoryFallback = JSON.parse(JSON.stringify(state));
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            return true;
        } catch (err) {
            return false;
        }
    }

    function isLevelUnlocked(levelId) {
        const state = loadState();
        const numId = Number(levelId);
        if (numId === 1) return true;
        return numId <= state.highestUnlockedLevel || state.completedLevels.includes(numId - 1);
    }

    function recordLevelCompletion(levelId, runMetrics) {
        const state = loadState();
        const numId = Number(levelId);
        const finalScore = Number(runMetrics.finalScore || 0);
        const elapsedSeconds = Number(runMetrics.elapsedSeconds || 0);
        const hintsUsed = Number(runMetrics.hintsUsed || 0);

        if (!state.completedLevels.includes(numId)) {
            state.completedLevels.push(numId);
            state.completedLevels.sort((a, b) => a - b);
        }

        if (numId < 15 && state.highestUnlockedLevel < numId + 1) {
            state.highestUnlockedLevel = numId + 1;
        }

        const prevBestScore = state.bestScores[numId];
        if (prevBestScore === undefined || finalScore > prevBestScore) {
            state.bestScores[numId] = finalScore;
        }

        const prevBestTime = state.bestTimes[numId];
        if (prevBestTime === undefined || elapsedSeconds < prevBestTime) {
            state.bestTimes[numId] = elapsedSeconds;
        }

        if (hintsUsed === 0 && !state.noHintLevels.includes(numId)) {
            state.noHintLevels.push(numId);
        }

        let newlyUnlockedAchievements = [];
        if (window.CircuitConnectAchievements) {
            newlyUnlockedAchievements = window.CircuitConnectAchievements.evaluateUnlocks(state, {
                levelId: numId,
                finalScore,
                elapsedSeconds,
                hintsUsed
            });
            newlyUnlockedAchievements.forEach((ach) => {
                if (!state.unlockedAchievements.includes(ach.id)) {
                    state.unlockedAchievements.push(ach.id);
                }
            });
        }

        saveState(state);

        return {
            state,
            newlyUnlockedAchievements
        };
    }

    function resetProgress() {
        const fresh = createDefaultState();
        saveState(fresh);
        return fresh;
    }

    return {
        STORAGE_KEY,
        loadState,
        saveState,
        isLevelUnlocked,
        recordLevelCompletion,
        resetProgress
    };
})();
