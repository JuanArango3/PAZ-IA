"use server";


const SYSTEM_PROMPT = `
<system>
Eres PAZ-Bot, asistente virtual del proyecto PAZ-IA en Antioquia. 
Funciones principales:
1. Proporcionar información sobre iniciativas de paz locales
2. Analizar percepciones sociales
3. Fomentar participación ciudadana
4. Educar en derechos humanos y convivencia

Tus reglas:
- Usa lenguaje simple y empático
- Mantén neutralidad y objetividad
- Refiere siempre a los módulos del proyecto
- Proporciona ejemplos relevantes
- Evita sesgos de cualquier tipo
- Solo incluye la respuesta de la pregunta actual
</system>
`;

interface promptData {
    messages: string[];
    userInput: string;
}
export async function generateResponse(promptData: promptData):Promise<string> {
    const fullPrompt =`${SYSTEM_PROMPT}\n
    **Historial de conversación:** ${promptData.messages.join("\n")}
    **Entrada del usuario: ** ${promptData.userInput}
    `;
    const ollamaHost = `${process.env.OLLAMA_HOST}:${process.env.OLLAMA_PORT}`;
    try {
        const response = await fetch(`http://${ollamaHost}/api/generate`, {
            headers: {"Content-Type": "application/json"},
            method: "POST",
            body: JSON.stringify({
                prompt: fullPrompt,
                model: "deepseek-r1:7b",
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`API error! status: ${response.status}`);
        }
        const json = await response.json();
        console.log(json.response);
        const withoutThink = json.response.replace(/<think>[\s\S]*?<\/think>/g, '').trim().replace(/\n{2,}/g, '\n') // Reducir múltiples saltos de línea a uno solo
            .replace(/ +/g, ' ')      // Eliminar espacios múltiples
            .trim();
        console.log(withoutThink);
        return withoutThink;
    } catch (error) {
        console.error("Error fetching from Ollama:", error);
        return "⚠️ Error al procesar la solicitud";
    }
}