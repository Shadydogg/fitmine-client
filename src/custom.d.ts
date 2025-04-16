// ✅ Импорт PNG-изображений как строка
declare module '*.png' {
  const value: string;
  export default value;
}

// ✅ Типизация внешнего модуля canvas-confetti
declare module 'canvas-confetti' {
  const confetti: any;
  export default confetti;
}
