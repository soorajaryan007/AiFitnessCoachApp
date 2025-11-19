import { Groq } from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const body = await req.json();

  const prompt = `You are a certified fitness coach, nutritionist, and physiologist.  
Generate a highly detailed, structured, personalized fitness plan based on the following user data:

USER DATA:
- Name: {{name}}
- Age: {{age}}
- Gender: {{gender}}
- Height: {{height}}
- Weight: {{weight}}
- Fitness Level: {{fitnessLevel}}
- Workout Location: {{workoutLocation}}
- Goal: {{goal}}
- Dietary Preference: {{dietaryPreferences}}

INSTRUCTIONS:
Return the result STRICTLY in the following JSON format:

{
  "motivation": "string",
  "weekly_plan": [
    {
      "day": "Monday",
      "focus": "Full Body / Upper Body / Legs / etc",
      "duration": "45 minutes",
      "warmup": ["5 min brisk walk", "Dynamic stretches", ...],
      "workout": [
        {
          "exercise": "Barbell Squat",
          "sets": "4",
          "reps": "8–10",
          "rest": "90 sec",
          "tempo": "3-1-1",
          "image_prompt": "muscular athlete doing barbell squat in gym"
        },
        ...
      ],
      "cooldown": ["Hamstring stretches", "Breathing exercises"],
      "notes": "Posture tips or modifications"
    }
  ],
  "daily_workout": [
    {
      "exercise": "Pushups",
      "sets": "4",
      "reps": "12",
      "rest": "60 sec",
      "tempo": "2-1-1",
      "image_prompt": "fit male doing pushups"
    }
  ],
  "diet": [
    {
      "meal": "Breakfast",
      "food": "Oats with banana & peanut butter",
      "calories": 350,
      "macros": {
        "protein": "18g",
        "carbs": "45g",
        "fat": "12g"
      },
      "image_prompt": "healthy bowl of oats"
    },
    ...
  ],
  "nutrition_summary": {
    "total_daily_calories": 2200,
    "protein_target": "140g",
    "carb_target": "220g",
    "fat_target": "60g",
    "hydration_goal": "3 litres/day",
    "foods_to_avoid": ["fried food", "sugary drinks"],
    "recommended_foods": ["leafy greens", "lean meats", "eggs", "legumes"]
  },
  "lifestyle": {
    "sleep_goal": "7-9 hours",
    "steps_goal": "8000 steps/day",
    "stress_management": ["deep breathing", "10 min meditation"],
    "weekly_progression": "Increase weight by 2.5–5% every week"
  }
}

RULES:
- Do NOT include extra text outside JSON.
- Do NOT skip fields.
- Make the plan scientifically accurate and detailed.
- All workouts must match user fitness level and workout location.
`;

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "You are a fitness expert." },
      { role: "user", content: prompt }
    ],
    temperature: 0.6,
    response_format: { type: "json_object" },
  });

  const plan = JSON.parse(completion.choices[0].message.content);

  return Response.json(plan);
}
