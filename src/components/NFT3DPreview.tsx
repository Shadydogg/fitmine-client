// 📄 src/components/NFT3DPreview.tsx — v1.3.0
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

const MinerModel = () => {
  const { scene } = useGLTF("/3d/futuristic_miner.glb");
  return <primitive object={scene} scale={1.5} />;
};

const NFT3DPreview = () => {
  return (
    <div className="w-model h-model rounded-xl overflow-hidden bg-nft-glow shadow-3d-light border border-zinc-700 animate-nftReveal">
      <Canvas camera={{ position: [2.5, 2.5, 2.5] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.9} shadows={false}>
            <MinerModel />
          </Stage>
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
      </Canvas>
    </div>
  );
};

export default NFT3DPreview;
