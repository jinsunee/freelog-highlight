import { useEffect, useState } from "react";
import { RangeParams } from "./types";
import { highlightRange } from "./utils";

export default function App() {
  const [selectedItem, setSelectedItem] = useState<RangeParams>();

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const startNode = range.startContainer;
    const startOffset = range.startOffset;
    const endNode = range.endContainer;
    const endOffset = range.endOffset;

    setSelectedItem({
      start: { node: startNode, offset: startOffset },
      end: { node: endNode, offset: endOffset },
    });
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
    };
  }, []);

  useEffect(() => {
    if (selectedItem) {
      highlightRange(selectedItem);
    }
  }, [selectedItem]);

  return <></>;
}
