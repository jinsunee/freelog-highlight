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

export interface Position {
  x: number;
  y: number;
}

export interface HighlightParams {
  node: Node;
  startOffset: number;
  endOffset: number;
}

export interface HighlightRangeItemData {
  parentNode: Node;
  offset: number;
}

// TODO: 지워질 예정
export interface HighlightRangeData {
  start: HighlightRangeItemData;
  end: HighlightRangeItemData;
  text: string;
}

export type RealNodeData = {
  node: Node;
  offset: number;
};

export type RealNodeRangeData = {
  start: RealNodeData;
  end: RealNodeData;
};

export interface ButtonPosition {
  left: number;
  top: number;
}
