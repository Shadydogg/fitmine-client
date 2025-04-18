/// <reference path="../types/nft.ts" /> 

import React from "react";
import { useNFTInventory } from "../hooks/useNFTInventory";
import NFTCard from "../components/NFTCard";

const NFTPage: React.FC = () => {
  const { nfts, loading, error } = useNFTInventory();

  if (loading) return <div className="p-4 text-center text-zinc-400 animate-pulse">Loading NFT miners...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading NFTs</div>;

  return (
    <div className="p-4 animate-nftReveal">
      <h1 className="text-2xl font-bold mb-4 text-white">Your NFT Miners</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {nfts.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>
    </div>
  );
};

export default NFTPage;
