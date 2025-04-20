// EPBattery3D.tsx — v1.2.0 (SSR + WebGL fallback с UI прогрессом)
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";

interface Props {
  ep: number;
  dailyGoal?: number;
  color?: string;
}

export default function EPBattery3D({ ep, dailyGoal = 1000, color = "#22c55e" }: Props) {
  const fill = Math.min(ep / dailyGoal, 1);

  const { scaleX } = useSpring({
    scaleX: fill,
    config: { tension: 160, friction: 18 },
  });

  const canUseWebGL = typeof window !== "undefined" && !!window.WebGLRenderingContext;

  if (!canUseWebGL) {
    return (
      <div className="w-full max-w-md mx-auto mt-4 px-4">
        <div className="relative w-full h-6 rounded-full bg-gray-700 overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-lime-500 transition-all duration-500 ease-out"
            style={{ width: `${fill * 100}%` }}
          />
        </div>
        <div className="mt-2 text-center text-sm font-medium text-white">
          {Math.round(ep)} / {dailyGoal} EP
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-20 max-w-md mx-auto">
      <Canvas orthographic camera={{ zoom: 60, position: [0, 0, 100] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 5]} intensity={1} />

        {/* Контур батареи */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.2, 0.5, 0.2]} />
          <meshStandardMaterial color="#333" wireframe opacity={0.4} transparent />
        </mesh>

        {/* Заполнение */}
        <a.mesh position={[fill - 1.1, 0, 0.01]} scale-x={scaleX}>
          <boxGeometry args={[2, 0.48, 0.15]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
        </a.mesh>

        {/* Текст */}
        <Html center>
          <span className="text-white text-sm font-bold drop-shadow-md">
            {Math.round(ep)} / {dailyGoal} EP
          </span>
        </Html>
      </Canvas>
    </div>
  );
}
