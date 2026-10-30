// ============================================================================
// CIRCUIT CONNECT — CORE GAME ENGINE & STATE MACHINE
// Manages active level state, terminal selection, wire creation/removal,
// undo history, switch toggling, hints, timer, and circuit testing.
// ============================================================================

window.CircuitConnectEngine = (function () {
    "use strict";

    let session = null;
    let timerInterval = null;
    let onStateChangeCallback = null;
    let onTickCallback = null;

    function getLevelById(levelId) {
        const list = window.CIRCUIT_CONNECT_LEVELS || [];
        return list.find((l) => l.id === Number(levelId)) || list[0] || null;
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function startTimer() {
        stopTimer();
        timerInterval = setInterval(() => {
            if (!session || session.isCompleted) return;
            session.elapsedSeconds += 1;
            if (typeof onTickCallback === "function") {
                onTickCallback(session.elapsedSeconds);
            }
        }, 1000);
    }

    function notifyChange() {
        if (typeof onStateChangeCallback === "function" && session) {
            onStateChangeCallback(getSessionSnapshot());
        }
    }

    function normalizeWirePair(termA, termB) {
        return termA < termB ? [termA, termB] : [termB, termA];
    }

    function wiresEqual(w1, w2) {
        const a = normalizeWirePair(w1[0], w1[1]);
        const b = normalizeWirePair(w2[0], w2[1]);
        return a[0] === b[0] && a[1] === b[1];
    }

    function getTerminalHumanLabel(level, terminalId) {
        if (!terminalId || !level) return terminalId;
        const parts = String(terminalId).split(":");
        const compId = parts[0];
        const termKey = parts[1];
        const comp = (level.components || []).find((c) => c.id === compId);
        if (!comp) return terminalId;
        const meta = window.CircuitConnectComponents
            ? window.CircuitConnectComponents.getTypeMetadata(comp.type)
            : null;
        const termObj = meta && meta.terminals
            ? meta.terminals.find((t) => t.key === termKey)
            : null;
        return `${comp.label} [${termObj ? termObj.label : termKey}]`;
    }

    function startLevel(levelId, callbacks) {
        const cbs = callbacks || {};
        if (typeof cbs.onStateChange === "function") {
            onStateChangeCallback = cbs.onStateChange;
        }
        if (typeof cbs.onTick === "function") {
            onTickCallback = cbs.onTick;
        }

        const level = getLevelById(levelId);
        if (!level) return null;

        const initialSwitches = {};
        (level.components || []).forEach((comp) => {
            if (comp.type === "switch") {
                initialSwitches[comp.id] = comp.initialSwitchClosed !== undefined ? Boolean(comp.initialSwitchClosed) : true;
            }
        });

        const startingWires = Array.isArray(level.initialWires)
            ? level.initialWires.map((pair) => [pair[0], pair[1]])
            : [];

        session = {
            levelId: level.id,
            level,
            wires: startingWires,
            historyStack: [],
            switchStates: initialSwitches,
            selectedTerminal: null,
            elapsedSeconds: 0,
            testsCount: 0,
            failedTests: 0,
            hintsUsed: 0,
            unnecessaryWires: 0,
            isCompleted: false,
            energizedComponents: [],
            energizedWires: [],
            statusBanner: {
                type: "neutral",
                title: "WORKBENCH READY",
                message: "Select any component terminal on the circuit board, then select a second terminal to connect a wire."
            },
            newlyUnlockedAchievements: []
        };

        startTimer();
        notifyChange();
        return getSessionSnapshot();
    }

    function pushHistorySnapshot() {
        if (!session) return;
        session.historyStack.push(session.wires.map((w) => [w[0], w[1]]));
        if (session.historyStack.length > 40) {
            session.historyStack.shift();
        }
    }

    function clearEnergizedState() {
        if (!session) return;
        session.energizedComponents = [];
        session.energizedWires = [];
    }

    function selectTerminal(terminalId) {
        if (!session || session.isCompleted) return;

        // Clicking the already selected terminal cancels selection
        if (session.selectedTerminal === terminalId) {
            session.selectedTerminal = null;
            session.statusBanner = {
                type: "neutral",
                title: "SELECTION CLEARED",
                message: "Wire start cancelled. Select any terminal to begin a connection."
            };
            notifyChange();
            return;
        }

        // First terminal selected
        if (!session.selectedTerminal) {
            session.selectedTerminal = terminalId;
            const label = getTerminalHumanLabel(session.level, terminalId);
            session.statusBanner = {
                type: "info",
                title: "TERMINAL SELECTED",
                message: `Starting wire from ${label}. Now click or tap a destination terminal to complete the connection.`
            };
            notifyChange();
            return;
        }

        // Second terminal selected: attempt to connect or toggle existing wire
        const fromTerm = session.selectedTerminal;
        const toTerm = terminalId;
        session.selectedTerminal = null;

        const fromCompId = String(fromTerm).split(":")[0];
        const toCompId = String(toTerm).split(":")[0];

        if (fromCompId === toCompId) {
            session.statusBanner = {
                type: "warning",
                title: "INVALID SELF-CONNECTION",
                message: "Cannot wire two terminals of the same component directly together—that would short out the component."
            };
            notifyChange();
            return;
        }

        // Check if wire already exists between these two terminals -> remove it
        const existingIndex = session.wires.findIndex((w) => wiresEqual(w, [fromTerm, toTerm]));
        if (existingIndex !== -1) {
            pushHistorySnapshot();
            session.wires.splice(existingIndex, 1);
            clearEnergizedState();
            session.statusBanner = {
                type: "neutral",
                title: "WIRE REMOVED",
                message: `Removed existing wire between ${getTerminalHumanLabel(session.level, fromTerm)} and ${getTerminalHumanLabel(session.level, toTerm)}.`
            };
            notifyChange();
            return;
        }

        // Create the new wire
        pushHistorySnapshot();
        session.wires.push([fromTerm, toTerm]);
        clearEnergizedState();

        session.statusBanner = {
            type: "info",
            title: "WIRE CONNECTED",
            message: `Connected ${getTerminalHumanLabel(session.level, fromTerm)} ↔ ${getTerminalHumanLabel(session.level, toTerm)}.`
        };
        notifyChange();
    }

    function removeWireAtIndex(index) {
        if (!session || session.isCompleted) return;
        if (index < 0 || index >= session.wires.length) return;

        const removed = session.wires[index];
        pushHistorySnapshot();
        session.wires.splice(index, 1);
        session.selectedTerminal = null;
        clearEnergizedState();

        session.statusBanner = {
            type: "neutral",
            title: "WIRE REMOVED",
            message: `Disconnected ${getTerminalHumanLabel(session.level, removed[0])} from ${getTerminalHumanLabel(session.level, removed[1])}.`
        };
        notifyChange();
    }

    function undoLastAction() {
        if (!session || session.isCompleted) return;
        if (session.historyStack.length === 0) {
            session.statusBanner = {
                type: "neutral",
                title: "NOTHING TO UNDO",
                message: "There are no previous wire actions to undo."
            };
            notifyChange();
            return;
        }

        session.wires = session.historyStack.pop();
        session.selectedTerminal = null;
        clearEnergizedState();
        session.statusBanner = {
            type: "neutral",
            title: "ACTION UNDONE",
            message: "Restored previous circuit wiring state."
        };
        notifyChange();
    }

    function resetCircuit() {
        if (!session) return;
        const level = session.level;
        pushHistorySnapshot();
        session.wires = Array.isArray(level.initialWires)
            ? level.initialWires.map((pair) => [pair[0], pair[1]])
            : [];
        session.selectedTerminal = null;
        session.isCompleted = false;
        clearEnergizedState();

        (level.components || []).forEach((comp) => {
            if (comp.type === "switch") {
                session.switchStates[comp.id] = comp.initialSwitchClosed !== undefined ? Boolean(comp.initialSwitchClosed) : true;
            }
        });

        session.statusBanner = {
            type: "neutral",
            title: "CIRCUIT RESET",
            message: "Cleared your custom connections and restored the level's starting board."
        };
        notifyChange();
    }

    function toggleSwitch(compId) {
        if (!session || session.isCompleted) return;
        if (session.switchStates[compId] === undefined) return;

        session.switchStates[compId] = !session.switchStates[compId];
        clearEnergizedState();

        const comp = (session.level.components || []).find((c) => c.id === compId);
        const stateText = session.switchStates[compId] ? "CLOSED (Conducting)" : "OPEN (Disconnected)";
        session.statusBanner = {
            type: "info",
            title: "SWITCH TOGGLED",
            message: `${comp ? comp.label : compId} is now ${stateText}.`
        };
        notifyChange();
    }

    function requestHint() {
        if (!session) return;
        const hints = (session.level && session.level.hints) || [];
        if (hints.length === 0) return;

        if (session.hintsUsed < hints.length) {
            session.hintsUsed += 1;
        }
        const hintIndex = Math.min(session.hintsUsed, hints.length) - 1;
        session.statusBanner = {
            type: "info",
            title: `HINT ${hintIndex + 1} OF ${hints.length}`,
            message: hints[hintIndex]
        };
        notifyChange();
    }

    function testCircuit() {
        if (!session || session.isCompleted) return null;

        session.selectedTerminal = null;
        session.testsCount += 1;

        const result = window.CircuitConnectValidator.validateCircuit(
            session.level,
            session.wires,
            session.switchStates
        );

        if (!result.passed) {
            session.failedTests += 1;
            clearEnergizedState();
            session.statusBanner = {
                type: "error",
                title: "CIRCUIT TEST FAILED",
                message: result.message
            };
            notifyChange();
            return result;
        }

        // Circuit Passed!
        stopTimer();
        session.isCompleted = true;
        session.unnecessaryWires = Number(result.unnecessaryWiresCount || 0);
        session.energizedComponents = result.energizedComponents || [];
        session.energizedWires = result.energizedWires || [];

        const finalScore = getCurrentScore();

        if (window.CircuitConnectStorage) {
            const savedResult = window.CircuitConnectStorage.recordLevelCompletion(session.levelId, {
                finalScore,
                elapsedSeconds: session.elapsedSeconds,
                hintsUsed: session.hintsUsed,
                testsCount: session.testsCount
            });
            session.newlyUnlockedAchievements = savedResult.newlyUnlockedAchievements || [];
        }

        session.statusBanner = {
            type: "success",
            title: "CIRCUIT COMPLETE.",
            message: "Power is flowing correctly. Your system is working!"
        };

        notifyChange();
        return result;
    }

    function getCurrentScore() {
        if (!session) return 100;
        return window.CircuitConnectScoring.calculateCurrentScore({
            failedTests: session.failedTests,
            hintsUsed: session.hintsUsed,
            unnecessaryWires: session.unnecessaryWires
        });
    }

    function getSessionSnapshot() {
        if (!session) return null;
        return {
            levelId: session.levelId,
            level: session.level,
            wires: session.wires.map((w) => [w[0], w[1]]),
            canUndo: session.historyStack.length > 0,
            switchStates: Object.assign({}, session.switchStates),
            selectedTerminal: session.selectedTerminal,
            elapsedSeconds: session.elapsedSeconds,
            formattedTime: window.CircuitConnectScoring.formatTime(session.elapsedSeconds),
            currentScore: getCurrentScore(),
            testsCount: session.testsCount,
            failedTests: session.failedTests,
            hintsUsed: session.hintsUsed,
            totalHints: ((session.level && session.level.hints) || []).length,
            revealedHints: ((session.level && session.level.hints) || []).slice(0, session.hintsUsed),
            unnecessaryWires: session.unnecessaryWires,
            isCompleted: session.isCompleted,
            energizedComponents: session.energizedComponents.slice(),
            energizedWires: session.energizedWires.slice(),
            statusBanner: Object.assign({}, session.statusBanner),
            newlyUnlockedAchievements: session.newlyUnlockedAchievements.slice(),
            getTerminalLabel: (termId) => getTerminalHumanLabel(session.level, termId)
        };
    }

    function cleanup() {
        stopTimer();
        if (window.CircuitConnectWireSystem) {
            window.CircuitConnectWireSystem.detach();
        }
    }

    return {
        startLevel,
        selectTerminal,
        removeWireAtIndex,
        undoLastAction,
        resetCircuit,
        toggleSwitch,
        requestHint,
        testCircuit,
        getSessionSnapshot,
        cleanup
    };
})();
