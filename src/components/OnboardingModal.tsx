"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Heart, Target, ChevronRight, ChevronLeft,
  Check, Sparkles,
} from "lucide-react";
import { HEALTH_CONDITIONS, HEALTH_GOALS, ACTIVITY_LEVELS } from "@/lib/types";
import type { HealthProfile } from "@/lib/types";
import { saveHealthProfile, setOnboardingDone } from "@/lib/storage";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<HealthProfile>>({
    age: 25,
    gender: "male",
    height: 170,
    weight: 70,
    activityLevel: "moderate",
    occupation: "",
    exerciseFrequency: "3-4",
    conditions: [],
    goals: [],
  });

  const steps = [
    { title: "Personal Info", icon: <User size={20} />, desc: "Let's start with the basics" },
    { title: "Lifestyle", icon: <Heart size={20} />, desc: "Tell us about your daily life" },
    { title: "Health", icon: <Heart size={20} />, desc: "Any conditions to be aware of?" },
    { title: "Goals", icon: <Target size={20} />, desc: "What are you aiming for?" },
  ];

  const toggleCondition = (c: string) => {
    const current = profile.conditions || [];
    setProfile({ ...profile, conditions: current.includes(c) ? current.filter((x) => x !== c) : [...current, c] });
  };

  const toggleGoal = (g: string) => {
    const current = profile.goals || [];
    setProfile({ ...profile, goals: current.includes(g) ? current.filter((x) => x !== g) : [...current, g] });
  };

  const handleComplete = () => {
    const now = new Date().toISOString();
    const full: HealthProfile = {
      age: profile.age || 25,
      gender: (profile.gender as HealthProfile["gender"]) || "male",
      height: profile.height || 170,
      weight: profile.weight || 70,
      activityLevel: (profile.activityLevel as HealthProfile["activityLevel"]) || "moderate",
      occupation: profile.occupation || "",
      exerciseFrequency: (profile.exerciseFrequency as HealthProfile["exerciseFrequency"]) || "3-4",
      conditions: profile.conditions || [],
      goals: profile.goals || [],
      createdAt: now,
      updatedAt: now,
    };
    saveHealthProfile(full);
    setOnboardingDone();
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[var(--color-card-border)]"
      >
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-[var(--color-primary)]" />
            <h2 className="text-xl font-bold">Welcome to Gursha</h2>
          </div>
          <p className="text-neutral-400 text-sm mb-4">Let us personalize your nutrition experience</p>

          {/* Progress bar */}
          <div className="flex gap-2 mb-6">
            {steps.map((s, i) => (
              <div key={s.title} className="flex-1">
                <div className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-[var(--color-primary)]" : "bg-[var(--color-neutral-dark)]"}`} />
                <p className={`text-[10px] mt-1 font-medium ${i <= step ? "text-[var(--color-primary)]" : "text-neutral-500"}`}>{s.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            {/* Step 0: Personal */}
            {step === 0 && (
              <motion.div key="personal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-neutral-400 font-medium mb-1 block">Age</label>
                    <input type="number" value={profile.age} onChange={(e) => setProfile({ ...profile, age: +e.target.value })}
                      className="w-full bg-[var(--color-neutral-dark)] border border-[var(--color-card-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] transition" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 font-medium mb-1 block">Gender</label>
                    <select value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value as HealthProfile["gender"] })}
                      className="w-full bg-[var(--color-neutral-dark)] border border-[var(--color-card-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] transition">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-neutral-400 font-medium mb-1 block">Height (cm)</label>
                    <input type="number" value={profile.height} onChange={(e) => setProfile({ ...profile, height: +e.target.value })}
                      className="w-full bg-[var(--color-neutral-dark)] border border-[var(--color-card-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] transition" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 font-medium mb-1 block">Weight (kg)</label>
                    <input type="number" value={profile.weight} onChange={(e) => setProfile({ ...profile, weight: +e.target.value })}
                      className="w-full bg-[var(--color-neutral-dark)] border border-[var(--color-card-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] transition" />
                  </div>
                </div>
                {profile.height && profile.weight ? (
                  <div className="bg-[var(--color-primary)]/10 rounded-xl p-3 text-center border border-[var(--color-primary)]/20">
                    <span className="text-xs text-neutral-400">BMI: </span>
                    <span className="text-[var(--color-primary)] font-bold">{(profile.weight! / ((profile.height! / 100) ** 2)).toFixed(1)}</span>
                  </div>
                ) : null}
              </motion.div>
            )}

            {/* Step 1: Lifestyle */}
            {step === 1 && (
              <motion.div key="lifestyle" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-400 font-medium mb-2 block">Activity Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ACTIVITY_LEVELS.map((a) => (
                      <button key={a.value} onClick={() => setProfile({ ...profile, activityLevel: a.value as HealthProfile["activityLevel"] })}
                        className={`p-3 rounded-xl text-left transition border cursor-pointer ${profile.activityLevel === a.value
                          ? "bg-[var(--color-primary)]/15 border-[var(--color-primary)]/50 text-[var(--color-primary)]"
                          : "bg-[var(--color-neutral-dark)] border-[var(--color-card-border)] text-neutral-300 hover:border-neutral-500"}`}>
                        <div className="font-medium text-sm">{a.label}</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">{a.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-neutral-400 font-medium mb-1 block">Occupation</label>
                  <input type="text" value={profile.occupation} onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                    placeholder="e.g. Student, Engineer, Teacher..."
                    className="w-full bg-[var(--color-neutral-dark)] border border-[var(--color-card-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] transition placeholder:text-neutral-600" />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 font-medium mb-2 block">Exercise Frequency</label>
                  <div className="flex gap-2">
                    {(["none", "1-2", "3-4", "5+"] as const).map((f) => (
                      <button key={f} onClick={() => setProfile({ ...profile, exerciseFrequency: f })}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium transition border cursor-pointer ${profile.exerciseFrequency === f
                          ? "bg-[var(--color-primary)]/15 border-[var(--color-primary)]/50 text-[var(--color-primary)]"
                          : "bg-[var(--color-neutral-dark)] border-[var(--color-card-border)] text-neutral-400 hover:border-neutral-500"}`}>
                        {f === "none" ? "None" : `${f}/wk`}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Health Conditions */}
            {step === 2 && (
              <motion.div key="health" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="text-xs text-neutral-400 mb-3">Select any conditions (optional)</p>
                <div className="grid grid-cols-2 gap-2">
                  {HEALTH_CONDITIONS.map((c) => {
                    const selected = profile.conditions?.includes(c);
                    return (
                      <button key={c} onClick={() => toggleCondition(c)}
                        className={`p-3 rounded-xl text-left text-sm transition border flex items-center gap-2 cursor-pointer ${selected
                          ? "bg-red-500/10 border-red-500/40 text-red-400"
                          : "bg-[var(--color-neutral-dark)] border-[var(--color-card-border)] text-neutral-300 hover:border-neutral-500"}`}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selected ? "bg-red-500 border-red-500" : "border-neutral-500"}`}>
                          {selected && <Check size={10} className="text-white" />}
                        </div>
                        <span className="leading-tight">{c}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 3: Goals */}
            {step === 3 && (
              <motion.div key="goals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="text-xs text-neutral-400 mb-3">Select your health goals</p>
                <div className="grid grid-cols-2 gap-2">
                  {HEALTH_GOALS.map((g) => {
                    const selected = profile.goals?.includes(g);
                    return (
                      <button key={g} onClick={() => toggleGoal(g)}
                        className={`p-3 rounded-xl text-left text-sm transition border flex items-center gap-2 cursor-pointer ${selected
                          ? "bg-[var(--color-primary)]/15 border-[var(--color-primary)]/50 text-[var(--color-primary)]"
                          : "bg-[var(--color-neutral-dark)] border-[var(--color-card-border)] text-neutral-300 hover:border-neutral-500"}`}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selected ? "bg-[var(--color-primary)] border-[var(--color-primary)]" : "border-neutral-500"}`}>
                          {selected && <Check size={10} className="text-white" />}
                        </div>
                        <span className="leading-tight">{g}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)}
                className="flex-1 py-3 bg-[var(--color-neutral-dark)] border border-[var(--color-card-border)] rounded-xl font-medium transition hover:bg-[var(--color-neutral-light)] flex items-center justify-center gap-2 text-sm cursor-pointer">
                <ChevronLeft size={16} /> Back
              </button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)}
                className="flex-1 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-xl font-medium transition shadow-glow flex items-center justify-center gap-2 text-sm cursor-pointer">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleComplete}
                className="flex-1 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-xl font-bold transition shadow-glow flex items-center justify-center gap-2 cursor-pointer">
                <Sparkles size={16} /> Start My Journey
              </button>
            )}
          </div>
          {step === 0 && (
            <button onClick={() => { setOnboardingDone(); onComplete(); }}
              className="w-full mt-3 py-2 text-neutral-500 text-xs hover:text-neutral-300 transition cursor-pointer">
              Skip for now
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
