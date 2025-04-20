// EPBattery3D.tsx — v1.0.0 (3D батарейка для EP с анимацией)
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
            {ep} / {dailyGoal} EP
          </span>
        </Html>
      </Canvas>
    </div>
  );
}
