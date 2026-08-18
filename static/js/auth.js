/**
 * OmniAgent Authentication Gateway Controller
 */
let audioCtx = null;
let currentTheme = localStorage.getItem('omni_theme') || 'dark';

function playSoftClick() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
    } catch(e) {}
}

function playSuccessChime() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const now = audioCtx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);
            gain.gain.setValueAtTime(0.08, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc.start(now + idx * 0.05);
            osc.stop(now + 0.35);
        });
    } catch(e) {}
}

function togglePasswordVisibility(inputId, btn) {
    playSoftClick();
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
    } else {
        input.type = 'password';
        btn.textContent = '👁️';
    }
}

function selectRole(elem, roleName) {
    playSoftClick();
    document.querySelectorAll('.role-pill').forEach(p => p.classList.remove('active'));
    elem.classList.add('active');
    localStorage.setItem('omni_user_role', roleName);
}

function focusSignupCard() {
    playSoftClick();
    const signupCard = document.getElementById('card-signup');
    if (signupCard) {
        signupCard.scrollIntoView({ behavior: 'smooth' });
        const firstInput = document.getElementById('signup-fname');
        if (firstInput) firstInput.focus();
    }
}

function demoSocialLogin(provider) {
    playSuccessChime();
    localStorage.setItem('omni_user_auth', `authenticated_${provider.toLowerCase()}`);
    localStorage.setItem('omni_user_name', `${provider} User`);
    showAuthToast(`⚡ Authenticated with ${provider}! Launching Autonomous Studio...`);
    setTimeout(() => {
        window.location.href = '/';
    }, 900);
}

function handleAuthSubmit(e, formType) {
    e.preventDefault();
    playSuccessChime();

    let username = "Developer";
    if (formType === 'signin') {
        username = document.getElementById('signin-user')?.value || "Engineer";
    } else {
        username = document.getElementById('signup-fname')?.value || "Creator";
    }

    localStorage.setItem('omni_user_auth', 'authenticated');
    localStorage.setItem('omni_user_name', username);

    showAuthToast(`✨ Welcome to OmniAgent, ${username}! Launching Studio...`);
    setTimeout(() => {
        window.location.href = '/';
    }, 900);
}

function showAuthToast(msg) {
    const existing = document.querySelector('.auth-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'auth-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(14, 2, 6, 0.96);
        border: 2px solid #ff003c;
        color: #ffffff;
        padding: 16px 28px;
        border-radius: 20px;
        box-shadow: 0 0 35px #ff003c;
        font-weight: 800;
        font-size: 0.95rem;
        z-index: 999999;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideUp 0.3s ease;
    `;
    toast.innerHTML = `<span>🟢</span><span>${msg}</span>`;
    document.body.appendChild(toast);
}

// Global Theme Toggle
window.toggleTheme = function() {
    currentTheme = (currentTheme === 'dark') ? 'light' : 'dark';
    localStorage.setItem('omni_theme', currentTheme);
    applyTheme(currentTheme);
    playSoftClick();
};

function applyTheme(theme) {
    const knob = document.getElementById('switch-knob-icon');
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        if (knob) knob.textContent = '☀️';
        if (window.orbitalBg) window.orbitalBg.setTheme('light');
    } else {
        document.body.classList.remove('light-theme');
        if (knob) knob.textContent = '🌙';
        if (window.orbitalBg) window.orbitalBg.setTheme('dark');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(currentTheme);
});
