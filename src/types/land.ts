export type LandRarity = "common" | "rare" | "epic" | "legendary" | "mythical";

export interface LandNFT {
  id: string;
  name: string;
  rarity: LandRarity;
  bonusMultiplier: number; // множитель для добычи
  slots: number; // количество майнеров, которых можно разместить
  image?: string; // иконка земли
  connectedMinerIds: string[]; // ID подключенных NFT
  description?: string;
}
