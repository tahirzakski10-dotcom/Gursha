"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

function FoodModel({ url }: { url: string }) {
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

export default function FoodModelViewer({ modelUrl, dishName }: { modelUrl: string; dishName: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full aspect-square max-w-[400px] relative">
        <Canvas
          camera={{ position: [0, 2, 5], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-3, 3, -3]} intensity={0.4} />
          <pointLight position={[0, 3, 0]} intensity={0.5} color="#d95d39" />
          <Suspense fallback={null}>
            <FoodModel url={modelUrl} />
            <Environment preset="studio" />
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
      <div className="mt-4 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide">{dishName}</h3>
        <div className="mt-2 w-12 h-[2px] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] mx-auto rounded-full" />
      </div>
    </div>
  );
}
