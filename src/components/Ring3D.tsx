import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";
import { useMemo, Suspense, useEffect, useState } from "react";

interface Ring3DProps {
  ep: number;
  dailyGoal: number;
  color?: string;
  label?: string;
}

export default function Ring3D({ ep, dailyGoal = 1000, color = "#00DBDE", label }: Ring3DProps) {
  const progress = Math.min(ep / dailyGoal, 1);
  const [ready, setReady] = useState(false);
  const canUseWebGL = typeof window !== "undefined" && !!window.WebGLRenderingContext;

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.Telegram?.WebApp?.ready) {
        window.Telegram.WebApp.ready();
        console.log("📱 Telegram WebApp ready");
        setReady(true);
      } else {
        setTimeout(() => setReady(true), 400);
      }
    }
  }, []);

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      console.log("🎨 Ring3D Canvas context:", gl ? "✅ OK" : "❌ NULL");
    }
  }, [ready]);

  const { scale } = useSpring({ scale: progress, config: { tension: 100, friction: 20 } });

  const geometry = useMemo(() => {
    const segments = 64;
    const angle = Math.PI * 2 * progress;
    const positions: [number, number, number][] = [];
    for (let i = 0; i <= segments * progress; i++) {
      const theta = (i / segments) * angle;
      const x = Math.cos(theta) * 1;
      const y = Math.sin(theta) * 1;
      positions.push([x, y, 0]);
    }
    return positions;
  }, [progress]);

  return (
    <div className="w-32 h-32 flex flex-col items-center justify-center">
      {canUseWebGL && ready ? (
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[2, 2, 5]} intensity={1} />
          <Suspense fallback={null}>
            <a.group scale={scale.to((s) => [s, s, s])}>
              {geometry.map(([x, y, z], i) => (
                <mesh key={i} position={[x, y, z]}>
                  <sphereGeometry args={[0.03, 8, 8]} />
                  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
                </mesh>
              ))}
            </a.group>
            <OrbitControls enableZoom={false} enablePan={false} />
          </Suspense>
        </Canvas>
      ) : (
        <div className="w-24 h-24 flex items-center justify-center border-2 border-white/20 rounded-full">
          <span className="text-xs text-white">{Math.round(progress * 100)}%</span>
        </div>
      )}

      {label && (
        <div className="text-center text-sm text-white mt-2 font-medium">
          {label}: {Math.round(ep)} / {dailyGoal}
        </div>
      )}
    </div>
  );
}
