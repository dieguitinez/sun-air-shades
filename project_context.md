# Sun Air Shades - Estado del Proyecto (Context Snapshot)

*Actualizado el: 2026-02-21*

## 🎯 Metas Logradas Hoy

- [x] **Nivo AI Bridge**: Implementada la Edge Function en Supabase vinculada a Gemini 2.5 Flash.
- [x] **Avatar Oficial**: Integrada la imagen personalizada del usuario como avatar de Nivo.
- [x] **Email Reliability Engine**: Creada función `process-lead` para asegurar que cada formulario llegue a `admin@sunair-shades.com` vía Resend.
- [x] **Refactorización de Chat**: El widget ahora es dinámico, bilingüe y sigue las reglas de negocio (fabricación local, tiempos de cortinas de impacto).
- [x] **Branding Nivo Partners**: Footer actualizado con colores (Blanco/Azul) y logo oficial.

## 🏗️ Arquitectura Actual

- **Frontend**: Vanilla HTML/JS/CSS + React (en index.html).
- **Backend**: Supabase Edge Functions (`chat` para IA, `process-lead` para leads).
- **IA**: Gemini 2.5 Flash.
- **Email**: Resend API.
- **Ruta de Archivos Clave**:
  - `js/chat.js` (Lógica de Nivo)
  - `js/contact.js` (Captura de Leads)
  - `supabase/functions/chat/index.ts` (IA Persona)
  - `supabase/functions/process-lead/index.ts` (Notificaciones)

## 🔜 Pendiente (Mañana)

- [ ] **Dominio**: Verificar y registrar `StudioSunAirShades.com` en Cloudflare (Meta: Costo Cero).
- [ ] **Configuración de Secrets**: Añadir `GEMINI_API_KEY`, `RESEND_API_KEY` y `NOTIFICATION_EMAIL` en Supabase.
- [ ] **Despliegue Final**: Conectar el frontend a Cloudflare Pages vinculado al nuevo dominio.
- [ ] **n8n & Invoicing**: Explorar automatizaciones adicionales una vez el sitio esté en vivo.

---
*Cerrado por hoy: 2026-02-21 02:22 AM. Todo listo para el lanzamiento mañana.*
