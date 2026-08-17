/**
 * OmniAgent Studio Application Logic - Cherry Red & White Edition
 */
let socket = null;

function initWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/agent`;
    
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        updateAgentStatus('Autonomous Core: Ready', false);
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleAgentMessage(data);
    };

    socket.onclose = () => {
        updateAgentStatus('Autonomous Core: Reconnecting...', false);
        setTimeout(initWebSocket, 2000);
    };
}

function updateAgentStatus(text, active) {
    const statusText = document.querySelector('.status-text');
    const statusDot = document.querySelector('.status-dot');
    if (statusText) statusText.textContent = text;
    if (statusDot) {
        statusDot.style.background = active ? '#ffffff' : '#cd0029';
        statusDot.style.boxShadow = active ? '0 0 14px #ffffff' : '0 0 10px #cd0029';
    }
    if (window.orbitalBg) {
        window.orbitalBg.setThinking(active);
    }
}

function handleAgentMessage(data) {
    if (data.metrics) {
        document.getElementById('metric-tokens').textContent = data.metrics.total_tokens.toLocaleString();
        document.getElementById('metric-latency').textContent = `${data.metrics.latency_ms} ms`;
        document.getElementById('metric-cost').textContent = `$${data.metrics.estimated_cost_usd.toFixed(6)}`;
    }

    if (data.step) {
        renderStepCard(data.step, data.task_id, data.awaiting_approval);
    }

    if (data.completed) {
        updateAgentStatus('Autonomous Core: Idle', false);
    }
}

function renderStepCard(step, taskId, awaitingApproval) {
    const canvas = document.getElementById('chat-canvas');
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
                <p style="font-size: 0.88rem; color: #ffffff;">The agent is requesting permission to execute tool <code>${step.tool_name}</code>.</p>
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
            <span style="font-size: 0.75rem; color: #94a3b8; font-family: monospace;">Step #${step.step_number}</span>
        </div>
        <div class="step-content">${step.content}</div>
        ${citationsHtml}
        ${approvalHtml}
    `;

    canvas.appendChild(card);
    canvas.scrollTop = canvas.scrollHeight;
}

window.sendApproval = async function(taskId, approved) {
    const box = document.getElementById(`approval-box-${taskId}`);
    if (box) box.innerHTML = `<span style="font-size:0.85rem; color:#e2e8f0;">Processing decision (${approved ? 'Approved' : 'Rejected'})...</span>`;

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
        updateAgentStatus('Autonomous Core: Idle', false);
    } catch (e) {
        console.error(e);
    }
};

window.quickRun = function(promptText) {
    const input = document.getElementById('user-input');
    input.value = promptText;
    sendUserPrompt();
};

function sendUserPrompt() {
    const input = document.getElementById('user-input');
    const prompt = input.value.trim();
    if (!prompt || !socket || socket.readyState !== WebSocket.OPEN) return;

    const canvas = document.getElementById('chat-canvas');
    const userCard = document.createElement('div');
    userCard.className = 'step-card';
    userCard.style.borderLeft = '5px solid #ffffff';
    userCard.innerHTML = `
        <div class="step-header"><span class="step-title">👤 User Request</span></div>
        <div class="step-content">${prompt}</div>
    `;
    canvas.appendChild(userCard);
    canvas.scrollTop = canvas.scrollHeight;

    updateAgentStatus('Autonomous Core: Thinking & Executing...', true);

    socket.send(JSON.stringify({ prompt: prompt }));
    input.value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    initWebSocket();

    const btnSend = document.getElementById('btn-send');
    const input = document.getElementById('user-input');

    if (btnSend) btnSend.addEventListener('click', sendUserPrompt);
    if (input) input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendUserPrompt();
    });

    const mobBtnChat = document.getElementById('mob-btn-chat');
    const mobBtnMetrics = document.getElementById('mob-btn-metrics');
    const metricsPanel = document.getElementById('metrics-panel');

    if (mobBtnMetrics && metricsPanel) {
        mobBtnMetrics.addEventListener('click', () => {
            metricsPanel.classList.toggle('open');
            mobBtnMetrics.classList.toggle('active');
        });
    }
    if (mobBtnChat && metricsPanel) {
        mobBtnChat.addEventListener('click', () => {
            metricsPanel.classList.remove('open');
            mobBtnChat.classList.add('active');
            if (mobBtnMetrics) mobBtnMetrics.classList.remove('active');
        });
    }
});
