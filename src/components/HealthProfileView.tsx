"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, Heart, Target, Save, Check,
} from "lucide-react";
import { HEALTH_CONDITIONS, HEALTH_GOALS, ACTIVITY_LEVELS } from "@/lib/types";
import type { HealthProfile } from "@/lib/types";
import { saveHealthProfile, getHealthProfile } from "@/lib/storage";

export default function HealthProfileView() {
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = getHealthProfile();
    if (existing) {
      setProfile(existing);
    } else {
      setProfile({
        age: 25, gender: "male", height: 170, weight: 70,
        activityLevel: "moderate", occupation: "", exerciseFrequency: "3-4",
        conditions: [], goals: [],
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      });
    }
  }, []);

  if (!profile) return null;

  const handleSave = () => {
    saveHealthProfile({ ...profile, updatedAt: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleCondition = (c: string) => {
    const conds = profile.conditions.includes(c) ? profile.conditions.filter((x) => x !== c) : [...profile.conditions, c];
    setProfile({ ...profile, conditions: conds });
  };

  const toggleGoal = (g: string) => {
    const goals = profile.goals.includes(g) ? profile.goals.filter((x) => x !== g) : [...profile.goals, g];
    setProfile({ ...profile, goals });
  };

  const bmi = profile.weight / ((profile.height / 100) ** 2);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">

      {/* Personal Info */}
      <div className="glass rounded-2xl p-6 border border-[var(--color-card-border)]">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><User size={18} className="text-[var(--color-primary)]" /> Personal Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">Age</label>
            <input type="number" value={profile.age} onChange={(e) => setProfile({ ...profile, age: +e.target.value })}
              className="w-full bg-[var(--color-neutral-dark)] border border-[var(--color-card-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] transition" />
          </div>
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">Gender</label>
            <select value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value as HealthProfile["gender"] })}
              className="w-full bg-[var(--color-neutral-dark)] border border-[var(--color-card-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] transition">
              <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">Height (cm)</label>
            <input type="number" value={profile.height} onChange={(e) => setProfile({ ...profile, height: +e.target.value })}
              className="w-full bg-[var(--color-neutral-dark)] border border-[var(--color-card-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] transition" />
          </div>
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">Weight (kg)</label>
            <input type="number" value={profile.weight} onChange={(e) => setProfile({ ...profile, weight: +e.target.value })}
              className="w-full bg-[var(--color-neutral-dark)] border border-[var(--color-card-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] transition" />
          </div>
        </div>
        <div className="mt-4 bg-[var(--color-primary)]/10 rounded-xl p-3 flex items-center justify-between border border-[var(--color-primary)]/20">
          <span className="text-sm text-neutral-300">Body Mass Index (BMI)</span>
          <span className="text-lg font-bold text-[var(--color-primary)]">{bmi.toFixed(1)}</span>
        </div>
      </div>

      {/* Lifestyle */}
      <div className="glass rounded-2xl p-6 border border-[var(--color-card-border)]">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><Heart size={18} className="text-green-400" /> Lifestyle</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400 mb-2 block">Activity Level</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {ACTIVITY_LEVELS.map((a) => (
                <button key={a.value} onClick={() => setProfile({ ...profile, activityLevel: a.value as HealthProfile["activityLevel"] })}
                  className={`p-3 rounded-xl text-left transition border cursor-pointer ${profile.activityLevel === a.value
                    ? "bg-green-500/10 border-green-500/40 text-green-400"
                    : "bg-[var(--color-neutral-dark)] border-[var(--color-card-border)] text-neutral-300 hover:border-neutral-500"}`}>
                  <div className="font-medium text-sm">{a.label}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">{a.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400 mb-1 block">Occupation</label>
              <input type="text" value={profile.occupation} onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                placeholder="e.g. Student, Engineer..." className="w-full bg-[var(--color-neutral-dark)] border border-[var(--color-card-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] transition placeholder:text-neutral-600" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-2 block">Exercise (days/week)</label>
              <div className="flex gap-2">
                {(["none", "1-2", "3-4", "5+"] as const).map((f) => (
                  <button key={f} onClick={() => setProfile({ ...profile, exerciseFrequency: f })}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium border transition cursor-pointer ${profile.exerciseFrequency === f
                      ? "bg-green-500/10 border-green-500/40 text-green-400"
                      : "bg-[var(--color-neutral-dark)] border-[var(--color-card-border)] text-neutral-400"}`}>
                    {f === "none" ? "0" : f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Conditions */}
      <div className="glass rounded-2xl p-6 border border-[var(--color-card-border)]">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><Heart size={18} className="text-red-400" /> Health Conditions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {HEALTH_CONDITIONS.map((c) => {
            const selected = profile.conditions.includes(c);
            return (
              <button key={c} onClick={() => toggleCondition(c)}
                className={`p-3 rounded-xl text-left text-sm border flex items-center gap-2 transition cursor-pointer ${selected
                  ? "bg-red-500/10 border-red-500/40 text-red-400"
                  : "bg-[var(--color-neutral-dark)] border-[var(--color-card-border)] text-neutral-300 hover:border-neutral-500"}`}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selected ? "bg-red-500 border-red-500" : "border-neutral-500"}`}>
                  {selected && <Check size={10} className="text-white" />}
                </div>
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Goals */}
      <div className="glass rounded-2xl p-6 border border-[var(--color-card-border)]">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><Target size={18} className="text-[var(--color-secondary)]" /> Health Goals</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {HEALTH_GOALS.map((g) => {
            const selected = profile.goals.includes(g);
            return (
              <button key={g} onClick={() => toggleGoal(g)}
                className={`p-3 rounded-xl text-left text-sm border flex items-center gap-2 transition cursor-pointer ${selected
                  ? "bg-[var(--color-primary)]/15 border-[var(--color-primary)]/50 text-[var(--color-primary)]"
                  : "bg-[var(--color-neutral-dark)] border-[var(--color-card-border)] text-neutral-300 hover:border-neutral-500"}`}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selected ? "bg-[var(--color-primary)] border-[var(--color-primary)]" : "border-neutral-500"}`}>
                  {selected && <Check size={10} className="text-white" />}
                </div>
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <button onClick={handleSave}
        className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer ${saved
          ? "bg-green-500/20 text-green-400 border border-green-500/30"
          : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-glow"}`}>
        {saved ? <><Check size={18} /> Saved!</> : <><Save size={18} /> Save Profile</>}
      </button>
    </motion.div>
  );
}
