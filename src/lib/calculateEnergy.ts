// calculateEnergy.ts — v1.1.0
interface EnergyInput {
  steps: number;
  calories: number;
  activeMinutes: number;
  hasNFT?: boolean;
  isPremium?: boolean;
  isEarlyAccess?: boolean;
}

export function calculateEnergy({
  steps,
  calories,
  activeMinutes,
  hasNFT = false,
  isPremium = false,
  isEarlyAccess = false
}: EnergyInput): number {
  // 🔢 Нормализованные значения
  const stepScore = Math.min(steps / 10000, 1);
  const calScore = Math.min(calories / 2000, 1);
  const minScore = Math.min(activeMinutes / 30, 1);

  // ⚖️ Весовые коэффициенты
  const weights = {
    steps: 0.4,
    calories: 0.3,
    minutes: 0.3,
  } as const;

  const baseEnergy = Number(
    (stepScore * weights.steps + calScore * weights.calories + minScore * weights.minutes)
      .toFixed(2)
  );

  // 💎 Бонусы за NFT, Premium, Early
  const bonus = 
    (hasNFT ? 0.10 : 0) +
    (isPremium ? 0.15 : 0) +
    (isEarlyAccess ? 0.10 : 0);

  let total = Math.floor((baseEnergy + bonus) * 100);

  // 🔒 Ограничение максимума
  return Math.min(total, 100);
}
