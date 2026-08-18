/**
 * OmniAgent Full-Screen 3D Celestial Orbitals & Top-Layer Sparkle Engine
 */
class HighVoltageBackground {
    constructor() {
        // 1. Background 3D Galaxy Canvas (Bottom Layer)
        this.bgCanvas = document.createElement('canvas');
        this.bgCtx = this.bgCanvas.getContext('2d');
        this.bgCanvas.id = 'ambient-canvas';
        document.body.prepend(this.bgCanvas);

        // 2. Dedicated Top-Layer Sparkle Canvas (Renders over All Sidebars & Buttons)
        this.sparkleCanvas = document.createElement('canvas');
        this.sparkleCtx = this.sparkleCanvas.getContext('2d');
        this.sparkleCanvas.id = 'sparkle-canvas';
        this.sparkleCanvas.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:99999; pointer-events:none;';
        document.body.appendChild(this.sparkleCanvas);

        this.particles = [];
        this.orbitalRings = [];
        this.cometTrail = [];
        this.confettiPops = [];
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
        this.isThinking = false;
        this.isLightMode = document.body.classList.contains('light-theme');
        this.angle = 0;
        this.dpr = window.devicePixelRatio || 1;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.active = true;
            this.addCometParticle(e.clientX, e.clientY);
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
                this.mouse.active = true;
                this.addCometParticle(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        this.createParticles();
        this.createOrbitals();
        this.animate();
    }

    resize() {
        this.dpr = window.devicePixelRatio || 1;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        [this.bgCanvas, this.sparkleCanvas].forEach(c => {
            c.width = this.width * this.dpr;
            c.height = this.height * this.dpr;
            c.style.width = `${this.width}px`;
            c.style.height = `${this.height}px`;
        });

        this.bgCtx.scale(this.dpr, this.dpr);
        this.sparkleCtx.scale(this.dpr, this.dpr);
    }

    setTheme(mode) {
        this.isLightMode = (mode === 'light');
        this.createParticles();
        this.createOrbitals();
    }

    // 🎉 Dramatic Cyber Party Popper Cannons
    firePartyPopper(type = 'both') {
        const colors = this.isLightMode 
            ? ['#cd0029', '#ff003c', '#ff6b81', '#ff9f1a', '#e056fd', '#0f172a'] 
            : ['#ff003c', '#ffffff', '#ff3b5c', '#ffd32a', '#0be881', '#ff5e57'];

        const origins = [];
        if (type === 'left' || type === 'both') origins.push({ x: 30, y: this.height - 20, angle: -Math.PI / 4 });
        if (type === 'right' || type === 'both') origins.push({ x: this.width - 30, y: this.height - 20, angle: -3 * Math.PI / 4 });
        if (type === 'center') origins.push({ x: this.width / 2, y: this.height - 40, angle: -Math.PI / 2 });

        origins.forEach(origin => {
            for (let i = 0; i < 45; i++) {
                const spread = (Math.random() - 0.5) * 0.85;
                const speed = Math.random() * 18 + 10;
                const finalAngle = origin.angle + spread;
                this.confettiPops.push({
                    x: origin.x,
                    y: origin.y,
                    vx: Math.cos(finalAngle) * speed,
                    vy: Math.sin(finalAngle) * speed,
                    gravity: 0.45,
                    rotation: Math.random() * 360,
                    rotSpeed: (Math.random() - 0.5) * 22,
                    size: Math.random() * 9 + 5,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    shape: Math.random() > 0.4 ? 'rect' : 'circle',
                    alpha: 1.0,
                    decay: Math.random() * 0.015 + 0.012
                });
            }
        });
    }

    // ✨ Bold, Glowing Cherry Red Cursor Sparkles Everywhere
    addCometParticle(x, y) {
        const redPalette = ['#ff003c', '#cd0029', '#ff1a47', '#ff4d6d', '#ffffff'];
        for (let i = 0; i < 4; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3.0 + 1.0;
            this.cometTrail.push({
                x: x + (Math.random() - 0.5) * 8,
                y: y + (Math.random() - 0.5) * 8,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1.0,
                size: Math.random() * 6.5 + 3.5,
                color: redPalette[Math.floor(Math.random() * redPalette.length)],
                glow: '#ff003c',
                decay: Math.random() * 0.025 + 0.02
            });
        }
        if (this.cometTrail.length > 80) this.cometTrail.splice(0, 10);
    }

    createParticles() {
        this.particles = [];
        const count = 100;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                size: Math.random() * 4 + 2,
                color: this.isLightMode ? (i % 2 === 0 ? '#cd0029' : '#ff003c') : (i % 2 === 0 ? '#ff003c' : '#ffffff'),
                alpha: Math.random() * 0.6 + 0.4
            });
        }
    }

    createOrbitals() {
        if (this.isLightMode) {
            this.orbitalRings = [
                { rx: 380, ry: 140, tilt: -0.35, speed: 0.016, color: '#cd0029', width: 6.5, glow: '#ff003c', nodes: 6, nodeColor: '#cd0029' },
                { rx: 620, ry: 220, tilt: 0.45, speed: -0.012, color: '#ff003c', width: 5.5, glow: '#ff003c', nodes: 8, nodeColor: '#ff003c' },
                { rx: 900, ry: 330, tilt: -0.22, speed: 0.008, color: '#cd0029', width: 6.0, glow: '#cd0029', nodes: 10, nodeColor: '#cd0029' },
                { rx: 1200, ry: 450, tilt: 0.32, speed: -0.005, color: '#ff1a47', width: 5.0, glow: '#ff1a47', nodes: 14, nodeColor: '#ff003c' }
            ];
        } else {
            this.orbitalRings = [
                { rx: 380, ry: 140, tilt: -0.35, speed: 0.016, color: '#ff003c', width: 6.0, glow: '#ff003c', nodes: 6, nodeColor: '#ffffff' },
                { rx: 620, ry: 220, tilt: 0.45, speed: -0.012, color: '#ffffff', width: 4.8, glow: '#ffffff', nodes: 8, nodeColor: '#ff003c' },
                { rx: 900, ry: 330, tilt: -0.22, speed: 0.008, color: '#ff003c', width: 5.5, glow: '#ff003c', nodes: 10, nodeColor: '#ffffff' },
                { rx: 1200, ry: 450, tilt: 0.32, speed: -0.005, color: '#ffffff', width: 4.2, glow: '#ffffff', nodes: 14, nodeColor: '#ff003c' }
            ];
        }
    }

    setThinking(status) {
        this.isThinking = status;
        if (status) this.firePartyPopper('center');
    }

    animate() {
        // Clear both layers
        this.bgCtx.clearRect(0, 0, this.width, this.height);
        this.sparkleCtx.clearRect(0, 0, this.width, this.height);

        const cx = this.width / 2;
        const cy = this.height / 2;
        const speedMult = this.isThinking ? 3.0 : 1.0;
        this.angle += 0.008 * speedMult;

        // --- LAYER 1: Full-Screen Background 3D Galaxy (bgCtx) ---
        if (this.isLightMode) {
            this.bgCtx.fillStyle = '#ffffff';
            this.bgCtx.fillRect(0, 0, this.width, this.height);
            
            const grad = this.bgCtx.createRadialGradient(cx, cy, 30, cx, cy, Math.max(this.width, this.height) * 0.9);
            grad.addColorStop(0, 'rgba(255, 220, 228, 0.75)');
            grad.addColorStop(0.6, 'rgba(255, 245, 247, 0.5)');
            grad.addColorStop(1, '#ffffff');
            this.bgCtx.fillStyle = grad;
            this.bgCtx.fillRect(0, 0, this.width, this.height);
        } else {
            this.bgCtx.fillStyle = '#050102';
            this.bgCtx.fillRect(0, 0, this.width, this.height);

            const grad = this.bgCtx.createRadialGradient(cx, cy, 30, cx, cy, Math.max(this.width, this.height) * 0.9);
            grad.addColorStop(0, this.isThinking ? 'rgba(205, 0, 41, 0.55)' : 'rgba(205, 0, 41, 0.35)');
            grad.addColorStop(0.5, 'rgba(30, 4, 10, 0.9)');
            grad.addColorStop(1, '#050102');
            this.bgCtx.fillStyle = grad;
            this.bgCtx.fillRect(0, 0, this.width, this.height);
        }

        // Revolving 3D Orbitals
        this.orbitalRings.forEach(ring => {
            this.bgCtx.save();
            this.bgCtx.translate(cx, cy);
            this.bgCtx.rotate(ring.tilt);

            this.bgCtx.beginPath();
            this.bgCtx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI * 2);
            this.bgCtx.strokeStyle = ring.color;
            this.bgCtx.lineWidth = ring.width * (this.isThinking ? 1.6 : 1.0);
            this.bgCtx.shadowColor = ring.glow;
            this.bgCtx.shadowBlur = this.isThinking ? 30 : 18;
            this.bgCtx.stroke();

            this.bgCtx.beginPath();
            this.bgCtx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI * 2);
            this.bgCtx.strokeStyle = '#ffffff';
            this.bgCtx.lineWidth = 1.8;
            this.bgCtx.shadowBlur = 0;
            this.bgCtx.stroke();

            for (let n = 0; n < ring.nodes; n++) {
                const nodeAngle = this.angle * (ring.speed * 200) + (n * (Math.PI * 2 / ring.nodes));
                const nx = Math.cos(nodeAngle) * ring.rx;
                const ny = Math.sin(nodeAngle) * ring.ry;

                this.bgCtx.beginPath();
                this.bgCtx.arc(nx, ny, this.isThinking ? 11 : 8, 0, Math.PI * 2);
                this.bgCtx.fillStyle = ring.nodeColor;
                this.bgCtx.shadowColor = ring.glow;
                this.bgCtx.shadowBlur = 24;
                this.bgCtx.fill();

                this.bgCtx.beginPath();
                this.bgCtx.arc(nx, ny, 3.5, 0, Math.PI * 2);
                this.bgCtx.fillStyle = '#ffffff';
                this.bgCtx.fill();
                this.bgCtx.shadowBlur = 0;
            }
            this.bgCtx.restore();
        });

        // Background Particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x += p.vx * speedMult;
            p.y += p.vy * speedMult;

            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;

            this.bgCtx.beginPath();
            this.bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.bgCtx.fillStyle = p.color;
            this.bgCtx.shadowColor = p.color;
            this.bgCtx.shadowBlur = 12;
            this.bgCtx.globalAlpha = p.alpha;
            this.bgCtx.fill();
            this.bgCtx.globalAlpha = 1.0;
            this.bgCtx.shadowBlur = 0;

            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 115) {
                    this.bgCtx.beginPath();
                    this.bgCtx.moveTo(p.x, p.y);
                    this.bgCtx.lineTo(p2.x, p2.y);
                    this.bgCtx.strokeStyle = this.isLightMode ? `rgba(205, 0, 41, ${0.45 * (1 - dist / 115)})` : `rgba(255, 0, 60, ${0.5 * (1 - dist / 115)})`;
                    this.bgCtx.lineWidth = 1.4;
                    this.bgCtx.stroke();
                }
            }
        }

        // --- LAYER 2: Top-Layer Sparkles & Party Popper Confetti (sparkleCtx) ---
        // Confetti
        for (let i = this.confettiPops.length - 1; i >= 0; i--) {
            const c = this.confettiPops[i];
            c.x += c.vx;
            c.y += c.vy;
            c.vy += c.gravity;
            c.rotation += c.rotSpeed;
            c.alpha -= c.decay;

            if (c.alpha <= 0 || c.y > this.height + 50) {
                this.confettiPops.splice(i, 1);
                continue;
            }

            this.sparkleCtx.save();
            this.sparkleCtx.translate(c.x, c.y);
            this.sparkleCtx.rotate((c.rotation * Math.PI) / 180);
            this.sparkleCtx.globalAlpha = c.alpha;
            this.sparkleCtx.fillStyle = c.color;
            this.sparkleCtx.shadowColor = c.color;
            this.sparkleCtx.shadowBlur = 12;

            if (c.shape === 'rect') {
                this.sparkleCtx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
            } else {
                this.sparkleCtx.beginPath();
                this.sparkleCtx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
                this.sparkleCtx.fill();
            }
            this.sparkleCtx.restore();
        }

        // ✨ Top-Layer Cursor Sparkle Trail (Visible over sidebars & buttons!)
        for (let i = this.cometTrail.length - 1; i >= 0; i--) {
            const c = this.cometTrail[i];
            c.x += c.vx;
            c.y += c.vy;
            c.alpha -= c.decay;
            
            if (c.alpha <= 0) {
                this.cometTrail.splice(i, 1);
                continue;
            }

            this.sparkleCtx.save();
            this.sparkleCtx.globalAlpha = Math.max(0, c.alpha);
            this.sparkleCtx.beginPath();
            this.sparkleCtx.arc(c.x, c.y, c.size * c.alpha, 0, Math.PI * 2);
            this.sparkleCtx.fillStyle = c.color;
            this.sparkleCtx.shadowColor = c.glow;
            this.sparkleCtx.shadowBlur = 18;
            this.sparkleCtx.fill();

            // Diamond Core
            this.sparkleCtx.beginPath();
            this.sparkleCtx.arc(c.x, c.y, (c.size * c.alpha) * 0.45, 0, Math.PI * 2);
            this.sparkleCtx.fillStyle = '#ffffff';
            this.sparkleCtx.shadowBlur = 0;
            this.sparkleCtx.fill();
            this.sparkleCtx.restore();
        }

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.orbitalBg = new HighVoltageBackground();
    const savedTheme = localStorage.getItem('omni_theme') || 'dark';
    if (savedTheme === 'light') {
        window.orbitalBg.setTheme('light');
    }
});
