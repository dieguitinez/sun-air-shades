import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const payload = await req.json()
        const { name, email, phone, project_area, budget_bracket, message, lang = 'en' } = payload

        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        const resendApiKey = Deno.env.get('RESEND_API_KEY')
        const recipientEmail = Deno.env.get('NOTIFICATION_EMAIL') || 'admin@sunair-shades.com'

        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // 1. Data Ingestion (Supabase)
        const { data: dbData, error: dbError } = await supabase
            .from('leads')
            .insert([{
                name,
                email,
                phone,
                project_area,
                budget_bracket,
                message,
                source: 'sas_studio_landing_v2',
                status: 'new'
            }])
            .select()
            .single()

        if (dbError) throw dbError

        // 2. Email Transmission (Resend)
        if (resendApiKey) {
            const emailContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #1f2937; background: #000; color: #fff; padding: 40px; border-radius: 12px;">
          <h2 style="color: #eab308; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Sun Air Shades Studio | New Lead</h2>
          <hr style="border: 0; border-top: 1px solid #ffffff10; margin: 20px 0;">
          <p style="font-size: 14px; line-height: 1.6; color: #9ca3af;">A new strategy audit has been requested via the Nivo AI Bridge.</p>
          
          <div style="background: #111; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #eab308;">
            <p style="margin: 5px 0; font-size: 13px;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Phone:</strong> ${phone}</p>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Project:</strong> ${project_area}</p>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Budget:</strong> ${budget_bracket}</p>
          </div>

          <p style="font-size: 13px; color: #9ca3af;"><strong>Client Message:</strong><br>${message}</p>
          <p style="font-size: 11px; color: #4b5563; margin-top: 40px;">System Notice: This data is securely stored in Supabase Project osmdpnykhgeslxhcqczz.</p>
        </div>
      `

            // Internal Notification
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${resendApiKey}`
                },
                body: JSON.stringify({
                    from: 'Sun Air Studio <system@sunair-shades.com>',
                    to: recipientEmail,
                    subject: `NEW LEAD: ${name} - ${project_area}`,
                    html: emailContent
                })
            })

            // Client Acknowledgment (Bilingual)
            const clientSubject = lang === 'en'
                ? "We've received your request - Sun Air Shades Studio"
                : "Hemos recibido su solicitud - Sun Air Shades Studio"

            const clientContent = lang === 'en'
                ? `<p>Hi ${name}, thank you for reaching out. One of our specialists will analyze your project and contact you shortly.</p>`
                : `<p>Hola ${name}, gracias por contactarnos. Uno de nuestros especialistas analizará su proyecto y se comunicará con usted en breve.</p>`

            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${resendApiKey}`
                },
                body: JSON.stringify({
                    from: 'Nivo | Sun Air Shades <kai@sunair-shades.com>',
                    to: email,
                    subject: clientSubject,
                    html: `<div style="font-family: sans-serif; color: #333; padding: 20px;">${clientContent}</div>`
                })
            })
        }

        return new Response(JSON.stringify({ success: true, id: dbData.id }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
