/**
 * TypeKalang — Monkeytype-Inspired Typing Speed Game
 * Kevin's Hardware Studio Portfolio
 * Smooth real-time WPM, accuracy, desktop/mobile native input, results screen, and personal best tracking.
 */
(function (global) {
    "use strict";

    // ------------------------------------------------------------------------
    // CONSTANTS & STATE
    // ------------------------------------------------------------------------
    const STORAGE_KEY_PREFIX = "typekalang_best_";
    const DEFAULT_TIME_MODE = 30; // seconds
    const DEFAULT_DIFFICULTY = "normal";

    const state = {
        timeMode: DEFAULT_TIME_MODE,
        difficulty: DEFAULT_DIFFICULTY,
        words: [],
        wordIndex: 0,
        typedWords: [], // Array of strings typed per word
        totalKeystrokes: 0,
        correctKeystrokes: 0,
        correctCharsTotal: 0,
        incorrectCharsTotal: 0,
        hasStarted: false,
        isFinished: false,
        startTime: null,
        timerInterval: null,
        remainingSeconds: DEFAULT_TIME_MODE,
        isMobile: false,
        initialized: false
    };

    // DOM Element References Cache
    let el = {};

    function cacheElements() {
        el = {
            root: document.getElementById("typekalangGameView"),
            wordsContainer: document.getElementById("tkWordsContainer"),
            wordsStream: document.getElementById("tkWordsStream"),
            caret: document.getElementById("tkCaret"),
            hiddenInput: document.getElementById("tkInput"),
            timerDisplay: document.getElementById("tkTimerDisplay"),
            wpmDisplay: document.getElementById("tkWpmDisplay"),
            accuracyDisplay: document.getElementById("tkAccuracyDisplay"),
            timeButtons: document.querySelectorAll("[data-tk-time]"),
            diffButtons: document.querySelectorAll("[data-tk-diff]"),
            restartBtn: document.getElementById("tkRestartBtn"),
            resultsOverlay: document.getElementById("tkResultsOverlay"),
            resultsWpm: document.getElementById("tkResultsWpm"),
            resultsAcc: document.getElementById("tkResultsAcc"),
            resultsCorrect: document.getElementById("tkResultsCorrect"),
            resultsIncorrect: document.getElementById("tkResultsIncorrect"),
            resultsMode: document.getElementById("tkResultsMode"),
            resultsBest: document.getElementById("tkResultsBest"),
            resultsNewBestNotice: document.getElementById("tkResultsNewBestNotice"),
            playAgainBtn: document.getElementById("tkPlayAgainBtn"),
            resultsChangeTimeBtn: document.getElementById("tkResultsChangeTimeBtn"),
            resultsChangeDiffBtn: document.getElementById("tkResultsChangeDiffBtn"),
            focusPrompt: document.getElementById("tkFocusPrompt")
        };
    }

    // Detect mobile device (Android / iOS / Touch)
    function detectMobile() {
        return (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            ("ontouchstart" in window && window.innerWidth <= 860)
        );
    }

    // ------------------------------------------------------------------------
    // STORAGE HELPERS (PERSONAL BEST)
    // ------------------------------------------------------------------------
    function getStorageKey(timeMode, difficulty) {
        return `${STORAGE_KEY_PREFIX}${timeMode}_${difficulty}`;
    }

    function getPersonalBest(timeMode, difficulty) {
        try {
            const raw = localStorage.getItem(getStorageKey(timeMode, difficulty));
            if (!raw) return null;
            const parsed = parseInt(raw, 10);
            return isNaN(parsed) ? null : parsed;
        } catch (e) {
            return null;
        }
    }

    function savePersonalBest(timeMode, difficulty, wpm) {
        try {
            const current = getPersonalBest(timeMode, difficulty) || 0;
            if (wpm > current) {
                localStorage.setItem(getStorageKey(timeMode, difficulty), String(wpm));
                return true; // New record
            }
        } catch (e) {
            // Ignore quota/private browsing exceptions
        }
        return false;
    }

    // ------------------------------------------------------------------------
    // WORD GENERATION & RENDERING
    // ------------------------------------------------------------------------
    function generateWords() {
        if (!global.TypeKalangWords || typeof global.TypeKalangWords.getRandomWords !== "function") {
            state.words = ["system", "hardware", "keyboard", "display", "typing", "fast", "challenge"];
            return;
        }
        state.words = global.TypeKalangWords.getRandomWords(state.difficulty, 80);
    }

    function appendMoreWords(count = 40) {
        if (!global.TypeKalangWords) return;
        const more = global.TypeKalangWords.getRandomWords(state.difficulty, count);
        state.words.push(...more);
        renderAppendedWords(more, state.words.length - more.length);
    }

    function renderAllWords() {
        if (!el.wordsStream) return;
        el.wordsStream.innerHTML = "";

        state.words.forEach((word, wIdx) => {
            const wordEl = document.createElement("div");
            wordEl.className = "tk-word" + (wIdx === 0 ? " is-active" : "");
            wordEl.setAttribute("data-word-idx", String(wIdx));

            for (let cIdx = 0; cIdx < word.length; cIdx++) {
                const charEl = document.createElement("span");
                charEl.className = "tk-char is-untyped";
                charEl.textContent = word[cIdx];
                charEl.setAttribute("data-char-idx", String(cIdx));
                wordEl.appendChild(charEl);
            }

            el.wordsStream.appendChild(wordEl);
        });

        updateCaretPosition();
    }

    function renderAppendedWords(newWords, startIndex) {
        if (!el.wordsStream) return;
        newWords.forEach((word, idx) => {
            const wIdx = startIndex + idx;
            const wordEl = document.createElement("div");
            wordEl.className = "tk-word";
            wordEl.setAttribute("data-word-idx", String(wIdx));

            for (let cIdx = 0; cIdx < word.length; cIdx++) {
                const charEl = document.createElement("span");
                charEl.className = "tk-char is-untyped";
                charEl.textContent = word[cIdx];
                charEl.setAttribute("data-char-idx", String(cIdx));
                wordEl.appendChild(charEl);
            }

            el.wordsStream.appendChild(wordEl);
        });
    }

    // ------------------------------------------------------------------------
    // WORD & CHARACTER HIGHLIGHTING
    // ------------------------------------------------------------------------
    function updateCurrentWordUI() {
        if (!el.wordsStream) return;

        const currentWord = state.words[state.wordIndex] || "";
        const typed = state.typedWords[state.wordIndex] || "";
        const wordEl = el.wordsStream.querySelector(`[data-word-idx="${state.wordIndex}"]`);
        if (!wordEl) return;

        // Clear existing extra characters if user backspaced
        const existingExtras = wordEl.querySelectorAll(".tk-char.is-extra");
        existingExtras.forEach((n) => n.remove());

        // Update standard characters
        const charElements = wordEl.querySelectorAll(".tk-char:not(.is-extra)");
        for (let i = 0; i < currentWord.length; i++) {
            const cEl = charElements[i];
            if (!cEl) continue;

            if (i < typed.length) {
                if (typed[i] === currentWord[i]) {
                    cEl.className = "tk-char is-correct";
                } else {
                    cEl.className = "tk-char is-incorrect";
                }
            } else {
                cEl.className = "tk-char is-untyped";
            }
        }

        // Add extra characters if user typed past word length
        if (typed.length > currentWord.length) {
            for (let j = currentWord.length; j < typed.length; j++) {
                const extraEl = document.createElement("span");
                extraEl.className = "tk-char is-extra is-incorrect";
                extraEl.textContent = typed[j];
                wordEl.appendChild(extraEl);
            }
        }

        updateCaretPosition();
        scrollActiveWordIntoView(wordEl);
    }

    function markWordCompleted(wIdx) {
        if (!el.wordsStream) return;
        const wordEl = el.wordsStream.querySelector(`[data-word-idx="${wIdx}"]`);
        if (!wordEl) return;

        wordEl.classList.remove("is-active");

        const targetWord = state.words[wIdx] || "";
        const typed = state.typedWords[wIdx] || "";

        // If user skipped without finishing, mark untyped characters as missed
        const charElements = wordEl.querySelectorAll(".tk-char:not(.is-extra)");
        for (let i = typed.length; i < targetWord.length; i++) {
            if (charElements[i]) {
                charElements[i].className = "tk-char is-missed";
            }
        }

        // Check if entire word was 100% correct
        const hasError = typed !== targetWord;
        if (hasError) {
            wordEl.classList.add("has-error");
        } else {
            wordEl.classList.add("is-complete-correct");
        }
    }

    function activateWord(wIdx) {
        if (!el.wordsStream) return;
        const nextWordEl = el.wordsStream.querySelector(`[data-word-idx="${wIdx}"]`);
        if (nextWordEl) {
            nextWordEl.classList.add("is-active");
            nextWordEl.classList.remove("has-error", "is-complete-correct");
            scrollActiveWordIntoView(nextWordEl);
        }

        // Keep word generator supplied
        if (wIdx >= state.words.length - 15) {
            appendMoreWords(40);
        }
    }

    // ------------------------------------------------------------------------
    // SMOOTH CARET & AUTO-SCROLL
    // ------------------------------------------------------------------------
    function updateCaretPosition() {
        if (!el.caret || !el.wordsStream || state.isFinished) {
            if (el.caret) el.caret.style.display = "none";
            return;
        }

        const currentWord = state.words[state.wordIndex] || "";
        const typed = state.typedWords[state.wordIndex] || "";
        const wordEl = el.wordsStream.querySelector(`[data-word-idx="${state.wordIndex}"]`);
        if (!wordEl) return;

        el.caret.style.display = "block";

        const charEls = wordEl.querySelectorAll(".tk-char");
        if (typed.length === 0) {
            // Position at beginning of first char in current word
            const firstChar = charEls[0];
            if (firstChar) {
                el.caret.style.transform = `translate(${firstChar.offsetLeft}px, ${firstChar.offsetTop}px)`;
                el.caret.style.height = `${firstChar.offsetHeight}px`;
            } else {
                el.caret.style.transform = `translate(${wordEl.offsetLeft}px, ${wordEl.offsetTop}px)`;
            }
        } else {
            // Position right after the last typed char
            const lastChar = charEls[typed.length - 1];
            if (lastChar) {
                const x = lastChar.offsetLeft + lastChar.offsetWidth;
                const y = lastChar.offsetTop;
                el.caret.style.transform = `translate(${x}px, ${y}px)`;
                el.caret.style.height = `${lastChar.offsetHeight}px`;
            }
        }
    }

    function scrollActiveWordIntoView(wordEl) {
        if (!el.wordsContainer || !wordEl) return;

        // Auto-scroll the word stream container so the active line stays centered
        const containerTop = el.wordsContainer.scrollTop;
        const containerHeight = el.wordsContainer.clientHeight;
        const wordTop = wordEl.offsetTop;
        const wordHeight = wordEl.offsetHeight;

        // Ideal position: keep word on line 2 (middle of viewport)
        const idealScroll = wordTop - containerHeight / 3;
        if (Math.abs(containerTop - idealScroll) > 30) {
            el.wordsContainer.scrollTo({
                top: Math.max(0, idealScroll),
                behavior: "smooth"
            });
        }
    }

    // ------------------------------------------------------------------------
    // LIVE STATS (WPM & ACCURACY)
    // ------------------------------------------------------------------------
    function calculateStats() {
        const elapsedSeconds = state.startTime ? Math.max(1, (Date.now() - state.startTime) / 1000) : 1;
        const elapsedMinutes = elapsedSeconds / 60;

        // Count correct and incorrect characters across all completed words + current word
        let correctChars = 0;
        let incorrectChars = 0;

        for (let i = 0; i <= state.wordIndex; i++) {
            const target = state.words[i] || "";
            const typed = state.typedWords[i] || "";
            const minLen = Math.min(target.length, typed.length);

            for (let c = 0; c < minLen; c++) {
                if (typed[c] === target[c]) {
                    correctChars++;
                } else {
                    incorrectChars++;
                }
            }

            // Extra characters typed count as incorrect
            if (typed.length > target.length) {
                incorrectChars += (typed.length - target.length);
            }

            // Uncompleted missed chars in previous words count as incorrect
            if (i < state.wordIndex && typed.length < target.length) {
                incorrectChars += (target.length - typed.length);
            }
        }

        // Add 1 char for each correct space between words
        const completedWordCount = Math.max(0, state.wordIndex);
        correctChars += completedWordCount;

        state.correctCharsTotal = correctChars;
        state.incorrectCharsTotal = incorrectChars;

        // Standard 5-character word WPM: (correct characters / 5) / elapsed minutes
        const wpm = Math.max(0, Math.round((correctChars / 5) / elapsedMinutes));

        // Accuracy: correct keystrokes / total keystrokes
        const accuracy = state.totalKeystrokes > 0
            ? Math.max(0, Math.min(100, Math.round((state.correctKeystrokes / state.totalKeystrokes) * 100)))
            : 100;

        return { wpm, accuracy, correctChars, incorrectChars, elapsedSeconds };
    }

    function updateLiveStatsDisplay() {
        const stats = calculateStats();
        if (el.wpmDisplay) {
            el.wpmDisplay.textContent = state.hasStarted ? String(stats.wpm) : "0";
        }
        if (el.accuracyDisplay) {
            el.accuracyDisplay.textContent = state.hasStarted ? `${stats.accuracy}%` : "100%";
        }
    }

    // ------------------------------------------------------------------------
    // TIMER & GAME LOOP
    // ------------------------------------------------------------------------
    function startTimer() {
        if (state.hasStarted) return;
        state.hasStarted = true;
        state.startTime = Date.now();
        state.remainingSeconds = state.timeMode;

        if (el.focusPrompt) {
            el.focusPrompt.classList.add("is-hidden");
        }

        updateLiveStatsDisplay();

        clearInterval(state.timerInterval);
        state.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
            state.remainingSeconds = Math.max(0, state.timeMode - elapsed);

            if (el.timerDisplay) {
                el.timerDisplay.textContent = `${state.remainingSeconds}s`;
            }

            updateLiveStatsDisplay();

            if (state.remainingSeconds <= 0) {
                finishTest();
            }
        }, 200);
    }

    function finishTest() {
        clearInterval(state.timerInterval);
        state.isFinished = true;

        if (el.hiddenInput) {
            el.hiddenInput.blur();
        }

        const stats = calculateStats();
        const finalWpm = stats.wpm;
        const finalAcc = stats.accuracy;

        // Save and check Personal Best
        const isNewBest = savePersonalBest(state.timeMode, state.difficulty, finalWpm);
        const bestScore = getPersonalBest(state.timeMode, state.difficulty) || finalWpm;

        // Populate Results UI
        if (el.resultsWpm) el.resultsWpm.textContent = String(finalWpm);
        if (el.resultsAcc) el.resultsAcc.textContent = `${finalAcc}%`;
        if (el.resultsCorrect) el.resultsCorrect.textContent = String(stats.correctChars);
        if (el.resultsIncorrect) el.resultsIncorrect.textContent = String(stats.incorrectChars);
        if (el.resultsMode) {
            const diffCapitalized = state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1);
            el.resultsMode.textContent = `${state.timeMode}s • ${diffCapitalized}`;
        }
        if (el.resultsBest) el.resultsBest.textContent = `${bestScore} WPM`;
        if (el.resultsNewBestNotice) {
            el.resultsNewBestNotice.hidden = !isNewBest;
        }

        // Reveal Results Screen
        if (el.resultsOverlay) {
            el.resultsOverlay.hidden = false;
            requestAnimationFrame(() => {
                el.resultsOverlay.classList.add("is-visible");
            });
        }

        if (el.playAgainBtn) {
            setTimeout(() => {
                try { el.playAgainBtn.focus(); } catch (e) {}
            }, 100);
        }
    }

    // ------------------------------------------------------------------------
    // INPUT HANDLING (DESKTOP PHYSICAL + MOBILE VIRTUAL KEYBOARDS)
    // ------------------------------------------------------------------------
    function handleKeyDown(e) {
        if (state.isFinished) return;

        // Ignore modifier-only combinations (Ctrl+C, Alt+Tab, etc.)
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        // Focus typing input if visitor presses a key while modal is active
        if (document.activeElement !== el.hiddenInput && e.key.length === 1 && !e.repeat) {
            focusInput();
        }

        // Start countdown timer on first valid keypress
        if (!state.hasStarted && (e.key.length === 1 || e.key === "Backspace")) {
            startTimer();
        }

        if (e.key === "Backspace") {
            handleBackspace(e);
            return;
        }

        if (e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            handleSpace();
            return;
        }

        if (e.key.length === 1) {
            handleCharacterInput(e.key);
        }
    }

    function handleCharacterInput(char) {
        if (state.isFinished) return;

        if (!state.hasStarted) {
            startTimer();
        }

        state.totalKeystrokes++;

        const currentWord = state.words[state.wordIndex] || "";
        const currentTyped = state.typedWords[state.wordIndex] || "";

        // Check correctness of this keystroke
        const expectedChar = currentWord[currentTyped.length];
        if (char === expectedChar) {
            state.correctKeystrokes++;
        }

        // Append to current word's typed string (allow up to 10 extra characters for visual feedback)
        if (currentTyped.length < currentWord.length + 10) {
            state.typedWords[state.wordIndex] = currentTyped + char;
            updateCurrentWordUI();
        }

        // Sync with hidden input
        if (el.hiddenInput && el.hiddenInput.value !== state.typedWords[state.wordIndex]) {
            el.hiddenInput.value = state.typedWords[state.wordIndex];
        }
    }

    function handleSpace() {
        if (state.isFinished) return;

        const currentTyped = state.typedWords[state.wordIndex] || "";
        // Do not advance on space if nothing has been typed in the current word yet
        if (currentTyped.length === 0) return;

        state.totalKeystrokes++;
        const targetWord = state.words[state.wordIndex] || "";
        if (currentTyped === targetWord) {
            state.correctKeystrokes++;
        }

        markWordCompleted(state.wordIndex);
        state.wordIndex++;
        state.typedWords[state.wordIndex] = "";

        if (el.hiddenInput) {
            el.hiddenInput.value = "";
        }

        activateWord(state.wordIndex);
        updateCurrentWordUI();
    }

    function handleBackspace(e) {
        if (state.isFinished) return;

        const currentTyped = state.typedWords[state.wordIndex] || "";

        if (currentTyped.length > 0) {
            e && e.preventDefault();
            // Erase last letter
            state.typedWords[state.wordIndex] = currentTyped.slice(0, -1);
            if (el.hiddenInput) {
                el.hiddenInput.value = state.typedWords[state.wordIndex];
            }
            updateCurrentWordUI();
        } else if (state.wordIndex > 0) {
            // Jump back to previous word if it had mistakes (Monkeytype behavior)
            const prevWordIdx = state.wordIndex - 1;
            const prevWordEl = el.wordsStream.querySelector(`[data-word-idx="${prevWordIdx}"]`);
            if (prevWordEl && prevWordEl.classList.contains("has-error")) {
                e && e.preventDefault();
                markWordCompleted(state.wordIndex); // Clear current
                state.wordIndex = prevWordIdx;
                activateWord(prevWordIdx);
                if (el.hiddenInput) {
                    el.hiddenInput.value = state.typedWords[prevWordIdx] || "";
                }
                updateCurrentWordUI();
            }
        }
    }

    // Mobile Virtual Input Event Listener (Handles Android Gboard & iOS soft keyboards seamlessly)
    function handleMobileInputEvent(e) {
        if (state.isFinished) return;

        const val = el.hiddenInput.value;

        // If the mobile keyboard inputted a space, trigger word transition
        if (val.endsWith(" ")) {
            const stripped = val.slice(0, -1);
            state.typedWords[state.wordIndex] = stripped;
            handleSpace();
            return;
        }

        // Start timer on mobile typing
        if (!state.hasStarted && val.length > 0) {
            startTimer();
        }

        const currentTyped = state.typedWords[state.wordIndex] || "";

        // If value became shorter, visitor pressed mobile backspace
        if (val.length < currentTyped.length) {
            state.typedWords[state.wordIndex] = val;
            updateCurrentWordUI();
            return;
        }

        // New character(s) typed
        const addedChars = val.slice(currentTyped.length);
        for (let i = 0; i < addedChars.length; i++) {
            const char = addedChars[i];
            if (char === " ") {
                handleSpace();
            } else {
                handleCharacterInput(char);
            }
        }
    }

    function focusInput() {
        if (el.hiddenInput && !state.isFinished) {
            try {
                el.hiddenInput.focus({ preventScroll: true });
                if (el.focusPrompt) {
                    el.focusPrompt.classList.add("is-hidden");
                }
            } catch (e) {}
        }
    }

    // ------------------------------------------------------------------------
    // RESET & MODE SWITCHING
    // ------------------------------------------------------------------------
    function resetTest(keepSettings = true) {
        clearInterval(state.timerInterval);

        state.wordIndex = 0;
        state.typedWords = [];
        state.totalKeystrokes = 0;
        state.correctKeystrokes = 0;
        state.correctCharsTotal = 0;
        state.incorrectCharsTotal = 0;
        state.hasStarted = false;
        state.isFinished = false;
        state.startTime = null;
        state.timerInterval = null;
        state.remainingSeconds = state.timeMode;

        if (!keepSettings) {
            state.timeMode = DEFAULT_TIME_MODE;
            state.difficulty = DEFAULT_DIFFICULTY;
        }

        // Reset UI metrics
        if (el.timerDisplay) el.timerDisplay.textContent = `${state.timeMode}s`;
        if (el.wpmDisplay) el.wpmDisplay.textContent = "0";
        if (el.accuracyDisplay) el.accuracyDisplay.textContent = "100%";
        if (el.hiddenInput) el.hiddenInput.value = "";

        // Hide results overlay
        if (el.resultsOverlay) {
            el.resultsOverlay.classList.remove("is-visible");
            el.resultsOverlay.hidden = true;
        }

        if (el.focusPrompt) {
            el.focusPrompt.classList.remove("is-hidden");
        }

        // Update active buttons in header
        updateHeaderButtonStates();

        // Generate and render fresh words
        generateWords();
        renderAllWords();

        if (el.wordsContainer) {
            el.wordsContainer.scrollTop = 0;
        }

        // Focus input after reset
        setTimeout(focusInput, 60);
    }

    function updateHeaderButtonStates() {
        if (el.timeButtons) {
            el.timeButtons.forEach((btn) => {
                const t = parseInt(btn.getAttribute("data-tk-time"), 10);
                const isActive = t === state.timeMode;
                btn.classList.toggle("is-active", isActive);
                btn.setAttribute("aria-pressed", String(isActive));
            });
        }

        if (el.diffButtons) {
            el.diffButtons.forEach((btn) => {
                const d = btn.getAttribute("data-tk-diff");
                const isActive = d === state.difficulty;
                btn.classList.toggle("is-active", isActive);
                btn.setAttribute("aria-pressed", String(isActive));
            });
        }
    }

    function setTimeMode(seconds) {
        const val = parseInt(seconds, 10);
        if ([15, 30, 60].includes(val)) {
            state.timeMode = val;
            resetTest(true);
        }
    }

    function setDifficulty(diff) {
        if (["easy", "normal", "hard"].includes(diff)) {
            state.difficulty = diff;
            resetTest(true);
        }
    }

    // ------------------------------------------------------------------------
    // EVENT LISTENERS BINDING
    // ------------------------------------------------------------------------
    function bindEvents() {
        // Desktop physical keyboard listener
        document.addEventListener("keydown", (e) => {
            // Only process if TypeKalang is the currently active view and modal is open
            const modal = document.getElementById("playgroundModal");
            if (!modal || modal.hidden || el.root.hidden) return;

            // Don't capture keys if an input outside the game has focus
            if (document.activeElement && document.activeElement !== el.hiddenInput && document.activeElement.tagName === "INPUT") {
                return;
            }

            handleKeyDown(e);
        });

        // Mobile soft keyboard input listener
        if (el.hiddenInput) {
            el.hiddenInput.addEventListener("input", handleMobileInputEvent);
            el.hiddenInput.addEventListener("blur", () => {
                if (!state.hasStarted && !state.isFinished && el.focusPrompt) {
                    el.focusPrompt.classList.remove("is-hidden");
                }
            });
            el.hiddenInput.addEventListener("focus", () => {
                if (el.focusPrompt) {
                    el.focusPrompt.classList.add("is-hidden");
                }
            });
        }

        // Clicking/tapping words container focuses typing area
        if (el.wordsContainer) {
            el.wordsContainer.addEventListener("click", () => {
                focusInput();
            });
        }

        // Time mode buttons
        if (el.timeButtons) {
            el.timeButtons.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    const t = btn.getAttribute("data-tk-time");
                    setTimeMode(t);
                });
            });
        }

        // Difficulty buttons
        if (el.diffButtons) {
            el.diffButtons.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    const d = btn.getAttribute("data-tk-diff");
                    setDifficulty(d);
                });
            });
        }

        // Restart button in header
        if (el.restartBtn) {
            el.restartBtn.addEventListener("click", (e) => {
                e.preventDefault();
                resetTest(true);
            });
        }

        // Play Again button in results overlay
        if (el.playAgainBtn) {
            el.playAgainBtn.addEventListener("click", (e) => {
                e.preventDefault();
                resetTest(true);
            });
        }

        // Results change time button
        if (el.resultsChangeTimeBtn) {
            el.resultsChangeTimeBtn.addEventListener("click", (e) => {
                e.preventDefault();
                // Cycle: 15 -> 30 -> 60 -> 15
                const nextTime = state.timeMode === 15 ? 30 : (state.timeMode === 30 ? 60 : 15);
                setTimeMode(nextTime);
            });
        }

        // Results change difficulty button
        if (el.resultsChangeDiffBtn) {
            el.resultsChangeDiffBtn.addEventListener("click", (e) => {
                e.preventDefault();
                // Cycle: easy -> normal -> hard -> easy
                const nextDiff = state.difficulty === "easy" ? "normal" : (state.difficulty === "normal" ? "hard" : "easy");
                setDifficulty(nextDiff);
            });
        }
    }

    // ------------------------------------------------------------------------
    // PUBLIC API / LIFECYCLE
    // ------------------------------------------------------------------------
    function init() {
        cacheElements();
        state.isMobile = detectMobile();
        if (!state.initialized) {
            bindEvents();
            state.initialized = true;
        }
        resetTest(true);
    }

    function openGame() {
        init();
        setTimeout(focusInput, 150);
    }

    function cleanup() {
        clearInterval(state.timerInterval);
        state.hasStarted = false;
        state.isFinished = false;
        if (el.hiddenInput) {
            try { el.hiddenInput.blur(); } catch (e) {}
        }
    }

    global.TypeKalangGame = {
        init: init,
        openGame: openGame,
        resetTest: resetTest,
        cleanup: cleanup,
        setTimeMode: setTimeMode,
        setDifficulty: setDifficulty,
        focus: focusInput,
        getState: () => ({ ...state })
    };

})(typeof window !== "undefined" ? window : this);
