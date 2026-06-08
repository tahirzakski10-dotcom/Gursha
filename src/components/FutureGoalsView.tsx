"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Rocket, Target, Users, MapPin, Heart, Activity, TrendingUp, GraduationCap, Building, Stethoscope, Dumbbell, CheckCircle2, ArrowRight, Smartphone, LineChart, Utensils } from "lucide-react";

export default function FutureGoalsView() {
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-24 pb-10">
      
      {/* 1. HERO SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="text-center pt-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 mb-6">
          <Rocket size={16} /> <span className="text-sm font-bold tracking-wide uppercase">Future Goals</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
          Building Ethiopia's <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">Nutrition Intelligence Platform</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12">
          Gursha is evolving from an AI nutrition assistant into a nationwide preventive wellness ecosystem.
        </p>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: <Target />, label: "Target Users", value: "1M+" },
            { icon: <Stethoscope />, label: "Healthcare", value: "100+" },
            { icon: <Dumbbell />, label: "Fitness", value: "50+" },
            { icon: <Utensils />, label: "Restaurants", value: "500+" },
            { icon: <GraduationCap />, label: "Education", value: "200+" },
            { icon: <MapPin />, label: "Regions", value: "Nationwide" },
          ].map((kpi, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center border-t border-[var(--color-card-border)] hover:border-[var(--color-primary)]/50 transition">
              <div className="text-[var(--color-primary)] mb-2 opacity-80">{kpi.icon}</div>
              <div className="text-xl font-bold mb-1">{kpi.value}</div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider">{kpi.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 2. WHY NOW? */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Activity className="text-[var(--color-primary)]" /> Why Now?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { title: "Rising Diabetes", icon: <TrendingUp className="text-red-400" /> },
            { title: "Rising Hypertension", icon: <Heart className="text-red-400" /> },
            { title: "Wellness Awareness", icon: <LineChart className="text-green-400" /> },
            { title: "Smartphone Adoption", icon: <Smartphone className="text-blue-400" /> },
            { title: "No Local Digital Tools", icon: <Activity className="text-orange-400" /> }
          ].map((item, i) => (
            <motion.div key={i} variants={itemVariants} className="glass p-5 rounded-2xl text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[var(--color-neutral-dark)] flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-sm text-neutral-300">{item.title}</h3>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 3. CURRENT MVP STAGE */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <CheckCircle2 className="text-[var(--color-secondary)]" /> MVP Stage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/10 blur-3xl rounded-full" />
            <h3 className="text-xl font-bold mb-6 text-[var(--color-primary)]">Current Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Ethiopian Food Recognition", "Meal Analysis", "Nutrition Scoring", 
                "AI Recommendations", "Student Mode", "Disease Awareness", 
                "Restaurant Recommendations", "Daily & Weekly Reports"
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={12} className="text-green-400" />
                  </div>
                  <span className="text-sm text-neutral-300">{feat}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-[var(--color-card-border)] flex justify-between items-center">
              <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Status</span>
              <span className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 font-bold text-sm border border-green-500/20">MVP Ready</span>
            </div>
          </div>
          
          <div className="glass p-8 rounded-3xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
             <h3 className="text-xl font-bold mb-6 text-blue-400">Target Users</h3>
             <div className="space-y-4">
                {[
                  { name: "Students", icon: <GraduationCap />, pct: 80 },
                  { name: "Young Professionals", icon: <Building />, pct: 60 },
                  { name: "Fitness Enthusiasts", icon: <Dumbbell />, pct: 50 },
                  { name: "Families", icon: <Users />, pct: 30 }
                ].map((user, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center gap-2 text-neutral-300">{user.icon} {user.name}</span>
                    </div>
                    <div className="h-2 w-full bg-[var(--color-neutral-dark)] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${user.pct}%` }} transition={{ duration: 1, delay: i * 0.2 }} className="h-full bg-blue-500" />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </motion.section>

      {/* 4. REVENUE GENERATION */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <LineChart className="text-green-400" /> Revenue Generation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Premium Subscription", desc: "Unlimited scans, AI Coach, and Advanced Reports.", icon: <Rocket />, color: "from-[var(--color-primary)] to-[var(--color-secondary)]", rev: 60 },
            { title: "Schools & Universities", desc: "Student wellness dashboards and API integrations.", icon: <GraduationCap />, color: "from-blue-500 to-cyan-400", rev: 40 },
            { title: "Clinics", desc: "Patient nutrition monitoring portals.", icon: <Stethoscope />, color: "from-green-500 to-emerald-400", rev: 30 },
            { title: "Gyms", desc: "Athlete meal tracking and performance data.", icon: <Dumbbell />, color: "from-purple-500 to-pink-400", rev: 20, link: "/partnership" },
            { title: "Restaurants", desc: "Sponsored healthy meal listings.", icon: <Utensils />, color: "from-orange-500 to-yellow-400", rev: 50 },
            { title: "Corporate Wellness", desc: "Employee health programs.", icon: <Building />, color: "from-indigo-500 to-blue-400", rev: 30 }
          ].map((stream, i) => (
            stream.link ? (
              <Link href={stream.link} key={i} className="block group hover:scale-[1.02] transition-transform">
                <motion.div variants={itemVariants} className="glass p-6 rounded-3xl relative overflow-hidden group-hover:border-neutral-400 transition">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stream.color} flex items-center justify-center text-white shadow-lg`}>
                      {stream.icon}
                    </div>
                    <h3 className="font-bold text-lg leading-tight">{stream.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-400 mb-6">{stream.desc}</p>
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs text-neutral-500 mb-1">
                      <span>Growth Potential</span>
                    </div>
                    <div className="h-1.5 w-full bg-[var(--color-neutral-dark)] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${stream.rev}%` }} transition={{ duration: 1, delay: 0.5 }} className={`h-full bg-gradient-to-r ${stream.color}`} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ) : (
              <motion.div key={i} variants={itemVariants} className="glass p-6 rounded-3xl relative overflow-hidden group hover:border-neutral-400 transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stream.color} flex items-center justify-center text-white shadow-lg`}>
                    {stream.icon}
                  </div>
                  <h3 className="font-bold text-lg leading-tight">{stream.title}</h3>
                </div>
                <p className="text-sm text-neutral-400 mb-6">{stream.desc}</p>
                <div className="mt-auto">
                  <div className="flex justify-between text-xs text-neutral-500 mb-1">
                    <span>Growth Potential</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--color-neutral-dark)] rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${stream.rev}%` }} transition={{ duration: 1, delay: 0.5 }} className={`h-full bg-gradient-to-r ${stream.color}`} />
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </div>
      </motion.section>

      {/* 5. PARTNERSHIP STRATEGY (NODE GRAPH) */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Partnership Strategy</h2>
          <p className="text-neutral-400 inline-block px-4 py-1.5 rounded-full border border-neutral-600 bg-neutral-800/50 text-sm">Potential Future Partners</p>
        </div>
        
        <div className="relative w-full max-w-4xl mx-auto py-12">
          {/* Abstract SVG Connectors */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
             <path d="M50 50 L20 25" stroke="white" strokeWidth="0.5" strokeDasharray="2,2" />
             <path d="M50 50 L80 25" stroke="white" strokeWidth="0.5" strokeDasharray="2,2" />
             <path d="M50 50 L20 75" stroke="white" strokeWidth="0.5" strokeDasharray="2,2" />
             <path d="M50 50 L80 75" stroke="white" strokeWidth="0.5" strokeDasharray="2,2" />
          </svg>

          {/* Center Node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div animate={{ boxShadow: ["0 0 0px #d95d39", "0 0 40px #d95d39", "0 0 0px #d95d39"] }} transition={{ duration: 3, repeat: Infinity }} className="w-24 h-24 rounded-full bg-[var(--color-primary)] flex items-center justify-center shadow-glow border-4 border-black">
              <span className="font-black text-xl text-white">GURSHA</span>
            </motion.div>
          </div>

          {/* Nodes Grid */}
          <div className="grid grid-cols-2 gap-y-32 md:gap-y-48 relative z-0">
            
            {/* Healthcare */}
            <motion.div variants={itemVariants} className="text-center">
               <div className="inline-block p-4 rounded-2xl glass border-t-2 border-green-500 mb-4">
                  <h3 className="font-bold text-green-400 mb-2 flex items-center gap-2 justify-center"><Stethoscope size={16}/> Healthcare</h3>
                  <ul className="text-sm text-neutral-300 space-y-1">
                    <li>Clinics</li><li>Hospitals</li><li>Nutrition Centers</li>
                  </ul>
               </div>
            </motion.div>

            {/* Fitness */}
            <motion.div variants={itemVariants} className="text-center">
               <div className="inline-block p-4 rounded-2xl glass border-t-2 border-purple-500 mb-4">
                  <h3 className="font-bold text-purple-400 mb-2 flex items-center gap-2 justify-center"><Dumbbell size={16}/> Fitness</h3>
                  <ul className="text-sm text-neutral-300 space-y-1">
                    <li>Ethio Dance Fitness</li><li>Gyms</li><li>Wellness Centers</li>
                  </ul>
               </div>
            </motion.div>

            {/* Education */}
            <motion.div variants={itemVariants} className="text-center">
               <div className="inline-block p-4 rounded-2xl glass border-t-2 border-blue-500 mt-4">
                  <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2 justify-center"><GraduationCap size={16}/> Education</h3>
                  <ul className="text-sm text-neutral-300 space-y-1">
                    <li>Universities</li><li>Schools</li>
                  </ul>
               </div>
            </motion.div>

            {/* Food */}
            <motion.div variants={itemVariants} className="text-center">
               <div className="inline-block p-4 rounded-2xl glass border-t-2 border-orange-500 mt-4">
                  <h3 className="font-bold text-orange-400 mb-2 flex items-center gap-2 justify-center"><Utensils size={16}/> Food Ecosystem</h3>
                  <ul className="text-sm text-neutral-300 space-y-1">
                    <li>Restaurants</li><li>Cafés</li><li>Healthy Food Brands</li>
                  </ul>
               </div>
            </motion.div>

          </div>
        </div>
      </motion.section>

      {/* 6. REGIONAL EXPANSION */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <MapPin className="text-blue-400" /> Regional Expansion
        </h2>
        <div className="glass p-8 md:p-12 rounded-3xl overflow-x-auto no-scrollbar">
          <div className="flex items-center min-w-[800px] justify-between relative">
             <div className="absolute top-1/2 left-0 w-full h-1 bg-[var(--color-neutral-dark)] -translate-y-1/2 z-0" />
             <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 2, ease: "easeInOut" }} className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-blue-500 -translate-y-1/2 z-0" />
             
             {[
               { city: "Addis Ababa", phase: "Launch" },
               { city: "Adama", phase: "Phase 1" },
               { city: "Hawassa", phase: "Phase 2" },
               { city: "Bahir Dar", phase: "Phase 3" },
               { city: "Dire Dawa", phase: "Phase 4" },
               { city: "Jimma & Mekelle", phase: "Phase 5" }
             ].map((node, i) => (
               <div key={i} className="relative z-10 flex flex-col items-center">
                 <div className="text-xs text-[var(--color-secondary)] font-bold mb-4 uppercase tracking-widest">{node.phase}</div>
                 <div className="w-6 h-6 rounded-full bg-black border-4 border-[var(--color-primary)] mb-4" />
                 <div className="font-bold text-sm whitespace-nowrap">{node.city}</div>
               </div>
             ))}
          </div>
        </div>
      </motion.section>

      {/* 7. SOCIAL IMPACT */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Heart className="text-pink-400" /> Social Impact Goals
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {["Nutrition Awareness", "Disease Prevention", "Student Wellness", "Mental Wellbeing", "Women's Wellness", "Healthy Communities"].map((impact, i) => (
            <motion.div key={i} variants={itemVariants} className="glass p-4 rounded-xl text-center border-b-2 border-pink-500/50">
              <span className="font-medium text-sm text-neutral-200">{impact}</span>
            </motion.div>
          ))}
        </div>
        
        <div className="glass p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 bg-pink-500/5 border-pink-500/20">
          <div>
            <h3 className="text-xl font-bold mb-2">Projected Impact Timeline</h3>
            <p className="text-neutral-400 text-sm">Scaling nationwide to improve public health.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {["10k", "50k", "250k", "1M+"].map((num, i) => (
               <div key={i} className="flex items-center gap-2">
                 <div className="text-2xl font-black text-pink-400">{num}</div>
                 {i < 3 && <ArrowRight className="text-neutral-600" size={16} />}
               </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 8. FUTURE ROADMAP */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Rocket className="text-yellow-400" /> Future Roadmap
        </h2>
        <div className="glass p-8 md:p-12 rounded-3xl">
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--color-primary)] before:to-transparent">
            {[
              { year: "2026", title: "Launch MVP", desc: "Ethiopian food recognition, scoring, and initial user adoption." },
              { year: "2027", title: "B2B Integrations", desc: "Clinic portals and Gym integrations." },
              { year: "2028", title: "Advanced Modules", desc: "Women's Wellness Module and personalized AI Health Coach." },
              { year: "2029", title: "Ecosystem Expansion", desc: "Wearable integration and regional language support." },
              { year: "2030", title: "National Platform", desc: "The definitive National Nutrition Intelligence Platform." }
            ].map((milestone, i) => (
              <motion.div key={i} variants={itemVariants} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-black bg-[var(--color-primary)] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-black font-black text-xs z-10">
                  {milestone.year}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-6 rounded-2xl border hover:border-[var(--color-primary)]/50 transition">
                  <h4 className="font-bold text-lg mb-2 text-[var(--color-primary)]">{milestone.title}</h4>
                  <p className="text-sm text-neutral-400">{milestone.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 9. VISION */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
        className="pt-20 pb-10 text-center relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-primary)]/10 blur-3xl -z-10" />
        <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight max-w-4xl mx-auto text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400">
          "We envision a future where every Ethiopian can understand the health impact of their meals before disease develops."
        </h2>
        <div className="inline-block px-8 py-4 glass rounded-full border-t border-[var(--color-primary)]/50 shadow-glow">
          <p className="font-bold tracking-wide text-sm md:text-base">
            Gursha transforms Ethiopian food into actionable wellness intelligence.
          </p>
        </div>
      </motion.section>

    </div>
  );
}
