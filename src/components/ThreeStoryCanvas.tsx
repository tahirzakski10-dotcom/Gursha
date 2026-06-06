"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";

// We removed the heavy preload to prevent blocking the app
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-md rounded-2xl border border-[var(--color-primary)]/30 text-white min-w-[150px]">
        <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="font-bold text-sm tracking-widest">{progress.toFixed(0)}% LOADED</p>
      </div>
    </Html>
  );
}

function RotatingModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  // Clone the scene so each slide gets its own copy —
  // prevents crashes when React unmounts/remounts across slides
  const clonedScene = React.useMemo(() => scene.clone(true), [scene]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={ref} scale={2}>
      <primitive object={clonedScene} />
    </group>
  );
}

interface ThreeStoryCanvasProps {
  modelUrl: string;
}

export default function ThreeStoryCanvas({ modelUrl }: ThreeStoryCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 40 }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-3, 3, -3]} intensity={0.4} />
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#d95d39" />

      <Suspense fallback={<Loader />}>
        <RotatingModel url={modelUrl} />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}

