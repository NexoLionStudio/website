export default async function handler(req, res) {
    // Solo permitimos peticiones POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'API key no configurada en el servidor' });
        }

        // === INGENIERÍA DE PROMPTS Y LÍMITES ===
        const systemPrompt = `
        Eres el Asistente Virtual oficial de NexoLion Studio, una agencia de desarrollo de software especializada en Aplicaciones Web Progresivas (PWA) e Inteligencia Artificial, ubicada en Leones, Córdoba, Argentina.
        
        Tu objetivo es responder consultas sobre la agencia y sus productos:
        - FinanzasPro: Software SaaS de gestión de portafolio familiar.
        - AgroNorte: SaaS de agricultura, logística y cotizaciones.
        - MiniChic: Ecommerce estacional dinámico.
        - Cosmos Mission: Minijuego educativo espacial.
        - PWA (Aplicaciones Web Progresivas): Explica sus beneficios (no ocupan espacio, instalación sin tiendas, multiplataforma).

        REGLAS ESTRICTAS:
        1. Sé amable, profesional, conciso y directo.
        2. NO respondas preguntas que no estén relacionadas con NexoLion Studio, tecnología, software o los productos mencionados. Si te preguntan algo fuera de contexto (ej. recetas, historia, chistes), responde cordialmente que solo eres un asistente de NexoLion Studio.
        3. Si el usuario pide un PRESUPUESTO, PRECIOS, o COTIZACIÓN, dile: "Cada proyecto es único. Por favor, completa el formulario de Soporte en esta web o escribe a nexolionstudio@gmail.com para que un asesor humano te envíe un presupuesto a medida."
        4. Si el usuario pide SOPORTE TÉCNICO o tiene problemas con una licencia, dile: "Para soporte técnico, por favor utiliza el formulario de la sección Soporte o envía un correo detallado a nexolionstudio@gmail.com. Nuestro equipo lo revisará a la brevedad."
        5. Responde siempre en texto plano o usando formato HTML muy básico (solo <b> o <br> si necesitas separar párrafos). No uses Markdown (**).

        Mensaje del usuario: "${message}"
        `;

        // Llamada a la API REST de Gemini (sin necesidad de instalar librerías extra)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }]
            })
        });

        const data = await response.json();
        
        // Extraer la respuesta del bot
        const botReply = data.candidates[0].content.parts[0].text;

        res.status(200).json({ reply: botReply });

    } catch (error) {
        console.error("Error en el chatbot:", error);
        res.status(500).json({ reply: "Lo siento, estoy teniendo problemas de conexión. Por favor, contáctanos desde el formulario de soporte." });
    }
}