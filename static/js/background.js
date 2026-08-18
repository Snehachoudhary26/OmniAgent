/**
 * OmniAgent Ultra-Vivid 3D Orbitals & Explosive Party Popper Cannon Engine
 */
class HighVoltageBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.id = 'ambient-canvas';
        document.body.prepend(this.canvas);

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
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.ctx.scale(this.dpr, this.dpr);
    }

    setTheme(mode) {
        this.isLightMode = (mode === 'light');
        this.createParticles();
        this.createOrbitals();
    }

    // 🎉 Dramatic Cyber Party Popper Cannons (Shoots from Bottom Corners)
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

    addCometParticle(x, y) {
        this.cometTrail.push({
            x: x,
            y: y,
            alpha: 1.0,
            size: Math.random() * 5 + 3,
            color: this.isLightMode ? '#cd0029' : (Math.random() > 0.5 ? '#ff003c' : '#ffffff')
        });
        if (this.cometTrail.length > 35) this.cometTrail.shift();
    }

    createParticles() {
        this.particles = [];
        const count = 90;
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
                { rx: 360, ry: 130, tilt: -0.35, speed: 0.016, color: '#cd0029', width: 6.5, glow: '#ff003c', nodes: 6, nodeColor: '#cd0029' },
                { rx: 580, ry: 210, tilt: 0.45, speed: -0.012, color: '#ff003c', width: 5.5, glow: '#ff003c', nodes: 8, nodeColor: '#ff003c' },
                { rx: 840, ry: 310, tilt: -0.22, speed: 0.008, color: '#cd0029', width: 6.0, glow: '#cd0029', nodes: 10, nodeColor: '#cd0029' },
                { rx: 1120, ry: 420, tilt: 0.32, speed: -0.005, color: '#ff1a47', width: 5.0, glow: '#ff1a47', nodes: 14, nodeColor: '#ff003c' }
            ];
        } else {
            this.orbitalRings = [
                { rx: 360, ry: 130, tilt: -0.35, speed: 0.016, color: '#ff003c', width: 6.0, glow: '#ff003c', nodes: 6, nodeColor: '#ffffff' },
                { rx: 580, ry: 210, tilt: 0.45, speed: -0.012, color: '#ffffff', width: 4.8, glow: '#ffffff', nodes: 8, nodeColor: '#ff003c' },
                { rx: 840, ry: 310, tilt: -0.22, speed: 0.008, color: '#ff003c', width: 5.5, glow: '#ff003c', nodes: 10, nodeColor: '#ffffff' },
                { rx: 1120, ry: 420, tilt: 0.32, speed: -0.005, color: '#ffffff', width: 4.2, glow: '#ffffff', nodes: 14, nodeColor: '#ff003c' }
            ];
        }
    }

    setThinking(status) {
        this.isThinking = status;
        if (status) this.firePartyPopper('center');
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        const cx = this.width / 2;
        const cy = this.height / 2;
        const speedMult = this.isThinking ? 3.0 : 1.0;
        this.angle += 0.008 * speedMult;

        // Background Base (Crystal Sharp, No Haze)
        if (this.isLightMode) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            const grad = this.ctx.createRadialGradient(cx, cy, 30, cx, cy, Math.max(this.width, this.height) * 0.9);
            grad.addColorStop(0, 'rgba(255, 220, 228, 0.75)');
            grad.addColorStop(0.6, 'rgba(255, 245, 247, 0.5)');
            grad.addColorStop(1, '#ffffff');
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(0, 0, this.width, this.height);
        } else {
            this.ctx.fillStyle = '#050102';
            this.ctx.fillRect(0, 0, this.width, this.height);

            const grad = this.ctx.createRadialGradient(cx, cy, 30, cx, cy, Math.max(this.width, this.height) * 0.9);
            grad.addColorStop(0, this.isThinking ? 'rgba(205, 0, 41, 0.55)' : 'rgba(205, 0, 41, 0.35)');
            grad.addColorStop(0.5, 'rgba(30, 4, 10, 0.9)');
            grad.addColorStop(1, '#050102');
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        // 2. Bold High-Voltage 3D Orbitals
        this.orbitalRings.forEach(ring => {
            this.ctx.save();
            this.ctx.translate(cx, cy);
            this.ctx.rotate(ring.tilt);

            // Outer High-Intensity Glow Ring
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI * 2);
            this.ctx.strokeStyle = ring.color;
            this.ctx.lineWidth = ring.width * (this.isThinking ? 1.6 : 1.0);
            this.ctx.shadowColor = ring.glow;
            this.ctx.shadowBlur = this.isThinking ? 30 : 18;
            this.ctx.stroke();

            // Sharp Inner Center Stroke
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI * 2);
            this.ctx.strokeStyle = this.isLightMode ? '#ffffff' : '#ffffff';
            this.ctx.lineWidth = 1.8;
            this.ctx.shadowBlur = 0;
            this.ctx.stroke();

            // Large Luminous Celestial Nodes
            for (let n = 0; n < ring.nodes; n++) {
                const nodeAngle = this.angle * (ring.speed * 200) + (n * (Math.PI * 2 / ring.nodes));
                const nx = Math.cos(nodeAngle) * ring.rx;
                const ny = Math.sin(nodeAngle) * ring.ry;

                this.ctx.beginPath();
                this.ctx.arc(nx, ny, this.isThinking ? 11 : 8, 0, Math.PI * 2);
                this.ctx.fillStyle = ring.nodeColor;
                this.ctx.shadowColor = ring.glow;
                this.ctx.shadowBlur = 24;
                this.ctx.fill();

                this.ctx.beginPath();
                this.ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
            this.ctx.restore();
        });

        // 3. Crisp Foreground Particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x += p.vx * speedMult;
            p.y += p.vy * speedMult;

            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 12;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;
            this.ctx.shadowBlur = 0;

            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 115) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = this.isLightMode ? `rgba(205, 0, 41, ${0.45 * (1 - dist / 115)})` : `rgba(255, 0, 60, ${0.5 * (1 - dist / 115)})`;
                    this.ctx.lineWidth = 1.4;
                    this.ctx.stroke();
                }
            }
        }

        // 4. Confetti Party Popper Explosion Simulation
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

            this.ctx.save();
            this.ctx.translate(c.x, c.y);
            this.ctx.rotate((c.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = c.alpha;
            this.ctx.fillStyle = c.color;
            this.ctx.shadowColor = c.color;
            this.ctx.shadowBlur = 10;

            if (c.shape === 'rect') {
                this.ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
        }

        // 5. Comet Trails
        for (let i = this.cometTrail.length - 1; i >= 0; i--) {
            const c = this.cometTrail[i];
            c.alpha -= 0.035;
            if (c.alpha <= 0) {
                this.cometTrail.splice(i, 1);
                continue;
            }
            this.ctx.beginPath();
            this.ctx.arc(c.x, c.y, c.size * c.alpha, 0, Math.PI * 2);
            this.ctx.fillStyle = c.color;
            this.ctx.shadowColor = '#ff003c';
            this.ctx.shadowBlur = 14;
            this.ctx.globalAlpha = c.alpha;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1.0;
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
