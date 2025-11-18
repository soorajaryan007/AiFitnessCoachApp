import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { 
      name, age, gender, height, weight, 
      goal, fitnessLevel, workoutLocation, dietaryPreferences 
    } = await req.json();

    const prompt = `
      Act as a world-class personal trainer and nutritionist.
      
      User Profile:
      - Name: ${name}, Age: ${age}, Gender: ${gender}
      - Height: ${height}, Weight: ${weight}
      - Fitness Goal: ${goal}
      - Current Level: ${fitnessLevel}
      - Location/Equipment: ${workoutLocation}
      - Diet Type: ${dietaryPreferences}
      
      Generate a 1-day detailed workout and diet plan strictly in JSON format. 
      
      IMPORTANT constraints:
      1. Workout must be suitable for "${workoutLocation}" (e.g., if Home, no machines).
      2. Diet must strictly follow "${dietaryPreferences}".
      3. Do not include any markdown formatting (like \`\`\`json), just return the raw JSON object.
      
      JSON Structure to follow strictly:
      {
        "workout": [
          { "exercise": "Exercise Name", "sets": "3", "reps": "12", "image_prompt": "${gender} doing exercise in ${workoutLocation} environment high quality" }
        ],
        "diet": [
          { "meal": "Breakfast", "food": "Food Name", "calories": "350", "image_prompt": "food photography of ${dietaryPreferences} meal" }
        ],
        "motivation": "A short punchy quote about discipline."
      }
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a fitness API that returns strictly structured JSON responses. No markdown. No conversational text."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      // 👇 UPDATED MODEL NAME HERE 👇
      model: "llama-3.3-70b-versatile", 
      
      response_format: { type: "json_object" }, 
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("No content generated");
    }

    return NextResponse.json(JSON.parse(responseContent));
  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}