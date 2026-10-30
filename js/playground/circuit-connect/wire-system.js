// ============================================================================
// CIRCUIT CONNECT — INTERACTIVE SVG WIRE RENDERING & ALIGNMENT SYSTEM
// Renders schematic wire paths between terminals, live cursor preview wires,
// click-to-delete wire hit targets, and automatic resize realignment.
// ============================================================================

window.CircuitConnectWireSystem = (function () {
    "use strict";

    // Muted technical schematic trace colors that fit the monochrome aesthetic
    const WIRE_PALETTE = [
        "#E4E4E7",
        "#93C5FD",
        "#FCD34D",
        "#86EFAC",
        "#C4B5FD",
        "#FDA4AF",
        "#67E8F9"
    ];

    let boardEl = null;
    let svgEl = null;
    let onWireClickCallback = null;
    let resizeObserver = null;
    let previewMousePos = null;
    let lastRenderData = null;

    function getTerminalCenter(terminalId) {
        if (!boardEl) return null;
        const termBtn = boardEl.querySelector(`[data-terminal-id="${terminalId}"]`);
        if (!termBtn) return null;

        const pinDot = termBtn.querySelector(".cc-terminal-pin") || termBtn;
        const boardRect = boardEl.getBoundingClientRect();
        const pinRect = pinDot.getBoundingClientRect();

        if (boardRect.width === 0 || boardRect.height === 0) return null;

        return {
            x: pinRect.left - boardRect.left + pinRect.width / 2,
            y: pinRect.top - boardRect.top + pinRect.height / 2
        };
    }

    /**
     * Generates a clean schematic curve/orthogonal path between two points.
     */
    function buildWirePathD(p1, p2, indexOffset) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const offset = ((indexOffset || 0) % 3 - 1) * 10;

        if (Math.abs(dy) < 18) {
            const midY = p1.y - 22 + offset;
            return `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${((p1.x + p2.x) / 2).toFixed(1)} ${midY.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
        }

        const c1x = p1.x + dx * 0.42;
        const c1y = p1.y + offset;
        const c2x = p1.x + dx * 0.58;
        const c2y = p2.y - offset;
        return `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    function attach(containerElement, svgElement, options) {
        detach();
        boardEl = containerElement;
        svgEl = svgElement;
        const opts = options || {};
        onWireClickCallback = typeof opts.onRemoveWire === "function" ? opts.onRemoveWire : null;

        if (boardEl) {
            boardEl.addEventListener("pointermove", handlePointerMove);
            boardEl.addEventListener("pointerleave", handlePointerLeave);
        }

        window.addEventListener("resize", handleResize);
        if (typeof window.ResizeObserver === "function" && boardEl) {
            resizeObserver = new ResizeObserver(() => {
                handleResize();
            });
            resizeObserver.observe(boardEl);
        }
    }

    function detach() {
        if (boardEl) {
            boardEl.removeEventListener("pointermove", handlePointerMove);
            boardEl.removeEventListener("pointerleave", handlePointerLeave);
        }
        window.removeEventListener("resize", handleResize);
        if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = null;
        }
        boardEl = null;
        svgEl = null;
        previewMousePos = null;
    }

    function handlePointerMove(e) {
        if (!boardEl || !lastRenderData || !lastRenderData.selectedTerminal) return;
        const rect = boardEl.getBoundingClientRect();
        previewMousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        renderWires(lastRenderData);
    }

    function handlePointerLeave() {
        if (previewMousePos) {
            previewMousePos = null;
            if (lastRenderData) renderWires(lastRenderData);
        }
    }

    function handleResize() {
        if (lastRenderData) {
            renderWires(lastRenderData);
        }
    }

    function renderWires(renderData) {
        lastRenderData = renderData;
        if (!boardEl || !svgEl) return;

        const wires = Array.isArray(renderData.wires) ? renderData.wires : [];
        const energizedSet = new Set(renderData.energizedWireIndices || []);
        const selectedTerminal = renderData.selectedTerminal || null;

        const boardRect = boardEl.getBoundingClientRect();
        if (boardRect.width > 0 && boardRect.height > 0) {
            svgEl.setAttribute("viewBox", `0 0 ${Math.round(boardRect.width)} ${Math.round(boardRect.height)}`);
        }

        const fragments = [];

        wires.forEach((w, idx) => {
            const fromId = Array.isArray(w) ? w[0] : w.from;
            const toId = Array.isArray(w) ? w[1] : w.to;
            const p1 = getTerminalCenter(fromId);
            const p2 = getTerminalCenter(toId);
            if (!p1 || !p2) return;

            const pathD = buildWirePathD(p1, p2, idx);
            const isEnergized = energizedSet.has(idx);
            const strokeColor = isEnergized ? "#4ADE80" : WIRE_PALETTE[idx % WIRE_PALETTE.length];

            fragments.push(`
                <g class="cc-wire-group ${isEnergized ? "is-energized" : ""}" data-wire-index="${idx}">
                    <path class="cc-wire-hit" d="${pathD}" data-wire-index="${idx}"
                        stroke="transparent" stroke-width="16" fill="none"
                        role="button" tabindex="0" aria-label="Remove wire between ${fromId} and ${toId}">
                        <title>Click to remove wire (${fromId} ↔ ${toId})</title>
                    </path>
                    <path class="cc-wire-shadow" d="${pathD}" stroke="#09090B" stroke-width="5" fill="none" stroke-linecap="round"/>
                    <path class="cc-wire-line" d="${pathD}" stroke="${strokeColor}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
                    ${
                        isEnergized
                            ? `<path class="cc-wire-flow" d="${pathD}" stroke="#ECFDF5" stroke-width="2" fill="none" stroke-dasharray="5 9" stroke-linecap="round"/>`
                            : ""
                    }
                    <circle cx="${p1.x.toFixed(1)}" cy="${p1.y.toFixed(1)}" r="4" fill="${strokeColor}"/>
                    <circle cx="${p2.x.toFixed(1)}" cy="${p2.y.toFixed(1)}" r="4" fill="${strokeColor}"/>
                </g>
            `);
        });

        // Render active preview wire if a terminal is selected and pointer is inside the board
        if (selectedTerminal && previewMousePos) {
            const pStart = getTerminalCenter(selectedTerminal);
            if (pStart) {
                const previewD = buildWirePathD(pStart, previewMousePos, 0);
                fragments.push(`
                    <g class="cc-wire-preview-group" pointer-events="none">
                        <path d="${previewD}" stroke="#F5F5F5" stroke-width="2" stroke-dasharray="6 5" fill="none" stroke-linecap="round"/>
                        <circle cx="${pStart.x.toFixed(1)}" cy="${pStart.y.toFixed(1)}" r="4.5" fill="#F5F5F5"/>
                    </g>
                `);
            }
        }

        svgEl.innerHTML = fragments.join("");

        // Bind click/keyboard handlers to remove wires directly on the board
        const hitPaths = svgEl.querySelectorAll(".cc-wire-hit");
        hitPaths.forEach((hit) => {
            hit.addEventListener("click", (e) => {
                e.stopPropagation();
                const wIdx = Number(hit.getAttribute("data-wire-index"));
                if (!Number.isNaN(wIdx) && onWireClickCallback) {
                    onWireClickCallback(wIdx);
                }
            });
            hit.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    const wIdx = Number(hit.getAttribute("data-wire-index"));
                    if (!Number.isNaN(wIdx) && onWireClickCallback) {
                        onWireClickCallback(wIdx);
                    }
                }
            });
        });
    }

    return {
        attach,
        detach,
        renderWires
    };
})();
