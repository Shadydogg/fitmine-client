export type PowerBank = {
  id: string;
  used: boolean;
  used_at?: string | null;
  claimed_at?: string;
  powerbank_type: "basic" | "rare" | "epic" | "event";
  source?: string;
  ep_amount: number;
  usedToday?: boolean;
};