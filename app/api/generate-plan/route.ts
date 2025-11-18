import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    // 1. Extract all the new fields
    const { 
      name, age, gender, height, weight, 
      goal, fitnessLevel, workoutLocation, dietaryPreferences 
    } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    // 2. Update the Prompt to be super specific
    const prompt = `
      Act as a world-class personal trainer and nutritionist.
      
      User Profile:
      - Name: ${name}, Age: ${age}, Gender: ${gender}
      - Height: ${height}, Weight: ${weight}
      - Fitness Goal: ${goal}
      - Current Level: ${fitnessLevel}
      - Location/Equipment: ${workoutLocation}
      - Diet Type: ${dietaryPreferences}
      
      Generate a 1-day detailed workout and diet plan strictly in this JSON format. 
      IMPORTANT constraints:
      1. Workout must be suitable for "${workoutLocation}" (e.g., if Home, no machines).
      2. Diet must strictly follow "${dietaryPreferences}".
      
      JSON Structure:
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

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();
    
    // Clean markdown if present
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}