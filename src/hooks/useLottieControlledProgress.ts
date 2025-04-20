// src/hooks/useLottieControlledProgress.ts — v1.0.0
import { useEffect } from "react";

export default function useLottieControlledProgress(
  ref: React.RefObject<any>,
  percentage: number,
  totalFrames: number = 100
) {
  useEffect(() => {
    if (!ref.current || typeof ref.current.goToAndStop !== "function") return;
    const clamped = Math.max(0, Math.min(percentage, 1));
    const frame = Math.floor(clamped * totalFrames);
    ref.current.goToAndStop(frame, true);
  }, [ref, percentage, totalFrames]);
}
