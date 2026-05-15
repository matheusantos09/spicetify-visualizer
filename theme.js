(function () {
    const DEFAULTS = {
        canvasHeight:  80,
        barWidth:      4,
        barGap:        2,
        opacity:       0.55,
        paletteIdx:    0,
    };

    const CFG_KEY = "spicetify-visualizer-config";

    function loadConfig() {
        try {
            const raw = Spicetify.LocalStorage.get(CFG_KEY);
            if (raw) return Object.assign({}, DEFAULTS, JSON.parse(raw));
        } catch (_) {}
        return Object.assign({}, DEFAULTS);
    }

    function saveConfig() {
        Spicetify.LocalStorage.set(CFG_KEY, JSON.stringify({
            canvasHeight: CANVAS_HEIGHT,
            barWidth:     BAR_WIDTH,
            barGap:       BAR_GAP,
            opacity:      CANVAS_OPACITY,
            paletteIdx:   currentPaletteIdx,
        }));
    }

    const _cfg = loadConfig();
    let CANVAS_HEIGHT  = _cfg.canvasHeight;
    let BAR_WIDTH      = _cfg.barWidth;
    let BAR_GAP        = _cfg.barGap;
    let CANVAS_OPACITY = _cfg.opacity;

    // ------------------------------------------------------------------
    // Palettes — all values are hex without #
    // ------------------------------------------------------------------
    // _encore: maps to Encore CSS vars (--background-*, --text-*, etc)
    // bg=main, bgHigh=highlight, bgPress=press, bgElev=elevated, bgElev2=elevated-highlight
    // accent=bright-accent, neg=negative, text=base text, textSub=subdued
    const PALETTES = {
        Dracula: {
            text:               "F8F8F2",
            subtext:            "6272A4",
            "nav-active-text":  "282A36",
            main:               "282A36",
            sidebar:            "21222C",
            player:             "21222C",
            card:               "313341",
            shadow:             "191A21",
            "main-secondary":   "1E1F29",
            button:             "BD93F9",
            "button-secondary": "9B72D9",
            "button-active":    "D4AFFF",
            "button-disabled":  "44475A",
            "nav-active":       "BD93F9",
            "play-button":      "BD93F9",
            "tab-active":       "282A36",
            notification:       "313341",
            "notification-error":"FF5555",
            "playback-bar":     "BD93F9",
            misc:               "FF79C6",
            _bar:    [189, 147, 249],
            _barTop: [255, 121, 198],
            _topbar: "21222C",
            _encore: {
                "background-base":              "282A36",
                "background-highlight":         "313341",
                "background-press":             "21222C",
                "background-elevated-base":     "313341",
                "background-elevated-highlight":"3A3B4A",
                "background-elevated-press":    "191A21",
                "text-base":                    "F8F8F2",
                "text-subdued":                 "6272A4",
                "text-bright-accent":           "D4AFFF",
                "text-negative":                "FF5555",
                "essential-base":               "F8F8F2",
                "essential-subdued":            "6272A4",
                "essential-bright-accent":      "BD93F9",
                "essential-negative":           "FF5555",
                "decorative-base":              "F8F8F2",
                "decorative-subdued":           "44475A",
            },
        },
        Orange: {
            text:               "FFFFFF",
            subtext:            "A0A0A0",
            "nav-active-text":  "FFFFFF",
            main:               "303336",
            sidebar:            "242629",
            player:             "242629",
            card:               "2A2D30",
            shadow:             "000000",
            "main-secondary":   "1E2022",
            button:             "EF8450",
            "button-secondary": "C96F3E",
            "button-active":    "EF8450",
            "button-disabled":  "3A3D42",
            "nav-active":       "EF8450",
            "play-button":      "EF8450",
            "tab-active":       "303336",
            notification:       "2A2D30",
            "notification-error":"FF5555",
            "playback-bar":     "EF8450",
            misc:               "FFFFFF",
            _bar:    [239, 132, 80],
            _barTop: [255, 200, 160],
            _topbar: "3A3D42",
            _encore: {
                "background-base":              "303336",
                "background-highlight":         "3A3D42",
                "background-press":             "242629",
                "background-elevated-base":     "2A2D30",
                "background-elevated-highlight":"323538",
                "background-elevated-press":    "1E2022",
                "text-base":                    "FFFFFF",
                "text-subdued":                 "A0A0A0",
                "text-bright-accent":           "EF8450",
                "text-negative":                "FF5555",
                "essential-base":               "FFFFFF",
                "essential-subdued":            "A0A0A0",
                "essential-bright-accent":      "EF8450",
                "essential-negative":           "FF5555",
                "decorative-base":              "FFFFFF",
                "decorative-subdued":           "3A3D42",
            },
        },
        Nord: {
            text:               "ECEFF4",
            subtext:            "7B8FAB",
            "nav-active-text":  "2E3440",
            main:               "2E3440",
            sidebar:            "272C36",
            player:             "272C36",
            card:               "3B4252",
            shadow:             "1C2028",
            "main-secondary":   "242933",
            button:             "88C0D0",
            "button-secondary": "6AA3B3",
            "button-active":    "A3D4E2",
            "button-disabled":  "4C566A",
            "nav-active":       "88C0D0",
            "play-button":      "88C0D0",
            "tab-active":       "2E3440",
            notification:       "3B4252",
            "notification-error":"BF616A",
            "playback-bar":     "88C0D0",
            misc:               "B48EAD",
            _bar:    [136, 192, 208],
            _barTop: [180, 142, 173],
            _topbar: "272C36",
            _encore: {
                "background-base":              "2E3440",
                "background-highlight":         "3B4252",
                "background-press":             "272C36",
                "background-elevated-base":     "3B4252",
                "background-elevated-highlight":"434C5E",
                "background-elevated-press":    "1C2028",
                "text-base":                    "ECEFF4",
                "text-subdued":                 "7B8FAB",
                "text-bright-accent":           "A3D4E2",
                "text-negative":                "BF616A",
                "essential-base":               "ECEFF4",
                "essential-subdued":            "7B8FAB",
                "essential-bright-accent":      "88C0D0",
                "essential-negative":           "BF616A",
                "decorative-base":              "ECEFF4",
                "decorative-subdued":           "4C566A",
            },
        },
        "Rosé Pine": {
            text:               "E0DEF4",
            subtext:            "908CAA",
            "nav-active-text":  "191724",
            main:               "191724",
            sidebar:            "1F1D2E",
            player:             "1F1D2E",
            card:               "26233A",
            shadow:             "110F1A",
            "main-secondary":   "21202E",
            button:             "EB6F92",
            "button-secondary": "C45C7A",
            "button-active":    "F28DAD",
            "button-disabled":  "403D52",
            "nav-active":       "EB6F92",
            "play-button":      "EB6F92",
            "tab-active":       "191724",
            notification:       "26233A",
            "notification-error":"EB6F92",
            "playback-bar":     "EB6F92",
            misc:               "F6C177",
            _bar:    [235, 111, 146],
            _barTop: [246, 193, 119],
            _topbar: "1F1D2E",
            _encore: {
                "background-base":              "191724",
                "background-highlight":         "26233A",
                "background-press":             "1F1D2E",
                "background-elevated-base":     "26233A",
                "background-elevated-highlight":"2E2B3D",
                "background-elevated-press":    "110F1A",
                "text-base":                    "E0DEF4",
                "text-subdued":                 "908CAA",
                "text-bright-accent":           "F28DAD",
                "text-negative":                "EB6F92",
                "essential-base":               "E0DEF4",
                "essential-subdued":            "908CAA",
                "essential-bright-accent":      "EB6F92",
                "essential-negative":           "EB6F92",
                "decorative-base":              "E0DEF4",
                "decorative-subdued":           "403D52",
            },
        },
        Catppuccin: {
            text:               "CDD6F4",
            subtext:            "6C7086",
            "nav-active-text":  "1E1E2E",
            main:               "1E1E2E",
            sidebar:            "181825",
            player:             "181825",
            card:               "313244",
            shadow:             "11111B",
            "main-secondary":   "141420",
            button:             "CBA6F7",
            "button-secondary": "A87FD9",
            "button-active":    "DCC0FF",
            "button-disabled":  "45475A",
            "nav-active":       "CBA6F7",
            "play-button":      "CBA6F7",
            "tab-active":       "1E1E2E",
            notification:       "313244",
            "notification-error":"F38BA8",
            "playback-bar":     "CBA6F7",
            misc:               "F5C2E7",
            _bar:    [203, 166, 247],
            _barTop: [245, 194, 231],
            _topbar: "181825",
            _encore: {
                "background-base":              "1E1E2E",
                "background-highlight":         "313244",
                "background-press":             "181825",
                "background-elevated-base":     "313244",
                "background-elevated-highlight":"3D3F52",
                "background-elevated-press":    "11111B",
                "text-base":                    "CDD6F4",
                "text-subdued":                 "6C7086",
                "text-bright-accent":           "DCC0FF",
                "text-negative":                "F38BA8",
                "essential-base":               "CDD6F4",
                "essential-subdued":            "6C7086",
                "essential-bright-accent":      "CBA6F7",
                "essential-negative":           "F38BA8",
                "decorative-base":              "CDD6F4",
                "decorative-subdued":           "45475A",
            },
        },
    };

    const PALETTE_KEYS = Object.keys(PALETTES);

    let currentPaletteIdx = _cfg.paletteIdx;
    let BASE_COLOR = PALETTES.Dracula._bar;
    let BAR_TOP_COLOR = PALETTES.Dracula._barTop;

    let barCount = 0;
    let audioData = null;
    let fallbackBpm = 120;
    let fallbackBarSeeds = null;
    let animFrameId = null;
    let canvas = null;
    let ctx = null;
    let barHeights = new Float32Array(0);
    let barVelocities = new Float32Array(0);
    let barDelays = new Float32Array(0);
    let barNoisePhase = new Float32Array(0);
    let targetsBuffer = new Float32Array(0);

    // Cached gradient strings — rebuilt only on palette change
    let gradBase = "rgba(189,147,249,0.9)";
    let gradTop  = "rgba(255,121,198,0.95)";

    // Current beat/segment index — advanced incrementally instead of scanning from 0
    let currentBeatIdx = 0;
    let currentSegIdx  = 0;

    function allocateBars(count) {
        if (count === barCount) return;
        const prev = barCount;
        barCount = count;
        const newHeights = new Float32Array(count);
        const newVelocities = new Float32Array(count);
        // Preserve existing physics state when resizing
        newHeights.set(barHeights.subarray(0, Math.min(prev, count)));
        newVelocities.set(barVelocities.subarray(0, Math.min(prev, count)));
        barHeights = newHeights;
        barVelocities = newVelocities;
        targetsBuffer = new Float32Array(count);
        barDelays = Float32Array.from({ length: count }, (_, i) => {
            const t = i / Math.max(count - 1, 1);
            return Math.sin(t * Math.PI * 3) * 30 + Math.cos(t * Math.PI * 7) * 20;
        });
        barNoisePhase = Float32Array.from({ length: count }, (_, i) => i * 1.618);
    }

    // ------------------------------------------------------------------
    // Canvas setup — injected behind the progress bar
    // ------------------------------------------------------------------
    function createCanvas() {
        if (canvas) canvas.remove();

        canvas = document.createElement("canvas");
        canvas.id = "spicetify-visualizer-canvas";
        canvas.height = CANVAS_HEIGHT;

        Object.assign(canvas.style, {
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
            height: CANVAS_HEIGHT + "px",
            pointerEvents: "none",
            zIndex: "0",
            opacity: String(CANVAS_OPACITY),
        });

        // Insert into now-playing bar
        const bar = document.querySelector(".Root__now-playing-bar");
        if (!bar) return;

        bar.style.position = "relative";
        bar.style.overflow = "hidden";
        bar.insertBefore(canvas, bar.firstChild);

        ctx = canvas.getContext("2d");
        resizeCanvas();
    }

    function resizeCanvas() {
        if (!canvas) return;
        const w = canvas.offsetWidth || window.innerWidth;
        canvas.width = w;
        const count = Math.floor(w / (BAR_WIDTH + BAR_GAP));
        allocateBars(count);
    }

    // ------------------------------------------------------------------
    // Audio data fetch
    // ------------------------------------------------------------------
    async function loadAudioData() {
        audioData = null;
        fallbackBpm = 120;
        fallbackBarSeeds = null;

        try {
            const data = await Spicetify.getAudioData();
            if (data && data.beats && data.segments) {
                audioData = data;
                return;
            }
        } catch (_) {}

        // No audio analysis — extract BPM from track metadata and seed bar shapes
        try {
            const meta = Spicetify.Player.data?.item;
            if (meta?.tempo) {
                fallbackBpm = meta.tempo;
            }
        } catch (_) {}

        // Per-bar random amplitude profile seeded from track URI (stable per song)
        const uri = Spicetify.Player.data?.item?.uri ?? "";
        let hash = 0;
        for (let i = 0; i < uri.length; i++) {
            hash = (Math.imul(31, hash) + uri.charCodeAt(i)) | 0;
        }
        fallbackBarSeeds = new Float32Array(barCount);
        for (let i = 0; i < barCount; i++) {
            hash = (Math.imul(1664525, hash) + 1013904223) | 0;
            const u = ((hash >>> 0) / 0xFFFFFFFF);
            // Shape: center bars taller (bass), sides shorter (treble)
            const pos = i / (barCount - 1);
            const curve = 1 - Math.abs(pos * 2 - 1) * 0.5;
            fallbackBarSeeds[i] = (u * 0.5 + 0.5) * curve;
        }
    }

    // ------------------------------------------------------------------
    // Get target bar heights from audio analysis at current position
    // ------------------------------------------------------------------
    function getTargetHeights(progressMs) {
        const targets = targetsBuffer;

        if (!audioData) {
            const t = progressMs / 1000;
            const beatInterval = 60 / fallbackBpm;
            const beatPhase = (t / beatInterval) % 1;

            const pulse = beatPhase < 0.15
                ? 1 - beatPhase / 0.15
                : Math.exp(-4 * (beatPhase - 0.15));

            for (let i = 0; i < barCount; i++) {
                const seed = fallbackBarSeeds ? fallbackBarSeeds[i % fallbackBarSeeds.length] : 0.7;
                targets[i] = pulse * seed * CANVAS_HEIGHT * 0.85;
            }
            return targets;
        }

        const t = progressMs / 1000;
        const beats = audioData.beats;
        const segments = audioData.segments;

        // Advance beat index incrementally (seek backward only on jump)
        if (currentBeatIdx >= beats.length || t < beats[currentBeatIdx].start) currentBeatIdx = 0;
        while (currentBeatIdx < beats.length - 1 && t >= beats[currentBeatIdx].start + beats[currentBeatIdx].duration) currentBeatIdx++;

        let beatEnergy = 0;
        const beat = beats[currentBeatIdx];
        if (beat && t >= beat.start && t < beat.start + beat.duration) {
            const beatPhase = (t - beat.start) / beat.duration;
            beatEnergy = Math.max(0.3, beat.confidence) * Math.max(0, 1 - beatPhase / 0.2);
        }

        // Advance segment index incrementally
        if (currentSegIdx >= segments.length || t < segments[currentSegIdx].start) currentSegIdx = 0;
        while (currentSegIdx < segments.length - 1 && t >= segments[currentSegIdx].start + segments[currentSegIdx].duration) currentSegIdx++;

        let pitchesA = null, pitchesB = null;
        let timbreA = null, timbreB = null;
        let segBlend = 0;
        let loudness = -30;

        const segA = segments[currentSegIdx];
        if (segA && t >= segA.start && t < segA.start + segA.duration) {
            const segB = segments[currentSegIdx + 1] ?? segA;
            const segPhase = (t - segA.start) / segA.duration;

            segBlend = Math.max(0, (segPhase - 0.7) / 0.3);
            pitchesA = segA.pitches;
            pitchesB = segB.pitches;
            timbreA  = segA.timbre;
            timbreB  = segB.timbre;

            const peakTime = segA.loudness_max_time / segA.duration;
            const loudPeak = segA.loudness_max ?? segA.loudness_start;
            const loudEnd  = segB.loudness_start ?? segA.loudness_start;
            if (segPhase < peakTime) {
                loudness = segA.loudness_start + (loudPeak - segA.loudness_start) * (segPhase / peakTime);
            } else {
                loudness = loudPeak + (loudEnd - loudPeak) * ((segPhase - peakTime) / (1 - peakTime));
            }
        }

        // Map loudness: typical music sits between -30 and 0 dB
        const loudnessFactor = Math.min(1, Math.max(0, (loudness + 30) / 30));

        for (let i = 0; i < barCount; i++) {
            const pos = i / barCount; // 0→1

            let val = 0;
            if (pitchesA) {
                // Each bar has a unique gaussian center across the 12 pitch classes
                // This creates distinct "peaks" of sensitivity per bar instead of linear interpolation
                const center = pos * 11; // which pitch class this bar is centered on
                let pitchSum = 0, weightSum = 0;
                for (let p = 0; p < 12; p++) {
                    const dist = Math.abs(p - center);
                    const w = Math.exp(-dist * dist * 0.8); // gaussian width ~1.1 semitones
                    const pVal = pitchesA[p] * (1 - segBlend) + pitchesB[p] * segBlend;
                    pitchSum += pVal * w;
                    weightSum += w;
                }
                const pitchVal = weightSum > 0 ? pitchSum / weightSum : 0;

                // Timbre: each bar sensitive to a different subset of timbre coefficients
                const tCenter = pos * 11;
                let timbreSum = 0, tWeightSum = 0;
                for (let t = 0; t < 12; t++) {
                    const dist = Math.abs(t - tCenter);
                    const w = Math.exp(-dist * dist * 0.5);
                    const tValA = Math.max(0, timbreA[t] / 100 + 0.5);
                    const tValB = Math.max(0, timbreB[t] / 100 + 0.5);
                    timbreSum += (tValA * (1 - segBlend) + tValB * segBlend) * w;
                    tWeightSum += w;
                }
                const timbreVal = Math.min(1, tWeightSum > 0 ? timbreSum / tWeightSum : 0.5);

                const beatWeight = 0.65 - pos * 0.45;
                val = Math.min(1, (pitchVal * 0.75 + timbreVal * 0.25) * loudnessFactor);
                val = Math.min(1, val + beatEnergy * beatWeight);
            } else {
                val = beatEnergy * 0.5;
            }

            targets[i] = val * CANVAS_HEIGHT * 0.9;
        }

        return targets;
    }

    // ------------------------------------------------------------------
    // Draw frame
    // ------------------------------------------------------------------
    function draw() {
        if (!ctx || !canvas) return;

        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        const progressMs = Spicetify.Player.getProgress();
        const targets = getTargetHeights(progressMs);

        // One gradient object per frame, shared by all bars
        const grad = ctx.createLinearGradient(0, h, 0, 0);
        grad.addColorStop(0, gradBase);
        grad.addColorStop(1, gradTop);
        ctx.fillStyle = grad;

        for (let i = 0; i < barCount; i++) {
            const delayFactor = 1 - Math.abs(barDelays[i]) / 120;
            const target = targets[i] * delayFactor;

            barNoisePhase[i] += 0.018 + i * 0.0003;
            const noise = Math.sin(barNoisePhase[i]) * 1.5;

            const diff = (target + noise) - barHeights[i];
            if (diff > 0) {
                barVelocities[i] += diff * 0.3;
                barVelocities[i] *= 0.6;
            } else {
                barVelocities[i] += diff * 0.02;
                barVelocities[i] *= 0.97;
            }
            barHeights[i] = Math.max(0, barHeights[i] + barVelocities[i]);

            const bh = barHeights[i];
            if (bh < 1) continue;

            const x = BAR_GAP + i * (BAR_WIDTH + BAR_GAP);
            const y = h - bh;

            ctx.beginPath();
            ctx.roundRect(x, y, BAR_WIDTH, bh, [2, 2, 0, 0]);
            ctx.fill();
        }

        animFrameId = requestAnimationFrame(draw);
    }

    // ------------------------------------------------------------------
    // Lifecycle
    // ------------------------------------------------------------------
    function start() {
        if (animFrameId) cancelAnimationFrame(animFrameId);
        draw();
    }

    function stop() {
        if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }
        if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    async function onSongChange() {
        currentBeatIdx = 0;
        currentSegIdx  = 0;
        await loadAudioData();
    }

    function onPlayPause() {
        if (Spicetify.Player.isPlaying()) {
            start();
        } else {
            stop();
        }
    }

    // ------------------------------------------------------------------
    // Palette switcher
    // ------------------------------------------------------------------
    function hexToRgb(hex) {
        const n = parseInt(hex.replace("#", ""), 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    function applyPalette(idx) {
        const name = PALETTE_KEYS[idx];
        const p = PALETTES[name];

        let styleEl = document.getElementById("spicetify-palette-override");
        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = "spicetify-palette-override";
            document.head.appendChild(styleEl);
        }

        const spiceVars = Object.entries(p)
            .filter(([k]) => !k.startsWith("_"))
            .map(([k, v]) => {
                const [r, g, b] = hexToRgb(v);
                return `--spice-${k}: #${v}; --spice-rgb-${k}: ${r},${g},${b};`;
            })
            .join("\n        ");

        const encoreVars = Object.entries(p._encore ?? {})
            .map(([k, v]) => `--${k}: #${v};`)
            .join("\n        ");

        styleEl.textContent = `html body {\n        ${spiceVars}\n        ${encoreVars}\n    }`;

        // Update topbar hardcoded color
        let topbarEl = document.getElementById("spicetify-topbar-override");
        if (!topbarEl) {
            topbarEl = document.createElement("style");
            topbarEl.id = "spicetify-topbar-override";
            document.head.appendChild(topbarEl);
        }
        topbarEl.textContent = `.main-topBar-background { background-color: #${p._topbar} !important; }`;

        // Update visualizer colors and cached gradient strings
        BASE_COLOR = p._bar;
        BAR_TOP_COLOR = p._barTop;
        gradBase = `rgba(${BASE_COLOR[0]},${BASE_COLOR[1]},${BASE_COLOR[2]},0.9)`;
        gradTop  = `rgba(${BAR_TOP_COLOR[0]},${BAR_TOP_COLOR[1]},${BAR_TOP_COLOR[2]},0.95)`;

        // Update Topbar button label and tooltip
        if (paletteBtn) {
            const label = `Theme: ${name}`;
            paletteBtn.label = label;
            if (paletteBtn.tippy) {
                paletteBtn.tippy.setContent(label);
            } else if (paletteBtn.element) {
                paletteBtn.element.setAttribute("aria-label", label);
                paletteBtn.element.title = label;
            }
        }

        currentPaletteIdx = idx;
        saveConfig();
    }

    function openConfigModal() {
        const content = document.createElement("div");
        content.style.cssText = "padding: 16px; display: flex; flex-direction: column; gap: 16px; min-width: 320px;";

        // Palette selector
        const paletteRow = document.createElement("div");
        paletteRow.style.cssText = "display: flex; flex-direction: column; gap: 6px;";
        const paletteLabel = document.createElement("label");
        paletteLabel.textContent = "Theme palette";
        paletteLabel.style.cssText = "font-size: 13px; font-weight: 600; color: var(--spice-subtext);";
        const paletteSelect = document.createElement("select");
        paletteSelect.style.cssText = "background: var(--spice-card); color: var(--spice-text); border: 1px solid var(--spice-button-disabled); border-radius: 6px; padding: 6px 10px; font-size: 14px; cursor: pointer;";
        PALETTE_KEYS.forEach((name, idx) => {
            const opt = document.createElement("option");
            opt.value = idx;
            opt.textContent = name;
            if (idx === currentPaletteIdx) opt.selected = true;
            paletteSelect.appendChild(opt);
        });
        paletteRow.appendChild(paletteLabel);
        paletteRow.appendChild(paletteSelect);

        // Slider helper
        function makeSlider(label, min, max, step, value, onInput) {
            const row = document.createElement("div");
            row.style.cssText = "display: flex; flex-direction: column; gap: 6px;";
            const header = document.createElement("div");
            header.style.cssText = "display: flex; justify-content: space-between; align-items: center;";
            const lbl = document.createElement("label");
            lbl.textContent = label;
            lbl.style.cssText = "font-size: 13px; font-weight: 600; color: var(--spice-subtext);";
            const val = document.createElement("span");
            val.textContent = value;
            val.style.cssText = "font-size: 13px; color: var(--spice-text); min-width: 32px; text-align: right;";
            header.appendChild(lbl);
            header.appendChild(val);
            const slider = document.createElement("input");
            slider.type = "range";
            slider.min = min; slider.max = max; slider.step = step; slider.value = value;
            slider.style.cssText = "width: 100%; accent-color: var(--spice-button); cursor: pointer;";
            slider.addEventListener("input", () => { val.textContent = slider.value; onInput(Number(slider.value)); });
            row.appendChild(header);
            row.appendChild(slider);
            return row;
        }

        // Reset button
        const resetBtn = document.createElement("button");
        resetBtn.textContent = "Reset to defaults";
        resetBtn.style.cssText = "margin-top: 4px; padding: 8px; border-radius: 6px; border: 1px solid var(--spice-button-disabled); background: transparent; color: var(--spice-subtext); font-size: 13px; cursor: pointer;";
        resetBtn.addEventListener("mouseenter", () => resetBtn.style.color = "var(--spice-text)");
        resetBtn.addEventListener("mouseleave", () => resetBtn.style.color = "var(--spice-subtext)");
        resetBtn.addEventListener("click", () => {
            CANVAS_HEIGHT  = DEFAULTS.canvasHeight;
            BAR_WIDTH      = DEFAULTS.barWidth;
            BAR_GAP        = DEFAULTS.barGap;
            CANVAS_OPACITY = DEFAULTS.opacity;
            applyPalette(DEFAULTS.paletteIdx);
            if (canvas) { canvas.style.height = CANVAS_HEIGHT + "px"; canvas.style.opacity = String(CANVAS_OPACITY); }
            resizeCanvas();
            saveConfig();
            Spicetify.PopupModal.hide();
            openConfigModal();
        });

        const opacitySlider  = makeSlider("Visualizer opacity", 0.1, 1.0, 0.05, CANVAS_OPACITY, v => { CANVAS_OPACITY = v; if (canvas) canvas.style.opacity = String(v); saveConfig(); });
        const heightSlider   = makeSlider("Visualizer height (px)", 40, 200, 4, CANVAS_HEIGHT, v => { CANVAS_HEIGHT = v; if (canvas) { canvas.style.height = v + "px"; canvas.height = v; } resizeCanvas(); saveConfig(); });
        const barWidthSlider = makeSlider("Bar width (px)", 1, 16, 1, BAR_WIDTH, v => { BAR_WIDTH = v; resizeCanvas(); saveConfig(); });
        const barGapSlider   = makeSlider("Bar gap (px)", 0, 8, 1, BAR_GAP, v => { BAR_GAP = v; resizeCanvas(); saveConfig(); });

        paletteSelect.addEventListener("change", () => { applyPalette(Number(paletteSelect.value)); });

        content.appendChild(paletteRow);
        content.appendChild(opacitySlider);
        content.appendChild(heightSlider);
        content.appendChild(barWidthSlider);
        content.appendChild(barGapSlider);
        content.appendChild(resetBtn);

        Spicetify.PopupModal.display({ title: "spicetify Visualizer", content, isLarge: false });
    }

    let paletteBtn = null;

    function injectPaletteButton() {
        if (!Spicetify.Topbar?.Button || paletteBtn) return;

        const ICON = `<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="currentColor">
            <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
        </svg>`;

        paletteBtn = new Spicetify.Topbar.Button(
            "spicetify config",
            ICON,
            openConfigModal,
        );
    }

    // ------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------
    function init() {
        // Wait for player bar DOM node before creating canvas
        const domInterval = setInterval(() => {
            const bar = document.querySelector(".Root__now-playing-bar");
            if (!bar) {
                console.log("[spicetify-visualizer] waiting for player bar DOM...");
                return;
            }
            clearInterval(domInterval);

            // Restore saved palette (config already loaded at startup)
            if (currentPaletteIdx >= 0 && currentPaletteIdx < PALETTE_KEYS.length) {
                applyPalette(currentPaletteIdx);
            }

            createCanvas();
            injectPaletteButton();

            window.addEventListener("resize", resizeCanvas);

            Spicetify.Player.addEventListener("songchange", onSongChange);
            Spicetify.Player.addEventListener("onplaypause", onPlayPause);

            loadAudioData().then(() => {
                if (Spicetify.Player.isPlaying()) start();
            });
        }, 300);
    }

    // Wait for Spicetify to be ready
    const spiceInterval = setInterval(() => {
        if (Spicetify?.Player?.addEventListener) {
            clearInterval(spiceInterval);
            init();
        }
    }, 300);
})();
