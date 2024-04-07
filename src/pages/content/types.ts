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
