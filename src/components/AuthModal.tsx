"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Activity, Target, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState<"auth" | "profile">("auth");
  const router = useRouter();

  const handleComplete = () => {
    onClose();
    // In a real app, we'd save auth and redirect
    router.push("/dashboard");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
          >
            <div className="glass rounded-2xl overflow-hidden shadow-glow-strong">
              
              {step === "auth" && (
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Join Gursha</h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-white transition">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <input 
                      type="email" 
                      placeholder="Email address" 
                      className="w-full bg-[var(--color-neutral-dark)] border border-[var(--color-neutral-light)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary)] transition"
                    />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      className="w-full bg-[var(--color-neutral-dark)] border border-[var(--color-neutral-light)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary)] transition"
                    />
                  </div>
                  
                  <button 
                    onClick={() => setStep("profile")}
                    className="w-full mt-8 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium rounded-xl py-3 flex items-center justify-center gap-2 transition"
                  >
                    Continue <ArrowRight size={18} />
                  </button>
                  
                  <p className="text-center text-neutral-400 text-sm mt-6">
                    Already have an account? <span className="text-[var(--color-secondary)] cursor-pointer">Login here</span>
                  </p>
                </div>
              )}

              {step === "profile" && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Personalize Your Experience</h2>
                  <p className="text-neutral-400 mb-6 text-sm">Tell us a bit about your wellness goals.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-neutral-300 mb-2 block">Primary Goal</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center gap-2 bg-[var(--color-neutral-dark)] border border-[var(--color-primary)] rounded-lg p-3 text-white text-sm">
                          <Target size={16} className="text-[var(--color-primary)]"/> Balanced Eating
                        </button>
                        <button className="flex items-center gap-2 bg-[var(--color-neutral-dark)] border border-transparent rounded-lg p-3 text-neutral-400 text-sm hover:border-[var(--color-neutral-light)]">
                          <Activity size={16}/> Weight Control
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-neutral-300 mb-2 block">Budget Mode</label>
                      <div className="flex gap-3">
                        {['Student', 'Standard', 'Premium'].map((budget) => (
                          <button key={budget} className={`flex-1 rounded-lg py-2 text-sm border ${budget === 'Standard' ? 'border-[var(--color-secondary)] text-[var(--color-secondary)]' : 'border-transparent bg-[var(--color-neutral-dark)] text-neutral-400'}`}>
                            {budget}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleComplete}
                    className="w-full mt-8 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium rounded-xl py-3 transition"
                  >
                    Complete Setup
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
