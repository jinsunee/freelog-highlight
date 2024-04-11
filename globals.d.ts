// globals.d.ts 또는 다른 *.d.ts 파일
declare global {
  interface Window {
    showModalFromHighlight: (input: {
      position: { x: number; y: number };
      id: number;
    }) => void;
  }
}

export {};
