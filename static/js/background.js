/**
 * OmniAgent High-Voltage Cherry Red & Pure White Celestial Engine
 * Retina-Scaled, Hyper-Visible 3D Orbitals & Cosmic Streams
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
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
        this.isThinking = false;
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

    addCometParticle(x, y) {
        this.cometTrail.push({
            x: x,
            y: y,
            alpha: 1.0,
            size: Math.random() * 3 + 2,
            color: Math.random() > 0.5 ? '#cd0029' : '#ffffff'
        });
        if (this.cometTrail.length > 25) this.cometTrail.shift();
    }

    createParticles() {
        this.particles = [];
        const count = 120;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 1.2,
                vy: (Math.random() - 0.5) * 1.2,
                size: Math.random() * 3 + 1.5,
                color: i % 2 === 0 ? '#cd0029' : '#ffffff',
                alpha: Math.random() * 0.7 + 0.3
            });
        }
    }

    createOrbitals() {
        this.orbitalRings = [
            { rx: 320, ry: 110, tilt: -0.4, speed: 0.015, color: '#cd0029', width: 3.5, glow: '#ff003c', nodes: 5, nodeColor: '#ffffff' },
            { rx: 520, ry: 190, tilt: 0.45, speed: -0.01, color: '#ffffff', width: 2.8, glow: '#ffffff', nodes: 7, nodeColor: '#cd0029' },
            { rx: 760, ry: 280, tilt: -0.22, speed: 0.007, color: '#ff1a47', width: 3.2, glow: '#ff003c', nodes: 9, nodeColor: '#ffffff' },
            { rx: 1020, ry: 380, tilt: 0.32, speed: -0.004, color: 'rgba(255, 255, 255, 0.7)', width: 2.2, glow: '#ffffff', nodes: 12, nodeColor: '#ff003c' }
        ];
    }

    setThinking(status) {
        this.isThinking = status;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        const cx = this.width / 2;
        const cy = this.height / 2;
        const speedMult = this.isThinking ? 3.0 : 1.0;
        this.angle += 0.008 * speedMult;

        // 1. High-Contrast Deep Space Nebula with Bold Crimson Core
        const bgGrad = this.ctx.createRadialGradient(
            cx, cy, 30,
            cx, cy, Math.max(this.width, this.height) * 0.9
        );
        bgGrad.addColorStop(0, this.isThinking ? 'rgba(205, 0, 41, 0.45)' : 'rgba(205, 0, 41, 0.28)');
        bgGrad.addColorStop(0.4, 'rgba(30, 4, 10, 0.88)');
        bgGrad.addColorStop(1, '#050102');
        this.ctx.fillStyle = bgGrad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // 2. High-Voltage Revolving 3D Orbitals
        this.orbitalRings.forEach(ring => {
            this.ctx.save();
            this.ctx.translate(cx, cy);
            this.ctx.rotate(ring.tilt);

            // Glowing Outer Halo
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI * 2);
            this.ctx.strokeStyle = ring.color;
            this.ctx.lineWidth = ring.width * (this.isThinking ? 1.6 : 1.0);
            this.ctx.shadowColor = ring.glow;
            this.ctx.shadowBlur = this.isThinking ? 28 : 16;
            this.ctx.stroke();

            // Inner Core Sharp Line
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI * 2);
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            this.ctx.shadowBlur = 0;
            this.ctx.stroke();

            // Revolving Giant Energy Nodes
            for (let n = 0; n < ring.nodes; n++) {
                const nodeAngle = this.angle * (ring.speed * 200) + (n * (Math.PI * 2 / ring.nodes));
                const nx = Math.cos(nodeAngle) * ring.rx;
                const ny = Math.sin(nodeAngle) * ring.ry;

                // Pulsing Node Halo
                this.ctx.beginPath();
                this.ctx.arc(nx, ny, this.isThinking ? 8 : 5.5, 0, Math.PI * 2);
                this.ctx.fillStyle = ring.nodeColor;
                this.ctx.shadowColor = ring.glow;
                this.ctx.shadowBlur = 20;
                this.ctx.fill();

                // Bright White Nucleus
                this.ctx.beginPath();
                this.ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
            this.ctx.restore();
        });

        // 3. Floating Interactive Particle Mesh
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x += p.vx * speedMult;
            p.y += p.vy * speedMult;

            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;

            // Draw Bold Particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 10;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;
            this.ctx.shadowBlur = 0;

            // Connect lines between nearby particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = p.color === '#cd0029' ? `rgba(205, 0, 41, ${0.4 * (1 - dist / 100)})` : `rgba(255, 255, 255, ${0.35 * (1 - dist / 100)})`;
                    this.ctx.lineWidth = 1.2;
                    this.ctx.stroke();
                }
            }
        }

        // 4. Mouse / Touch Comet Sparks
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
            this.ctx.shadowBlur = 12;
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
});
