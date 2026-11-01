/**
 * ============================================================================
 * CINEMATIC INTERSTELLAR BACKGROUND CONTROLLER — KEVIN CHRISTOPHER PORTFOLIO
 * Uses the actual reference image as the primary visual asset.
 * NO artificial black circles or canvas black hole drawings.
 * Coordinates smooth camera drift, subtle mouse parallax, and faint drifting starlight.
 * ============================================================================
 */

(function () {
    "use strict";

    const CONFIG = {
        // Desktop & mobile ambient starlight count
        desktopStars: 80,
        mobileStars: 35,

        // Max parallax offset in pixels
        maxParallaxX: 14,
        maxParallaxY: 9,
        lerpFactor: 0.045
    };

    let imageLayer = null;
    let canvas = null;
    let ctx = null;
    let animFrameId = null;
    let isRunning = false;
    let isReducedMotion = false;
    let isMobile = false;

    let width = 0;
    let height = 0;
    let dpr = 1;

    // Camera & Parallax State
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scroll = { y: 0, targetY: 0 };
    let driftTime = 0;

    // Drifting background stars
    let stars = [];

    function createStar() {
        const depth = 0.8 + Math.random() * 2.2;
        return {
            x: Math.random() * (width || 1920),
            y: Math.random() * (height || 1080),
            z: depth,
            size: (0.5 + Math.random() * 0.75) * (depth / 2),
            baseAlpha: 0.2 + Math.random() * 0.45,
            twinkleSpeed: 0.01 + Math.random() * 0.02,
            twinklePhase: Math.random() * Math.PI * 2,
            driftVx: -(0.03 / depth + Math.random() * 0.035),
            driftVy: 0.008 / depth,
            color: Math.random() > 0.6 ? "#e0f2fe" : (Math.random() > 0.3 ? "#ffffff" : "#fef3c7")
        };
    }

    function initStars() {
        const starCount = isMobile ? CONFIG.mobileStars : CONFIG.desktopStars;
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push(createStar());
        }
    }

    let lastWidth = 0;
    let lastHeight = 0;

    function resize() {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        // Prevent canvas wipe and layout stutter on mobile address bar show/hide
        if (lastWidth === newWidth && Math.abs(newHeight - lastHeight) < 140 && canvas && canvas.width > 0) {
            return;
        }

        width = newWidth;
        height = newHeight;
        lastWidth = width;
        lastHeight = height;
        isMobile = width <= 860 || ("ontouchstart" in window && width <= 1024);

        if (canvas && ctx) {
            dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        if (stars.length === 0) {
            initStars();
        }
    }

    function onMouseMove(e) {
        if (isMobile || isReducedMotion) return;
        const normX = (e.clientX / width) * 2 - 1; // -1 to 1
        const normY = (e.clientY / height) * 2 - 1;
        mouse.targetX = normX * CONFIG.maxParallaxX;
        mouse.targetY = normY * CONFIG.maxParallaxY;
    }

    function onScroll() {
        if (isMobile || isReducedMotion) return;
        // Desktop smooth continuous scroll offset (clamped, no modulo jumps)
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        scroll.targetY = Math.max(-18, Math.min(18, currentScrollY * 0.015));
    }

    function renderFrame() {
        driftTime += 0.006;

        // Smooth camera lerp for gentle desktop parallax
        mouse.x += (mouse.targetX - mouse.x) * CONFIG.lerpFactor;
        mouse.y += (mouse.targetY - mouse.y) * CONFIG.lerpFactor;
        scroll.y += (scroll.targetY - scroll.y) * CONFIG.lerpFactor;

        // Subtle autonomous camera drift & slow zoom breathing (24-second cycle)
        const autoDriftX = Math.sin(driftTime * 0.25) * 5;
        const autoDriftY = Math.cos(driftTime * 0.18) * 3.5;
        const zoom = 1.025 + Math.sin(driftTime * 0.12) * 0.008;

        const totalTranslateX = isMobile ? -autoDriftX : -(mouse.x + autoDriftX);
        const totalTranslateY = isMobile ? -autoDriftY : -(mouse.y + autoDriftY + scroll.y);

        // Apply butter-smooth transform to the actual image layer
        if (imageLayer && !isReducedMotion) {
            imageLayer.style.transform = `translate3d(${totalTranslateX.toFixed(2)}px, ${totalTranslateY.toFixed(2)}px, 0) scale(${zoom.toFixed(4)})`;
        }

        // Render ambient drifting starlight on transparent overlay canvas
        if (ctx) {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];
                s.x += s.driftVx;
                s.y += s.driftVy;

                if (s.x < -10) s.x = width + 10;
                if (s.x > width + 10) s.x = -10;
                if (s.y < -10) s.y = height + 10;
                if (s.y > height + 10) s.y = -10;

                s.twinklePhase += s.twinkleSpeed;
                const twinkle = 0.75 + 0.25 * Math.sin(s.twinklePhase);
                const alpha = Math.min(1, s.baseAlpha * twinkle);

                ctx.fillStyle = s.color;
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1.0;
        }

        if (isRunning && !isReducedMotion) {
            animFrameId = requestAnimationFrame(renderFrame);
        }
    }

    function start() {
        if (isRunning) return;
        isRunning = true;
        if (!isReducedMotion) {
            animFrameId = requestAnimationFrame(renderFrame);
        } else {
            if (imageLayer) {
                imageLayer.style.transform = "scale(1.02) translate3d(0, 0, 0)";
            }
        }
    }

    function stop() {
        isRunning = false;
        if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }
    }

    function handleVisibility() {
        if (document.hidden) {
            stop();
        } else {
            start();
        }
    }

    function handleMotionPreference(mediaQuery) {
        isReducedMotion = mediaQuery.matches;
        if (isReducedMotion) {
            stop();
            if (imageLayer) {
                imageLayer.style.transform = "scale(1.02) translate3d(0, 0, 0)";
            }
            if (ctx) {
                ctx.clearRect(0, 0, width, height);
            }
        } else {
            start();
        }
    }

    function init() {
        imageLayer = document.getElementById("interstellarImage");
        canvas = document.getElementById("interstellarStarfieldCanvas");

        if (canvas) {
            ctx = canvas.getContext("2d", { alpha: true });
        }

        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        isReducedMotion = motionQuery.matches;
        if (motionQuery.addEventListener) {
            motionQuery.addEventListener("change", handleMotionPreference);
        }

        window.addEventListener("resize", resize, { passive: true });
        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        document.addEventListener("visibilitychange", handleVisibility);

        resize();
        start();
    }

    window.InterstellarBackground = {
        init: init,
        start: start,
        stop: stop,
        resize: resize
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
