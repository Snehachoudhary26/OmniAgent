/**
 * OmniAgent High-Definition Holographic Gyroscope Logo
 */
function renderHolographicLogo(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="omni-brand-core">
            <div class="gyro-logo-wrapper">
                <svg class="gyro-svg" viewBox="0 0 100 100" width="56" height="56">
                    <!-- Outer White Orbit -->
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="16 8" class="spin-slow-cw" />
                    <!-- Middle Cherry Red Orbit -->
                    <ellipse cx="50" cy="50" rx="36" ry="18" fill="none" stroke="#cd0029" stroke-width="3" class="spin-fast-ccw" />
                    <!-- Inner Diagonal Orbit -->
                    <ellipse cx="50" cy="50" rx="36" ry="18" fill="none" stroke="#ff3b5c" stroke-width="2" class="spin-tilt-cw" />
                    <!-- Glowing Cardinal Nodes -->
                    <circle cx="50" cy="6" r="3.5" fill="#ffffff" filter="url(#glow-white)" />
                    <circle cx="50" cy="94" r="3.5" fill="#cd0029" filter="url(#glow-red)" />
                    <circle cx="6" cy="50" r="3.5" fill="#ffffff" filter="url(#glow-white)" />
                    <circle cx="94" cy="50" r="3.5" fill="#cd0029" filter="url(#glow-red)" />
                    <!-- Center Ruby Nucleus -->
                    <circle cx="50" cy="50" r="9" fill="url(#ruby-grad)" filter="url(#glow-red)" />
                    <circle cx="50" cy="50" r="3" fill="#ffffff" />
                    
                    <defs>
                        <radialGradient id="ruby-grad" cx="40%" cy="40%">
                            <stop offset="0%" stop-color="#ffffff" />
                            <stop offset="50%" stop-color="#ff1a47" />
                            <stop offset="100%" stop-color="#cd0029" />
                        </radialGradient>
                        <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                        <filter id="glow-white" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                </svg>
            </div>
            <div class="brand-typography">
                <div class="brand-main">OMNI<span class="cherry-text">AGENT</span></div>
                <div class="brand-sub"><span class="pulse-live"></span>AUTONOMOUS STUDIO</div>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    renderHolographicLogo('brand-logo-container');
});
