import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const waves = Array.from({ length: 5 }, (_, i) => ({
      r: 100 + i * 60,
      alpha: 0.06 + i * 0.035,
      colorShift: i * 60,
    }));

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      const cx = w * mouse.current.x;
      const cy = h * mouse.current.y;

      for (const wave of waves) {
        const r = wave.r + Math.sin(frame * 0.03) * 10;

        // RGB-волны с hue shift
        const hue = (frame + wave.colorShift) % 360;
        const color = `hsla(${hue}, 100%, 60%, ${wave.alpha})`;

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      frame++;
      requestAnimationFrame(animate);
    };

    animate();

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX =
        e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
      const clientY =
        e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
      mouse.current.x = clientX / window.innerWidth;
      mouse.current.y = clientY / window.innerHeight;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none transition-opacity duration-300"
    />
  );
}
