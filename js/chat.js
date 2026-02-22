/* Sun Air Shades Studio - 'Nivo' AI Chatbot System */

class SASChatbot {
    constructor() {
        this.isOpen = false;
        this.hasGreeted = false;
        this.lang = 'en';
        this.sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);

        // Supabase Configuration (Sovereign Infrastructure)
        this.config = {
            edgeFunctionUrl: 'https://osmdpnykhgeslxhcqczz.supabase.co/functions/v1/chat',
            anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zbWRwbnlraGdlc2x4aGNxY3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NDMyMTgsImV4cCI6MjA4NzMxOTIxOH0.KcSyPD12bfjt6oOYMX-vONngRBjS_lQJ_XBbwN3V0Eo'
        };

        this.knowledge = {
            en: {
                placeholder: "Ask Nivo about shades...",
                send: "Send",
                agentName: "Nivo",
                greeting: "Hi, I'm Nivo from Sun Air Shades Studio. Looking to upgrade your space with custom shades?"
            },
            es: {
                placeholder: "Pregunta a Nivo...",
                send: "Enviar",
                agentName: "Nivo",
                greeting: "Hola, soy Nivo de Sun Air Shades Studio. ¿Buscas mejorar tu espacio con cortinas modernas?"
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        if (document.getElementById('sas-chat-widget')) return;
        this.injectHTML();

        setTimeout(() => {
            if (!this.isOpen && !this.hasGreeted) {
                const t = this.knowledge[this.lang];
                this.addMessage(t.greeting, 'agent');
                this.addOptions([
                    { label: this.lang === 'en' ? "Interior Shades" : "Cortinas Interiores", value: "interior" },
                    { label: this.lang === 'en' ? "Exterior / Lanai" : "Exterior / Patio", value: "exterior" },
                    { label: this.lang === 'en' ? "Get a Quote" : "Cotizar", value: "quote" }
                ]);

                const dot = document.getElementById('sas-chat-dot');
                if (dot) dot.classList.remove('hidden');
                this.hasGreeted = true;
            }
        }, 3000);
    }

    injectHTML() {
        const t = this.knowledge[this.lang];
        const html = `
            <div id="sas-chat-widget" class="fixed bottom-6 right-6 z-50 font-sans pointer-events-none">
                <div id="sas-chat-window" class="hidden flex-col bg-zinc-900 border border-white/10 rounded-2xl w-[320px] sm:w-[350px] h-[450px] shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden mb-4 transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-auto">
                    <div class="bg-black/60 backdrop-blur-md p-4 flex items-center justify-between border-b border-white/5">
                        <div class="flex items-center gap-3">
                            <div class="relative">
                                <img src="images/nivo-avatar.png" class="w-8 h-8 rounded-full border border-white/10 object-cover" alt="Nivo">
                                <div class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-zinc-900"></div>
                            </div>
                            <div>
                                <h4 class="text-white text-xs font-bold uppercase tracking-[0.2em] mb-0.5" id="sas-agent-name">${t.agentName}</h4>
                                <span class="text-[9px] text-gray-400 uppercase tracking-widest">Sovereign AI Lead</span>
                            </div>
                        </div>
                        <button onclick="window.sasChat.toggle()" class="text-gray-500 hover:text-white transition-colors cursor-pointer p-1">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    <div id="sas-messages" class="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-[#0a0a0a]"></div>

                    <div class="p-3 bg-zinc-950 border-t border-white/5 flex gap-2">
                        <input type="text" id="sas-input" placeholder="${t.placeholder}" onkeypress="window.sasChat.handleEnter(event)" class="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-[13px] text-white focus:outline-none focus:border-gold-500 transition-colors">
                        <button onclick="window.sasChat.sendMessage()" class="bg-gold-500 text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-white transition-colors uppercase tracking-wider" id="sas-send-btn">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                </div>

                <button onclick="window.sasChat.toggle()" class="relative ml-auto flex items-center justify-center w-14 h-14 bg-gold-500 hover:bg-white rounded-full shadow-[0_4px_20px_rgba(234,179,8,0.3)] transition-all hover:scale-110 active:scale-95 group pointer-events-auto">
                    <svg class="w-6 h-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    <div id="sas-chat-dot" class="hidden absolute top-0 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-black rounded-full animate-bounce"></div>
                </button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const win = document.getElementById('sas-chat-window');
        const dot = document.getElementById('sas-chat-dot');

        if (this.isOpen) {
            win.style.display = 'flex';
            void win.offsetWidth;
            win.classList.remove('translate-y-4', 'opacity-0');
            win.classList.add('translate-y-0', 'opacity-100');
            if (dot) dot.classList.add('hidden');
        } else {
            win.classList.remove('translate-y-0', 'opacity-100');
            win.classList.add('translate-y-4', 'opacity-0');
            setTimeout(() => { if (!this.isOpen) win.style.display = 'none'; }, 300);
        }
    }

    setLanguage(newLang) {
        if (!this.knowledge[newLang] || this.lang === newLang) return;
        this.lang = newLang;
        const t = this.knowledge[newLang];
        const input = document.getElementById('sas-input');
        const agentName = document.getElementById('sas-agent-name');
        if (input) input.placeholder = t.placeholder;
        if (agentName) agentName.textContent = t.agentName;
    }

    handleEnter(e) {
        if (e.key === 'Enter') this.sendMessage();
    }

    async sendMessage(forceText = null) {
        if (!this.isOpen) this.toggle();
        const input = document.getElementById('sas-input');
        const text = forceText || input.value.trim();

        if (text) {
            this.addMessage(text, 'user');
            if (!forceText) input.value = '';
            this.showTyping();

            try {
                const response = await fetch(this.config.edgeFunctionUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.config.anonKey}`,
                        'apikey': this.config.anonKey
                    },
                    body: JSON.stringify({
                        userMessage: text,
                        sessionId: this.sessionId,
                        lang: this.lang
                    })
                });

                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();

                this.hideTyping();
                this.addMessage(data.reply, 'agent');

                if (data.triggerAudit) {
                    this.addOptions([{
                        label: this.lang === 'en' ? "Request Free Audit" : "Solicitar Auditoría",
                        value: "quote"
                    }]);
                }

            } catch (error) {
                console.error('Error:', error);
                this.hideTyping();
                const fallback = this.lang === 'en'
                    ? "I'm experiencing high volume. Let's schedule a free measurement to give you exact numbers."
                    : "Estoy procesando muchas consultas. Programemos una medición gratuita para darte números exactos.";
                this.addMessage(fallback, 'agent');
                this.addOptions([{
                    label: this.lang === 'en' ? "Schedule Consultation" : "Agendar Consulta",
                    value: "quote"
                }]);
            }
        }
    }

    showTyping() {
        const container = document.getElementById('sas-messages');
        const div = document.createElement('div');
        div.id = 'sas-typing';
        div.className = 'w-12 h-8 bg-zinc-800 rounded-2xl flex items-center justify-center gap-1 self-start';
        div.innerHTML = `<div class="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0s"></div>
                         <div class="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                         <div class="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>`;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    hideTyping() {
        const typing = document.getElementById('sas-typing');
        if (typing) typing.remove();
    }

    addMessage(text, sender) {
        const container = document.getElementById('sas-messages');
        const div = document.createElement('div');
        const isAgent = sender === 'agent';
        let classes = isAgent
            ? 'bg-zinc-800 text-gray-200 self-start rounded-r-2xl rounded-tl-2xl'
            : 'bg-gold-500 text-black self-end rounded-l-2xl rounded-tr-2xl font-medium';

        div.className = `max-w-[85%] px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${classes}`;
        div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    addOptions(options) {
        const container = document.getElementById('sas-messages');
        const div = document.createElement('div');
        div.className = 'flex flex-wrap gap-2 mt-1 mb-4 select-none';

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded border border-gold-500/30 text-gold-500 hover:bg-gold-500 hover:text-black transition-colors';
            btn.textContent = opt.label;
            btn.onclick = () => {
                this.addMessage(opt.label, 'user');
                div.remove();
                if (opt.value === 'quote') {
                    this.handleQuoteIntent();
                } else {
                    this.sendMessage(opt.label);
                }
            };
            div.appendChild(btn);
        });

        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    handleQuoteIntent() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            if (window.innerWidth < 640) setTimeout(() => this.toggle(), 1000);
        }
    }
}

window.sasChat = new SASChatbot();
