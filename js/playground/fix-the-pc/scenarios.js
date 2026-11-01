// ============================================================================
// FIX THE PC — ALL 12 HARDWARE TROUBLESHOOTING CASES
// Predefined, technically accurate faults across 4 Technician Career Levels.
// ============================================================================

window.FIX_PC_SCENARIOS = [
    // ========================================================================
    // LEVEL 1 — TECHNICIAN IN TRAINING (CASES 1–3)
    // ========================================================================
    {
        id: 1,
        code: "CASE-01",
        level: 1,
        levelTitle: "Level 1 — Technician in Training",
        title: "PC Won't Turn On",
        customerName: "Marco V. (Student)",
        complaint: "I just moved my desktop PC to a new desk in my dorm. When I press the front power button, nothing happens at all—no fans spin and no motherboard LEDs light up.",
        symptomMonitor: "NO SIGNAL • STANDBY LED AMBER",
        symptomTower: "0W DRAW • NO FAN SPIN • NO LEDS",
        requiresPowerOffForRepair: true,
        diagnosticActions: [
            {
                id: "check-rear-psu",
                label: "Inspect Rear PSU Rocker Switch & AC Power Cord",
                result: "The AC power cord is plugged into the wall outlet, and the rear PSU rocker switch is already flipped to the ON (I) position.",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "inspect-fpanel",
                label: "Inspect Motherboard Front-Panel (F_PANEL) Header",
                result: "KEY FINDING: The 2-pin PWR_SW (Power Switch) header cable vibrated loose from the bottom-right motherboard pins during the desk move.",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "test-psu-rails",
                label: "Test PSU 24-Pin Standby Rail (+5VSB) with Multimeter",
                result: "Multimeter reads a steady +5.04V on the standby rail. The power supply unit is healthy and receiving AC power.",
                isRelevant: true,
                revealsKeyEvidence: false
            },
            {
                id: "check-display-settings",
                label: "Attempt to Open Monitor OSD Color Calibration Menu",
                result: "Unnecessary action: Calibrating monitor color settings has no effect on a desktop tower that will not power on.",
                isRelevant: false,
                revealsKeyEvidence: false
            }
        ],
        diagnoses: [
            {
                id: "diag-fpanel-loose",
                label: "Disconnected front-panel power switch (PWR_SW) cable on motherboard",
                isCorrect: true
            },
            {
                id: "diag-dead-psu",
                label: "Catastrophic PSU primary transformer failure",
                isCorrect: false
            },
            {
                id: "diag-corrupt-os",
                label: "Corrupted Windows boot partition",
                isCorrect: false
            },
            {
                id: "diag-dead-gpu",
                label: "Overheated graphics card VRAM",
                isCorrect: false
            }
        ],
        repairs: [
            {
                id: "rep-reconnect-fpanel",
                label: "Power off/unplug AC, then firmly reconnect the PWR_SW front-panel header to the motherboard pins",
                isCorrect: true,
                requiresPowerOff: true
            },
            {
                id: "rep-replace-psu",
                label: "Replace the entire 750W power supply unit",
                isCorrect: false,
                requiresPowerOff: true
            },
            {
                id: "rep-reinstall-os",
                label: "Format the SSD and reinstall the operating system",
                isCorrect: false,
                requiresPowerOff: false
            },
            {
                id: "rep-replace-monitor-cable",
                label: "Swap the HDMI cable for a DisplayPort cable",
                isCorrect: false,
                requiresPowerOff: false
            }
        ],
        verificationText: "Pressing the case power button shorts the PWR_SW pins as intended. Case fans spin up, POST completes with a single beep, and the desktop loads cleanly.",
        educationalExplanation: "When a PC shows zero response to the case power button despite having a working PSU and live AC power, the front-panel header (`F_PANEL` / `PWR_SW`) is a prime suspect—especially after transporting or moving the case.",
        hints: {
            investigation: "Check the rear power switch first, then inspect the motherboard's front-panel (`F_PANEL`) connector.",
            diagnosis: "The PSU has healthy standby voltage, so look at what connects the case power button to the motherboard.",
            repair: "Make sure you power off and unplug the PC first, then reconnect the loose front-panel `PWR_SW` header."
        }
    },
    {
        id: 2,
        code: "CASE-02",
        level: 1,
        levelTitle: "Level 1 — Technician in Training",
        title: "No Display on Monitor",
        customerName: "Alyssa T. (Content Creator)",
        complaint: "My PC turns on and all the case fans and RGB lights work, but my monitor just says 'No Signal' after I unplugged cables to clean my desk.",
        symptomMonitor: "NO VIDEO SIGNAL • CHECK INPUT CABLE",
        symptomTower: "POWER ON • FANS SPINNING • SYSTEM RUNNING",
        requiresPowerOffForRepair: false,
        diagnosticActions: [
            {
                id: "inspect-rear-io-video",
                label: "Inspect Rear Video Cable Connection Port",
                result: "KEY FINDING: The DisplayPort cable is plugged into the vertical motherboard I/O port instead of the horizontal dedicated GPU port, and the CPU has no integrated graphics.",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "check-monitor-input",
                label: "Check Monitor Power & Input Source Selection",
                result: "Monitor is powered on and set to DisplayPort Auto-Detect.",
                isRelevant: true,
                revealsKeyEvidence: false
            },
            {
                id: "check-post-leds",
                label: "Check Motherboard EZ-Debug POST LEDs",
                result: "All motherboard debug LEDs (CPU, DRAM, VGA, BOOT) cycle and turn off normally, indicating the PC booted into the OS.",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "remove-cmos-battery",
                label: "Desolder Motherboard Audio Capacitive Filter",
                result: "Unnecessary action: Motherboard audio components are unrelated to video output.",
                isRelevant: false,
                revealsKeyEvidence: false
            }
        ],
        diagnoses: [
            {
                id: "diag-wrong-video-port",
                label: "Monitor cable connected to motherboard I/O instead of dedicated GPU output",
                isCorrect: true
            },
            {
                id: "diag-failed-cpu",
                label: "Bent CPU socket pins preventing POST",
                isCorrect: false
            },
            {
                id: "diag-dead-ssd",
                label: "Failed M.2 NVMe solid-state drive",
                isCorrect: false
            },
            {
                id: "diag-shorted-psu",
                label: "Tripped PSU over-current protection",
                isCorrect: false
            }
        ],
        repairs: [
            {
                id: "rep-move-dp-to-gpu",
                label: "Move the DisplayPort cable from the motherboard I/O port to the dedicated graphics card output port",
                isCorrect: true,
                requiresPowerOff: false
            },
            {
                id: "rep-replace-gpu",
                label: "Replace the dedicated graphics card",
                isCorrect: false,
                requiresPowerOff: true
            },
            {
                id: "rep-reseat-cpu",
                label: "Remove the cooler and reseat the processor",
                isCorrect: false,
                requiresPowerOff: true
            },
            {
                id: "rep-replace-ram",
                label: "Install new DDR5 memory modules",
                isCorrect: false,
                requiresPowerOff: true
            }
        ],
        verificationText: "Monitor immediately detects the 144Hz DisplayPort signal from the dedicated GPU and displays the desktop screen.",
        educationalExplanation: "One of the most common mistakes after cleaning a desk is plugging the display cable into the motherboard's rear I/O instead of the dedicated graphics card. When a CPU lacks integrated graphics (or disables them when a dGPU is present), the motherboard ports output no signal.",
        hints: {
            investigation: "Inspect the back of the PC tower to see where the monitor cable is plugged in.",
            diagnosis: "The PC boots normally, so check whether the display cable is connected to the motherboard or the dedicated graphics card.",
            repair: "Plug the DisplayPort cable directly into the dedicated GPU's video output port."
        }
    },
    {
        id: 3,
        code: "CASE-03",
        level: 1,
        levelTitle: "Level 1 — Technician in Training",
        title: "No Internet Connection",
        customerName: "Devon R. (Remote Intern)",
        complaint: "My desktop says 'No Internet, Unidentified Network' over Ethernet, even though Wi-Fi works fine on my phone connected to the same router.",
        symptomMonitor: "ETHERNET: UNIDENTIFIED NETWORK (169.254.x.x)",
        symptomTower: "POWER ON • NIC LINK LED BLINKING AMBER",
        requiresPowerOffForRepair: false,
        diagnosticActions: [
            {
                id: "run-ipconfig",
                label: "Run Network Configuration Check (ipconfig /all)",
                result: "KEY FINDING: The Ethernet adapter is configured with a manual static IP (192.168.50.200) and wrong default gateway (192.168.50.1) from an old lab network, while the home router uses 192.168.1.1.",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "inspect-rj45-cable",
                label: "Test Cat6 Ethernet Cable with Continuity Tester",
                result: "All 8 twisted-pair pins pass continuity. Physical link is intact.",
                isRelevant: true,
                revealsKeyEvidence: false
            },
            {
                id: "check-device-manager-nic",
                label: "Check Network Adapter Status in Device Manager",
                result: "Realtek PCIe GbE Family Controller reports 'This device is working properly.'",
                isRelevant: true,
                revealsKeyEvidence: false
            },
            {
                id: "repaste-cpu-for-net",
                label: "Reapply Thermal Paste to CPU Cooler",
                result: "Unnecessary action: CPU thermal compound does not affect TCP/IP routing or Ethernet addressing.",
                isRelevant: false,
                revealsKeyEvidence: false
            }
        ],
        diagnoses: [
            {
                id: "diag-static-ip-mismatch",
                label: "Misconfigured static IPv4 address and gateway conflicting with the router's DHCP subnet",
                isCorrect: true
            },
            {
                id: "diag-severed-cat6",
                label: "Broken copper wires inside the Cat6 Ethernet cable",
                isCorrect: false
            },
            {
                id: "diag-fried-nic",
                label: "Burned-out motherboard Ethernet controller chip",
                isCorrect: false
            },
            {
                id: "diag-failing-psu-12v",
                label: "Unstable +12V power rail",
                isCorrect: false
            }
        ],
        repairs: [
            {
                id: "rep-enable-dhcp",
                label: "Reset IPv4 adapter settings to Obtain IP and DNS automatically (DHCP) and renew lease",
                isCorrect: true,
                requiresPowerOff: false
            },
            {
                id: "rep-replace-mobo",
                label: "Replace the entire ATX motherboard",
                isCorrect: false,
                requiresPowerOff: true
            },
            {
                id: "rep-format-drive",
                label: "Wipe the storage drive and clean-install drivers",
                isCorrect: false,
                requiresPowerOff: false
            },
            {
                id: "rep-upgrade-ram",
                label: "Add an extra 16GB RAM module",
                isCorrect: false,
                requiresPowerOff: true
            }
        ],
        verificationText: "Running `ipconfig /renew` assigns 192.168.1.42 from the router's DHCP server. Ping to 1.1.1.1 succeeds with 4ms latency.",
        educationalExplanation: "When a computer retains a static IP address from a different subnet (such as a school lab), it cannot communicate with a home router on another subnet. Resetting the adapter to automatic DHCP restores proper IP and gateway assignment.",
        hints: {
            investigation: "Run `ipconfig /all` to inspect the IP address and default gateway assigned to the Ethernet adapter.",
            diagnosis: "Compare the adapter's static IP subnet (`192.168.50.x`) against the router's actual subnet (`192.168.1.x`).",
            repair: "Set the network adapter back to automatic DHCP and renew the IP lease."
        }
    },

    // ========================================================================
    // LEVEL 2 — JUNIOR TECHNICIAN (CASES 4–6)
    // ========================================================================
    {
        id: 4,
        code: "CASE-04",
        level: 2,
        levelTitle: "Level 2 — Junior Technician",
        title: "Slow Computer Performance",
        customerName: "Hannah G. (Architecture Student)",
        complaint: "My PC takes forever to open apps and stutters constantly, even when I only have a browser and a PDF open.",
        symptomMonitor: "UI FREEZING • HIGH DISK & CPU WAIT",
        symptomTower: "POWER ON • STORAGE ACTIVITY LED SOLID ON",
        requiresPowerOffForRepair: false,
        diagnosticActions: [
            {
                id: "check-task-manager",
                label: "Inspect Task Manager Processes & Startup Tab",
                result: "KEY FINDING: System drive C: is at 100% active time with only 420MB free out of 500GB, and 19 heavy background updaters/bloatware apps launch at startup, paging constantly to a nearly full SSD.",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "check-ssd-smart",
                label: "Run S.M.A.R.T. Drive Health & Free Space Utility",
                result: "SSD hardware health is 98% Good, but capacity is 99.9% full (leaving no room for the OS pagefile or SSD write cache).",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "check-cpu-temps-idle",
                label: "Check CPU Core Temperatures",
                result: "CPU temperature is a cool 41°C—thermal throttling is not occurring.",
                isRelevant: true,
                revealsKeyEvidence: false
            },
            {
                id: "replace-cmos-batt",
                label: "Replace Motherboard CR2032 CMOS Battery",
                result: "Unnecessary action: The CMOS battery only maintains RTC time and BIOS settings when AC power is removed.",
                isRelevant: false,
                revealsKeyEvidence: false
            }
        ],
        diagnoses: [
            {
                id: "diag-full-ssd-startup-bloat",
                label: "Critically full system SSD (99.9% used) combined with excessive startup background processes causing severe swap thrashing",
                isCorrect: true
            },
            {
                id: "diag-cpu-overheat",
                label: "Severe CPU thermal throttling at 100°C",
                isCorrect: false
            },
            {
                id: "diag-failing-gpu-fan",
                label: "Seized graphics card cooling fan",
                isCorrect: false
            },
            {
                id: "diag-dead-psu-fan",
                label: "Power supply voltage drop",
                isCorrect: false
            }
        ],
        repairs: [
            {
                id: "rep-clean-storage-startup",
                label: "Clear 65GB+ of temp/cache files to restore SSD headroom and disable unnecessary startup bloatware",
                isCorrect: true,
                requiresPowerOff: false
            },
            {
                id: "rep-replace-cpu",
                label: "Replace the processor with a new CPU",
                isCorrect: false,
                requiresPowerOff: true
            },
            {
                id: "rep-replace-psu-slow",
                label: "Install a higher-wattage PSU",
                isCorrect: false,
                requiresPowerOff: true
            },
            {
                id: "rep-underclock-ram",
                label: "Lower RAM frequency in BIOS to 2133MHz",
                isCorrect: false,
                requiresPowerOff: false
            }
        ],
        verificationText: "With 72GB of free SSD space restored and startup bloat disabled, disk active time drops to 2% at idle and applications launch instantaneously.",
        educationalExplanation: "SSDs suffer dramatic write-speed drops when filled near 100% capacity because the controller cannot use SLC cache blocks efficiently, and the OS cannot expand its virtual memory pagefile.",
        hints: {
            investigation: "Check Task Manager and the S.M.A.R.T. storage utility to see why the disk activity light is solid on.",
            diagnosis: "Look at the available free space on the C: drive and the number of background startup programs.",
            repair: "Free up SSD storage capacity and disable heavy startup bloatware."
        }
    },
    {
        id: 5,
        code: "CASE-05",
        level: 2,
        levelTitle: "Level 2 — Junior Technician",
        title: "Storage Not Detected",
        customerName: "Paolo M. (Video Editor)",
        complaint: "My PC boots straight into the BIOS setup screen and says 'No Bootable Device Found.' My M.2 NVMe SSD isn't showing up in the boot list!",
        symptomMonitor: "UEFI BIOS: NO BOOTABLE DEVICE FOUND",
        symptomTower: "POWER ON • BOOTS TO UEFI SETUP ONLY",
        requiresPowerOffForRepair: true,
        diagnosticActions: [
            {
                id: "check-bios-nvme-list",
                label: "Check UEFI BIOS Storage / NVMe Configuration Page",
                result: "Slot M2_1 reports 'Not Present'. BIOS is set to standard UEFI mode.",
                isRelevant: true,
                revealsKeyEvidence: false
            },
            {
                id: "inspect-m2-slot",
                label: "Inspect Physical M.2 NVMe Slot on Motherboard",
                result: "KEY FINDING: The M.2 standoff screw was never tightened properly; the M.2 SSD popped up at a 30-degree angle and its gold contacts are partially unseated from the M2_1 socket.",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "check-ram-speed",
                label: "Check Memory XMP Profile in BIOS",
                result: "32GB DDR5 is detected properly in BIOS.",
                isRelevant: true,
                revealsKeyEvidence: false
            },
            {
                id: "clean-mouse-sensor",
                label: "Clean Optical Mouse Sensor Lens",
                result: "Unnecessary action: Cleaning peripherals will not make an internal NVMe boot drive appear in UEFI.",
                isRelevant: false,
                revealsKeyEvidence: false
            }
        ],
        diagnoses: [
            {
                id: "diag-unseated-m2",
                label: "Physically unseated M.2 NVMe SSD due to a loose M.2 mounting screw",
                isCorrect: true
            },
            {
                id: "diag-dead-gpu-vram",
                label: "Faulty graphics card display output",
                isCorrect: false
            },
            {
                id: "diag-bad-ethernet",
                label: "Disconnected Ethernet cable",
                isCorrect: false
            },
            {
                id: "diag-cpu-overvolt",
                label: "Excessive CPU core voltage",
                isCorrect: false
            }
        ],
        repairs: [
            {
                id: "rep-reseat-secure-m2",
                label: "Power off/unplug AC, reseat the M.2 NVMe SSD fully into M2_1, and secure it flat with the standoff screw",
                isCorrect: true,
                requiresPowerOff: true
            },
            {
                id: "rep-replace-monitor",
                label: "Replace the desktop monitor",
                isCorrect: false,
                requiresPowerOff: false
            },
            {
                id: "rep-swap-psu-cables",
                label: "Unplug the CPU 8-pin EPS power cable",
                isCorrect: false,
                requiresPowerOff: true
            },
            {
                id: "rep-disable-usb",
                label: "Disable all USB ports in UEFI BIOS",
                isCorrect: false,
                requiresPowerOff: false
            }
        ],
        verificationText: "UEFI BIOS now detects the 1TB NVMe SSD in M2_1 and boots directly into the operating system with all project files intact.",
        educationalExplanation: "M.2 SSDs insert at an angle and must be pressed flat and secured onto the motherboard standoff. Without a secure screw or latch, thermal expansion or vibration can cause the drive to spring upward and lose pin contact.",
        hints: {
            investigation: "Inspect the physical M.2 NVMe slot on the motherboard after checking the BIOS storage list.",
            diagnosis: "Notice the physical position of the M.2 drive and its mounting screw.",
            repair: "Power off and unplug the PC first, then reseat the M.2 SSD and fasten the standoff screw."
        }
    },
    {
        id: 6,
        code: "CASE-06",
        level: 2,
        levelTitle: "Level 2 — Junior Technician",
        title: "RAM Not Detected",
        customerName: "Jules C. (IT Classmate)",
        complaint: "I bought a 32GB (2x16GB) RAM kit, but Windows Task Manager and the BIOS only show 16GB installed, and it's running in single-channel mode!",
        symptomMonitor: "INSTALLED MEMORY: 16.0 GB (SINGLE-CHANNEL)",
        symptomTower: "POWER ON • BOOTS WITH HALF CAPACITY",
        requiresPowerOffForRepair: true,
        diagnosticActions: [
            {
                id: "check-bios-spd",
                label: "Check UEFI BIOS Memory Slot SPD Information",
                result: "DIMM_A2 shows 16GB DDR5 Occupied. DIMM_B1 and DIMM_B2 show Empty, even though two physical sticks are inside the case.",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "inspect-dimm-latches",
                label: "Inspect Physical DIMM Slots & Retention Latches",
                result: "KEY FINDING: The second RAM stick was placed in slot B1 instead of B2, and its bottom edge isn't clicked all the way down—the top latch is half-open.",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "check-gpu-driver",
                label: "Check Graphics Driver Version",
                result: "GPU driver is up to date and unrelated to physical DIMM detection.",
                isRelevant: false,
                revealsKeyEvidence: false
            }
        ],
        diagnoses: [
            {
                id: "diag-unseated-wrong-dimm",
                label: "Second RAM module is partially unseated and placed in the wrong DIMM slot (B1 instead of A2/B2 pair)",
                isCorrect: true
            },
            {
                id: "diag-full-hard-drive",
                label: "Insufficient free space on the SSD",
                isCorrect: false
            },
            {
                id: "diag-broken-psu",
                label: "Faulty power supply AC cord",
                isCorrect: false
            },
            {
                id: "diag-bad-thermal-paste",
                label: "Dried CPU thermal paste",
                isCorrect: false
            }
        ],
        repairs: [
            {
                id: "rep-reseat-dual-channel-ram",
                label: "Power off/unplug AC, move the second module to slot B2 (matching A2+B2), and press firmly until both latches click",
                isCorrect: true,
                requiresPowerOff: true
            },
            {
                id: "rep-reinstall-browser",
                label: "Reinstall the web browser",
                isCorrect: false,
                requiresPowerOff: false
            },
            {
                id: "rep-remove-gpu",
                label: "Remove the dedicated graphics card",
                isCorrect: false,
                requiresPowerOff: true
            },
            {
                id: "rep-clear-browser-cache",
                label: "Clear temporary internet files",
                isCorrect: false,
                requiresPowerOff: false
            }
        ],
        verificationText: "BIOS and OS now report the full 32.0 GB of DDR5 memory running in Dual-Channel mode across slots A2 and B2.",
        educationalExplanation: "DDR4/DDR5 DIMMs require firm, even pressure until the retention clips click into the side notches. Additionally, standard 4-slot motherboards use slots A2 and B2 first for optimal dual-channel signal integrity.",
        hints: {
            investigation: "Check the BIOS SPD slot view and physically inspect the DIMM retention latches.",
            diagnosis: "One of the RAM sticks is in the wrong slot and isn't pressed all the way into the socket.",
            repair: "Power off and unplug the system, then seat the RAM sticks firmly in slots A2 and B2."
        }
    },

    // ========================================================================
    // LEVEL 3 — SKILLED TECHNICIAN (CASES 7–9)
    // ========================================================================
    {
        id: 7,
        code: "CASE-07",
        level: 3,
        levelTitle: "Level 3 — Skilled Technician",
        title: "Computer Overheating",
        customerName: "Ryan K. (3D Modeling Student)",
        complaint: "I just built my new PC. Within 30 seconds of starting a render, the CPU hits 100°C, the fans scream at 100% RPM, and the clock speed drops to 800MHz!",
        symptomMonitor: "CPU TEMP: 100°C • THERMAL THROTTLING ACTIVE",
        symptomTower: "COOLER FAN AT 100% RPM • HEATSINK FINS COLD TO TOUCH",
        requiresPowerOffForRepair: true,
        diagnosticActions: [
            {
                id: "check-hwmonitor-temps",
                label: "Monitor CPU Package Temp & Cooler Fan RPM",
                result: "CPU package spikes from 68°C idle to 100°C instantly under load, even though CPU_FAN reports 2,200 RPM.",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "inspect-cooler-coldplate",
                label: "Unmount CPU Cooler & Inspect Heatsink Coldplate",
                result: "KEY FINDING: The clear plastic protective peel sticker ('WARNING: REMOVE BEFORE INSTALLATION') is still stuck on the bottom of the CPU cooler coldplate, blocking heat transfer!",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "check-case-airflow",
                label: "Inspect Front Intake & Rear Exhaust Fans",
                result: "Case airflow is unobstructed and ambient intake air is 24°C.",
                isRelevant: true,
                revealsKeyEvidence: false
            },
            {
                id: "run-network-ping",
                label: "Run Network Latency Ping Test",
                result: "Unnecessary action: Network latency does not cause a CPU to reach 100°C.",
                isRelevant: false,
                revealsKeyEvidence: false
            }
        ],
        diagnoses: [
            {
                id: "diag-plastic-peel-on-cooler",
                label: "Protective plastic peel film left on the CPU cooler coldplate preventing thermal transfer",
                isCorrect: true
            },
            {
                id: "diag-bad-ssd-firmware",
                label: "Outdated NVMe SSD firmware",
                isCorrect: false
            },
            {
                id: "diag-ram-mismatch",
                label: "Single-channel RAM configuration",
                isCorrect: false
            },
            {
                id: "diag-defective-monitor",
                label: "Faulty monitor refresh rate setting",
                isCorrect: false
            }
        ],
        repairs: [
            {
                id: "rep-remove-peel-repaste",
                label: "Power off/unplug AC, remove the plastic peel from the cooler base, apply fresh thermal paste, and remount evenly",
                isCorrect: true,
                requiresPowerOff: true
            },
            {
                id: "rep-disable-cpu-cores",
                label: "Disable half of the CPU cores permanently in BIOS",
                isCorrect: false,
                requiresPowerOff: false
            },
            {
                id: "rep-replace-ssd-heat",
                label: "Replace the M.2 SSD",
                isCorrect: false,
                requiresPowerOff: true
            },
            {
                id: "rep-unplug-case-fans",
                label: "Disconnect the rear exhaust fan",
                isCorrect: false,
                requiresPowerOff: true
            }
        ],
        verificationText: "During a 10-minute multi-core render stress test, CPU temperature stabilizes at a healthy 69°C with zero thermal throttling.",
        educationalExplanation: "When a CPU hits 100°C immediately while the heatsink fins remain cool to the touch, heat is not transferring from the CPU IHS to the cooler base. Leaving the factory plastic protective film on the cooler coldplate acts as a thermal insulator.",
        hints: {
            investigation: " Notice that the cooler fan spins fast, yet the heatsink fins feel cold. Inspect the contact surface between the CPU and the cooler.",
            diagnosis: "What did the technician find stuck to the bottom of the CPU cooler coldplate?",
            repair: "Power off and unplug the PC, peel off the protective plastic film, apply fresh thermal paste, and remount the cooler."
        }
    },
    {
        id: 8,
        code: "CASE-08",
        level: 3,
        levelTitle: "Level 3 — Skilled Technician",
        title: "Random Shutdowns",
        customerName: "Carlos D. (Video Producer)",
        complaint: "My PC works fine for web browsing, but whenever I export 4K video or launch a heavy benchmark, the whole computer abruptly clicks off like someone pulled the plug.",
        symptomMonitor: "ABRUPT POWER LOSS UNDER FULL LOAD",
        symptomTower: "PSU RELAY CLICKS OFF • REQUIRES SWITCH CYCLE",
        requiresPowerOffForRepair: true,
        diagnosticActions: [
            {
                id: "check-event-viewer-41",
                label: "Inspect Windows Event Viewer System Logs",
                result: "Critical Kernel-Power Event ID 41 logged with BugCheckCode 0 (sudden loss of power without a blue screen).",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "inspect-psu-wattage-vent",
                label: "Inspect PSU Compartment, Dust Filter & +12V Rail Load",
                result: "KEY FINDING: The bottom PSU intake dust filter is completely choked with a thick blanket of lint/carpet fibers, and the PSU fan is suffocating—triggering PSU Over-Temperature / Over-Power Protection (OTP/OPP) under combined CPU+GPU load.",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "check-cpu-gpu-temps",
                label: "Check CPU & GPU Core Temperatures Before Shutdown",
                result: "CPU is 71°C and GPU is 68°C right before shutdown—neither chip is overheating.",
                isRelevant: true,
                revealsKeyEvidence: false
            },
            {
                id: "reinstall-audio-driver",
                label: "Reinstall Realtek Audio Driver",
                result: "Unnecessary action: Audio drivers do not trigger hardware PSU protection relays.",
                isRelevant: false,
                revealsKeyEvidence: false
            }
        ],
        diagnoses: [
            {
                id: "diag-psu-otp-clogged",
                label: "PSU triggering Over-Temperature Protection (OTP) under load due to a severely clogged bottom intake filter and carpet obstruction",
                isCorrect: true
            },
            {
                id: "diag-corrupt-gpu-driver",
                label: "Outdated DirectX shader cache",
                isCorrect: false
            },
            {
                id: "diag-loose-hdmi",
                label: "Loose monitor HDMI cable",
                isCorrect: false
            },
            {
                id: "diag-bad-cmos",
                label: "Weak CMOS battery",
                isCorrect: false
            }
        ],
        repairs: [
            {
                id: "rep-clean-psu-filter-elevate",
                label: "Power off/unplug AC, clean the clogged bottom PSU intake filter and vent, and elevate the case off the carpet for proper PSU airflow",
                isCorrect: true,
                requiresPowerOff: true
            },
            {
                id: "rep-open-psu-casing",
                label: "Unscrew the PSU metal housing and bypass the internal thermal fuse",
                isCorrect: false,
                requiresPowerOff: true
            },
            {
                id: "rep-format-windows",
                label: "Reinstall the operating system",
                isCorrect: false,
                requiresPowerOff: false
            },
            {
                id: "rep-remove-ram-stick",
                label: "Remove one RAM stick",
                isCorrect: false,
                requiresPowerOff: true
            }
        ],
        verificationText: "A 20-minute combined CPU + GPU power stress test completes without any shutdowns; PSU exhaust air remains warm and steady.",
        educationalExplanation: "Sudden power-offs under heavy load that require flipping the PSU switch are classic signs of PSU protection circuits (OTP/OPP/OCP) tripping. Never open a PSU enclosure (high-voltage capacitors are dangerous); instead, clear external dust filters and ensure unobstructed intake airflow.",
        hints: {
            investigation: "Check Event Viewer and inspect the PSU compartment and bottom intake dust filter.",
            diagnosis: "Why is the power supply clicking off when power draw increases, even though CPU and GPU temps are fine?",
            repair: "Power off and unplug AC, clean the external PSU intake dust filter, and elevate the case off the carpet (never open a PSU housing!)."
        }
    },
    {
        id: 9,
        code: "CASE-09",
        level: 3,
        levelTitle: "Level 3 — Skilled Technician",
        title: "Strange Computer Noises",
        customerName: "Bea L. (Music Producer)",
        complaint: "There's a loud, rapid clicking/rattling sound coming from inside my PC tower that gets faster whenever the computer gets warm!",
        symptomMonitor: "SYSTEM OPERATIONAL • NO OS ERRORS",
        symptomTower: "RHYTHMIC MECHANICAL CLICKING FROM UPPER CHASSIS",
        requiresPowerOffForRepair: true,
        diagnosticActions: [
            {
                id: "acoustic-fan-isolation",
                label: "Perform Acoustic Isolation Check on Case & Cooler Fans",
                result: "KEY FINDING: The loose excess slack of the 4-pin CPU_FAN cable is drooping directly into the spinning blades of the CPU cooler fan, clicking louder as PWM RPM increases.",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "check-storage-type",
                label: "Check Installed Storage Drive Types",
                result: "The PC only uses solid-state M.2 NVMe storage (no mechanical spinning hard drives are installed).",
                isRelevant: true,
                revealsKeyEvidence: false
            },
            {
                id: "check-gpu-fans",
                label: "Inspect GPU Dual Fans at Idle (0dB Zero-RPM Mode)",
                result: "GPU fans are completely stationary at idle while the clicking noise continues.",
                isRelevant: true,
                revealsKeyEvidence: false
            },
            {
                id: "run-disk-defrag",
                label: "Run Disk Defragmenter on NVMe SSD",
                result: "Unnecessary action: Defragmenting an SSD cannot fix a physical mechanical rattling noise.",
                isRelevant: false,
                revealsKeyEvidence: false
            }
        ],
        diagnoses: [
            {
                id: "diag-fan-cable-obstruction",
                label: "Unsecured CPU cooler fan wire rubbing against the spinning PWM fan blades",
                isCorrect: true
            },
            {
                id: "diag-failing-hdd-head",
                label: "Clicking mechanical hard drive read/write head crash",
                isCorrect: false
            },
            {
                id: "diag-ram-coil-whine",
                label: "Defective DDR5 memory module",
                isCorrect: false
            },
            {
                id: "diag-monitor-speaker",
                label: "Blown monitor speaker cone",
                isCorrect: false
            }
        ],
        repairs: [
            {
                id: "rep-reroute-tie-fan-cable",
                label: "Power off/unplug AC, reroute the CPU_FAN wire away from the fan hub, and secure the slack neatly with a cable tie",
                isCorrect: true,
                requiresPowerOff: true
            },
            {
                id: "rep-unplug-cpu-fan-forever",
                label: "Leave the CPU cooler fan permanently unplugged",
                isCorrect: false,
                requiresPowerOff: true
            },
            {
                id: "rep-replace-ssd-noise",
                label: "Replace the M.2 NVMe SSD",
                isCorrect: false,
                requiresPowerOff: true
            },
            {
                id: "rep-reinstall-sound-driver",
                label: "Update audio drivers",
                isCorrect: false,
                requiresPowerOff: false
            }
        ],
        verificationText: "With the fan cable neatly routed and tied back, the cooler ramps smoothly from 800 RPM to 2,000 RPM with only a quiet airflow hum.",
        educationalExplanation: "A rhythmic clicking sound that scales with temperature (and therefore PWM fan speed) in an all-SSD system almost always points to a fan blade obstruction—most commonly a loose fan or RGB header cable.",
        hints: {
            investigation: "Isolate where the sound comes from inside the tower and check what type of storage is installed.",
            diagnosis: "Since there is no mechanical hard drive, look at what is touching the spinning CPU cooler fan blades.",
            repair: "Power off and unplug AC, then reroute and zip-tie the loose CPU_FAN cable clear of the blades."
        }
    },

    // ========================================================================
    // LEVEL 4 — EXPERT TECHNICIAN (CASES 10–12)
    // ========================================================================
    {
        id: 10,
        code: "CASE-10",
        level: 4,
        levelTitle: "Level 4 — Expert Technician",
        title: "PC Freezes During Gaming",
        customerName: "Miguel S. (Competitive FPS Player)",
        complaint: "My desktop runs desktop apps fine all day, but 5 minutes into any 3D game, the screen shows checkerboard artifacts and freezes with a 'Display driver nvlddmkm stopped responding' error.",
        symptomMonitor: "VRAM ARTIFACTS • TDR DISPLAY DRIVER TIMEOUT",
        symptomTower: "GPU FANS RAMP • PCIE SLOT LATCH PARTIALLY OPEN",
        requiresPowerOffForRepair: true,
        diagnosticActions: [
            {
                id: "check-gpu-pcie-bus",
                label: "Check GPU-Z Bus Interface & PCIe Power Telemetry",
                result: "KEY FINDING 1: GPU-Z reports the card is running at 'PCIe x2 4.0' instead of 'PCIe x16 4.0', and the 8-pin PCIe power connector voltage droops to 11.1V under 3D load.",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "inspect-gpu-seat-power",
                label: "Inspect GPU PCIe Slot Seating & 8-Pin PCIe Power Plug",
                result: "KEY FINDING 2: Heavy GPU sag caused the rear of the card to pull slightly out of the PCIe x16 slot, and the 6+2 pin PCIe power plug is not latched flush.",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "run-furmark-vram",
                label: "Check GPU Core & Hotspot Temperatures",
                result: "GPU core is 64°C—thermal paste is fine.",
                isRelevant: true,
                revealsKeyEvidence: false
            },
            {
                id: "change-wallpaper",
                label: "Change Desktop Wallpaper Resolution",
                result: "Unnecessary action: Desktop wallpaper settings do not cause PCIe lane drop or 12V power droop.",
                isRelevant: false,
                revealsKeyEvidence: false
            }
        ],
        diagnoses: [
            {
                id: "diag-gpu-sag-loose-pcie",
                label: "GPU sag causing partial PCIe x16 contact (dropping to x2 lanes) combined with an unlatched 6+2 pin PCIe power connector",
                isCorrect: true
            },
            {
                id: "diag-bad-ethernet-ping",
                label: "High network latency during online matches",
                isCorrect: false
            },
            {
                id: "diag-cpu-missing",
                label: "Uninstalled CPU processor",
                isCorrect: false
            },
            {
                id: "diag-corrupt-font",
                label: "Corrupted system font cache",
                isCorrect: false
            }
        ],
        repairs: [
            {
                id: "rep-reseat-gpu-secure-power",
                label: "Power off/unplug AC, reseat the GPU squarely into the PCIe x16 slot, tighten bracket screws, and latch the 6+2 pin PCIe power connector flush",
                isCorrect: true,
                requiresPowerOff: true
            },
            {
                id: "rep-reinstall-game-only",
                label: "Uninstall and redownload the FPS game",
                isCorrect: false,
                requiresPowerOff: false
            },
            {
                id: "rep-replace-cpu-cooler",
                label: "Replace the CPU heatsink",
                isCorrect: false,
                requiresPowerOff: true
            },
            {
                id: "rep-disable-network",
                label: "Disable the Ethernet controller",
                isCorrect: false,
                requiresPowerOff: false
            }
        ],
        verificationText: "GPU-Z now reports the full 'PCIe x16 4.0' link width and a rock-solid 12.08V rail. A 30-minute 3D gaming loop runs at 180+ FPS with zero freezes.",
        educationalExplanation: "Heavy graphics cards can sag over time if the rear PCIe bracket screws or power cables are loose, causing high-numbered PCIe lanes to lose contact and starving the GPU under transient 3D loads.",
        hints: {
            investigation: "Run the GPU-Z bus/power telemetry check and physically inspect the GPU slot and 6+2 pin power connector.",
            diagnosis: "Look at why the GPU is only negotiating x2 PCIe lanes and experiencing voltage droop under 3D load.",
            repair: "Power off and unplug AC, reseat the GPU firmly in the PCIe x16 slot, fasten the bracket screws, and latch the 6+2 pin power plug."
        }
    },
    {
        id: 11,
        code: "CASE-11",
        level: 4,
        levelTitle: "Level 4 — Expert Technician",
        title: "System Fails to Boot After Hardware Upgrade",
        customerName: "Tristan P. (CS Senior)",
        complaint: "I upgraded my RAM speed in the BIOS using a manual overclock to 8000MHz and added a new GPU. Now the PC turns on, fans spin, the DRAM debug LED stays solid yellow, and I can't even get into the BIOS screen!",
        symptomMonitor: "BLACK SCREEN • NO POST • NO BIOS ACCESS",
        symptomTower: "MOTHERBOARD EZ-DEBUG 'DRAM' LED SOLID YELLOW",
        requiresPowerOffForRepair: true,
        diagnosticActions: [
            {
                id: "check-ez-debug-dram",
                label: "Inspect Motherboard EZ-Debug Status LEDs",
                result: "KEY FINDING 1: The DRAM debug LED remains solid yellow indefinitely—memory training is failing before video initialization.",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "inspect-bios-oc-state",
                label: "Verify Installed RAM Spec vs. Applied Manual Overclock",
                result: "KEY FINDING 2: The installed DDR5 kit is rated for 6000MHz EXPO/XMP, so forcing 8000MHz without voltage/timing support locked the memory controller in a no-POST state.",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "check-gpu-power-cables",
                label: "Inspect New GPU Seating & Power Connections",
                result: "The new GPU is properly seated and powered; the system is halting at DRAM training before reaching the VGA check.",
                isRelevant: true,
                revealsKeyEvidence: false
            },
            {
                id: "clean-case-window",
                label: "Wipe Tempered Glass Side Panel",
                result: "Unnecessary action: Cleaning glass does not resolve failed DDR5 memory training.",
                isRelevant: false,
                revealsKeyEvidence: false
            }
        ],
        diagnoses: [
            {
                id: "diag-unstable-ram-oc-no-post",
                label: "Unstable manual DDR5 memory overclock (8000MHz on a 6000MHz kit) causing memory training failure before POST",
                isCorrect: true
            },
            {
                id: "diag-dead-new-gpu",
                label: "Dead-on-arrival graphics card",
                isCorrect: false
            },
            {
                id: "diag-corrupted-windows",
                label: "Corrupted Windows registry",
                isCorrect: false
            },
            {
                id: "diag-failed-psu-switch",
                label: "Broken case power button",
                isCorrect: false
            }
        ],
        repairs: [
            {
                id: "rep-clear-cmos-enable-xmp",
                label: "Power off/unplug AC, clear CMOS (jumper/battery) to reset BIOS settings, then enable the rated 6000MHz XMP/EXPO profile",
                isCorrect: true,
                requiresPowerOff: true
            },
            {
                id: "rep-throw-away-ram",
                label: "Discard the working DDR5 RAM kit",
                isCorrect: false,
                requiresPowerOff: true
            },
            {
                id: "rep-replace-monitor-11",
                label: "Replace the monitor power brick",
                isCorrect: false,
                requiresPowerOff: false
            },
            {
                id: "rep-unplug-ssd-11",
                label: "Disconnect the M.2 SSD",
                isCorrect: false,
                requiresPowerOff: true
            }
        ],
        verificationText: "Clearing CMOS resets the memory controller to safe JEDEC defaults, allowing the PC to POST into BIOS. Enabling the rated 6000MHz profile boots the system stably.",
        educationalExplanation: "When an aggressive memory overclock prevents a motherboard from completing DRAM training, you cannot enter the BIOS via the keyboard. Clearing the CMOS (via the `CLR_CMOS` jumper, rear button, or removing the CR2032 battery with AC unplugged) restores factory defaults.",
        hints: {
            investigation: "Check the motherboard EZ-Debug LEDs and review the RAM rating versus the manual 8000MHz setting.",
            diagnosis: "Why is the motherboard stuck on the yellow DRAM LED before even initializing the display?",
            repair: "Power off and unplug AC, clear the motherboard CMOS to wipe the unstable overclock, and load the rated 6000MHz profile."
        }
    },
    {
        id: 12,
        code: "CASE-12",
        level: 4,
        levelTitle: "Level 4 — Expert Technician",
        title: "Advanced Diagnostic Challenge — Multiple Symptoms",
        customerName: "Prof. Reyes (IT Lab Coordinator)",
        complaint: "This workstation has multiple issues after a student lab rebuild: it takes 3 tries to POST, CPU temps idle at 78°C, and when it finally boots, the PCIe GPU runs sluggishly and crashes under load.",
        symptomMonitor: "INTERMITTENT POST • HIGH CPU TEMP • LOW GPU POWER",
        symptomTower: "CPU COOLER FAN STOPPED • EPS/PCIE CABLES LOOSE",
        requiresPowerOffForRepair: true,
        diagnosticActions: [
            {
                id: "inspect-cooler-header-12",
                label: "Inspect CPU Cooler Header & Fan Operation",
                result: "KEY FINDING 1: The CPU cooler's 4-pin PWM plug was connected to a disabled RGB header pins offset by one pin—the CPU fan is not spinning at all!",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "inspect-modular-psu-cables-12",
                label: "Inspect Modular PSU & Motherboard Power Connections",
                result: "KEY FINDING 2: Both the 24-pin ATX main connector and the GPU 8-pin PCIe power cable on the modular PSU side are only half-inserted (unlatched), causing intermittent POST and load crashes.",
                isRelevant: true,
                revealsKeyEvidence: true
            },
            {
                id: "check-ram-ssd-seating-12",
                label: "Verify RAM & M.2 SSD Seating",
                result: "RAM (A2/B2) and M.2 NVMe SSD are properly seated and pass memory/SMART checks.",
                isRelevant: true,
                revealsKeyEvidence: false
            },
            {
                id: "run-antivirus-scan-12",
                label: "Run Browser Cookie Cleanup",
                result: "Unnecessary action: Browser cookies do not stop a CPU fan or loosen modular power cables.",
                isRelevant: false,
                revealsKeyEvidence: false
            }
        ],
        diagnoses: [
            {
                id: "diag-multi-fan-header-and-psu-cables",
                label: "Compound assembly fault: CPU fan plugged into the wrong header AND unlatched 24-pin ATX / 8-pin PCIe modular power cables",
                isCorrect: true
            },
            {
                id: "diag-dead-cpu-and-ssd",
                label: "Simultaneous failure of both the CPU silicon and NVMe flash chips",
                isCorrect: false
            },
            {
                id: "diag-corrupt-bios-chip",
                label: "Desoldered BIOS EEPROM chip",
                isCorrect: false
            },
            {
                id: "diag-wrong-os-edition",
                label: "Incompatible operating system theme",
                isCorrect: false
            }
        ],
        repairs: [
            {
                id: "rep-fix-cpu-fan-and-latch-psu-cables",
                label: "Power off/unplug AC, connect the cooler fan to the dedicated CPU_FAN header, and firmly latch the 24-pin ATX and 8-pin PCIe modular cables",
                isCorrect: true,
                requiresPowerOff: true
            },
            {
                id: "rep-replace-entire-pc",
                label: "Scrap the entire workstation and order a new motherboard and CPU",
                isCorrect: false,
                requiresPowerOff: true
            },
            {
                id: "rep-remove-gpu-12",
                label: "Remove the graphics card and leave the cables loose",
                isCorrect: false,
                requiresPowerOff: true
            },
            {
                id: "rep-reset-network-12",
                label: "Reset the TCP/IP network stack",
                isCorrect: false,
                requiresPowerOff: false
            }
        ],
        verificationText: "CPU_FAN spins immediately on power-up, keeping idle temps at 34°C. The latched 24-pin and PCIe power cables deliver stable voltage, passing both POST and full 3D load tests!",
        educationalExplanation: "After a full PC rebuild, multiple symptoms often trace back to rushing the final wiring stage. Systematically verifying both thermal fan headers (`CPU_FAN`) and both ends of modular PSU cables resolves compound stability and thermal issues without replacing working hardware.",
        hints: {
            investigation: "In this expert challenge, investigate BOTH the CPU cooler fan header AND the modular power supply cable connections.",
            diagnosis: "Combine both findings: why is the CPU overheating at idle AND why is power delivery intermittent?",
            repair: "Power off and unplug AC, plug the cooler into `CPU_FAN`, and firmly latch both the 24-pin ATX and 8-pin PCIe power cables."
        }
    }
];
