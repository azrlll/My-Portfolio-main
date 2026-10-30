// ============================================================================
// CIRCUIT CONNECT — ELECTRONIC COMPONENT CATALOG & SCHEMATIC SYMBOLS
// Defines component types, terminal metadata, and clean monochrome SVG symbols.
// ============================================================================

window.CircuitConnectComponents = (function () {
    "use strict";

    const COMPONENT_TYPES = {
        battery: {
            type: "battery",
            typeName: "DC Power Source",
            defaultSpec: "9V DC",
            polarized: true,
            description: "Provides direct current (DC) electrical potential between its Positive (+) and Negative (−) terminals.",
            terminals: [
                { key: "pos", label: "+", fullLabel: "Positive (+)", role: "source_pos" },
                { key: "neg", label: "−", fullLabel: "Negative (−)", role: "source_neg" }
            ]
        },
        resistor: {
            type: "resistor",
            typeName: "Resistor",
            defaultSpec: "330 Ω",
            polarized: false,
            description: "Limits electrical current flow to protect sensitive components such as LEDs and transistor bases.",
            terminals: [
                { key: "t1", label: "T1", fullLabel: "Terminal 1", role: "passive" },
                { key: "t2", label: "T2", fullLabel: "Terminal 2", role: "passive" }
            ]
        },
        led: {
            type: "led",
            typeName: "Light-Emitting Diode",
            defaultSpec: "Red 2.0V / 20mA",
            polarized: true,
            isOutput: true,
            description: "Emits light when forward-biased (Anode + toward positive supply, Cathode − toward ground) with a series current-limiting resistor.",
            terminals: [
                { key: "anode", label: "A (+)", fullLabel: "Anode (+)", role: "polarized_pos" },
                { key: "cathode", label: "K (−)", fullLabel: "Cathode (−)", role: "polarized_neg" }
            ]
        },
        switch: {
            type: "switch",
            typeName: "SPST Toggle Switch",
            defaultSpec: "Toggle OPEN / CLOSED",
            polarized: false,
            isInteractiveSwitch: true,
            description: "Controls current continuity. When CLOSED, current flows between IN and OUT; when OPEN, the path is broken.",
            terminals: [
                { key: "in", label: "IN", fullLabel: "Switch Input", role: "switch_terminal" },
                { key: "out", label: "OUT", fullLabel: "Switch Output", role: "switch_terminal" }
            ]
        },
        bulb: {
            type: "bulb",
            typeName: "Incandescent Indicator Lamp",
            defaultSpec: "9V–12V Filament",
            polarized: false,
            isOutput: true,
            description: "Non-polarized resistive lamp that illuminates when current flows through its filament in either direction.",
            terminals: [
                { key: "t1", label: "L1", fullLabel: "Lamp Terminal 1", role: "load" },
                { key: "t2", label: "L2", fullLabel: "Lamp Terminal 2", role: "load" }
            ]
        },
        buzzer: {
            type: "buzzer",
            typeName: "Piezo Audio Buzzer",
            defaultSpec: "DC Active Buzzer",
            polarized: true,
            isOutput: true,
            description: "Polarized acoustic transducer that generates an audible tone when energized with correct positive (+) and negative (−) polarity.",
            terminals: [
                { key: "pos", label: "POS (+)", fullLabel: "Positive (+)", role: "polarized_pos" },
                { key: "neg", label: "NEG (−)", fullLabel: "Negative (−)", role: "polarized_neg" }
            ]
        },
        diode: {
            type: "diode",
            typeName: "Silicon Rectifier Diode",
            defaultSpec: "1N4007 (0.7V Vf)",
            polarized: true,
            description: "One-way electrical valve. Allows current to flow from Anode (+) to Cathode (−) while blocking reverse current.",
            terminals: [
                { key: "anode", label: "A (+)", fullLabel: "Anode (+)", role: "polarized_pos" },
                { key: "cathode", label: "K (−)", fullLabel: "Cathode (−)", role: "polarized_neg" }
            ]
        },
        capacitor: {
            type: "capacitor",
            typeName: "Decoupling Capacitor",
            defaultSpec: "100 µF",
            polarized: false,
            description: "Stores electrical energy in an electric field; blocks steady DC while smoothing voltage ripples.",
            terminals: [
                { key: "t1", label: "C1", fullLabel: "Plate 1", role: "passive" },
                { key: "t2", label: "C2", fullLabel: "Plate 2", role: "passive" }
            ]
        },
        transistor: {
            type: "transistor",
            typeName: "NPN Bipolar Transistor",
            defaultSpec: "2N2222 NPN",
            polarized: true,
            description: "Electronic switch. A small base current into B (via a base resistor) enables collector-to-emitter current from C to E.",
            terminals: [
                { key: "b", label: "B", fullLabel: "Base (Control)", role: "npn_base" },
                { key: "c", label: "C", fullLabel: "Collector (Load In)", role: "npn_collector" },
                { key: "e", label: "E", fullLabel: "Emitter (To GND/−)", role: "npn_emitter" }
            ]
        },
        ground: {
            type: "ground",
            typeName: "Ground Reference (0V)",
            defaultSpec: "0V Return Path",
            polarized: false,
            description: "Common 0V reference node connected to the negative return side of the DC power supply.",
            terminals: [
                { key: "gnd", label: "GND", fullLabel: "0V Ground Node", role: "ground_ref" },
                { key: "ret", label: "RET", fullLabel: "Supply Return (−)", role: "ground_ref" }
            ]
        }
    };

    function getTypeMetadata(type) {
        return COMPONENT_TYPES[type] || COMPONENT_TYPES.resistor;
    }

    /**
     * Generates a clean inline SVG schematic icon for a component.
     */
    function renderSymbolSvg(type, options) {
        const opts = options || {};
        const isEnergized = Boolean(opts.energized);
        const switchClosed = opts.switchClosed !== undefined ? Boolean(opts.switchClosed) : true;
        const strokeColor = isEnergized ? "#4ADE80" : "currentColor";

        switch (type) {
            case "battery":
                return `
                    <svg class="cc-schematic-svg" viewBox="0 0 80 40" aria-hidden="true">
                        <line x1="6" y1="20" x2="28" y2="20" stroke="currentColor" stroke-width="2"/>
                        <line x1="28" y1="7" x2="28" y2="33" stroke="currentColor" stroke-width="2.2"/>
                        <line x1="38" y1="13" x2="38" y2="27" stroke="currentColor" stroke-width="3.2"/>
                        <line x1="46" y1="7" x2="46" y2="33" stroke="currentColor" stroke-width="2.2"/>
                        <line x1="56" y1="13" x2="56" y2="27" stroke="currentColor" stroke-width="3.2"/>
                        <line x1="56" y1="20" x2="74" y2="20" stroke="currentColor" stroke-width="2"/>
                        <text x="15" y="13" font-size="9" font-family="monospace" fill="currentColor">+</text>
                        <text x="63" y="13" font-size="9" font-family="monospace" fill="currentColor">−</text>
                    </svg>
                `;

            case "resistor":
                return `
                    <svg class="cc-schematic-svg" viewBox="0 0 80 40" aria-hidden="true">
                        <polyline points="6,20 18,20 23,10 30,30 37,10 44,30 51,10 58,30 62,20 74,20"
                            fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;

            case "led":
                return `
                    <svg class="cc-schematic-svg ${isEnergized ? "is-energized-svg" : ""}" viewBox="0 0 80 44" aria-hidden="true">
                        <line x1="6" y1="24" x2="26" y2="24" stroke="${strokeColor}" stroke-width="2"/>
                        <polygon points="26,13 26,35 48,24" fill="${isEnergized ? "rgba(74, 222, 128, 0.28)" : "none"}" stroke="${strokeColor}" stroke-width="2" stroke-linejoin="round"/>
                        <line x1="48" y1="13" x2="48" y2="35" stroke="${strokeColor}" stroke-width="2.4"/>
                        <line x1="48" y1="24" x2="74" y2="24" stroke="${strokeColor}" stroke-width="2"/>
                        <line x1="36" y1="10" x2="44" y2="3" stroke="${strokeColor}" stroke-width="1.6"/>
                        <polyline points="40,3 44,3 44,7" fill="none" stroke="${strokeColor}" stroke-width="1.6"/>
                        <line x1="45" y1="12" x2="53" y2="5" stroke="${strokeColor}" stroke-width="1.6"/>
                        <polyline points="49,5 53,5 53,9" fill="none" stroke="${strokeColor}" stroke-width="1.6"/>
                        ${isEnergized ? '<circle cx="38" cy="24" r="16" fill="none" stroke="#4ADE80" stroke-width="1.2" stroke-dasharray="3 2"/>' : ""}
                    </svg>
                `;

            case "switch":
                return `
                    <svg class="cc-schematic-svg" viewBox="0 0 80 40" aria-hidden="true">
                        <line x1="6" y1="24" x2="25" y2="24" stroke="currentColor" stroke-width="2"/>
                        <circle cx="27" cy="24" r="3" fill="currentColor"/>
                        <circle cx="53" cy="24" r="3" fill="currentColor"/>
                        ${
                            switchClosed
                                ? '<line x1="27" y1="24" x2="53" y2="24" stroke="#4ADE80" stroke-width="2.5"/>'
                                : '<line x1="27" y1="24" x2="50" y2="10" stroke="#FBBF24" stroke-width="2.3"/>'
                        }
                        <line x1="55" y1="24" x2="74" y2="24" stroke="currentColor" stroke-width="2"/>
                    </svg>
                `;

            case "bulb":
                return `
                    <svg class="cc-schematic-svg ${isEnergized ? "is-energized-svg" : ""}" viewBox="0 0 80 44" aria-hidden="true">
                        <line x1="6" y1="22" x2="26" y2="22" stroke="${strokeColor}" stroke-width="2"/>
                        <circle cx="40" cy="22" r="13" fill="${isEnergized ? "rgba(251, 191, 36, 0.24)" : "none"}" stroke="${isEnergized ? "#FBBF24" : "currentColor"}" stroke-width="2"/>
                        <path d="M33 27 C36 15, 44 15, 47 27" fill="none" stroke="${isEnergized ? "#FBBF24" : "currentColor"}" stroke-width="1.8"/>
                        <line x1="54" y1="22" x2="74" y2="22" stroke="${strokeColor}" stroke-width="2"/>
                    </svg>
                `;

            case "buzzer":
                return `
                    <svg class="cc-schematic-svg ${isEnergized ? "is-energized-svg" : ""}" viewBox="0 0 80 44" aria-hidden="true">
                        <line x1="6" y1="22" x2="24" y2="22" stroke="${strokeColor}" stroke-width="2"/>
                        <rect x="24" y="10" width="22" height="24" rx="3" fill="${isEnergized ? "rgba(74, 222, 128, 0.18)" : "none"}" stroke="${strokeColor}" stroke-width="2"/>
                        <path d="M46 14 L54 8 L54 36 L46 30 Z" fill="none" stroke="${strokeColor}" stroke-width="1.8"/>
                        <line x1="54" y1="22" x2="74" y2="22" stroke="${strokeColor}" stroke-width="2"/>
                        ${isEnergized ? '<path d="M59 13 Q65 22 59 31 M63 10 Q71 22 63 34" fill="none" stroke="#4ADE80" stroke-width="1.6"/>' : ""}
                    </svg>
                `;

            case "diode":
                return `
                    <svg class="cc-schematic-svg" viewBox="0 0 80 40" aria-hidden="true">
                        <line x1="6" y1="20" x2="26" y2="20" stroke="${strokeColor}" stroke-width="2"/>
                        <polygon points="26,10 26,30 48,20" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linejoin="round"/>
                        <line x1="48" y1="10" x2="48" y2="30" stroke="${strokeColor}" stroke-width="2.4"/>
                        <line x1="48" y1="20" x2="74" y2="20" stroke="${strokeColor}" stroke-width="2"/>
                    </svg>
                `;

            case "transistor":
                return `
                    <svg class="cc-schematic-svg" viewBox="0 0 80 48" aria-hidden="true">
                        <circle cx="42" cy="24" r="17" fill="none" stroke="${strokeColor}" stroke-width="1.6"/>
                        <line x1="12" y1="24" x2="35" y2="24" stroke="${strokeColor}" stroke-width="2"/>
                        <line x1="35" y1="13" x2="35" y2="35" stroke="${strokeColor}" stroke-width="2.4"/>
                        <line x1="35" y1="18" x2="52" y2="9" stroke="${strokeColor}" stroke-width="2"/>
                        <line x1="35" y1="30" x2="52" y2="39" stroke="${strokeColor}" stroke-width="2"/>
                        <polygon points="46,38 52,39 49,33" fill="${strokeColor}"/>
                    </svg>
                `;

            case "ground":
                return `
                    <svg class="cc-schematic-svg" viewBox="0 0 80 40" aria-hidden="true">
                        <line x1="12" y1="16" x2="68" y2="16" stroke="${strokeColor}" stroke-width="2"/>
                        <line x1="40" y1="6" x2="40" y2="22" stroke="${strokeColor}" stroke-width="2"/>
                        <line x1="24" y1="22" x2="56" y2="22" stroke="${strokeColor}" stroke-width="2"/>
                        <line x1="30" y1="28" x2="50" y2="28" stroke="${strokeColor}" stroke-width="2"/>
                        <line x1="35" y1="34" x2="45" y2="34" stroke="${strokeColor}" stroke-width="2"/>
                    </svg>
                `;

            default:
                return `
                    <svg class="cc-schematic-svg" viewBox="0 0 80 40" aria-hidden="true">
                        <rect x="20" y="10" width="40" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="2"/>
                        <line x1="6" y1="20" x2="20" y2="20" stroke="currentColor" stroke-width="2"/>
                        <line x1="60" y1="20" x2="74" y2="20" stroke="currentColor" stroke-width="2"/>
                    </svg>
                `;
        }
    }

    return {
        COMPONENT_TYPES,
        getTypeMetadata,
        renderSymbolSvg
    };
})();
