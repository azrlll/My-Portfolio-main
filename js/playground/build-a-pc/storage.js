// ============================================================================
// BUILD A PC — LOCAL HIGH SCORE STORAGE MODULE
// Manages personal best completion time in browser localStorage safely.
// ============================================================================

window.PCSimStorage = (function () {
    "use strict";

    const STORAGE_KEY = "kevin_portfolio_pc_sim_best_seconds";

    function isStorageAvailable() {
        try {
            const testKey = "__pc_sim_test__";
            window.localStorage.setItem(testKey, "1");
            window.localStorage.removeItem(testKey);
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Returns the saved best time in seconds, or null if none exists.
     */
    function getBestTime() {
        if (!isStorageAvailable()) return null;
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (raw === null) return null;
            const parsed = parseInt(raw, 10);
            return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
        } catch (err) {
            return null;
        }
    }

    /**
     * Saves a new completion time if no best time exists yet or if the new time is faster.
     * Returns { updated: boolean, bestSeconds: number }.
     */
    function recordCompletionTime(elapsedSeconds) {
        const validSeconds = Math.max(1, Math.floor(Number(elapsedSeconds) || 0));
        const currentBest = getBestTime();

        if (currentBest === null || validSeconds < currentBest) {
            if (isStorageAvailable()) {
                try {
                    window.localStorage.setItem(STORAGE_KEY, String(validSeconds));
                } catch (err) {
                    // Fail silently if storage quota is exceeded
                }
            }
            return { updated: true, bestSeconds: validSeconds };
        }

        return { updated: false, bestSeconds: currentBest };
    }

    /**
     * Clears the visitor's saved personal best time.
     */
    function resetBestTime() {
        if (!isStorageAvailable()) return false;
        try {
            window.localStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Formats seconds into MM:SS string (e.g. 65 -> "01:05").
     */
    function formatTime(seconds) {
        if (seconds === null || seconds === undefined || !Number.isFinite(Number(seconds))) {
            return "--:--";
        }
        const total = Math.max(0, Math.floor(Number(seconds)));
        const mins = Math.floor(total / 60);
        const secs = total % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    return {
        getBestTime,
        recordCompletionTime,
        resetBestTime,
        formatTime
    };
})();
