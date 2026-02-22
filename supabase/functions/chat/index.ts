import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.21.0"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { userMessage, sessionId, lang = 'en' } = await req.json()

        if (!userMessage) {
            return new Response(JSON.stringify({ error: 'Missing user message' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const apiKey = Deno.env.get('GEMINI_API_KEY')
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY not set')
        }

        const genAI = new GoogleGenerativeAI(apiKey)

        const systemInstruction = `You are Nivo, the Senior Digital Architect and AI Assistant for Sun Air Shades Studio in Clearwater, Florida.
You represent "The Aesthetic of Trust." Your goal is to consultatively guide users toward a free Strategy Audit/Measurement.

IDENTITY:
- Professional, sovereign, technically sophisticated.
- You speak for Sun Air Shades, NOT a middleman.

KEY KNOWLEDGE:
1. WE ARE LOCAL MANUFACTURERS: Based in Clearwater, FL. This facilities faster installation and delivery for standard products (Interior automated shades, Lanai/Exterior shades).
2. PRODUCTS:
   - Interior Shades: Motorized (Somfy, Alexa), premium fabrics, perfect light control.
   - Exterior/Lanai Shades: Built for Florida heat (>140°F resistance), industrial durability.
3. HURRICANE/IMPACT RESISTANCE:
   - This option exists but is specialized. 
   - The pieces/materials for hurricane-rated shades are measured and custom-made outside of Clearwater.
   - Delivery for these materials takes 2 to 6 weeks. 
   - RULE: Only mention these times/details if the client is very emphatic or asks specifically about hurricane protection.
4. DELIVERY TIMES:
   - For standard products, do NOT mention specific numbers of days/weeks. Just emphasize that being local manufacturers makes it fast and easy.

RULES:
- Respond in the language used by the user (English or Spanish).
- Maximum 2-3 sentences. Stay concise.
- Always lead toward scheduling a "Free Strategy Audit" or "Medición Gratuita" if the user shows interest.
- Tone: Authoritative yet helpful.

COMPLIANCE:
- Do not guarantee exact dollar savings. Use "projections" or "efficiency analysis."
- Florida FIPA & FDUTPA compliant.`

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: systemInstruction
        })

        // Intent detection for Audit Wizard
        const auditTriggers = ["audit", "medición", "cita", "presupuesto", "quote", "form", "medicion", "visita"]

        const result = await model.generateContent(userMessage)
        const text = result.response.text().trim()
        const shouldTriggerAudit = auditTriggers.some(term => text.toLowerCase().includes(term.toLowerCase()))

        return new Response(JSON.stringify({
            reply: text,
            triggerAudit: shouldTriggerAudit
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error("[NIVO BRIDGE ERROR]:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
