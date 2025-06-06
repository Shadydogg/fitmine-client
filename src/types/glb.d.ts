// 📄 src/types/glb.d.ts

// Расширение для GLB
declare module "*.glb" {
  const src: string;
  export default src;
}

// Расширение глобального объекта window
export {};

declare global {
  interface Window {
    needGoogleReauth?: boolean;
  }
}
