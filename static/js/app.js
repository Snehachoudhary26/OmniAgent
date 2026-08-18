/**
 * OmniAgent Studio Complete Controller with Mechanical Typing Sound Engine
 */
let socket = null;
let soundEnabled = true;
let audioCtx = null;
let currentTheme = localStorage.getItem('omni_theme') || 'dark';

// Luxury Cyber Sound & Mechanical Typing Synthesizer
function playCyberSound(type) {
    if (!soundEnabled) return;
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const now = audioCtx.currentTime;

        if (type === 'type') {
            // ⌨️ Tactile Mechanical Keyboard Switch Click ("Thock")
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            // Realistic switch frequency variation
            const baseFreq = 700 + Math.random() * 400;
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(baseFreq, now);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.035);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1600, now);

            gain.gain.setValueAtTime(0.09, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

            osc.start(now);
            osc.stop(now + 0.035);
        } else if (type === 'click') {
            // Elegant glass tactile click
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1400, now + 0.05);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'send') {
            // High-voltage warp swoosh chord
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + i * 0.03);
                gain.gain.setValueAtTime(0.08, now + i * 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
                osc.start(now + i * 0.03);
                osc.stop(now + 0.22);
            });
        } else if (type === 'step') {
            // Futuristic pulse chime
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(987.77, now);
            osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.09);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
            osc.start(now);
            osc.stop(now + 0.09);
        } else if (type === 'alert') {
            // Human approval critical alert
            [440, 880].forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, now + i * 0.1);
                gain.gain.setValueAtTime(0.15, now + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.start(now + i * 0.1);
                osc.stop(now + 0.25);
            });
        } else if (type === 'complete') {
            // Triumph harmonic victory chord
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.07);
                gain.gain.setValueAtTime(0.14, now + idx * 0.07);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
                osc.start(now + idx * 0.07);
                osc.stop(now + 0.45);
            });
        }
    } catch (e) {}
}

// Global Theme Toggle
window.toggleTheme = function() {
    currentTheme = (currentTheme === 'dark') ? 'light' : 'dark';
    localStorage.setItem('omni_theme', currentTheme);
    applyTheme(currentTheme);
    playCyberSound('click');
    if (window.orbitalBg) window.orbitalBg.firePartyPopper('both');
};

function applyTheme(theme) {
    const knob = document.getElementById('switch-knob-icon');
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        if (knob) knob.textContent = '☀️';
        if (window.orbitalBg) window.orbitalBg.setTheme('light');
    } else {
        document.body.classList.remove('light-theme');
        const knob = document.getElementById('switch-knob-icon');
        if (knob) knob.textContent = '🌙';
        if (window.orbitalBg) window.orbitalBg.setTheme('dark');
    }
}

window.toggleAudio = function() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('btn-sound');
    if (btn) {
        btn.textContent = soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
        btn.style.borderColor = soundEnabled ? '#cd0029' : 'rgba(205,0,41,0.2)';
    }
    playCyberSound('click');
};

function initWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/agent`;
    
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        updateAgentStatus('Core: Ready', false);
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleAgentMessage(data);
    };

    socket.onclose = () => {
        updateAgentStatus('Core: Reconnecting...', false);
        setTimeout(initWebSocket, 2000);
    };
}

function updateAgentStatus(text, active) {
    const statusText = document.querySelector('.status-text');
    const statusDot = document.querySelector('.status-dot');
    if (statusText) statusText.textContent = text;
    if (statusDot) {
        statusDot.style.background = active ? '#ffffff' : '#cd0029';
        statusDot.style.boxShadow = active ? '0 0 16px #ffffff' : '0 0 12px #cd0029';
    }
    if (window.orbitalBg) {
        window.orbitalBg.setThinking(active);
    }
}

function updateSwarmStatus(activeAgent, stepContent) {
    ['scout', 'compute', 'critic'].forEach(agent => {
        const card = document.getElementById(`agent-card-${agent}`);
        if (!card) return;
        const badge = card.querySelector('.badge-status-text');
        const descElem = card.querySelector('p');
        
        if (agent === activeAgent) {
            card.style.borderColor = '#cd0029';
            card.style.background = 'var(--cherry-subtle)';
            card.style.boxShadow = '0 0 30px rgba(205, 0, 41, 0.4)';
            if (badge) { badge.textContent = 'Active & Processing ⚡'; badge.style.color = '#cd0029'; }
            if (stepContent && descElem) {
                descElem.innerHTML = `<span style="color:var(--text-main); font-weight:700;">${stepContent.substring(0, 160)}...</span>`;
            }
        } else {
            card.style.borderColor = 'var(--cherry-border)';
            card.style.background = 'var(--surface-card)';
            card.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
            if (badge) { badge.textContent = 'Standby'; badge.style.color = 'var(--white-subtle)'; }
        }
    });
}

function handleAgentMessage(data) {
    if (data.metrics) {
        const tokElem = document.getElementById('metric-tokens');
        const latElem = document.getElementById('metric-latency');
        const costElem = document.getElementById('metric-cost');
        if (tokElem) tokElem.textContent = data.metrics.total_tokens.toLocaleString();
        if (latElem) latElem.textContent = `${data.metrics.latency_ms} ms`;
        if (costElem) costElem.textContent = `$${data.metrics.estimated_cost_usd.toFixed(6)}`;
    }

    if (data.active_agent && data.step) {
        updateSwarmStatus(data.active_agent, data.step.content);
    }

    if (data.step) {
        if (data.awaiting_approval) {
            playCyberSound('alert');
        } else {
            playCyberSound('step');
        }
        renderStepCard(data.step, data.task_id, data.awaiting_approval);
    }

    if (data.completed) {
        playCyberSound('complete');
        updateAgentStatus('Core: Ready', false);
        if (window.orbitalBg) window.orbitalBg.firePartyPopper('both');
    }
}

function renderStepCard(step, taskId, awaitingApproval) {
    const canvas = document.getElementById('chat-section');
    if (!canvas) return;

    const card = document.createElement('div');
    card.className = `step-card ${step.step_type}`;

    let citationsHtml = '';
    if (step.citations && step.citations.length > 0) {
        citationsHtml = `
            <div class="citation-container">
                ${step.citations.map(c => `
                    <a href="${c.source_url}" target="_blank" class="citation-chip">
                        🔗 [${c.id}] ${c.source_title.substring(0, 26)}...
                    </a>
                `).join('')}
            </div>
        `;
    }

    let approvalHtml = '';
    if (awaitingApproval && taskId) {
        approvalHtml = `
            <div class="approval-card" id="approval-box-${taskId}">
                <div class="approval-title">⚠️ Human Authorization Required</div>
                <p style="font-size: 0.9rem; color: var(--text-main);">The agent is requesting permission to execute tool: <code>${step.tool_name}</code>.</p>
                <div class="approval-actions">
                    <button class="btn-approve" onclick="sendApproval('${taskId}', true)">Approve & Run</button>
                    <button class="btn-reject" onclick="sendApproval('${taskId}', false)">Reject</button>
                </div>
            </div>
        `;
    }

    card.innerHTML = `
        <div class="step-header">
            <span class="step-title">${step.title}</span>
            <span style="font-size: 0.75rem; color: var(--white-subtle); font-family: monospace;">${step.timestamp > 0 ? step.timestamp + ' ms' : 'Step #' + step.step_number}</span>
        </div>
        <div class="step-content">${step.content}</div>
        ${citationsHtml}
        ${approvalHtml}
    `;

    canvas.appendChild(card);
    canvas.scrollTop = canvas.scrollHeight;
}

window.sendApproval = async function(taskId, approved) {
    playCyberSound('click');
    if (window.orbitalBg) window.orbitalBg.firePartyPopper('center');
    const box = document.getElementById(`approval-box-${taskId}`);
    if (box) box.innerHTML = `<span style="font-size:0.9rem; color:var(--text-main);">Processing decision (${approved ? 'Approved' : 'Rejected'})...</span>`;

    try {
        const response = await fetch('/api/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task_id: taskId, approved: approved })
        });
        const resData = await response.json();
        if (resData.steps) {
            resData.steps.forEach(step => renderStepCard(step));
        }
        updateAgentStatus('Core: Ready', false);
        playCyberSound('complete');
        if (window.orbitalBg) window.orbitalBg.firePartyPopper('both');
    } catch (e) {
        console.error(e);
    }
};

window.quickRun = function(promptText) {
    playCyberSound('click');
    if (window.orbitalBg) window.orbitalBg.firePartyPopper('both');
    showSection('chat');
    const input = document.getElementById('user-input');
    if (!input) return;
    input.value = promptText;
    sendUserPrompt();
};

function sendUserPrompt() {
    const input = document.getElementById('user-input');
    if (!input) return;
    const prompt = input.value.trim();
    if (!prompt || !socket || socket.readyState !== WebSocket.OPEN) return;

    if (window.orbitalBg) window.orbitalBg.firePartyPopper('both');

    const canvas = document.getElementById('chat-section');
    if (canvas) {
        const userCard = document.createElement('div');
        userCard.className = 'step-card';
        userCard.style.borderLeft = '6px solid var(--cherry-red)';
        userCard.innerHTML = `
            <div class="step-header"><span class="step-title">👤 User Request</span></div>
            <div class="step-content">${prompt}</div>
        `;
        canvas.appendChild(userCard);
        canvas.scrollTop = canvas.scrollHeight;
    }

    updateAgentStatus('Core: Thinking & Executing...', true);
    playCyberSound('send');

    socket.send(JSON.stringify({ prompt: prompt }));
    input.value = '';
}

window.showSection = function(section) {
    playCyberSound('click');
    document.querySelectorAll('.view-section').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    const inputDock = document.querySelector('.input-dock');

    if (section === 'chat') {
        document.getElementById('chat-section').style.display = 'flex';
        document.getElementById('nav-chat').classList.add('active');
        document.getElementById('view-title').textContent = 'Autonomous Reasoning Studio';
        document.getElementById('view-subtitle').textContent = 'ReAct Planning • Multi-Agent Swarm • Human-in-the-Loop';
        if (inputDock) inputDock.style.display = 'block';
    } else if (section === 'swarm') {
        document.getElementById('swarm-section').style.display = 'flex';
        document.getElementById('nav-swarm').classList.add('active');
        document.getElementById('view-title').textContent = 'Autonomous Sub-Agent Swarm';
        document.getElementById('view-subtitle').textContent = 'Live coordination across specialized agents';
        if (inputDock) inputDock.style.display = 'block';
    } else if (section === 'tools') {
        document.getElementById('tools-section').style.display = 'flex';
        document.getElementById('nav-tools').classList.add('active');
        document.getElementById('view-title').textContent = 'Active Dynamic Tool Registry';
        document.getElementById('view-subtitle').textContent = 'Capability-based tools with schema guardrails';
        if (inputDock) inputDock.style.display = 'none';
        loadToolsGrid();
    } else if (section === 'memory') {
        document.getElementById('memory-section').style.display = 'flex';
        document.getElementById('nav-memory').classList.add('active');
        document.getElementById('view-title').textContent = 'Long-Term Semantic Vector Vault';
        document.getElementById('view-subtitle').textContent = 'Persistent cross-session knowledge & facts';
        if (inputDock) inputDock.style.display = 'none';
        loadMemoryVault();
    }
};

async function loadToolsGrid() {
    const grid = document.getElementById('tools-grid-list');
    if (!grid) return;
    grid.innerHTML = '<span style="color:var(--text-main);">Loading tool registry...</span>';
    try {
        const res = await fetch('/api/tools');
        const tools = await res.json();
        grid.innerHTML = Object.values(tools).map(t => `
            <div class="tool-card-box">
                <div class="tool-header">
                    <span class="tool-name">⚡ ${t.name}</span>
                    <span class="tool-badge ${t.requires_approval ? 'badge-approval' : 'badge-auto'}">
                        ${t.requires_approval ? '⚠️ Requires Approval' : '✅ Autonomous'}
                    </span>
                </div>
                <p class="tool-desc">${t.description}</p>
                <button class="btn-test-tool" onclick="quickRun('Test tool: ${t.name}')">Invoke Tool →</button>
            </div>
        `).join('');
    } catch (e) {
        grid.innerHTML = '<span style="color:#cd0029;">Failed to load tools.</span>';
    }
}

async function loadMemoryVault() {
    const grid = document.getElementById('vault-items-grid');
    if (!grid) return;
    grid.innerHTML = '<span style="color:var(--text-main);">Loading memory vault...</span>';
    try {
        const res = await fetch('/api/memory');
        const memories = await res.json();
        grid.innerHTML = memories.map(m => `
            <div class="vault-card-box">
                <div class="vault-header">
                    <span class="vault-tag">📌 ${m.tag}</span>
                    <span class="vault-id">${m.id}</span>
                </div>
                <div class="vault-text">${m.text}</div>
            </div>
        `).join('');
    } catch (e) {
        grid.innerHTML = '<span style="color:#cd0029;">Failed to load memory.</span>';
    }
}

window.saveNewMemory = async function() {
    playCyberSound('click');
    if (window.orbitalBg) window.orbitalBg.firePartyPopper('center');
    const tag = document.getElementById('mem-new-tag').value.trim() || 'CustomFact';
    const text = document.getElementById('mem-new-text').value.trim();
    if (!text) return alert('Please enter fact text.');

    try {
        await fetch('/api/memory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tag: tag, text: text })
        });
        document.getElementById('mem-new-text').value = '';
        loadMemoryVault();
        playCyberSound('complete');
    } catch (e) {
        alert('Failed to save memory.');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(currentTheme);
    initWebSocket();

    const btnSend = document.getElementById('btn-send');
    const input = document.getElementById('user-input');

    if (btnSend) btnSend.addEventListener('click', sendUserPrompt);
    if (input) {
        // ⌨️ Mechanical Keyboard Typing Audio on Keystrokes
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                sendUserPrompt();
            } else {
                playCyberSound('type');
            }
        });
    }
});
