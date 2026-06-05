"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, Scan, Target, HeartPulse, Map, Settings, 
  Droplet, Moon, Zap, Plus, Camera, Upload, 
  CheckCircle2, AlertTriangle, ChevronRight, Activity, MapPin, 
  Flame, Leaf, Apple
} from "lucide-react";
import DiseasesView from "./DiseasesView";
import RestaurantsView from "./RestaurantsView";

// --- Sub-views for the Dashboard ---

function HomeView({ studentMode }: { studentMode: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
      
      {/* Top Health Score Overview (Radial/Progress style metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Overall Wellness", value: "88", icon: <Activity size={24} />, color: "text-[var(--color-primary)]", bg: "bg-[var(--color-primary)]/10" },
          { label: "Protein Score", value: "75", icon: <Flame size={24} />, color: "text-orange-400", bg: "bg-orange-400/10" },
          { label: "Fiber Score", value: "92", icon: <Leaf size={24} />, color: "text-green-400", bg: "bg-green-400/10" },
          { label: "Vitamin Score", value: "65", icon: <Apple size={24} />, color: "text-blue-400", bg: "bg-blue-400/10" },
        ].map((stat) => (
          <div key={stat.label} className="glass p-5 rounded-2xl flex items-center gap-4">
            <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold flex items-end gap-1">
                {stat.value} <span className="text-sm text-neutral-500 mb-1 font-normal">/100</span>
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* EthioPlate Coach & Recent Scan */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">EthioPlate Coach Analysis</h3>
              <span className="text-xs font-medium px-3 py-1 bg-[var(--color-neutral-dark)] rounded-full text-[var(--color-secondary)] border border-[var(--color-card-border)]">Latest Meal: Shiro Wat</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-[var(--color-neutral-dark)] p-5 rounded-xl border-l-4 border-l-green-500">
                  <h4 className="font-bold text-sm text-green-400 mb-2 flex items-center gap-2"><CheckCircle2 size={16}/> What is good</h4>
                  <p className="text-sm text-neutral-300">Excellent plant-based protein and high fiber from the chickpea flour. Good slow-digesting carbs.</p>
               </div>
               <div className="bg-[var(--color-neutral-dark)] p-5 rounded-xl border-l-4 border-l-red-500">
                  <h4 className="font-bold text-sm text-red-400 mb-2 flex items-center gap-2"><AlertTriangle size={16}/> What is missing</h4>
                  <p className="text-sm text-neutral-300">Lacking fresh greens (Vitamin K) and healthy Omega-3 fats to balance the heavy carbs.</p>
               </div>
               <div className="bg-[var(--color-neutral-dark)] p-5 rounded-xl border-l-4 border-l-[var(--color-primary)]">
                  <h4 className="font-bold text-sm text-[var(--color-primary)] mb-2">Local Addition</h4>
                  <p className="text-sm text-neutral-300">Add Gomen (collard greens) or a side tomato salad with a touch of olive oil.</p>
               </div>
               <div className="bg-[var(--color-neutral-dark)] p-5 rounded-xl border-l-4 border-l-[var(--color-secondary)]">
                  <h4 className="font-bold text-sm text-[var(--color-secondary)] mb-2">Budget Addition</h4>
                  <p className="text-sm text-neutral-300">A single boiled egg (approx. 15 ETB) is a cheap way to round out the amino acid profile.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Dynamic Mode Widget (Student Mode) */}
        <div className="glass rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent z-0 transition-opacity duration-500 ${studentMode ? 'opacity-100' : 'opacity-0'}`} />
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Mode</h3>
              {studentMode ? (
                <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded">Student Active</span>
              ) : (
                <span className="text-xs font-bold text-neutral-400 bg-neutral-800 px-2 py-1 rounded">Standard</span>
              )}
            </div>
            
            {studentMode ? (
              <div className="space-y-4">
                <div className="bg-[var(--color-neutral-dark)] p-4 rounded-xl border border-blue-500/30">
                  <h4 className="font-bold text-sm text-blue-400 mb-1">Exam Week Suggestion</h4>
                  <p className="text-sm text-neutral-300">For tomorrow's exam, choose a protein-rich breakfast like Kinche or Eggs instead of pure carbs to avoid mid-morning crashes.</p>
                </div>
                <div className="bg-[var(--color-neutral-dark)] p-4 rounded-xl border border-blue-500/30">
                  <h4 className="font-bold text-sm text-blue-400 mb-1">Focus Hydration</h4>
                  <p className="text-sm text-neutral-300">Drink 500ml of water right after your morning coffee to prevent study fatigue.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[var(--color-neutral-dark)] p-4 rounded-xl">
                  <h4 className="font-bold text-sm text-[var(--color-primary)] mb-1">Daily Goal</h4>
                  <p className="text-sm text-neutral-300">Maintain a balanced macronutrient profile. Keep protein above 60g.</p>
                </div>
              </div>
            )}
          </div>
          
          <button className="mt-6 w-full py-3 bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-xl text-sm font-medium hover:bg-[var(--color-neutral-dark)] transition relative z-10">
            View full week plan
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ScanMealView() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const NUTRITION_DB: Record<string, any> = {
    "Shiro Wat": { calories: 350, protein: "15g", coach: "Excellent plant-based protein and high fiber from chickpea flour. Lacking fresh greens. Add Gomen (collard greens)." },
    "Tibs": { calories: 550, protein: "45g", coach: "Outstanding source of iron and high-quality protein. Needs more fiber to aid digestion. Pair with extra Injera and a side of Fasolia (green beans)." },
    "Shekla Tibs": { calories: 600, protein: "50g", coach: "High-protein, but cooked with more fats. Ensure you balance with fiber like a side salad." },
    "Injera": { calories: 150, protein: "5g", coach: "Teff is an ancient superfood, packed with iron, calcium, and resistant starch. It is mostly carbs; you need a protein source to build a complete meal." },
    "Doro Wat": { calories: 450, protein: "35g", coach: "Great source of protein from the chicken and eggs. Rich in spices, but can be heavy in fats depending on the butter (Niter Kibbeh) used." },
    "Beyaynetu": { calories: 600, protein: "20g", coach: "The ultimate balanced vegan meal. High in fiber, vitamins, and minerals. Perfect for a well-rounded diet." },
    "Kitfo": { calories: 500, protein: "40g", coach: "Raw or lightly cooked lean beef is extremely high in protein and iron, but ensure the meat is safely sourced." },
    "Fir-fir": { calories: 400, protein: "10g", coach: "Injera soaked in sauce is comforting but heavy on carbs. Add a boiled egg for protein." },
    "Chechebsa": { calories: 450, protein: "8g", coach: "A heavy, buttery breakfast. Delicious, but high in fats and carbs. Eat in moderation if focusing on weight loss." },
    "Genfo": { calories: 500, protein: "12g", coach: "Very calorie-dense porridge. Excellent for energy, but often paired with lots of butter. Good for active days." },
    "Kikil": { calories: 300, protein: "25g", coach: "A lighter, broth-based meat stew. Great for hydration and a lighter protein source." },
    "Tihlo": { calories: 350, protein: "10g", coach: "Barley dough balls are high in complex carbs and fiber. Dip in spicy meat sauce for protein." },
    "Tire Siga": { calories: 400, protein: "45g", coach: "Raw beef provides pure protein and iron, but carries food safety risks. Pair with Awaze for flavor." },
    "Default": { calories: 400, protein: "25g", coach: "Traditional Ethiopian food is generally well-spiced and communal. Make sure you have a good source of protein like lentils or eggs." }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) throw new Error("Failed to scan");
      
      const data = await response.json();
      const foodName = data.predicted_food;
      const confidence = `${(data.confidence * 100).toFixed(1)}%`;
      
      const analysis = NUTRITION_DB[foodName] || NUTRITION_DB["Default"];

      setResult({
        food: foodName,
        confidence: confidence,
        calories: analysis.calories,
        protein: analysis.protein,
        coach: analysis.coach
      });
    } catch (err) {
      console.error(err);
      // Fallback
      setResult({
        food: "Error",
        confidence: "0%",
        calories: 0,
        protein: "0g",
        coach: "Could not reach the AI model. Please ensure the backend is running on port 8000."
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto">
      
      {!result && !isScanning && (
        <>
          <div className="w-24 h-24 bg-[var(--color-neutral-dark)] rounded-full flex items-center justify-center mb-6 text-[var(--color-primary)] shadow-glow">
            <Camera size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Analyze Your Plate</h2>
          <p className="text-neutral-400 mb-8">
            Upload a photo of your Ethiopian meal. Gursha's AI will identify the dish, calculate a health score, and act as your EthioPlate Coach.
          </p>
          
          <div className="flex gap-4">
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleUpload} accept="image/*" />
            <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-xl font-medium transition flex items-center gap-2 shadow-glow cursor-pointer">
              <Upload size={18} /> Upload Photo
            </button>
          </div>
        </>
      )}

      {isScanning && (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[var(--color-neutral-dark)] border-t-[var(--color-primary)] rounded-full animate-spin mb-6" />
          <h3 className="text-xl font-bold">Running ML Model...</h3>
          <p className="text-neutral-400 mt-2 text-sm">Passing image through EfficientNet-B0 classifier...</p>
        </div>
      )}

      {result && !isScanning && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full text-left">
          <div className="glass p-8 rounded-2xl">
             <div className="flex justify-between items-start mb-6 pb-6 border-b border-[var(--color-card-border)]">
                <div>
                   <span className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-widest">AI Recognition Result</span>
                   <h2 className="text-4xl font-bold mt-1">{result.food}</h2>
                </div>
                <div className="text-right">
                   <div className="text-3xl font-bold text-green-400">{result.confidence}</div>
                   <div className="text-xs text-neutral-400 uppercase">Confidence</div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[var(--color-neutral-dark)] p-4 rounded-xl text-center">
                   <div className="text-2xl font-bold">{result.calories}</div>
                   <div className="text-xs text-neutral-400">Calories</div>
                </div>
                <div className="bg-[var(--color-neutral-dark)] p-4 rounded-xl text-center border border-[var(--color-primary)]/30">
                   <div className="text-2xl font-bold text-[var(--color-primary)]">{result.protein}</div>
                   <div className="text-xs text-neutral-400">Protein</div>
                </div>
             </div>

             <div className="bg-[var(--color-primary)]/10 p-5 rounded-xl border border-[var(--color-primary)]/20">
                <h4 className="font-bold text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                   <Activity size={18} /> EthioPlate Coach Advice
                </h4>
                <p className="text-neutral-300 leading-relaxed text-sm">
                  {result.coach}
                </p>
             </div>

             <button onClick={() => setResult(null)} className="mt-6 w-full py-3 bg-[var(--color-neutral-dark)] hover:bg-[var(--color-neutral-light)] rounded-xl font-medium transition text-sm">
                Scan Another Meal
             </button>
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}


// --- Main Dashboard Component ---

export default function GurshaDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [studentMode, setStudentMode] = useState(false);

  const sidebarItems = [
    { name: "Dashboard", icon: <Home size={20} /> },
    { name: "Scan Meal", icon: <Scan size={20} /> },
    { name: "Diseases", icon: <HeartPulse size={20} /> },
    { name: "Restaurants", icon: <Map size={20} /> },
    { name: "Goals", icon: <Target size={20} /> },
    { name: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="h-screen bg-background flex flex-col md:flex-row text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-[var(--color-card-border)] p-6 flex flex-col gap-8 hidden md:flex shrink-0">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Gursha Logo" className="w-10 h-10 rounded-full shadow-glow" />
          <h1 className="text-2xl font-bold tracking-tight">Gursha</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {sidebarItems.map((item) => (
            <button 
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition cursor-pointer ${
                activeTab === item.name 
                ? "bg-[var(--color-card)] text-[var(--color-primary)] border border-[var(--color-card-border)]" 
                : "text-neutral-400 hover:text-white hover:bg-[var(--color-neutral-dark)]"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </div>
              {activeTab === item.name && <ChevronRight size={16} />}
            </button>
          ))}
        </nav>
        
        {/* Student Mode Toggle Widget */}
        <div className={`p-4 rounded-xl text-sm transition-colors cursor-pointer border ${studentMode ? 'bg-blue-500/10 border-blue-500/30' : 'glass border-[var(--color-card-border)]'}`} onClick={() => setStudentMode(!studentMode)}>
          <div className="flex items-center justify-between mb-1">
            <div className={`flex items-center gap-2 ${studentMode ? 'text-blue-400' : 'text-[var(--color-secondary)]'}`}>
              <Zap size={16} />
              <span className="font-bold">Student Mode</span>
            </div>
            {/* Custom toggle switch */}
            <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${studentMode ? 'bg-blue-500' : 'bg-neutral-600'}`}>
               <div className={`w-3 h-3 bg-white rounded-full transition-transform ${studentMode ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>
          <p className="text-neutral-400 text-xs">Switch to exam week suggestions.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="flex justify-between items-center p-6 md:px-10 md:pt-10 shrink-0 border-b md:border-b-0 border-[var(--color-card-border)]">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              {activeTab === "Dashboard" ? "Good morning, Zakir" : activeTab}
            </h2>
            <p className="text-neutral-400 mt-1 hidden md:block text-sm">
              {activeTab === "Dashboard" ? "Here is your daily EthioPlate wellness balance." : `Explore your ${activeTab.toLowerCase()} insights.`}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="md:hidden font-bold flex items-center gap-2 text-white">
                <img src="/logo.png" alt="Gursha Logo" className="w-8 h-8 rounded-full shadow-glow" />
                Gursha
             </div>
             <button onClick={() => setActiveTab("Scan Meal")} className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-5 py-2.5 rounded-full font-medium transition shadow-glow flex items-center gap-2 cursor-pointer hidden md:flex">
               <Plus size={18} />
               <span>Log Meal</span>
             </button>
             <div className="w-10 h-10 bg-[var(--color-neutral-dark)] rounded-full border border-[var(--color-card-border)] flex items-center justify-center hidden md:flex">
                <span className="font-bold text-sm text-neutral-300">Z</span>
             </div>
          </div>
        </header>

        {/* Mobile Navigation Tabs (visible only on mobile) */}
        <div className="md:hidden flex overflow-x-auto p-4 gap-2 border-b border-[var(--color-card-border)] shrink-0 no-scrollbar">
          {sidebarItems.map((item) => (
            <button 
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition cursor-pointer ${
                activeTab === item.name 
                ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30" 
                : "bg-[var(--color-neutral-dark)] text-neutral-400"
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </div>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto p-6 md:px-10 pb-20 md:pb-10">
           <AnimatePresence mode="wait">
             {activeTab === "Dashboard" && <HomeView key="home" studentMode={studentMode} />}
             {activeTab === "Scan Meal" && <ScanMealView key="scan" />}
             {activeTab === "Diseases" && <DiseasesView key="diseases" />}
             {activeTab === "Restaurants" && <RestaurantsView key="restaurants" />}
             
             {/* Fallback for Goals and Settings */}
             {(activeTab === "Goals" || activeTab === "Settings") && (
               <motion.div key="fallback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center p-6">
                 <div className="w-20 h-20 bg-[var(--color-neutral-dark)] rounded-full flex items-center justify-center mb-6 text-neutral-500">
                   {activeTab === "Goals" ? <Target size={32} /> : <Settings size={32} />}
                 </div>
                 <h3 className="text-2xl font-bold mb-2">{activeTab}</h3>
                 <p className="text-neutral-400">This section is currently under development.</p>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
