import { ElevenLabsClient } from "elevenlabs";

export async function POST(req: Request) {
  // --- MOVED INSIDE THE FUNCTION ---
  const client = new ElevenLabsClient({ 
    apiKey: process.env.ELEVENLABS_API_KEY 
  });
  // --------------------------------

  try {
    const { text } = await req.json();
    
    const audioStream = await client.generate({
      voice: "Rachel",
      model_id: "eleven_turbo_v2",
      text: text,
    });

    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    return new Response(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error generating audio" }), {
      status: 500,
    });
  }
}