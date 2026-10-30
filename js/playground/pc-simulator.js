// ============================================================================
// BUILD A PC — MAIN SIMULATOR UI CONTROLLER
// Coordinates DOM rendering, user feedback, hints, difficulty modes,
// completion screen, and personal best updates.
// ============================================================================

(function () {
    "use strict";

    let dom = {};

    function cacheDom() {
        dom = {
            root: document.getElementById("pcSimulatorApp"),
            progressText: document.getElementById("pcSimProgressText"),
            progressBarFill: document.getElementById("pcSimProgressFill"),
            timerValue: document.getElementById("pcSimTimer"),
            bestTimeValue: document.getElementById("pcSimBestTime"),
            resetBestBtn: document.getElementById("pcSimResetBestBtn"),
            difficultyBtns: document.querySelectorAll(".pc-diff-btn[data-difficulty]"),
            hintBtn: document.getElementById("pcSimHintBtn"),
            restartBtn: document.getElementById("pcSimRestartBtn"),
            hintBanner: document.getElementById("pcSimHintBanner"),
            hintText: document.getElementById("pcSimHintText"),
            hintDismissBtn: document.getElementById("pcSimHintDismiss"),
            feedbackBanner: document.getElementById("pcSimFeedback"),
            selectedTitle: document.getElementById("pcSimSelectedTitle"),
            selectedDesc: document.getElementById("pcSimSelectedDesc"),
            selectedInst: document.getElementById("pcSimSelectedInst"),
            componentsTray: document.getElementById("pcSimComponentsTray"),
            boardChassis: document.getElementById("pcSimChassis"),
            slotCpu: document.getElementById("pcSlotCpu"),
            slotRam: document.getElementById("pcSlotRam"),
            slotSsd: document.getElementById("pcSlotSsd"),
            slotGpu: document.getElementById("pcSlotGpu"),
            slotPsu: document.getElementById("pcSlotPsu"),
            completionOverlay: document.getElementById("pcSimCompletionOverlay"),
            finalTime: document.getElementById("pcSimFinalTime"),
            finalErrors: document.getElementById("pcSimFinalErrors"),
            finalHints: document.getElementById("pcSimFinalHints"),
            finalBestNotice: document.getElementById("pcSimFinalBestNotice"),
            playAgainBtn: document.getElementById("pcSimPlayAgainBtn"),
            viewProjectsBtn: document.getElementById("pcSimViewProjectsBtn")
        };
    }

    // ------------------------------------------------------------------------
    // 1. FEEDBACK & HINT BANNERS
    // ------------------------------------------------------------------------
    function setFeedback(message, type) {
        if (!dom.feedbackBanner) return;
        dom.feedbackBanner.className = `pc-sim-feedback is-${type || "neutral"}`;
        const prefix =
            type === "success"
                ? "[INSTALLED] "
                : type === "error"
                ? "[PLACEMENT REJECTED] "
                : "[STATUS] ";
        dom.feedbackBanner.textContent = `${prefix}${message}`;
    }

    function showHintBanner(hintObj) {
        if (!dom.hintBanner || !dom.hintText || !hintObj) return;
        dom.hintText.innerHTML = `<strong>${escapeHtml(hintObj.component.name)}:</strong> ${escapeHtml(
            hintObj.hintText
        )}`;
        dom.hintBanner.hidden = false;
    }

    function hideHintBanner() {
        if (dom.hintBanner) {
            dom.hintBanner.hidden = true;
        }
    }

    // ------------------------------------------------------------------------
    // 2. RENDER PROGRESS, TIMER & PERSONAL BEST
    // ------------------------------------------------------------------------
    function renderTopStats() {
        const snap = window.PCSimState.getSnapshot();
        if (dom.progressText) {
            dom.progressText.textContent = `COMPONENTS INSTALLED: ${snap.installedCount} / ${snap.totalCount}`;
        }
        if (dom.progressBarFill) {
            const pct = snap.totalCount > 0 ? Math.round((snap.installedCount / snap.totalCount) * 100) : 0;
            dom.progressBarFill.style.width = `${pct}%`;
            const track = dom.progressBarFill.parentElement;
            if (track) {
                track.setAttribute("aria-valuenow", String(snap.installedCount));
            }
        }
        if (dom.timerValue) {
            dom.timerValue.textContent = window.PCSimStorage.formatTime(snap.elapsedSeconds);
        }
        renderBestTime();
    }

    function renderBestTime() {
        const best = window.PCSimStorage.getBestTime();
        if (dom.bestTimeValue) {
            dom.bestTimeValue.textContent = best !== null ? window.PCSimStorage.formatTime(best) : "--:--";
        }
        if (dom.resetBestBtn) {
            dom.resetBestBtn.hidden = best === null;
        }
    }

    // ------------------------------------------------------------------------
    // 3. RENDER SELECTED COMPONENT INSPECTOR
    // ------------------------------------------------------------------------
    function renderSelectedInspector() {
        const selected = window.PCSimState.getSelectedComponent();
        const diff = window.PCSimState.getDifficulty();

        if (!dom.selectedTitle || !dom.selectedDesc || !dom.selectedInst) return;

        if (!selected) {
            dom.selectedTitle.textContent = "Select or Drag a Component";
            dom.selectedDesc.textContent =
                "Click or drag any hardware component below to view its function and install it into the PC case or motherboard.";
            dom.selectedInst.textContent =
                "Tip: On desktop, drag a component to its slot or click to select and click the target slot. On mobile, tap a component then tap its destination.";
            return;
        }

        dom.selectedTitle.textContent = `${selected.name} — ${selected.fullName}`;
        dom.selectedDesc.textContent = selected.description;

        if (diff === "beginner") {
            dom.selectedInst.textContent = `Instruction: ${selected.instruction}`;
        } else if (diff === "intermediate") {
            dom.selectedInst.textContent = `Mount Area: ${
                selected.mountArea === "case" ? "PC Case Lower Compartment" : "Motherboard PCB"
            }. Click Hint if you need placement guidance.`;
        } else {
            dom.selectedInst.textContent =
                "Advanced Mode: Identify the correct socket or slot on the diagram without automatic highlights.";
        }
    }

    // ------------------------------------------------------------------------
    // 4. RENDER MOTHERBOARD & CASE SLOTS
    // ------------------------------------------------------------------------
    function renderBoardSlots() {
        const snap = window.PCSimState.getSnapshot();
        const selected = window.PCSimState.getSelectedComponent();
        const diff = snap.difficulty;

        if (dom.boardChassis) {
            dom.boardChassis.setAttribute("data-difficulty", diff);
        }

        // Helper to determine if a slot should be highlighted as a recommended target in Beginner mode
        function isSlotHighlighted(slotId) {
            if (diff !== "beginner" || !selected) return false;
            if (selected.id === "cpu-cooler" && slotId === "slot-cpu") {
                return window.PCSimState.isInstalled("cpu");
            }
            return selected.targetSlot === slotId;
        }

        // 1. CPU + CPU Cooler Dual-Stage Socket (`slot-cpu`)
        if (dom.slotCpu) {
            const cpuInstalled = window.PCSimState.isInstalled("cpu");
            const coolerInstalled = window.PCSimState.isInstalled("cpu-cooler");
            const highlight = isSlotHighlighted("slot-cpu");

            dom.slotCpu.classList.toggle("is-target-highlight", highlight);
            dom.slotCpu.classList.toggle("is-installed", cpuInstalled && coolerInstalled);
            dom.slotCpu.classList.toggle("is-partially-installed", cpuInstalled && !coolerInstalled);

            const labelText =
                diff === "advanced"
                    ? "SOCKET_1"
                    : !cpuInstalled
                    ? "CPU SOCKET"
                    : !coolerInstalled
                    ? "CPU INSTALLED • MOUNT COOLER"
                    : "CPU + COOLER INSTALLED ✓";

            let visualHtml = "";
            if (coolerInstalled) {
                visualHtml = `
                    <div class="slot-installed-visual is-stacked">
                        <img src="image/playground/cpu-cooler.svg" alt="Installed CPU Cooler over CPU" />
                    </div>
                `;
            } else if (cpuInstalled) {
                visualHtml = `
                    <div class="slot-installed-visual">
                        <img src="image/playground/cpu.svg" alt="Installed CPU" />
                    </div>
                `;
            } else {
                visualHtml = `
                    <div class="slot-socket-wireframe" aria-hidden="true">
                        <span class="socket-inner-box"></span>
                    </div>
                `;
            }

            dom.slotCpu.innerHTML = `
                <span class="slot-header-tag">${escapeHtml(labelText)}</span>
                ${visualHtml}
            `;
        }

        // 2. RAM Slot (`slot-ram`)
        updateStandardSlot(dom.slotRam, {
            slotId: "slot-ram",
            componentId: "ram",
            defaultLabel: diff === "advanced" ? "DIMM_A2_B2" : "DIMM SLOTS (DDR5)",
            installedLabel: "RAM INSTALLED ✓",
            imagePath: "image/playground/ram.svg",
            highlight: isSlotHighlighted("slot-ram")
        });

        // 3. M.2 SSD Slot (`slot-ssd`)
        updateStandardSlot(dom.slotSsd, {
            slotId: "slot-ssd",
            componentId: "ssd",
            defaultLabel: diff === "advanced" ? "M2_SOCKET" : "M.2 NVMe SLOT",
            installedLabel: "M.2 SSD INSTALLED ✓",
            imagePath: "image/playground/ssd.svg",
            highlight: isSlotHighlighted("slot-ssd")
        });

        // 4. GPU Slot (`slot-gpu`)
        updateStandardSlot(dom.slotGpu, {
            slotId: "slot-gpu",
            componentId: "gpu",
            defaultLabel: diff === "advanced" ? "PCIE_X16_1" : "PCIe x16 SLOT",
            installedLabel: "GPU INSTALLED ✓",
            imagePath: "image/playground/gpu.svg",
            highlight: isSlotHighlighted("slot-gpu")
        });

        // 5. PSU Compartment (`slot-psu`)
        updateStandardSlot(dom.slotPsu, {
            slotId: "slot-psu",
            componentId: "psu",
            defaultLabel: diff === "advanced" ? "CHASSIS_BAY" : "PSU COMPARTMENT (CASE)",
            installedLabel: "PSU INSTALLED ✓",
            imagePath: "image/playground/psu.svg",
            highlight: isSlotHighlighted("slot-psu")
        });
    }

    function updateStandardSlot(slotEl, cfg) {
        if (!slotEl) return;
        const installed = window.PCSimState.isInstalled(cfg.componentId);
        slotEl.classList.toggle("is-target-highlight", cfg.highlight);
        slotEl.classList.toggle("is-installed", installed);

        if (installed) {
            slotEl.innerHTML = `
                <span class="slot-header-tag">${escapeHtml(cfg.installedLabel)}</span>
                <div class="slot-installed-visual">
                    <img src="${escapeHtml(cfg.imagePath)}" alt="${escapeHtml(cfg.installedLabel)}" />
                </div>
            `;
        } else {
            slotEl.innerHTML = `
                <span class="slot-header-tag">${escapeHtml(cfg.defaultLabel)}</span>
                <div class="slot-empty-guide" aria-hidden="true"></div>
            `;
        }
    }

    // ------------------------------------------------------------------------
    // 5. RENDER COMPONENT TRAY CARDS
    // ------------------------------------------------------------------------
    function renderComponentTray() {
        if (!dom.componentsTray) return;
        const components = window.PCSimState.getComponents();
        const selected = window.PCSimState.getSelectedComponent();

        dom.componentsTray.innerHTML = "";

        components.forEach((comp) => {
            const installed = window.PCSimState.isInstalled(comp.id);
            const isSelected = Boolean(selected && selected.id === comp.id);

            const card = document.createElement("div");
            card.className = `pc-comp-card${installed ? " is-installed" : ""}${
                isSelected ? " is-selected" : ""
            }`;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", installed ? "-1" : "0");
            card.setAttribute("aria-disabled", String(installed));
            card.setAttribute(
                "aria-label",
                `${comp.name} (${comp.fullName}) — ${installed ? "Installed" : "Available to install"}`
            );
            card.setAttribute("data-component-id", comp.id);

            const statusBadge = installed
                ? `<span class="comp-status-pill is-done">INSTALLED &#10003;</span>`
                : isSelected
                ? `<span class="comp-status-pill is-active">SELECTED</span>`
                : `<span class="comp-status-pill">AVAILABLE</span>`;

            card.innerHTML = `
                <div class="comp-card-top">
                    <span class="comp-name">${escapeHtml(comp.name)}</span>
                    ${statusBadge}
                </div>
                <div class="comp-art-wrap">
                    <img src="${escapeHtml(comp.iconPath)}" alt="${escapeHtml(comp.name)} illustration" draggable="false" />
                </div>
                <div class="comp-card-meta">
                    <span class="comp-fullname">${escapeHtml(comp.fullName)}</span>
                    <span class="comp-spec">${escapeHtml(comp.shortSpec)}</span>
                </div>
            `;

            window.PCSimDragDrop.bindComponentCard(card, comp, installed);
            dom.componentsTray.appendChild(card);
        });
    }

    // ------------------------------------------------------------------------
    // 6. HANDLE PLACEMENT & COMPLETION
    // ------------------------------------------------------------------------
    function handleSelectComponent(componentId) {
        const comp = window.PCSimState.selectComponent(componentId);
        if (!comp) return;

        renderComponentTray();
        renderBoardSlots();
        renderSelectedInspector();
        setFeedback(`Selected ${comp.name}. Now click or drop it onto its designated location on the diagram.`, "neutral");
    }

    function handleAttemptDrop(componentId, targetSlotId, slotEl) {
        if (!componentId) {
            setFeedback("Select a hardware component from the right panel first, or drag it onto a slot.", "neutral");
            return;
        }

        const result = window.PCSimState.attemptInstall(componentId, targetSlotId);

        if (result.success) {
            hideHintBanner();
            renderTopStats();
            renderComponentTray();
            renderBoardSlots();
            renderSelectedInspector();

            if (slotEl) {
                slotEl.classList.remove("just-installed");
                void slotEl.offsetWidth; // trigger reflow for subtle pulse
                slotEl.classList.add("just-installed");
            }

            setFeedback(
                `${result.component.name} installed into position (${result.installedCount}/${result.totalCount} complete).`,
                "success"
            );

            if (result.isCompleted) {
                handleBuildComplete();
            }
        } else {
            renderTopStats();
            if (slotEl) {
                slotEl.classList.remove("just-rejected");
                void slotEl.offsetWidth;
                slotEl.classList.add("just-rejected");
            }
            setFeedback(result.reason, "error");
        }
    }

    function handleBuildComplete() {
        const snap = window.PCSimState.getSnapshot();
        const recordResult = window.PCSimStorage.recordCompletionTime(snap.elapsedSeconds);
        renderBestTime();

        if (dom.finalTime) {
            dom.finalTime.textContent = window.PCSimStorage.formatTime(snap.elapsedSeconds);
        }
        if (dom.finalErrors) {
            dom.finalErrors.textContent = String(snap.incorrectAttempts);
        }
        if (dom.finalHints) {
            dom.finalHints.textContent = String(snap.hintsUsed);
        }
        if (dom.finalBestNotice) {
            dom.finalBestNotice.textContent = recordResult.updated
                ? `New Personal Best: ${window.PCSimStorage.formatTime(recordResult.bestSeconds)}!`
                : `Personal Best: ${window.PCSimStorage.formatTime(recordResult.bestSeconds)}`;
        }
        if (dom.completionOverlay) {
            dom.completionOverlay.hidden = false;
        }
    }

    // ------------------------------------------------------------------------
    // 7. RESTART & CONTROLS INITIALIZATION
    // ------------------------------------------------------------------------
    function restartGame(customFeedbackMsg) {
        window.PCSimDragDrop.cleanup();
        window.PCSimState.resetState();
        hideHintBanner();

        if (dom.completionOverlay) {
            dom.completionOverlay.hidden = true;
        }

        renderTopStats();
        renderComponentTray();
        renderBoardSlots();
        renderSelectedInspector();
        setFeedback(
            customFeedbackMsg || "Simulator ready. Drag a component or click to select and assemble the PC.",
            "neutral"
        );
    }

    function bindControls() {
        // Bind board drop slots once
        const slots = [dom.slotCpu, dom.slotRam, dom.slotSsd, dom.slotGpu, dom.slotPsu];
        slots.forEach((slotEl) => {
            window.PCSimDragDrop.bindDropSlot(slotEl, () => window.PCSimState.getSelectedComponent());
        });

        // Hint Button
        if (dom.hintBtn) {
            dom.hintBtn.addEventListener("click", () => {
                const hintObj = window.PCSimState.requestHint();
                if (hintObj) {
                    showHintBanner(hintObj);
                } else {
                    setFeedback("All components are already installed!", "neutral");
                }
            });
        }

        if (dom.hintDismissBtn) {
            dom.hintDismissBtn.addEventListener("click", hideHintBanner);
        }

        // Restart Button
        if (dom.restartBtn) {
            dom.restartBtn.addEventListener("click", () => {
                restartGame("Build reset. All components returned to the tray.");
            });
        }

        // Play Again Button (Completion Screen)
        if (dom.playAgainBtn) {
            dom.playAgainBtn.addEventListener("click", () => {
                restartGame("New build started. Good luck!");
            });
        }

        // View My Projects Button (Completion Screen)
        if (dom.viewProjectsBtn) {
            dom.viewProjectsBtn.addEventListener("click", () => {
                if (dom.completionOverlay) {
                    dom.completionOverlay.hidden = true;
                }
            });
        }

        // Reset Personal Best Button
        if (dom.resetBestBtn) {
            dom.resetBestBtn.addEventListener("click", () => {
                window.PCSimStorage.resetBestTime();
                renderBestTime();
                setFeedback("Personal best time record has been cleared.", "neutral");
            });
        }

        // Difficulty Selector Buttons
        if (dom.difficultyBtns) {
            dom.difficultyBtns.forEach((btn) => {
                btn.addEventListener("click", () => {
                    const newDiff = btn.getAttribute("data-difficulty");
                    if (!newDiff || newDiff === window.PCSimState.getDifficulty()) return;

                    window.PCSimState.setDifficulty(newDiff);
                    dom.difficultyBtns.forEach((b) => {
                        const active = b.getAttribute("data-difficulty") === newDiff;
                        b.classList.toggle("active", active);
                        b.setAttribute("aria-pressed", String(active));
                    });

                    restartGame(
                        `Switched to ${newDiff.toUpperCase()} mode. Build state has been reset.`
                    );
                });
            });
        }
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    // ------------------------------------------------------------------------
    // INITIALIZE SIMULATOR ON DOM READY
    // ------------------------------------------------------------------------
    document.addEventListener("DOMContentLoaded", () => {
        cacheDom();
        if (!dom.root) return;

        window.PCSimDragDrop.init({
            onSelectComponent: handleSelectComponent,
            onAttemptDrop: handleAttemptDrop
        });

        window.PCSimState.setOnTick((seconds) => {
            if (dom.timerValue) {
                dom.timerValue.textContent = window.PCSimStorage.formatTime(seconds);
            }
        });

        bindControls();
        restartGame();
    });
})();
