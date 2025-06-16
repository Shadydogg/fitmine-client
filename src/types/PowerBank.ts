export type PowerBank = {
  id: string;
  ep_amount: number;
  claimed_at?: string;
  used: boolean;
  used_at?: string | null;
  powerbank_type: "basic" | "rare" | "epic" | "event";
  source?: string;
};