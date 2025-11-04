// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//     try {
//         const { messages } = await req.json();

//         const response = await fetch(
//             "https://openrouter.ai/api/v1/chat/completions",
//             {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
//                     "Content-Type": "application/json",
//                     "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
//                     "X-Title": "AI Website Builder",
//                 },
//                 body: JSON.stringify({
//                     // Try these free models instead:
//                     model: "google/gemini-2.5-flash-preview-09-2025", // or
//                     // model: "meta-llama/llama-3.1-8b-instruct:free", // or
//                     // model: "qwen/qwen-2-7b-instruct:free",
//                     messages: messages,
//                     stream: true,
//                 }),
//             }
//         );

//         if (!response.ok) {
//             const errorText = await response.text();
//             console.error("OpenRouter API error:", errorText);
//             return NextResponse.json(
//                 { error: "Failed to fetch from OpenRouter API", details: errorText },
//                 { status: response.status }
//             );
//         }

//         // Create a ReadableStream from the response
//         const encoder = new TextEncoder();
//         const decoder = new TextDecoder();

//         const stream = new ReadableStream({
//             async start(controller) {
//                 const reader = response.body?.getReader();
//                 if (!reader) {
//                     controller.close();
//                     return;
//                 }

//                 try {
//                     while (true) {
//                         const { done, value } = await reader.read();
//                         if (done) {
//                             controller.close();
//                             break;
//                         }

//                         const chunk = decoder.decode(value, { stream: true });
//                         const lines = chunk.split("\n");

//                         for (const line of lines) {
//                             if (line.startsWith("data: ")) {
//                                 const data = line.slice(6);
                                
//                                 if (data === "[DONE]") {
//                                     controller.close();
//                                     return;
//                                 }

//                                 try {
//                                     const parsed = JSON.parse(data);
//                                     const content = parsed.choices[0]?.delta?.content;
                                    
//                                     if (content) {
//                                         controller.enqueue(encoder.encode(content));
//                                     }
//                                 } catch (e) {
//                                     // Skip invalid JSON
//                                 }
//                             }
//                         }
//                     }
//                 } catch (error) {
//                     console.error("Stream error:", error);
//                     controller.error(error);
//                 }
//             },
//         });

//         return new Response(stream, {
//             headers: {
//                 "Content-Type": "text/event-stream",
//                 "Cache-Control": "no-cache",
//                 "Connection": "keep-alive",
//             },
//         });
//     } catch (error) {
//         console.error("API error:", error);
//         return NextResponse.json(
//             { error: "Something went wrong", details: error instanceof Error ? error.message : "Unknown error" },
//             { status: 500 }
//         );
//     }
// }

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        
        // Separate system message from user messages
        const systemMessage = messages.find((m: any) => m.role === "system")?.content || "";
        const userMessages = messages.filter((m: any) => m.role === "user");
        const userMessage = userMessages[userMessages.length - 1]?.content || "";

        // Create model with system instruction
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash-preview-09-2025",
            systemInstruction: systemMessage || undefined,
        });

        // Generate content with streaming
        const result = await model.generateContentStream(userMessage);

        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const text = chunk.text();
                        if (text) {
                            controller.enqueue(encoder.encode(text));
                        }
                    }
                    controller.close();
                } catch (error) {
                    console.error("Stream error:", error);
                    controller.error(error);
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { 
                error: "Something went wrong", 
                details: error instanceof Error ? error.message : "Unknown error" 
            },
            { status: 500 }
        );
    }
}