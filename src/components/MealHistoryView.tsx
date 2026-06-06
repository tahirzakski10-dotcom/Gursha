"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Trash2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { getMealHistory, deleteMealLog } from "@/lib/storage";
import type { MealLog } from "@/lib/types";
import { getScoreColor } from "@/lib/scoringEngine";

export default function MealHistoryView() {
  const [history, setHistory] = useState<MealLog[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    // Sort newest first
    const data = getMealHistory().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setHistory(data);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMealLog(id);
    loadHistory();
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="w-20 h-20 bg-[var(--color-neutral-dark)] rounded-full flex items-center justify-center mb-6 text-neutral-500">
          <Calendar size={32} />
        </div>
        <h3 className="text-2xl font-bold mb-2">No Meals Logged Yet</h3>
        <p className="text-neutral-400 max-w-md">
          Head over to the Scan Meal tab to log your first Ethiopian meal and start building your nutrition history.
        </p>
      </div>
    );
  }

  // Group by date
  const grouped: Record<string, MealLog[]> = {};
  history.forEach(m => {
    const d = new Date(m.timestamp).toLocaleDateString();
    if (!grouped[d]) grouped[d] = [];
    grouped[d].push(m);
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-8">
      {Object.entries(grouped).map(([date, meals]) => (
        <div key={date}>
          <h3 className="text-sm font-bold text-neutral-400 mb-4 sticky top-0 bg-background/80 backdrop-blur-md py-2 z-10">{date}</h3>
          <div className="space-y-3">
            {meals.map((meal) => {
              const isExpanded = expandedId === meal.id;
              const time = new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              return (
                <div key={meal.id} className="glass border border-[var(--color-card-border)] rounded-2xl overflow-hidden cursor-pointer transition hover:border-neutral-500" onClick={() => setExpandedId(isExpanded ? null : meal.id)}>
                  
                  {/* Summary Row */}
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      {meal.imageData ? (
                        <img src={meal.imageData} alt="Meal thumbnail" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="w-14 h-14 bg-[var(--color-neutral-dark)] rounded-xl flex items-center justify-center shrink-0 text-neutral-500 text-xs">No img</div>
                      )}
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-[var(--color-neutral-dark)] text-neutral-300 uppercase capitalize">{meal.mealType}</span>
                          <span className="text-xs text-neutral-500 flex items-center gap-1"><Clock size={12} /> {time}</span>
                        </div>
                        <h4 className="font-bold">{meal.foods.map(f => f.foodName).join(', ')}</h4>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-center hidden sm:block">
                        <div className="text-sm font-bold">{meal.totalNutrients.calories}</div>
                        <div className="text-[10px] text-neutral-400 uppercase">Cal</div>
                      </div>
                      <div className="text-center hidden sm:block">
                        <div className="text-sm font-bold text-[var(--color-primary)]">{meal.totalNutrients.protein}g</div>
                        <div className="text-[10px] text-neutral-400 uppercase">Protein</div>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: `${getScoreColor(meal.scores.overall)}20`, color: getScoreColor(meal.scores.overall) }}>
                        <span className="font-bold text-sm">{meal.scores.overall}</span>
                      </div>
                      <div className="text-neutral-500 hover:text-white transition p-2">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-[var(--color-card-border)] bg-[var(--color-neutral-dark)]/30">
                        <div className="p-4 md:p-6 space-y-6">
                          
                          {/* Foods List */}
                          <div>
                            <h5 className="text-xs font-bold text-neutral-400 mb-3 uppercase tracking-wider">Quantities</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {meal.foods.map((f, i) => (
                                <div key={i} className="bg-[var(--color-neutral-dark)] p-3 rounded-xl flex justify-between items-center">
                                  <span className="font-medium text-sm">{f.foodName}</span>
                                  <span className="text-xs text-[var(--color-primary)] font-bold">{f.quantity} {f.servingUnit}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recommendations */}
                          {meal.recommendations && meal.recommendations.length > 0 && (
                            <div>
                              <h5 className="text-xs font-bold text-[var(--color-secondary)] mb-3 uppercase tracking-wider">Coach Insights</h5>
                              <ul className="space-y-2">
                                {meal.recommendations.map((rec, i) => (
                                  <li key={i} className="text-sm text-neutral-300 flex items-start gap-2">
                                    <span className="text-[var(--color-primary)] mt-0.5">•</span> {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Footer Actions */}
                          <div className="flex justify-end pt-2">
                            <button onClick={(e) => handleDelete(meal.id, e)} className="flex items-center gap-2 text-xs font-medium text-red-400 hover:text-red-300 transition px-3 py-2 bg-red-400/10 rounded-lg">
                              <Trash2 size={14} /> Delete Meal
                            </button>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
