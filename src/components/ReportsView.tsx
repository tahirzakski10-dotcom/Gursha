"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Flame, Leaf, Droplets, Target, ShieldAlert, BarChart3, TrendingUp, AlertTriangle, Sparkles, Calendar } from "lucide-react";
import { getDailySummaries, getLastNDaysMeals, getTodaysMeals } from "@/lib/storage";
import { sumNutrients } from "@/lib/nutritionDB";
import { generateDailyRecommendations } from "@/lib/recommendationEngine";
import { predictRisks, generateWeeklySummary } from "@/lib/wellnessPredictor";
import { scoreDailyNutrients, getScoreColor } from "@/lib/scoringEngine";
import type { RiskPrediction, NutrientScores } from "@/lib/types";

export default function ReportsView() {
  const [tab, setTab] = useState<'daily' | 'weekly'>('daily');
  
  // Daily State
  const [todaysCount, setTodaysCount] = useState(0);
  const [dailyScores, setDailyScores] = useState<NutrientScores | null>(null);
  const [dailyRecs, setDailyRecs] = useState<any>(null);

  // Weekly State
  const [weeklyRisks, setWeeklyRisks] = useState<RiskPrediction[]>([]);
  const [weeklySummary, setWeeklySummary] = useState("");
  
  useEffect(() => {
    // Load Daily
    const today = getTodaysMeals();
    setTodaysCount(today.length);
    if (today.length > 0) {
      const nutrients = sumNutrients(today.map(m => m.totalNutrients));
      setDailyScores(scoreDailyNutrients(nutrients));
      setDailyRecs(generateDailyRecommendations(nutrients, today.length));
    }

    // Load Weekly
    const weekMeals = getLastNDaysMeals(7);
    if (weekMeals.length >= 3) {
      setWeeklyRisks(predictRisks(weekMeals));
      
      // Calculate common foods
      const counts: Record<string, number> = {};
      weekMeals.forEach(m => m.foods.forEach(f => {
        counts[f.foodName] = (counts[f.foodName] || 0) + 1;
      }));
      const common = Object.entries(counts).map(([name, count]) => ({name, count})).sort((a,b) => b.count - a.count);
      
      // Calculate daily totals for summary
      const byDate: Record<string, any> = {};
      weekMeals.forEach(m => {
        const d = m.timestamp.slice(0, 10);
        if(!byDate[d]) byDate[d] = [];
        byDate[d].push(m);
      });
      const totals = Object.values(byDate).map((meals: any[]) => sumNutrients(meals.map(m => m.totalNutrients)));
      
      setWeeklySummary(generateWeeklySummary(totals, common));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Tabs */}
      <div className="flex bg-[var(--color-neutral-dark)] p-1 rounded-xl w-fit mx-auto border border-[var(--color-card-border)]">
        <button onClick={() => setTab('daily')} className={`px-6 py-2 rounded-lg font-medium text-sm transition ${tab === 'daily' ? 'bg-[var(--color-card)] text-white shadow' : 'text-neutral-400 hover:text-white'}`}>
          Daily Analysis
        </button>
        <button onClick={() => setTab('weekly')} className={`px-6 py-2 rounded-lg font-medium text-sm transition ${tab === 'weekly' ? 'bg-[var(--color-card)] text-white shadow' : 'text-neutral-400 hover:text-white'}`}>
          Weekly Insights
        </button>
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        
        {/* --- DAILY VIEW --- */}
        {tab === 'daily' && (
          <div className="space-y-6">
            {todaysCount === 0 ? (
              <div className="glass p-10 text-center rounded-3xl">
                <BarChart3 size={40} className="mx-auto text-neutral-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">No Meals Yet Today</h3>
                <p className="text-neutral-400">Log at least one meal to see your daily analysis.</p>
              </div>
            ) : (
              <>
                {/* Score Summary */}
                <div className="glass p-8 rounded-3xl text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, ${getScoreColor(dailyScores?.overall || 0)} ${(dailyScores?.overall || 0)}%, transparent 0)` }} />
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">Daily Nutrition Score</h3>
                  <div className="text-6xl font-black mb-2" style={{ color: getScoreColor(dailyScores?.overall || 0) }}>
                    {dailyScores?.overall}
                  </div>
                  <p className="text-sm text-neutral-400 mb-6">{todaysCount} meal{todaysCount > 1 ? 's' : ''} analyzed</p>
                  
                  <div className="bg-[var(--color-neutral-dark)] p-4 rounded-2xl text-left border-l-4 border-l-[var(--color-primary)]">
                    <div className="flex items-start gap-3">
                      <Sparkles className="text-[var(--color-primary)] shrink-0 mt-0.5" size={18} />
                      <p className="text-sm leading-relaxed text-neutral-300">{dailyRecs?.aiSummary}</p>
                    </div>
                  </div>
                </div>

                {/* Sub-Scores */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Protein", score: dailyScores?.protein, icon: <Flame size={18} /> },
                    { label: "Fiber", score: dailyScores?.fiber, icon: <Leaf size={18} /> },
                    { label: "Vitamins", score: dailyScores?.vitamin, icon: <Activity size={18} /> },
                    { label: "Energy", score: dailyScores?.energy, icon: <TrendingUp size={18} /> },
                  ].map((stat) => (
                    <div key={stat.label} className="glass p-4 rounded-2xl">
                      <div className="flex items-center gap-2 text-neutral-400 mb-3">
                        {stat.icon} <span className="text-xs font-bold uppercase">{stat.label}</span>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold" style={{ color: getScoreColor(stat.score || 0) }}>{stat.score || 0}</span>
                        <span className="text-xs text-neutral-500 mb-1">/100</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Analysis Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths/Weaknesses */}
                  <div className="glass p-6 rounded-3xl">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Target size={18} /> Breakdown</h3>
                    <div className="space-y-4">
                      {dailyRecs?.strengths.map((s: string, i: number) => (
                        <div key={`s-${i}`} className="flex items-start gap-2 text-sm text-neutral-300">
                          <div className="w-5 h-5 rounded bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 mt-0.5">+</div>
                          {s}
                        </div>
                      ))}
                      {dailyRecs?.weaknesses.map((w: string, i: number) => (
                        <div key={`w-${i}`} className="flex items-start gap-2 text-sm text-neutral-300">
                          <div className="w-5 h-5 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">-</div>
                          {w}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="glass p-6 rounded-3xl bg-[var(--color-primary)]/5 border-[var(--color-primary)]/20">
                    <h3 className="font-bold text-[var(--color-secondary)] mb-4 flex items-center gap-2"><Activity size={18} /> Action Plan</h3>
                    <ul className="space-y-3">
                      {dailyRecs?.recommendations.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-200">
                          <span className="text-[var(--color-primary)] mt-0.5">•</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* --- WEEKLY VIEW --- */}
        {tab === 'weekly' && (
          <div className="space-y-6">
            {!weeklySummary || weeklySummary.includes("Not enough data") ? (
              <div className="glass p-10 text-center rounded-3xl">
                <Calendar size={40} className="mx-auto text-neutral-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Need More Data</h3>
                <p className="text-neutral-400 max-w-sm mx-auto">Weekly insights unlock after you log meals for at least 3 days. Keep scanning!</p>
              </div>
            ) : (
              <>
                <div className="glass p-6 rounded-3xl">
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">Coach Summary</h3>
                  <p className="text-lg leading-relaxed">{weeklySummary}</p>
                </div>

                <h3 className="text-xl font-bold mt-8 mb-4 flex items-center gap-2">
                  <ShieldAlert className="text-[var(--color-secondary)]" /> Predictive Wellness
                </h3>
                
                <div className="grid gap-4">
                  {weeklyRisks.map((risk, i) => (
                    <div key={i} className={`p-6 rounded-2xl border ${
                      risk.level === 'high' ? 'bg-red-500/10 border-red-500/30' :
                      risk.level === 'medium' ? 'bg-orange-500/10 border-orange-500/30' :
                      'bg-green-500/10 border-green-500/30'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        {risk.level === 'high' ? <AlertTriangle className="text-red-400" /> :
                         risk.level === 'medium' ? <Activity className="text-orange-400" /> :
                         <Leaf className="text-green-400" />}
                        <h4 className={`font-bold ${
                          risk.level === 'high' ? 'text-red-400' :
                          risk.level === 'medium' ? 'text-orange-400' :
                          'text-green-400'
                        }`}>{risk.risk}</h4>
                      </div>
                      <p className="text-sm text-neutral-300 mb-3">{risk.reason}</p>
                      <div className="bg-black/30 rounded-xl p-3 text-sm">
                        <span className="font-bold text-white mb-1 block">Suggested Action:</span>
                        <span className="text-neutral-300">{risk.suggestedAction}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <p className="text-xs text-neutral-500 text-center mt-6">
                  This is an AI wellness insight based on logged meals. Consult a healthcare professional for medical advice.
                </p>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
