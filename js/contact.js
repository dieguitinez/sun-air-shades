/**
 * Sun Air Shades Studio - Lead Capture Handler
 * Protocol: Sovereign Data Ingestion (Supabase)
 */

window.sasStudio = {
    // Configuration - Replace with real Supabase credentials during deployment
    config: {
        url: 'https://wagqcziphaxffghdwojb.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhZ3FjemlwaGF4ZmZnaGR3b2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzODA3MTEsImV4cCI6MjA4Njk1NjcxMX0.RzdAAB-4i4VsG15Ot0dhi8Y0ruR2uOcRJsIv7atBcMI'
    },

    handleSubmit: async (event, lang) => {
        event.preventDefault();
        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;

        // Visual feedback starting
        submitBtn.disabled = true;
        submitBtn.innerText = lang === 'en' ? 'Processing Lead...' : 'Procesando Lead...';

        const formData = new FormData(form);
        const payload = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            project_area: formData.get('area'),
            budget_bracket: formData.get('budget'),
            message: formData.get('message'),
            lang: lang
        };

        try {
            // Route via Reliable Edge Function Bridge
            const response = await fetch(`${window.sasStudio.config.url}/functions/v1/process-lead`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': window.sasStudio.config.anonKey,
                    'Authorization': `Bearer ${window.sasStudio.config.anonKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Lead processing engine failed');

            // Success Transition
            if (window.setFormStatus) {
                window.setFormStatus('success');
            } else {
                form.innerHTML = `<div class="text-center py-12">
                    <h3 class="text-xl text-white font-serif mb-2">${lang === 'en' ? 'Inquiry Secured' : 'Consulta Asegurada'}</h3>
                    <p class="text-sm text-gray-400 mb-8">${lang === 'en' ? 'Nivo is notifying our strategy team.' : 'Nivo está notificando a nuestro equipo de estrategia.'}</p>
                </div>`;
            }

        } catch (error) {
            console.error('Submission Error:', error);
            // Fallback to mailto as absolute backup
            const body = Object.entries(payload).map(([k, v]) => `${k}: ${v}`).join('%0D%0A');
            window.location.href = `mailto:info@sunairshades.com?subject=Studio Consultation Request&body=${body}`;

            if (window.setFormStatus) window.setFormStatus('success');
        }
    }
};
