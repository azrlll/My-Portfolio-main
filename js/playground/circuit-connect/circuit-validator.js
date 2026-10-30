// ============================================================================
// CIRCUIT CONNECT — TOPOLOGICAL CIRCUIT SIMULATION & VALIDATION ENGINE
// Evaluates actual terminal-to-terminal electrical nets, directed current paths,
// polarity (LED, Diode, Buzzer, NPN Transistor), current-limiting resistors,
// switch continuity, short circuits, and series/parallel circuit topology.
// ============================================================================

window.CircuitConnectValidator = (function () {
    "use strict";

    /**
     * Disjoint-set (Union-Find) to group terminals connected by wires into
     * electrical nets (equipotential nodes).
     */
    function createUnionFind(items) {
        const parent = {};
        items.forEach((item) => {
            parent[item] = item;
        });

        function find(x) {
            if (parent[x] === undefined) {
                parent[x] = x;
                return x;
            }
            if (parent[x] !== x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }

        function union(a, b) {
            const rootA = find(a);
            const rootB = find(b);
            if (rootA !== rootB) {
                parent[rootB] = rootA;
            }
        }

        return { find, union };
    }

    /**
     * Returns all terminal IDs for a level's components.
     */
    function getAllTerminalIds(level) {
        const list = [];
        const ComponentsAPI = window.CircuitConnectComponents;
        (level.components || []).forEach((comp) => {
            const meta = ComponentsAPI ? ComponentsAPI.getTypeMetadata(comp.type) : null;
            const terms = meta ? meta.terminals : [];
            terms.forEach((t) => {
                list.push(`${comp.id}:${t.key}`);
            });
        });
        return list;
    }

    /**
     * Validates a circuit's current wiring and switch states against electrical
     * laws and the level's topology requirements.
     */
    function validateCircuit(level, wires, switchStates) {
        const activeWires = Array.isArray(wires) ? wires : [];
        const switches = switchStates || {};
        const compMap = {};
        (level.components || []).forEach((c) => {
            compMap[c.id] = c;
        });

        // 1. Check if no wires exist at all
        if (activeWires.length === 0) {
            return {
                passed: false,
                errorCode: "INCOMPLETE_CIRCUIT",
                message: "The circuit is incomplete. Connect component terminals with wires to form a complete electrical path.",
                energizedComponents: [],
                energizedWires: [],
                unnecessaryWiresCount: 0
            };
        }

        // 2. Build Electrical Nets via Union-Find
        const allTerminals = getAllTerminalIds(level);
        const uf = createUnionFind(allTerminals);
        const connectedTerminalSet = new Set();

        activeWires.forEach((w) => {
            const from = Array.isArray(w) ? w[0] : w.from;
            const to = Array.isArray(w) ? w[1] : w.to;
            if (from && to) {
                uf.union(from, to);
                connectedTerminalSet.add(from);
                connectedTerminalSet.add(to);
            }
        });

        const battery = (level.components || []).find((c) => c.type === "battery") || { id: "bat1" };
        const batPosTerm = `${battery.id}:pos`;
        const batNegTerm = `${battery.id}:neg`;

        if (!connectedTerminalSet.has(batPosTerm) || !connectedTerminalSet.has(batNegTerm)) {
            return {
                passed: false,
                errorCode: "INCOMPLETE_CIRCUIT",
                message: "The circuit is incomplete. Both Battery (+) and Battery (−) must be connected to complete a closed loop.",
                energizedComponents: [],
                energizedWires: [],
                unnecessaryWiresCount: 0
            };
        }

        const netPos = uf.find(batPosTerm);
        const netNeg = uf.find(batNegTerm);

        // 3. Direct wire short between Battery (+) and Battery (-)
        if (netPos === netNeg) {
            return {
                passed: false,
                errorCode: "SHORT_CIRCUIT",
                message: "A short circuit has been detected! Battery (+) is wired directly to Battery (−) without a load.",
                energizedComponents: [],
                energizedWires: [],
                unnecessaryWiresCount: 0
            };
        }

        // Check if any two-terminal non-battery component has both of its own terminals shorted together on the same net
        for (const comp of level.components || []) {
            if (comp.type === "battery" || comp.type === "transistor") continue;
            const meta = window.CircuitConnectComponents.getTypeMetadata(comp.type);
            if (meta && meta.terminals && meta.terminals.length === 2) {
                const tA = `${comp.id}:${meta.terminals[0].key}`;
                const tB = `${comp.id}:${meta.terminals[1].key}`;
                if (connectedTerminalSet.has(tA) && connectedTerminalSet.has(tB) && uf.find(tA) === uf.find(tB)) {
                    return {
                        passed: false,
                        errorCode: "SHORT_CIRCUIT",
                        message: `A short circuit has been detected across ${comp.label}! Both of its terminals are connected to the same wire node.`,
                        energizedComponents: [],
                        energizedWires: [],
                        unnecessaryWiresCount: 0
                    };
                }
            }
        }

        // 4. Special Handler for Transistor Switch Topology (Level 13)
        if (level.topology && level.topology.mode === "transistor_switch") {
            return validateTransistorCircuit(level, compMap, uf, connectedTerminalSet, switches, activeWires, netPos, netNeg);
        }

        // 5. Build Component Traversal Edges between Electrical Nets
        // Each edge represents traversing a component from netU to netV
        function buildEdges(allowOpenSwitches, allowReversePolarity) {
            const edges = [];
            (level.components || []).forEach((comp) => {
                if (comp.type === "battery" || comp.type === "transistor") return;

                if (comp.type === "resistor" || comp.type === "bulb" || comp.type === "capacitor") {
                    const n1 = uf.find(`${comp.id}:t1`);
                    const n2 = uf.find(`${comp.id}:t2`);
                    if (n1 !== n2) {
                        edges.push({ comp, fromNet: n1, toNet: n2, isReversed: false, isOpenSwitch: false });
                        edges.push({ comp, fromNet: n2, toNet: n1, isReversed: false, isOpenSwitch: false });
                    }
                } else if (comp.type === "ground") {
                    const n1 = uf.find(`${comp.id}:gnd`);
                    const n2 = uf.find(`${comp.id}:ret`);
                    if (n1 !== n2) {
                        edges.push({ comp, fromNet: n1, toNet: n2, isReversed: false, isOpenSwitch: false });
                        edges.push({ comp, fromNet: n2, toNet: n1, isReversed: false, isOpenSwitch: false });
                    }
                } else if (comp.type === "switch") {
                    const n1 = uf.find(`${comp.id}:in`);
                    const n2 = uf.find(`${comp.id}:out`);
                    const isClosed = Boolean(switches[comp.id]);
                    if (n1 !== n2 && (isClosed || allowOpenSwitches)) {
                        edges.push({ comp, fromNet: n1, toNet: n2, isReversed: false, isOpenSwitch: !isClosed });
                        edges.push({ comp, fromNet: n2, toNet: n1, isReversed: false, isOpenSwitch: !isClosed });
                    }
                } else if (comp.type === "led" || comp.type === "diode") {
                    const nAnode = uf.find(`${comp.id}:anode`);
                    const nCathode = uf.find(`${comp.id}:cathode`);
                    if (nAnode !== nCathode) {
                        edges.push({ comp, fromNet: nAnode, toNet: nCathode, isReversed: false, isOpenSwitch: false });
                        if (allowReversePolarity) {
                            edges.push({ comp, fromNet: nCathode, toNet: nAnode, isReversed: true, isOpenSwitch: false });
                        }
                    }
                } else if (comp.type === "buzzer") {
                    const nPos = uf.find(`${comp.id}:pos`);
                    const nNeg = uf.find(`${comp.id}:neg`);
                    if (nPos !== nNeg) {
                        edges.push({ comp, fromNet: nPos, toNet: nNeg, isReversed: false, isOpenSwitch: false });
                        if (allowReversePolarity) {
                            edges.push({ comp, fromNet: nNeg, toNet: nPos, isReversed: true, isOpenSwitch: false });
                        }
                    }
                }
            });
            return edges;
        }

        // Find all simple paths from netPos to netNeg given an edge set
        function findSimplePaths(edges) {
            const paths = [];
            function dfs(currentNet, visitedNets, visitedCompIds, steps) {
                if (currentNet === netNeg) {
                    paths.push(steps.slice());
                    return;
                }
                for (const edge of edges) {
                    if (edge.fromNet !== currentNet) continue;
                    if (visitedCompIds.has(edge.comp.id)) continue;
                    if (visitedNets.has(edge.toNet)) continue;

                    visitedNets.add(edge.toNet);
                    visitedCompIds.add(edge.comp.id);
                    steps.push(edge);
                    dfs(edge.toNet, visitedNets, visitedCompIds, steps);
                    steps.pop();
                    visitedCompIds.delete(edge.comp.id);
                    visitedNets.delete(edge.toNet);
                }
            }
            const startNets = new Set([netPos]);
            const startComps = new Set();
            dfs(netPos, startNets, startComps, []);
            return paths;
        }

        // 6. Check for unresisted Short Circuit path (only switches, ground, or diodes with no load/resistor)
        const diagnosticEdges = buildEdges(true, true);
        const allDiagnosticPaths = findSimplePaths(diagnosticEdges);

        for (const path of allDiagnosticPaths) {
            const hasAnyReversed = path.some((s) => s.isReversed);
            if (hasAnyReversed) continue;
            const hasLoadOrResistor = path.some(
                (s) => s.comp.type === "resistor" || s.comp.type === "led" || s.comp.type === "bulb" || s.comp.type === "buzzer"
            );
            if (!hasLoadOrResistor && path.length > 0) {
                return {
                    passed: false,
                    errorCode: "SHORT_CIRCUIT",
                    message: "A short circuit has been detected! Current flows from Battery (+) to Battery (−) without passing through any resistive load.",
                    energizedComponents: [],
                    energizedWires: [],
                    unnecessaryWiresCount: 0
                };
            }
        }

        // 7. If no paths exist even when ignoring polarity and switch state, the circuit loop is broken
        if (allDiagnosticPaths.length === 0) {
            return {
                passed: false,
                errorCode: "INCOMPLETE_CIRCUIT",
                message: "The circuit is incomplete. There is an open break in the wiring between Battery (+) and Battery (−).",
                energizedComponents: [],
                energizedWires: [],
                unnecessaryWiresCount: 0
            };
        }

        // 8. Check for Reversed Polarity on any path (LED, Diode, Buzzer)
        for (const path of allDiagnosticPaths) {
            const reversedStep = path.find((s) => s.isReversed);
            if (reversedStep) {
                const c = reversedStep.comp;
                if (c.type === "led") {
                    return {
                        passed: false,
                        errorCode: "REVERSED_POLARITY",
                        message: `The LED polarity is reversed on ${c.label}. Connect its Anode (+) toward the positive supply and Cathode (−) toward Battery (−).`,
                        energizedComponents: [],
                        energizedWires: [],
                        unnecessaryWiresCount: 0
                    };
                }
                if (c.type === "diode") {
                    return {
                        passed: false,
                        errorCode: "REVERSED_POLARITY",
                        message: `The diode polarity is reversed on ${c.label}. A diode only conducts from Anode (+) to Cathode (−).`,
                        energizedComponents: [],
                        energizedWires: [],
                        unnecessaryWiresCount: 0
                    };
                }
                if (c.type === "buzzer") {
                    return {
                        passed: false,
                        errorCode: "REVERSED_POLARITY",
                        message: `The buzzer polarity is reversed on ${c.label}. Connect POS (+) toward the positive supply and NEG (−) toward Battery (−).`,
                        energizedComponents: [],
                        energizedWires: [],
                        unnecessaryWiresCount: 0
                    };
                }
            }
        }

        // 9. Check Forward-Biased Paths for Missing or Wrong-Value LED Resistors
        const forwardPathsIgnoringSwitches = allDiagnosticPaths.filter((p) => !p.some((s) => s.isReversed));
        for (const path of forwardPathsIgnoringSwitches) {
            const ledsInPath = path.filter((s) => s.comp.type === "led");
            const resistorsInPath = path.filter((s) => s.comp.type === "resistor");

            if (ledsInPath.length > 0 && resistorsInPath.length === 0) {
                return {
                    passed: false,
                    errorCode: "MISSING_RESISTOR",
                    message: "A required resistor is missing! Every LED path must include a series current-limiting resistor to prevent LED damage.",
                    energizedComponents: [],
                    energizedWires: [],
                    unnecessaryWiresCount: 0
                };
            }

            // Check resistor value range if level specifies optimalResistorRange (e.g., Level 11)
            if (level.topology && level.topology.optimalResistorRange && ledsInPath.length > 0) {
                const totalOhms = resistorsInPath.reduce((sum, r) => sum + (r.comp.ohms || 330), 0);
                if (totalOhms < level.topology.optimalResistorRange.min) {
                    return {
                        passed: false,
                        errorCode: "WRONG_RESISTOR_VALUE",
                        message: `Resistor value too low (${totalOhms} Ω)! Excessive current would overload the LED. Use the 330 Ω resistor instead.`,
                        energizedComponents: [],
                        energizedWires: [],
                        unnecessaryWiresCount: 0
                    };
                }
                if (totalOhms > level.topology.optimalResistorRange.max) {
                    return {
                        passed: false,
                        errorCode: "WRONG_RESISTOR_VALUE",
                        message: `Resistor value too high (${totalOhms >= 1000 ? totalOhms / 1000 + " kΩ" : totalOhms + " Ω"})! Current is too weak to illuminate the LED. Use the 330 Ω resistor.`,
                        energizedComponents: [],
                        energizedWires: [],
                        unnecessaryWiresCount: 0
                    };
                }
            }
        }

        // 10. Check for Open Switches blocking the circuit
        const requiredSwitches = (level.topology && level.topology.requiredClosedSwitches) || [];
        for (const swId of requiredSwitches) {
            const swComp = compMap[swId];
            // First check if the switch is actually wired into the circuit path
            const swUsedInForwardPath = forwardPathsIgnoringSwitches.some((p) => p.some((s) => s.comp.id === swId));
            if (swUsedInForwardPath && !switches[swId]) {
                return {
                    passed: false,
                    errorCode: "OPEN_SWITCH",
                    message: `The switch (${swComp ? swComp.label : swId}) is currently open. Toggle the switch CLOSED so current can flow.`,
                    energizedComponents: [],
                    energizedWires: [],
                    unnecessaryWiresCount: 0
                };
            }
        }

        // 11. Now evaluate Active Conducting Paths (with switches in their actual state and forward polarity only)
        const activeEdges = buildEdges(false, false);
        const activePaths = findSimplePaths(activeEdges);

        if (activePaths.length === 0) {
            return {
                passed: false,
                errorCode: "INCOMPLETE_CIRCUIT",
                message: "The circuit is incomplete or a switch is open. Verify all connections and switches.",
                energizedComponents: [],
                energizedWires: [],
                unnecessaryWiresCount: 0
            };
        }

        // Gather all components that are traversed on active conducting paths
        const activeCompIds = new Set([battery.id]);
        activePaths.forEach((path) => {
            path.forEach((step) => {
                activeCompIds.add(step.comp.id);
            });
        });

        // 12. Check that all Required Components for this level are included in the active paths
        const requiredComps = (level.topology && level.topology.requiredComponents) || [];
        for (const reqId of requiredComps) {
            if (!activeCompIds.has(reqId)) {
                const missingComp = compMap[reqId];
                return {
                    passed: false,
                    errorCode: "MISSING_COMPONENT",
                    message: `The circuit is incomplete. ${missingComp ? missingComp.label : reqId} is not connected in an active path from Battery (+) to Battery (−).`,
                    energizedComponents: [],
                    energizedWires: [],
                    unnecessaryWiresCount: 0
                };
            }
        }

        // 13. Check Level-Specific Topology Modes (strict_series vs parallel_branches)
        const mode = level.topology ? level.topology.mode : "any_valid";

        if (mode === "strict_series") {
            const seriesLoads = level.topology.seriesLoads || [];
            // All seriesLoads must appear together on the same active path, and no active path may bypass any of them
            const allPathsContainAllSeriesLoads = activePaths.every((path) => {
                const pathIds = new Set(path.map((s) => s.comp.id));
                return seriesLoads.every((id) => pathIds.has(id));
            });

            if (!allPathsContainAllSeriesLoads) {
                return {
                    passed: false,
                    errorCode: "TOPOLOGY_MISMATCH",
                    message: "These components must be wired in series (one after another in a single loop) so the same current passes through each of them.",
                    energizedComponents: [],
                    energizedWires: [],
                    unnecessaryWiresCount: 0
                };
            }
        }

        if (mode === "parallel_branches") {
            const groups = level.topology.parallelGroups || [];
            // Each group must have at least one active path that contains all members of that group
            // AND does NOT contain members of the other parallel groups
            for (let i = 0; i < groups.length; i++) {
                const groupA = groups[i];
                const otherGroupIds = new Set();
                groups.forEach((g, idx) => {
                    if (idx !== i) {
                        g.forEach((id) => otherGroupIds.add(id));
                    }
                });

                const hasIndependentBranch = activePaths.some((path) => {
                    const pathIds = new Set(path.map((s) => s.comp.id));
                    const hasAllGroupA = groupA.every((id) => pathIds.has(id));
                    const hasAnyOther = Array.from(otherGroupIds).some((id) => pathIds.has(id));
                    return hasAllGroupA && !hasAnyOther;
                });

                if (!hasIndependentBranch) {
                    return {
                        passed: false,
                        errorCode: "TOPOLOGY_MISMATCH",
                        message: "The outputs are wired in series instead of independent parallel branches. Connect each branch separately across the supply path.",
                        energizedComponents: [],
                        energizedWires: [],
                        unnecessaryWiresCount: 0
                    };
                }
            }
        }

        // 14. Check for any decoy components connected into active paths
        for (const comp of level.components || []) {
            if (comp.isDecoy && activeCompIds.has(comp.id)) {
                return {
                    passed: false,
                    errorCode: "DECOY_CONNECTED",
                    message: `${comp.label} should not be part of the active circuit. Disconnect it and use only the appropriate components.`,
                    energizedComponents: [],
                    energizedWires: [],
                    unnecessaryWiresCount: 1
                };
            }
        }

        // 15. Count unnecessary wires (wires attached to decoy components or dead-end terminals not in activeCompIds)
        let unnecessaryWiresCount = 0;
        const energizedWires = [];
        activeWires.forEach((w, idx) => {
            const from = Array.isArray(w) ? w[0] : w.from;
            const to = Array.isArray(w) ? w[1] : w.to;
            const compA = String(from).split(":")[0];
            const compB = String(to).split(":")[0];
            if (activeCompIds.has(compA) && activeCompIds.has(compB)) {
                energizedWires.push(idx);
            } else {
                unnecessaryWiresCount += 1;
            }
        });

        return {
            passed: true,
            errorCode: null,
            message: "Power is flowing correctly. Your system is working!",
            energizedComponents: Array.from(activeCompIds),
            energizedWires,
            unnecessaryWiresCount
        };
    }

    /**
     * Specialized validator for Level 13 (NPN Transistor Switch).
     * Checks Base control loop (BAT1+ -> SW1 -> R_BASE -> Q1:B, Q1:E -> BAT1-)
     * and Collector load loop (BAT1+ -> R_LOAD -> LED1 -> Q1:C, Q1:E -> BAT1-).
     */
    function validateTransistorCircuit(level, compMap, uf, connectedTerminalSet, switches, activeWires, netPos, netNeg) {
        const cfg = level.topology.transistorConfig;
        const qId = cfg.transistorId;
        const rBaseId = cfg.baseResistorId;
        const rLoadId = cfg.loadResistorId;
        const ledId = cfg.loadId;
        const swId = cfg.switchId;

        const netQBase = uf.find(`${qId}:b`);
        const netQCol = uf.find(`${qId}:c`);
        const netQEmit = uf.find(`${qId}:e`);

        // 1. Emitter must return to Battery (-)
        if (netQEmit !== netNeg) {
            return {
                passed: false,
                errorCode: "TRANSISTOR_EMITTER_OPEN",
                message: "Transistor Emitter (E) is not connected to Battery (−). Connect Q1 Emitter (E) to the negative return rail.",
                energizedComponents: [],
                energizedWires: [],
                unnecessaryWiresCount: 0
            };
        }

        // 2. Check LED polarity and Collector connection
        const netLedAnode = uf.find(`${ledId}:anode`);
        const netLedCathode = uf.find(`${ledId}:cathode`);
        const netRLoad1 = uf.find(`${rLoadId}:t1`);
        const netRLoad2 = uf.find(`${rLoadId}:t2`);

        // Check if LED is reversed (Cathode connected toward Battery + or R_LOAD while Anode is at Collector)
        if (netLedAnode === netQCol || netLedCathode === netPos) {
            return {
                passed: false,
                errorCode: "REVERSED_POLARITY",
                message: "The LED polarity is reversed in the Collector load path. Connect LED1 Anode (+) toward R_LOAD (330 Ω) and Cathode (−) to Q1 Collector (C).",
                energizedComponents: [],
                energizedWires: [],
                unnecessaryWiresCount: 0
            };
        }

        // Verify Collector path: BAT1+ -> R_LOAD -> LED1 -> Q1:C (or BAT1+ -> LED1 -> R_LOAD -> Q1:C)
        const loadOrderA =
            ((netRLoad1 === netPos && netRLoad2 === netLedAnode) || (netRLoad2 === netPos && netRLoad1 === netLedAnode)) &&
            netLedCathode === netQCol;
        const loadOrderB =
            netLedAnode === netPos &&
            ((netLedCathode === netRLoad1 && netRLoad2 === netQCol) || (netLedCathode === netRLoad2 && netRLoad1 === netQCol));

        if (!loadOrderA && !loadOrderB) {
            // Check if LED was wired to Collector without R_LOAD
            if (netLedAnode === netPos && netLedCathode === netQCol) {
                return {
                    passed: false,
                    errorCode: "MISSING_RESISTOR",
                    message: "A required resistor is missing! Connect R_LOAD (330 Ω) in series with LED1 between Battery (+) and Q1 Collector (C).",
                    energizedComponents: [],
                    energizedWires: [],
                    unnecessaryWiresCount: 0
                };
            }
            return {
                passed: false,
                errorCode: "INCOMPLETE_COLLECTOR_PATH",
                message: "The Collector load path is incomplete. Connect Battery (+) → R_LOAD (330 Ω) → LED1 Anode (+), and LED1 Cathode (−) → Q1 Collector (C).",
                energizedComponents: [],
                energizedWires: [],
                unnecessaryWiresCount: 0
            };
        }

        // 3. Verify Base control path: BAT1+ -> SW1 -> R_BASE (10 kΩ) -> Q1:B
        const netSwIn = uf.find(`${swId}:in`);
        const netSwOut = uf.find(`${swId}:out`);
        const netRBase1 = uf.find(`${rBaseId}:t1`);
        const netRBase2 = uf.find(`${rBaseId}:t2`);

        // Allow BAT1+ -> SW1 -> R_BASE -> Q1:B OR BAT1+ -> R_BASE -> SW1 -> Q1:B
        const swAtPos = (netSwIn === netPos ? netSwOut : netSwOut === netPos ? netSwIn : null);
        const rBaseFromSw =
            swAtPos !== null &&
            ((netRBase1 === swAtPos && netRBase2 === netQBase) || (netRBase2 === swAtPos && netRBase1 === netQBase));

        const rBaseAtPos = (netRBase1 === netPos ? netRBase2 : netRBase2 === netPos ? netRBase1 : null);
        const swFromRBase =
            rBaseAtPos !== null &&
            ((netSwIn === rBaseAtPos && netSwOut === netQBase) || (netSwOut === rBaseAtPos && netSwIn === netQBase));

        if (!rBaseFromSw && !swFromRBase) {
            return {
                passed: false,
                errorCode: "INCOMPLETE_BASE_PATH",
                message: "The Transistor Base (B) control path is incomplete. Connect Battery (+) → SW1 → R_BASE (10 kΩ) → Q1 Base (B).",
                energizedComponents: [],
                energizedWires: [],
                unnecessaryWiresCount: 0
            };
        }

        // 4. Check if SW1 is open
        if (!switches[swId]) {
            return {
                passed: false,
                errorCode: "OPEN_SWITCH",
                message: "The Base Trigger Switch (SW1) is currently open. Toggle SW1 CLOSED to supply base current to Q1.",
                energizedComponents: [],
                energizedWires: [],
                unnecessaryWiresCount: 0
            };
        }

        const energizedComponents = ["bat1", swId, rBaseId, rLoadId, ledId, qId];
        const energizedWires = activeWires.map((_, i) => i);

        return {
            passed: true,
            errorCode: null,
            message: "Power is flowing correctly. Base current saturates Q1, switching on the Collector LED load!",
            energizedComponents,
            energizedWires,
            unnecessaryWiresCount: 0
        };
    }

    return {
        validateCircuit,
        getAllTerminalIds
    };
})();
