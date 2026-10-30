// ============================================================================
// FIX THE PC — SCORING & XP CALCULATION MODULE
// Implements the 100-point case score, penalty rules, and Career XP rewards.
// ============================================================================

window.FixPCScoring = (function () {
    "use strict";

    const INITIAL_SCORE = 100;
    const PENALTIES = {
        UNNECESSARY_DIAGNOSTIC: 5,
        INCORRECT_DIAGNOSIS: 10,
        INCORRECT_REPAIR: 10,
        HINT_USED: 5
    };

    const XP_REWARDS = {
        FIRST_CLEAR: 100,
        HIGH_SCORE_90: 50,
        NO_HINTS: 25,
        NO_INCORRECT_REPAIRS: 25,
        MAX_TOTAL: 200
    };

    function clampScore(score) {
        return Math.max(0, Math.min(INITIAL_SCORE, Math.round(score)));
    }

    function applyPenalty(currentScore, penaltyType) {
        const deduction = PENALTIES[penaltyType] || 0;
        return clampScore(currentScore - deduction);
    }

    /**
     * Calculates XP earned upon completing a case.
     * - Free Play mode NEVER awards Career XP (`0 XP`).
     * - Replaying an already-completed Career case NEVER awards repeated XP (`0 XP`).
     * - First-time Career case completion awards up to 200 XP with breakdown.
     */
    function calculateCareerXp(params) {
        const {
            isCareerMode,
            alreadyCompletedInCareer,
            finalScore,
            hintsUsed,
            incorrectRepairs
        } = params;

        if (!isCareerMode || alreadyCompletedInCareer) {
            return {
                totalXpEarned: 0,
                breakdown: [],
                reason: !isCareerMode
                    ? "Free Play Mode (Practice — 0 Career XP)"
                    : "Case Previously Completed (First-clear XP already awarded)"
            };
        }

        let total = 0;
        const breakdown = [];

        // 1. Base First Completion (+100 XP)
        total += XP_REWARDS.FIRST_CLEAR;
        breakdown.push({ label: "First Successful Completion", xp: XP_REWARDS.FIRST_CLEAR });

        // 2. Score of 90 or higher (+50 XP)
        if (finalScore >= 90) {
            total += XP_REWARDS.HIGH_SCORE_90;
            breakdown.push({ label: "Score 90+ Bonus", xp: XP_REWARDS.HIGH_SCORE_90 });
        }

        // 3. No hints used (+25 XP)
        if (hintsUsed === 0) {
            total += XP_REWARDS.NO_HINTS;
            breakdown.push({ label: "No Hints Used Bonus", xp: XP_REWARDS.NO_HINTS });
        }

        // 4. No incorrect repairs (+25 XP)
        if (incorrectRepairs === 0) {
            total += XP_REWARDS.NO_INCORRECT_REPAIRS;
            breakdown.push({ label: "Zero Incorrect Repairs Bonus", xp: XP_REWARDS.NO_INCORRECT_REPAIRS });
        }

        total = Math.min(XP_REWARDS.MAX_TOTAL, total);

        return {
            totalXpEarned: total,
            breakdown,
            reason: "First-Clear Career Reward"
        };
    }

    return {
        INITIAL_SCORE,
        PENALTIES,
        XP_REWARDS,
        clampScore,
        applyPenalty,
        calculateCareerXp
    };
})();
