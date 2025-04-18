export type LandRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary"
  | "mythical";

export interface LandNFT {
  id: string;
  telegramId: number; // 🔄 адаптировано из telegram_id
  name: string;
  rarity: LandRarity;
  bonusMultiplier: number; // 🔄 адаптировано из bonus_multiplier
  slots: number;
  connectedMinerIds: string[]; // 🔄 адаптировано из connected_miner_ids
  image?: string;
  description?: string;
  createdAt?: string; // 🔄 адаптировано из created_at
}
