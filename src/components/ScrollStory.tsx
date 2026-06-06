"use client";

import React, { useRef, useState, useEffect, Component, ReactNode } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const beats = [
  {
    id: "beat-a",
    title: "Your Ethiopian meals, decoded.",
    subtitle: "See what is inside every plate, the local way.",
    icon: "🍽️",
    model: "/models/beef_bowl.glb",
    dishName: "Tibs",
    emoji: "🥩",
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: "beat-b",
    title: "Scan a meal.",
    subtitle: "Upload a photo and Gursha identifies the dish and estimates nutrients.",
    icon: "📸",
    model: "/models/thali.glb",
    dishName: "Beyayenet",
    emoji: "🥗",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: "beat-c",
    title: "Improve the plate.",
    subtitle: "Get budget-friendly Ethiopian suggestions to increase protein, fiber, or energy.",
    icon: "✨",
    model: "/models/red_pepper.glb",
    dishName: "Kitfo",
    emoji: "🌶️",
    gradient: "from-amber-500 to-yellow-600",
  },
  {
    id: "beat-d",
    title: "Built for wellness.",
    subtitle: "Track your food, hydration, sleep, and daily balance in one place.",
    icon: "🌿",
    model: "/models/chocolate_wafer.glb",
    dishName: "Injera",
    emoji: "🍫",
    gradient: "from-rose-500 to-pink-600",
  },
];


// Detect WebGL support
function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

class ErrorBoundary extends Component<{ children: ReactNode, fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error in ThreeStoryCanvas:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Beautiful animated fallback when WebGL is unavailable
function FallbackDishDisplay({ beat }: { beat: typeof beats[0] }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={beat.id}
        initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full h-full flex items-center justify-center"
      >
        <div className="relative">
          {/* Outer glow ring */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 30px rgba(217, 93, 57, 0.2)",
                "0 0 60px rgba(217, 93, 57, 0.4)",
                "0 0 30px rgba(217, 93, 57, 0.2)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center"
            style={{ background: "radial-gradient(circle, rgba(217,93,57,0.15) 0%, transparent 70%)" }}
          >
            {/* Inner glass card */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className={`w-48 h-48 md:w-60 md:h-60 rounded-3xl bg-gradient-to-br ${beat.gradient} flex items-center justify-center shadow-2xl relative overflow-hidden`}
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{ x: [-200, 200] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
              <span className="text-8xl md:text-9xl drop-shadow-lg relative z-10">{beat.emoji}</span>
            </motion.div>
          </motion.div>

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[var(--color-primary)]"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
          
          {/* WebGL friendly explanation badge */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-80 text-center bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 shadow-2xl pointer-events-auto">
            <p className="text-xs text-neutral-300 font-medium">
              3D Model requires WebGL
            </p>
            <p className="text-[10px] text-neutral-400 mt-1 leading-normal">
              If you are viewing inside the editor preview, please open <code className="text-[var(--color-primary)] font-mono">http://localhost:3000</code> in your regular desktop browser (Chrome/Edge) to view the interactive 3D models.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Dynamically import ThreeStoryCanvas to ensure no SSR issues and safe loading
const ThreeStoryCanvas = dynamic(() => import("./ThreeStoryCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

function BeatText({ beat, index, progress }: { beat: typeof beats[0], index: number, progress: any }) {
  const start = index * 0.25;
  const peak = start + 0.125;
  const end = start + 0.25;

  const opacity = useTransform(progress, [start, peak, end], [0, 1, 0]);
  const textY = useTransform(progress, [start, peak, end], [60, 0, -60]);

  return (
    <motion.div
      style={{ opacity, y: textY, position: "absolute" }}
      className="inset-0 flex flex-col items-center md:items-start justify-center text-center md:text-left md:pr-8 z-10 w-full"
    >
      <div className="text-5xl md:text-6xl mb-6">{beat.icon}</div>
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 md:mb-6">
        {beat.title}
      </h2>
      <p className="text-lg md:text-xl lg:text-2xl text-neutral-300 max-w-xl">
        {beat.subtitle}
      </p>
    </motion.div>
  );
}

export default function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isWebGLAvailable, setIsWebGLAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setIsWebGLAvailable(detectWebGL());
  }, []);

  // Track scroll to determine which model is active
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let index = Math.floor(latest * 4);
    if (index > 3) index = 3;
    if (index < 0) index = 0;
    setActiveIndex(index);
  });

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-background w-full">
      <div className="sticky top-0 h-screen w-full flex overflow-hidden px-6 md:px-16 pointer-events-none">
        
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-primary)] rounded-full blur-[150px] opacity-10 pointer-events-none" />

        {/* Left Side: Text container */}
        <div className="flex-1 relative hidden md:block">
          {beats.map((beat, index) => (
            <BeatText key={beat.id} beat={beat} index={index} progress={scrollYProgress} />
          ))}
        </div>

        {/* Right Side: 3D Canvas or Animated Fallback */}
        <div className="flex-1 w-full h-[300px] md:h-full max-h-[500px] md:max-h-full pointer-events-auto mt-8 md:mt-0 flex flex-col items-center justify-center relative">
          
          {/* Mobile Text (Shows up behind or above model depending on layout) */}
          <div className="md:hidden absolute inset-0 pointer-events-none z-20 pt-10">
            {beats.map((beat, index) => (
              <BeatText key={beat.id} beat={beat} index={index} progress={scrollYProgress} />
            ))}
          </div>

          <div className="w-full aspect-square max-w-[400px] md:max-w-[500px] relative z-10">
            {isWebGLAvailable === null ? (
              <div className="flex items-center justify-center w-full h-full">
                <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : isWebGLAvailable ? (
              <ErrorBoundary fallback={<FallbackDishDisplay beat={beats[activeIndex]} />}>
                <ThreeStoryCanvas modelUrl={beats[activeIndex].model} />
              </ErrorBoundary>
            ) : (
              <FallbackDishDisplay beat={beats[activeIndex]} />
            )}

            {/* Glow ring underneath the model */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-12 bg-[var(--color-primary)] rounded-full blur-[40px] opacity-20 pointer-events-none" />
          </div>
          
          {/* Dish name label */}
          <div className="mt-4 text-center z-10 bg-background/50 backdrop-blur-md px-6 py-2 rounded-full border border-[var(--color-card-border)] md:border-none md:bg-transparent md:backdrop-blur-none">
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
              {beats[activeIndex].dishName}
            </h3>
            <div className="mt-2 w-12 h-[2px] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] mx-auto rounded-full" />
          </div>

        </div>

      </div>
    </div>
  );
}
