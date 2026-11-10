/**
 * TypeKalang Word Dictionaries
 * Kevin's Hardware Studio Portfolio
 * Locally stored word sets categorized by difficulty level (Easy, Normal, Hard).
 */
(function (global) {
    "use strict";

    const TYPEKALANG_WORDS = {
        easy: [
            "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
            "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
            "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
            "an", "will", "my", "one", "all", "would", "there", "their", "what", "so",
            "up", "out", "if", "about", "who", "get", "which", "go", "me", "when",
            "make", "can", "like", "time", "no", "just", "him", "know", "take", "people",
            "into", "year", "your", "good", "some", "could", "them", "see", "other", "than",
            "then", "now", "look", "only", "come", "its", "over", "think", "also", "back",
            "after", "use", "two", "how", "our", "work", "first", "well", "way", "even",
            "new", "want", "any", "these", "give", "day", "most", "us", "code", "fast",
            "type", "open", "game", "file", "web", "site", "key", "test", "lamp", "desk",
            "hand", "mind", "hard", "soft", "page", "text", "form", "data", "link", "port",
            "chip", "cord", "read", "line", "cool", "stay", "view", "play", "book", "card",
            "plan", "road", "team", "call", "help", "show", "home", "move", "city", "tree",
            "wire", "gold", "dark", "blue", "path", "star", "note", "task", "tool", "glow",
            "step", "jump", "walk", "find", "keep", "feel", "hold", "turn", "talk", "start",
            "stop", "hear", "free", "room", "part", "side", "case", "size", "true", "name",
            "fact", "item", "past", "best", "idea", "long", "real", "high", "next", "both",
            "last", "late", "near", "safe", "sure", "fine", "pure", "calm", "deep", "wide"
        ],
        normal: [
            "system", "hardware", "software", "computer", "keyboard", "display", "memory",
            "storage", "monitor", "project", "student", "learning", "browser", "network",
            "circuit", "processor", "graphics", "website", "design", "explore", "solution",
            "problem", "challenge", "practice", "routine", "builder", "concept", "feature",
            "upgrade", "station", "desktop", "laptop", "battery", "adapter", "console",
            "terminal", "package", "library", "service", "program", "function", "variable",
            "element", "layout", "script", "content", "modern", "dynamic", "simple",
            "creative", "natural", "effort", "progress", "improve", "balance", "minimal",
            "profile", "contact", "message", "journal", "reflection", "preview", "arcade",
            "session", "digital", "analog", "module", "component", "surface", "canvas",
            "interface", "standard", "classic", "structure", "archive", "control", "history",
            "support", "device", "engine", "output", "input", "sensor", "button", "switch",
            "toggle", "signal", "power", "energy", "voltage", "current", "copper", "silver",
            "socket", "chassis", "airflow", "thermal", "passive", "active", "filter",
            "stream", "buffer", "matrix", "vector", "binary", "syntax", "runtime", "compile",
            "execute", "render", "deploy", "action", "workflow", "branch", "commit",
            "review", "status", "report", "metric", "speed", "timing", "record", "target",
            "score", "streak", "focus", "typing", "smooth", "steady", "rapid", "agile",
            "master", "player", "finish", "reboot", "update", "refresh", "accuracy", "challenge"
        ],
        hard: [
            "JavaScript,", "Python;", "Architecture", "Motherboard", "Performance",
            "Diagnostics", "Troubleshooting", "Microcontroller", "Asynchronous", "Optimization",
            "Accessibility", "Responsiveness", "Infrastructure", "Configuration", "Authentication",
            "Engineering;", "Implementation,", "Verification.", "Capabilities", "Specification",
            "Compatibility", "Bandwidth,", "Latency;", "Throughput.", "Hyperthreading",
            "Overclocking", "Semiconductor", "Polymorphism", "Encapsulation", "Inheritance,",
            "Abstraction;", "Synchronous", "Multi-threaded", "Full-stack,", "Client-side",
            "Server-side", "Database-driven", "Query-selector", "Event-listener", "Cross-platform",
            "Cache-control", "Git-commit", "Deploy-ready!", "Zero-latency", "High-efficiency",
            "State-machine", "Component-based", "TypeKalang-v2", "WPM-calculator", "Keyboard-layout",
            "Sub-millisecond", "Motherboard-PCB", "Power-supply", "DDR5-memory", "PCIe-Gen4",
            "NVMe-storage", "Clock-speed", "Floating-point", "Null-pointer", "Syntax-error!",
            "Buffer-overflow", "Stack-trace", "Micro-operation", "Instruction-set", "Thread-safe",
            "Race-condition", "Deadlock-free", "Immutable-state", "Pure-function", "Event-driven"
        ]
    };

    /**
     * Get a random batch of words for the chosen difficulty.
     * @param {string} difficulty - "easy" | "normal" | "hard"
     * @param {number} count - number of words to return
     * @returns {string[]}
     */
    function getRandomWords(difficulty, count = 60) {
        const pool = TYPEKALANG_WORDS[difficulty] || TYPEKALANG_WORDS.normal;
        const result = [];
        let prevWord = "";

        for (let i = 0; i < count; i++) {
            let pick;
            let attempts = 0;
            do {
                pick = pool[Math.floor(Math.random() * pool.length)];
                attempts++;
            } while (pick === prevWord && attempts < 5 && pool.length > 1);

            result.push(pick);
            prevWord = pick;
        }

        return result;
    }

    global.TypeKalangWords = {
        WORDS: TYPEKALANG_WORDS,
        getRandomWords: getRandomWords
    };

})(typeof window !== "undefined" ? window : this);
