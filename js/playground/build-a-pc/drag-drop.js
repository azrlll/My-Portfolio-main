// ============================================================================
// BUILD A PC — UNIFIED POINTER DRAG-AND-DROP & TAP-TO-INSTALL CONTROLLER
// Supports desktop mouse dragging, touch dragging, tap-to-select + tap-to-place,
// and full keyboard navigation (Enter / Space).
// ============================================================================

window.PCSimDragDrop = (function () {
    "use strict";

    let activeDrag = null;
    let ghostEl = null;
    let callbacks = {
        onSelectComponent: null,
        onAttemptDrop: null
    };

    function createGhostElement(component) {
        removeGhostElement();
        ghostEl = document.createElement("div");
        ghostEl.className = "pc-drag-ghost";
        ghostEl.setAttribute("aria-hidden", "true");
        ghostEl.innerHTML = `
            <img src="${component.iconPath}" alt="" />
            <span>${component.name}</span>
        `;
        document.body.appendChild(ghostEl);
    }

    function updateGhostPosition(clientX, clientY) {
        if (!ghostEl) return;
        ghostEl.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
    }

    function removeGhostElement() {
        if (ghostEl && ghostEl.parentNode) {
            ghostEl.parentNode.removeChild(ghostEl);
        }
        ghostEl = null;
    }

    function clearSlotHoverStates() {
        document.querySelectorAll(".pc-drop-slot.is-drag-over").forEach((el) => {
            el.classList.remove("is-drag-over");
        });
    }

    /**
     * Finds the `.pc-drop-slot` element underneath `(clientX, clientY)`.
     */
    function findSlotAtPoint(clientX, clientY) {
        const elements = document.elementsFromPoint(clientX, clientY);
        for (let i = 0; i < elements.length; i++) {
            const slotEl = elements[i].closest(".pc-drop-slot");
            if (slotEl) return slotEl;
        }
        return null;
    }

    function handlePointerMove(e) {
        if (!activeDrag || e.pointerId !== activeDrag.pointerId) return;

        const dx = e.clientX - activeDrag.startX;
        const dy = e.clientY - activeDrag.startY;
        const dist = Math.hypot(dx, dy);

        // Start visual drag once pointer moves more than 6px
        if (!activeDrag.isDragging && dist > 6) {
            activeDrag.isDragging = true;
            activeDrag.sourceEl.classList.add("is-dragging");
            createGhostElement(activeDrag.component);
            if (typeof callbacks.onSelectComponent === "function") {
                callbacks.onSelectComponent(activeDrag.component.id);
            }
        }

        if (activeDrag.isDragging) {
            e.preventDefault();
            updateGhostPosition(e.clientX, e.clientY);

            clearSlotHoverStates();
            const hoveredSlot = findSlotAtPoint(e.clientX, e.clientY);
            if (hoveredSlot) {
                hoveredSlot.classList.add("is-drag-over");
            }
        }
    }

    function handlePointerUpOrCancel(e) {
        if (!activeDrag || e.pointerId !== activeDrag.pointerId) return;

        const dragInfo = activeDrag;
        activeDrag = null;

        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUpOrCancel);
        window.removeEventListener("pointercancel", handlePointerUpOrCancel);

        dragInfo.sourceEl.classList.remove("is-dragging");
        clearSlotHoverStates();
        removeGhostElement();

        if (dragInfo.isDragging && e.type === "pointerup") {
            const targetSlotEl = findSlotAtPoint(e.clientX, e.clientY);
            if (targetSlotEl) {
                const slotId = targetSlotEl.getAttribute("data-slot-id");
                if (slotId && typeof callbacks.onAttemptDrop === "function") {
                    callbacks.onAttemptDrop(dragInfo.component.id, slotId, targetSlotEl);
                }
            }
        } else if (!dragInfo.isDragging && e.type === "pointerup") {
            // Treated as a tap/click selection
            if (typeof callbacks.onSelectComponent === "function") {
                callbacks.onSelectComponent(dragInfo.component.id);
            }
        }
    }

    /**
     * Attaches pointer and keyboard listeners to a component card in the tray.
     */
    function bindComponentCard(cardEl, component, isInstalled) {
        if (!cardEl || isInstalled) return;

        cardEl.addEventListener("pointerdown", (e) => {
            // Only primary mouse button or touch/pen
            if (e.pointerType === "mouse" && e.button !== 0) return;
            if (cardEl.classList.contains("is-installed")) return;

            activeDrag = {
                pointerId: e.pointerId,
                component,
                sourceEl: cardEl,
                startX: e.clientX,
                startY: e.clientY,
                isDragging: false
            };

            window.addEventListener("pointermove", handlePointerMove, { passive: false });
            window.addEventListener("pointerup", handlePointerUpOrCancel);
            window.addEventListener("pointercancel", handlePointerUpOrCancel);
        });

        // Keyboard accessibility (Enter or Space selects the component)
        cardEl.addEventListener("keydown", (e) => {
            if (cardEl.classList.contains("is-installed")) return;
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (typeof callbacks.onSelectComponent === "function") {
                    callbacks.onSelectComponent(component.id);
                }
            }
        });
    }

    /**
     * Attaches click/tap and keyboard listeners to an installation slot on the board/case.
     */
    function bindDropSlot(slotEl, getSelectedComponentFn) {
        if (!slotEl) return;

        const handleActivateSlot = () => {
            const selected =
                typeof getSelectedComponentFn === "function" ? getSelectedComponentFn() : null;
            const slotId = slotEl.getAttribute("data-slot-id");
            if (!slotId) return;

            if (selected && typeof callbacks.onAttemptDrop === "function") {
                callbacks.onAttemptDrop(selected.id, slotId, slotEl);
            } else if (typeof callbacks.onAttemptDrop === "function") {
                // Notify user to select or drag a component first
                callbacks.onAttemptDrop(null, slotId, slotEl);
            }
        };

        slotEl.addEventListener("click", handleActivateSlot);
        slotEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleActivateSlot();
            }
        });
    }

    function init(options) {
        callbacks = Object.assign(callbacks, options || {});
    }

    function cleanup() {
        activeDrag = null;
        clearSlotHoverStates();
        removeGhostElement();
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUpOrCancel);
        window.removeEventListener("pointercancel", handlePointerUpOrCancel);
    }

    return {
        init,
        bindComponentCard,
        bindDropSlot,
        cleanup
    };
})();
