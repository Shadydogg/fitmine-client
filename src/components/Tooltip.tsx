import { useState, ReactNode } from "react";

interface Props {
  content: string;
  children: ReactNode;
}

export default function Tooltip({ content, children }: Props) {
  const [visible, setVisible] = useState(false);

  const toggle = () => setVisible((v) => !v);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <div
      className="relative flex flex-col items-center group select-none"
      onMouseEnter={show}
      onMouseLeave={hide}
      onTouchStart={toggle}
      onClick={toggle}
    >
      {children}

      {visible && (
        <div
          className="absolute bottom-full mb-2 px-3 py-1 text-xs text-white backdrop-blur-md rounded-xl border border-white/10 bg-white/10 shadow-xl z-50 animate-fade-in"
          style={{
            transform: "translateY(-4px)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
