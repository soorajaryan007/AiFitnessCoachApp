"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Loader2, Download, Moon, Sun } from "lucide-react"; 
import { downloadPDF } from "@/components/DownloadButton"; 

export default function Home() {
  const { register, handleSubmit } = useForm();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // ✨ NEW: Dark Mode State (Default is true/Dark)
  const [darkMode, setDarkMode] = useState(true);

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
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  // --- HELPER FOR STYLES ---
  // These variables switch colors based on the darkMode state
  const bgMain = darkMode ? "bg-neutral-950 text-white" : "bg-white text-neutral-800";
  const cardBg = darkMode ? "bg-neutral-900 border-neutral-800" : "bg-neutral-100 border-neutral-200 shadow-sm";
  const inputBg = darkMode ? "bg-neutral-800 border-neutral-700 text-white" : "bg-white border-neutral-300 text-black";

  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 ${bgMain}`}>
      <div className="max-w-4xl mx-auto relative">
        
        {/* ✨ HEADER WITH TOGGLE BUTTON */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            AI Fitness Coach
          </h1>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full border transition-all ${darkMode ? "bg-neutral-800 border-neutral-700 hover:bg-neutral-700" : "bg-white border-neutral-300 hover:bg-gray-100"}`}
          >
            {darkMode ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-blue-600" />}
          </button>
        </div>

        {/* INPUT FORM */}
        {!plan && (
          <form onSubmit={handleSubmit(onSubmit)} className={`space-y-4 p-6 rounded-xl border ${cardBg}`}>
            
            {/* Row 1: Basic Info */}
            <div className="grid grid-cols-3 gap-4">
              <input {...register("name")} placeholder="Name" className={`p-3 rounded border ${inputBg}`} required />
              <input {...register("age")} placeholder="Age" type="number" className={`p-3 rounded border ${inputBg}`} required />
              <select {...register("gender")} className={`p-3 rounded border ${inputBg}`} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Row 2: Body Stats */}
            <div className="grid grid-cols-2 gap-4">
              <input {...register("height")} placeholder="Height (e.g., 5'10 or 178cm)" className={`p-3 rounded border ${inputBg}`} required />
              <input {...register("weight")} placeholder="Weight (e.g., 75kg)" className={`p-3 rounded border ${inputBg}`} required />
            </div>

            {/* Row 3: Fitness Details */}
            <div className="grid grid-cols-2 gap-4">
              <select {...register("fitnessLevel")} className={`p-3 rounded border ${inputBg}`}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <select {...register("workoutLocation")} className={`p-3 rounded border ${inputBg}`}>
                <option value="Gym">Gym (Full Equipment)</option>
                <option value="Home">Home (No Equipment)</option>
                <option value="Outdoor">Outdoor (Park/Run)</option>
              </select>
            </div>

            {/* Row 4: Goal & Diet */}
            <div className="grid grid-cols-2 gap-4">
              <select {...register("goal")} className={`p-3 rounded border ${inputBg}`}>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Endurance">Endurance / Cardio</option>
                <option value="Maintenance">Stay Fit</option>
              </select>

              <select {...register("dietaryPreferences")} className={`p-3 rounded border ${inputBg}`}>
                <option value="Non-Veg">Non-Veg (Chicken/Meat)</option>
                <option value="Veg">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Keto">Keto</option>
              </select>
            </div>

            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-4 rounded font-bold flex justify-center items-center gap-2 transition-all">
              {loading ? <Loader2 className="animate-spin" /> : "Generate My Personalized Plan"}
            </button>
          </form>
        )}

        {/* PLAN DISPLAY */}
        {plan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold">Your Personalized Plan</h2>
               <button 
                  onClick={() => downloadPDF(plan)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white font-bold text-sm"
                >
                  <Download size={18} /> Download PDF
                </button>
            </div>

            {/* Motivation Section */}
            <div className={`p-6 rounded-xl border text-center italic text-xl ${cardBg} ${darkMode ? "border-blue-500/30" : "border-blue-200 bg-blue-50"}`}>
              "{plan.motivation}"
            </div>

            {/* Workout Cards */}
            <h2 className="text-2xl font-bold">🏋️ Today's Workout</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {plan.workout?.map((item: any, index: number) => (
                <div key={index} className={`rounded-xl overflow-hidden border ${cardBg}`}>
                  <img 
                    src={`https://image.pollinations.ai/prompt/${encodeURIComponent(item.image_prompt)}?nologo=true`} 
                    alt={item.exercise} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{item.exercise}</h3>
                    <p className={darkMode ? "text-neutral-400" : "text-neutral-600"}>{item.sets} Sets x {item.reps} Reps</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Diet Cards */}
            <h2 className="text-2xl font-bold">🥗 Diet Plan</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {plan.diet?.map((item: any, index: number) => (
                <div key={index} className={`rounded-xl p-4 border ${cardBg}`}>
                   <img 
                    src={`https://image.pollinations.ai/prompt/${encodeURIComponent(item.image_prompt)}?nologo=true`} 
                    alt={item.food} 
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-bold text-blue-500">{item.meal}</h3>
                  <p className="font-medium">{item.food}</p>
                  <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${darkMode ? "bg-neutral-800 text-neutral-400" : "bg-neutral-200 text-neutral-600"}`}>
                    {item.calories} kcal
                  </span>
                </div>
              ))}
            </div>

            <button onClick={() => setPlan(null)} className={`w-full border p-3 rounded transition-colors ${darkMode ? "border-neutral-700 hover:bg-neutral-900" : "border-neutral-300 hover:bg-gray-100 text-neutral-800"}`}>
              Generate New Plan
            </button>

          </motion.div>
        )}
      </div>
    </div>
  );
}