export interface HighlightParams {
  node: Node;
  startOffset: number;
  endOffset: number;
}

export interface RangeParams {
  start: { node: Node; offset: number };
  end: { node: Node; offset: number };
}

export interface ButtonPosition {
  left: number;
  top: number;
}
