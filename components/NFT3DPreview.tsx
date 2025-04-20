import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { motion } from "framer-motion";

const MinerModel = () => {
  const { scene } = useGLTF("/3d/futuristic_miner.glb");
  return <primitive object={scene} scale={1.5} />;
};

useGLTF.preload("/3d/futuristic_miner.glb");

const NFT3DPreview = () => {
  return (
    <motion.div
      className="relative w-full h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700 shadow-inner"
      whileHover={{ scale: 1.02, rotateX: -1, rotateY: 2 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [2.5, 2.5, 2.5], fov: 35 }}
        shadows
      >
        {/* 💡 Illuvium-style lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#00ffff" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={0.5}
          intensity={0.6}
          castShadow
        />

        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="gray" />
            </mesh>
          }
        >
          <MinerModel />
        </Suspense>

        {/* 🌀 Swipe / rotate */}
        <OrbitControls enableZoom={false} autoRotate={false} />
      </Canvas>
    </motion.div>
  );
};

export default NFT3DPreview;
