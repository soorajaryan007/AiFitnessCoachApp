"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Loader2, Download, Moon, Sun, RefreshCw, Volume2 } from "lucide-react";
import { downloadPDF } from "@/components/DownloadButton";

export default function Home() {
  const { register, handleSubmit, getValues } = useForm();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateFullScript = (plan: any) => {
    if (!plan) return "";
    let script = `Here is your personalized fitness plan. `;

    if (plan.workout?.length) {
      script += `For today's workout, you have ${plan.workout.length} exercises. `;
      plan.workout.forEach((item: any, i: number) => {
        script += `Exercise ${i + 1}: ${item.exercise}. Do ${item.sets} sets of ${item.reps} reps. `;
      });
    }

    if (plan.diet?.length) {
      script += ` For your nutrition, here is the menu. `;
      plan.diet.forEach((item: any) => {
        script += `For ${item.meal}, have ${item.food}, around ${item.calories} calories. `;
      });
    }

    script += "You got this!";
    return script;
  };

  const playAudio = async (text: string) => {
    if (!text) return;

    // ❌ If speaking → STOP immediately
    if (audioRef.current && isSpeaking) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);

    try {
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Audio generation failed");

      const blob = await response.blob();
      const audio = new Audio(URL.createObjectURL(blob));

      audioRef.current = audio;
      audioRef.current.play();

      audioRef.current.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };
    } catch (err) {
      console.error("Audio Error:", err);
      setIsSpeaking(false);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.error) {
        alert("AI Error: " + result.error);
        setLoading(false);
        return;
      }

      setPlan(result);
    } catch {
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  const bgMain = darkMode ? "bg-neutral-950 text-white" : "bg-white text-neutral-800";
  const cardBg = darkMode ? "bg-neutral-900 border-neutral-800" : "bg-neutral-100 border-neutral-200 shadow-sm";
  const inputBg = darkMode ? "bg-neutral-800 border-neutral-700 text-white" : "bg-white border-neutral-300 text-black";

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${bgMain}`}>
      <div className="max-w-4xl mx-auto relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            AI Fitness Coach
          </h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full border transition-all ${
              darkMode
                ? "bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
                : "bg-white border-neutral-300 hover:bg-gray-100"
            }`}
          >
            {darkMode ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-blue-600" />}
          </button>
        </div>

        {/* FORM */}
        {!plan && (
          <form onSubmit={handleSubmit(onSubmit)} className={`space-y-4 p-6 rounded-xl border ${cardBg}`}>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input {...register("name")} placeholder="Name" className={`p-3 rounded border ${inputBg}`} required />
              <input {...register("age")} placeholder="Age" type="number" className={`p-3 rounded border ${inputBg}`} required />
              <select {...register("gender")} className={`p-3 rounded border ${inputBg}`} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input {...register("height")} placeholder="Height (e.g., 5'10)" className={`p-3 rounded border ${inputBg}`} required />
              <input {...register("weight")} placeholder="Weight (e.g., 75kg)" className={`p-3 rounded border ${inputBg}`} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select {...register("fitnessLevel")} className={`p-3 rounded border ${inputBg}`}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <select {...register("workoutLocation")} className={`p-3 rounded border ${inputBg}`}>
                <option value="Gym">Gym</option>
                <option value="Home">Home</option>
                <option value="Outdoor">Outdoor</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select {...register("goal")} className={`p-3 rounded border ${inputBg}`}>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Endurance">Endurance</option>
              </select>

              <select {...register("dietaryPreferences")} className={`p-3 rounded border ${inputBg}`}>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Veg">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Keto">Keto</option>
              </select>
            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white p-4 rounded font-bold flex justify-center items-center gap-2 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Generate Plan"}
            </button>
          </form>
        )}

        {/* PLAN */}
        {plan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 relative">

            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
              <h2 className="text-2xl font-bold">Your Personalized Plan</h2>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">

                {/* REGENERATE */}
                <button
                  onClick={() => onSubmit(getValues())}
                  disabled={loading}
                  className={`w-full md:w-auto flex items-center gap-2 px-4 py-2 rounded font-bold text-sm border ${
                    darkMode
                      ? "border-blue-500 text-blue-400 hover:bg-blue-500/10"
                      : "border-blue-600 text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <RefreshCw size={18} /> Regenerate
                </button>

                {/* READ / STOP AUDIO */}
                <button
                  onClick={() => playAudio(generateFullScript(plan))}
                  className={`w-full md:w-auto flex items-center gap-2 px-4 py-2 rounded text-white font-bold text-sm transition-all ${
                    isSpeaking ? "bg-red-600 hover:bg-red-500" : "bg-purple-600 hover:bg-purple-500"
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Stop
                    </>
                  ) : (
                    <>
                      <Volume2 size={18} /> Read Plan
                    </>
                  )}
                </button>

                {/* DOWNLOAD */}
                <button
                  onClick={() => downloadPDF(plan)}
                  disabled={loading}
                  className="w-full md:w-auto flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white font-bold text-sm"
                >
                  <Download size={18} /> PDF
                </button>
              </div>
            </div>

            {/* MOTIVATION */}
            <div className={`p-6 rounded-xl border text-center italic text-xl ${cardBg}`}>
              "{plan.motivation}"
            </div>

            {/* WORKOUT */}
            <h2 className="text-2xl font-bold">🏋️ Today's Workout</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plan.workout?.map((item: any, idx: number) => (
                <div key={idx} className={`rounded-xl overflow-hidden border ${cardBg}`}>
                  <img
                    src={`https://image.pollinations.ai/prompt/${encodeURIComponent(item.image_prompt)}?nologo=true`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{item.exercise}</h3>
                    <p className={darkMode ? "text-neutral-400" : "text-neutral-600"}>
                      {item.sets} Sets × {item.reps} Reps
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* DIET */}
            <h2 className="text-2xl font-bold">🥗 Diet Plan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {plan.diet?.map((item: any, idx: number) => (
                <div key={idx} className={`rounded-xl p-4 border ${cardBg}`}>
                  <img
                    src={`https://image.pollinations.ai/prompt/${encodeURIComponent(item.image_prompt)}?nologo=true`}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-bold text-blue-500">{item.meal}</h3>
                  <p className="font-medium">{item.food}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded inline-block mt-2 ${
                      darkMode ? "bg-neutral-800 text-neutral-400" : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {item.calories} kcal
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setPlan(null)}
              className={`w-full border p-3 rounded ${
                darkMode ? "border-neutral-700 hover:bg-neutral-900" : "border-neutral-300 hover:bg-gray-100"
              }`}
            >
              Start Over
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
