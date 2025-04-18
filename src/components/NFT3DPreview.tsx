import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const MinerModel = () => {
  const { scene } = useGLTF("/3d/futuristic_miner.glb");
  return <primitive object={scene} scale={1.5} />;
};

const NFT3DPreview = () => {
  return (
    <div className="w-model h-model rounded-xl overflow-hidden bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700 shadow-inner animate-nftReveal">
      <Canvas camera={{ position: [2.5, 2.5, 2.5], fov: 40 }}>
        {/* 💡 Illuvium-style lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#00ffff" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={0.5} intensity={0.6} castShadow />

        <Suspense fallback={null}>
          <MinerModel />
        </Suspense>

        {/* 🌀 Swipe interaction (drag to rotate) */}
        <OrbitControls enableZoom={false} enableRotate={true} autoRotate={false} />
      </Canvas>
    </div>
  );
};

export default NFT3DPreview;
