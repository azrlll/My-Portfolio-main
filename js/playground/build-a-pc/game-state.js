// ============================================================================
// BUILD A PC — GAME STATE & HARDWARE VALIDATION ENGINE
// Keeps gameplay rules, installation order checks, and timer logic separate
// from DOM rendering.
// ============================================================================

window.PCSimState = (function () {
    "use strict";

    let installedSet = new Set();
    let selectedComponentId = null;
    let difficulty = "beginner"; // "beginner" | "intermediate" | "advanced"
    let elapsedSeconds = 0;
    let timerIntervalId = null;
    let timerStarted = false;
    let incorrectAttempts = 0;
    let hintsUsed = 0;
    let isCompleted = false;
    let onTickCallback = null;

    function getComponents() {
        return Array.isArray(window.PC_SIM_COMPONENTS) ? window.PC_SIM_COMPONENTS : [];
    }

    function getComponentById(id) {
        return getComponents().find((c) => c.id === id) || null;
    }

    /**
     * Starts the single game timer if not already running and game not finished.
     */
    function startTimerIfNeeded() {
        if (isCompleted || timerIntervalId !== null) return;
        timerStarted = true;
        timerIntervalId = window.setInterval(() => {
            elapsedSeconds += 1;
            if (typeof onTickCallback === "function") {
                onTickCallback(elapsedSeconds);
            }
        }, 1000);
    }

    /**
     * Stops the active timer cleanly.
     */
    function stopTimer() {
        if (timerIntervalId !== null) {
            window.clearInterval(timerIntervalId);
            timerIntervalId = null;
        }
    }

    /**
     * Resets the entire game state to initial values while preserving chosen difficulty.
     */
    function resetState() {
        stopTimer();
        installedSet = new Set();
        selectedComponentId = null;
        elapsedSeconds = 0;
        timerStarted = false;
        incorrectAttempts = 0;
        hintsUsed = 0;
        isCompleted = false;
        if (typeof onTickCallback === "function") {
            onTickCallback(0);
        }
    }

    function setDifficulty(newDifficulty) {
        const allowed = ["beginner", "intermediate", "advanced"];
        if (allowed.includes(newDifficulty)) {
            difficulty = newDifficulty;
        }
    }

    function getDifficulty() {
        return difficulty;
    }

    function selectComponent(componentId) {
        if (isCompleted) return null;
        if (!componentId) {
            selectedComponentId = null;
            return null;
        }
        const comp = getComponentById(componentId);
        if (!comp || installedSet.has(componentId)) return null;

        startTimerIfNeeded();
        selectedComponentId = componentId;
        return comp;
    }

    function getSelectedComponent() {
        return selectedComponentId ? getComponentById(selectedComponentId) : null;
    }

    function isInstalled(componentId) {
        return installedSet.has(componentId);
    }

    function getInstalledCount() {
        return installedSet.size;
    }

    function getTotalCount() {
        return getComponents().length;
    }

    /**
     * Validates and attempts to install `componentId` into `targetSlotId`.
     * Note: Both CPU (`slot-cpu`) and CPU Cooler (`slot-cooler`) mount at the physical
     * CPU socket zone (`slot-cpu` in the board DOM), so dropping `cpu-cooler` onto `slot-cpu`
     * or `slot-cooler` is normalized to check the CPU dependency properly.
     */
    function attemptInstall(componentId, rawTargetSlotId) {
        if (isCompleted) {
            return {
                success: false,
                reason: "The PC build is already complete. Click Restart to build again."
            };
        }

        const comp = getComponentById(componentId);
        if (!comp) {
            return { success: false, reason: "Unknown hardware component selected." };
        }

        if (installedSet.has(componentId)) {
            return {
                success: false,
                reason: `${comp.name} is already installed in this build.`
            };
        }

        startTimerIfNeeded();

        // Normalize CPU socket target for CPU Cooler
        const normalizedTarget =
            comp.id === "cpu-cooler" && rawTargetSlotId === "slot-cpu"
                ? "slot-cooler"
                : rawTargetSlotId;

        // 1. Check if the target slot matches the component's designated slot
        if (normalizedTarget !== comp.targetSlot) {
            incorrectAttempts += 1;
            const slotLabels = {
                "slot-cpu": "the CPU Socket",
                "slot-cooler": "the CPU Socket mount",
                "slot-ram": "the DDR5 DIMM slots",
                "slot-ssd": "the M.2 storage slot",
                "slot-gpu": "the PCIe x16 expansion slot",
                "slot-psu": "the lower PSU case compartment"
            };
            const attemptedLabel = slotLabels[rawTargetSlotId] || "that location";
            return {
                success: false,
                reason: `Incorrect placement: ${comp.name} cannot be installed in ${attemptedLabel}. ${comp.hint}`
            };
        }

        // 2. Check hardware dependency (e.g., CPU Cooler requires CPU first)
        if (comp.requires && !installedSet.has(comp.requires)) {
            incorrectAttempts += 1;
            const requiredComp = getComponentById(comp.requires);
            const reqName = requiredComp ? requiredComp.name : comp.requires.toUpperCase();
            return {
                success: false,
                reason: `Order check failed: You must install the ${reqName} into the socket first before mounting the ${comp.name} over it.`
            };
        }

        // 3. In Advanced difficulty, enforce realistic build order:
        // Core board components (CPU, RAM, M.2 SSD) should be installed before bulky GPU/Cooler
        if (difficulty === "advanced" && comp.id === "gpu") {
            const coreBoardParts = ["cpu", "ram", "ssd"];
            const missingCore = coreBoardParts.filter((id) => !installedSet.has(id));
            if (missingCore.length > 0) {
                incorrectAttempts += 1;
                return {
                    success: false,
                    reason: "Advanced assembly rule: Install core motherboard components (CPU, RAM, and M.2 SSD) before seating the full-length GPU."
                };
            }
        }

        // Valid installation!
        installedSet.add(comp.id);
        if (selectedComponentId === comp.id) {
            selectedComponentId = null;
        }

        const total = getTotalCount();
        if (installedSet.size >= total) {
            isCompleted = true;
            stopTimer();
            // Ensure at least 1 second is recorded if completed very quickly
            if (elapsedSeconds < 1) {
                elapsedSeconds = 1;
            }
        }

        return {
            success: true,
            component: comp,
            installedCount: installedSet.size,
            totalCount: total,
            isCompleted
        };
    }

    /**
     * Requests a contextual hint for the currently selected component,
     * or the next uninstalled component if none is selected.
     */
    function requestHint() {
        if (isCompleted) return null;
        startTimerIfNeeded();

        let targetComp = getSelectedComponent();
        if (!targetComp) {
            // Pick the next logical uninstalled component (ensuring CPU comes before CPU Cooler)
            const all = getComponents();
            targetComp =
                all.find(
                    (c) => !installedSet.has(c.id) && (!c.requires || installedSet.has(c.requires))
                ) || all.find((c) => !installedSet.has(c.id));
        }

        if (!targetComp) return null;

        hintsUsed += 1;
        return {
            component: targetComp,
            hintText: targetComp.hint,
            instructionText: targetComp.instruction,
            hintsUsed
        };
    }

    function getSnapshot() {
        return {
            installedIds: Array.from(installedSet),
            installedCount: installedSet.size,
            totalCount: getTotalCount(),
            selectedComponentId,
            difficulty,
            elapsedSeconds,
            timerStarted,
            incorrectAttempts,
            hintsUsed,
            isCompleted
        };
    }

    function setOnTick(callback) {
        onTickCallback = callback;
    }

    return {
        getComponents,
        getComponentById,
        startTimerIfNeeded,
        stopTimer,
        resetState,
        setDifficulty,
        getDifficulty,
        selectComponent,
        getSelectedComponent,
        isInstalled,
        getInstalledCount,
        getTotalCount,
        attemptInstall,
        requestHint,
        getSnapshot,
        setOnTick
    };
})();
