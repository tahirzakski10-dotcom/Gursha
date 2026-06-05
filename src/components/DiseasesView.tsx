"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Video, Activity, HeartPulse, Droplet, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";

const diseases = [
  {
    id: "diabetes",
    name: "Diabetes",
    icon: <Activity size={20} />,
    color: "text-blue-400",
    description: "A condition where blood sugar levels remain high due to insulin resistance or lack of insulin production.",
    symptoms: ["Increased thirst", "Frequent urination", "Fatigue", "Blurred vision"],
    nutrition: "Diet plays a critical role in managing blood sugar spikes. Complex carbohydrates and high fiber are essential.",
    encourage: ["Teff (Injera)", "Lentils (Misir)", "Cabbage (Gomen)"],
    limit: ["White bread", "Sweetened tea", "High-fat red meat"],
    prevention: "Replace refined grains with 100% Teff Injera to improve glycemic control.",
    research: {
      title: "Glycemic Index of Teff vs. Wheat in Ethiopian Diets",
      finding: "Pure Teff Injera has a significantly lower glycemic index compared to wheat-mixed Injera, making it highly suitable for diabetic patients.",
      importance: "Switching to pure Teff can naturally help stabilize daily blood sugar."
    },
    video: "https://www.youtube.com/embed/wZAjVQWbMlE",
    videoDesc: "Understanding Type 2 Diabetes and Nutrition"
  },
  {
    id: "anemia",
    name: "Anemia",
    icon: <Droplet size={20} />,
    color: "text-red-400",
    description: "A lack of healthy red blood cells to carry adequate oxygen to your body's tissues.",
    symptoms: ["Fatigue", "Weakness", "Pale skin", "Cold hands and feet"],
    nutrition: "Iron-rich foods, coupled with Vitamin C for absorption, are vital to building red blood cells.",
    encourage: ["Red Meat (Tibs, Kitfo)", "Lentils", "Spinach/Gomen with Lemon"],
    limit: ["Coffee/Tea immediately after meals (inhibits iron absorption)"],
    prevention: "Squeeze fresh lemon over your Tibs or Misir Wat to double your iron absorption.",
    research: {
      title: "Iron Bioavailability in Traditional Ethiopian Fermented Foods",
      finding: "The fermentation process of Injera increases the bioavailability of iron and zinc by reducing phytic acid.",
      importance: "Traditional preparation methods actually make the nutrients in Teff easier for your body to absorb."
    },
    video: "https://www.youtube.com/embed/5a-N2A3bH4c",
    videoDesc: "How to prevent Iron Deficiency Anemia"
  },
  {
    id: "hypertension",
    name: "Hypertension",
    icon: <HeartPulse size={20} />,
    color: "text-purple-400",
    description: "High blood pressure that forces the heart to work harder to pump blood.",
    symptoms: ["Often asymptomatic", "Headaches", "Shortness of breath"],
    nutrition: "Reducing sodium (salt) and increasing potassium helps relax blood vessels.",
    encourage: ["Bananas", "Potatoes", "Unsalted Nuts", "Garlic"],
    limit: ["Excessive Mitmita/Berbere (if highly salted)", "Processed meats"],
    prevention: "Use more garlic and ginger for flavor instead of relying on added salt.",
    research: {
      title: "Sodium Content in Commercial vs. Homemade Berbere",
      finding: "Commercial Berbere blends often contain up to 40% more sodium than traditional homemade blends.",
      importance: "Making or buying low-sodium spice blends is crucial for managing blood pressure."
    },
    video: "https://www.youtube.com/embed/YyRMigzTfA8",
    videoDesc: "Dietary Approaches to Stop Hypertension (DASH Diet)"
  }
];

export default function DiseasesView() {
  const [activeTab, setActiveTab] = useState(diseases[0].id);

  const activeData = diseases.find(d => d.id === activeTab) || diseases[0];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Nutrition-Related Diseases</h2>
        <p className="text-neutral-400">Learn how Ethiopian food choices impact common chronic conditions.</p>
      </div>

      {/* Disease Tabs */}
      <div className="flex gap-4 border-b border-[var(--color-card-border)] pb-4 overflow-x-auto no-scrollbar">
        {diseases.map((d) => (
          <button
            key={d.id}
            onClick={() => setActiveTab(d.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition ${
              activeTab === d.id 
              ? "bg-[var(--color-primary)] text-white shadow-glow" 
              : "bg-[var(--color-neutral-dark)] text-neutral-400 hover:text-white"
            }`}
          >
            {d.icon}
            {d.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeData.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass p-6 md:p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className={activeData.color}>{activeData.icon}</span>
                {activeData.name} Overview
              </h3>
              <p className="text-neutral-300 text-lg mb-6 leading-relaxed">
                {activeData.description}
              </p>
              
              <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 p-4 rounded-xl mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-[var(--color-secondary)] shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-[var(--color-secondary)] mb-1">Simple Prevention Tip</h4>
                    <p className="text-sm text-neutral-300">{activeData.prevention}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-3 flex items-center gap-2 text-green-400"><CheckCircle2 size={18}/> Foods to Encourage</h4>
                  <ul className="space-y-2">
                    {activeData.encourage.map((item, i) => (
                      <li key={i} className="text-sm text-neutral-300 bg-[var(--color-neutral-dark)] px-3 py-2 rounded-lg">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-3 flex items-center gap-2 text-red-400"><AlertTriangle size={18}/> Foods to Limit</h4>
                  <ul className="space-y-2">
                    {activeData.limit.map((item, i) => (
                      <li key={i} className="text-sm text-neutral-300 bg-[var(--color-neutral-dark)] px-3 py-2 rounded-lg">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Interactive Simulation Placeholder */}
            <div className="glass p-6 md:p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent z-0 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Interactive Simulation</h3>
                <p className="text-neutral-400 text-sm mb-6">Visualizing {activeData.name} triggers.</p>
                
                {/* Mock Simulation UI */}
                <div className="bg-[var(--color-neutral-dark)] rounded-xl p-6 border border-[var(--color-card-border)]">
                  {activeData.id === 'diabetes' && (
                     <div className="space-y-4">
                       <p className="font-medium text-sm">Blood Sugar Impact Simulator</p>
                       <div className="flex gap-2">
                         <button className="flex-1 bg-[var(--color-card)] py-2 rounded-lg text-xs hover:bg-[var(--color-primary)]/50 transition">White Bread</button>
                         <button className="flex-1 bg-[var(--color-primary)] py-2 rounded-lg text-xs shadow-glow">Pure Teff Injera</button>
                       </div>
                       <div className="h-32 bg-background rounded-lg p-2 flex items-end gap-1 relative">
                          <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-500">Stable Glycemic Curve</div>
                          <div className="w-full h-8 bg-green-500/50 rounded-t-sm" />
                       </div>
                     </div>
                  )}
                  {activeData.id === 'anemia' && (
                     <div className="space-y-4 text-center">
                       <p className="font-medium text-sm">Iron Absorption Builder</p>
                       <div className="flex items-center justify-center gap-4 text-3xl my-4">
                         <span>🥩</span> <span className="text-neutral-500">+</span> <span>🍋</span> <span className="text-neutral-500">=</span> <span className="text-[var(--color-primary)]">🩸 2x Iron</span>
                       </div>
                       <p className="text-xs text-neutral-400">Combining Vitamin C with non-heme or heme iron doubles absorption.</p>
                     </div>
                  )}
                  {activeData.id === 'hypertension' && (
                     <div className="space-y-4">
                       <p className="font-medium text-sm">Salt Intake vs Blood Pressure</p>
                       <input type="range" min="1" max="100" defaultValue="30" className="w-full accent-[var(--color-primary)]" />
                       <div className="flex justify-between text-xs text-neutral-400">
                         <span>Low Salt</span>
                         <span>High Salt (Danger)</span>
                       </div>
                     </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Side Column: Research & Video */}
          <div className="space-y-6">
            {/* Research Paper */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-[var(--color-secondary)]" />
                Research Summary
              </h3>
              <div className="bg-[var(--color-neutral-dark)] p-4 rounded-xl border border-[var(--color-card-border)]">
                <h4 className="font-bold text-sm mb-2 text-white">{activeData.research.title}</h4>
                <p className="text-xs text-neutral-300 mb-3 italic">"{activeData.research.finding}"</p>
                <div className="pt-3 border-t border-neutral-700">
                  <span className="text-xs font-bold text-[var(--color-primary)] block mb-1">Why it matters:</span>
                  <p className="text-xs text-neutral-400">{activeData.research.importance}</p>
                </div>
              </div>
            </div>

            {/* YouTube Embed */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Video size={18} className="text-red-500" />
                Educational Video
              </h3>
              <div className="aspect-video bg-black rounded-xl overflow-hidden mb-3 border border-[var(--color-card-border)]">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={activeData.video} 
                  title={activeData.videoDesc} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-xs text-neutral-400">{activeData.videoDesc}</p>
            </div>
          </div>

        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
