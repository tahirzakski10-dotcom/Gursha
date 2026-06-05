"use client";

import { useRef, useState, Suspense } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const beats = [
  {
    id: "beat-a",
    title: "Your Ethiopian meals, decoded.",
    subtitle: "See what is inside every plate, the local way.",
    icon: "🍽️",
    model: "/models/tibs.glb",
    dishName: "Tibs",
  },
  {
    id: "beat-b",
    title: "Scan a meal.",
    subtitle: "Upload a photo and Gursha identifies the dish and estimates nutrients.",
    icon: "📸",
    model: "/models/bayaynetu.glb",
    dishName: "Bayaynetu",
  },
  {
    id: "beat-c",
    title: "Improve the plate.",
    subtitle: "Get budget-friendly Ethiopian suggestions to increase protein, fiber, or energy.",
    icon: "✨",
    model: "/models/injera.glb",
    dishName: "Injera",
  },
  {
    id: "beat-d",
    title: "Built for wellness.",
    subtitle: "Track your food, hydration, sleep, and daily balance in one place.",
    icon: "🌿",
    model: "/models/kitfo.glb",
    dishName: "Kitfo",
  },
];

// Preload models for smooth switching (Next.js public folder)
beats.forEach((b) => useGLTF.preload(b.model));

function RotatingModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={ref} scale={2}>
      <primitive object={scene} />
    </group>
  );
}

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

        {/* Right Side: Single WebGL Canvas for Performance */}
        <div className="flex-1 w-full h-[300px] md:h-full max-h-[500px] md:max-h-full pointer-events-auto mt-8 md:mt-0 flex flex-col items-center justify-center relative">
          
          {/* Mobile Text (Shows up behind or above model depending on layout) */}
          <div className="md:hidden absolute inset-0 pointer-events-none z-20 pt-10">
            {beats.map((beat, index) => (
              <BeatText key={beat.id} beat={beat} index={index} progress={scrollYProgress} />
            ))}
          </div>

          <div className="w-full aspect-square max-w-[400px] md:max-w-[500px] relative z-10">
            <Canvas
              camera={{ position: [0, 2, 5], fov: 40 }}
              gl={{ antialias: false, alpha: true, powerPreference: "low-power" }} // Optimized for low end / avoiding crashes
              dpr={[1, 1.5]} // Restrict pixel ratio to prevent GPU spikes
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={1.2} />
              <directionalLight position={[-3, 3, -3]} intensity={0.4} />
              <pointLight position={[0, 3, 0]} intensity={0.5} color="#d95d39" />
              
              <Suspense fallback={null}>
                <RotatingModel url={beats[activeIndex].model} />
              </Suspense>
              
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={false}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 2.2}
              />
            </Canvas>

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
