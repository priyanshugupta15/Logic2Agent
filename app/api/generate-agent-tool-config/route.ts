import { NextResponse } from "next/server";
import { groq } from "@/config/GroqModel";

const PROMPT = `
You are an expert AI Agent Architect.
Your task is to analyze the "Agent Workflow Configuration" (JSON) and generate a deterministic "System Configuration" for an autonomous AI agent.

INPUT STRUCTURE:
The input JSON contains:
- 'startNode': The ID of the entry point.
- 'flow': An array of nodes. Each node has:
    - 'id': Unique ID.
    - 'type': (e.g., StartNode, AgentNode, ApiNode, IfElseNode).
    - 'settings': THIS IS CRITICAL. It contains user-defined values like 'url', 'method', 'headers', 'instruction', 'model', etc.
    - 'next': The ID(s) of the following node(s).

OUTPUT STRUCTURE:
You MUST output a single valid JSON object with the EXACT following structure:

{
  "systemPrompt": "A high-level overview of the entire system's purpose.",
  "primaryAgentName": "Name of the first AgentNode.",
  "agents": [
    {
      "id": "node_id",
      "name": "Agent Name",
      "model": "Extract from settings.model or default to 'gemini-1.5-flash'",
      "instruction": "Behavioral guidance. Incorporate logic from connected IfElse/While nodes.",
      "includeHistory": true,
      "output": "Text",
      "tools": ["ids_of_connected_api_nodes"]
    }
  ],
  "tools": [
    {
      "id": "node_id",
      "name": "Tool Name",
      "description": "Look at settings.description",
      "url": "Look at settings.url",
      "method": "Look at settings.method",
      "includeApiKey": true,
      "apiKey": "Look at settings.apiKey",
      "assignedAgent": "Name of agent using it",
      "parameters": { "param": "type" },
      "usage": []
    }
  ]
}

Rules:
1. DATA EXTRACTION: You MUST look inside the 'settings' object of each node to find:
    - For ApiNode: 'url', 'method', 'apiKey', 'includeApiKey', 'bodyParams'.
    - For AgentNode: 'name', 'instructions', 'model', 'includeChatHistory'.
    - For IfElseNode/WhileNode: 'condition'.
2. BRANCHING: instructions should explain IfElse logic (e.g., "If User says 'Yes', trigger Node X").
3. OUTPUT: ONLY the JSON object. No markdown, no backticks.
`;


export async function POST(req: Request) {
    try {
        const { jsonConfig } = await req.json();
        console.log("📥 Groq request using model: llama-3.3-70b-versatile");

        if (!process.env.GROQ_API_KEY) {
            console.error("❌ Missing GROQ_API_KEY");
            return NextResponse.json({ error: "Missing Groq API Key" }, { status: 500 });
        }

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: PROMPT },
                { role: "user", content: JSON.stringify(jsonConfig) }
            ],
            response_format: { type: "json_object" }
        });

        const outputText = response.choices[0].message.content || "{}";
        let parsedOutput;

        try {
            parsedOutput = JSON.parse(outputText);
        } catch (error) {
            console.error("Error parsing JSON from Groq:", error);
            console.log("Raw output:", outputText);
            parsedOutput = { error: "Failed to parse AI response" };
        }

        return NextResponse.json(parsedOutput);

    } catch (error: any) {
        console.error("Groq API Route Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}