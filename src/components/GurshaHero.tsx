"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const FRAME_COUNT = 140;

export default function GurshaHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      // ezgif-frame-001.jpg format
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `/hero-frames/ezgif-frame-${paddedIndex}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          setImages(loadedImages);
        }
      };
      loadedImages.push(img);
    }
  }, []);

  // Frame index derived from scroll
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  useEffect(() => {
    return frameIndex.on("change", (latest) => {
      if (!canvasRef.current || images.length === 0) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const index = Math.round(latest);
      const img = images[index];
      if (img && img.complete) {
        // Draw image covering the canvas (like object-fit: cover)
        const canvas = canvasRef.current;
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height,
                      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
      }
    });
  }, [frameIndex, images]);

  // Initial render of first frame once loaded
  useEffect(() => {
    if (images.length > 0 && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const img = images[0];
        if(img.complete) {
           const canvas = canvasRef.current;
           const hRatio = canvas.width / img.width;
           const vRatio = canvas.height / img.height;
           const ratio = Math.max(hRatio, vRatio);
           const centerShift_x = (canvas.width - img.width * ratio) / 2;
           const centerShift_y = (canvas.height - img.height * ratio) / 2;
           ctx.drawImage(img, 0, 0, img.width, img.height,
                         centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        }
      }
    }
  }, [images]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-background w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Canvas for video frames */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/90" />

        {/* Logo */}
        <div className="absolute top-6 left-6 md:top-10 md:left-10 z-50 flex items-center gap-3">
           <img src="/logo.png" alt="Gursha Logo" className="w-12 h-12 md:w-16 md:h-16 rounded-full shadow-glow" />
           <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">Gursha</span>
        </div>

        <motion.div 
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
          >
            Eat Better. <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
              Understand Better.
            </span> <br className="md:hidden" />
            Live Better.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-xl md:text-2xl text-neutral-300 max-w-2xl mb-10"
          >
            Gursha turns Ethiopian meals into smart nutrition insights.
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="px-8 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium rounded-full transition-all shadow-glow hover:shadow-glow-strong text-lg"
            onClick={() => document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" })}
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
