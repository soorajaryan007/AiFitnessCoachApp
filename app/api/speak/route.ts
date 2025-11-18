import { ElevenLabsClient } from "elevenlabs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Initialize Client
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.error("❌ MISSING API KEY: ELEVENLABS_API_KEY is missing in .env.local");
      return NextResponse.json({ error: "Server Error: Missing API Key" }, { status: 500 });
    }

    const client = new ElevenLabsClient({ apiKey });
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // 2. Generate Audio
    // ⚠️ FIX: We use the ID "21m00Tcm4TlvDq8ikWAM" (Rachel), NOT the name "Rachel"
    const audioStream = await client.generate({
      voice: "21m00Tcm4TlvDq8ikWAM", 
      model_id: "eleven_turbo_v2",
      text: text,
    });

    // 3. Convert Stream to Buffer
    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    return new Response(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });

  } catch (error: any) {
    // This prints the REAL error to your VS Code terminal
    console.error("🔴 ElevenLabs API Error:", error);
    
    // Check if it's a quota issue
    if (error?.statusCode === 401) {
       console.error("👉 TIP: Check if your API Key is correct in .env.local");
    }
    
    return NextResponse.json({ error: "Failed to generate audio" }, { status: 500 });
  }
}