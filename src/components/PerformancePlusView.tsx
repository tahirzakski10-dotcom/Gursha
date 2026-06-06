"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Dumbbell, Activity, TrendingUp, ChevronRight, Check, 
  ChevronLeft, Droplet, Flame, ArrowRight, Wallet, Target, 
  CalendarDays, BarChart2, Repeat, Rocket, CheckCircle2
} from "lucide-react";
import type { FitnessProfile, SupplementProfile, PerformanceScores } from "@/lib/performanceTypes";

// Mock data generation based on inputs for the sake of the frontend logic
const calculateScores = (fitness: FitnessProfile, supps: SupplementProfile): PerformanceScores => {
  let proteinScore = 50;
  if (supps.protein) {
    const totalSuppProtein = supps.protein.scoopsPerDay * supps.protein.scoopSize * 0.8; // Assume 80% protein by weight
    const requiredProtein = fitness.weight * (fitness.goal.includes("Muscle") ? 2.2 : 1.6);
    // Simple mock logic
    proteinScore = Math.min(100, Math.round((totalSuppProtein / requiredProtein) * 100) + 40);
  }

  let creatineScore = supps.creatine ? 91 : 0;
  let overall = Math.round((proteinScore + (supps.creatine ? creatineScore : 70) + 85) / 3);

  // ROI Math
  let cost = 0;
  if (supps.protein) cost += 4500;
  if (supps.creatine) cost += 2500;
  const roiScore = cost > 0 ? Math.round(Math.max(40, 100 - (cost / 100))) : 0;

  return {
    proteinEfficiency: proteinScore,
    creatineOptimization: creatineScore,
    muscleRecovery: 82,
    strengthReadiness: 91,
    hydration: 76,
    overallPerformance: overall,
    roiScore
  };
};

export default function PerformancePlusView() {
  const [step, setStep] = useState(0); // 0=Profile, 1=Supplements, 2=Protein, 3=Creatine, 4=Dashboard
  
  const [fitness, setFitness] = useState<FitnessProfile>({
    age: 25, gender: 'male', height: 175, weight: 75,
    experience: 'Intermediate', goal: 'Muscle Gain',
    frequency: '3-4 days/week', duration: '60-90 min'
  });

  const [supps, setSupps] = useState<SupplementProfile>({
    usesSupplements: false, selectedSupplements: []
  });

  const [scores, setScores] = useState<PerformanceScores | null>(null);

  // -- Event Handlers --

  const toggleSupp = (s: string) => {
    const curr = supps.selectedSupplements;
    setSupps({
      ...supps,
      selectedSupplements: curr.includes(s) ? curr.filter(x => x !== s) : [...curr, s]
    });
  };

  const handleAnalyze = () => {
    setScores(calculateScores(fitness, supps));
    setStep(4);
    // In a real app, save to localStorage here
  };

  const handleNext = () => {
    if (step === 0) setStep(1);
    else if (step === 1) {
      if (supps.selectedSupplements.includes("Whey Protein") || supps.selectedSupplements.includes("Mass Gainer")) {
        setSupps({ ...supps, protein: { brand: "", product: "", scoopsPerDay: 1, scoopSize: 30, workoutGoal: fitness.goal, trainingTime: "Post-workout" }});
        setStep(2);
      } else if (supps.selectedSupplements.includes("Creatine")) {
        setSupps({ ...supps, creatine: { brand: "", gramsPerDay: 5, isLoading: false, durationOfUse: "1-3 months" }});
        setStep(3);
      } else {
        handleAnalyze();
      }
    } else if (step === 2) {
      if (supps.selectedSupplements.includes("Creatine")) {
        setSupps({ ...supps, creatine: { brand: "", gramsPerDay: 5, isLoading: false, durationOfUse: "1-3 months" }});
        setStep(3);
      } else {
        handleAnalyze();
      }
    } else if (step === 3) {
      handleAnalyze();
    }
  };

  // -- Render Helpers --

  const renderProgressRing = (score: number, label: string, colorClass: string) => (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 mb-3">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path className="text-[var(--color-neutral-dark)]" strokeWidth="3" stroke="currentColor" fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <motion.path className={colorClass} strokeWidth="3" strokeDasharray={`${score}, 100`} stroke="currentColor" fill="none"
            initial={{ strokeDasharray: "0, 100" }} animate={{ strokeDasharray: `${score}, 100` }} transition={{ duration: 1.5, ease: "easeOut" }}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold">{score}</span>
        </div>
      </div>
      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest text-center">{label}</span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* HEADER */}
      {step < 4 && (
        <div className="text-center pt-8 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-4">
            <Zap size={16} /> <span className="text-sm font-bold tracking-wide uppercase">Performance+</span>
          </div>
          <h1 className="text-3xl font-black mb-2">Train Smarter. Recover Faster.</h1>
          <p className="text-neutral-400">AI-powered supplement and nutrition intelligence.</p>
        </div>
      )}

      {/* WIZARD STEPS */}
      <AnimatePresence mode="wait">
        
        {/* STEP 0: FITNESS PROFILE */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto glass p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Dumbbell className="text-[var(--color-primary)]"/> Fitness Profile</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Age</label>
                  <input type="number" value={fitness.age} onChange={e => setFitness({...fitness, age: +e.target.value})} className="w-full bg-[var(--color-neutral-dark)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] border border-transparent transition" />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Weight (kg)</label>
                  <input type="number" value={fitness.weight} onChange={e => setFitness({...fitness, weight: +e.target.value})} className="w-full bg-[var(--color-neutral-dark)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] border border-transparent transition" />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 mb-2 block">Primary Goal</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {["Muscle Gain", "Fat Loss", "Athletic Performance", "Strength", "Endurance", "General Fitness"].map(g => (
                    <button key={g} onClick={() => setFitness({...fitness, goal: g as any})} className={`p-3 rounded-xl text-sm font-medium border transition cursor-pointer ${fitness.goal === g ? "bg-[var(--color-primary)]/20 border-[var(--color-primary)]/50 text-[var(--color-primary)]" : "bg-[var(--color-neutral-dark)] border-transparent text-neutral-400 hover:border-neutral-600"}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 mb-2 block">Training Frequency</label>
                <div className="grid grid-cols-2 gap-2">
                  {["1-2 days/week", "3-4 days/week", "5-6 days/week", "Daily"].map(f => (
                    <button key={f} onClick={() => setFitness({...fitness, frequency: f as any})} className={`p-3 rounded-xl text-sm font-medium border transition cursor-pointer ${fitness.frequency === f ? "bg-orange-500/20 border-orange-500/50 text-orange-400" : "bg-[var(--color-neutral-dark)] border-transparent text-neutral-400 hover:border-neutral-600"}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button onClick={handleNext} className="w-full mt-8 py-4 bg-[var(--color-primary)] rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[var(--color-primary-hover)] transition shadow-glow cursor-pointer">
              Next Step <ChevronRight size={18} />
            </button>
          </motion.div>
        )}

        {/* STEP 1: SUPPLEMENTS */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto glass p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Activity className="text-green-400"/> Supplement Analysis</h2>
            <p className="text-neutral-400 mb-6">Select any supplements you currently use.</p>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              {["Whey Protein", "Mass Gainer", "Creatine", "Pre Workout", "BCAA", "Multivitamin"].map(s => {
                const active = supps.selectedSupplements.includes(s);
                return (
                  <button key={s} onClick={() => toggleSupp(s)} className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${active ? "bg-green-500/10 border-green-500/40 text-green-400" : "bg-[var(--color-neutral-dark)] border-transparent text-neutral-300 hover:border-neutral-600"}`}>
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${active ? "bg-green-500 border-green-500 text-black" : "border-neutral-500"}`}>
                      {active && <Check size={14} />}
                    </div>
                    <span className="font-medium text-sm">{s}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(0)} className="py-4 px-6 bg-[var(--color-neutral-dark)] rounded-xl font-medium flex items-center gap-2 hover:bg-neutral-800 transition cursor-pointer">
                <ChevronLeft size={18} /> Back
              </button>
              <button onClick={handleNext} className="flex-1 py-4 bg-[var(--color-primary)] rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[var(--color-primary-hover)] transition shadow-glow cursor-pointer">
                {supps.selectedSupplements.length > 0 ? "Configure Details" : "Analyze Performance"} <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: PROTEIN DETAILS */}
        {step === 2 && supps.protein && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto glass p-8 rounded-3xl border-t-4 border-t-[var(--color-primary)]">
            <h2 className="text-2xl font-bold mb-6">Protein Optimization</h2>
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Brand Name</label>
                  <input type="text" placeholder="e.g. Optimum Nutrition" onChange={e => setSupps({...supps, protein: {...supps.protein!, brand: e.target.value}})} className="w-full bg-[var(--color-neutral-dark)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] border border-transparent transition" />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Scoops Per Day</label>
                  <input type="number" value={supps.protein.scoopsPerDay} onChange={e => setSupps({...supps, protein: {...supps.protein!, scoopsPerDay: +e.target.value}})} className="w-full bg-[var(--color-neutral-dark)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] border border-transparent transition" />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="py-4 px-6 bg-[var(--color-neutral-dark)] rounded-xl font-medium flex items-center gap-2 hover:bg-neutral-800 transition cursor-pointer"><ChevronLeft size={18} /> Back</button>
              <button onClick={handleNext} className="flex-1 py-4 bg-[var(--color-primary)] rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[var(--color-primary-hover)] transition shadow-glow cursor-pointer">Next <ChevronRight size={18} /></button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: CREATINE DETAILS */}
        {step === 3 && supps.creatine && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto glass p-8 rounded-3xl border-t-4 border-t-blue-500">
            <h2 className="text-2xl font-bold mb-6">Creatine Optimization</h2>
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Grams Per Day</label>
                  <input type="number" value={supps.creatine.gramsPerDay} onChange={e => setSupps({...supps, creatine: {...supps.creatine!, gramsPerDay: +e.target.value}})} className="w-full bg-[var(--color-neutral-dark)] rounded-xl px-4 py-3 outline-none focus:border-blue-500 border border-transparent transition" />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={supps.creatine.isLoading} onChange={e => setSupps({...supps, creatine: {...supps.creatine!, isLoading: e.target.checked}})} className="w-5 h-5 accent-blue-500" />
                    <span className="text-sm font-medium">Currently in Loading Phase?</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(supps.protein ? 2 : 1)} className="py-4 px-6 bg-[var(--color-neutral-dark)] rounded-xl font-medium flex items-center gap-2 hover:bg-neutral-800 transition cursor-pointer"><ChevronLeft size={18} /> Back</button>
              <button onClick={handleNext} className="flex-1 py-4 bg-blue-500 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-blue-400 transition shadow-[0_0_30px_rgba(59,130,246,0.3)] cursor-pointer">Generate Analysis <ChevronRight size={18} /></button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: DASHBOARD */}
        {step === 4 && scores && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            
            {/* HERO: FORECAST */}
            <div className="glass p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden bg-gradient-to-br from-neutral-900 to-black border-none ring-1 ring-white/10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/20 blur-[100px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[var(--color-secondary)] font-bold tracking-widest text-sm uppercase mb-4">
                  <Rocket size={18} /> AI Performance Forecast
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight max-w-2xl">
                  Tomorrow is an optimal day for <span className="text-[var(--color-primary)]">strength training.</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                    <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">Recovery Prediction</p>
                    <div className="text-3xl font-black text-green-400">87%</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                    <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">Training Readiness</p>
                    <div className="text-3xl font-black text-[var(--color-primary)]">91%</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                    <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">Expected Energy</p>
                    <div className="text-3xl font-black text-blue-400">84%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* PROGRESS RINGS */}
            <div className="glass p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2"><Activity /> Body Performance Analysis</h3>
              <div className="flex flex-wrap justify-center gap-12 md:gap-20">
                {renderProgressRing(scores.muscleRecovery, "Muscle Recovery", "text-green-400")}
                {renderProgressRing(scores.strengthReadiness, "Strength Readiness", "text-[var(--color-primary)]")}
                {renderProgressRing(scores.hydration, "Hydration Status", "text-blue-400")}
                {scores.proteinEfficiency > 0 && renderProgressRing(scores.proteinEfficiency, "Protein Efficiency", "text-purple-400")}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* NUTRITION PLAN */}
              <div className="glass p-8 rounded-3xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Target /> AI Nutrition Plan</h3>
                <div className="space-y-4">
                  {[
                    { meal: "Breakfast", food: "Eggs + Kinche (Oats) + Banana" },
                    { meal: "Lunch", food: "Chicken Tibs + Rice + Vegetables" },
                    { meal: "Dinner", food: "Shiro Wat + Injera + Tomato Salad" },
                    { meal: "Post-Workout", food: "Whey Protein + Dates" },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-neutral-dark)]">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-sm shrink-0">
                        {m.meal.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 font-bold uppercase">{m.meal}</p>
                        <p className="font-medium text-sm">{m.food}</p>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                    <Droplet className="text-blue-400 shrink-0" />
                    <div>
                      <p className="text-xs text-blue-400 font-bold uppercase mb-1">Hydration Plan</p>
                      <p className="text-sm text-neutral-300">Aim for 3.5L today. Drink 500ml 30 mins before your workout.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* SUPPLEMENT COACH */}
                <div className="glass p-8 rounded-3xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[var(--color-secondary)]"><Zap /> Supplement Coach</h3>
                  <div className="space-y-4">
                    {supps.protein ? (
                      <div className="flex gap-3">
                        <CheckCircle2 className="text-green-400 shrink-0" />
                        <p className="text-sm text-neutral-300">Your protein intake is slightly below your muscle-building target. Consider adding 1 extra egg to breakfast.</p>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <Activity className="text-orange-400 shrink-0" />
                        <p className="text-sm text-neutral-300">Without protein powder, ensure you eat Doro Wat, Tibs, or Lentils within 2 hours post-workout.</p>
                      </div>
                    )}
                    {supps.creatine && (
                      <div className="flex gap-3">
                        <Droplet className="text-blue-400 shrink-0" />
                        <p className="text-sm text-neutral-300">Your creatine intake is appropriate. Increase hydration to maximize effectiveness and muscle fullness.</p>
                      </div>
                    )}
                    <div className="flex gap-3">
                        <TrendingUp className="text-purple-400 shrink-0" />
                        <p className="text-sm text-neutral-300">You do not need additional BCAA supplementation if your protein intake is adequate.</p>
                    </div>
                  </div>
                </div>

                {/* THE WOW FEATURE: ROI SCORE */}
                {scores.roiScore > 0 && (
                  <div className="glass p-8 rounded-3xl relative overflow-hidden group border-yellow-500/30">
                    <div className="absolute top-0 left-0 w-1 bg-yellow-400 h-full" />
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-400"><Wallet /> Supplement ROI Score</h3>
                    <div className="flex items-center gap-6 mb-4">
                      <div className="text-5xl font-black text-yellow-400">{scores.roiScore}</div>
                      <div className="text-sm text-neutral-300">Value Efficiency<br/><span className="text-xs text-neutral-500">Spend vs. Nutrition Benefit</span></div>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      You are spending an estimated <span className="text-white font-bold">~7,000 ETB/month</span> on supplements. 
                      Based on your goals, you could achieve similar results with a lower-cost protein option and an extra serving of local high-protein foods like Misir Wat (Lentils).
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* PRODUCT COMPARISON */}
            {supps.protein && (
              <div className="glass p-8 rounded-3xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Repeat /> Better Product Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center font-black border-4 border-[var(--color-card)] text-xs text-neutral-400 z-10">VS</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-[var(--color-neutral-dark)] border border-neutral-700">
                    <p className="text-xs text-neutral-400 font-bold uppercase mb-4">Your Current</p>
                    <h4 className="font-black text-lg mb-1">{supps.protein.brand || "Generic Whey"}</h4>
                    <p className="text-sm text-neutral-400 mb-4">High Cost / Standard Absorption</p>
                    <div className="text-2xl font-bold">~4,500 <span className="text-sm text-neutral-500">ETB</span></div>
                  </div>
                  <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/30">
                    <p className="text-xs text-green-400 font-bold uppercase mb-4 flex items-center gap-2"><CheckCircle2 size={14}/> AI Recommended</p>
                    <h4 className="font-black text-lg mb-1 text-green-400">Local Isolate Alternative</h4>
                    <p className="text-sm text-neutral-300 mb-4">Faster Absorption / Better Value</p>
                    <div className="text-2xl font-bold text-green-400">~3,200 <span className="text-sm text-green-500/50">ETB</span></div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center pt-8">
               <button onClick={() => setStep(0)} className="text-sm text-neutral-500 hover:text-white transition flex items-center gap-2 cursor-pointer">
                 <Repeat size={16} /> Recalculate Profile
               </button>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
