# AI Fitness Coach App
WebLink: https://ai-fitness-coach-app-7wtc.vercel.app/
An AI-powered fitness assistant built using **Next.js** that generates **personalized workout and diet plans** using LLMs.

It also includes voice and image generation features for a more immersive experience.

---

## Features

Users can provide their details like:

- Name, Age, Gender
- Height & Weight
- Fitness Goal *(Weight Loss, Muscle Gain, etc.)*
- Current Fitness Level *(Beginner / Intermediate / Advanced)*
- Workout Location *(Home / Gym / Outdoor)*
- Dietary Preferences *(Veg / Non-Veg / Vegan / Keto)*
- Optional fields like Medical history, stress level etc.

---

### AI-Powered Plan Generation

The app uses an **LLM API** (OpenAI / Gemini / HuggingFace / Claude) to generate:

- 🏋️ **Workout Plan** — with daily exercise routines, sets, reps, and rest time
- 🥗 **Diet Plan** — meal breakdown for breakfast, lunch, dinner, and snacks
- 💬 **AI Tips & Motivation** — lifestyle and posture tips, motivational lines

> ⚡ Prompt Engineering:
> 
> - Each response is generated dynamically based on user input.
> - No hardcoded plans — all content is AI-generated and personalized.

---

### Voice Features

- **Read My Plan** — Uses **ElevenLabs** (or any TTS API) to speak out the Workout and Diet Plans
- Option to choose which section to listen to — *Workout or Diet*

---

### Image Generation

- When user clicks an exercise or meal item, the app uses **AI image generation** (nano banana / replicate) or any free AI modal of your choise
to generate a **visual representation** of that workout or food.

Examples:

- “Barbell Squat” → realistic gym exercise image
- “Grilled Chicken Salad” → food-style image

---

### Export & Extra Features

- 📄 Export generated plan as PDF
- 🌗 Dark / Light mode
- 💾 Save plan in local storage (or Supabase)
- 🧩 Regenerate Plan option
- ⚡ Smooth UI with Framer Motion or GSAP animations
- 💬 Daily “Motivation Quote” section powered by AI

---

## Tech Stack

| Category | Tools |
| --- | --- |
| Frontend | Next.js (latest) or Reactjs |
| Styling | Tailwind CSS / Shadcn UI / Chakra UI |
| AI APIs | OpenAI / Gemini / Claude / XAi |
| Voice | Eleven Labs  |
| Images | Gemini Nano Banana / OpenAI Images API / Replicate  |
| Deployment | Vercel or netlify |



Live App link : https://ai-fitness-coach-app-7wtc.vercel.app/



