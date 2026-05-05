/**
 * Historical Figure Chatbot Widget
 * Embeddable chat widget with persona configuration support
 *
 * Usage:
 * <script src="jacobs-widget.js"
 *         data-api-url="http://localhost:8000"
 *         data-persona-id="jane-jacobs"></script>
 */

(function() {
    'use strict';

    const script = document.currentScript;
    const API_URL = script.getAttribute('data-api-url') || 'http://localhost:8000';
    const PERSONA_ID = script.getAttribute('data-persona-id') || 'jane-jacobs';

    let conversationId = null;
    let isOpen = false;
    let isTyping = false;
    let personaConfig = null;
    let voiceEnabled = false;
    let eduPanelOpen = false;

    // Size mode: 'compact' | 'medium' | 'full'
    const SIZE_MODES = ['compact', 'medium', 'full'];
    const SIZE_KEY = 'jj-widget-size';
    let currentSize = localStorage.getItem(SIZE_KEY) || 'compact';

    const SIZE_ICONS = {
        compact: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`,
        medium:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18"></rect><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`,
        full:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="10" y1="14" x2="3" y2="21"></line><line x1="21" y1="3" x2="14" y2="10"></line></svg>`,
    };
    const SIZE_TITLES = {
        compact: 'Expand to medium',
        medium:  'Expand to full screen',
        full:    'Collapse to compact',
    };

    async function init() {
        try {
            personaConfig = await loadPersonaConfig();
            applyPersonaTheme(personaConfig);
            createWidget(personaConfig);
        } catch (error) {
            console.error('Failed to load persona config:', error);
            createWidget(getDefaultConfig());
        }
    }

    async function loadPersonaConfig() {
        const response = await fetch(`${API_URL}/persona/${PERSONA_ID}/config`);
        if (!response.ok) throw new Error(`Failed to load persona config: ${response.status}`);
        const config = await response.json();
        console.log(`✓ Loaded persona: ${config.metadata.name}`);
        return config;
    }

    function applyPersonaTheme(config) {
        if (!config.widget.theme) return;
        const root = document.documentElement;
        const theme = config.widget.theme;
        const colorMap = {
            'primary_color': '--persona-primary-color',
            'cream':         '--persona-cream',
            'charcoal':      '--persona-charcoal',
            'warm_gray':     '--persona-warm-gray',
            'dark_cream':    '--persona-dark-cream',
            'text_gray':     '--persona-text-gray',
        };
        Object.entries(colorMap).forEach(([k, v]) => { if (theme[k]) root.style.setProperty(v, theme[k]); });
        if (theme.font_primary)   root.style.setProperty('--persona-font-primary',   theme.font_primary);
        if (theme.font_secondary) root.style.setProperty('--persona-font-secondary', theme.font_secondary);
    }

    function getDefaultConfig() {
        // Derive a display name from the persona ID (e.g. "friedrich-hayek" → "Friedrich Hayek")
        const displayName = PERSONA_ID
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
        return {
            metadata: { name: displayName },
            widget: {
                conversation_starters: [],
                ui: {
                    header_title: displayName,
                    header_subtitle: '',
                    header_tagline: 'Service temporarily unavailable — please try again later.',
                    input_placeholder: 'Service unavailable…',
                    error_message: 'The service is temporarily unavailable. Please try again in a few moments.',
                }
            }
        };
    }

    function createWidget(config) {
        const ui = config.widget.ui;
        const starters = config.widget.conversation_starters;

        const container = document.createElement('div');
        container.id = 'the-constitution-widget';
        container.innerHTML = `
            <div id="jj-trigger" class="jj-trigger">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
            </div>

            <div id="jj-chat-window" class="jj-chat-window jj-hidden">
                <div class="jj-header">
                    <div class="jj-header-content">
                        <h3>${ui.header_title}</h3>
                        <p class="jj-subtitle">${ui.header_subtitle}</p>
                        <p class="jj-tagline">${ui.header_tagline}</p>
                    </div>
                    <div class="jj-header-actions">
                        <button id="jj-size" class="jj-size-btn" title="${SIZE_TITLES[currentSize]}">${SIZE_ICONS[currentSize]}</button>
                        <button id="jj-close" class="jj-close-btn">&times;</button>
                    </div>
                </div>

                <div id="jj-messages" class="jj-messages">
                    <div class="jj-starters">
                        ${starters.map((s, i) => `<button class="jj-starter-btn" data-index="${i}">${s}</button>`).join('')}
                    </div>
                </div>

                <div id="jj-edu-panel" class="jj-edu-panel jj-hidden">
                    <div class="jj-edu-header">Educator Tools</div>
                    <div class="jj-edu-grade">
                        <span class="jj-edu-label">Grade level</span>
                        <select id="jj-grade" class="jj-grade-select">
                            <option value="middle-school">Middle School</option>
                            <option value="high-school" selected>High School</option>
                            <option value="college">College / University</option>
                        </select>
                    </div>
                    <div class="jj-edu-btns">
                        <button id="jj-lesson-btn" class="jj-edu-btn">Lesson Plan</button>
                        <button id="jj-questions-btn" class="jj-edu-btn">Discussion Questions</button>
                    </div>
                </div>

                <div class="jj-input-container">
                    <button id="jj-voice" class="jj-voice-btn" title="Enable voice" aria-label="Toggle voice output">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                    </button>
                    <input type="text" id="jj-input" class="jj-input" placeholder="${ui.input_placeholder}" disabled />
                    <button id="jj-edu-toggle" class="jj-edu-toggle-btn" title="Educator tools">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                    </button>
                    <button id="jj-send" class="jj-send-btn" disabled>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(container);
        attachEventListeners(config);
    }

    function attachEventListeners(config) {
        document.getElementById('jj-trigger').addEventListener('click', toggleChat);
        document.getElementById('jj-close').addEventListener('click', closeChat);
        document.getElementById('jj-send').addEventListener('click', sendMessage);
        document.getElementById('jj-size').addEventListener('click', cycleSize);
        document.getElementById('jj-voice').addEventListener('click', toggleVoice);
        document.getElementById('jj-edu-toggle').addEventListener('click', toggleEduPanel);
        document.getElementById('jj-lesson-btn').addEventListener('click', () => fetchEduContent('lesson-plan'));
        document.getElementById('jj-questions-btn').addEventListener('click', () => fetchEduContent('discussion-questions'));
        document.getElementById('jj-input').addEventListener('keypress', e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
        });

        applySizeMode(currentSize, false);

        const starters = config.widget.conversation_starters;
        document.querySelectorAll('.jj-starter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const msg = starters[parseInt(btn.getAttribute('data-index'))];
                hideStarters();
                sendMessageWithText(msg);
            });
        });
    }

    // ── Size modes ──────────────────────────────────────────────────────────

    function applySizeMode(size, animate = true) {
        const win = document.getElementById('jj-chat-window');
        const btn = document.getElementById('jj-size');
        if (!win) return;
        if (!animate) win.style.transition = 'none';
        win.classList.remove('jj-size-medium', 'jj-size-full');
        if (size === 'medium') win.classList.add('jj-size-medium');
        if (size === 'full')   win.classList.add('jj-size-full');
        if (!animate) { win.offsetHeight; win.style.transition = ''; }
        if (btn) { btn.innerHTML = SIZE_ICONS[size]; btn.title = SIZE_TITLES[size]; }
    }

    function cycleSize() {
        currentSize = SIZE_MODES[(SIZE_MODES.indexOf(currentSize) + 1) % SIZE_MODES.length];
        localStorage.setItem(SIZE_KEY, currentSize);
        applySizeMode(currentSize);
    }

    // ── Chat open/close ──────────────────────────────────────────────────────

    function toggleChat() {
        const win = document.getElementById('jj-chat-window');
        const trigger = document.getElementById('jj-trigger');
        if (isOpen) {
            win.classList.add('jj-hidden');
            trigger.classList.remove('jj-active');
            isOpen = false;
        } else {
            win.classList.remove('jj-hidden');
            trigger.classList.add('jj-active');
            isOpen = true;
            enableInput();
        }
    }

    function closeChat() {
        document.getElementById('jj-chat-window').classList.add('jj-hidden');
        document.getElementById('jj-trigger').classList.remove('jj-active');
        isOpen = false;
    }

    function enableInput() {
        const input = document.getElementById('jj-input');
        const send  = document.getElementById('jj-send');
        input.disabled = false;
        send.disabled  = false;
        input.focus();
    }

    function hideStarters() {
        const el = document.querySelector('.jj-starters');
        if (el) el.style.display = 'none';
    }

    // ── Voice ────────────────────────────────────────────────────────────────

    function toggleVoice() {
        voiceEnabled = !voiceEnabled;
        const btn = document.getElementById('jj-voice');
        btn.classList.toggle('jj-voice-active', voiceEnabled);
        btn.title = voiceEnabled ? 'Voice on — click to mute' : 'Enable voice';
    }

    function playAudio(b64) {
        const audio = new Audio(`data:audio/mpeg;base64,${b64}`);
        audio.play().catch(err => console.warn('Audio playback blocked:', err));
    }

    // ── Educator panel ───────────────────────────────────────────────────────

    function toggleEduPanel() {
        eduPanelOpen = !eduPanelOpen;
        document.getElementById('jj-edu-panel').classList.toggle('jj-hidden', !eduPanelOpen);
        document.getElementById('jj-edu-toggle').classList.toggle('jj-edu-active', eduPanelOpen);
    }

    async function fetchEduContent(type) {
        const grade = document.getElementById('jj-grade').value;
        const lastUserMsg = [...document.querySelectorAll('.jj-message-user .jj-message-content')]
            .map(el => el.textContent).pop() || '';

        // Close panel + show loading in chat
        toggleEduPanel();
        addSystemMessage(`Generating ${type === 'lesson-plan' ? 'lesson plan' : 'discussion questions'} for ${grade}…`);

        try {
            const resp = await fetch(`${API_URL}/educator/${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    persona_id:  PERSONA_ID,
                    topic:       lastUserMsg || null,
                    grade_level: grade,
                }),
            });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            const content = data.lesson_plan || data.questions || '';
            addMessage('assistant', content, true);
        } catch (err) {
            console.error('Educator fetch error:', err);
            addMessage('assistant', 'Could not generate educator content. Please try again.');
        }
    }

    // ── Messaging ────────────────────────────────────────────────────────────

    function sendMessage() {
        const input = document.getElementById('jj-input');
        const msg = input.value.trim();
        if (!msg || isTyping) return;
        sendMessageWithText(msg);
        input.value = '';
    }

    function showTypingIndicator() {
        const container = document.getElementById('jj-messages');
        const el = document.createElement('div');
        el.id = 'jj-typing-bubble';
        el.className = 'jj-message jj-message-assistant';
        el.innerHTML = `<div class="jj-message-content"><div class="jj-typing-indicator"><span></span><span></span><span></span></div></div>`;
        container.appendChild(el);
        container.scrollTop = container.scrollHeight;
    }

    function removeTypingIndicator() {
        const el = document.getElementById('jj-typing-bubble');
        if (el) el.remove();
    }

    async function sendMessageWithText(message) {
        hideStarters();
        addMessage('user', message);
        isTyping = true;
        showTypingIndicator();

        try {
            const endpoint = voiceEnabled ? '/chat/voice' : '/chat';
            const resp = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, conversation_id: conversationId }),
            });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            conversationId = data.conversation_id;

            removeTypingIndicator();
            addMessage('assistant', data.response, true, {
                sources:          data.sources || [],
                confidence:       data.confidence || 'medium',
                confidence_score: data.confidence_score || 50,
            });

            if (voiceEnabled && data.audio_base64) playAudio(data.audio_base64);

        } catch (err) {
            console.error('Chat error:', err);
            removeTypingIndicator();
            addMessage('assistant', personaConfig?.widget?.ui?.error_message || 'Sorry, I encountered an error. Please try again.');
        } finally {
            isTyping = false;
        }
    }

    function addSystemMessage(text) {
        const container = document.getElementById('jj-messages');
        const el = document.createElement('div');
        el.className = 'jj-message jj-message-system';
        el.innerHTML = `<div class="jj-message-content">${text}</div>`;
        container.appendChild(el);
        container.scrollTop = container.scrollHeight;
    }

    function addMessage(role, content, useTypewriter = false, meta = {}) {
        const container = document.getElementById('jj-messages');
        const msgDiv = document.createElement('div');
        msgDiv.className = `jj-message jj-message-${role}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'jj-message-content';

        if (role === 'assistant' && useTypewriter) {
            typewriterEffect(contentDiv, content);
        } else {
            contentDiv.textContent = content;
        }

        msgDiv.appendChild(contentDiv);

        // Trust meter + sources for assistant messages
        if (role === 'assistant' && (meta.sources?.length || meta.confidence)) {
            msgDiv.appendChild(buildMessageMeta(meta));
        }

        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }

    function buildMessageMeta(meta) {
        const wrap = document.createElement('div');
        wrap.className = 'jj-message-meta';

        const row = document.createElement('div');
        row.className = 'jj-meta-row';

        // Trust meter
        if (meta.confidence) {
            const trustEl = document.createElement('span');
            trustEl.className = `jj-trust jj-trust-${meta.confidence}`;
            const labels = { high: 'High confidence', medium: 'Medium confidence', low: 'Low confidence' };
            trustEl.textContent = labels[meta.confidence] || meta.confidence;
            row.appendChild(trustEl);
        }

        // Sources toggle
        if (meta.sources && meta.sources.length > 0) {
            const srcBtn = document.createElement('button');
            srcBtn.className = 'jj-sources-btn';
            srcBtn.innerHTML = `<span class="jj-sources-s">S</span> Sources (${meta.sources.length})`;

            const panel = document.createElement('div');
            panel.className = 'jj-sources-panel jj-hidden';

            meta.sources.forEach(s => {
                const item = document.createElement('div');
                item.className = 'jj-source-item';
                const type = s.knowledge_type === 'critical discourse' ? 'discourse' : 'own words';
                item.innerHTML = `
                    <span class="jj-source-title">${s.title}${s.year ? ', ' + s.year : ''}</span>
                    <span class="jj-source-type">${type}</span>`;
                panel.appendChild(item);
            });

            srcBtn.addEventListener('click', () => {
                panel.classList.toggle('jj-hidden');
                srcBtn.classList.toggle('jj-sources-open');
            });

            row.appendChild(srcBtn);
            wrap.appendChild(row);
            wrap.appendChild(panel);
        } else {
            wrap.appendChild(row);
        }

        return wrap;
    }

    // ── Typewriter ───────────────────────────────────────────────────────────

    function typewriterEffect(element, text) {
        let i = 0;
        const base = 15;

        function typeChar() {
            if (i >= text.length) return;
            const ch = text.charAt(i++);
            element.textContent += ch;

            let speed = base;
            if ('.!?'.includes(ch))  speed = base * 15;
            else if (',;:'.includes(ch)) speed = base * 8;
            else if (ch === '\n')    speed = base * 10;
            speed *= 0.8 + Math.random() * 0.4;

            const msgs = document.getElementById('jj-messages');
            if (msgs) msgs.scrollTop = msgs.scrollHeight;
            setTimeout(typeChar, speed);
        }
        typeChar();
    }

    // ── Boot ─────────────────────────────────────────────────────────────────

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
