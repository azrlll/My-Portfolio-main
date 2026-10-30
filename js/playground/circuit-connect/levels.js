// ============================================================================
// CIRCUIT CONNECT — ALL 15 PROGRESSIVE ELECTRONICS PUZZLE LEVELS
// Divided into Beginner (1–5), Intermediate (6–10), and Advanced (11–15).
// Every level defines real components, terminals, hints, topology rules,
// educational explanations, and a verified canonical solution.
// ============================================================================

window.CIRCUIT_CONNECT_LEVELS = [
    // ========================================================================
    // BEGINNER — LEVELS 1–5
    // ========================================================================
    {
        id: 1,
        code: "LEVEL 01",
        name: "Light It Up",
        difficulty: "Beginner",
        objective: "Connect the 9V Battery, 330 Ω Resistor, and Red LED in a single closed loop to safely illuminate the LED.",
        description: "An LED requires a complete closed path from Battery (+) to Battery (−), with a series resistor to limit current and the LED oriented in forward bias.",
        educationalExplanation: "In a simple DC LED circuit, conventional current flows from the Battery (+) terminal, through the 330 Ω current-limiting resistor, into the LED's Anode (+), out of its Cathode (−), and back to Battery (−). The 330 Ω resistor drops the excess voltage so the LED receives ~20 mA safely.",
        hints: [
            "The LED needs a complete electrical loop starting at Battery (+) and returning to Battery (−).",
            "A 330 Ω resistor must be connected in series with the LED so it doesn't receive excessive current.",
            "Check the LED's polarity: connect the Anode (+) toward the positive battery path and the Cathode (−) toward Battery (−)."
        ],
        components: [
            { id: "bat1", type: "battery", label: "BAT1 • 9V DC", spec: "9V Supply", row: 2, col: 1 },
            { id: "res1", type: "resistor", label: "R1 • 330 Ω", spec: "330 Ω", ohms: 330, row: 1, col: 2 },
            { id: "led1", type: "led", label: "LED1 • Red", spec: "2.0V / 20mA", row: 2, col: 3 }
        ],
        initialWires: [],
        topology: {
            mode: "single_loop",
            requiredComponents: ["bat1", "res1", "led1"],
            ledsRequiringResistor: ["led1"]
        },
        sampleSolution: {
            wires: [
                ["bat1:pos", "res1:t1"],
                ["res1:t2", "led1:anode"],
                ["led1:cathode", "bat1:neg"]
            ],
            switches: {}
        }
    },

    {
        id: 2,
        code: "LEVEL 02",
        name: "Complete the Loop",
        difficulty: "Beginner",
        objective: "Connect the 9V Battery, SPST Switch, 330 Ω Resistor, and Red LED in series, and ensure the switch is CLOSED.",
        description: "Adding a single-pole single-throw (SPST) switch lets you control when current flows through the LED loop.",
        educationalExplanation: "A series switch acts as a controllable gate in the circuit loop. When the switch contacts are OPEN, no current can flow; when toggled CLOSED, the circuit loop completes and the LED illuminates.",
        hints: [
            "Wire the Battery, Switch, 330 Ω Resistor, and LED one after another in a single continuous loop.",
            "Make sure the LED's Anode (+) faces the positive supply side and its Cathode (−) returns to Battery (−).",
            "Don't forget to click the SPST Switch to toggle it from OPEN to CLOSED before pressing TEST CIRCUIT!"
        ],
        components: [
            { id: "bat1", type: "battery", label: "BAT1 • 9V DC", spec: "9V Supply", row: 2, col: 1 },
            { id: "sw1", type: "switch", label: "SW1 • Power Switch", spec: "SPST Toggle", initialSwitchClosed: false, row: 1, col: 1 },
            { id: "res1", type: "resistor", label: "R1 • 330 Ω", spec: "330 Ω", ohms: 330, row: 1, col: 3 },
            { id: "led1", type: "led", label: "LED1 • Green", spec: "2.1V / 20mA", row: 2, col: 3 }
        ],
        initialWires: [],
        topology: {
            mode: "single_loop",
            requiredComponents: ["bat1", "sw1", "res1", "led1"],
            ledsRequiringResistor: ["led1"],
            requiredClosedSwitches: ["sw1"]
        },
        sampleSolution: {
            wires: [
                ["bat1:pos", "sw1:in"],
                ["sw1:out", "res1:t1"],
                ["res1:t2", "led1:anode"],
                ["led1:cathode", "bat1:neg"]
            ],
            switches: { sw1: true }
        }
    },

    {
        id: 3,
        code: "LEVEL 03",
        name: "Two Lights",
        difficulty: "Beginner",
        objective: "Power both LED1 and LED2 in a working circuit with the provided current-limiting resistors.",
        description: "Connect two LEDs and two 330 Ω resistors to the 9V Battery so both LEDs receive forward current.",
        educationalExplanation: "Multiple LEDs can operate from a 9V source either in a series loop or in separate branches as long as each LED path has proper current limiting and both LEDs are forward-biased (Anode + toward positive, Cathode − toward negative).",
        hints: [
            "Both LED1 and LED2 must have their Anode (+) oriented toward the Battery (+) path and Cathode (−) toward Battery (−).",
            "Include both R1 and R2 in your circuit so every LED path has current-limiting resistance.",
            "You can wire BAT1 (+) → R1 → LED1 → R2 → LED2 → BAT1 (−) in one loop, or create two branches."
        ],
        components: [
            { id: "bat1", type: "battery", label: "BAT1 • 9V DC", spec: "9V Supply", row: 2, col: 1 },
            { id: "res1", type: "resistor", label: "R1 • 330 Ω", spec: "330 Ω", ohms: 330, row: 1, col: 2 },
            { id: "led1", type: "led", label: "LED1 • Amber", spec: "2.0V / 20mA", row: 1, col: 3 },
            { id: "res2", type: "resistor", label: "R2 • 330 Ω", spec: "330 Ω", ohms: 330, row: 3, col: 2 },
            { id: "led2", type: "led", label: "LED2 • Amber", spec: "2.0V / 20mA", row: 3, col: 3 }
        ],
        initialWires: [],
        topology: {
            mode: "any_valid",
            requiredComponents: ["bat1", "res1", "led1", "res2", "led2"],
            ledsRequiringResistor: ["led1", "led2"]
        },
        sampleSolution: {
            wires: [
                ["bat1:pos", "res1:t1"],
                ["res1:t2", "led1:anode"],
                ["led1:cathode", "res2:t1"],
                ["res2:t2", "led2:anode"],
                ["led2:cathode", "bat1:neg"]
            ],
            switches: {}
        }
    },

    {
        id: 4,
        code: "LEVEL 04",
        name: "The Buzzer",
        difficulty: "Beginner",
        objective: "Connect the 9V Battery, SPST Switch, and Polarized Piezo Buzzer to build an audible signaling circuit.",
        description: "Active piezo buzzers contain an internal oscillator circuit and are polarized: POS (+) must connect to the positive supply side and NEG (−) to negative.",
        educationalExplanation: "Unlike a simple speaker coil, an active DC piezo buzzer has built-in drive electronics and requires correct DC polarity. Closing the switch applies 9V across POS (+) and NEG (−), sounding the buzzer.",
        hints: [
            "Connect Battery (+), the Switch, and the Buzzer in a closed loop returning to Battery (−).",
            "Check the Buzzer terminals: POS (+) must face the Battery (+) side, and NEG (−) must return to Battery (−).",
            "Make sure SW1 is toggled CLOSED before testing the circuit."
        ],
        components: [
            { id: "bat1", type: "battery", label: "BAT1 • 9V DC", spec: "9V Supply", row: 2, col: 1 },
            { id: "sw1", type: "switch", label: "SW1 • Bell Switch", spec: "SPST Toggle", initialSwitchClosed: false, row: 1, col: 2 },
            { id: "buz1", type: "buzzer", label: "BUZ1 • Piezo Buzzer", spec: "9V Active Tone", row: 2, col: 3 }
        ],
        initialWires: [],
        topology: {
            mode: "single_loop",
            requiredComponents: ["bat1", "sw1", "buz1"],
            ledsRequiringResistor: [],
            requiredClosedSwitches: ["sw1"]
        },
        sampleSolution: {
            wires: [
                ["bat1:pos", "sw1:in"],
                ["sw1:out", "buz1:pos"],
                ["buz1:neg", "bat1:neg"]
            ],
            switches: { sw1: true }
        }
    },

    {
        id: 5,
        code: "LEVEL 05",
        name: "Series Circuit",
        difficulty: "Beginner",
        objective: "Complete a single-loop series circuit connecting the 12V Battery, Switch, Lamp 1, Lamp 2, and Ground Reference.",
        description: "In a series circuit, the exact same current flows sequentially through every component in a single path.",
        educationalExplanation: "In a series lamp circuit, current leaves Battery (+), passes through the closed switch, flows through Lamp 1 and Lamp 2 sequentially, and returns via the Ground Reference node to Battery (−). Because there is only one path, the switch controls the entire loop.",
        hints: [
            "All five components must be connected in one single chain (series loop), not in separate parallel branches.",
            "Include the Ground Reference (GND / RET) on the return path back to Battery (−).",
            "Ensure SW1 is toggled CLOSED so current can flow through both indicator lamps."
        ],
        components: [
            { id: "bat1", type: "battery", label: "BAT1 • 12V DC", spec: "12V Supply", row: 2, col: 1 },
            { id: "sw1", type: "switch", label: "SW1 • Series Switch", spec: "SPST Toggle", initialSwitchClosed: true, row: 1, col: 1 },
            { id: "bulb1", type: "bulb", label: "LAMP1 • Indicator A", spec: "6V / 100mA", row: 1, col: 2 },
            { id: "bulb2", type: "bulb", label: "LAMP2 • Indicator B", spec: "6V / 100mA", row: 1, col: 3 },
            { id: "gnd1", type: "ground", label: "GND1 • 0V Return", spec: "Chassis Ground", row: 3, col: 2 }
        ],
        initialWires: [],
        topology: {
            mode: "strict_series",
            requiredComponents: ["bat1", "sw1", "bulb1", "bulb2", "gnd1"],
            seriesLoads: ["bulb1", "bulb2"],
            ledsRequiringResistor: [],
            requiredClosedSwitches: ["sw1"]
        },
        sampleSolution: {
            wires: [
                ["bat1:pos", "sw1:in"],
                ["sw1:out", "bulb1:t1"],
                ["bulb1:t2", "bulb2:t1"],
                ["bulb2:t2", "gnd1:gnd"],
                ["gnd1:ret", "bat1:neg"]
            ],
            switches: { sw1: true }
        }
    },

    // ========================================================================
    // INTERMEDIATE — LEVELS 6–10
    // ========================================================================
    {
        id: 6,
        code: "LEVEL 06",
        name: "Parallel Lighting",
        difficulty: "Intermediate",
        objective: "Create two independent parallel LED branches (R1 + LED1 in Branch A, and R2 + LED2 in Branch B) powered by the 9V Battery.",
        description: "Unlike a series loop, parallel branches each receive the full 9V supply voltage independently.",
        educationalExplanation: "In a parallel LED circuit, both branches connect across the 9V supply rails. Branch 1 uses R1 to limit current for LED1, and Branch 2 uses R2 to limit current for LED2. Each branch operates independently at full brightness.",
        hints: [
            "Do NOT wire LED1 and LED2 in a single chain! Each LED needs its own independent branch from Battery (+) to Battery (−).",
            "Branch 1: Connect Battery (+) → R1 → LED1 (Anode to Cathode) → Battery (−).",
            "Branch 2: Connect Battery (+) → R2 → LED2 (Anode to Cathode) → Battery (−)."
        ],
        components: [
            { id: "bat1", type: "battery", label: "BAT1 • 9V DC", spec: "9V Supply", row: 2, col: 1 },
            { id: "res1", type: "resistor", label: "R1 • 330 Ω (Branch A)", spec: "330 Ω", ohms: 330, row: 1, col: 2 },
            { id: "led1", type: "led", label: "LED1 • Branch A", spec: "Red 2.0V", row: 1, col: 3 },
            { id: "res2", type: "resistor", label: "R2 • 330 Ω (Branch B)", spec: "330 Ω", ohms: 330, row: 3, col: 2 },
            { id: "led2", type: "led", label: "LED2 • Branch B", spec: "Red 2.0V", row: 3, col: 3 }
        ],
        initialWires: [],
        topology: {
            mode: "parallel_branches",
            requiredComponents: ["bat1", "res1", "led1", "res2", "led2"],
            ledsRequiringResistor: ["led1", "led2"],
            parallelGroups: [
                ["res1", "led1"],
                ["res2", "led2"]
            ]
        },
        sampleSolution: {
            wires: [
                ["bat1:pos", "res1:t1"],
                ["res1:t2", "led1:anode"],
                ["led1:cathode", "bat1:neg"],
                ["bat1:pos", "res2:t1"],
                ["res2:t2", "led2:anode"],
                ["led2:cathode", "bat1:neg"]
            ],
            switches: {}
        }
    },

    {
        id: 7,
        code: "LEVEL 07",
        name: "Switch Control",
        difficulty: "Intermediate",
        objective: "Use the Master Switch (SW1) to control power to both the Indicator Lamp (LAMP1) and the Status LED branch (R1 + LED1).",
        description: "Wire SW1 in the main supply path so that closing SW1 powers both the lamp and the resistor-protected LED.",
        educationalExplanation: "Placing a master switch directly after the Battery (+) terminal allows a single switch to energize or cut power to multiple downstream loads simultaneously.",
        hints: [
            "Connect Battery (+) to SW1 (IN), then distribute power from SW1 (OUT) to your loads.",
            "Make sure LED1 has R1 (330 Ω) in series with it and its Anode (+) faces the positive supply.",
            "Close SW1 before clicking TEST CIRCUIT."
        ],
        components: [
            { id: "bat1", type: "battery", label: "BAT1 • 9V DC", spec: "9V Supply", row: 2, col: 1 },
            { id: "sw1", type: "switch", label: "SW1 • Master Switch", spec: "SPST Toggle", initialSwitchClosed: false, row: 1, col: 1 },
            { id: "bulb1", type: "bulb", label: "LAMP1 • Work Light", spec: "9V Lamp", row: 1, col: 3 },
            { id: "res1", type: "resistor", label: "R1 • 330 Ω", spec: "330 Ω", ohms: 330, row: 3, col: 2 },
            { id: "led1", type: "led", label: "LED1 • Status LED", spec: "Green 2.1V", row: 3, col: 3 }
        ],
        initialWires: [],
        topology: {
            mode: "master_switch",
            requiredComponents: ["bat1", "sw1", "bulb1", "res1", "led1"],
            ledsRequiringResistor: ["led1"],
            requiredClosedSwitches: ["sw1"],
            masterSwitchId: "sw1"
        },
        sampleSolution: {
            wires: [
                ["bat1:pos", "sw1:in"],
                ["sw1:out", "bulb1:t1"],
                ["bulb1:t2", "bat1:neg"],
                ["sw1:out", "res1:t1"],
                ["res1:t2", "led1:anode"],
                ["led1:cathode", "bat1:neg"]
            ],
            switches: { sw1: true }
        }
    },

    {
        id: 8,
        code: "LEVEL 08",
        name: "Polarity Challenge",
        difficulty: "Intermediate",
        objective: "Connect the 9V Battery, Silicon Protection Diode (D1), 330 Ω Resistor (R1), LED1, and Buzzer (BUZ1) with every polarized component oriented correctly.",
        description: "Three components in this circuit are polarized: D1 (Anode → Cathode), LED1 (Anode → Cathode), and BUZ1 (POS → NEG).",
        educationalExplanation: "Polarized components only operate properly when current enters their positive/anode terminal and exits their negative/cathode terminal. A series silicon diode (1N4007) is frequently added at the power input for reverse-polarity protection.",
        hints: [
            "Current leaves Battery (+) and must enter Anode (+) on D1 and LED1, and POS (+) on BUZ1.",
            "R1 (330 Ω) must be in series with LED1 to limit current.",
            "Double-check that none of the three polarized parts (D1, LED1, BUZ1) have their negative/cathode terminal facing Battery (+)."
        ],
        components: [
            { id: "bat1", type: "battery", label: "BAT1 • 9V DC", spec: "9V Supply", row: 2, col: 1 },
            { id: "diode1", type: "diode", label: "D1 • 1N4007 Diode", spec: "Reverse Prot.", row: 1, col: 1 },
            { id: "res1", type: "resistor", label: "R1 • 330 Ω", spec: "330 Ω", ohms: 330, row: 1, col: 2 },
            { id: "led1", type: "led", label: "LED1 • Polarized LED", spec: "Red 2.0V", row: 1, col: 3 },
            { id: "buz1", type: "buzzer", label: "BUZ1 • Polarized Buzzer", spec: "DC Buzzer", row: 3, col: 3 }
        ],
        initialWires: [],
        topology: {
            mode: "any_valid",
            requiredComponents: ["bat1", "diode1", "res1", "led1", "buz1"],
            ledsRequiringResistor: ["led1"]
        },
        sampleSolution: {
            wires: [
                ["bat1:pos", "diode1:anode"],
                ["diode1:cathode", "res1:t1"],
                ["res1:t2", "led1:anode"],
                ["led1:cathode", "buz1:pos"],
                ["buz1:neg", "bat1:neg"]
            ],
            switches: {}
        }
    },

    {
        id: 9,
        code: "LEVEL 09",
        name: "Circuit Repair",
        difficulty: "Intermediate",
        objective: "Inspect the pre-wired circuit, remove the faulty connections causing a short and reversed LED polarity, and rewire it so the circuit works.",
        description: "A previous technician left a faulty wire across the battery path and wired the LED backwards. Click faulty wires to remove them and complete the repair.",
        educationalExplanation: "Troubleshooting existing wiring requires tracing the schematic loop from source (+) to return (−), eliminating any direct shorts that bypass the load, and verifying that polarized LEDs have their Anode (+) connected to the resistor output.",
        hints: [
            "Look at the existing wires list in the right panel or click directly on a wire on the board to remove faulty wires.",
            "The wire connecting R1 directly back to Battery (−) bypasses the LED, and the LED's Cathode (−) is wired backward.",
            "Correct path: BAT1 (+) → SW1 → R1 → LED1 Anode (+), and LED1 Cathode (−) → BAT1 (−)."
        ],
        components: [
            { id: "bat1", type: "battery", label: "BAT1 • 9V DC", spec: "9V Supply", row: 2, col: 1 },
            { id: "sw1", type: "switch", label: "SW1 • Control Switch", spec: "SPST Toggle", initialSwitchClosed: true, row: 1, col: 1 },
            { id: "res1", type: "resistor", label: "R1 • 330 Ω", spec: "330 Ω", ohms: 330, row: 1, col: 2 },
            { id: "led1", type: "led", label: "LED1 • Faulty Branch", spec: "Red 2.0V", row: 2, col: 3 }
        ],
        initialWires: [
            ["bat1:pos", "sw1:in"],
            ["sw1:out", "res1:t1"],
            ["res1:t2", "led1:cathode"],
            ["res1:t1", "bat1:neg"]
        ],
        topology: {
            mode: "single_loop",
            requiredComponents: ["bat1", "sw1", "res1", "led1"],
            ledsRequiringResistor: ["led1"],
            requiredClosedSwitches: ["sw1"]
        },
        sampleSolution: {
            wires: [
                ["bat1:pos", "sw1:in"],
                ["sw1:out", "res1:t1"],
                ["res1:t2", "led1:anode"],
                ["led1:cathode", "bat1:neg"]
            ],
            switches: { sw1: true }
        }
    },

    {
        id: 10,
        code: "LEVEL 10",
        name: "Dual Output System",
        difficulty: "Intermediate",
        objective: "Build a switched dual-output alert system with two parallel output branches: Branch A (R1 + LED1) and Branch B (BUZ1), both controlled by SW1.",
        description: "When the master switch closes, both the visual indicator (LED1 via R1) and the audio alarm (BUZ1) must activate in parallel.",
        educationalExplanation: "Industrial alarm panels place visual and audible indicators in parallel branches downstream of a master trigger switch so both outputs receive full operating voltage simultaneously.",
        hints: [
            "Route Battery (+) into SW1 (IN). Then connect SW1 (OUT) to both Branch A (R1 → LED1) and Branch B (BUZ1 POS +).",
            "Do not put BUZ1 in series with R1 and LED1—wire them as two separate parallel branches after SW1 (OUT).",
            "Return both LED1 Cathode (−) and BUZ1 NEG (−) to Battery (−)."
        ],
        components: [
            { id: "bat1", type: "battery", label: "BAT1 • 9V DC", spec: "9V Supply", row: 2, col: 1 },
            { id: "sw1", type: "switch", label: "SW1 • Alarm Trigger", spec: "SPST Toggle", initialSwitchClosed: true, row: 1, col: 1 },
            { id: "res1", type: "resistor", label: "R1 • 330 Ω", spec: "330 Ω", ohms: 330, row: 1, col: 2 },
            { id: "led1", type: "led", label: "LED1 • Visual Strobe", spec: "Red 2.0V", row: 1, col: 3 },
            { id: "buz1", type: "buzzer", label: "BUZ1 • Audio Siren", spec: "9V Buzzer", row: 3, col: 3 }
        ],
        initialWires: [],
        topology: {
            mode: "parallel_branches",
            requiredComponents: ["bat1", "sw1", "res1", "led1", "buz1"],
            ledsRequiringResistor: ["led1"],
            requiredClosedSwitches: ["sw1"],
            parallelGroups: [
                ["res1", "led1"],
                ["buz1"]
            ]
        },
        sampleSolution: {
            wires: [
                ["bat1:pos", "sw1:in"],
                ["sw1:out", "res1:t1"],
                ["res1:t2", "led1:anode"],
                ["led1:cathode", "bat1:neg"],
                ["sw1:out", "buz1:pos"],
                ["buz1:neg", "bat1:neg"]
            ],
            switches: { sw1: true }
        }
    },

    // ========================================================================
    // ADVANCED — LEVELS 11–15
    // ========================================================================
    {
        id: 11,
        code: "LEVEL 11",
        name: "Resistor Challenge",
        difficulty: "Advanced",
        objective: "Three resistors are on the board (10 Ω, 330 Ω, and 100 kΩ). Select and wire ONLY the appropriate resistor in series with the 9V Battery and 2V / 20mA LED.",
        description: "Use Ohm's Law: R = (Vs − Vf) / I = (9V − 2V) / 0.02A = 350 Ω. Choose the closest standard resistor value and leave the other two resistors unconnected.",
        educationalExplanation: "By Ohm's Law, dropping 7V at ~20 mA requires ~350 Ω, making the 330 Ω resistor (~21.2 mA) the correct choice. A 10 Ω resistor would allow ~700 mA (destroying the LED), while a 100 kΩ resistor limits current to just 0.07 mA (leaving the LED dark).",
        hints: [
            "Apply Ohm's Law: with a 9V supply and a 2V LED drop, 7V must be dropped across the resistor at ~20 mA.",
            "10 Ω is dangerously low and 100 kΩ is far too high. Only connect R2 (330 Ω) in your circuit.",
            "Leave R1 (10 Ω) and R3 (100 kΩ) completely unconnected so you don't incur unnecessary connection penalties."
        ],
        components: [
            { id: "bat1", type: "battery", label: "BAT1 • 9V DC", spec: "9V Supply", row: 2, col: 1 },
            { id: "res_low", type: "resistor", label: "R1 • 10 Ω", spec: "10 Ω (Too Low)", ohms: 10, isDecoy: true, row: 1, col: 2 },
            { id: "res_ok", type: "resistor", label: "R2 • 330 Ω", spec: "330 Ω (Optimal)", ohms: 330, row: 2, col: 2 },
            { id: "res_high", type: "resistor", label: "R3 • 100 kΩ", spec: "100 kΩ (Too High)", ohms: 100000, isDecoy: true, row: 3, col: 2 },
            { id: "led1", type: "led", label: "LED1 • Target Load", spec: "2.0V / 20mA", row: 2, col: 3 }
        ],
        initialWires: [],
        topology: {
            mode: "single_loop",
            requiredComponents: ["bat1", "res_ok", "led1"],
            ledsRequiringResistor: ["led1"],
            optimalResistorRange: { min: 150, max: 1000 }
        },
        sampleSolution: {
            wires: [
                ["bat1:pos", "res_ok:t1"],
                ["res_ok:t2", "led1:anode"],
                ["led1:cathode", "bat1:neg"]
            ],
            switches: {}
        }
    },

    {
        id: 12,
        code: "LEVEL 12",
        name: "Diode Direction",
        difficulty: "Advanced",
        objective: "Complete the protected indicator circuit using the Silicon Diode (D1), Switch (SW1), 330 Ω Resistor (R1), LED1, and Ground Reference (GND1).",
        description: "A silicon rectifier diode acts as a one-way check valve for current: it conducts only when Anode (+) is at a higher potential than Cathode (−).",
        educationalExplanation: "When D1 is forward-biased (Anode toward Battery +, Cathode toward the load), it drops ~0.7V and conducts current to R1 and LED1. If D1 is reversed, it blocks current completely and protects downstream electronics from reverse voltage.",
        hints: [
            "Current must enter D1 at its Anode (+) and exit from its Cathode (−).",
            "Ensure LED1 is also forward-biased (Anode + toward R1, Cathode − toward Ground Reference).",
            "Connect GND1 between the negative side of the load and Battery (−), and close SW1."
        ],
        components: [
            { id: "bat1", type: "battery", label: "BAT1 • 9V DC", spec: "9V Supply", row: 2, col: 1 },
            { id: "sw1", type: "switch", label: "SW1 • Power Switch", spec: "SPST Toggle", initialSwitchClosed: true, row: 1, col: 1 },
            { id: "diode1", type: "diode", label: "D1 • 1N4007 Diode", spec: "Silicon Diode", row: 1, col: 2 },
            { id: "res1", type: "resistor", label: "R1 • 330 Ω", spec: "330 Ω", ohms: 330, row: 1, col: 3 },
            { id: "led1", type: "led", label: "LED1 • Load LED", spec: "Red 2.0V", row: 2, col: 3 },
            { id: "gnd1", type: "ground", label: "GND1 • 0V Return", spec: "0V Ground", row: 3, col: 2 }
        ],
        initialWires: [],
        topology: {
            mode: "single_loop",
            requiredComponents: ["bat1", "sw1", "diode1", "res1", "led1", "gnd1"],
            ledsRequiringResistor: ["led1"],
            requiredClosedSwitches: ["sw1"]
        },
        sampleSolution: {
            wires: [
                ["bat1:pos", "sw1:in"],
                ["sw1:out", "diode1:anode"],
                ["diode1:cathode", "res1:t1"],
                ["res1:t2", "led1:anode"],
                ["led1:cathode", "gnd1:gnd"],
                ["gnd1:ret", "bat1:neg"]
            ],
            switches: { sw1: true }
        }
    },

    {
        id: 13,
        code: "LEVEL 13",
        name: "Transistor Switch",
        difficulty: "Advanced",
        objective: "Build an NPN Transistor (Q1) low-side switch circuit: drive Base (B) through SW1 and R_BASE (10 kΩ), power LED1 and R_LOAD (330 Ω) into Collector (C), and tie Emitter (E) to Battery (−).",
        description: "An NPN transistor uses a small base current (through a 10 kΩ base resistor) to switch on a larger collector-to-emitter load current.",
        educationalExplanation: "When SW1 closes, a small base current flows from Battery (+) through R_BASE (10 kΩ) into Q1's Base (B) and out Emitter (E) to ground. This saturates Q1, allowing load current to flow from Battery (+) through R_LOAD (330 Ω) and LED1 into Collector (C) and out Emitter (E) to Battery (−).",
        hints: [
            "Control path: Connect Battery (+) → SW1 → R_BASE (10 kΩ) → Q1 Base (B).",
            "Load path: Connect Battery (+) → R_LOAD (330 Ω) → LED1 Anode (+), and LED1 Cathode (−) → Q1 Collector (C).",
            "Common return: Connect Q1 Emitter (E) directly to Battery (−), and ensure SW1 is CLOSED."
        ],
        components: [
            { id: "bat1", type: "battery", label: "BAT1 • 9V DC", spec: "9V Supply", row: 2, col: 1 },
            { id: "sw1", type: "switch", label: "SW1 • Base Trigger", spec: "Control Input", initialSwitchClosed: true, row: 3, col: 1 },
            { id: "r_base", type: "resistor", label: "R_BASE • 10 kΩ", spec: "10 kΩ Base Limit", ohms: 10000, row: 3, col: 2 },
            { id: "r_load", type: "resistor", label: "R_LOAD • 330 Ω", spec: "330 Ω LED Limit", ohms: 330, row: 1, col: 2 },
            { id: "led1", type: "led", label: "LED1 • Collector Load", spec: "Green 2.1V", row: 1, col: 3 },
            { id: "npn1", type: "transistor", label: "Q1 • 2N2222 NPN", spec: "B / C / E Switch", row: 2, col: 3 }
        ],
        initialWires: [],
        topology: {
            mode: "transistor_switch",
            requiredComponents: ["bat1", "sw1", "r_base", "r_load", "led1", "npn1"],
            ledsRequiringResistor: ["led1"],
            requiredClosedSwitches: ["sw1"],
            transistorConfig: {
                transistorId: "npn1",
                baseResistorId: "r_base",
                loadResistorId: "r_load",
                loadId: "led1",
                switchId: "sw1"
            }
        },
        sampleSolution: {
            wires: [
                ["bat1:pos", "sw1:in"],
                ["sw1:out", "r_base:t1"],
                ["r_base:t2", "npn1:b"],
                ["bat1:pos", "r_load:t1"],
                ["r_load:t2", "led1:anode"],
                ["led1:cathode", "npn1:c"],
                ["npn1:e", "bat1:neg"]
            ],
            switches: { sw1: true }
        }
    },

    {
        id: 14,
        code: "LEVEL 14",
        name: "Logic Connection",
        difficulty: "Advanced",
        objective: "Build a Series AND Logic Gate using Input Switch A (SW_A) and Input Switch B (SW_B) in series with R1 (330 Ω) and the Output LED, and set the truth table to A=1, B=1 → OUT=1.",
        description: "Truth Table (AND Gate): Output LED illuminates if and only if Switch A AND Switch B are wired in series and both are CLOSED (1).",
        educationalExplanation: "Two switches wired in series implement hardware boolean AND logic (OUT = A · B). If either SW_A or SW_B is open (0), the series path is broken and the output remains 0. Only when both switches are closed (1 AND 1) does the output LED energize.",
        hints: [
            "To create an AND gate (OUT = A AND B), SW_A and SW_B must be wired in series (one after the other), NOT in parallel.",
            "Include R1 (330 Ω) in series with LED1 (Anode + toward supply, Cathode − toward Battery −).",
            "Click both SW_A and SW_B so both switches are CLOSED (Logic 1) before pressing TEST CIRCUIT."
        ],
        components: [
            { id: "bat1", type: "battery", label: "BAT1 • 5V Logic Supply", spec: "5V DC", row: 2, col: 1 },
            { id: "sw_a", type: "switch", label: "SW_A • Logic Input A", spec: "Input A (0/1)", initialSwitchClosed: false, row: 1, col: 1 },
            { id: "sw_b", type: "switch", label: "SW_B • Logic Input B", spec: "Input B (0/1)", initialSwitchClosed: false, row: 1, col: 2 },
            { id: "res1", type: "resistor", label: "R1 • 330 Ω", spec: "330 Ω", ohms: 330, row: 1, col: 3 },
            { id: "led1", type: "led", label: "LED1 • Logic OUT (Y)", spec: "Y = A AND B", row: 2, col: 3 }
        ],
        initialWires: [],
        topology: {
            mode: "strict_series",
            requiredComponents: ["bat1", "sw_a", "sw_b", "res1", "led1"],
            seriesLoads: ["sw_a", "sw_b", "led1"],
            ledsRequiringResistor: ["led1"],
            requiredClosedSwitches: ["sw_a", "sw_b"]
        },
        sampleSolution: {
            wires: [
                ["bat1:pos", "sw_a:in"],
                ["sw_a:out", "sw_b:in"],
                ["sw_b:out", "res1:t1"],
                ["res1:t2", "led1:anode"],
                ["led1:cathode", "bat1:neg"]
            ],
            switches: { sw_a: true, sw_b: true }
        }
    },

    {
        id: 15,
        code: "LEVEL 15",
        name: "Master Circuit",
        difficulty: "Advanced",
        objective: "Combine all 6 components into a complete protected dual-output system: Battery (+) → Master Switch (SW1) → Input Protection Diode (D1), feeding two parallel outputs (Branch A: R1 + LED1, Branch B: BUZ1) returning to Battery (−).",
        description: "Final Challenge: Build a reverse-polarity-protected, master-switched dual-output power & alarm bus.",
        educationalExplanation: "This master schematic combines input switching (SW1), reverse-polarity diode protection (D1), and parallel power distribution to a current-limited visual status indicator (R1 + LED1) and an audible piezo alarm (BUZ1).",
        hints: [
            "Start with the main input rail: connect BAT1 (+) → SW1 (IN), and SW1 (OUT) → D1 Anode (+).",
            "From D1 Cathode (−), split into two parallel branches: Branch 1 goes through R1 (330 Ω) to LED1 Anode (+); Branch 2 goes to BUZ1 POS (+).",
            "Connect both LED1 Cathode (−) and BUZ1 NEG (−) back to BAT1 (−), and make sure SW1 is CLOSED."
        ],
        components: [
            { id: "bat1", type: "battery", label: "BAT1 • 9V Main Bus", spec: "9V Supply", row: 2, col: 1 },
            { id: "sw1", type: "switch", label: "SW1 • Master Bus Switch", spec: "SPST Toggle", initialSwitchClosed: true, row: 1, col: 1 },
            { id: "diode1", type: "diode", label: "D1 • Protection Diode", spec: "1N4007", row: 1, col: 2 },
            { id: "res1", type: "resistor", label: "R1 • 330 Ω", spec: "330 Ω", ohms: 330, row: 2, col: 2 },
            { id: "led1", type: "led", label: "LED1 • Bus Status LED", spec: "Green 2.1V", row: 1, col: 3 },
            { id: "buz1", type: "buzzer", label: "BUZ1 • System Alarm", spec: "9V Buzzer", row: 3, col: 3 }
        ],
        initialWires: [],
        topology: {
            mode: "parallel_branches",
            requiredComponents: ["bat1", "sw1", "diode1", "res1", "led1", "buz1"],
            ledsRequiringResistor: ["led1"],
            requiredClosedSwitches: ["sw1"],
            parallelGroups: [
                ["res1", "led1"],
                ["buz1"]
            ]
        },
        sampleSolution: {
            wires: [
                ["bat1:pos", "sw1:in"],
                ["sw1:out", "diode1:anode"],
                ["diode1:cathode", "res1:t1"],
                ["res1:t2", "led1:anode"],
                ["led1:cathode", "bat1:neg"],
                ["diode1:cathode", "buz1:pos"],
                ["buz1:neg", "bat1:neg"]
            ],
            switches: { sw1: true }
        }
    }
];
