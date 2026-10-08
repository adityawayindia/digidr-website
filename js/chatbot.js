(function () {
    /* ── Config ── */
    var BOT_NAME = 'DigiDr Assistant';
    var BOT_ICON = 'img/chat_bot.png';

    var WELCOME_MSG = "Hi Doctor! 👋 I'm the DigiDr Assistant. How can I help you today?";

    var SUGGESTIONS = [
        'What is DigiDr?',
        'How to get started?',
        'Pricing plans',
        'Book a demo'
    ];

    /* Assistant content + exit-intent settings. Change copy and links here. */
    var CONFIG = {
        interestUrl: 'https://digidr.app/intrest',
        pricingUrl:  'pricing.html',
        support:     '',          /* e.g. 'support@digidr.app'. Empty = bot says the team follows up after registration. */
        typingDelay: 600,         /* ms */
        exit: {
            enabled: true,
            minSeconds: 8,        /* do not show the popup in the first N seconds on the page */
            bottomOffset: 60      /* px from the bottom of the page that counts as "reached the bottom" */
        },
        popup: {
            title: 'Before you go!',
            lines: [
                'Your digital presence deserves continuous attention.',
                'DigiDr is AI digital infrastructure for doctors. It builds your microsite and keeps it updated, and prepares health education content for your approval.'
            ],
            question: 'Would you like to know more?',
            yes: 'Yes, Tell Me More',
            no: 'Maybe Later'
        },
        /* Page sections the assistant can scroll to (desktop only). First match on the current page wins. */
        cues: {
            how: ['#how-it-works', '.hiw-steps'],
            faq: ['#faq', '.pricing-faq']
        }
    };

    /* QA mode: add ?ddtest=1 to the URL to skip the wait and the once-per-session limit */
    var TEST = /[?&]ddtest=1/.test(window.location.search);
    if (TEST) CONFIG.exit.minSeconds = 0;

    /* ── Inject CSS ── */
    (function injectCSS() {
        if (document.getElementById('chatbot-css')) return;
        var link = document.createElement('link');
        link.id   = 'chatbot-css';
        link.rel  = 'stylesheet';
        link.href = 'css/chatbot.css';
        document.head.appendChild(link);
    })();

    /* ── Build HTML ── */
    function svgSend() {
        return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
    }

    function buildSuggestions() {
        return SUGGESTIONS.map(function (s) {
            return '<button class="chatbot-suggestion-chip" type="button">' + escHtml(s) + '</button>';
        }).join('');
    }

    function escHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /* Bot copy: escaped text, **bold**, and one paragraph per line */
    function fmtBot(str) {
        return escHtml(str)
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .split('\n')
            .map(function (p) { return '<p>' + p + '</p>'; })
            .join('');
    }

    function buildExitPopup() {
        var p = CONFIG.popup;
        return '<div class="chatbot-exit-popup" id="chatbotExitPopup" role="dialog" aria-labelledby="chatbotExitTitle" hidden>' +
                '<div class="chatbot-exit-head">' +
                    '<div class="chatbot-header-avatar">' +
                        '<img src="' + BOT_ICON + '" alt="" aria-hidden="true">' +
                    '</div>' +
                    '<p class="chatbot-exit-title" id="chatbotExitTitle">' + escHtml(p.title) + '</p>' +
                    '<button type="button" class="chatbot-header-close" id="chatbotExitClose" aria-label="Close">' +
                        '<span class="material-symbols-outlined" aria-hidden="true">close</span>' +
                    '</button>' +
                '</div>' +
                p.lines.map(function (l) { return '<p class="chatbot-exit-text">' + escHtml(l) + '</p>'; }).join('') +
                '<p class="chatbot-exit-question">' + escHtml(p.question) + '</p>' +
                '<div class="chatbot-exit-actions">' +
                    '<button type="button" class="chatbot-exit-btn chatbot-exit-btn--primary" id="chatbotExitYes">' + escHtml(p.yes) + '</button>' +
                    '<button type="button" class="chatbot-exit-btn" id="chatbotExitNo">' + escHtml(p.no) + '</button>' +
                '</div>' +
            '</div>';
    }

    function getTime() {
        var d = new Date();
        var h = d.getHours(), m = d.getMinutes();
        var ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
    }

    var widgetHTML =
        '<div class="chatbot-fab-wrap" id="chatbotFabWrap">' +

            '<div class="chatbot-backdrop" id="chatbotBackdrop" aria-hidden="true"></div>' +

            /* Chat window */
            '<div class="chatbot-window" id="chatbotWindow" style="display:none;" role="dialog" aria-modal="true" aria-label="' + BOT_NAME + ' chat window">' +

                /* Header */
                '<div class="chatbot-header">' +
                    '<div class="chatbot-header-avatar">' +
                        '<img src="' + BOT_ICON + '" alt="' + BOT_NAME + '">' +
                    '</div>' +
                    '<div class="chatbot-header-info">' +
                        '<p class="chatbot-header-name">' + BOT_NAME + '</p>' +
                    '</div>' +
                    '<button type="button" class="chatbot-header-close" id="chatbotRestartBtn" aria-label="Start over" title="Start over">' +
                        '<span class="material-symbols-outlined" aria-hidden="true">restart_alt</span>' +
                    '</button>' +
                    '<button type="button" class="chatbot-header-close" id="chatbotCloseBtn" aria-label="Close chat">' +
                        '<span class="material-symbols-outlined" aria-hidden="true">close</span>' +
                    '</button>' +
                '</div>' +

                /* Messages */
                '<div class="chatbot-messages" id="chatbotMessages" role="log" aria-live="polite" aria-label="Chat messages"></div>' +

                /* Quick-reply chips */
                '<div class="chatbot-suggestions" id="chatbotSuggestions">' +
                    buildSuggestions() +
                '</div>' +

                /* Input */
                '<div class="chatbot-input-area">' +
                    '<div class="chatbot-input-wrap">' +
                        '<textarea class="chatbot-input" id="chatbotInput" placeholder="Type your message…" rows="1" aria-label="Type your message"></textarea>' +
                    '</div>' +
                    '<button class="chatbot-send-btn" id="chatbotSendBtn" aria-label="Send message" disabled>' + svgSend() + '</button>' +
                '</div>' +

                /* Footer */
                '<div class="chatbot-footer">Powered by <b>DigiDr AI</b>' +
                    '<span class="chatbot-footer-note">Please do not share personal or health details here.</span>' +
                '</div>' +

            '</div>' +

            /* Exit-intent popup */
            buildExitPopup() +

            /* FAB */
            '<button class="chatbot-fab" id="chatbotFab" aria-label="Open DigiDr Assistant" aria-expanded="false" aria-controls="chatbotWindow">' +
                '<img class="chatbot-fab-logo" src="' + BOT_ICON + '" alt="" aria-hidden="true">' +
                '<span class="chatbot-fab-text">Ask DigiDr AI</span>' +
                '<span class="chatbot-badge" id="chatbotBadge" aria-label="1 new message">1</span>' +
            '</button>' +

        '</div>';

    /* ── Mount ── */
    var mount = document.getElementById('chatbot-mount');
    if (mount) {
        mount.outerHTML = widgetHTML;
    } else {
        var div = document.createElement('div');
        div.innerHTML = widgetHTML;
        document.body.appendChild(div.firstElementChild);
    }

    /* ── DOM References ── */
    var wrap        = document.getElementById('chatbotFabWrap');
    var fab         = document.getElementById('chatbotFab');
    var closeBtn    = document.getElementById('chatbotCloseBtn');
    var backdrop    = document.getElementById('chatbotBackdrop');
    var window_     = document.getElementById('chatbotWindow');
    var messagesEl  = document.getElementById('chatbotMessages');
    var inputEl     = document.getElementById('chatbotInput');
    var sendBtn     = document.getElementById('chatbotSendBtn');
    var suggestions = document.getElementById('chatbotSuggestions');
    var badge       = document.getElementById('chatbotBadge');
    var restartBtn  = document.getElementById('chatbotRestartBtn');
    var exitPopup   = document.getElementById('chatbotExitPopup');

    var isOpen = false;
    var hasOpened = false;
    var heroInView = false;
    var heroFabMobileQuery = window.matchMedia('(max-width: 768px)');

    /* ── Helpers ── */
    function addMessage(text, sender) {
        /* sender: 'bot' | 'user' */
        var msgEl = document.createElement('div');
        msgEl.className = 'chatbot-msg ' + sender;

        if (sender === 'bot') {
            msgEl.innerHTML =
                '<div class="chatbot-msg-avatar"><img src="' + BOT_ICON + '" alt="bot"></div>' +
                '<div>' +
                    '<div class="chatbot-msg-bubble">' + fmtBot(text) + '</div>' +
                    '<div class="chatbot-msg-time">' + getTime() + '</div>' +
                '</div>';
        } else {
            msgEl.innerHTML =
                '<div>' +
                    '<div class="chatbot-msg-bubble">' + escHtml(text) + '</div>' +
                    '<div class="chatbot-msg-time">' + getTime() + '</div>' +
                '</div>';
        }

        messagesEl.appendChild(msgEl);
        scrollToBottom();
    }

    function showTyping() {
        var el = document.createElement('div');
        el.className = 'chatbot-typing';
        el.id = 'chatbotTyping';
        el.innerHTML =
            '<div class="chatbot-msg-avatar"><img src="' + BOT_ICON + '" alt="bot"></div>' +
            '<div class="chatbot-typing-dots"><span></span><span></span><span></span></div>';
        messagesEl.appendChild(el);
        scrollToBottom();
    }

    function hideTyping() {
        var el = document.getElementById('chatbotTyping');
        if (el) el.remove();
    }

    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function addDivider(label) {
        var el = document.createElement('div');
        el.className = 'chatbot-divider';
        el.textContent = label;
        messagesEl.appendChild(el);
    }

    /* ── Conversation engine ──
       Rules baked into the copy: no prices, no discounts, no free-trial wording,
       no outcome promises, nothing published without approval. */
    function track(name, params) {
        if (window.digidrTrack) window.digidrTrack(name, params);
    }

    var store = {
        get: function (k) { if (TEST) return null; try { return sessionStorage.getItem(k); } catch (e) { return null; } },
        set: function (k, v) { if (TEST) return; try { sessionStorage.setItem(k, v); } catch (e) {} }
    };
    function markEngaged() { store.set('dd_popup_done', '1'); }

    var chain = Promise.resolve();
    var convoId = 0;        /* bumped on restart so queued replies from the old conversation are dropped */
    var invited = false;

    function hideSuggestions() {
        if (suggestions) suggestions.style.display = 'none';
    }

    function botSay(text) {
        var id = convoId;
        showTyping();
        return new Promise(function (resolve) {
            setTimeout(function () {
                if (id !== convoId) return;
                hideTyping();
                addMessage(text, 'bot');
                resolve();
            }, CONFIG.typingDelay);
        });
    }

    /* Steps: a string is a bot message, a function is an action (may return a promise) */
    function run(steps) {
        var id = convoId;
        return steps.reduce(function (p, step) {
            return p.then(function () {
                if (id !== convoId) return;
                return typeof step === 'string' ? botSay(step) : step();
            });
        }, Promise.resolve());
    }

    function enqueue(fn) {
        chain = chain.then(fn).catch(function (e) { if (window.console) console.error(e); });
        return chain;
    }

    function dispatch(intent) {
        if (!H[intent]) intent = 'fallback';
        track('chatbot_topic', { topic: intent });
        enqueue(function () { return run(H[intent]); });
    }

    function freezeReplies() {
        messagesEl.querySelectorAll('.chatbot-replies:not(.is-done)').forEach(function (w) {
            w.classList.add('is-done');
        });
    }

    function replies(opts, stack) {
        var wrapEl = document.createElement('div');
        wrapEl.className = 'chatbot-replies' + (stack ? ' chatbot-replies--stack' : '');
        opts.forEach(function (o) {
            var el;
            if (o.url) {
                el = document.createElement('a');
                el.href = o.url;
                el.target = '_blank';
                el.rel = 'noopener';
                el.addEventListener('click', function () {
                    track(o.track || 'chatbot_link_click', { link_url: o.url });
                    markEngaged();
                });
            } else {
                el = document.createElement('button');
                el.type = 'button';
                el.addEventListener('click', function () {
                    if (wrapEl.classList.contains('is-done')) return;
                    freezeReplies();
                    el.classList.add('is-picked');
                    hideSuggestions();
                    addMessage(o.label, 'user');
                    dispatch(o.intent);
                });
            }
            el.className = 'chatbot-reply-chip' + (o.primary ? ' chatbot-reply-chip--primary' : '');
            el.textContent = o.label;
            wrapEl.appendChild(el);
        });
        messagesEl.appendChild(wrapEl);
        scrollToBottom();
    }

    function cta(label, url, trackName) {
        var a = document.createElement('a');
        a.className = 'chatbot-cta';
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = label;
        a.addEventListener('click', function () {
            track(trackName);
            markEngaged();
        });
        messagesEl.appendChild(a);
        scrollToBottom();
    }

    /* Scroll the page to a section (desktop only, and only if this page has it) */
    function cue(key) {
        if (window.innerWidth < 900) return;
        var list = CONFIG.cues[key] || [];
        var el = null;
        for (var i = 0; i < list.length && !el; i++) el = document.querySelector(list[i]);
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('chatbot-cue-pulse');
        setTimeout(function () { el.classList.remove('chatbot-cue-pulse'); }, 2200);
    }

    var REG = { label: 'Register your interest', url: CONFIG.interestUrl, primary: true, track: 'chatbot_interest_click' };
    var MAIN = [
        { label: 'What is DigiDr?',          intent: 'what' },
        { label: 'Explore Capabilities',     intent: 'caps' },
        { label: 'How Does DigiDr Work?',    intent: 'how' },
        { label: 'Pricing & Plans',          intent: 'pricing' },
        { label: 'DigiDr team contacted me', intent: 'team' }
    ];
    var TOPICS = MAIN.slice(0, 4);
    var CAPS = [
        { label: 'Your presence', intent: 'capsP' },
        { label: 'Your content',  intent: 'capsC' },
        { label: 'Your insights', intent: 'capsI' }
    ];
    var SUPPORT_LINE = CONFIG.support
        ? 'You can reach our team at ' + CONFIG.support + '.'
        : 'Our team takes things forward once you register your interest.';

    function follow(exclude, withReg) {
        var list = TOPICS.filter(function (t) { return t.intent !== exclude; }).slice(0, 3);
        list.push({ label: 'More questions', intent: 'faq' });
        if (withReg !== false) list.push(REG);
        replies(list);
    }
    function capsFollow(exclude) {
        var list = CAPS.filter(function (o) { return o.intent !== exclude; });
        list.push({ label: 'Pricing & Plans', intent: 'pricing' });
        list.push(REG);
        replies(list);
    }
    function faqFollow() {
        replies([{ label: 'More questions', intent: 'faq' }, { label: 'Pricing & Plans', intent: 'pricing' }, REG]);
    }
    function plansMenu(exclude) {
        var all = [
            { label: 'Is Lite really free?',         intent: 'lite' },
            { label: 'When does a paid plan start?', intent: 'start' },
            { label: 'Cancellation & refunds',       intent: 'cancel' },
            { label: 'Upgrade or downgrade',         intent: 'upgrade' },
            { label: 'Renewal',                      intent: 'renewal' },
            { label: 'Back to main menu',            intent: 'menu' }
        ];
        replies(all.filter(function (o) { return o.intent !== exclude; }), true);
    }
    function pricingBtn() { cta('View Pricing & Plans', CONFIG.pricingUrl, 'chatbot_pricing_click'); }
    function interestBtn() { cta('Register your interest', CONFIG.interestUrl, 'chatbot_interest_click'); }

    /* Proactive invitation: once per conversation. Resolves true if it was shown now. */
    function inviteOnce() {
        if (invited) return Promise.resolve(false);
        invited = true;
        return botSay('Every doctor begins by registering their interest, so our team can prepare your onboarding.')
            .then(function () { interestBtn(); return true; });
    }

    var H = {
        menu:     ['What would you like to know?', function () { replies(MAIN, true); }],
        greet:    ['Hi Doctor! How can I help you today?', function () { replies(MAIN, true); }],
        thanks:   ["You're welcome, Doctor! Is there anything else you would like to know?", function () { follow(null); }],

        what: [
            'DigiDr is AI digital infrastructure for doctors. You create your own microsite in minutes, with a verified profile, your services, FAQs and online appointment booking.',
            'DigiDr also prepares health education and awareness content for your speciality, such as social posts, mailers and blogs. Everything is sent to you for approval before it is published, and it goes out under your own name and handles.',
            function () { follow('what'); }
        ],

        caps: ['Which area would you like to know about?', function () { replies(CAPS); }],
        capsP: [
            '**Your microsite** is your digital presence: a verified profile, your services, FAQs and online appointment booking, live in minutes.\nAppointment requests that come through your microsite appear in your Appointments section.',
            function () { capsFollow('capsP'); }
        ],
        capsC: [
            'DigiDr prepares health education and awareness content about diseases and health topics relevant to your speciality: **social posts, mailers** (bulk patient emails), **blogs** and **Trending Topics**.\nEverything appears in Review & Approve first. Nothing is published without your approval.',
            function () { capsFollow('capsC'); }
        ],
        capsI: [
            '**Analytics & Insights** shows how your digital presence is performing. **Track Referrals** shows the tests you have sent to partner labs.',
            function () { capsFollow('capsI'); }
        ],

        how: [
            'It takes five steps:\n1. Register your interest.\n2. DigiDr prepares your onboarding.\n3. You build your microsite in minutes.\n4. You review and approve your content.\n5. You track results in Analytics.',
            function () {
                return inviteOnce().then(function (shown) {
                    follow('how', !shown);
                    cue('how');
                });
            }
        ],

        pricing: [
            '**Lite** is our free plan, and it is free for life. No card needed, and it does not expire. You can start there, or choose Classic, Premium or Pro directly.\nPaid plans are booked for 6 or 12 months, and prices include GST. For current plans and pricing, please see the Pricing page.',
            pricingBtn,
            inviteOnce,
            'Would you like to know more about plans?',
            function () { plansMenu(null); }
        ],
        /* ANY price, discount, offer or "how much" question */
        pricingRule: [
            'The Pricing page has our current plans and details, so you always see the latest there.',
            pricingBtn,
            function () { replies([{ label: 'Is Lite really free?', intent: 'lite' }, { label: 'Back to main menu', intent: 'menu' }]); }
        ],
        paidfree: [
            'That is a paid plan. **Lite** is our free plan, and it is free for life. You can see current plans and pricing on the Pricing page.',
            pricingBtn,
            function () { plansMenu(null); }
        ],
        lite: [
            'Yes. **Lite is free for life.** No card is needed and it does not expire.\nIt includes a verified profile and DigiDr badge, a permanent microsite, basic Google indexing, 1 weekly post on 2 platforms, 1 mailer a month, appointment requests and basic analytics. Lite starts as soon as your onboarding is ready.',
            function () { plansMenu('lite'); }
        ],
        start: [
            'Lite starts as soon as your onboarding is ready.\nA paid plan starts on the **1st of the coming month**, even if you pay mid-month. Until then you stay on Lite. Paid plans run for the term you book, 6 or 12 months.',
            function () { plansMenu('start'); }
        ],
        cancel: [
            'You can cancel for a **full refund until 3 days before your plan starts**. For a plan starting on 1 November, the last day is 29 October. To cancel, use the Cancel button in Billing and enter your invoice number. We process the refund within 10 bank working days, to your original payment method. The refund includes GST.',
            'After that, your plan continues until the end of your booked term, then your account returns to Lite, which is free for life. Fees paid are non-refundable, except where required by law. A payment made within 3 days of your plan start date is non-refundable. The same applies to upgrade and renewal payments.',
            pricingBtn,
            function () { plansMenu('cancel'); }
        ],
        upgrade: [
            'You can upgrade anytime. Your running month does not change. The upgrade starts on the **1st of the coming month**, once you pay the difference between your current plan and the upgrade plan for the remaining months of your term (GST included).\nIn the last month of your plan, you renew on the higher plan instead.',
            'A downgrade works like a cancellation: your current plan continues until the end of your booked term. You can then renew on the lower plan, or return to Lite.',
            pricingBtn,
            function () { plansMenu('upgrade'); }
        ],
        renewal: [
            'Plans **do not renew automatically**, and nothing is charged automatically. We remind you from 40 days before your plan ends, and you renew by choosing your plan and term (6 or 12 months) and paying. The renewal price is the offer prevailing on the day you pay, and it is shown before you pay.\nIf you do not renew, your account returns to Lite, which is free for life.',
            pricingBtn,
            function () { plansMenu('renewal'); }
        ],

        faq: [
            'Here are some common questions:',
            function () {
                replies([
                    { label: 'Is it just AI content with my name?', intent: 'ai' },
                    { label: 'Is content published automatically?', intent: 'auto' },
                    { label: 'Do I own my profile and content?',    intent: 'own' },
                    { label: 'Will I get more patients?',           intent: 'patients' },
                    { label: 'Can you fix my Google listing?',      intent: 'google' },
                    { label: 'How is it different from an agency?', intent: 'agency' }
                ], true);
                cue('faq');
            }
        ],
        ai:       ['Content is matched to your speciality, reviewed by you, and published under your name.\nIt supports your judgment, it does not replace it.', faqFollow],
        auto:     ['No. All content is sent to you in Review & Approve first, and nothing is published without your approval.', faqFollow],
        own:      ['Yes. Your profile and content are published under your name and handles, and they are yours to keep if you leave.', faqFollow],
        patients: ['No one can promise a number, because results depend on your speciality, location and how consistently you stay active.\nWhat DigiDr does is keep your digital presence updated and your content going out regularly, which can help patients nearby find and trust you in local search. You approve everything before it is published.', faqFollow],
        google:   ['DigiDr builds your microsite and prepares your content. It does not change listings on Google or other sites.\nYour microsite is optimised for search, but rankings cannot be promised.', faqFollow],
        agency:   ['No briefs, meetings or retainers. You create your microsite yourself in minutes, and DigiDr prepares content for you to approve.', faqFollow],

        team: [
            "Welcome, Doctor. Our team is glad you're here. You can register your interest below, and I'm happy to answer any questions first.",
            function () { interestBtn(); invited = true; follow(null, false); }
        ],
        register: [
            'Great. Every doctor begins by registering their interest, so our team can prepare your onboarding. Our team takes it forward from there.',
            function () { interestBtn(); invited = true; replies([{ label: 'Ask another question', intent: 'menu' }]); }
        ],
        support: [
            SUPPORT_LINE,
            function () {
                if (!CONFIG.support) interestBtn();
                replies([{ label: 'Ask another question', intent: 'menu' }]);
            }
        ],
        medical: [
            'I can only help with DigiDr and your online presence. For clinical questions, please consult appropriate medical resources.',
            function () { replies([{ label: 'Back to main menu', intent: 'menu' }]); }
        ],
        fallback: [
            "I'm not sure about that one, and I don't want to guess. " + SUPPORT_LINE,
            function () { replies(MAIN, true); }
        ]
    };

    /* Typed message -> topic (keyword routing; swap for an AI call later) */
    function route(text) {
        var t = String(text).toLowerCase().replace(/\s+/g, ' ').trim();
        function has(re) { return re.test(t); }

        /* Greetings and thanks only count when that is the whole message,
           so "hi, how much is Pro?" still routes to pricing. */
        var lead = t.match(/^(?:(?:hi+|hello|hey|namaste|good (?:morning|afternoon|evening)|thanks|thank you|thankyou|thx)\b[\s,!.]*)+/);
        if (lead) {
            var rest = t.slice(lead[0].length).replace(/^(?:doctor|dr|there|team|digidr|so much|a lot)\b[\s,!.]*/, '').trim();
            if (!rest) return /thank|thx/.test(lead[0]) ? 'thanks' : 'greet';
            t = rest;
        }

        if (has(/team (contacted|called|reached)|contacted me|called me|reached out|invited me/)) return 'team';
        if (has(/symptom|diagnos|dosage|\bdose\b|medicine|medication|prescri/) &&
            !has(/digidr|practi[cs]e|clinic|speciality|specialty|microsite|website|content|post/)) return 'medical';
        if (has(/refund|cancel|money back/)) return 'cancel';
        if (has(/upgrade|downgrade|switch plan|change plan/)) return 'upgrade';
        if (has(/\blite\b/) && has(/free|expire|expiry/)) return 'lite';
        if (has(/renew|expire|expiry|auto.?pay|auto.?debit/)) return 'renewal';
        if (has(/when.*(start|begin|activate)|start date|activation/) && has(/plan|paid|\bpro\b|premium|classic|lite|month/)) return 'start';
        if (has(/classic|premium|\bpro\b/) && has(/\bfree\b/)) return 'paidfree';
        if (has(/trial|free for life|\blite\b|free plan|\bfree\b/)) return 'lite';
        if (has(/price|pricing|\bcosts?\b|\bfees?\b|how much|discount|coupon|promo|\bany offers?\b|\boffers? (on|for|available)|₹|\brs\.?\b|rupee|payment|\bgst\b|invoice|subscription|\bcharges?\b|\bcharged\b/)) return 'pricingRule';
        if (has(/\bplans?\b/)) return 'pricing';
        if (has(/more patients|new patients|get (more )?patients|patients? (a|per) month|how many patients|\d+ patients|guarantee|\bgrow(th)?\b|footfall/)) return 'patients';
        if (has(/google|listing|\bseo\b|search (engine|result|ranking)|\brank(s|ed|ing|ings)?\b/)) return 'google';
        if (has(/automatic|auto.?publish|publish|approve|approval/)) return 'auto';
        if (has(/\bai\b.*(content|generat|writ|post|blog)|ai.?generated|(generated|written) by ai|\b(just|only) ai\b|chatgpt|my name on|with my name/)) return 'ai';
        if (has(/do i own|who owns|ownership|belong|if i leave|keep my/)) return 'own';
        if (has(/agenc(y|ies)|\bvs\.?\b|versus|compare|different from|difference/)) return 'agency';
        if (has(/how.*work|\bsteps?\b|process/)) return 'how';
        if (has(/capabilit|feature|microsite|website|mailer|blog|social|\bposts?\b|appointment|referral|analytic|trending/)) return 'caps';
        if (has(/what is|what's|what does|what do you (do|offer)|about digidr|tell me about|who are/)) return 'what';
        if (has(/register|sign.?up|\bjoin\b|interest|get started|\bstart\b|begin|apply|onboard|\bdemo\b/)) return 'register';
        if (has(/support|help desk|human|\bperson\b|\bcall\b|contact|talk to|speak/)) return 'support';
        return 'fallback';
    }

    /* Clears the chat and greets. With an intent (e.g. from the exit popup) it goes straight to that topic. */
    function startConversation(intent) {
        convoId++;
        chain = Promise.resolve();
        invited = false;
        messagesEl.innerHTML = '';
        if (suggestions) suggestions.style.display = '';
        addDivider('Today');
        if (intent) {
            enqueue(function () { return botSay("Hi Doctor! I'm the DigiDr Assistant."); });
            dispatch(intent);
        } else {
            enqueue(function () { return run([WELCOME_MSG, function () { replies(MAIN, true); }]); });
        }
    }

    function openChat(intent) {
        isOpen = true;
        if (window.digidrTrack) window.digidrTrack('chatbot_open');
        hidePopup();
        markEngaged();
        wrap.classList.add('is-open');
        wrap.classList.remove('chatbot-fab-wrap--hero-hidden');
        fab.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
        window_.style.display = 'flex';
        window_.classList.remove('is-closing');

        if (!hasOpened) {
            hasOpened = true;
            startConversation(intent);
        } else if (intent) {
            freezeReplies();
            dispatch(intent);
        }

        /* Hide badge */
        if (badge) badge.style.display = 'none';

        /* Focus input after animation */
        setTimeout(function () { inputEl.focus(); }, 330);
    }

    function closeChat() {
        isOpen = false;
        wrap.classList.remove('is-open');
        fab.setAttribute('aria-expanded', 'false');
        fab.setAttribute('aria-label', 'Open DigiDr Assistant');
        if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
        window_.classList.add('is-closing');

        setTimeout(function () {
            window_.style.display = 'none';
            window_.classList.remove('is-closing');
            updateHeroFabVisibility();
            if (fab && fab.focus) fab.focus();
        }, 220);
    }

    function updateHeroFabVisibility() {
        if (!wrap) return;
        if (isOpen || !heroFabMobileQuery.matches) {
            wrap.classList.remove('chatbot-fab-wrap--hero-hidden');
            return;
        }
        wrap.classList.toggle('chatbot-fab-wrap--hero-hidden', heroInView);
    }

    function initHeroFabVisibility() {
        var hero = document.querySelector('.hero-section');
        if (!hero || !wrap || !('IntersectionObserver' in window)) return;

        var observer = new IntersectionObserver(function (entries) {
            heroInView = entries[0].isIntersecting;
            updateHeroFabVisibility();
        }, {
            threshold: 0,
            rootMargin: '0px 0px -10% 0px'
        });

        observer.observe(hero);
        heroFabMobileQuery.addEventListener('change', updateHeroFabVisibility);
        updateHeroFabVisibility();
    }

    function sendMessage(text) {
        text = text.trim();
        if (!text) return;

        /* Hide suggestions after first interaction */
        if (suggestions) suggestions.style.display = 'none';

        freezeReplies();
        addMessage(text, 'user');
        inputEl.value = '';
        inputEl.style.height = 'auto';
        sendBtn.disabled = true;

        dispatch(route(text));
    }

    /* ── Auto-resize textarea ── */
    inputEl.addEventListener('input', function () {
        sendBtn.disabled = !inputEl.value.trim();
        inputEl.style.height = 'auto';
        inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
    });

    /* ── Send on Enter (Shift+Enter for newline) ── */
    inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendBtn.disabled) {
                if (window.digidrTrack) window.digidrTrack('chatbot_message_sent');
                sendMessage(inputEl.value);
            }
        }
    });

    /* ── Button events ── */
    fab.addEventListener('click', function () {
        if (!isOpen) openChat();
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeChat);
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', function () {
            track('chatbot_restart');
            startConversation();
        });
    }

    if (backdrop) {
        backdrop.addEventListener('click', closeChat);
    }

    sendBtn.addEventListener('click', function () {
        if (window.digidrTrack) window.digidrTrack('chatbot_message_sent');
        sendMessage(inputEl.value);
    });

    /* ── Suggestion chips ── */
    suggestions.addEventListener('click', function (e) {
        var chip = e.target.closest('.chatbot-suggestion-chip');
        if (!chip) return;
        if (window.digidrTrack) window.digidrTrack('chatbot_suggestion_click', { suggestion: chip.textContent.trim() });
        if (chip.textContent.trim() === 'Pricing plans') {
            window.location.href = 'pricing.html';
            return;
        }
        sendMessage(chip.textContent);
    });

    /* ── Close on Escape ── */
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (exitPopup && !exitPopup.hidden) dismissPopup();
        else if (isOpen) closeChat();
    });

    /* ── Close on outside click ── */
    document.addEventListener('click', function (e) {
        if (isOpen && !wrap.contains(e.target)) {
            closeChat();
        }
    });

    /* ── Collapse/Expand FAB on scroll ── */
    function initScrollCollapse() {
        if (!fab) return;
        var lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
        var ticking = false;
        var threshold = 10;

        function onScroll() {
            var currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScrollY <= 50) {
                fab.classList.remove('is-collapsed');
                lastScrollY = currentScrollY;
                ticking = false;
                return;
            }

            var diff = currentScrollY - lastScrollY;
            if (Math.abs(diff) >= threshold) {
                if (diff > 0) {
                    fab.classList.add('is-collapsed');
                } else {
                    fab.classList.remove('is-collapsed');
                }
                lastScrollY = currentScrollY;
            }

            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(onScroll);
                ticking = true;
            }
        }, { passive: true });
    }

    /* ── Exit-intent popup ──
       Shows ONCE per visit when the visitor scrolls to the bottom of the page,
       or moves the mouse up and out of the page (towards the tabs/address bar).
       Never shows in the first N seconds, while the chat is open, or after the
       visitor has opened the chat or clicked Register. */
    var exitArmed = false;

    function showPopup(reason) {
        if (!exitPopup || !CONFIG.exit.enabled || !exitArmed) return;
        if (isOpen || !exitPopup.hidden || store.get('dd_popup_done')) return;
        exitPopup.hidden = false;
        store.set('dd_popup_done', '1');
        track('exit_popup_shown', { reason: reason });
    }

    function hidePopup() {
        if (exitPopup) exitPopup.hidden = true;
    }

    function dismissPopup() {
        hidePopup();
        track('exit_popup_dismissed');
    }

    function initExitIntent() {
        if (!exitPopup || !CONFIG.exit.enabled) return;
        setTimeout(function () { exitArmed = true; }, CONFIG.exit.minSeconds * 1000);

        document.documentElement.addEventListener('mouseleave', function (e) {
            if (e.clientY <= 0) showPopup('mouse_top');
        });
        window.addEventListener('scroll', function () {
            var atBottom = window.innerHeight + window.pageYOffset >=
                document.documentElement.scrollHeight - CONFIG.exit.bottomOffset;
            if (atBottom) showPopup('scroll_bottom');
        }, { passive: true });

        document.getElementById('chatbotExitClose').addEventListener('click', dismissPopup);
        document.getElementById('chatbotExitNo').addEventListener('click', dismissPopup);
        document.getElementById('chatbotExitYes').addEventListener('click', function () {
            track('exit_popup_yes');
            openChat('what');
        });
    }

    initHeroFabVisibility();
    initScrollCollapse();
    initExitIntent();

})();
