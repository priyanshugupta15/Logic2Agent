import { NextResponse } from "next/server";
import { groq } from "@/config/GroqModel";

export async function POST(req: Request) {
    try {
        const { messages, toolConfig } = await req.json();
        console.log("💬 Chat request received. Messages count:", messages?.length);

        if (!process.env.GROQ_API_KEY) {
            console.error("❌ Missing GROQ_API_KEY");
            return NextResponse.json({ error: "Missing Groq API Key" }, { status: 500 });
        }

        // 🧠 Map custom tool config to Groq/OpenAI Tool format
        const groqTools = toolConfig.tools?.map((tool: any) => {
            // Detect placeholders in URL (e.g., {cityName} -> cityName)
            const urlPlaceholders = tool.url.match(/\{([^}]+)\}/g)?.map((m: string) => m.slice(1, -1)) || [];

            const properties: any = {};
            const required: string[] = [];

            // Add URL placeholders as required parameters
            urlPlaceholders.forEach((param: string) => {
                properties[param] = { type: 'string', description: `The ${param} parameter for the API URL` };
                required.push(param);
            });

            // Add existing parameters from user settings
            Object.keys(tool.parameters || {}).forEach(key => {
                if (!properties[key]) {
                    properties[key] = {
                        type: tool.parameters[key]?.toLowerCase() === 'number' ? 'number' : 'string',
                        description: `The ${key} parameter`
                    };
                    required.push(key);
                }
            });

            return {
                type: "function",
                function: {
                    name: tool.id.replace(/[^a-zA-Z0-9_-]/g, '_'), // Ensure valid function name
                    description: tool.description || `Call the ${tool.name}`,
                    parameters: {
                        type: "object",
                        properties,
                        required: [...new Set(required)]
                    }
                }
            };
        }) || [];

        // 🧠 Build the Master System Prompt
        const masterSystemPrompt = `
        SYSTEM OVERVIEW:
        ${toolConfig.systemPrompt}
        
        PRIMARY AGENT:
        ${toolConfig.primaryAgentName} 
        
        WORKFLOW ARCHITECTURE (AGENTS):
        ${JSON.stringify(toolConfig.agents, null, 2)}

        IMPORTANT EXECUTION RULES:
        1. Act naturally as ${toolConfig.primaryAgentName}.
        2. CONCISENESS: Do NOT narrate your internal thought process.
        3. Only provide the information the user asked for. 
        4. If a tool call is needed, use the available functions.
        5. Use friendly, and human-like language.
        `;

        const chatMessages = [
            { role: "system", content: masterSystemPrompt },
            ...messages.map((m: any) => ({
                role: m.role === 'agent' ? 'assistant' : m.role,
                content: m.content
            }))
        ];

        console.log("🤖 Sending to Groq (Initial Call)...");
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: chatMessages,
            ...(groqTools.length > 0 ? {
                tools: groqTools,
                tool_choice: "auto"
            } : {})
        });

        const initialMessage = response.choices[0].message;

        // 🚨 Safety Check: If both are null, Groq might have returned an empty response
        if (!initialMessage.content && (!initialMessage.tool_calls || initialMessage.tool_calls.length === 0)) {
            console.error("⚠️ Groq returned an empty response (no content and no tool calls)");
            return NextResponse.json({
                reply: "The agent returned an empty response. This might be due to a complex workflow or rate limiting. Please try again."
            });
        }

        // 🛠️ Handle Tool Calls (The Execution Loop)
        if (initialMessage.tool_calls && initialMessage.tool_calls.length > 0) {
            console.log(`🔧 AI requested ${initialMessage.tool_calls.length} tool calls`);

            chatMessages.push(initialMessage as any);

            for (const toolCall of initialMessage.tool_calls) {
                const functionName = toolCall.function.name;
                const args = JSON.parse(toolCall.function.arguments);

                // Find our original tool config
                const originalTool = toolConfig.tools.find((t: any) => t.id.replace(/[^a-zA-Z0-9_-]/g, '_') === functionName);

                if (originalTool) {
                    console.log(`🌐 Executing Real API: ${originalTool.name} with args:`, args);

                    try {
                        let finalUrl = originalTool.url;
                        // Replace placeholders {param} with args
                        Object.keys(args).forEach(key => {
                            finalUrl = finalUrl.replace(`{${key}}`, encodeURIComponent(args[key]));
                        });

                        // Add API Key if needed
                        if (originalTool.includeApiKey && originalTool.apiKey) {
                            const separator = finalUrl.includes('?') ? '&' : '?';
                            finalUrl += `${separator}key=${originalTool.apiKey}`;
                        }

                        console.log("🔗 Full Request URL:", finalUrl);

                        const apiResult = await fetch(finalUrl, {
                            method: originalTool.method || 'GET'
                        });

                        const resultData = await apiResult.json();
                        console.log("✅ API Success Data received");

                        chatMessages.push({
                            tool_call_id: toolCall.id,
                            role: "tool",
                            name: functionName,
                            content: JSON.stringify(resultData),
                        } as any);

                    } catch (err: any) {
                        console.error("❌ Tool Execution Failed:", err);
                        chatMessages.push({
                            tool_call_id: toolCall.id,
                            role: "tool",
                            name: functionName,
                            content: JSON.stringify({ error: err.message }),
                        } as any);
                    }
                }
            }

            console.log("🤖 Sending to Groq (Second Call with Tool Data)...");
            const finalResponse = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: chatMessages,
            });

            const reply = finalResponse.choices[0].message.content || "Done.";
            return NextResponse.json({ reply });
        }

        const reply = initialMessage.content || "I'm sorry, I couldn't process that.";
        console.log("✅ Groq response received");

        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
