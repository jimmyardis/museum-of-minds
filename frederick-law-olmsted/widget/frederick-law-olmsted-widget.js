/**
 * Historical Figure Chatbot Widget
 * Embeddable chat widget with persona configuration support
 *
 * Usage:
 * <script src="jacobs-widget.js"
 *         data-api-url="http://localhost:8000"
 *         data-persona-id="frederick-law-olmsted"></script>
 */

(function() {
    'use strict';

    const script = document.currentScript;
    const API_URL = script.getAttribute('data-api-url') || 'http://localhost:8000';
    const PERSONA_ID = script.getAttribute('data-persona-id') || 'frederick-law-olmsted';

    let conversationId = null;
    let isOpen = false;
    let isTyping = false;
    let personaConfig = null;
    let voiceEnabled = false;
    let eduPanelOpen = false;
    let eduCourse = 'us-history';
    let eduLevel  = 'standard';
    let settingsPanelOpen = false;
    // html2pdfLoaded removed — using print-in-new-window instead

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
            renderCorpusStats(personaConfig);
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
        container.id = 'frederick-law-olmsted-widget';
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
                        <button id="jj-download" class="jj-download-btn" title="Download conversation as PDF" disabled>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                        </button>
                        <button id="jj-settings" class="jj-settings-btn" title="Settings">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                        </button>
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
                    <div class="jj-edu-row">
                        <span class="jj-edu-label">Course</span>
                        <div class="jj-edu-seg">
                            <button class="jj-seg-btn active" id="jj-course-ush">US History</button>
                            <button class="jj-seg-btn" id="jj-course-gov">US Govt</button>
                        </div>
                    </div>
                    <div class="jj-edu-row">
                        <span class="jj-edu-label">Level</span>
                        <div class="jj-edu-seg">
                            <button class="jj-seg-btn active" id="jj-level-std">Std</button>
                            <button class="jj-seg-btn" id="jj-level-hon">Hon</button>
                            <button class="jj-seg-btn" id="jj-level-ap">AP</button>
                        </div>
                    </div>
                    <div class="jj-edu-btns">
                        <button id="jj-lesson-btn" class="jj-edu-btn">Lesson Plan</button>
                        <button id="jj-questions-btn" class="jj-edu-btn">Discussion Questions</button>
                    </div>
                </div>

                <div id="jj-settings-panel" class="jj-settings-panel jj-hidden">
                    <div class="jj-settings-row">
                        <span class="jj-settings-label">Historical</span>
                        <div class="jj-setting-group">
                            <button class="jj-setting-opt jj-setting-active" data-setting="mode" data-value="modern">Modern</button>
                            <button class="jj-setting-opt" data-setting="mode" data-value="historical">Historical</button>
                        </div>
                    </div>
                    <div class="jj-settings-row">
                        <span class="jj-settings-label">Length</span>
                        <div class="jj-setting-group">
                            <button class="jj-setting-opt" data-setting="length" data-value="brief">Brief</button>
                            <button class="jj-setting-opt jj-setting-active" data-setting="length" data-value="detailed">Standard</button>
                        </div>
                    </div>
                    <div class="jj-settings-row">
                        <span class="jj-settings-label">Reading level</span>
                        <div class="jj-setting-group">
                            <button class="jj-setting-opt jj-setting-active" data-setting="level" data-value="general">General</button>
                            <button class="jj-setting-opt" data-setting="level" data-value="middle_school">Middle School</button>
                        </div>
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
        document.getElementById('jj-download').addEventListener('click', exportChat);
        document.getElementById('jj-edu-toggle').addEventListener('click', toggleEduPanel);
        document.getElementById('jj-settings').addEventListener('click', toggleSettings);
        document.getElementById('jj-course-ush').addEventListener('click', function() { setEduCourse('us-history', this); });
        document.getElementById('jj-course-gov').addEventListener('click', function() { setEduCourse('us-government', this); });
        document.getElementById('jj-level-std').addEventListener('click', function() { setEduLevel('standard', this); });
        document.getElementById('jj-level-hon').addEventListener('click', function() { setEduLevel('honors', this); });
        document.getElementById('jj-level-ap').addEventListener('click', function() { setEduLevel('ap', this); });
        document.querySelectorAll('.jj-setting-opt').forEach(btn => {
            btn.addEventListener('click', () => applySettingOpt(btn));
        });
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

    function toggleSettings() {
        settingsPanelOpen = !settingsPanelOpen;
        document.getElementById('jj-settings-panel').classList.toggle('jj-hidden', !settingsPanelOpen);
        document.getElementById('jj-settings').classList.toggle('jj-settings-active', settingsPanelOpen);
        if (settingsPanelOpen && eduPanelOpen) {
            eduPanelOpen = false;
            document.getElementById('jj-edu-panel').classList.add('jj-hidden');
            document.getElementById('jj-edu-toggle').classList.remove('jj-edu-active');
        }
    }

    function applySettingOpt(btn) {
        const group = btn.closest('.jj-setting-group');
        if (group) group.querySelectorAll('.jj-setting-opt').forEach(b => b.classList.remove('jj-setting-active'));
        btn.classList.add('jj-setting-active');
    }

    function setEduCourse(course, btn) {
        eduCourse = course;
        document.querySelectorAll('#jj-course-ush, #jj-course-gov').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    function setEduLevel(level, btn) {
        eduLevel = level;
        document.querySelectorAll('#jj-level-std, #jj-level-hon, #jj-level-ap').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    async function fetchEduContent(type) {
        const courseLabels = {
            'us-history':    { standard: 'US History', honors: 'US History Honors', ap: 'APUSH' },
            'us-government': { standard: 'US Government', honors: 'US Government Honors', ap: 'AP Gov' },
        };
        const label = courseLabels[eduCourse]?.[eduLevel] || 'US History';
        const lastUserMsg = [...document.querySelectorAll('.jj-message-user .jj-message-content')]
            .map(el => el.textContent).pop() || '';

        toggleEduPanel();
        addSystemMessage(`Generating ${type === 'lesson-plan' ? 'lesson plan' : 'discussion questions'} for ${label}…`);

        try {
            const resp = await fetch(`${API_URL}/educator/${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    persona_id: PERSONA_ID,
                    topic:      lastUserMsg || null,
                    course:     eduCourse,
                    level:      eduLevel,
                }),
            });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            const content = data.lesson_plan || data.questions || '';
            addMessage('assistant', content, true);
            enableDownload();
            appendEduExportBtn(type, content);
        } catch (err) {
            console.error('Educator fetch error:', err);
            addMessage('assistant', 'Could not generate educator content. Please try again.');
        }
    }

    function appendEduExportBtn(type, content) {
        const container = document.getElementById('jj-messages');
        const label = type === 'lesson-plan' ? 'lesson plan' : 'discussion questions';
        const filename = `${PERSONA_ID}-${type}.pdf`;
        const btn = document.createElement('button');
        btn.className = 'jj-edu-export-btn';
        btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Download ${label} as PDF`;
        btn.addEventListener('click', () => exportEduContent(content, filename, label));
        container.appendChild(btn);
        container.scrollTop = container.scrollHeight;
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
            const endpoint = voiceEnabled ? `/persona/${PERSONA_ID}/chat/voice` : `/persona/${PERSONA_ID}/chat`;
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
            enableDownload();

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

        // Confidence badge (pill with dots)
        if (meta.confidence) {
            const dots = { high: '●●●', medium: '●●○', low: '●○○' };
            const badge = document.createElement('span');
            badge.className = `jj-confidence jj-confidence-${meta.confidence}`;
            badge.textContent = `${dots[meta.confidence] || '●○○'} ${meta.confidence.charAt(0).toUpperCase() + meta.confidence.slice(1)}`;
            badge.title = `Source confidence: ${meta.confidence_score || 0}/100`;
            wrap.appendChild(badge);
        }

        // Sources toggle
        if (meta.sources && meta.sources.length > 0) {
            const srcBtn = document.createElement('button');
            srcBtn.className = 'jj-sources-toggle';
            srcBtn.textContent = `§ ${meta.sources.length} source${meta.sources.length !== 1 ? 's' : ''}`;

            const panel = document.createElement('div');
            panel.className = 'jj-sources-panel jj-hidden';

            meta.sources.forEach(s => {
                const item = document.createElement('div');
                item.className = 'jj-source-item';
                const isOwn = s.knowledge_type === 'own words';
                const typeSpan = document.createElement('span');
                typeSpan.className = `jj-source-type ${isOwn ? 'jj-source-own' : 'jj-source-discourse'}`;
                typeSpan.textContent = isOwn ? 'own writings' : 'discourse';
                const titleSpan = document.createElement('span');
                titleSpan.className = 'jj-source-title';
                const yr = s.year && s.year !== 'Unknown' ? ` · ${s.year}` : '';
                titleSpan.textContent = (s.title || 'Unknown') + yr;
                item.appendChild(typeSpan);
                item.appendChild(titleSpan);
                panel.appendChild(item);
            });

            srcBtn.addEventListener('click', () => {
                panel.classList.toggle('jj-hidden');
                srcBtn.classList.toggle('jj-sources-active');
            });

            wrap.appendChild(srcBtn);
            wrap.appendChild(panel);
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

    // ── Corpus Stats (static page element) ───────────────────────────────────

    function renderCorpusStats(config) {
        const el = document.getElementById('jj-corpus-stats');
        if (!el) return;
        const ts = config.trust_score;
        if (!ts) return;

        const total = (ts.corpus_chunks || 0) + (ts.discourse_chunks || 0);
        if (total === 0 && ts.coverage_pct === 0) {
            el.innerHTML = `<div class="jj-cs-pending">Corpus pending ingest</div>`;
            return;
        }

        const pct = ts.coverage_pct || 0;
        const filled = Math.round(pct / 5);    // 20 segments
        const bar = '■'.repeat(filled) + '□'.repeat(20 - filled);
        const label = ts.coverage_label || '';
        const works = ts.works_in_corpus || 0;
        const known = ts.known_primary_works || 0;
        const corpusN = ts.corpus_chunks ? ts.corpus_chunks.toLocaleString() : '—';
        const discN = ts.discourse_chunks ? ts.discourse_chunks.toLocaleString() : null;

        el.innerHTML = `
            <div class="jj-cs-label">Corpus Coverage</div>
            <div class="jj-cs-bar" title="${pct}% of known primary works indexed">${bar} <span class="jj-cs-pct">${pct}%</span></div>
            <div class="jj-cs-meta">
                <span class="jj-cs-badge jj-cs-badge-${label.toLowerCase()}">${label}</span>
                <span class="jj-cs-detail">${works} of ${known} key primary works · ${corpusN} passages${discN ? ' + ' + discN + ' discourse' : ''}</span>
            </div>
            ${ts.missing_note ? `<div class="jj-cs-note">${ts.missing_note}</div>` : ''}
        `;
    }

    // ── PDF Export ───────────────────────────────────────────────────────────

    function enableDownload() {
        const btn = document.getElementById('jj-download');
        if (btn) btn.disabled = false;
    }

    function buildPdfStyles() {
        const name = personaConfig?.metadata?.name || PERSONA_ID;
        const primary = personaConfig?.widget?.theme?.primary_color || '#2a2a2a';
        return `
            body { font-family: Georgia, serif; color: #222; margin: 0; padding: 0; }
            .pdf-header { border-bottom: 2px solid ${primary}; padding-bottom: 10px; margin-bottom: 24px; }
            .pdf-title { font-size: 22px; font-weight: bold; color: ${primary}; margin: 0 0 4px; }
            .pdf-meta { font-size: 11px; color: #888; font-style: italic; }
            .pdf-msg { margin-bottom: 18px; }
            .pdf-msg-user { background: #f5f5f5; border-left: 3px solid #aaa; padding: 10px 14px; border-radius: 2px; }
            .pdf-msg-assistant { border-left: 4px solid ${primary}; padding: 10px 14px; }
            .pdf-speaker { font-size: 10px; text-transform: uppercase; letter-spacing: 0.6px; color: #888; margin-bottom: 5px; }
            .pdf-text { font-size: 13px; line-height: 1.65; white-space: pre-wrap; }
            .pdf-confidence { font-size: 9px; color: #888; font-style: italic; margin-top: 5px; }
            .pdf-footer { border-top: 1px solid #ddd; margin-top: 30px; padding-top: 8px; font-size: 9px; color: #aaa; text-align: center; }
        `;
    }

    async function exportChat() {
        const messages = [...document.querySelectorAll('#jj-messages .jj-message:not(.jj-message-system)')];
        if (!messages.length) return;

        const name = personaConfig?.metadata?.name || PERSONA_ID;
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${buildPdfStyles()}</style></head><body>`;
        html += `<div class="pdf-header"><div class="pdf-title">Conversation with ${name}</div><div class="pdf-meta">Museum of Minds · ${date}</div></div>`;

        messages.forEach(msg => {
            const isUser = msg.classList.contains('jj-message-user');
            const contentEl = msg.querySelector('.jj-message-content');
            const text = contentEl ? contentEl.textContent.trim() : '';
            if (!text) return;
            const speaker = isUser ? 'You' : name;
            const cls = isUser ? 'pdf-msg-user' : 'pdf-msg-assistant';
            const confEl = msg.querySelector('.jj-confidence');
            const confNote = (!isUser && confEl) ? `<div class="pdf-confidence">${confEl.textContent.trim()}</div>` : '';
            html += `<div class="pdf-msg"><div class="${cls}"><div class="pdf-speaker">${speaker}</div><div class="pdf-text">${escapeHtml(text)}</div>${confNote}</div></div>`;
        });

        html += `<div class="pdf-footer">Generated from Museum of Minds · museumofminds.com</div></body></html>`;

        await renderPdf(html, `${PERSONA_ID}-conversation.pdf`);
    }

    async function exportEduContent(content, filename, label) {
        const name = personaConfig?.metadata?.name || PERSONA_ID;
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${buildPdfStyles()}</style></head><body>`;
        html += `<div class="pdf-header"><div class="pdf-title">${name} — ${label.replace(/^\w/, c => c.toUpperCase())}</div><div class="pdf-meta">Museum of Minds · ${date}</div></div>`;
        html += `<div style="font-family:Georgia,serif;font-size:13px;line-height:1.7;white-space:pre-wrap;color:#222;">${escapeHtml(content)}</div>`;
        html += `<div class="pdf-footer">Generated from Museum of Minds · museumofminds.com</div></body></html>`;

        await renderPdf(html, filename);
    }

    function renderPdf(html, filename) {
        const win = window.open('', '_blank', 'width=820,height=700');
        if (!win) { alert('Allow popups to download this document.'); return; }
        win.document.write(html);
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); }, 400);
    }

    function escapeHtml(str) {
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    // ── Boot ─────────────────────────────────────────────────────────────────

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
