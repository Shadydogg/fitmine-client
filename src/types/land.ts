export type LandRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary"
  | "mythical";

export interface LandNFT {
  id: string;
  telegram_id: number; // Telegram ID
  name: string;
  rarity: LandRarity;
  bonus_multiplier: number;
  slots: number;
  connected_miner_ids: string[];
  image?: string;
  description?: string;
  created_at?: string;
}
