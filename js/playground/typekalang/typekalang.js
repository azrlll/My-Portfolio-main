/**
 * TypeKalang — Monkeytype-Inspired Typing Speed Benchmark
 * Kevin's Hardware Studio Portfolio
 *
 * Single unified input engine (HTML hidden input), accurate character validation,
 * smooth sub-pixel caret positioning, live 5-char word WPM, keystroke accuracy,
 * desktop/mobile virtual keyboard support, results card & personal best tracking.
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
        typedWords: [], // Array of typed strings, one per word index
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

    // Cached DOM Element References
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

    // Detect mobile device (Android / iOS / Touch viewports)
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
            // Ignore storage quota/private browsing exceptions
        }
        return false;
    }

    // ------------------------------------------------------------------------
    // WORD GENERATION & RENDERING
    // ------------------------------------------------------------------------
    function generateWords() {
        if (!global.TypeKalangWords || typeof global.TypeKalangWords.getRandomWords !== "function") {
            state.words = ["system", "hardware", "software", "keyboard", "display", "typing", "challenge"];
            return;
        }
        state.words = global.TypeKalangWords.getRandomWords(state.difficulty, 80);
    }

    function appendMoreWords(count = 40) {
        if (!global.TypeKalangWords) return;
        const more = global.TypeKalangWords.getRandomWords(state.difficulty, count);
        const startIndex = state.words.length;
        state.words.push(...more);
        renderAppendedWords(more, startIndex);
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

        requestAnimationFrame(updateCaretPosition);
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
    // CHARACTER VALIDATION & HIGHLIGHTING
    // ------------------------------------------------------------------------
    function updateCurrentWordUI() {
        if (!el.wordsStream) return;

        const currentWord = state.words[state.wordIndex] || "";
        const typed = state.typedWords[state.wordIndex] || "";
        const wordEl = el.wordsStream.querySelector(`[data-word-idx="${state.wordIndex}"]`);
        if (!wordEl) return;

        // Clear existing extra characters from prior keystrokes
        const existingExtras = wordEl.querySelectorAll(".tk-char.is-extra");
        existingExtras.forEach((n) => n.remove());

        // Validate standard word characters position-by-position
        const charElements = wordEl.querySelectorAll(".tk-char:not(.is-extra)");
        for (let i = 0; i < currentWord.length; i++) {
            const cEl = charElements[i];
            if (!cEl) continue;

            if (i < typed.length) {
                // Exact character comparison with the displayed word
                if (typed[i] === currentWord[i]) {
                    cEl.className = "tk-char is-correct";
                } else {
                    cEl.className = "tk-char is-incorrect";
                }
            } else {
                cEl.className = "tk-char is-untyped";
            }
        }

        // Extra characters typed beyond target word length (up to 10 extras)
        if (typed.length > currentWord.length) {
            const limit = Math.min(typed.length, currentWord.length + 10);
            for (let j = currentWord.length; j < limit; j++) {
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

        // Untyped remaining characters in an incomplete word become marked missed
        const charElements = wordEl.querySelectorAll(".tk-char:not(.is-extra)");
        for (let i = typed.length; i < targetWord.length; i++) {
            if (charElements[i]) {
                charElements[i].className = "tk-char is-missed";
            }
        }

        // Entire word correctness state
        if (typed === targetWord) {
            wordEl.classList.add("is-complete-correct");
            wordEl.classList.remove("has-error");
        } else {
            wordEl.classList.add("has-error");
            wordEl.classList.remove("is-complete-correct");
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

        // Keep word stream replenished as user types
        if (wIdx >= state.words.length - 15) {
            appendMoreWords(40);
        }
    }

    // ------------------------------------------------------------------------
    // SMOOTH CARET & AUTO-SCROLL
    // ------------------------------------------------------------------------
    function updateCaretPosition() {
        if (!el.caret || !el.wordsContainer || !el.wordsStream || state.isFinished) {
            if (el.caret) el.caret.style.display = "none";
            return;
        }

        const wordEl = el.wordsStream.querySelector(`[data-word-idx="${state.wordIndex}"]`);
        if (!wordEl) return;

        const typed = state.typedWords[state.wordIndex] || "";
        const containerRect = el.wordsContainer.getBoundingClientRect();

        el.caret.style.display = "block";

        let targetX = 0;
        let targetY = 0;
        let caretHeight = 24;

        if (typed.length === 0) {
            // Position at beginning of first char in active word
            const firstChar = wordEl.querySelector(".tk-char");
            if (firstChar) {
                const charRect = firstChar.getBoundingClientRect();
                targetX = charRect.left - containerRect.left + el.wordsContainer.scrollLeft;
                targetY = charRect.top - containerRect.top + el.wordsContainer.scrollTop;
                caretHeight = charRect.height;
            } else {
                const wordRect = wordEl.getBoundingClientRect();
                targetX = wordRect.left - containerRect.left + el.wordsContainer.scrollLeft;
                targetY = wordRect.top - containerRect.top + el.wordsContainer.scrollTop;
                caretHeight = wordRect.height;
            }
        } else {
            // Position right after the last typed character (standard or extra)
            const allChars = wordEl.querySelectorAll(".tk-char");
            const charIdx = Math.min(typed.length - 1, allChars.length - 1);
            const lastChar = allChars[charIdx];

            if (lastChar) {
                const charRect = lastChar.getBoundingClientRect();
                targetX = charRect.right - containerRect.left + el.wordsContainer.scrollLeft;
                targetY = charRect.top - containerRect.top + el.wordsContainer.scrollTop;
                caretHeight = charRect.height;
            }
        }

        el.caret.style.transform = `translate(${Math.round(targetX)}px, ${Math.round(targetY)}px)`;
        if (caretHeight > 0) {
            el.caret.style.height = `${Math.round(caretHeight)}px`;
        }
    }

    function scrollActiveWordIntoView(wordEl) {
        if (!el.wordsContainer || !wordEl) return;

        const containerRect = el.wordsContainer.getBoundingClientRect();
        const wordRect = wordEl.getBoundingClientRect();

        // Calculate active word's vertical position relative to wordsContainer
        const relativeTop = wordRect.top - containerRect.top + el.wordsContainer.scrollTop;
        const targetScroll = Math.max(0, relativeTop - 40);

        if (Math.abs(el.wordsContainer.scrollTop - targetScroll) > 16) {
            el.wordsContainer.scrollTo({
                top: targetScroll,
                behavior: "smooth"
            });
        }
    }

    // ------------------------------------------------------------------------
    // LIVE STATS (WPM & KEYSTROKE ACCURACY)
    // ------------------------------------------------------------------------
    function calculateStats() {
        const elapsedSeconds = state.startTime ? Math.max(0.5, (Date.now() - state.startTime) / 1000) : 0.5;
        const elapsedMinutes = elapsedSeconds / 60;

        let correctChars = 0;
        let incorrectChars = 0;

        // Count correct/incorrect characters across all words up to active word
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

            // Extra characters count as incorrect
            if (typed.length > target.length) {
                incorrectChars += (typed.length - target.length);
            }

            // Uncompleted missed characters in past words count as incorrect
            if (i < state.wordIndex && typed.length < target.length) {
                incorrectChars += (target.length - typed.length);
            }

            // 1 character credit for each correct space after a fully correct word
            if (i < state.wordIndex && typed === target) {
                correctChars++;
            }
        }

        state.correctCharsTotal = correctChars;
        state.incorrectCharsTotal = incorrectChars;

        // Standard 5-character word WPM: (correct characters / 5) / elapsed minutes
        const rawWpm = (state.hasStarted && elapsedMinutes > 0)
            ? (correctChars / 5) / elapsedMinutes
            : 0;
        const wpm = isFinite(rawWpm) ? Math.max(0, Math.round(rawWpm)) : 0;

        // Keystroke accuracy based on actual input
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
            try { el.hiddenInput.blur(); } catch (e) {}
        }

        const stats = calculateStats();
        const finalWpm = stats.wpm;
        const finalAcc = stats.accuracy;

        // Save & evaluate Personal Best
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
        if (el.resultsBest) el.resultsBest.textContent = `${Math.max(bestScore, finalWpm)} WPM`;
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
    // UNIFIED INPUT PIPELINE (DESKTOP & MOBILE KEYBOARDS)
    // ------------------------------------------------------------------------

    /**
     * Process typed characters when input changes.
     * Keeps expected characters strictly synchronized with displayed text.
     */
    function processTypedCharacters(newVal) {
        const prevVal = state.typedWords[state.wordIndex] || "";
        const targetWord = state.words[state.wordIndex] || "";

        // Track new keystroke(s) added
        if (newVal.length > prevVal.length) {
            for (let i = prevVal.length; i < newVal.length; i++) {
                state.totalKeystrokes++;
                const charTyped = newVal[i];
                const expectedChar = targetWord[i];

                if (expectedChar !== undefined && charTyped === expectedChar) {
                    state.correctKeystrokes++;
                }
            }
        }
        // When user backspaces (newVal.length < prevVal.length),
        // keystroke counts are preserved without double penalties.

        state.typedWords[state.wordIndex] = newVal;
        updateCurrentWordUI();
        updateLiveStatsDisplay();
    }

    /**
     * Advance to the next word on spacebar.
     */
    function advanceToNextWord() {
        if (state.isFinished) return;

        const currentTyped = state.typedWords[state.wordIndex] || "";
        if (currentTyped.length === 0) {
            // Ignore space if nothing has been typed for current word
            if (el.hiddenInput) el.hiddenInput.value = "";
            return;
        }

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
        updateLiveStatsDisplay();
    }

    /**
     * Jump back to the previous word on Backspace at start of word.
     */
    function returnToPreviousWord() {
        if (state.isFinished || state.wordIndex <= 0) return;

        const prevIdx = state.wordIndex - 1;
        const prevTyped = state.typedWords[prevIdx] || "";
        const prevWord = state.words[prevIdx] || "";

        const prevWordEl = el.wordsStream.querySelector(`[data-word-idx="${prevIdx}"]`);
        // Only jump back if previous word had errors or was left incomplete
        if (prevWordEl && (prevTyped !== prevWord || prevWordEl.classList.contains("has-error"))) {
            const currentWordEl = el.wordsStream.querySelector(`[data-word-idx="${state.wordIndex}"]`);
            if (currentWordEl) {
                currentWordEl.classList.remove("is-active");
            }

            state.wordIndex = prevIdx;
            if (el.hiddenInput) {
                el.hiddenInput.value = prevTyped;
            }

            if (prevWordEl) {
                prevWordEl.classList.add("is-active");
                prevWordEl.classList.remove("has-error", "is-complete-correct");
            }

            updateCurrentWordUI();
            updateLiveStatsDisplay();
        }
    }

    /**
     * Single input event handler attached to #tkInput.
     * Serves both desktop physical keystrokes and mobile virtual keyboards.
     */
    function onHiddenInput() {
        if (state.isFinished) return;

        const val = el.hiddenInput ? el.hiddenInput.value : "";

        // Start countdown timer on first typed character
        if (!state.hasStarted && val.length > 0) {
            startTimer();
        }

        // Check if value includes space (mobile soft keyboard spacebar or paste)
        if (val.includes(" ")) {
            const spaceIdx = val.indexOf(" ");
            const wordPart = val.slice(0, spaceIdx);

            if (wordPart.length > 0) {
                processTypedCharacters(wordPart);
                advanceToNextWord();
            } else {
                // Leading space on empty word: clear and ignore
                if (el.hiddenInput) el.hiddenInput.value = "";
            }
            return;
        }

        processTypedCharacters(val);
    }

    /**
     * Keyboard control listener for non-printable keys (Tab, Space, Backspace on empty input).
     */
    function handleKeyDown(e) {
        const modal = document.getElementById("playgroundModal");
        if (!modal || modal.hidden || !el.root || el.root.hidden) return;

        // Do not intercept if user is focusing a form input elsewhere on the page
        if (document.activeElement && document.activeElement !== el.hiddenInput && document.activeElement.tagName === "INPUT") {
            return;
        }

        // Quick restart shortcut: Tab (matches Monkeytype convention)
        if (e.key === "Tab") {
            e.preventDefault();
            resetTest(true);
            return;
        }

        if (state.isFinished) return;

        // Spacebar handling:
        if (e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            const currentTyped = state.typedWords[state.wordIndex] || "";
            if (currentTyped.length > 0) {
                advanceToNextWord();
            }
            return;
        }

        // Backspace handling:
        if (e.key === "Backspace") {
            const currentTyped = state.typedWords[state.wordIndex] || "";
            // When input is already empty, check if we should return to previous word
            if (currentTyped.length === 0) {
                e.preventDefault();
                returnToPreviousWord();
                return;
            }
            // Non-empty: browser natively removes character from el.hiddenInput, firing onHiddenInput
            return;
        }

        // Focus fallback: If hiddenInput was blurred and a typing key was pressed, refocus it
        if (document.activeElement !== el.hiddenInput) {
            if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
                focusInput();
                // Append key to input and trigger update without duplicating
                if (el.hiddenInput) {
                    el.hiddenInput.value += e.key;
                    onHiddenInput();
                    e.preventDefault();
                }
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

        updateHeaderButtonStates();

        // Generate and render fresh words
        generateWords();
        renderAllWords();

        if (el.wordsContainer) {
            el.wordsContainer.scrollTop = 0;
        }

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
        document.addEventListener("keydown", handleKeyDown);

        // Unified HTML input event listener for both desktop and mobile
        if (el.hiddenInput) {
            el.hiddenInput.addEventListener("input", onHiddenInput);

            // Handle mobile soft keyboard backspace when input is already empty
            el.hiddenInput.addEventListener("beforeinput", (e) => {
                if (e.inputType === "deleteContentBackward" && el.hiddenInput.value.length === 0) {
                    returnToPreviousWord();
                }
            });

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

        // Clicking anywhere on the game view focuses the typing input
        if (el.root) {
            el.root.addEventListener("click", () => {
                focusInput();
            });
        }

        // Time mode selector buttons (15s, 30s, 60s)
        if (el.timeButtons) {
            el.timeButtons.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    const t = btn.getAttribute("data-tk-time");
                    setTimeMode(t);
                });
            });
        }

        // Difficulty selector buttons (Easy, Normal, Hard)
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

        // Cycle time button in results overlay
        if (el.resultsChangeTimeBtn) {
            el.resultsChangeTimeBtn.addEventListener("click", (e) => {
                e.preventDefault();
                const nextTime = state.timeMode === 15 ? 30 : (state.timeMode === 30 ? 60 : 15);
                setTimeMode(nextTime);
            });
        }

        // Cycle difficulty button in results overlay
        if (el.resultsChangeDiffBtn) {
            el.resultsChangeDiffBtn.addEventListener("click", (e) => {
                e.preventDefault();
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
