import { CSSProperties } from "react";

export interface HighlightData {
  id: number;
  url: string;
  text: string;
  createdAt: string;
  startParentPath: string;
  endParentPath: string;
  startOffset: number;
  endOffset: number;
  style: CSSProperties; // JSON.stringify(style object)
}
