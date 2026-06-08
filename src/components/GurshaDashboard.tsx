"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Scan, Target, HeartPulse, Map, Settings,
  Droplet, Moon, Zap, Plus, Camera, Upload,
  CheckCircle2, AlertTriangle, ChevronRight, Activity, MapPin,
  Flame, Leaf, Apple, History, MessageSquare, PieChart, Info,
  Minus, Check, Sparkles, Sun, Rocket, Trophy
} from "lucide-react";

import { isOnboardingDone } from "@/lib/storage";
import { lookupFood, scaleNutrients, sumNutrients, BACKEND_TO_DISPLAY } from "@/lib/nutritionDB";
import { scoreMeal, getScoreColor } from "@/lib/scoringEngine";
import { generateMealRecommendations } from "@/lib/recommendationEngine";
import { saveMealLog, generateId, getTodaysSummary, getTodaysMeals, getHealthProfile } from "@/lib/storage";
import type { MealType, MealFoodEntry, NutrientProfile, MealLog, HealthProfile } from "@/lib/types";

// Import Views
import OnboardingModal from "./OnboardingModal";
import HealthProfileView from "./HealthProfileView";
import MealHistoryView from "./MealHistoryView";
import AICoachView from "./AICoachView";
import FutureGoalsView from "./FutureGoalsView";
import PerformancePlusView from "./PerformancePlusView";
import ReportsView from "./ReportsView";
import DiseasesView from "./DiseasesView";
import ChallengesView from "./ChallengesView";
import RestaurantsView from "./RestaurantsView";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { matchRestaurants, RESTAURANTS } from "@/lib/restaurantRecommendationEngine";

// --- Sub-views for the Dashboard ---

// Small widget for recommended nearby meals on the dashboard
function NearbyMealsWidget() {
  const [topMatches, setTopMatches] = useState<{ name: string; dish: string; distance: number; score: number }[]>([]);

  useEffect(() => {
    const profile = getHealthProfile();
    // Use Addis Ababa center as default location for widget
    const results = matchRestaurants(9.0150, 38.7636, profile, {});
    setTopMatches(
      results.slice(0, 2).map((m) => ({
        name: m.restaurant.name,
        dish: m.recommendedDish?.name || 'Chef\'s Special',
        distance: m.distance,
        score: m.matchScore,
      }))
    );
  }, []);

  if (topMatches.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 p-4 rounded-xl border border-orange-500/20 mt-4">
      <h4 className="font-bold text-sm text-orange-400 flex items-center gap-2 mb-3">
        <MapPin size={16} /> Recommended Nearby Meals
      </h4>
      <div className="space-y-2">
        {topMatches.map((m, i) => (
          <div key={i} className="bg-[var(--color-neutral-dark)] p-3 rounded-xl flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{m.name}</p>
              <p className="text-[10px] text-neutral-400 truncate">Try: {m.dish}</p>
            </div>
            <div className="text-right shrink-0 ml-2">
              <p className="text-[10px] font-bold text-[var(--color-primary)]">{m.score}%</p>
              <p className="text-[9px] text-neutral-500">{m.distance} km</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function HomeView() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [todaysCount, setTodaysCount] = useState(0);
  const [todaysMeals, setTodaysMeals] = useState<MealLog[]>([]);

  useEffect(() => {
    setProfile(getHealthProfile());
    const meals = getTodaysMeals();
    setTodaysMeals(meals);
    setTodaysCount(meals.length);
  }, []);

  const totalNutrients = todaysMeals.length > 0 ? sumNutrients(todaysMeals.map(m => m.totalNutrients)) : null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass p-5 rounded-2xl flex items-center gap-4 border border-[var(--color-primary)]/20">
          <div className="p-3 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">Meals Today</p>
            <h3 className="text-2xl font-bold flex items-end gap-1">
              {todaysCount}
            </h3>
          </div>
        </div>
        <div className="glass p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-full bg-orange-400/10 text-orange-400">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">Calories</p>
            <h3 className="text-2xl font-bold flex items-end gap-1">
              {totalNutrients?.calories || 0}
            </h3>
          </div>
        </div>
        <div className="glass p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-full bg-blue-400/10 text-blue-400">
            <Target size={24} />
          </div>
          <div>
            <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">Protein</p>
            <h3 className="text-2xl font-bold flex items-end gap-1">
              {totalNutrients?.protein || 0}<span className="text-sm font-normal text-neutral-500 mb-1">g</span>
            </h3>
          </div>
        </div>
        <div className="glass p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-full bg-green-400/10 text-green-400">
            <Leaf size={24} />
          </div>
          <div>
            <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">Fiber</p>
            <h3 className="text-2xl font-bold flex items-end gap-1">
              {totalNutrients?.fiber || 0}<span className="text-sm font-normal text-neutral-500 mb-1">g</span>
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Latest Meal or Empty State */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6">{t('dashboard.latestAnalysis')}</h3>

            {todaysMeals.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-[var(--color-neutral-dark)] rounded-xl">
                  {todaysMeals[0].imageData ? (
                    <img src={todaysMeals[0].imageData} className="w-16 h-16 rounded-lg object-cover" alt="meal" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-[var(--color-neutral-light)] flex items-center justify-center">
                      <Camera className="text-neutral-500" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold">{todaysMeals[0].foods.map(f => f.foodName).join(', ')}</h4>
                    <p className="text-sm text-neutral-400 capitalize">{todaysMeals[0].mealType} • {new Date(todaysMeals[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="ml-auto w-12 h-12 rounded-full flex items-center justify-center shadow-glow" style={{ backgroundColor: `${getScoreColor(todaysMeals[0].scores.overall)}20`, color: getScoreColor(todaysMeals[0].scores.overall) }}>
                    <span className="font-bold">{todaysMeals[0].scores.overall}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {todaysMeals[0].recommendations.slice(0, 4).map((rec, i) => (
                    <div key={i} className="bg-[var(--color-primary)]/10 p-4 rounded-xl border border-[var(--color-primary)]/20 text-sm text-neutral-300">
                      <span className="text-[var(--color-primary)] font-bold mb-1 block">{t('dashboard.insight', { number: i + 1 })}</span>
                      {t(`recommendations.${rec}`, rec)}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[var(--color-neutral-dark)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-primary)]">
                  <Scan size={24} />
                </div>
                <h4 className="font-bold mb-2">{t('dashboard.noMeals')}</h4>
                <p className="text-sm text-neutral-400 max-w-sm mx-auto">{t('dashboard.uploadPhoto')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Context */}
        <div className="glass rounded-2xl p-6 flex flex-col">
          <h3 className="text-xl font-bold mb-6">{t('dashboard.profileContext')}</h3>

          <div className="space-y-4 flex-1">
            <div className="bg-[var(--color-neutral-dark)] p-4 rounded-xl">
              <h4 className="font-bold text-sm text-[var(--color-primary)] mb-2">{t('dashboard.healthGoals')}</h4>
              <div className="flex flex-wrap gap-2">
                {profile?.goals?.length ? profile.goals.map(g => (
                  <span key={g} className="text-xs bg-white/5 px-2 py-1 rounded">{g}</span>
                )) : <span className="text-xs text-neutral-500">{t('dashboard.noneSet')}</span>}
              </div>
            </div>

            <div className="bg-[var(--color-neutral-dark)] p-4 rounded-xl border-l-4 border-l-orange-500">
              <h4 className="font-bold text-sm text-orange-400 mb-2">Tracked Conditions</h4>
              <div className="flex flex-wrap gap-2">
                {profile?.conditions?.length ? profile.conditions.map(c => (
                  <span key={c} className="text-xs bg-orange-500/10 text-orange-300 px-2 py-1 rounded">{c}</span>
                )) : <span className="text-xs text-neutral-500">None set</span>}
              </div>
            </div>

            <div className="bg-[var(--color-neutral-dark)] p-4 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-neutral-300 mb-1">Activity Level</h4>
                <p className="text-xs text-neutral-500 capitalize">{profile?.activityLevel || 'Not set'}</p>
              </div>
              <Activity className="text-neutral-500" />
            </div>

            {/* Quick Challenges Widget */}
            <div className="bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/10 p-4 rounded-xl border border-[var(--color-primary)]/30 mt-4 cursor-pointer hover:bg-[var(--color-primary)]/30 transition">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sm text-[var(--color-secondary)] flex items-center gap-2">
                  <Trophy size={16} /> My Challenges
                </h4>
              </div>
              <p className="text-xs text-neutral-300 mb-3">Keep up your daily streaks to earn exclusive badges and wellness points.</p>
              <div className="text-xs font-bold text-white bg-[var(--color-primary)] py-2 px-3 rounded-lg text-center shadow-glow">
                View Challenges Dashboard
              </div>
            </div>

            {/* Recommended Nearby Meals Widget */}
            <NearbyMealsWidget />

          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- SCAN MEAL WIZARD ---

function ScanMealView({ onComplete }: { onComplete: () => void }) {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [mealType, setMealType] = useState<MealType | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [prediction, setPrediction] = useState<{ food: string, backendName: string, confidence: number } | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);

  const [finalLog, setFinalLog] = useState<MealLog | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // STEP 1: Select Meal Type
  const handleMealSelect = (type: MealType) => {
    setMealType(type);
    setStep(2);
  };

  // STEP 2: Upload & Scan
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create thumbnail
    const reader = new FileReader();
    reader.onload = (e) => setImageData(e.target?.result as string);
    reader.readAsDataURL(file);

    setIsScanning(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
           const endpoint = "https://tahirski-gursha-backend.hf.space/predict";
     
    const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Failed to scan (${response.status})`);

      const data = await response.json();
      const backendName = data.predicted_food;
      const confidence = data.confidence;
      const displayFood = BACKEND_TO_DISPLAY[backendName] || backendName.replace('_', ' ');

      setPrediction({ food: displayFood, backendName, confidence });

      const foodItem = lookupFood(backendName);
      if (foodItem) {
        setQuantity(foodItem.defaultServing);
      }

      setStep(3);
    } catch (err) {
      console.error(err);
      alert("AI model temporarily unavailable. Please try again later.");
    } finally {
      setIsScanning(false);
    }
  };

  // STEP 3: Confirm Quantity
  const handleConfirmQuantity = () => {
    if (!prediction || !mealType) return;

    const foodItem = lookupFood(prediction.backendName);
    if (!foodItem) {
      alert("Food not found in database.");
      return;
    }

    const scaledNutrients = scaleNutrients(foodItem.nutrientsPerServing, quantity);
    const profile = getHealthProfile();
    const scores = scoreMeal(scaledNutrients, profile);
    const recommendations = generateMealRecommendations(scaledNutrients, [prediction.food], profile);

    const log: MealLog = {
      id: generateId(),
      mealType,
      foods: [{
        foodId: foodItem.id,
        foodName: foodItem.displayName,
        quantity,
        servingUnit: foodItem.servingUnit,
        nutrients: scaledNutrients
      }],
      totalNutrients: scaledNutrients,
      scores,
      recommendations,
      timestamp: new Date().toISOString(),
      imageData: imageData || undefined,
      confidence: prediction.confidence
    };

    setFinalLog(log);
    saveMealLog(log);
    setStep(4);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center p-6 text-center max-w-2xl mx-auto overflow-y-auto no-scrollbar pb-20">

      {/* STEP INDICATOR */}
      <div className="flex items-center gap-2 mb-8 w-full max-w-md">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex-1 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-1 transition-colors ${step >= s ? 'bg-[var(--color-primary)] text-white shadow-glow' : 'bg-[var(--color-neutral-dark)] text-neutral-500'
              }`}>
              {step > s ? <Check size={14} /> : s}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* STEP 1: Meal Type */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
            <h2 className="text-3xl font-bold mb-2">What are you logging?</h2>
            <p className="text-neutral-400 mb-8">Select the meal type to start.</p>
            <div className="grid grid-cols-2 gap-4">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map(t => (
                <button key={t} onClick={() => handleMealSelect(t)} className="glass p-6 rounded-2xl hover:border-[var(--color-primary)] transition group cursor-pointer">
                  <div className="w-12 h-12 bg-[var(--color-neutral-dark)] rounded-full mx-auto mb-3 flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 group-hover:text-[var(--color-primary)] transition">
                    {t === 'breakfast' && <Sun size={20} />}
                    {t === 'lunch' && <Sun size={20} />}
                    {t === 'dinner' && <Moon size={20} />}
                    {t === 'snack' && <Apple size={20} />}
                  </div>
                  <h4 className="font-bold capitalize">{t}</h4>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2: Upload */}
        {step === 2 && !isScanning && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
            <div className="w-24 h-24 bg-[var(--color-neutral-dark)] rounded-full flex items-center justify-center mb-6 text-[var(--color-primary)] shadow-glow mx-auto">
              <Camera size={40} />
            </div>
            <h2 className="text-3xl font-bold mb-4">Analyze Your {mealType}</h2>
            <p className="text-neutral-400 mb-8 max-w-md mx-auto">
              Upload a photo of your meal. Gursha's AI will identify the dish and calculate a health score.
            </p>

            <div className="flex justify-center">
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleUpload} accept="image/jpeg,image/png,image/webp" />
              <button onClick={() => fileInputRef.current?.click()} className="px-8 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-xl font-bold transition flex items-center gap-2 shadow-glow cursor-pointer">
                <Upload size={20} /> Choose Photo
              </button>
            </div>
            <button onClick={() => setStep(1)} className="mt-6 text-sm text-neutral-500 hover:text-white transition">Back</button>
          </motion.div>
        )}

        {/* SCANNING */}
        {isScanning && (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-10">
            <div className="w-20 h-20 relative mb-6">
              <div className="absolute inset-0 border-4 border-[var(--color-neutral-dark)] border-t-[var(--color-primary)] rounded-full animate-spin" />
              <Camera size={24} className="absolute inset-0 m-auto text-[var(--color-primary)] animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold">Running ML Model...</h3>
            <p className="text-neutral-400 mt-2">Identifying food with EfficientNet-B0...</p>
          </motion.div>
        )}

        {/* STEP 3: Quantity */}
        {step === 3 && prediction && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-sm mx-auto">

            <div className="relative rounded-2xl overflow-hidden mb-6 aspect-square border-2 border-[var(--color-primary)] shadow-glow">
              {imageData && <img src={imageData} alt="Uploaded" className="w-full h-full object-cover" />}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-400" />
                  <span className="text-green-400 font-bold text-sm">{(prediction.confidence * 100).toFixed(1)}% Match</span>
                </div>
                <h2 className="text-3xl font-bold text-white">{prediction.food}</h2>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl mb-6">
              <h4 className="font-bold mb-4">{lookupFood(prediction.backendName)?.quantityQuestion || "How many servings?"}</h4>
              <div className="flex items-center justify-center gap-6">
                <button onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))} className="w-12 h-12 rounded-full bg-[var(--color-neutral-dark)] hover:bg-[var(--color-neutral-light)] flex items-center justify-center transition cursor-pointer">
                  <Minus size={20} />
                </button>
                <div className="text-3xl font-black w-20">{quantity}</div>
                <button onClick={() => setQuantity(quantity + 0.5)} className="w-12 h-12 rounded-full bg-[var(--color-neutral-dark)] hover:bg-[var(--color-neutral-light)] flex items-center justify-center transition cursor-pointer">
                  <Plus size={20} />
                </button>
              </div>
              <p className="text-neutral-400 text-sm mt-4 capitalize">{lookupFood(prediction.backendName)?.servingUnit}s</p>
            </div>

            <button onClick={handleConfirmQuantity} className="w-full px-8 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-xl font-bold transition shadow-glow cursor-pointer">
              Confirm Meal
            </button>
            <button onClick={() => setStep(2)} className="mt-4 text-sm text-neutral-500 hover:text-white transition">Wrong food? Retake</button>
          </motion.div>
        )}

        {/* STEP 4: Results */}
        {step === 4 && finalLog && (
          <motion.div key="step4" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full text-left max-w-xl mx-auto space-y-6">

            <div className="glass p-8 rounded-3xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2" style={{ background: `linear-gradient(90deg, ${getScoreColor(finalLog.scores.overall)} ${finalLog.scores.overall}%, transparent 0)` }} />
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">Meal Score</h3>
              <div className="text-7xl font-black mb-2" style={{ color: getScoreColor(finalLog.scores.overall) }}>
                {finalLog.scores.overall}
              </div>
              <p className="text-neutral-400">Out of 100</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="glass p-4 rounded-xl text-center border-t-2 border-orange-400">
                <div className="text-xl font-bold mb-1">{finalLog.totalNutrients.calories}</div>
                <div className="text-[10px] text-neutral-400 uppercase">Calories</div>
              </div>
              <div className="glass p-4 rounded-xl text-center border-t-2 border-[var(--color-primary)]">
                <div className="text-xl font-bold mb-1 text-[var(--color-primary)]">{finalLog.totalNutrients.protein}g</div>
                <div className="text-[10px] text-neutral-400 uppercase">Protein</div>
              </div>
              <div className="glass p-4 rounded-xl text-center border-t-2 border-blue-400">
                <div className="text-xl font-bold mb-1 text-blue-400">{finalLog.totalNutrients.carbs}g</div>
                <div className="text-[10px] text-neutral-400 uppercase">Carbs</div>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20">
              <h4 className="font-bold text-[var(--color-secondary)] mb-4 flex items-center gap-2">
                <Sparkles size={18} /> AI Coach Recommendations
              </h4>
              <ul className="space-y-3">
                {finalLog.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-neutral-200 leading-relaxed">
                    <span className="text-[var(--color-primary)] mt-0.5">•</span> {t(`recommendations.${rec}`, rec)}
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={() => { onComplete(); }} className="w-full py-4 bg-[var(--color-neutral-dark)] hover:bg-[var(--color-neutral-light)] rounded-xl font-bold transition">
              Save & Return to Dashboard
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}



// --- Main Dashboard Component ---

export default function GurshaDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!isOnboardingDone()) {
      setShowOnboarding(true);
    }
  }, []);

  const sidebarItems = [
    { name: "Dashboard", translationKey: "dashboard.dashboard", icon: <Home size={20} /> },
    { name: "Scan Meal", translationKey: "dashboard.scanMeal", icon: <Scan size={20} /> },
    { name: "History", translationKey: "dashboard.history", icon: <History size={20} /> },
    { name: "Challenges", translationKey: "dashboard.challenges", icon: <Trophy size={20} /> },
    { name: "Reports", translationKey: "dashboard.reports", icon: <PieChart size={20} /> },
    { name: "AI Coach", translationKey: "dashboard.aiCoach", icon: <MessageSquare size={20} /> },
    { name: "Performance+", translationKey: "dashboard.performance", icon: <Zap size={20} /> },
    { name: "Diseases", translationKey: "dashboard.diseases", icon: <HeartPulse size={20} /> },
    { name: "Future Goals", translationKey: "dashboard.futureGoals", icon: <Rocket size={20} /> },
    { name: "Restaurants", translationKey: "dashboard.restaurants", icon: <Map size={20} /> },
    { name: "Profile", translationKey: "dashboard.profile", icon: <Settings size={20} /> },
  ];

  return (
    <div className="h-screen bg-background flex flex-col md:flex-row text-white font-sans overflow-hidden">

      <OnboardingModal isOpen={showOnboarding} onComplete={() => setShowOnboarding(false)} />

      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-[var(--color-card-border)] p-6 flex flex-col gap-8 hidden md:flex shrink-0">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Gursha Logo" className="w-10 h-10 rounded-full shadow-glow" />
          <h1 className="text-2xl font-bold tracking-tight">Gursha</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto no-scrollbar">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition cursor-pointer ${activeTab === item.name
                ? "bg-[var(--color-card)] text-[var(--color-primary)] border border-[var(--color-card-border)] shadow-glow"
                : "text-neutral-400 hover:text-white hover:bg-[var(--color-neutral-dark)]"
                }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium text-sm">{t(`nav.${item.name.replace('+', '').replace(' ', '').replace(/^\w/, c => c.toLowerCase())}`, item.name)}</span>
              </div>
              {activeTab === item.name && <ChevronRight size={16} />}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="flex justify-between items-center p-6 md:px-10 md:pt-10 shrink-0 border-b md:border-b-0 border-[var(--color-card-border)]">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              {activeTab === "Dashboard" ? t('dashboard.goodMorning') : t(`nav.${activeTab.replace('+', '').replace(' ', '').replace(/^\w/, c => c.toLowerCase())}`, activeTab)}
            </h2>
            <p className="text-neutral-400 mt-1 hidden md:block text-sm">
              {activeTab === "Dashboard" ? t('dashboard.wellnessBalance') : t('dashboard.exploreInsights', { tab: activeTab })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="md:hidden font-bold flex items-center gap-2 text-white">
              <img src="/logo.png" alt="Gursha Logo" className="w-8 h-8 rounded-full shadow-glow" />
              Gursha
            </div>
            <button onClick={() => setActiveTab("Scan Meal")} className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-5 py-2.5 rounded-full font-medium transition shadow-glow flex items-center gap-2 cursor-pointer hidden md:flex">
              <Scan size={18} />
              <span>Log Meal</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Tabs (visible only on mobile) */}
        <div className="md:hidden flex overflow-x-auto p-4 gap-2 border-b border-[var(--color-card-border)] shrink-0 no-scrollbar bg-background z-10">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition cursor-pointer ${activeTab === item.name
                ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30"
                : "bg-[var(--color-neutral-dark)] text-neutral-400"
                }`}
            >
              {item.icon}
              {t(`nav.${item.name.replace('+', '').replace(' ', '').replace(/^\w/, c => c.toLowerCase())}`, item.name)}
            </button>
          ))}
        </div>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto p-6 md:px-10 pb-20 md:pb-10 relative">
          <AnimatePresence mode="wait">
            {activeTab === "Dashboard" && <HomeView key="home" />}
            {activeTab === "Scan Meal" && <ScanMealView key="scan" onComplete={() => setActiveTab("Dashboard")} />}
            {activeTab === "History" && <MealHistoryView key="history" />}
            {activeTab === "Challenges" && <ChallengesView key="challenges" />}
            {activeTab === "Reports" && <ReportsView key="reports" />}
            {activeTab === "AI Coach" && <AICoachView key="coach" />}
            {activeTab === "Performance+" && <PerformancePlusView key="performance-plus" />}
            {activeTab === "Profile" && <HealthProfileView key="profile" />}
            {activeTab === "Diseases" && <DiseasesView key="diseases" />}
            {activeTab === "Future Goals" && <FutureGoalsView key="future-goals" />}
            {activeTab === "Restaurants" && <RestaurantsView key="restaurants" />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
