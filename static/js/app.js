/**
 * OmniAgent Studio Complete Controller with Code Sandbox REPL
 */
let socket = null;
let soundEnabled = true;
let audioCtx = null;
let currentTheme = localStorage.getItem('omni_theme') || 'dark';

// 🐍 Code Sandbox Templates & Execution Controller
const CODE_TEMPLATES = {
    fibonacci: `# Fibonacci Sequence Algorithm Generator
def generate_fibonacci(n):
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence

fib_15 = generate_fibonacci(15)
print("Fibonacci First 15 terms:", fib_15)
print("Sum of Sequence:", sum(fib_15))`,

    primes: `# Sieve of Eratosthenes Prime Number Finder
def find_primes(limit):
    primes = []
    for num in range(2, limit + 1):
        is_prime = True
        for i in range(2, int(num**0.5) + 1):
            if num % i == 0:
                is_prime = False
                break
        if is_prime:
            primes.append(num)
    return primes

result = find_primes(50)
print(f"Total Primes <= 50: {len(result)}")
print("Prime Numbers:", result)`,

    matrix: `# Matrix Determinant & Eigen Simulation
import math

matrix = [
    [4, 7],
    [2, 6]
]

det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
trace = matrix[0][0] + matrix[1][1]

print("Input 2x2 Matrix:", matrix)
print(f"Matrix Determinant: {det}")
print(f"Matrix Trace: {trace}")
print(f"Square Root of Det: {math.sqrt(det):.4f}")`
};

window.loadCodeTemplate = function(name) {
    playCyberSound('click');
    const editor = document.getElementById('sandbox-code-input');
    if (editor && CODE_TEMPLATES[name]) {
        editor.value = CODE_TEMPLATES[name];
        showDiagnosticToast(`Loaded template: ${name}`);
    }
};

window.clearSandboxCode = function() {
    playCyberSound('click');
    const editor = document.getElementById('sandbox-code-input');
    const consoleOut = document.getElementById('sandbox-console-output');
    if (editor) editor.value = '';
    if (consoleOut) consoleOut.textContent = "Editor cleared. Enter Python code and press '▶️ Run Code'...";
};

window.copySandboxCode = function() {
    playCyberSound('click');
    const editor = document.getElementById('sandbox-code-input');
    if (editor) {
        navigator.clipboard.writeText(editor.value);
        showDiagnosticToast('📋 Code copied to clipboard!');
    }
};

window.executeSandboxCode = async function() {
    playCyberSound('send');
    const editor = document.getElementById('sandbox-code-input');
    const consoleOut = document.getElementById('sandbox-console-output');
    const statusPill = document.getElementById('code-status-pill');
    const latBadge = document.getElementById('code-latency-badge');

    if (!editor || !editor.value.trim()) {
        alert('Please enter some Python code to execute.');
        return;
    }

    if (statusPill) { statusPill.textContent = 'Running...'; statusPill.style.color = '#fbbf24'; }
    if (consoleOut) consoleOut.textContent = 'Executing sandbox container...';

    try {
        const res = await fetch('/api/code/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: editor.value })
        });
        const data = await res.json();

        if (consoleOut) {
            consoleOut.textContent = data.output || 'Code finished with no stdout output.';
            consoleOut.style.color = (data.status === 'success') ? '#0be881' : '#ff3b5c';
        }
        if (statusPill) {
            statusPill.textContent = (data.status === 'success') ? 'Exit Code 0 (Success)' : 'Runtime Error';
            statusPill.style.color = (data.status === 'success') ? '#0be881' : '#ff3b5c';
        }
        if (latBadge) latBadge.textContent = `Latency: ${data.execution_ms} ms`;

        playCyberSound('complete');
        if (window.orbitalBg) window.orbitalBg.firePartyPopper('both');
    } catch (e) {
        if (consoleOut) {
            consoleOut.textContent = `Sandbox Error: ${e.message}`;
            consoleOut.style.color = '#ff3b5c';
        }
        if (statusPill) statusPill.textContent = 'Error';
    }
};

window.sendCodeToAgent = function() {
    playCyberSound('click');
    const editor = document.getElementById('sandbox-code-input');
    const code = editor ? editor.value.trim() : '';
    if (!code) return alert('No code in editor to refactor.');

    const prompt = `Please review, optimize, and explain this Python code:\n\`\`\`python\n${code}\n\`\`\``;
    showSection('chat');
    const input = document.getElementById('user-input');
    if (input) input.value = prompt;
    sendUserPrompt();
};

// 📥 Export Session Dropdown Handler
window.toggleExportMenu = function() {
    playCyberSound('click');
    const menu = document.getElementById('export-dropdown');
    if (menu) menu.classList.toggle('show');
};

document.addEventListener('click', (e) => {
    const wrapper = document.querySelector('.export-dropdown-wrapper');
    const menu = document.getElementById('export-dropdown');
    if (menu && wrapper && !wrapper.contains(e.target)) {
        menu.classList.remove('show');
    }
});

// 📥 Export Session to Markdown or JSON
window.exportSession = function(format) {
    playCyberSound('complete');
    const menu = document.getElementById('export-dropdown');
    if (menu) menu.classList.remove('show');

    const canvas = document.getElementById('chat-section');
    const cards = canvas ? canvas.querySelectorAll('.step-card') : [];
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const tokVal = document.getElementById('metric-tokens')?.textContent || '0';
    const latVal = document.getElementById('metric-latency')?.textContent || '0 ms';
    const costVal = document.getElementById('metric-cost')?.textContent || '$0.00';

    if (format === 'md') {
        let mdContent = `# 🚀 OmniAgent Autonomous Reasoning Trajectory\n\n`;
        mdContent += `**Export Timestamp:** ${new Date().toLocaleString()}\n`;
        mdContent += `**Total Tokens:** ${tokVal} | **Real-Time Latency:** ${latVal} | **Estimated Cost:** ${costVal}\n\n`;
        mdContent += `---\n\n`;

        cards.forEach((card, index) => {
            const title = card.querySelector('.step-title')?.textContent || `Step #${index + 1}`;
            const content = card.querySelector('.step-content')?.textContent || '';
            mdContent += `### ${title}\n\n${content}\n\n`;

            const citations = card.querySelectorAll('.citation-chip');
            if (citations.length > 0) {
                mdContent += `**Verified Sources & Citations:**\n`;
                citations.forEach(c => {
                    mdContent += `- [${c.textContent.trim()}](${c.getAttribute('href')})\n`;
                });
                mdContent += `\n`;
            }
            mdContent += `---\n\n`;
        });

        downloadFile(`omniagent_reasoning_${timestamp}.md`, mdContent, 'text/markdown');
        showDiagnosticToast('📄 Markdown Reasoning Trajectory Exported!');
    } else if (format === 'json') {
        const telemetry = {
            session_id: `omni_${timestamp}`,
            exported_at: new Date().toISOString(),
            metrics: { tokens: tokVal, latency: latVal, cost: costVal },
            trajectory: []
        };

        cards.forEach((card, index) => {
            const title = card.querySelector('.step-title')?.textContent || `Step #${index + 1}`;
            const content = card.querySelector('.step-content')?.textContent || '';
            telemetry.trajectory.push({ step: index + 1, title: title, content: content });
        });

        downloadFile(`omniagent_telemetry_${timestamp}.json`, JSON.stringify(telemetry, null, 2), 'application/json');
        showDiagnosticToast('📊 Structured JSON Telemetry Exported!');
    }

    if (window.orbitalBg) window.orbitalBg.firePartyPopper('both');
};

function downloadFile(filename, text, type) {
    const blob = new Blob([text], { type: type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 🗑️ Clear Session & Reset Telemetry
window.clearSession = function() {
    playCyberSound('click');
    const canvas = document.getElementById('chat-section');
    if (!canvas) return;

    canvas.innerHTML = `
        <div class="step-card goal">
            <div class="step-header">
                <span class="step-title">⚡ Welcome to OmniAgent Studio</span>
            </div>
            <div class="step-content">I break down complex requirements into autonomous goals, invoke live tools (DuckDuckGo Search, Python Sandbox, Math), and pause for your authorization on critical actions.</div>
            
            <div class="quick-prompts-grid">
                <div class="prompt-chip" onclick="quickRun('Search latest trends in quantum computing')">
                    <span class="prompt-title">🌐 Live Web Search</span>
                    <span class="prompt-desc">Query DuckDuckGo & get verified citations.</span>
                </div>
                <div class="prompt-chip" onclick="quickRun('Run python code to calculate squares of numbers')">
                    <span class="prompt-title">🐍 Python Code Sandbox</span>
                    <span class="prompt-desc">Trigger Human-in-the-Loop authorization.</span>
                </div>
                <div class="prompt-chip" onclick="quickRun('Calculate math: sqrt(625) * 14 + (2 ** 8) / 4')">
                    <span class="prompt-title">⚡ Precision Calculator</span>
                    <span class="prompt-desc">Evaluate complex mathematical formulas.</span>
                </div>
                <div class="prompt-chip" onclick="quickRun('What are the architectural capabilities of OmniAgent?')">
                    <span class="prompt-title">🧠 Long-Term Memory Recall</span>
                    <span class="prompt-desc">Retrieve knowledge from the vector vault.</span>
                </div>
            </div>
        </div>
    `;

    document.getElementById('metric-tokens').textContent = '0';
    document.getElementById('metric-latency').textContent = '0 ms';
    document.getElementById('metric-cost').textContent = '$0.000000';

    showDiagnosticToast('🗑️ Session History Cleared & Reset!');
    if (window.orbitalBg) window.orbitalBg.firePartyPopper('center');
};

// ⚡ Live System Diagnostics on "Core: Ready" Click
window.runDiagnostics = async function() {
    playCyberSound('click');
    const dot = document.querySelector('.status-dot');
    const text = document.querySelector('.status-text');
    if (text) text.textContent = 'Core: Testing...';
    if (dot) dot.style.background = '#fbbf24';

    try {
        const t0 = performance.now();
        const res = await fetch('/api/health');
        const data = await res.json();
        const lat = Math.round(performance.now() - t0);

        if (dot) {
            dot.style.background = '#0be881';
            dot.style.boxShadow = '0 0 16px #0be881';
        }
        if (text) text.textContent = 'Core: 100% OK';

        showDiagnosticToast(`⚡ Diagnostic Passed • Latency: ${lat}ms • Tools Active: ${data.tools_count || 4} • Memory Synced`);
        playCyberSound('complete');

        setTimeout(() => {
            if (dot) {
                dot.style.background = '#cd0029';
                dot.style.boxShadow = '0 0 14px var(--cherry-glow)';
            }
            if (text) text.textContent = 'Core: Ready';
        }, 3000);
    } catch (e) {
        showDiagnosticToast('⚠️ Diagnostic Error: Reconnecting to Core...');
        if (text) text.textContent = 'Core: Error';
    }
};

function showDiagnosticToast(msg) {
    const existing = document.querySelector('.diagnostic-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'diagnostic-toast';
    toast.innerHTML = `<span>🟢</span><span>${msg}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(15px)';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// Authentic Feather-Light iOS / Mac Keyboard Tap & Audio Engine
function playCyberSound(type) {
    if (!soundEnabled) return;
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const now = audioCtx.currentTime;

        if (type === 'type') {
            const bufferSize = audioCtx.sampleRate * 0.015;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
            }

            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(2400 + Math.random() * 300, now);
            filter.Q.setValueAtTime(3.5, now);

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.045, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            noise.start(now);
            noise.stop(now + 0.015);
        } else if (type === 'click') {
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
        } else if (type === 'send') {
            [523.25, 659.25, 783.99].forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.03);
                gain.gain.setValueAtTime(0.05, now + i * 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
                osc.start(now + i * 0.03);
                osc.stop(now + 0.18);
            });
        } else if (type === 'step') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1046.50, now);
            osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.07);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
            osc.start(now);
            osc.stop(now + 0.07);
        } else if (type === 'alert') {
            [587.33, 880].forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.08);
                gain.gain.setValueAtTime(0.08, now + i * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.start(now + i * 0.08);
                osc.stop(now + 0.2);
            });
        } else if (type === 'complete') {
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.06);
                gain.gain.setValueAtTime(0.08, now + idx * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.start(now + idx * 0.06);
                osc.stop(now + 0.35);
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

// 🔀 Active Tab Router with Code Sandbox
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
    } else if (section === 'code') {
        document.getElementById('code-section').style.display = 'flex';
        document.getElementById('nav-code').classList.add('active');
        document.getElementById('view-title').textContent = 'Interactive Python Code Sandbox';
        document.getElementById('view-subtitle').textContent = 'Live REPL Execution • Algorithmic Prototyping • Code Optimizer';
        if (inputDock) inputDock.style.display = 'none';
        if (!document.getElementById('sandbox-code-input').value) {
            loadCodeTemplate('fibonacci');
        }
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
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                sendUserPrompt();
            } else {
                playCyberSound('type');
            }
        });
    }
});
