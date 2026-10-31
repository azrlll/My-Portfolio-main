/**
 * ============================================================================
 * CINEMATIC MOVING BLACK HOLE BACKGROUND — KEVIN CHRISTOPHER PORTFOLIO
 * Realistic, Interstellar Gargantua-inspired animated space environment:
 * - Glowing black hole with relativistic accretion disk
 * - Keplerian plasma particle streams & Einstein lensing deflection
 * - Drifting multi-layered cosmic starfield with gravitational lensing
 * - Smooth desktop mouse parallax, autonomous camera drift & scroll depth
 * - High performance, battery conscious, paused when hidden, reduced-motion safe
 * ============================================================================
 */

(function () {
    "use strict";

    // ------------------------------------------------------------------------
    // CONFIGURATION & TUNING CONSTANTS
    // ------------------------------------------------------------------------
    const CONFIG = {
        // Starfield count
        desktopStars: 140,
        mobileStars: 60,

        // Relativistic accretion plasma particles
        desktopPlasmaCount: 65,
        mobilePlasmaCount: 28,

        // Accretion disk tilt angle in radians (~ -13.5 degrees)
        diskTilt: -0.235,
        diskEccentricity: 0.30, // Flattening ratio for 3D perspective

        // Lensing & physics
        lensingStrength: 1800,
        maxCameraOffset: 20, // Max mouse parallax in px
        lerpFactor: 0.045,

        // Asset path
        assetUrl: "image/blackhole-cinematic.png"
    };

    let canvas = null;
    let ctx = null;
    let animFrameId = null;
    let isRunning = false;
    let isReducedMotion = false;
    let isMobile = false;
    let dpr = 1;

    let width = 0;
    let height = 0;

    // Camera & Parallax State
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scroll = { y: 0, targetY: 0 };
    let driftTime = 0;

    // Astronomical Elements
    let stars = [];
    let plasmaParticles = [];
    let baseImg = null;
    let baseImgLoaded = false;

    // ------------------------------------------------------------------------
    // PREPARE OBJECT POOLS
    // ------------------------------------------------------------------------
    function createStar() {
        const depth = 0.8 + Math.random() * 2.2; // 1 to 3
        return {
            x: Math.random() * (width || 1920),
            y: Math.random() * (height || 1080),
            z: depth,
            size: (0.55 + Math.random() * 0.95) * (depth / 2),
            baseAlpha: 0.35 + Math.random() * 0.55,
            twinkleSpeed: 0.012 + Math.random() * 0.022,
            twinklePhase: Math.random() * Math.PI * 2,
            driftVx: -(0.035 / depth + Math.random() * 0.04),
            driftVy: 0.01 / depth,
            // Subtle stellar color temperature: cool blue-white, pure white, or soft amber
            color: Math.random() > 0.65 ? "#dbeafe" : (Math.random() > 0.4 ? "#ffffff" : "#fef3c7")
        };
    }

    function createPlasmaParticle(bhRadius) {
        const minR = bhRadius * 1.15;
        const maxR = bhRadius * 3.4;
        const r = minR + Math.pow(Math.random(), 1.6) * (maxR - minR);
        // Keplerian orbital velocity: closer matter orbits faster
        const norm = (r - minR) / (maxR - minR);
        const speed = (0.0035 + (1 - norm) * 0.0075) * (Math.random() > 0.05 ? 1 : 1);

        return {
            r: r,
            angle: Math.random() * Math.PI * 2,
            speed: speed,
            length: 12 + Math.random() * 32,
            baseAlpha: 0.25 + Math.random() * 0.65,
            size: 1.2 + Math.random() * 1.8,
            band: Math.random() // Used for vertical oscillation
        };
    }

    function initAstronomicalElements() {
        const starCount = isMobile ? CONFIG.mobileStars : CONFIG.desktopStars;
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push(createStar());
        }

        const bhRadius = getBlackHoleRadius();
        const plasmaCount = isMobile ? CONFIG.mobilePlasmaCount : CONFIG.desktopPlasmaCount;
        plasmaParticles = [];
        for (let i = 0; i < plasmaCount; i++) {
            plasmaParticles.push(createPlasmaParticle(bhRadius));
        }
    }

    function getBlackHoleCenter() {
        // Desktop: slightly offset to right-center so left-aligned content is framed
        // Mobile: horizontally centered
        const cx = isMobile ? width * 0.50 : width * 0.56;
        const cy = isMobile ? height * 0.38 : height * 0.45;
        return { cx, cy };
    }

    function getBlackHoleRadius() {
        const minDim = Math.min(width, height);
        if (isMobile) {
            return Math.max(75, minDim * 0.22);
        }
        return Math.max(110, Math.min(185, minDim * 0.23));
    }

    // ------------------------------------------------------------------------
    // CANVAS RESIZE & HIGH-DPI SCALING
    // ------------------------------------------------------------------------
    function resize() {
        if (!canvas) return;

        width = window.innerWidth;
        height = window.innerHeight;
        isMobile = width <= 768;

        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (stars.length === 0 || plasmaParticles.length === 0) {
            initAstronomicalElements();
        }
    }

    // ------------------------------------------------------------------------
    // INTERACTION & CAMERA PARALLAX
    // ------------------------------------------------------------------------
    function onMouseMove(e) {
        if (isMobile || isReducedMotion) return;
        const normX = (e.clientX / width) * 2 - 1; // -1 to 1
        const normY = (e.clientY / height) * 2 - 1;
        mouse.targetX = normX * CONFIG.maxCameraOffset;
        mouse.targetY = normY * (CONFIG.maxCameraOffset * 0.65);
    }

    function onScroll() {
        if (isReducedMotion) return;
        scroll.targetY = (window.pageYOffset || document.documentElement.scrollTop || 0) * 0.06;
    }

    // ------------------------------------------------------------------------
    // RENDERING PIPELINE
    // ------------------------------------------------------------------------
    function renderFrame(time) {
        if (!ctx) return;

        driftTime += 0.008;

        // Smooth camera lerp
        mouse.x += (mouse.targetX - mouse.x) * CONFIG.lerpFactor;
        mouse.y += (mouse.targetY - mouse.y) * CONFIG.lerpFactor;
        scroll.y += (scroll.targetY - scroll.y) * CONFIG.lerpFactor;

        // Very slow autonomous drift (cosmic cruise feeling)
        const autoDriftX = Math.sin(driftTime * 0.15) * 8;
        const autoDriftY = Math.cos(driftTime * 0.11) * 6;

        const camX = mouse.x + autoDriftX;
        const camY = mouse.y + autoDriftY - (scroll.y % (height * 0.35));

        const { cx, cy } = getBlackHoleCenter();
        const bhX = cx + camX;
        const bhY = cy + camY;
        const bhRadius = getBlackHoleRadius();

        // 1. CLEAR WITH DEEP COSMIC VOID
        ctx.fillStyle = "#030307";
        ctx.fillRect(0, 0, width, height);

        // 2. SOFT AMBIENT INTERSTELLAR NEBULA GLOW
        const nebGrad = ctx.createRadialGradient(bhX, bhY, bhRadius * 0.4, bhX, bhY, bhRadius * 4.2);
        nebGrad.addColorStop(0, "rgba(56, 189, 248, 0.09)");
        nebGrad.addColorStop(0.35, "rgba(99, 102, 241, 0.05)");
        nebGrad.addColorStop(0.75, "rgba(244, 63, 94, 0.025)");
        nebGrad.addColorStop(1, "rgba(3, 3, 7, 0)");
        ctx.fillStyle = nebGrad;
        ctx.fillRect(0, 0, width, height);

        // 3. DRIFTING STARFIELD WITH GRAVITATIONAL LENSING DEFLECTION
        renderStarfield(bhX, bhY, bhRadius);

        // 4. CINEMATIC BLACK HOLE ASSET / BASE PROCEDURAL
        renderBlackHoleBase(bhX, bhY, bhRadius, time);

        // 5. RELATIVISTIC ACCRETION DISK PLASMA STREAMS
        renderAccretionPlasma(bhX, bhY, bhRadius);

        // 6. RELATIVISTIC PHOTON RING GLOW & SHIMMER
        renderPhotonRing(bhX, bhY, bhRadius, time);

        // Continue animation loop if active
        if (isRunning && !isReducedMotion) {
            animFrameId = requestAnimationFrame(renderFrame);
        }
    }

    // ------------------------------------------------------------------------
    // LAYER 3: STARFIELD & LENSING WARP
    // ------------------------------------------------------------------------
    function renderStarfield(bhX, bhY, bhRadius) {
        const lensRadius = bhRadius * 2.8;

        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];

            // Update drift
            s.x += s.driftVx;
            s.y += s.driftVy;

            // Wrap edges smoothly
            if (s.x < -20) s.x = width + 20;
            if (s.x > width + 20) s.x = -20;
            if (s.y < -20) s.y = height + 20;
            if (s.y > height + 20) s.y = -20;

            // Gravitational lensing deflection
            let renderX = s.x;
            let renderY = s.y;

            const dx = s.x - bhX;
            const dy = s.y - bhY;
            const dist = Math.hypot(dx, dy);

            // If behind the event horizon shadow, star is occluded
            if (dist < bhRadius * 0.92) {
                continue;
            }

            // Deflect light rays around the black hole if within lensing sphere
            if (dist < lensRadius && dist > 1) {
                const deflection = (CONFIG.lensingStrength / (dist * dist + 400)) * ((lensRadius - dist) / lensRadius);
                renderX += (dx / dist) * deflection * 8;
                renderY += (dy / dist) * deflection * 8;
            }

            // Twinkle calculation
            s.twinklePhase += s.twinkleSpeed;
            const twinkle = 0.7 + 0.3 * Math.sin(s.twinklePhase);
            const alpha = Math.min(1, s.baseAlpha * twinkle);

            ctx.fillStyle = s.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(renderX, renderY, s.size, 0, Math.PI * 2);
            ctx.fill();

            // Rare bright star subtle diffraction glow
            if (s.size > 1.3 && alpha > 0.7) {
                ctx.globalAlpha = alpha * 0.28;
                ctx.fillRect(renderX - 3.5, renderY - 0.5, 7, 1);
                ctx.fillRect(renderX - 0.5, renderY - 3.5, 1, 7);
            }
        }
        ctx.globalAlpha = 1.0;
    }

    // ------------------------------------------------------------------------
    // LAYER 4: BLACK HOLE BASE (ASSET + REINFORCED EVENT HORIZON)
    // ------------------------------------------------------------------------
    function renderBlackHoleBase(bhX, bhY, bhRadius, time) {
        if (baseImgLoaded && baseImg) {
            // Draw high-resolution cinematic reference image
            // Aspect ratio ~ 1024 / 432 = 2.37
            const targetWidth = isMobile
                ? Math.max(width * 1.35, 620)
                : Math.max(width * 1.02, 1280);
            const targetHeight = targetWidth * (baseImg.height / baseImg.width);

            // Subtle breathing scale (very slow, cinematic)
            const breath = 1 + 0.012 * Math.sin(driftTime * 0.35);
            const renderW = targetWidth * breath;
            const renderH = targetHeight * breath;

            ctx.drawImage(
                baseImg,
                bhX - renderW * 0.5,
                bhY - renderH * 0.51,
                renderW,
                renderH
            );
        } else {
            // High-fidelity procedural fallback if image is still loading
            drawProceduralBlackHole(bhX, bhY, bhRadius);
        }

        // PITCH BLACK EVENT HORIZON (SINGULARITY SHADOW)
        // Mathematically ensures the center absorbs 100% of light
        ctx.save();
        ctx.fillStyle = "#010103";
        ctx.beginPath();
        ctx.ellipse(bhX, bhY, bhRadius * 0.88, bhRadius * 0.86, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawProceduralBlackHole(bhX, bhY, bhRadius) {
        ctx.save();
        ctx.translate(bhX, bhY);
        ctx.rotate(CONFIG.diskTilt);

        // Luminous accretion disk back glow
        const grad = ctx.createRadialGradient(0, 0, bhRadius * 0.85, 0, 0, bhRadius * 3.2);
        grad.addColorStop(0, "rgba(224, 242, 254, 0.95)");
        grad.addColorStop(0.18, "rgba(147, 197, 253, 0.75)");
        grad.addColorStop(0.45, "rgba(59, 130, 246, 0.45)");
        grad.addColorStop(0.75, "rgba(244, 63, 94, 0.18)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = grad;
        ctx.scale(1, CONFIG.diskEccentricity);
        ctx.beginPath();
        ctx.arc(0, 0, bhRadius * 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // ------------------------------------------------------------------------
    // LAYER 5: ACCRETION DISK RELATIVISTIC PLASMA STREAMS
    // ------------------------------------------------------------------------
    function renderAccretionPlasma(bhX, bhY, bhRadius) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";

        const cosTilt = Math.cos(CONFIG.diskTilt);
        const sinTilt = Math.sin(CONFIG.diskTilt);

        for (let i = 0; i < plasmaParticles.length; i++) {
            const p = plasmaParticles[i];

            // Advance particle angle based on Keplerian orbital velocity
            p.angle += p.speed;
            if (p.angle > Math.PI * 2) p.angle -= Math.PI * 2;

            const cosA = Math.cos(p.angle);
            const sinA = Math.sin(p.angle);

            // Elliptical planar coordinates
            let px = p.r * cosA;
            let py = p.r * CONFIG.diskEccentricity * sinA;

            // GRAVITATIONAL LENSING OF BACKGROUND MATTER:
            // When plasma passes behind the black hole (sinA < -0.15),
            // general relativity lenses light up and over the event horizon!
            if (sinA < -0.12) {
                const backLensingFactor = Math.pow(Math.abs(sinA), 1.6);
                py -= backLensingFactor * (bhRadius * 1.15);
            }

            // Rotate into accretion disk inclination
            const rx = bhX + (px * cosTilt - py * sinTilt);
            const ry = bhY + (px * sinTilt + py * cosTilt);

            // RELATIVISTIC DOPPLER BEAMING:
            // Matter orbiting towards the observer (cosA < 0) is blue-shifted & brighter.
            // Matter orbiting away (cosA > 0) is red-shifted & dimmer.
            const doppler = 1.0 - cosA * 0.55;
            const alpha = Math.min(0.9, p.baseAlpha * doppler * 0.7);

            // Doppler color selection
            let color = "rgba(191, 219, 254, ";
            if (cosA < -0.2) {
                // Approaching: bright electric cyan-white
                color = "rgba(224, 242, 254, ";
            } else if (cosA > 0.3) {
                // Receding: warm amber-coral
                color = "rgba(254, 205, 211, ";
            }

            ctx.strokeStyle = color + alpha + ")";
            ctx.lineWidth = p.size;
            ctx.lineCap = "round";

            // Draw motion streak along orbit
            const trailAngle = p.angle - (p.speed * (p.length / 5));
            let tpx = p.r * Math.cos(trailAngle);
            let tpy = p.r * CONFIG.diskEccentricity * Math.sin(trailAngle);
            if (Math.sin(trailAngle) < -0.12) {
                tpy -= Math.pow(Math.abs(Math.sin(trailAngle)), 1.6) * (bhRadius * 1.15);
            }
            const trx = bhX + (tpx * cosTilt - tpy * sinTilt);
            const try_ = bhY + (tpx * sinTilt + tpy * cosTilt);

            ctx.beginPath();
            ctx.moveTo(trx, try_);
            ctx.lineTo(rx, ry);
            ctx.stroke();
        }

        ctx.restore();
    }

    // ------------------------------------------------------------------------
    // LAYER 6: PHOTON RING BREATHING & SHIMMER WAVES
    // ------------------------------------------------------------------------
    function renderPhotonRing(bhX, bhY, bhRadius, time) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";

        // Thin incandescent photon halo hugging the event horizon
        const pulse = 1 + 0.025 * Math.sin(driftTime * 0.6);
        const ringR = bhRadius * 0.89 * pulse;

        // Subtle gradient ring
        ctx.strokeStyle = "rgba(219, 234, 254, 0.45)";
        ctx.lineWidth = isMobile ? 2.5 : 3.8;
        ctx.beginPath();
        ctx.ellipse(bhX, bhY, ringR, ringR * 0.98, 0, 0, Math.PI * 2);
        ctx.stroke();

        // High-intensity Doppler crest on left side
        ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
        ctx.lineWidth = isMobile ? 1.5 : 2.2;
        ctx.beginPath();
        ctx.ellipse(bhX, bhY, ringR, ringR * 0.98, 0, Math.PI * 0.65, Math.PI * 1.35);
        ctx.stroke();

        ctx.restore();
    }

    // ------------------------------------------------------------------------
    // LIFECYCLE, VISIBILITY & ACCESSIBILITY
    // ------------------------------------------------------------------------
    function start() {
        if (isRunning) return;
        isRunning = true;
        if (!isReducedMotion) {
            animFrameId = requestAnimationFrame(renderFrame);
        } else {
            // Render a single static pristine frame for reduced motion
            renderFrame(0);
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
            renderFrame(0);
        } else {
            start();
        }
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION ENTRY POINT
    // ------------------------------------------------------------------------
    function init() {
        canvas = document.getElementById("blackHoleCanvas");
        if (!canvas) return;

        ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        // Check reduced motion preference
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        isReducedMotion = motionQuery.matches;
        if (motionQuery.addEventListener) {
            motionQuery.addEventListener("change", handleMotionPreference);
        }

        // Preload cinematic background asset
        baseImg = new Image();
        baseImg.src = CONFIG.assetUrl;
        baseImg.onload = function () {
            baseImgLoaded = true;
            if (isReducedMotion) {
                renderFrame(0);
            }
        };

        // Event listeners
        window.addEventListener("resize", resize, { passive: true });
        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        document.addEventListener("visibilitychange", handleVisibility);

        resize();
        start();
    }

    // Expose API for external control or debugging
    window.CinematicBlackHole = {
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
