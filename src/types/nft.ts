// types/nft.ts — v2.2.0 (добавлено miningPower)
export type NFTRarity = "common" | "rare" | "epic" | "legendary" | "mythical";

export interface NFTComponent {
  id: string;
  type: string;
  bonusPercent: number;
  rarity: NFTRarity;
}

export interface NFTMiner {
  id: string;
  rarity: NFTRarity;
  baseHashrate: number;
  components: NFTComponent[];
  level: number;
  landBonus: number; // 1.0 - 1.4
  ep: number; // 0 - 1000
  isPremium?: boolean;
  miningPower?: number; // ✅ добавлено поле
}
