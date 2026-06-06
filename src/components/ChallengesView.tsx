"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Target, CheckCircle2, AlertCircle, Camera, Upload, Brain, Activity, Medal, TrendingUp, CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AVAILABLE_CHALLENGES, startChallenge, verifyChallengeTask, logDailyTask, predictChallengeSuccess } from "@/lib/challengeEngine";
import { getUserChallenges, getUserBadges, getHealthProfile } from "@/lib/storage";
import type { UserChallenge, Badge, ChallengeDefinition } from "@/lib/types";

export default function ChallengesView() {
  const { t } = useTranslation();
  
  const [activeChallenges, setActiveChallenges] = useState<UserChallenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  
  const [selectedChallengeToJoin, setSelectedChallengeToJoin] = useState<ChallengeDefinition | null>(null);
  
  // Upload Proof State
  const [uploadChallenge, setUploadChallenge] = useState<UserChallenge | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setActiveChallenges(getUserChallenges());
    setBadges(getUserBadges());
    const profile = getHealthProfile();
    setPoints(profile?.totalPoints || 0);
    setLevel(profile?.level || 1);
  };

  const handleJoinChallenge = (challengeId: string) => {
    startChallenge(challengeId);
    setSelectedChallengeToJoin(null);
    refreshData();
  };

  const handleUploadClick = (uc: UserChallenge) => {
    setUploadChallenge(uc);
    setTimeout(() => fileInputRef.current?.click(), 100);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadChallenge) return;

    // Create thumbnail
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const base64 = evt.target?.result as string;
      setIsVerifying(true);
      
      const result = await verifyChallengeTask(base64, uploadChallenge.challengeId);
      
      const today = new Date().toISOString().slice(0, 10);
      logDailyTask(uploadChallenge, today, base64, result);
      
      setIsVerifying(false);
      setUploadChallenge(null);
      refreshData();
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8 pb-10">
      
      {/* Hidden file input for tasks */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

      {/* HEADER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-6 rounded-2xl flex items-center justify-between border-b-4 border-yellow-500">
          <div>
            <p className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-1">Wellness Level</p>
            <h3 className="text-3xl font-black text-white">Level {level}</h3>
          </div>
          <div className="w-14 h-14 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center shadow-glow">
            <Trophy size={28} />
          </div>
        </div>
        
        <div className="glass p-6 rounded-2xl flex items-center justify-between border-b-4 border-[var(--color-primary)]">
          <div>
            <p className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-1">Total Points</p>
            <h3 className="text-3xl font-black text-white">{points}</h3>
          </div>
          <div className="w-14 h-14 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center shadow-glow">
            <Star size={28} />
          </div>
        </div>

        <div className="glass p-6 rounded-2xl flex items-center justify-between border-b-4 border-emerald-500">
          <div>
            <p className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-1">Badges Earned</p>
            <h3 className="text-3xl font-black text-white">{badges.length}</h3>
          </div>
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-glow">
            <Medal size={28} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: ACTIVE & FEATURED CHALLENGES */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Challenges */}
          {activeChallenges.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Target className="text-[var(--color-primary)]" /> My Active Challenges
              </h2>
              <div className="space-y-4">
                {activeChallenges.map(uc => {
                  const def = AVAILABLE_CHALLENGES.find(c => c.id === uc.challengeId);
                  if (!def) return null;
                  const today = new Date().toISOString().slice(0, 10);
                  const isDoneToday = !!uc.logs[today];
                  
                  return (
                    <motion.div key={uc.id} className="glass p-6 rounded-3xl relative overflow-hidden group">
                      <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${def.gradient}`} />
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pl-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${def.gradient} flex items-center justify-center text-3xl shadow-lg`}>
                            {def.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{def.title}</h3>
                            <p className="text-sm text-neutral-400 flex items-center gap-2 mt-1">
                              <CalendarDays size={14} /> Day {Object.keys(uc.logs).length} of {def.durationDays}
                              <span className="text-neutral-600">•</span>
                              <TrendingUp size={14} className="text-orange-400" /> {uc.currentStreak} Day Streak
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-bold text-[var(--color-primary)]">{uc.completionPercentage}%</div>
                            <div className="w-24 h-2 bg-neutral-800 rounded-full mt-1 overflow-hidden">
                              <div className="h-full bg-[var(--color-primary)]" style={{ width: `${uc.completionPercentage}%` }} />
                            </div>
                          </div>
                          
                          {uc.status === 'Completed' ? (
                            <div className="px-4 py-2 bg-green-500/20 text-green-400 font-bold rounded-xl flex items-center gap-2">
                              <CheckCircle2 size={18} /> Done
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleUploadClick(uc)}
                              disabled={isDoneToday || isVerifying}
                              className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition ${
                                isDoneToday ? "bg-neutral-800 text-neutral-500" : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-glow cursor-pointer"
                              }`}
                            >
                              {isVerifying && uploadChallenge?.id === uc.id ? (
                                <Activity className="animate-spin" size={18} />
                              ) : isDoneToday ? (
                                <><CheckCircle2 size={18} /> Logged</>
                              ) : (
                                <><Camera size={18} /> Upload Proof</>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Featured Challenges */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Star className="text-yellow-400" /> Featured Challenges
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {AVAILABLE_CHALLENGES.filter(c => !activeChallenges.find(ac => ac.challengeId === c.id)).map(def => (
                <div key={def.id} className="glass p-6 rounded-3xl flex flex-col h-full border border-[var(--color-card-border)] hover:border-[var(--color-primary)]/50 transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${def.gradient} flex items-center justify-center text-3xl shadow-lg`}>
                      {def.icon}
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-neutral-800 rounded-full text-neutral-300">
                      {def.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{def.title}</h3>
                  <p className="text-sm text-neutral-400 mb-4 flex-1">{def.goal}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-sm font-bold text-[var(--color-secondary)]">+{def.points} pts</div>
                    <button 
                      onClick={() => setSelectedChallengeToJoin(def)}
                      className="px-4 py-2 bg-white/10 hover:bg-[var(--color-primary)] text-white rounded-xl text-sm font-bold transition cursor-pointer"
                    >
                      Join Challenge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: AI COACH & BADGES */}
        <div className="space-y-6">
          
          {/* AI Habit Predictor Card */}
          <div className="glass p-6 rounded-3xl border border-[var(--color-primary)]/30 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-primary)] rounded-full blur-[60px] opacity-20 pointer-events-none" />
            <h3 className="font-bold flex items-center gap-2 text-[var(--color-secondary)] mb-6">
              <Brain size={20} /> AI Habit Predictor
            </h3>
            
            {activeChallenges.length > 0 ? (
              <div className="space-y-6">
                {activeChallenges.filter(c => c.status === 'Active').map(uc => {
                  const def = AVAILABLE_CHALLENGES.find(c => c.id === uc.challengeId);
                  const prediction = predictChallengeSuccess(uc);
                  return (
                    <div key={uc.id} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-white">{def?.title}</span>
                        <span className="font-bold text-[var(--color-primary)]">{prediction.probability}% Success Rate</span>
                      </div>
                      <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                         <div className="h-full bg-gradient-to-r from-orange-500 to-[var(--color-primary)]" style={{ width: `${prediction.probability}%` }} />
                      </div>
                      <div className="bg-[var(--color-neutral-dark)] p-3 rounded-xl text-xs text-neutral-300 leading-relaxed border-l-2 border-[var(--color-primary)]">
                        {prediction.insights[0]}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-neutral-400 leading-relaxed">
                Join a challenge and log your daily progress. Gursha's AI will analyze your consistency and predict your habit-forming success!
              </p>
            )}
          </div>

          {/* Badges Cabinet */}
          <div className="glass p-6 rounded-3xl">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Medal className="text-emerald-400" /> Achievement Cabinet
            </h3>
            {badges.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {badges.map(b => (
                  <div key={b.id} className="aspect-square bg-[var(--color-neutral-dark)] rounded-2xl flex flex-col items-center justify-center text-center p-2 border border-emerald-500/20 shadow-glow relative group">
                    <span className="text-3xl mb-1">{b.icon}</span>
                    <span className="text-[10px] font-bold text-white leading-tight">{b.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 px-4 border-2 border-dashed border-neutral-700 rounded-2xl">
                <Medal size={32} className="mx-auto text-neutral-600 mb-2" />
                <p className="text-sm text-neutral-400">Complete challenges to earn beautiful badges.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>

      {/* Modal for Joining Challenge */}
      <AnimatePresence>
        {selectedChallengeToJoin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass p-8 rounded-[2rem] w-full max-w-md relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-3 bg-gradient-to-r ${selectedChallengeToJoin.gradient}`} />
              
              <div className="text-5xl text-center mb-4 mt-2">{selectedChallengeToJoin.icon}</div>
              <h2 className="text-2xl font-bold text-center mb-2">{selectedChallengeToJoin.title}</h2>
              <p className="text-neutral-400 text-center mb-6">{selectedChallengeToJoin.goal}</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between p-3 bg-[var(--color-neutral-dark)] rounded-xl">
                  <span className="text-neutral-400 text-sm">Duration</span>
                  <span className="font-bold">{selectedChallengeToJoin.durationDays} Days</span>
                </div>
                <div className="flex justify-between p-3 bg-[var(--color-neutral-dark)] rounded-xl">
                  <span className="text-neutral-400 text-sm">Difficulty</span>
                  <span className="font-bold">{selectedChallengeToJoin.difficulty}</span>
                </div>
                <div className="flex justify-between p-3 bg-[var(--color-neutral-dark)] rounded-xl">
                  <span className="text-neutral-400 text-sm">Reward</span>
                  <span className="font-bold text-[var(--color-secondary)]">+{selectedChallengeToJoin.points} Points</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedChallengeToJoin(null)}
                  className="flex-1 py-3 rounded-xl font-bold bg-[var(--color-neutral-dark)] hover:bg-[var(--color-neutral-light)] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleJoinChallenge(selectedChallengeToJoin.id)}
                  className="flex-1 py-3 rounded-xl font-bold bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-glow transition cursor-pointer"
                >
                  Join Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
